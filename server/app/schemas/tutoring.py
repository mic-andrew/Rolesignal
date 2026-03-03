"""Tutoring schemas."""

from pydantic import BaseModel

from app.schemas.base import CamelModel


class StartSessionRequest(BaseModel):
    problem_id: str
    voice_enabled: bool = False


class SendMessageRequest(BaseModel):
    content: str
    current_code: str = ""
    language: str = "python"


class TutoringMessageResponse(CamelModel):
    id: str
    speaker: str
    content: str
    message_type: str
    created_at: str


class TutoringSessionResponse(CamelModel):
    id: str
    problem_id: str
    started_at: str
    ended_at: str | None = None
    voice_enabled: bool


class RealtimeSessionResponse(CamelModel):
    client_secret: str
    model: str
    voice: str
    system_prompt: str
