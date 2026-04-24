"""Realistic mock data for Unleashed inventory — used when USE_MOCK_DATA=true."""

from datetime import datetime, timedelta, timezone

_NOW = datetime.now(timezone.utc)


def _date(days_ago: int = 0) -> str:
    return (_NOW - timedelta(days=days_ago)).strftime("%Y-%m-%d")


MOCK_PRODUCTS = [
    {
        "product_code": "NEOS-500",
        "product_description": "500W NEOS Electric Radiator",
        "default_sell_price": 495.00,
        "last_cost": 210.00,
        "is_active": True,
    },
    {
        "product_code": "NEOS-1000",
        "product_description": "1000W NEOS Electric Radiator",
        "default_sell_price": 795.00,
        "last_cost": 340.00,
        "is_active": True,
    },
    {
        "product_code": "NEOS-1500",
        "product_description": "1500W NEOS Electric Radiator",
        "default_sell_price": 995.00,
        "last_cost": 430.00,
        "is_active": True,
    },
    {
        "product_code": "NEOS-2000",
        "product_description": "2000W NEOS Electric Radiator",
        "default_sell_price": 1295.00,
        "last_cost": 560.00,
        "is_active": True,
    },
]

MOCK_STOCK = [
    {
        "product_code": "NEOS-500",
        "product_description": "500W NEOS Electric Radiator",
        "qty_on_hand": 47.0,
        "available_qty": 44.0,
        "allocated_qty": 3.0,
        "warehouse_name": "Garforth Warehouse",
        "last_stocktake": _date(14),
    },
    {
        "product_code": "NEOS-1000",
        "product_description": "1000W NEOS Electric Radiator",
        "qty_on_hand": 23.0,
        "available_qty": 18.0,
        "allocated_qty": 5.0,
        "warehouse_name": "Garforth Warehouse",
        "last_stocktake": _date(14),
    },
    {
        "product_code": "NEOS-1500",
        "product_description": "1500W NEOS Electric Radiator",
        "qty_on_hand": 8.0,
        "available_qty": 6.0,
        "allocated_qty": 2.0,
        "warehouse_name": "Garforth Warehouse",
        "last_stocktake": _date(14),
    },
    {
        "product_code": "NEOS-2000",
        "product_description": "2000W NEOS Electric Radiator",
        "qty_on_hand": 12.0,
        "available_qty": 8.0,
        "allocated_qty": 4.0,
        "warehouse_name": "Garforth Warehouse",
        "last_stocktake": _date(7),
    },
]

MOCK_ORDERS = [
    {"order_number": "SO-0241", "customer_name": "Northgate Installations Ltd", "order_date": _date(1),  "required_date": _date(0),   "status": "Placed",    "total": 4780.00, "line_count": 4},
    {"order_number": "SO-0240", "customer_name": "Sarah Thompson",              "order_date": _date(2),  "required_date": _date(5),   "status": "Placed",    "total": 2590.00, "line_count": 2},
    {"order_number": "SO-0239", "customer_name": "Leeds Home Heating Co",       "order_date": _date(3),  "required_date": _date(0),   "status": "Completed", "total": 8475.00, "line_count": 7},
    {"order_number": "SO-0238", "customer_name": "Mark Davies",                 "order_date": _date(5),  "required_date": _date(2),   "status": "Completed", "total": 1590.00, "line_count": 2},
    {"order_number": "SO-0237", "customer_name": "Yorkshire Warmth Solutions",  "order_date": _date(6),  "required_date": _date(10),  "status": "Parked",    "total": 5970.00, "line_count": 5},
    {"order_number": "SO-0236", "customer_name": "James Parker",                "order_date": _date(8),  "required_date": _date(5),   "status": "Completed", "total": 3990.00, "line_count": 3},
    {"order_number": "SO-0235", "customer_name": "Northern Comfort Heating",    "order_date": _date(10), "required_date": _date(7),   "status": "Completed", "total": 2390.00, "line_count": 2},
    {"order_number": "SO-0234", "customer_name": "Helen Carter",                "order_date": _date(12), "required_date": _date(9),   "status": "Completed", "total": 795.00,  "line_count": 1},
    {"order_number": "SO-0233", "customer_name": "Harrogate Install Services",  "order_date": _date(14), "required_date": _date(20),  "status": "Placed",    "total": 6480.00, "line_count": 6},
    {"order_number": "SO-0232", "customer_name": "Anna Brown",                  "order_date": _date(15), "required_date": _date(12),  "status": "Completed", "total": 4785.00, "line_count": 4},
    {"order_number": "SO-0231", "customer_name": "David Hall",                  "order_date": _date(16), "required_date": _date(13),  "status": "Completed", "total": 1295.00, "line_count": 1},
    {"order_number": "SO-0230", "customer_name": "Tom Wilson Renovations",      "order_date": _date(18), "required_date": _date(25),  "status": "Parked",    "total": 3185.00, "line_count": 3},
    {"order_number": "SO-0229", "customer_name": "Rachel Adams",                "order_date": _date(20), "required_date": _date(17),  "status": "Completed", "total": 2590.00, "line_count": 2},
    {"order_number": "SO-0228", "customer_name": "Emma White",                  "order_date": _date(22), "required_date": _date(19),  "status": "Completed", "total": 3185.00, "line_count": 3},
    {"order_number": "SO-0227", "customer_name": "York Valley Heating",         "order_date": _date(24), "required_date": _date(21),  "status": "Completed", "total": 4980.00, "line_count": 4},
    {"order_number": "SO-0226", "customer_name": "Louise Clarke",               "order_date": _date(25), "required_date": _date(22),  "status": "Completed", "total": 1590.00, "line_count": 2},
    {"order_number": "SO-0225", "customer_name": "Wakefield Installs",          "order_date": _date(27), "required_date": _date(24),  "status": "Completed", "total": 7770.00, "line_count": 6},
    {"order_number": "SO-0224", "customer_name": "Paul Green",                  "order_date": _date(28), "required_date": _date(25),  "status": "Completed", "total": 995.00,  "line_count": 1},
    {"order_number": "SO-0223", "customer_name": "Bradford Heating Direct",     "order_date": _date(29), "required_date": _date(35),  "status": "Placed",    "total": 5175.00, "line_count": 5},
    {"order_number": "SO-0222", "customer_name": "Mike Turner",                 "order_date": _date(30), "required_date": _date(27),  "status": "Completed", "total": 795.00,  "line_count": 1},
]
