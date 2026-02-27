"""Voice interview service using OpenAI Realtime API.

Creates ephemeral sessions for WebRTC-based voice interviews.
The actual voice conversation happens directly between the browser
and OpenAI — no server proxy needed.
"""

import logging

import httpx
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.config import settings

logger = logging.getLogger(__name__)

_REALTIME_SESSION_URL = "https://api.openai.com/v1/realtime/sessions"


class RealtimeSessionError(Exception):
    """Raised when ephemeral session creation fails."""


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=0.5, min=1, max=10),
    retry=retry_if_exception_type(
        (httpx.TimeoutException, httpx.ConnectError),
    ),
)
async def create_realtime_session(
    system_prompt: str,
    voice: str | None = None,
) -> dict:
    """Create an ephemeral OpenAI Realtime session for WebRTC.

    Returns:
        dict with client_secret (str), model (str), voice (str).
        The frontend uses client_secret to establish a WebRTC peer
        connection directly with OpenAI.
    """
    if not settings.openai_realtime_api_key:
        raise RealtimeSessionError(
            "OPENAI_REALTIME_API_KEY not configured. "
            "Set it in your .env for voice interviews."
        )

    selected_voice = voice or settings.openai_realtime_voice

    async with httpx.AsyncClient(timeout=15.0) as http:
        response = await http.post(
            _REALTIME_SESSION_URL,
            headers={
                "Authorization": (
                    f"Bearer {settings.openai_realtime_api_key}"
                ),
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
                    "type": "semantic_vad",
                    "eagerness": "low",
                    "create_response": True,
                    "interrupt_response": True,
                },
            },
        )

    if response.status_code == 429:
        logger.warning("openai_realtime_rate_limited")
        raise RealtimeSessionError(
            "OpenAI Realtime rate limit reached. "
            "Please try again shortly."
        )

    if response.status_code != 200:
        logger.error(
            "openai_realtime_session_failed status=%d body=%s",
            response.status_code,
            response.text[:500],
        )
        raise RealtimeSessionError(
            "Failed to create Realtime session: "
            f"HTTP {response.status_code}"
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
