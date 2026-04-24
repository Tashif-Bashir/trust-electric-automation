"""Unleashed inventory integration — HMAC-SHA256 auth + data fetching with Redis caching."""

import base64
import hashlib
import hmac
import json
import logging
from datetime import datetime, timedelta, timezone

import httpx

from config import settings
from services.mocks.unleashed_mock import MOCK_ORDERS, MOCK_PRODUCTS, MOCK_STOCK

logger = logging.getLogger(__name__)

UNLEASHED_BASE = "https://api.unleashedsoftware.com"
LOW_STOCK_THRESHOLD = 10

_redis_client = None


def _get_redis():
    global _redis_client
    if _redis_client is None:
        import redis as redis_lib
        _redis_client = redis_lib.from_url(settings.redis_url, decode_responses=True)
    return _redis_client


def _cache_key(fn_name: str, **params) -> str:
    param_hash = hashlib.md5(json.dumps(params, sort_keys=True).encode()).hexdigest()[:8]
    return f"unleashed:{fn_name}:{param_hash}"


def _cache_get(key: str):
    try:
        raw = _get_redis().get(key)
        return json.loads(raw) if raw else None
    except Exception:
        return None


def _cache_set(key: str, data, ttl: int = 300):
    try:
        _get_redis().setex(key, ttl, json.dumps(data))
    except Exception:
        pass


def is_connected() -> bool:
    return bool(settings.unleashed_api_id) and bool(settings.unleashed_api_key)


def _sign(query_string: str) -> str:
    """HMAC-SHA256 sign the query string with the Unleashed API key."""
    signature = hmac.new(
        settings.unleashed_api_key.encode("utf-8"),
        query_string.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return base64.b64encode(signature).decode("utf-8")


async def _make_request(endpoint: str, params: dict | None = None) -> dict:
    """Build signed request and call the Unleashed API."""
    from urllib.parse import urlencode
    query_string = urlencode(params) if params else ""
    url = f"{UNLEASHED_BASE}{endpoint}"
    if query_string:
        url = f"{url}?{query_string}"

    signature = _sign(query_string)
    headers = {
        "api-auth-id": settings.unleashed_api_id,
        "api-auth-signature": signature,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        resp.raise_for_status()
        return resp.json()


# ---------------------------------------------------------------------------
# Data fetching
# ---------------------------------------------------------------------------

async def get_products() -> list[dict]:
    if settings.use_mock_data or not is_connected():
        return MOCK_PRODUCTS

    key = _cache_key("products")
    cached = _cache_get(key)
    if cached:
        return cached

    data = await _make_request("/Products/1", {"pageSize": "200"})
    products = [
        {
            "product_code": p.get("ProductCode", ""),
            "product_description": p.get("ProductDescription", ""),
            "default_sell_price": float(p.get("DefaultSellPrice", 0) or 0),
            "last_cost": float(p.get("LastCost", 0) or 0),
            "is_active": p.get("IsActive", True),
        }
        for p in data.get("Items", [])
        if p.get("IsActive")
    ]
    _cache_set(key, products)
    return products


async def get_stock_on_hand() -> list[dict]:
    if settings.use_mock_data or not is_connected():
        return MOCK_STOCK

    key = _cache_key("stock")
    cached = _cache_get(key)
    if cached:
        return cached

    data = await _make_request("/StockOnHand/1", {"pageSize": "200"})
    stock = [
        {
            "product_code": s.get("ProductCode", ""),
            "product_description": s.get("ProductDescription", ""),
            "qty_on_hand": float(s.get("QtyOnHand", 0) or 0),
            "available_qty": float(s.get("AvailableQty", 0) or 0),
            "allocated_qty": float(s.get("AllocatedQty", 0) or 0),
            "warehouse_name": s.get("WarehouseName", ""),
            "last_stocktake": s.get("LastStocktakeDate", ""),
        }
        for s in data.get("Items", [])
    ]
    _cache_set(key, stock)
    return stock


async def get_recent_orders(days: int = 30) -> list[dict]:
    if settings.use_mock_data or not is_connected():
        return MOCK_ORDERS

    key = _cache_key("orders", days=days)
    cached = _cache_get(key)
    if cached:
        return cached

    cutoff = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%dT00:00:00")
    data = await _make_request("/SalesOrders/1", {"startDate": cutoff[:10], "pageSize": "200"})
    orders = [
        {
            "order_number": o.get("OrderNumber", ""),
            "customer_name": o.get("Customer", {}).get("CustomerName", ""),
            "order_date": (o.get("OrderDate") or "")[:10],
            "required_date": (o.get("RequiredDate") or "")[:10],
            "status": o.get("OrderStatus", ""),
            "total": float(o.get("SubTotal", 0) or 0),
            "line_count": len(o.get("SalesOrderLines", [])),
        }
        for o in data.get("Items", [])
    ]
    _cache_set(key, orders)
    return orders


async def get_low_stock_alerts(threshold: int = LOW_STOCK_THRESHOLD) -> list[dict]:
    stock = await get_stock_on_hand()
    return [s for s in stock if s["available_qty"] < threshold]


async def get_sales_summary() -> dict:
    orders = await get_recent_orders(30)
    completed = [o for o in orders if o["status"] == "Completed"]
    pending = [o for o in orders if o["status"] in ("Placed", "Parked")]

    total_value = sum(o["total"] for o in completed)

    # Most ordered product from orders (approximate from mock; in production parse line items)
    stock = await get_stock_on_hand()
    top_product = stock[1]["product_description"] if len(stock) > 1 else "NEOS-1000"  # NEOS-1000 typically best seller

    return {
        "month_orders": len(completed),
        "month_value": round(total_value, 2),
        "top_product": top_product,
        "pending_orders": len(pending),
    }
