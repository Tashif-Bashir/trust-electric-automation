from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Lead
from schemas import LeadStats

router = APIRouter(tags=["Stats"])


@router.get("/leads/stats", response_model=LeadStats)
async def get_stats(db: AsyncSession = Depends(get_db)):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=today_start.weekday())
    month_start = today_start.replace(day=1)

    base = select(Lead).where(Lead.deleted_at.is_(None))

    async def count(query) -> int:
        r = await db.execute(select(func.count()).select_from(query.subquery()))
        return r.scalar_one()

    total = await count(base)
    today = await count(base.where(Lead.created_at >= today_start))
    this_week = await count(base.where(Lead.created_at >= week_start))
    this_month = await count(base.where(Lead.created_at >= month_start))
    new_leads = await count(base.where(Lead.status == "new"))
    contacted = await count(base.where(Lead.status == "contacted"))
    qualified = await count(base.where(Lead.status == "qualified"))
    converted = await count(base.where(Lead.status == "converted"))
    lost = await count(base.where(Lead.status == "lost"))

    conversion_rate = round((converted / total * 100), 1) if total > 0 else 0.0

    return LeadStats(
        total_leads=total,
        leads_today=today,
        leads_this_week=this_week,
        leads_this_month=this_month,
        conversion_rate=conversion_rate,
        new_leads=new_leads,
        contacted_leads=contacted,
        qualified_leads=qualified,
        converted_leads=converted,
        lost_leads=lost,
    )
