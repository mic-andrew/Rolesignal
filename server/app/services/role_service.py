"""Role service."""

import logging
import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.candidate import Candidate
from app.models.criterion import Criterion
from app.models.evaluation import Evaluation
from app.models.role import InterviewRole
from app.schemas.roles import (
    CriterionResponse,
    RoleCreateRequest,
    RoleDetailResponse,
    RoleListResponse,
    RoleResponse,
    RoleUpdateRequest,
)
from app.services import audit_service

logger = logging.getLogger(__name__)


async def list_roles(db: AsyncSession, org_id: uuid.UUID) -> RoleListResponse:
    """List all roles for an organization with computed stats."""
    result = await db.execute(
        select(InterviewRole)
        .options(selectinload(InterviewRole.candidates))
        .where(
            InterviewRole.organization_id == org_id,
            InterviewRole.status != "closed",
        )
        .order_by(InterviewRole.created_at.desc())
    )
    roles = result.scalars().all()
    data = []
    for role in roles:
        avg_score = await _compute_avg_score(db, role.id)
        data.append(_to_response(role, len(role.candidates), avg_score))
    return RoleListResponse(data=data, count=len(data))


async def get_role(db: AsyncSession, org_id: uuid.UUID, role_id: str) -> RoleDetailResponse:
    """Get a single role with criteria."""
    result = await db.execute(
        select(InterviewRole)
        .options(selectinload(InterviewRole.criteria), selectinload(InterviewRole.candidates))
        .where(InterviewRole.id == role_id, InterviewRole.organization_id == org_id)
    )
    role = result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")

    avg_score = await _compute_avg_score(db, role.id)
    criteria = sorted(role.criteria, key=lambda c: c.sort_order)
    return RoleDetailResponse(
        **_to_response(role, len(role.candidates), avg_score).model_dump(),
        criteria=[_criterion_to_response(c) for c in criteria],
    )


async def create_role(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID, payload: RoleCreateRequest
) -> RoleDetailResponse:
    """Create a new role with criteria."""
    role = InterviewRole(
        organization_id=org_id,
        title=payload.title,
        department=payload.department,
        seniority=payload.seniority,
        location=payload.location,
        description=payload.description,
        status="live",
    )
    db.add(role)
    await db.flush()

    criteria = []
    for i, c in enumerate(payload.criteria):
        criterion = Criterion(
            role_id=role.id,
            name=c.name,
            description=c.description,
            weight=c.weight,
            question_count=c.question_count,
            color=c.color,
            sort_order=i,
        )
        db.add(criterion)
        criteria.append(criterion)
    await db.flush()

    await audit_service.log_event(
        db, org_id, user_id, "human", "Role Created",
        f"Created role: {role.title}", "📋",
    )

    logger.info("role_created id=%s title=%s org_id=%s", role.id, role.title, org_id)
    return RoleDetailResponse(
        **_to_response(role, 0, 0.0).model_dump(),
        criteria=[_criterion_to_response(c) for c in criteria],
    )


async def update_role(
    db: AsyncSession, org_id: uuid.UUID, role_id: str, payload: RoleUpdateRequest
) -> RoleResponse:
    """Update a role."""
    result = await db.execute(
        select(InterviewRole)
        .options(selectinload(InterviewRole.candidates))
        .where(InterviewRole.id == role_id, InterviewRole.organization_id == org_id)
    )
    role = result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(role, field, value)
    await db.flush()

    avg_score = await _compute_avg_score(db, role.id)
    return _to_response(role, len(role.candidates), avg_score)


async def delete_role(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID, role_id: str
) -> None:
    """Soft-delete a role by setting status to closed."""
    result = await db.execute(
        select(InterviewRole)
        .where(InterviewRole.id == role_id, InterviewRole.organization_id == org_id)
    )
    role = result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")

    role.status = "closed"
    await db.flush()

    await audit_service.log_event(
        db, org_id, user_id, "human", "Role Closed",
        f"Closed role: {role.title}", "🗑️",
    )


async def _compute_avg_score(db: AsyncSession, role_id: uuid.UUID) -> float:
    result = await db.scalar(
        select(func.avg(Evaluation.overall_score))
        .join(Candidate, Evaluation.candidate_id == Candidate.id)
        .where(Candidate.role_id == role_id)
    )
    return round(result or 0.0, 1)


def _days_since(dt: datetime) -> int:
    now = datetime.now(timezone.utc)
    dt_aware = dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt
    return (now - dt_aware).days


def _to_response(
    role: InterviewRole, candidate_count: int, avg_score: float
) -> RoleResponse:
    return RoleResponse(
        id=str(role.id),
        title=role.title,
        department=role.department,
        seniority=role.seniority,
        location=role.location,
        description=role.description,
        status=role.status,
        candidate_count=candidate_count,
        avg_score=avg_score,
        days_ago=_days_since(role.created_at),
    )


def _criterion_to_response(c: Criterion) -> CriterionResponse:
    return CriterionResponse(
        id=str(c.id),
        name=c.name,
        description=c.description,
        weight=c.weight,
        question_count=c.question_count,
        color=c.color,
        sort_order=c.sort_order,
    )
