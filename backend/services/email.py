import logging
import os
import time
from pathlib import Path

import httpx

from config import settings

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).parent / "templates"
FROM_ADDRESS = "NEOS Quotes <quotes@trustelectricheating.co.uk>"


def render_template(template_name: str, context: dict) -> str:
    path = TEMPLATES_DIR / template_name
    html = path.read_text(encoding="utf-8")
    for key, value in context.items():
        html = html.replace(f"{{{{{key}}}}}", str(value) if value is not None else "")
    return html


def send_email(
    to: str,
    subject: str,
    html_body: str,
    reply_to: str | None = None,
) -> dict:
    """Send an email via Resend. Returns {success, email_id, error}."""
    if not settings.resend_api_key:
        logger.info("Resend not configured — skipping email to %s: %s", to, subject)
        return {"success": False, "email_id": None, "error": "Resend not configured"}

    payload: dict = {
        "from": FROM_ADDRESS,
        "to": [to],
        "subject": subject,
        "html": html_body,
    }
    if reply_to:
        payload["reply_to"] = reply_to

    last_error: str = ""
    for attempt in range(3):
        try:
            resp = httpx.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json=payload,
                timeout=15,
            )
            if resp.status_code in (200, 201):
                data = resp.json()
                email_id = data.get("id")
                logger.info("Email sent to %s — ID: %s", to, email_id)
                return {"success": True, "email_id": email_id, "error": None}
            last_error = f"HTTP {resp.status_code}: {resp.text[:200]}"
            logger.warning("Resend attempt %d failed: %s", attempt + 1, last_error)
        except httpx.RequestError as e:
            last_error = str(e)
            logger.warning("Resend request error attempt %d: %s", attempt + 1, e)

        if attempt < 2:
            time.sleep(2 ** attempt)

    logger.error("All Resend attempts failed for %s: %s", to, last_error)
    return {"success": False, "email_id": None, "error": last_error}
