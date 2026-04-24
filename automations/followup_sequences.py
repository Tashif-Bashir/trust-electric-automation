"""
Follow-up email sequences for Trust Electric Heating leads.

Steps:
  1 — 1 hour after submission: targets status=new (team hasn't called yet)
  2 — 24 hours after submission: targets status=new or contacted
  3 — 72 hours after submission: targets status=quoted (has a quote, not yet converted)

Never sends to converted or lost leads.
Deduplicates via lead_emails table — each (lead_id, step_number) is sent at most once.

Run:
  python followup_sequences.py [--dry-run] [--step 1|2|3]
"""

import argparse
import asyncio
import logging
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import httpx
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import selectinload

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from models import Lead, LeadEmail  # noqa: E402
from config import settings  # noqa: E402 — automations/config.py

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("followup")

TEMPLATES_DIR = Path(__file__).parent / "templates"

STEPS = {
    1: {
        "delay_hours": 1,
        "template": "followup_1hr.html",
        "subject": "Your NEOS quote — we're reviewing your details",
        "target_statuses": {"new"},
    },
    2: {
        "delay_hours": 24,
        "template": "followup_24hr.html",
        "subject": "See how NEOS compares to your gas boiler, {{first_name}}",
        "target_statuses": {"new", "contacted"},
    },
    3: {
        "delay_hours": 72,
        "template": "followup_72hr.html",
        "subject": "Any questions about your NEOS quote, {{first_name}}?",
        "target_statuses": {"quoted"},
    },
}

SKIP_STATUSES = {"converted", "lost"}


def render_template(template_name: str, context: dict) -> str:
    html = (TEMPLATES_DIR / template_name).read_text(encoding="utf-8")
    for key, value in context.items():
        html = html.replace(f"{{{{{key}}}}}", str(value) if value is not None else "")
    return html


def send_email(to: str, subject: str, html_body: str) -> dict:
    """Send via Resend REST API. Returns {success, email_id, error}."""
    if not settings.resend_api_key:
        logger.info("Resend not configured — skipping email to %s", to)
        return {"success": False, "email_id": None, "error": "Resend not configured"}

    payload = {
        "from": "NEOS Quotes <quotes@trustelectricheating.co.uk>",
        "to": [to],
        "subject": subject,
        "html": html_body,
        "reply_to": settings.owner_email or None,
    }

    last_error = ""
    for attempt in range(3):
        try:
            resp = httpx.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json=payload,
                timeout=15,
            )
            if resp.status_code in (200, 201):
                email_id = resp.json().get("id")
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


async def process_step(
    step_number: int,
    session: AsyncSession,
    dry_run: bool,
) -> dict:
    step = STEPS[step_number]
    delay = timedelta(hours=step["delay_hours"])
    now = datetime.now(timezone.utc)
    cutoff = now - delay

    # Leads that are old enough AND in a target status AND not deleted
    query = (
        select(Lead)
        .options(selectinload(Lead.emails))
        .where(
            and_(
                Lead.deleted_at.is_(None),
                Lead.created_at <= cutoff,
                Lead.status.in_(step["target_statuses"]),
            )
        )
    )
    result = await session.execute(query)
    candidates = result.scalars().all()

    sent = 0
    skipped_already_sent = 0
    skipped_status = 0
    errors = 0

    for lead in candidates:
        # Skip if already sent this step
        already_sent = any(e.step_number == step_number for e in lead.emails)
        if already_sent:
            skipped_already_sent += 1
            continue

        # Double-check status hasn't changed to skip statuses
        if lead.status in SKIP_STATUSES:
            skipped_status += 1
            continue

        first_name = lead.full_name.strip().split()[0]
        unsubscribe_url = f"{settings.next_public_api_url}/api/unsubscribe/placeholder"

        subject = step["subject"].replace("{{first_name}}", first_name)
        html_body = render_template(
            step["template"],
            {"first_name": first_name, "unsubscribe_url": unsubscribe_url},
        )

        if dry_run:
            logger.info(
                "[DRY RUN] Step %d | Lead %s <%s> | Subject: %s",
                step_number, lead.full_name, lead.email, subject,
            )
            sent += 1
            continue

        result = send_email(lead.email, subject, html_body)
        success = result.get("success", False)

        record = LeadEmail(
            lead_id=lead.id,
            step_number=step_number,
            subject=subject,
            error=None if success else result.get("error"),
        )
        session.add(record)
        await session.commit()

        if success:
            sent += 1
            logger.info(
                "Step %d sent to %s <%s>",
                step_number, lead.full_name, lead.email,
            )
        else:
            errors += 1
            logger.warning(
                "Step %d failed for %s <%s>: %s",
                step_number, lead.full_name, lead.email, result.get("error"),
            )

    summary = {
        "step": step_number,
        "candidates": len(candidates),
        "sent": sent,
        "skipped_already_sent": skipped_already_sent,
        "skipped_status": skipped_status,
        "errors": errors,
    }
    logger.info("Step %d complete: %s", step_number, summary)
    return summary


async def run(step_filter: int | None, dry_run: bool) -> None:
    engine = create_async_engine(settings.database_url, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    steps_to_run = [step_filter] if step_filter else list(STEPS.keys())

    async with async_session() as session:
        for step_number in steps_to_run:
            await process_step(step_number, session, dry_run)

    await engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Trust Electric follow-up email sequences")
    parser.add_argument("--dry-run", action="store_true", help="Log actions without sending emails or writing to DB")
    parser.add_argument("--step", type=int, choices=[1, 2, 3], help="Run only this step number")
    args = parser.parse_args()

    asyncio.run(run(step_filter=args.step, dry_run=args.dry_run))
