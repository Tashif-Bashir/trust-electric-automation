import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database import get_db
from models import Lead, LeadNote
from schemas import (
    LeadCreate,
    LeadNoteCreate,
    LeadNoteResponse,
    LeadResponse,
    LeadUpdate,
    PaginatedLeads,
)

router = APIRouter(tags=["Leads"])


def _lead_to_response(lead: Lead) -> LeadResponse:
    return LeadResponse.model_validate(lead)


async def _notify_new_lead(lead_id: uuid.UUID) -> None:
    """Placeholder — Prompt 2.2 wires real SMS/email here."""
    pass


# ---------------------------------------------------------------------------
# POST /api/leads
# ---------------------------------------------------------------------------

@router.post("/leads", response_model=LeadResponse, status_code=201)
async def create_lead(
    payload: LeadCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    lead = Lead(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        postcode=payload.postcode,
        property_type=payload.property_type,
        rooms_to_heat=payload.rooms_to_heat,
        current_heating=payload.current_heating,
        message=payload.message,
        gdpr_consent=payload.gdpr_consent,
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)

    background_tasks.add_task(_notify_new_lead, lead.id)

    result = await db.execute(
        select(Lead).options(selectinload(Lead.emails), selectinload(Lead.lead_notes)).where(Lead.id == lead.id)
    )
    return _lead_to_response(result.scalar_one())


# ---------------------------------------------------------------------------
# GET /api/leads
# ---------------------------------------------------------------------------

@router.get("/leads", response_model=PaginatedLeads)
async def list_leads(
    status: str | None = Query(None),
    search: str | None = Query(None),
    date_from: datetime | None = Query(None),
    date_to: datetime | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    base = select(Lead).where(Lead.deleted_at.is_(None))

    if status:
        base = base.where(Lead.status == status)
    if search:
        term = f"%{search}%"
        base = base.where(
            or_(
                Lead.full_name.ilike(term),
                Lead.email.ilike(term),
                Lead.phone.ilike(term),
                Lead.postcode.ilike(term),
            )
        )
    if date_from:
        base = base.where(Lead.created_at >= date_from)
    if date_to:
        base = base.where(Lead.created_at <= date_to)

    count_result = await db.execute(select(func.count()).select_from(base.subquery()))
    total = count_result.scalar_one()

    query = (
        base.options(selectinload(Lead.emails), selectinload(Lead.lead_notes))
        .order_by(Lead.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    leads = result.scalars().all()

    return PaginatedLeads(
        items=[_lead_to_response(l) for l in leads],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(1, -(-total // page_size)),
    )


# ---------------------------------------------------------------------------
# GET /api/leads/{lead_id}
# ---------------------------------------------------------------------------

@router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Lead)
        .options(selectinload(Lead.emails), selectinload(Lead.lead_notes))
        .where(Lead.id == lead_id, Lead.deleted_at.is_(None))
    )
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _lead_to_response(lead)


# ---------------------------------------------------------------------------
# PATCH /api/leads/{lead_id}
# ---------------------------------------------------------------------------

@router.patch("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: uuid.UUID,
    payload: LeadUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Lead)
        .options(selectinload(Lead.emails), selectinload(Lead.lead_notes))
        .where(Lead.id == lead_id, Lead.deleted_at.is_(None))
    )
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if payload.status is not None:
        if lead.status == "new" and payload.status == "contacted" and not lead.contacted_at:
            lead.contacted_at = datetime.now(timezone.utc)
        lead.status = payload.status
    if payload.notes is not None:
        lead.notes = payload.notes
    if payload.contacted_at is not None:
        lead.contacted_at = payload.contacted_at

    await db.commit()
    await db.refresh(lead)
    return _lead_to_response(lead)


# ---------------------------------------------------------------------------
# POST /api/leads/{lead_id}/notes
# ---------------------------------------------------------------------------

@router.post("/leads/{lead_id}/notes", response_model=LeadNoteResponse, status_code=201)
async def add_note(
    lead_id: uuid.UUID,
    payload: LeadNoteCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.deleted_at.is_(None)))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Lead not found")

    note = LeadNote(lead_id=lead_id, note=payload.note, author=payload.author)
    db.add(note)
    await db.commit()
    await db.refresh(note)
    return LeadNoteResponse.model_validate(note)


# ---------------------------------------------------------------------------
# DELETE /api/leads/{lead_id}
# ---------------------------------------------------------------------------

@router.delete("/leads/{lead_id}", status_code=204)
async def delete_lead(lead_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.deleted_at.is_(None)))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead.deleted_at = datetime.now(timezone.utc)
    await db.commit()
