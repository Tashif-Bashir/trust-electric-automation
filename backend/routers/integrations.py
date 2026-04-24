"""Xero (and later Unleashed) integration endpoints."""

import logging

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import RedirectResponse

from config import settings
from services import xero as xero_svc

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/integrations", tags=["Integrations"])


def _redirect_uri(request: Request) -> str:
    base = str(request.base_url).rstrip("/")
    return f"{base}/api/integrations/xero/callback"


# ---------------------------------------------------------------------------
# Xero
# ---------------------------------------------------------------------------

@router.get("/xero/auth")
async def xero_auth(request: Request):
    """Return the Xero OAuth authorization URL."""
    if not settings.xero_client_id:
        raise HTTPException(status_code=400, detail="Xero credentials not configured")
    url = xero_svc.get_auth_url(_redirect_uri(request))
    return {"auth_url": url}


@router.get("/xero/callback")
async def xero_callback(request: Request, code: str = Query(...), state: str = Query("")):
    """Handle Xero OAuth callback — exchange code for tokens."""
    try:
        result = await xero_svc.exchange_code(code, _redirect_uri(request))
        dashboard = settings.dashboard_url.rstrip("/")
        return RedirectResponse(url=f"{dashboard}?xero_connected=true")
    except Exception as exc:
        logger.error("Xero OAuth callback failed: %s", exc)
        raise HTTPException(status_code=400, detail=f"Xero authentication failed: {exc}")


@router.get("/xero/status")
async def xero_status():
    """Return whether Xero is connected and using mock data."""
    return {
        "connected": xero_svc.is_connected(),
        "mock_mode": settings.use_mock_data,
        "last_sync": None,
    }


@router.get("/xero/invoices")
async def xero_invoices(days: int = Query(30, ge=1, le=365)):
    """Return recent invoices (mock data if USE_MOCK_DATA=true or not connected)."""
    try:
        return await xero_svc.get_recent_invoices(days=days)
    except Exception as exc:
        logger.error("Failed to fetch Xero invoices: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch invoices")


@router.get("/xero/summary")
async def xero_summary():
    """Return accounts summary and outstanding balances."""
    try:
        accounts = await xero_svc.get_accounts_summary()
        outstanding = await xero_svc.get_outstanding_balance()
        return {**accounts, "outstanding": outstanding}
    except Exception as exc:
        logger.error("Failed to fetch Xero summary: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch summary")


@router.get("/xero/revenue")
async def xero_revenue(months: int = Query(6, ge=1, le=12)):
    """Return monthly revenue trend."""
    try:
        return await xero_svc.get_monthly_revenue(months=months)
    except Exception as exc:
        logger.error("Failed to fetch Xero revenue: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch revenue")


@router.get("/xero/customers")
async def xero_top_customers(limit: int = Query(10, ge=1, le=50)):
    """Return top customers by revenue."""
    try:
        return await xero_svc.get_top_customers(limit=limit)
    except Exception as exc:
        logger.error("Failed to fetch Xero customers: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch customers")
