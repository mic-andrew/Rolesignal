"""Candidate service."""

import logging
import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.candidate import Candidate
from app.models.evaluation import Evaluation
from app.models.criterion_score import CriterionScore
from app.models.interview import Interview
from app.models.role import InterviewRole
from app.schemas.candidates import (
    CandidateCreateRequest,
    CandidateListResponse,
    CandidateResponse,
    CandidateSkills,
    CandidateUpdateRequest,
)
from app.services import audit_service

logger = logging.getLogger(__name__)


async def list_candidates(
    db: AsyncSession, org_id: uuid.UUID, *, role_id: str | None = None
) -> CandidateListResponse:
    """List candidates for an organization, optionally filtered by role."""
    query = (
        select(Candidate)
        .options(selectinload(Candidate.role))
        .where(Candidate.organization_id == org_id)
    )
    if role_id:
        query = query.where(Candidate.role_id == role_id)
    query = query.order_by(Candidate.created_at.desc())

    result = await db.execute(query)
    candidates = result.scalars().all()

    data = []
    for c in candidates:
        score, duration, skills = await _compute_candidate_stats(db, c.id)
        data.append(_to_response(c, score, duration, skills))

    return CandidateListResponse(data=data, count=len(data))


async def get_candidate(
    db: AsyncSession, org_id: uuid.UUID, candidate_id: str
) -> CandidateResponse:
    """Get a single candidate."""
    result = await db.execute(
        select(Candidate)
        .options(selectinload(Candidate.role))
        .where(Candidate.id == candidate_id, Candidate.organization_id == org_id)
    )
    c = result.scalar_one_or_none()
    if c is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    score, duration, skills = await _compute_candidate_stats(db, c.id)
    return _to_response(c, score, duration, skills)


async def create_candidate(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID, payload: CandidateCreateRequest
) -> CandidateResponse:
    """Create a new candidate."""
    role_result = await db.execute(
        select(InterviewRole).where(
            InterviewRole.id == payload.role_id,
            InterviewRole.organization_id == org_id,
        )
    )
    role = role_result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")

    initials = _make_initials(payload.name)
    candidate = Candidate(
        role_id=uuid.UUID(payload.role_id),
        organization_id=org_id,
        name=payload.name,
        initials=initials,
        email=payload.email,
        status="pending",
        color=payload.color,
    )
    db.add(candidate)
    await db.flush()
    await db.refresh(candidate)

    await audit_service.log_event(
        db, org_id, user_id, "human", "Candidate Added",
        f"Added candidate: {candidate.name} for {role.title}", "👤",
    )

    logger.info("candidate_created id=%s name=%s", candidate.id, candidate.name)
    return _to_response(candidate, 0.0, 0, CandidateSkills(), role_title=role.title)


async def update_candidate(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID,
    candidate_id: str, payload: CandidateUpdateRequest,
) -> CandidateResponse:
    """Update a candidate."""
    result = await db.execute(
        select(Candidate)
        .options(selectinload(Candidate.role))
        .where(Candidate.id == candidate_id, Candidate.organization_id == org_id)
    )
    c = result.scalar_one_or_none()
    if c is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(c, field, value)
    await db.flush()

    score, duration, skills = await _compute_candidate_stats(db, c.id)

    if payload.status:
        await audit_service.log_event(
            db, org_id, user_id, "human", "Status Changed",
            f"{c.name} status changed to {payload.status}", "🔄",
        )

    return _to_response(c, score, duration, skills)


async def delete_candidate(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID, candidate_id: str
) -> None:
    """Delete a candidate."""
    result = await db.execute(
        select(Candidate).where(
            Candidate.id == candidate_id, Candidate.organization_id == org_id
        )
    )
    c = result.scalar_one_or_none()
    if c is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    await audit_service.log_event(
        db, org_id, user_id, "human", "Candidate Removed",
        f"Removed candidate: {c.name}", "🗑️",
    )
    await db.delete(c)
    await db.flush()


async def _compute_candidate_stats(
    db: AsyncSession, candidate_id: uuid.UUID
) -> tuple[float, int, CandidateSkills]:
    """Compute score, duration, and skills from the latest evaluation."""
    eval_result = await db.execute(
        select(Evaluation)
        .options(selectinload(Evaluation.criterion_scores).selectinload(CriterionScore.criterion))
        .join(Interview, Evaluation.interview_id == Interview.id)
        .where(Evaluation.candidate_id == candidate_id)
        .order_by(Interview.completed_at.desc())
        .limit(1)
    )
    evaluation = eval_result.scalar_one_or_none()

    if evaluation is None:
        return 0.0, 0, CandidateSkills()

    interview_result = await db.execute(
        select(Interview).where(Interview.id == evaluation.interview_id)
    )
    interview = interview_result.scalar_one_or_none()
    duration = interview.duration_seconds or 0 if interview else 0

    scores = {cs.criterion.name.lower(): cs.score for cs in evaluation.criterion_scores if cs.criterion}
    skills = CandidateSkills(
        tech=scores.get("system design", scores.get("react & typescript", 0.0)),
        behavioral=scores.get("team collaboration", 0.0),
        communication=scores.get("team collaboration", 0.0),
        problem_solving=scores.get("problem solving", 0.0),
        culture=scores.get("team collaboration", 0.0),
    )

    return evaluation.overall_score, duration, skills


def _make_initials(name: str) -> str:
    parts = name.strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return name[:2].upper()


def _to_response(
    c: Candidate,
    score: float,
    duration: int,
    skills: CandidateSkills,
    role_title: str | None = None,
) -> CandidateResponse:
    return CandidateResponse(
        id=str(c.id),
        name=c.name,
        initials=c.initials,
        email=c.email,
        score=score,
        status=c.status,
        date=c.created_at.isoformat(),
        skills=skills,
        color=c.color,
        role=role_title or (c.role.title if c.role else ""),
        role_id=str(c.role_id),
        duration=duration,
    )
