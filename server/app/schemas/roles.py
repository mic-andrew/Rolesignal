"""Role schemas."""

from pydantic import BaseModel

from app.schemas.base import CamelModel


class CriterionResponse(CamelModel):
    id: str
    name: str
    description: str
    weight: int
    question_count: int
    color: str
    sort_order: int


class RoleResponse(CamelModel):
    id: str
    title: str
    department: str
    seniority: str
    location: str
    description: str | None = None
    status: str
    candidate_count: int = 0
    avg_score: float = 0.0
    days_ago: int = 0


class RoleDetailResponse(RoleResponse):
    criteria: list[CriterionResponse] = []


class CriterionInput(BaseModel):
    name: str
    description: str = ""
    weight: int = 20
    question_count: int = 3
    color: str = "#7C6FFF"


class RoleCreateRequest(BaseModel):
    title: str
    department: str
    seniority: str
    location: str
    description: str | None = None
    criteria: list[CriterionInput] = []


class RoleUpdateRequest(BaseModel):
    title: str | None = None
    department: str | None = None
    seniority: str | None = None
    location: str | None = None
    description: str | None = None
    status: str | None = None


class RoleListResponse(CamelModel):
    data: list[RoleResponse]
    count: int
