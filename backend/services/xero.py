"""Xero accounting integration — OAuth 2.0 + data fetching with Redis caching."""

import hashlib
import json
import logging
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx

from config import settings
from services.mocks.xero_mock import (
    MOCK_ACCOUNTS_SUMMARY,
    MOCK_INVOICES,
    MOCK_MONTHLY_REVENUE,
    MOCK_TOP_CUSTOMERS,
)

logger = logging.getLogger(__name__)

XERO_BASE = "https://api.xero.com/api.xro/2.0"
XERO_IDENTITY = "https://api.xero.com/connections"
XERO_TOKEN_URL = "https://identity.xero.com/connect/token"
XERO_AUTH_URL = "https://login.xero.com/identity/connect/authorize"
XERO_SCOPES = "openid profile email accounting.transactions.read accounting.reports.read accounting.contacts.read offline_access"

_redis_client = None


def _get_redis():
    global _redis_client
    if _redis_client is None:
        import redis as redis_lib
        _redis_client = redis_lib.from_url(settings.redis_url, decode_responses=True)
    return _redis_client


def _cache_key(fn_name: str, **params) -> str:
    param_hash = hashlib.md5(json.dumps(params, sort_keys=True).encode()).hexdigest()[:8]
    return f"xero:{fn_name}:{param_hash}"


def _cache_get(key: str):
    try:
        r = _get_redis()
        raw = r.get(key)
        return json.loads(raw) if raw else None
    except Exception:
        return None


def _cache_set(key: str, data, ttl: int = 300):
    try:
        r = _get_redis()
        r.setex(key, ttl, json.dumps(data))
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Token storage (in-memory fallback — production uses Integration DB model)
# ---------------------------------------------------------------------------

_token_store: dict = {}


def _store_tokens(access_token: str, refresh_token: str | None, expires_in: int, tenant_id: str | None) -> None:
    _token_store["access_token"] = access_token
    _token_store["refresh_token"] = refresh_token
    _token_store["tenant_id"] = tenant_id
    _token_store["expires_at"] = (datetime.now(timezone.utc) + timedelta(seconds=expires_in - 60)).isoformat()


def _get_access_token() -> str | None:
    if not _token_store.get("access_token"):
        return None
    expires_at = datetime.fromisoformat(_token_store["expires_at"])
    if datetime.now(timezone.utc) >= expires_at:
        return None
    return _token_store["access_token"]


def is_connected() -> bool:
    return bool(_token_store.get("access_token")) and bool(_token_store.get("tenant_id"))


# ---------------------------------------------------------------------------
# OAuth helpers
# ---------------------------------------------------------------------------

def get_auth_url(redirect_uri: str) -> str:
    params = {
        "response_type": "code",
        "client_id": settings.xero_client_id,
        "redirect_uri": redirect_uri,
        "scope": XERO_SCOPES,
        "state": "trust_electric",
    }
    return f"{XERO_AUTH_URL}?{urlencode(params)}"


async def exchange_code(code: str, redirect_uri: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            XERO_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
            },
            auth=(settings.xero_client_id, settings.xero_client_secret),
        )
        resp.raise_for_status()
        tokens = resp.json()

    # Fetch tenant ID
    async with httpx.AsyncClient(headers={"Authorization": f"Bearer {tokens['access_token']}"}) as client:
        conn_resp = await client.get(XERO_IDENTITY)
        conn_resp.raise_for_status()
        connections = conn_resp.json()

    tenant_id = connections[0]["tenantId"] if connections else None
    _store_tokens(tokens["access_token"], tokens.get("refresh_token"), tokens.get("expires_in", 1800), tenant_id)
    return {"connected": True, "tenant_id": tenant_id}


async def _refresh_access_token() -> str | None:
    refresh_token = _token_store.get("refresh_token")
    if not refresh_token:
        return None
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                XERO_TOKEN_URL,
                data={"grant_type": "refresh_token", "refresh_token": refresh_token},
                auth=(settings.xero_client_id, settings.xero_client_secret),
            )
            resp.raise_for_status()
            tokens = resp.json()
        _store_tokens(tokens["access_token"], tokens.get("refresh_token"), tokens.get("expires_in", 1800), _token_store.get("tenant_id"))
        return tokens["access_token"]
    except Exception as exc:
        logger.error("Xero token refresh failed: %s", exc)
        return None


async def _xero_get(path: str, params: dict | None = None) -> dict | list:
    token = _get_access_token() or await _refresh_access_token()
    if not token:
        raise RuntimeError("Xero not authenticated")
    tenant_id = _token_store.get("tenant_id", "")
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{XERO_BASE}{path}",
            params=params,
            headers={
                "Authorization": f"Bearer {token}",
                "Xero-tenant-id": tenant_id,
                "Accept": "application/json",
            },
        )
        resp.raise_for_status()
        return resp.json()


