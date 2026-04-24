"""Realistic mock data for Xero integration — used when USE_MOCK_DATA=true."""

from datetime import datetime, timedelta, timezone

_NOW = datetime.now(timezone.utc)


def _date(days_ago: int = 0) -> str:
    return (_NOW - timedelta(days=days_ago)).strftime("%Y-%m-%d")


MOCK_INVOICES = [
    {"invoice_number": "INV-0124", "contact_name": "Sarah Thompson - LS11 1AB", "status": "PAID",   "date": _date(2),  "due_date": _date(0),   "amount_total": 2590.00, "amount_due": 0.00,    "amount_paid": 2590.00},
    {"invoice_number": "INV-0123", "contact_name": "Mark Davies - HG1 2BX",     "status": "PAID",   "date": _date(5),  "due_date": _date(2),   "amount_total": 1590.00, "amount_due": 0.00,    "amount_paid": 1590.00},
    {"invoice_number": "INV-0122", "contact_name": "James Parker - YO10 3DE",   "status": "AUTHORISED", "date": _date(7),  "due_date": _date(7),   "amount_total": 3990.00, "amount_due": 3990.00, "amount_paid": 0.00},
    {"invoice_number": "INV-0121", "contact_name": "Helen Carter - BD1 4FG",    "status": "AUTHORISED", "date": _date(10), "due_date": _date(3),   "amount_total": 795.00,  "amount_due": 795.00,  "amount_paid": 0.00},
    {"invoice_number": "INV-0120", "contact_name": "Tom Wilson - LS1 5HJ",      "status": "OVERDUE", "date": _date(18), "due_date": _date(4),   "amount_total": 1990.00, "amount_due": 1990.00, "amount_paid": 0.00},
    {"invoice_number": "INV-0119", "contact_name": "Anna Brown - WF1 6KL",      "status": "OVERDUE", "date": _date(22), "due_date": _date(8),   "amount_total": 4785.00, "amount_due": 4785.00, "amount_paid": 0.00},
    {"invoice_number": "INV-0118", "contact_name": "David Hall - HX1 7MN",      "status": "PAID",   "date": _date(14), "due_date": _date(7),   "amount_total": 1295.00, "amount_due": 0.00,    "amount_paid": 1295.00},
    {"invoice_number": "INV-0117", "contact_name": "Louise Clarke - LS6 8PQ",   "status": "PAID",   "date": _date(16), "due_date": _date(9),   "amount_total": 2385.00, "amount_due": 0.00,    "amount_paid": 2385.00},
    {"invoice_number": "INV-0116", "contact_name": "Chris Evans - BD3 9RS",     "status": "OVERDUE", "date": _date(35), "due_date": _date(21),  "amount_total": 995.00,  "amount_due": 995.00,  "amount_paid": 0.00},
    {"invoice_number": "INV-0115", "contact_name": "Emma White - LS2 1TU",      "status": "PAID",   "date": _date(20), "due_date": _date(13),  "amount_total": 3185.00, "amount_due": 0.00,    "amount_paid": 3185.00},
    {"invoice_number": "INV-0114", "contact_name": "Paul Green - HG3 2VW",      "status": "AUTHORISED", "date": _date(3),  "due_date": _date(11),  "amount_total": 1590.00, "amount_due": 1590.00, "amount_paid": 0.00},
    {"invoice_number": "INV-0113", "contact_name": "Rachel Adams - YO1 3XY",    "status": "PAID",   "date": _date(25), "due_date": _date(18),  "amount_total": 4285.00, "amount_due": 0.00,    "amount_paid": 4285.00},
    {"invoice_number": "INV-0112", "contact_name": "Mike Turner - WF3 4ZA",     "status": "PAID",   "date": _date(28), "due_date": _date(21),  "amount_total": 795.00,  "amount_due": 0.00,    "amount_paid": 795.00},
    {"invoice_number": "INV-0111", "contact_name": "Julie King - LS7 5BC",      "status": "PAID",   "date": _date(30), "due_date": _date(23),  "amount_total": 2090.00, "amount_due": 0.00,    "amount_paid": 2090.00},
    {"invoice_number": "INV-0110", "contact_name": "Steve Harris - HX3 6DE",    "status": "OVERDUE", "date": _date(45), "due_date": _date(31),  "amount_total": 1990.00, "amount_due": 1990.00, "amount_paid": 0.00},
]

MOCK_MONTHLY_REVENUE = [
    {"month": (_NOW - timedelta(days=150)).strftime("%b %Y"), "revenue": 28400.00, "expenses": 18200.00},
    {"month": (_NOW - timedelta(days=120)).strftime("%b %Y"), "revenue": 32100.00, "expenses": 19800.00},
    {"month": (_NOW - timedelta(days=90)).strftime("%b %Y"),  "revenue": 35600.00, "expenses": 21400.00},
    {"month": (_NOW - timedelta(days=60)).strftime("%b %Y"),  "revenue": 38200.00, "expenses": 22100.00},
    {"month": (_NOW - timedelta(days=30)).strftime("%b %Y"),  "revenue": 41500.00, "expenses": 23800.00},
    {"month": _NOW.strftime("%b %Y"),                         "revenue": 19800.00, "expenses": 11200.00},  # partial month
]

MOCK_ACCOUNTS_SUMMARY = {
    "bank_balances": [
        {"account_name": "Current Account", "balance": 42_350.00, "currency": "GBP"},
        {"account_name": "Business Savings", "balance": 85_000.00, "currency": "GBP"},
    ],
    "month_income": 19_800.00,
    "month_expenses": 11_200.00,
    "month_profit": 8_600.00,
}

MOCK_TOP_CUSTOMERS = [
    {"customer_name": "Rachel Adams - YO1 3XY",   "total_revenue": 9_185.00, "invoice_count": 3},
    {"customer_name": "Sarah Thompson - LS11 1AB", "total_revenue": 7_780.00, "invoice_count": 3},
    {"customer_name": "James Parker - YO10 3DE",   "total_revenue": 6_990.00, "invoice_count": 2},
    {"customer_name": "Anna Brown - WF1 6KL",      "total_revenue": 6_385.00, "invoice_count": 2},
    {"customer_name": "Louise Clarke - LS6 8PQ",   "total_revenue": 5_570.00, "invoice_count": 2},
    {"customer_name": "Emma White - LS2 1TU",      "total_revenue": 5_275.00, "invoice_count": 2},
    {"customer_name": "Paul Green - HG3 2VW",      "total_revenue": 3_985.00, "invoice_count": 2},
    {"customer_name": "Mark Davies - HG1 2BX",     "total_revenue": 3_180.00, "invoice_count": 2},
    {"customer_name": "David Hall - HX1 7MN",      "total_revenue": 2_590.00, "invoice_count": 2},
    {"customer_name": "Chris Evans - BD3 9RS",     "total_revenue": 1_990.00, "invoice_count": 2},
]
