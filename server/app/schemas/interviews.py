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


# --- Launch (end-to-end create) schemas ---


class CandidateInput(BaseModel):
    name: str
    email: str


class SubCriterionInput(BaseModel):
    name: str
    description: str = ""
    weight: int = 50


class CriterionLaunchInput(BaseModel):
    name: str
    description: str = ""
    weight: int = 20
    question_count: int = 3
    color: str = "#7C6FFF"
    sub_criteria: list[SubCriterionInput] = []


class InterviewLaunchRequest(BaseModel):
    """Creates role + candidates + interviews in one call."""

    title: str
    department: str
    seniority: str
    description: str | None = None
    criteria: list[CriterionLaunchInput] = []
    candidates: list[CandidateInput] = []
    config_duration: int = 30
    config_tone: str = "Conversational"
    config_adaptive: bool = True


class LaunchInterviewItem(CamelModel):
    id: str
    candidate_name: str
    candidate_email: str
    link: str
    email_sent: bool


class InterviewLaunchResponse(CamelModel):
    role_id: str
    interviews: list[LaunchInterviewItem]
    message: str


class AddCandidateRequest(BaseModel):
    """Add a candidate to an existing role and create their interview."""

    name: str
    email: str
    config_duration: int = 30
    config_tone: str = "Conversational"
    config_adaptive: bool = True


class InterviewUpdateRequest(BaseModel):
    """Update interview configuration."""

    config_duration: int | None = None
    config_tone: str | None = None
    config_adaptive: bool | None = None
