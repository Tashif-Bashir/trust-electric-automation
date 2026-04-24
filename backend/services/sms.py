import hashlib
import logging
import re

import redis as redis_sync
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

from config import settings

logger = logging.getLogger(__name__)

_redis = redis_sync.from_url(settings.redis_url, decode_responses=True)


def _e164(phone: str) -> str:
    digits = re.sub(r"[\s\-\(\)]", "", phone)
    if digits.startswith("07"):
        return "+44" + digits[1:]
    if not digits.startswith("+"):
        return "+" + digits
    return digits


def _rate_key(phone: str) -> str:
    h = hashlib.sha256(phone.encode()).hexdigest()[:16]
    return f"sms_rate:{h}"


def _is_rate_limited(phone: str) -> bool:
    key = _rate_key(phone)
    count = _redis.get(key)
    if count and int(count) >= 1:
        return True
    pipe = _redis.pipeline()
    pipe.incr(key)
    pipe.expire(key, 3600)
    pipe.execute()
    return False


def send_sms(to: str, body: str, bypass_rate_limit: bool = False) -> dict:
    """Send an SMS via Twilio. Returns {success, message_sid, error}."""
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.info("Twilio not configured — skipping SMS to %s: %s", to, body[:60])
        return {"success": False, "message_sid": None, "error": "Twilio not configured"}

    to_e164 = _e164(to)

    if not bypass_rate_limit and _is_rate_limited(to_e164):
        logger.info("SMS rate limited for %s", to_e164)
        return {"success": False, "message_sid": None, "error": "Rate limited"}

    try:
        client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        message = client.messages.create(
            body=body,
            from_=_e164(settings.twilio_phone_number),
            to=to_e164,
        )
        logger.info("SMS sent to %s — SID: %s", to_e164, message.sid)
        return {"success": True, "message_sid": message.sid, "error": None}
    except TwilioRestException as e:
        logger.error("Twilio error sending to %s: %s", to_e164, e)
        return {"success": False, "message_sid": None, "error": str(e)}
    except Exception as e:
        logger.error("Unexpected error sending SMS to %s: %s", to_e164, e)
        return {"success": False, "message_sid": None, "error": str(e)}
