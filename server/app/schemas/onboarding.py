"""Onboarding schemas."""

from pydantic import BaseModel, EmailStr

from app.schemas.base import CamelModel


class OnboardingProfileRequest(BaseModel):
    name: str
    avatar_url: str | None = None


class OnboardingTeamRequest(BaseModel):
    emails: list[EmailStr]


class CriterionInput(BaseModel):
    name: str
    description: str = ""
    weight: int = 20
    question_count: int = 3


class OnboardingCandidateInput(BaseModel):
    name: str
    email: str


class OnboardingRoleRequest(BaseModel):
    title: str
    department: str
    seniority: str
    location: str
    criteria: list[CriterionInput]
    candidate: OnboardingCandidateInput | None = None


class OnboardingCompleteResponse(CamelModel):
    message: str
    role_id: str
    interview_link: str | None = None
