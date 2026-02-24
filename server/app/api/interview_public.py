"""Public interview routes — no auth required. Used by candidates."""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import Depends

from app.database import get_db
from app.models.interview import Interview
from app.models.organization import Organization
from app.models.role import InterviewRole
from app.models.transcript_message import TranscriptMessage
from app.schemas.base import CamelModel

logger = logging.getLogger(__name__)


class InterviewPublicResponse(CamelModel):
    """Public interview info for candidates."""
    interview_id: str
    role_title: str
    role_department: str
    candidate_name: str
    config_duration: int
    config_tone: str
    status: str
    org_name: str
    org_logo_url: str | None = None
    org_brand_color: str


class MessageRequest(BaseModel):
    text: str


class MessageResponse(CamelModel):
    id: str
    speaker: str
    text: str
    timestamp: str


router = APIRouter(prefix="/i", tags=["interview-public"])


@router.get("/{token}", response_model=InterviewPublicResponse)
async def get_interview(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> InterviewPublicResponse:
    """Get public interview info by token."""
    interview = await _get_interview_by_token(db, token)

    if interview.status in ("completed", "expired"):
        raise HTTPException(status_code=410, detail="This interview has expired or been completed")

    org = await db.get(Organization, interview.organization_id)
    role_result = await db.execute(
        select(InterviewRole).where(InterviewRole.id == interview.role_id)
    )
    role = role_result.scalar_one()

    return InterviewPublicResponse(
        interview_id=str(interview.id),
        role_title=role.title,
        role_department=role.department,
        candidate_name=interview.candidate.name,
        config_duration=interview.config_duration,
        config_tone=interview.config_tone,
        status=interview.status,
        org_name=org.name,
        org_logo_url=org.logo_url,
        org_brand_color=org.brand_color,
    )


@router.post("/{token}/start", response_model=InterviewPublicResponse)
async def start_interview(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> InterviewPublicResponse:
    """Start an interview — marks it as in_progress."""
    interview = await _get_interview_by_token(db, token)

    if interview.status == "completed":
        raise HTTPException(status_code=410, detail="This interview has already been completed")
    if interview.status == "expired":
        raise HTTPException(status_code=410, detail="This interview link has expired")

    interview.status = "in_progress"
    interview.started_at = datetime.now(timezone.utc)
    await db.flush()

    org = await db.get(Organization, interview.organization_id)
    role_result = await db.execute(
        select(InterviewRole).where(InterviewRole.id == interview.role_id)
    )
    role = role_result.scalar_one()

    logger.info("interview_started token=%s candidate=%s", token, interview.candidate.name)

    return InterviewPublicResponse(
        interview_id=str(interview.id),
        role_title=role.title,
        role_department=role.department,
        candidate_name=interview.candidate.name,
        config_duration=interview.config_duration,
        config_tone=interview.config_tone,
        status=interview.status,
        org_name=org.name,
        org_logo_url=org.logo_url,
        org_brand_color=org.brand_color,
    )


@router.post("/{token}/message", response_model=MessageResponse)
async def send_message(
    token: str,
    payload: MessageRequest,
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Send a candidate message and get an AI response."""
    interview = await _get_interview_by_token(db, token)

    if interview.status != "in_progress":
        raise HTTPException(status_code=400, detail="Interview is not in progress")

    msg_count_result = await db.execute(
        select(TranscriptMessage)
        .where(TranscriptMessage.interview_id == interview.id)
    )
    current_count = len(msg_count_result.scalars().all())

    candidate_msg = TranscriptMessage(
        interview_id=interview.id,
        speaker="candidate",
        text=payload.text,
        sort_order=current_count,
    )
    db.add(candidate_msg)
    await db.flush()
    await db.refresh(candidate_msg)

    # Simulated AI response (in production this would call an LLM)
    ai_responses = [
        "That's a great point. Can you elaborate on how you handled the scalability challenges?",
        "Interesting approach. How did you measure the impact of that decision?",
        "Tell me more about how you collaborated with the team on that project.",
        "How would you handle a similar situation if the constraints were different?",
        "What were the key trade-offs you considered in that design?",
    ]
    ai_text = ai_responses[current_count % len(ai_responses)]

    ai_msg = TranscriptMessage(
        interview_id=interview.id,
        speaker="ai",
        text=ai_text,
        sort_order=current_count + 1,
    )
    db.add(ai_msg)
    await db.flush()
    await db.refresh(ai_msg)

    return MessageResponse(
        id=str(ai_msg.id),
        speaker="ai",
        text=ai_text,
        timestamp=ai_msg.created_at.isoformat(),
    )


@router.post("/{token}/complete")
async def complete_interview(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Complete an interview."""
    interview = await _get_interview_by_token(db, token)

    if interview.status != "in_progress":
        raise HTTPException(status_code=400, detail="Interview is not in progress")

    interview.status = "completed"
    interview.completed_at = datetime.now(timezone.utc)
    if interview.started_at:
        interview.duration_seconds = int(
            (interview.completed_at - interview.started_at).total_seconds()
        )
    await db.flush()

    logger.info("interview_completed token=%s", token)
    return {"message": "Interview completed successfully"}


async def _get_interview_by_token(db: AsyncSession, token: str) -> Interview:
    """Fetch an interview by its unique token."""
    result = await db.execute(
        select(Interview)
        .options(selectinload(Interview.candidate))
        .where(Interview.token == token)
    )
    interview = result.scalar_one_or_none()
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview
