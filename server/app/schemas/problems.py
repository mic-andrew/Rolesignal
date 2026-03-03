"""Problem schemas."""

from app.schemas.base import CamelModel


class ProblemExample(CamelModel):
    input: str
    output: str
    explanation: str | None = None


class TestCaseResponse(CamelModel):
    id: str
    input: str
    expected_output: str
    is_sample: bool


class ProblemListItem(CamelModel):
    id: str
    title: str
    slug: str
    difficulty: str
    topic_id: str
    topic_name: str
    acceptance_rate: float | None = None
    user_status: str = "not_started"
    accepted_count: int = 0
    submission_count: int = 0


class ProblemDetailResponse(ProblemListItem):
    description: str
    constraints: list[str]
    examples: list[ProblemExample]
    starter_code: dict
    hints: list[str]
    time_complexity: str
    space_complexity: str
    time_limit_ms: int = 2000
    memory_limit_kb: int = 131072
    test_cases: list[TestCaseResponse] = []


class ProblemListResponse(CamelModel):
    data: list[ProblemListItem]
    count: int
