"""Settings schemas."""

from pydantic import BaseModel, EmailStr

from app.schemas.base import CamelModel


class TeamMemberResponse(CamelModel):
    id: str
    name: str
    initials: str
    email: str
    role: str
    status: str


class InviteRequest(BaseModel):
    email: EmailStr
    role: str = "Recruiter"


class TemplateResponse(CamelModel):
    id: str
    name: str
    role: str
    duration: int
    criteria_count: int
    used_count: int


class TemplateCreateRequest(BaseModel):
    name: str
    role_label: str
    duration: int = 30
    criteria_count: int = 5


class IntegrationResponse(CamelModel):
    id: str
    name: str
    emoji: str
    connected: bool
    description: str
