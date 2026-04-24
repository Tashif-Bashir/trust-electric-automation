from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Lead
from schemas import LeadStats

router = APIRouter(tags=["Stats"])

STATUSES = ["new", "contacted", "qualified", "quoted", "converted", "lost"]


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
    converted = await count(base.where(Lead.status == "converted"))

    by_status: dict[str, int] = {}
    for s in STATUSES:
        by_status[s] = await count(base.where(Lead.status == s))

    conversion_rate = round((converted / total * 100), 1) if total > 0 else 0.0

    # Average hours from created_at to contacted_at for leads that have been contacted
    avg_result = await db.execute(
        select(
            func.avg(
                func.extract(
                    "epoch",
                    Lead.contacted_at - Lead.created_at,
                )
            )
        ).where(Lead.deleted_at.is_(None), Lead.contacted_at.is_not(None))
    )
    avg_seconds = avg_result.scalar_one()
    avg_hours = round(avg_seconds / 3600, 1) if avg_seconds else 0.0

    return LeadStats(
        total_leads=total,
        leads_today=today,
        leads_this_week=this_week,
        leads_this_month=this_month,
        conversion_rate=conversion_rate,
        average_response_time_hours=avg_hours,
        by_status=by_status,
    )


@router.get("/leads/monthly")
async def get_monthly_leads(
    months: int = Query(6, ge=1, le=12),
    db: AsyncSession = Depends(get_db),
):
    """Return lead counts grouped by month for the last N months."""
    now = datetime.now(timezone.utc)
    result = []
    for i in range(months - 1, -1, -1):
        # First day of the target month
        target = (now.replace(day=1) - timedelta(days=i * 28)).replace(day=1)
        # First day of the following month
        if target.month == 12:
            next_month = target.replace(year=target.year + 1, month=1)
        else:
            next_month = target.replace(month=target.month + 1)

        r = await db.execute(
            select(func.count()).select_from(
                select(Lead)
                .where(
                    Lead.deleted_at.is_(None),
                    Lead.created_at >= target,
                    Lead.created_at < next_month,
                )
                .subquery()
            )
        )
        result.append({
            "month": target.strftime("%b %Y"),
            "leads": r.scalar_one(),
        })
    return result
