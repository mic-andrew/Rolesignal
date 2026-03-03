"""Voice tutoring service — OpenAI Realtime API for voice-based tutoring.

Creates ephemeral sessions for WebRTC-based voice tutoring.
The actual voice conversation happens directly between the browser
and OpenAI — no server proxy needed.
"""

import logging
import uuid

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.config import settings
from app.models.problem import Problem
from app.models.tutoring_session import TutoringSession
from app.services.tutoring_prompts import TUTOR_VOICE_SYSTEM

logger = logging.getLogger(__name__)

_REALTIME_SESSION_URL = "https://api.openai.com/v1/realtime/sessions"


class RealtimeSessionError(Exception):
    """Raised when ephemeral session creation fails."""


async def create_voice_session(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
) -> dict:
    """Create an ephemeral OpenAI Realtime session for voice tutoring.

    Returns dict with client_secret, model, voice, and system_prompt.
    The frontend uses client_secret to establish a WebRTC peer connection.
    """
    # Verify session ownership
    result = await db.execute(
        select(TutoringSession).where(
            TutoringSession.id == session_id,
            TutoringSession.user_id == user_id,
        ),
    )
    session = result.scalar_one_or_none()
    if not session:
        raise ValueError("Tutoring session not found")
    if session.ended_at:
        raise ValueError("Tutoring session has ended")

    # Get problem context for system prompt
    problem_result = await db.execute(
        select(Problem).where(Problem.id == session.problem_id),
    )
    problem = problem_result.scalar_one_or_none()
    if not problem:
        raise ValueError("Problem not found")

    system_prompt = _build_voice_prompt(problem)

    # Create ephemeral OpenAI Realtime session
    realtime_data = await _create_realtime_session(system_prompt)

    logger.info(
        "voice_tutoring_session_created session_id=%s problem=%s",
        session_id, problem.slug,
    )

    return {
        "client_secret": realtime_data["client_secret"],
        "model": realtime_data["model"],
        "voice": realtime_data["voice"],
        "system_prompt": system_prompt,
    }


def _build_voice_prompt(problem: Problem) -> str:
    """Build voice tutoring system prompt from problem context."""
    return TUTOR_VOICE_SYSTEM.format(
        problem_title=problem.title,
        difficulty=problem.difficulty,
        problem_description=problem.description,
        constraints=problem.constraints or "None specified",
    )


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.5, min=1, max=10),
    retry=retry_if_exception_type(
        (httpx.TimeoutException, httpx.ConnectError),
    ),
)
async def _create_realtime_session(system_prompt: str) -> dict:
    """Create an ephemeral OpenAI Realtime session for WebRTC."""
    if not settings.openai_realtime_api_key:
        raise RealtimeSessionError(
            "OPENAI_REALTIME_API_KEY not configured. "
            "Set it in your .env for voice tutoring.",
        )

    selected_voice = settings.openai_realtime_voice

    async with httpx.AsyncClient(timeout=15.0) as http:
        response = await http.post(
            _REALTIME_SESSION_URL,
            headers={
                "Authorization": f"Bearer {settings.openai_realtime_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.openai_realtime_model,
                "voice": selected_voice,
                "instructions": system_prompt,
                "input_audio_transcription": {
                    "model": "whisper-1",
                },
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 500,
                },
            },
        )

    if response.status_code == 429:
        logger.warning("openai_realtime_rate_limited")
        raise RealtimeSessionError(
            "OpenAI Realtime rate limit reached. Please try again shortly.",
        )

    if response.status_code != 200:
        logger.error(
            "openai_realtime_session_failed status=%d body=%s",
            response.status_code,
            response.text[:500],
        )
        raise RealtimeSessionError(
            f"Failed to create Realtime session: HTTP {response.status_code}",
        )

    data = response.json()
    logger.info(
        "realtime_session_created model=%s voice=%s",
        settings.openai_realtime_model,
        selected_voice,
    )

    return {
        "client_secret": data["client_secret"]["value"],
        "model": settings.openai_realtime_model,
        "voice": selected_voice,
    }