# ---------------------------------------------------------------------------
# Data fetching (real + mock)
# ---------------------------------------------------------------------------

async def get_recent_invoices(days: int = 30) -> list[dict]:
    if settings.use_mock_data or not is_connected():
        return MOCK_INVOICES

    key = _cache_key("invoices", days=days)
    cached = _cache_get(key)
    if cached:
        return cached

    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%S")
    data = await _xero_get("/Invoices", params={"where": f"Date >= DateTime({cutoff[:10].replace('-', ',')})", "order": "Date DESC"})
    invoices = [
        {
            "invoice_number": inv.get("InvoiceNumber", ""),
            "contact_name": inv.get("Contact", {}).get("Name", ""),
            "status": inv.get("Status", ""),
            "date": inv.get("Date", ""),
            "due_date": inv.get("DueDate", ""),
            "amount_total": float(inv.get("Total", 0)),
            "amount_due": float(inv.get("AmountDue", 0)),
            "amount_paid": float(inv.get("AmountPaid", 0)),
        }
        for inv in data.get("Invoices", [])
    ]
    _cache_set(key, invoices)
    return invoices


async def get_outstanding_balance() -> dict:
    invoices = await get_recent_invoices(90)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    unpaid = [inv for inv in invoices if inv["amount_due"] > 0]
    overdue = [inv for inv in unpaid if inv.get("due_date", "9999") < today and inv["status"] == "OVERDUE"]
    current = [inv for inv in unpaid if inv not in overdue]

    return {
        "total_outstanding": round(sum(i["amount_due"] for i in unpaid), 2),
        "overdue_count": len(overdue),
        "overdue_amount": round(sum(i["amount_due"] for i in overdue), 2),
        "overdue_invoices": overdue,
        "current_count": len(current),
        "current_amount": round(sum(i["amount_due"] for i in current), 2),
    }


async def get_monthly_revenue(months: int = 6) -> list[dict]:
    if settings.use_mock_data or not is_connected():
        return MOCK_MONTHLY_REVENUE[-months:]

    key = _cache_key("monthly_revenue", months=months)
    cached = _cache_get(key)
    if cached:
        return cached

    data = await _xero_get("/Reports/ProfitAndLoss", params={"periods": months, "timeframe": "MONTH"})
    # Parse Xero P&L report structure (rows/cells)
    rows = data.get("Reports", [{}])[0].get("Rows", [])
    result = []
    for row in rows:
        if row.get("RowType") == "Section":
            for cell_row in row.get("Rows", []):
                if cell_row.get("RowType") == "Row":
                    cells = cell_row.get("Cells", [])
                    if cells:
                        result.append({"month": cells[0].get("Value", ""), "revenue": float(cells[1].get("Value", 0) or 0)})
    _cache_set(key, result)
    return result


async def get_top_customers(limit: int = 10) -> list[dict]:
    if settings.use_mock_data or not is_connected():
        return MOCK_TOP_CUSTOMERS[:limit]

    key = _cache_key("top_customers", limit=limit)
    cached = _cache_get(key)
    if cached:
        return cached

    invoices = await get_recent_invoices(365)
    customer_totals: dict[str, dict] = {}
    for inv in invoices:
        name = inv["contact_name"]
        if name not in customer_totals:
            customer_totals[name] = {"customer_name": name, "total_revenue": 0.0, "invoice_count": 0}
        customer_totals[name]["total_revenue"] += inv["amount_paid"]
        customer_totals[name]["invoice_count"] += 1

    result = sorted(customer_totals.values(), key=lambda x: x["total_revenue"], reverse=True)[:limit]
    _cache_set(key, result)
    return result


async def get_accounts_summary() -> dict:
    if settings.use_mock_data or not is_connected():
        return MOCK_ACCOUNTS_SUMMARY

    key = _cache_key("accounts_summary")
    cached = _cache_get(key)
    if cached:
        return cached

    data = await _xero_get("/Accounts", params={"where": "Type==\"BANK\""})
    bank_balances = [
        {"account_name": acc.get("Name", ""), "balance": float(acc.get("Balance", 0)), "currency": "GBP"}
        for acc in data.get("Accounts", [])
    ]
    result = {
        "bank_balances": bank_balances,
        "month_income": 0.0,
        "month_expenses": 0.0,
        "month_profit": 0.0,
    }
    _cache_set(key, result)
    return result
