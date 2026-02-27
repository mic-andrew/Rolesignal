"""Criteria library schemas."""

from pydantic import BaseModel

from app.schemas.base import CamelModel


class SubCriterionTemplateInput(BaseModel):
    name: str
    description: str = ""
    weight: int = 50


class CriterionTemplateInput(BaseModel):
    name: str
    description: str = ""
    weight: int = 20
    sub_criteria: list[SubCriterionTemplateInput] = []


class CriteriaTemplateCreate(BaseModel):
    name: str
    description: str = ""
    criteria: list[CriterionTemplateInput]


class CriteriaTemplateUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    criteria: list[CriterionTemplateInput] | None = None


class SubCriterionTemplateResponse(CamelModel):
    name: str
    description: str
    weight: int


class CriterionTemplateResponse(CamelModel):
    name: str
    description: str
    weight: int
    sub_criteria: list[SubCriterionTemplateResponse]


class CriteriaTemplateResponse(CamelModel):
    id: str
    name: str
    description: str
    criteria: list[CriterionTemplateResponse]
    created_at: str
    updated_at: str


class CriteriaTemplateListResponse(CamelModel):
    data: list[CriteriaTemplateResponse]
    count: int
