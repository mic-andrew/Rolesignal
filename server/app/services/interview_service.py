"""Interview service."""

import logging
import secrets
import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.models.candidate import Candidate
from app.models.interview import Interview
from app.models.role import InterviewRole
from app.models.transcript_message import TranscriptMessage
from app.models.criterion import Criterion
from app.models.sub_criterion import SubCriterion
from app.schemas.interviews import (
    AddCandidateRequest,
    InterviewCreateRequest,
    InterviewDetailResponse,
    InterviewLaunchRequest,
    InterviewLaunchResponse,
    InterviewListResponse,
    InterviewResponse,
    InterviewUpdateRequest,
    LaunchInterviewItem,
    LiveCountResponse,
    TranscriptMessageResponse,
)
from app.services import audit_service, email_service

logger = logging.getLogger(__name__)


async def list_interviews(
    db: AsyncSession,
    org_id: uuid.UUID,
    *,
    role_id: str | None = None,
    status: str | None = None,
) -> InterviewListResponse:
    """List interviews for an organization."""
    query = (
        select(Interview)
        .options(
            selectinload(Interview.candidate),
            selectinload(Interview.candidate).selectinload(Candidate.role),
        )
        .where(Interview.organization_id == org_id)
    )
    if role_id:
        query = query.where(Interview.role_id == role_id)
    if status:
        query = query.where(Interview.status == status)
    query = query.order_by(Interview.created_at.desc())

    result = await db.execute(query)
    interviews = result.scalars().all()
    data = [_to_response(i) for i in interviews]
    return InterviewListResponse(data=data, count=len(data))


async def get_interview(
    db: AsyncSession, org_id: uuid.UUID, interview_id: str
) -> InterviewDetailResponse:
    """Get a single interview with transcript."""
    result = await db.execute(
        select(Interview)
        .options(
            selectinload(Interview.candidate),
            selectinload(Interview.candidate).selectinload(Candidate.role),
            selectinload(Interview.transcript_messages),
        )
        .where(Interview.id == interview_id, Interview.organization_id == org_id)
    )
    interview = result.scalar_one_or_none()
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")

    messages = sorted(interview.transcript_messages, key=lambda m: m.sort_order)
    return InterviewDetailResponse(
        **_to_response(interview).model_dump(),
        transcript=[_message_to_response(m) for m in messages],
    )


async def create_interview(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID, payload: InterviewCreateRequest
) -> InterviewResponse:
    """Create a new interview and generate a unique token link."""
    candidate_result = await db.execute(
        select(Candidate)
        .options(selectinload(Candidate.role))
        .where(
            Candidate.id == payload.candidate_id,
            Candidate.organization_id == org_id,
        )
    )
    candidate = candidate_result.scalar_one_or_none()
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    token = secrets.token_urlsafe(32)
    interview = Interview(
        candidate_id=uuid.UUID(payload.candidate_id),
        role_id=uuid.UUID(payload.role_id),
        organization_id=org_id,
        token=token,
        status="pending",
        config_duration=payload.config_duration,
        config_tone=payload.config_tone,
        config_adaptive=payload.config_adaptive,
    )
    db.add(interview)
    await db.flush()
    await db.refresh(interview)

    # Attach candidate for response building
    interview.candidate = candidate

    await audit_service.log_event(
        db, org_id, user_id, "human", "Interview Created",
        f"Created interview for {candidate.name}", "🎤",
    )

    logger.info("interview_created id=%s candidate=%s", interview.id, candidate.name)
    return _to_response(interview)


async def complete_interview(
    db: AsyncSession, org_id: uuid.UUID, interview_id: str
) -> None:
    """Mark an interview as completed."""
    result = await db.execute(
        select(Interview).where(
            Interview.id == interview_id, Interview.organization_id == org_id
        )
    )
    interview = result.scalar_one_or_none()
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview.status = "completed"
    interview.completed_at = datetime.now(timezone.utc)
    if interview.started_at:
        interview.duration_seconds = int(
            (interview.completed_at - interview.started_at).total_seconds()
        )
    await db.flush()


