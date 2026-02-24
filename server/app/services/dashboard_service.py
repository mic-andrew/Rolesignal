"""Dashboard service."""

import logging
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_event import AuditEvent
from app.models.candidate import Candidate
from app.models.evaluation import Evaluation
from app.models.interview import Interview
from app.models.role import InterviewRole
from app.schemas.dashboard import (
    ActivityItem,
    DashboardMetrics,
    DashboardResponse,
    PipelineColumn,
    RoleOverview,
)

logger = logging.getLogger(__name__)

PIPELINE_STAGES = [
    {"stage": "invited", "label": "Invited", "color": "var(--color-ink3)"},
    {"stage": "scheduled", "label": "Scheduled", "color": "var(--color-brand2)"},
    {"stage": "inProgress", "label": "In Progress", "color": "var(--color-brand)"},
    {"stage": "completed", "label": "Completed", "color": "var(--color-success)"},
    {"stage": "reviewed", "label": "Reviewed", "color": "var(--color-warn)"},
]

STATUS_TO_STAGE = {
    "pending": "invited",
    "in_progress": "inProgress",
    "completed": "completed",
}


async def get_dashboard(db: AsyncSession, org_id: uuid.UUID) -> DashboardResponse:
    """Build the full dashboard response."""
    metrics = await _compute_metrics(db, org_id)
    pipeline = await _build_pipeline(db, org_id)
    roles = await _get_role_overviews(db, org_id)
    activity = await _get_activity(db, org_id)

    return DashboardResponse(
        metrics=metrics,
        pipeline=pipeline,
        roles=roles,
        activity=activity,
    )


async def _compute_metrics(db: AsyncSession, org_id: uuid.UUID) -> DashboardMetrics:
    active_roles = await db.scalar(
        select(func.count(InterviewRole.id)).where(
            InterviewRole.organization_id == org_id,
            InterviewRole.status == "live",
        )
    ) or 0

    week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    interviews_this_week = await db.scalar(
        select(func.count(Interview.id)).where(
            Interview.organization_id == org_id,
            Interview.created_at >= week_ago,
        )
    ) or 0

    avg_score = await db.scalar(
        select(func.avg(Evaluation.overall_score))
        .join(Interview, Evaluation.interview_id == Interview.id)
        .where(Interview.organization_id == org_id)
    ) or 0.0

    pending_reviews = await db.scalar(
        select(func.count(Candidate.id)).where(
            Candidate.organization_id == org_id,
            Candidate.status == "pending",
        )
    ) or 0

    return DashboardMetrics(
        active_roles=active_roles,
        interviews_this_week=interviews_this_week,
        avg_fit_score=round(avg_score, 1),
        pending_reviews=pending_reviews,
    )


async def _build_pipeline(db: AsyncSession, org_id: uuid.UUID) -> list[PipelineColumn]:
    result = await db.execute(
        select(Interview).where(Interview.organization_id == org_id)
    )
    interviews = result.scalars().all()

    stage_map: dict[str, list[str]] = {s["stage"]: [] for s in PIPELINE_STAGES}

    for interview in interviews:
        stage = STATUS_TO_STAGE.get(interview.status, "invited")
        if stage in stage_map:
            stage_map[stage].append(str(interview.candidate_id))

    # Candidates with status=reviewed but no interview go to "reviewed"
    reviewed_result = await db.execute(
        select(Candidate.id).where(
            Candidate.organization_id == org_id,
            Candidate.status.in_(["reviewed", "shortlisted"]),
        )
    )
    for (cid,) in reviewed_result:
        stage_map["reviewed"].append(str(cid))

    return [
        PipelineColumn(
            stage=s["stage"],
            label=s["label"],
            count=len(stage_map[s["stage"]]),
            color=s["color"],
            candidate_ids=stage_map[s["stage"]],
        )
        for s in PIPELINE_STAGES
    ]


async def _get_role_overviews(db: AsyncSession, org_id: uuid.UUID) -> list[RoleOverview]:
    result = await db.execute(
        select(InterviewRole)
        .where(
            InterviewRole.organization_id == org_id,
            InterviewRole.status != "closed",
        )
        .order_by(InterviewRole.created_at.desc())
        .limit(5)
    )
    roles = result.scalars().all()

    overviews = []
    for role in roles:
        candidate_count = await db.scalar(
            select(func.count(Candidate.id)).where(Candidate.role_id == role.id)
        ) or 0

        avg_score = await db.scalar(
            select(func.avg(Evaluation.overall_score))
            .join(Candidate, Evaluation.candidate_id == Candidate.id)
            .where(Candidate.role_id == role.id)
        ) or 0.0

        overviews.append(RoleOverview(
            id=str(role.id),
            title=role.title,
            department=role.department,
            candidate_count=candidate_count,
            avg_score=round(avg_score, 1),
            status=role.status,
        ))

    return overviews


async def _get_activity(db: AsyncSession, org_id: uuid.UUID) -> list[ActivityItem]:
    result = await db.execute(
        select(AuditEvent)
        .where(AuditEvent.organization_id == org_id)
        .order_by(AuditEvent.created_at.desc())
        .limit(10)
    )
    events = result.scalars().all()

    return [
        ActivityItem(
            id=str(e.id),
            emoji=e.emoji,
            text=f"{e.action}: {e.detail}" if e.detail else e.action,
            time_ago=_time_ago(e.created_at),
        )
        for e in events
    ]


def _time_ago(dt: datetime) -> str:
    now = datetime.now(timezone.utc)
    diff = now - (dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt)
    seconds = int(diff.total_seconds())
    if seconds < 60:
        return "just now"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes}m ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours}h ago"
    days = hours // 24
    return f"{days}d ago"
