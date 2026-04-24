import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone

from config import settings
from models import Lead
from services.email import render_template, send_email
from services.sms import send_sms

logger = logging.getLogger(__name__)


def _format_heating(value: str) -> str:
    return value.replace("-", " ").title()


def notify_new_lead(lead: Lead) -> None:
    """
    Fires all 4 notifications in parallel:
      1. SMS to owner
      2. Email to owner
      3. SMS to lead
      4. Email to lead
    Runs in a background thread — never raises.
    """
    received_at = datetime.now(timezone.utc).strftime("%d %b %Y at %H:%M UTC")
    first_name = lead.full_name.strip().split()[0]
    dashboard_url = settings.dashboard_url or "http://localhost:5173"
    unsubscribe_url = f"{settings.next_public_api_url}/api/unsubscribe/placeholder"

    owner_sms_body = (
        f"🔥 New NEOS Lead!\n"
        f"Name: {lead.full_name}\n"
        f"Phone: {lead.phone}\n"
        f"Postcode: {lead.postcode}\n"
        f"Rooms: {lead.rooms_to_heat}\n"
        f"Heating: {_format_heating(lead.current_heating)}\n\n"
        f"Respond within 5 mins for best conversion."
    )

    lead_sms_body = (
        f"Hi {first_name}, thanks for your NEOS quote request! "
        f"Our team will call you within 2 hours. "
        f"Questions? Reply to this text. — Trust Electric Heating"
    )

    owner_email_html = render_template(
        "owner_notification.html",
        {
            "full_name": lead.full_name,
            "phone": lead.phone,
            "email": lead.email,
            "postcode": lead.postcode,
            "property_type": _format_heating(lead.property_type),
            "rooms_to_heat": lead.rooms_to_heat,
            "current_heating": _format_heating(lead.current_heating),
            "message": lead.message or "",
            "received_at": received_at,
            "dashboard_url": dashboard_url,
        },
    )

    lead_email_html = render_template(
        "lead_confirmation.html",
        {
            "first_name": first_name,
            "unsubscribe_url": unsubscribe_url,
        },
    )

    tasks = []

    if settings.owner_phone:
        tasks.append(("owner_sms", lambda: send_sms(settings.owner_phone, owner_sms_body, bypass_rate_limit=True)))

    if settings.owner_email:
        tasks.append((
            "owner_email",
            lambda: send_email(
                to=settings.owner_email,
                subject=f"🔥 New NEOS Lead — {lead.full_name} ({lead.postcode})",
                html_body=owner_email_html,
            ),
        ))

    tasks.append(("lead_sms", lambda: send_sms(lead.phone, lead_sms_body)))

    tasks.append((
        "lead_email",
        lambda: send_email(
            to=lead.email,
            subject=f"Your NEOS Quote Request — We'll Call You Shortly",
            html_body=lead_email_html,
            reply_to=settings.owner_email or None,
        ),
    ))

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(fn): name for name, fn in tasks}
        for future in as_completed(futures):
            name = futures[future]
            try:
                result = future.result()
                if result.get("success"):
                    logger.info("Notification %s succeeded", name)
                else:
                    logger.warning("Notification %s failed: %s", name, result.get("error"))
            except Exception as e:
                logger.error("Notification %s raised: %s", name, e)