async def delete_interview(
    db: AsyncSession,
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    interview_id: str,
) -> None:
    """Delete an interview and its associated transcript messages."""
    result = await db.execute(
        select(Interview)
        .options(selectinload(Interview.candidate))
        .where(
            Interview.id == interview_id,
            Interview.organization_id == org_id,
        )
    )
    interview = result.scalar_one_or_none()
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")

    candidate_name = interview.candidate.name if interview.candidate else "Unknown"
    await db.delete(interview)
    await db.flush()

    await audit_service.log_event(
        db, org_id, user_id, "human", "Interview Deleted",
        f"Deleted interview for {candidate_name}", "🗑️",
    )
    logger.info("interview_deleted id=%s candidate=%s", interview_id, candidate_name)


async def get_live_count(db: AsyncSession, org_id: uuid.UUID) -> LiveCountResponse:
    """Get the count of currently live interviews."""
    count = await db.scalar(
        select(func.count(Interview.id)).where(
            Interview.organization_id == org_id,
            Interview.status == "in_progress",
        )
    )
    return LiveCountResponse(count=count or 0)


async def add_candidate_to_role(
    db: AsyncSession,
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    role_id: str,
    payload: AddCandidateRequest,
) -> InterviewResponse:
    """Add a candidate to an existing role and create their interview."""
    result = await db.execute(
        select(InterviewRole).where(
            InterviewRole.id == role_id,
            InterviewRole.organization_id == org_id,
        )
    )
    role = result.scalar_one_or_none()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")

    # Check for duplicate email on this role
    dup_result = await db.execute(
        select(Candidate).where(
            Candidate.role_id == role.id,
            Candidate.email == payload.email.strip().lower(),
        )
    )
    if dup_result.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=409, detail="Candidate with this email already exists for this role"
        )

    initials = _make_initials(payload.name)
    candidate = Candidate(
        role_id=role.id,
        organization_id=org_id,
        name=payload.name.strip(),
        initials=initials,
        email=payload.email.strip().lower(),
        status="pending",
    )
    db.add(candidate)
    await db.flush()

    token = secrets.token_urlsafe(32)
    interview = Interview(
        candidate_id=candidate.id,
        role_id=role.id,
        organization_id=org_id,
        token=token,
        status="pending",
        config_duration=payload.config_duration,
        config_tone=payload.config_tone,
        config_adaptive=payload.config_adaptive,
    )
    db.add(interview)
    await db.flush()

    link = f"{settings.frontend_url}/i/{token}"
    sent = await email_service.send_interview_email(
        to=candidate.email,
        candidate_name=candidate.name,
        role_title=role.title,
        interview_link=link,
        duration=payload.config_duration,
    )

    # Attach for response
    candidate.role = role
    interview.candidate = candidate

    await audit_service.log_event(
        db, org_id, user_id, "human", "Candidate Added",
        f"Added {candidate.name} to '{role.title}'", "👤",
    )

    logger.info(
        "candidate_added role=%s candidate=%s email_sent=%s",
        role.id, candidate.name, sent,
    )
    return _to_response(interview)


async def update_interview(
    db: AsyncSession,
    org_id: uuid.UUID,
    interview_id: str,
    payload: InterviewUpdateRequest,
) -> InterviewResponse:
    """Update interview configuration."""
    result = await db.execute(
        select(Interview)
        .options(
            selectinload(Interview.candidate),
            selectinload(Interview.candidate).selectinload(Candidate.role),
        )
        .where(Interview.id == interview_id, Interview.organization_id == org_id)
    )
    interview = result.scalar_one_or_none()
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview.status not in ("pending",):
        raise HTTPException(
            status_code=400,
            detail="Can only update pending interviews",
        )

    if payload.config_duration is not None:
        interview.config_duration = payload.config_duration
    if payload.config_tone is not None:
        interview.config_tone = payload.config_tone
    if payload.config_adaptive is not None:
        interview.config_adaptive = payload.config_adaptive
    await db.flush()

    logger.info("interview_updated id=%s", interview_id)
    return _to_response(interview)


