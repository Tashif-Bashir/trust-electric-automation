import re
import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, field_validator, model_validator

UK_PHONE_RE = re.compile(r"^(\+44|0)[\s\-]?7[\d][\d\s\-]{7,9}[\d]$")
UK_POSTCODE_RE = re.compile(r"^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$", re.IGNORECASE)


def _normalize_phone(v: str) -> str:
    digits = re.sub(r"[\s\-]", "", v)
    if digits.startswith("07"):
        return "+44" + digits[1:]
    return digits


def _format_postcode(v: str) -> str:
    upper = v.upper().replace(" ", "")
    return upper[:-3] + " " + upper[-3:]


# ---------------------------------------------------------------------------
# Lead schemas
# ---------------------------------------------------------------------------

class LeadCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    postcode: str
    property_type: Literal["flat", "terraced", "semi-detached", "detached", "bungalow", "other"]
    rooms_to_heat: Literal["1", "2", "3", "4", "5-6", "7+"]
    current_heating: Literal["gas-boiler", "oil-boiler", "storage-heaters", "lpg", "other"]
    message: str | None = None
    gdpr_consent: bool

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("Full name must be at least 2 characters")
        return v.strip()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not UK_PHONE_RE.match(v.strip()):
            raise ValueError("Please provide a valid UK mobile number")
        return _normalize_phone(v.strip())

    @field_validator("postcode")
    @classmethod
    def validate_postcode(cls, v: str) -> str:
        if not UK_POSTCODE_RE.match(v.strip()):
            raise ValueError("Please provide a valid UK postcode")
        return _format_postcode(v.strip())

    @model_validator(mode="after")
    def gdpr_must_be_true(self) -> "LeadCreate":
        if not self.gdpr_consent:
            raise ValueError("GDPR consent is required")
        return self


class LeadNoteResponse(BaseModel):
    id: uuid.UUID
    note: str
    author: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LeadEmailResponse(BaseModel):
    id: uuid.UUID
    step_number: int
    subject: str
    sent_at: datetime
    opened_at: datetime | None = None
    clicked_at: datetime | None = None
    error: str | None = None

    model_config = {"from_attributes": True}


class LeadResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    email: str
    phone: str
    postcode: str
    property_type: str
    rooms_to_heat: str
    current_heating: str
    message: str | None = None
    gdpr_consent: bool
    status: str
    source: str
    notes: str | None = None
    created_at: datetime
    updated_at: datetime
    contacted_at: datetime | None = None
    emails: list[LeadEmailResponse] = []
    lead_notes: list[LeadNoteResponse] = []

    model_config = {"from_attributes": True}


class LeadUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None
    contacted_at: datetime | None = None


class LeadNoteCreate(BaseModel):
    note: str
    author: str = "Sales Team"


class PaginatedLeads(BaseModel):
    items: list[LeadResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ---------------------------------------------------------------------------
# Stats schema
# ---------------------------------------------------------------------------

class LeadStats(BaseModel):
    total_leads: int
    leads_today: int
    leads_this_week: int
    leads_this_month: int
    conversion_rate: float
    average_response_time_hours: float
    by_status: dict[str, int]
