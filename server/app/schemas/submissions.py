"""Submission schemas."""

from pydantic import BaseModel

from app.schemas.base import CamelModel


class RunCodeRequest(BaseModel):
    language: str
    source_code: str


class SubmitSolutionRequest(BaseModel):
    language: str
    source_code: str


class TestResultResponse(CamelModel):
    test_case_id: str
    passed: bool
    input: str
    expected_output: str
    actual_output: str
    runtime_ms: int | None = None
    status: str


class SubmissionResponse(CamelModel):
    id: str
    problem_id: str
    language: str
    status: str
    runtime_ms: int | None = None
    memory_kb: int | None = None
    created_at: str


class SubmissionDetailResponse(SubmissionResponse):
    source_code: str
    stdout: str | None = None
    stderr: str | None = None


class SubmissionListResponse(CamelModel):
    data: list[SubmissionResponse]
    count: int
