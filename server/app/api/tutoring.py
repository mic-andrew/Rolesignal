"""Tutoring routes — AI tutoring sessions (text + voice)."""

import logging
import uuid as uuid_mod

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.tutoring import (
    RealtimeSessionResponse,
    SendMessageRequest,
    StartSessionRequest,
    TutoringMessageResponse,
    TutoringSessionResponse,
)
from app.services import tutoring_service, voice_tutoring_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tutoring", tags=["tutoring"])


@router.post("/sessions", response_model=TutoringSessionResponse, status_code=201)
async def start_session(
    payload: StartSessionRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TutoringSessionResponse:
    """Start a new tutoring session for a problem."""
    session = await tutoring_service.start_session(
        db,
        user.id,
        uuid_mod.UUID(payload.problem_id),
        voice_enabled=payload.voice_enabled,
    )
    return TutoringSessionResponse(
        id=str(session.id),
        problem_id=str(session.problem_id),
        started_at=session.started_at.isoformat(),
        ended_at=None,
        voice_enabled=session.voice_enabled,
    )


@router.post(
    "/sessions/{session_id}/message",
    response_model=TutoringMessageResponse,
)
async def send_message(
    session_id: str,
    payload: SendMessageRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TutoringMessageResponse:
    """Send a message in a tutoring session and get AI response."""
    try:
        ai_msg = await tutoring_service.send_message(
            db,
            uuid_mod.UUID(session_id),
            user.id,
            payload.content,
            payload.current_code,
            payload.language,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return TutoringMessageResponse(
        id=str(ai_msg.id),
        speaker=ai_msg.speaker,
        content=ai_msg.content,
        message_type=ai_msg.message_type,
        created_at=ai_msg.created_at.isoformat(),
    )


@router.get(
    "/sessions/{session_id}/messages",
    response_model=list[TutoringMessageResponse],
)
async def get_messages(
    session_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[TutoringMessageResponse]:
    """Get all messages for a tutoring session."""
    try:
        messages = await tutoring_service.get_session_messages(
            db, uuid_mod.UUID(session_id), user.id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return [
        TutoringMessageResponse(
            id=str(msg.id),
            speaker=msg.speaker,
            content=msg.content,
            message_type=msg.message_type,
            created_at=msg.created_at.isoformat(),
        )
        for msg in messages
    ]


@router.post(
    "/sessions/{session_id}/realtime-session",
    response_model=RealtimeSessionResponse,
)
async def get_realtime_session(
    session_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RealtimeSessionResponse:
    """Create an ephemeral OpenAI Realtime session for voice tutoring."""
    try:
        data = await voice_tutoring_service.create_voice_session(
            db, uuid_mod.UUID(session_id), user.id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except voice_tutoring_service.RealtimeSessionError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return RealtimeSessionResponse(
        client_secret=data["client_secret"],
        model=data["model"],
        voice=data["voice"],
        system_prompt=data["system_prompt"],
    )


@router.post("/sessions/{session_id}/end", response_model=TutoringSessionResponse)
async def end_session(
    session_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TutoringSessionResponse:
    """End a tutoring session."""
    try:
        session = await tutoring_service.end_session(
            db, uuid_mod.UUID(session_id), user.id,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return TutoringSessionResponse(
        id=str(session.id),
        problem_id=str(session.problem_id),
        started_at=session.started_at.isoformat(),
        ended_at=session.ended_at.isoformat() if session.ended_at else None,
        voice_enabled=session.voice_enabled,
    )
