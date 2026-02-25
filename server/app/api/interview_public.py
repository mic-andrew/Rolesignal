"""Public interview routes — no auth required. Used by candidates."""

import asyncio
import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import async_session_factory, get_db
from app.models.interview import Interview
from app.models.organization import Organization
from app.models.role import InterviewRole
from app.models.transcript_message import TranscriptMessage
from app.schemas.base import CamelModel
from app.services import interview_prompt_service, voice_interview_service

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


class RealtimeSessionResponse(CamelModel):
    """Ephemeral OpenAI Realtime session for WebRTC voice."""
    client_secret: str
    model: str
    voice: str
    system_prompt: str


class TranscriptMessageInput(BaseModel):
    speaker: str
    text: str
    sort_order: int


class TranscriptBatchRequest(BaseModel):
    messages: list[TranscriptMessageInput]


router = APIRouter(prefix="/i", tags=["interview-public"])


@router.get("/{token}", response_model=InterviewPublicResponse)
async def get_interview(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> InterviewPublicResponse:
    """Get public interview info by token."""
    interview = await _get_interview_by_token(db, token)

    if interview.status in ("completed", "evaluating", "evaluated", "expired"):
        raise HTTPException(
            status_code=410,
            detail="This interview has expired or been completed",
        )

    org = await db.get(Organization, interview.organization_id)
    role_result = await db.execute(
        select(InterviewRole).where(
            InterviewRole.id == interview.role_id
        )
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


@router.post(
    "/{token}/start",
    response_model=InterviewPublicResponse,
)
async def start_interview(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> InterviewPublicResponse:
    """Start an interview — marks it as in_progress."""
    interview = await _get_interview_by_token(db, token)

    if interview.status == "completed":
        raise HTTPException(
            status_code=410,
            detail="This interview has already been completed",
        )
    if interview.status == "expired":
        raise HTTPException(
            status_code=410,
            detail="This interview link has expired",
        )

    interview.status = "in_progress"
    interview.started_at = datetime.now(timezone.utc)
    await db.flush()

    org = await db.get(Organization, interview.organization_id)
    role_result = await db.execute(
        select(InterviewRole).where(
            InterviewRole.id == interview.role_id
        )
    )
    role = role_result.scalar_one()

    logger.info(
        "interview_started token=%s candidate=%s",
        token, interview.candidate.name,
    )

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
    """Send a candidate message and get an AI response.

    Note: This endpoint is kept for text-based fallback.
    Voice interviews use OpenAI Realtime via WebRTC.
    """
    interview = await _get_interview_by_token(db, token)

    if interview.status != "in_progress":
        raise HTTPException(
            status_code=400, detail="Interview is not in progress"
        )

    msg_count_result = await db.execute(
        select(TranscriptMessage).where(
            TranscriptMessage.interview_id == interview.id
        )
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

    # Simulated AI response (text fallback when voice is unavailable)
    ai_responses = [
        "That's a great point. Can you elaborate on how you "
        "handled the scalability challenges?",
        "Interesting approach. How did you measure the impact "
        "of that decision?",
        "Tell me more about how you collaborated with the team "
        "on that project.",
        "How would you handle a similar situation if the "
        "constraints were different?",
        "What were the key trade-offs you considered in "
        "that design?",
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


@router.post(
    "/{token}/realtime-session",
    response_model=RealtimeSessionResponse,
)
async def get_realtime_session(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> RealtimeSessionResponse:
    """Get an ephemeral OpenAI Realtime session for WebRTC voice."""
    interview = await _get_interview_by_token(db, token)

    if interview.status not in ("pending", "in_progress"):
        raise HTTPException(
            status_code=400, detail="Interview is not active"
        )

    system_prompt = (
        await interview_prompt_service.build_interview_system_prompt(
            db, str(interview.id)
        )
    )

    try:
        session = (
            await voice_interview_service.create_realtime_session(
                system_prompt=system_prompt,
            )
        )
    except voice_interview_service.RealtimeSessionError as exc:
        logger.error(
            "realtime_session_error token=%s error=%s",
            token[:8], str(exc),
        )
        raise HTTPException(
            status_code=502, detail=str(exc),
        ) from exc

    return RealtimeSessionResponse(
        **session,
        system_prompt=system_prompt,
    )


@router.post("/{token}/transcript")
async def save_transcript(
    token: str,
    payload: TranscriptBatchRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Save transcript messages from the voice interview."""
    interview = await _get_interview_by_token(db, token)

    for msg in payload.messages:
        db.add(TranscriptMessage(
            interview_id=interview.id,
            speaker=msg.speaker,
            text=msg.text,
            sort_order=msg.sort_order,
        ))
    await db.flush()

    logger.info(
        "transcript_saved token=%s count=%s",
        token[:8], len(payload.messages),
    )
    return {"message": f"Saved {len(payload.messages)} messages"}


@router.post("/{token}/complete")
async def complete_interview(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Complete an interview and trigger async evaluation."""
    interview = await _get_interview_by_token(db, token)

    if interview.status != "in_progress":
        raise HTTPException(
            status_code=400, detail="Interview is not in progress"
        )

    interview.status = "completed"
    interview.completed_at = datetime.now(timezone.utc)
    if interview.started_at:
        interview.duration_seconds = int(
            (
                interview.completed_at - interview.started_at
            ).total_seconds()
        )
    await db.flush()

    # Trigger async evaluation (fire and forget with new session)
    asyncio.create_task(
        _run_evaluation(interview.id)
    )

    logger.info(
        "interview_completed_evaluation_queued token=%s", token
    )
    return {"message": "Interview completed. Evaluation started."}


async def _run_evaluation(interview_id: uuid.UUID) -> None:
    """Run evaluation in a background task with its own DB session."""
    from app.services import evaluation_engine

    async with async_session_factory() as session:
        try:
            await evaluation_engine.evaluate_interview(
                session, interview_id
            )
            await session.commit()
        except Exception:
            await session.rollback()
            logger.exception(
                "background_evaluation_failed id=%s",
                interview_id,
            )


async def _get_interview_by_token(
    db: AsyncSession, token: str
) -> Interview:
    """Fetch an interview by its unique token."""
    result = await db.execute(
        select(Interview)
        .options(selectinload(Interview.candidate))
        .where(Interview.token == token)
    )
    interview = result.scalar_one_or_none()
    if interview is None:
        raise HTTPException(
            status_code=404, detail="Interview not found"
        )
    return interview
