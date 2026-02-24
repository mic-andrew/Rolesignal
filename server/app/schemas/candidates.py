"""Candidate schemas."""

from pydantic import BaseModel, EmailStr

from app.schemas.base import CamelModel


class CandidateSkills(CamelModel):
    tech: float = 0.0
    behavioral: float = 0.0
    communication: float = 0.0
    problem_solving: float = 0.0
    culture: float = 0.0


class CandidateResponse(CamelModel):
    id: str
    name: str
    initials: str
    email: str
    score: float = 0.0
    status: str
    date: str
    skills: CandidateSkills
    color: str
    role: str = ""
    role_id: str
    duration: int = 0


class CandidateCreateRequest(BaseModel):
    name: str
    email: EmailStr
    role_id: str
    color: str = "#7C6FFF"


class CandidateUpdateRequest(BaseModel):
    name: str | None = None
    email: str | None = None
    status: str | None = None


class CandidateListResponse(CamelModel):
    data: list[CandidateResponse]
    count: int