def _to_response(interview: Interview) -> InterviewResponse:
    candidate = interview.candidate
    role_title = candidate.role.title if candidate and candidate.role else ""
    candidate_name = candidate.name if candidate else ""
    link = f"{settings.frontend_url}/i/{interview.token}"

    return InterviewResponse(
        id=str(interview.id),
        candidate_id=str(interview.candidate_id),
        role_id=str(interview.role_id),
        token=interview.token,
        status=interview.status,
        duration_seconds=interview.duration_seconds,
        config_duration=interview.config_duration,
        config_tone=interview.config_tone,
        config_adaptive=interview.config_adaptive,
        started_at=interview.started_at.isoformat() if interview.started_at else None,
        completed_at=interview.completed_at.isoformat() if interview.completed_at else None,
        candidate_name=candidate_name,
        role_title=role_title,
        link=link,
    )


async def launch_interviews(
    db: AsyncSession,
    org_id: uuid.UUID,
    user_id: uuid.UUID,
    payload: InterviewLaunchRequest,
) -> InterviewLaunchResponse:
    """End-to-end: create role, criteria, candidates, interviews.

    Sends invitation emails via Resend for each candidate.
    """
    # 1. Create the role
    role = InterviewRole(
        organization_id=org_id,
        title=payload.title,
        department=payload.department,
        seniority=payload.seniority,
        location="",
        description=payload.description,
        status="live",
    )
    db.add(role)
    await db.flush()

    # 2. Create criteria + sub-criteria
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
        await db.flush()

        for j, sc in enumerate(c.sub_criteria):
            db.add(SubCriterion(
                criterion_id=criterion.id,
                name=sc.name,
                description=sc.description,
                weight=sc.weight,
                sort_order=j,
            ))
    await db.flush()

    # 3. Create candidates + interviews + send emails
    items: list[LaunchInterviewItem] = []
    emails_sent = 0

    for candidate_input in payload.candidates:
        initials = _make_initials(candidate_input.name)
        candidate = Candidate(
            role_id=role.id,
            organization_id=org_id,
            name=candidate_input.name,
            initials=initials,
            email=candidate_input.email,
            status="pending",
        )
        db.add(candidate)
        await db.flush()

        token = secrets.token_urlsafe(32)
        interview = Interview(
            candidate_id=candidate.id,
            role_id=role.id,
            organization_id=org_id,
            token=token,
            status="pending",
            config_duration=payload.config_duration,
            config_tone=payload.config_tone,
            config_adaptive=payload.config_adaptive,
        )
        db.add(interview)
        await db.flush()

        link = f"{settings.frontend_url}/i/{token}"

        sent = await email_service.send_interview_email(
            to=candidate_input.email,
            candidate_name=candidate_input.name,
            role_title=payload.title,
            interview_link=link,
            duration=payload.config_duration,
        )
        if sent:
            emails_sent += 1

        items.append(LaunchInterviewItem(
            id=str(interview.id),
            candidate_name=candidate_input.name,
            candidate_email=candidate_input.email,
            link=link,
            email_sent=sent,
        ))

    await audit_service.log_event(
        db, org_id, user_id, "human",
        "Interviews Launched",
        (
            f"Created role '{payload.title}' with "
            f"{len(items)} interview(s)"
        ),
        "🚀",
    )

    n = len(items)
    if emails_sent == n and n > 0:
        msg = f"Created {n} interview(s). Emails sent."
    elif emails_sent > 0:
        msg = (
            f"Created {n} interview(s). "
            f"{emails_sent} email(s) sent."
        )
    elif n > 0:
        msg = (
            f"Created {n} interview(s). "
            "Email sending not configured."
        )
    else:
        msg = "Role created with no candidates."

    logger.info(
        "interviews_launched role=%s count=%s emails=%s",
        role.id, n, emails_sent,
    )

    return InterviewLaunchResponse(
        role_id=str(role.id),
        interviews=items,
        message=msg,
    )


def _make_initials(name: str) -> str:
    parts = name.strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return name[:2].upper() if name else "??"


def _message_to_response(
    m: TranscriptMessage,
) -> TranscriptMessageResponse:
    return TranscriptMessageResponse(
        id=str(m.id),
        speaker=m.speaker,
        text=m.text,
        timestamp=m.created_at.isoformat(),
    )
