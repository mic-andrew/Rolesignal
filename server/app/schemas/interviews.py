"""Interview schemas."""

from pydantic import BaseModel

from app.schemas.base import CamelModel


class TranscriptMessageResponse(CamelModel):
    id: str
    speaker: str
    text: str
    timestamp: str


class InterviewResponse(CamelModel):
    id: str
    candidate_id: str
    role_id: str
    token: str
    status: str
    duration_seconds: int | None = None
    config_duration: int
    config_tone: str
    config_adaptive: bool
    started_at: str | None = None
    completed_at: str | None = None
    candidate_name: str = ""
    role_title: str = ""
    link: str = ""


class InterviewDetailResponse(InterviewResponse):
    transcript: list[TranscriptMessageResponse] = []


class InterviewCreateRequest(BaseModel):
    candidate_id: str
    role_id: str
    config_duration: int = 30
    config_tone: str = "Conversational"
    config_adaptive: bool = True


class InterviewListResponse(CamelModel):
    data: list[InterviewResponse]
    count: int


class LiveCountResponse(CamelModel):
    count: int
