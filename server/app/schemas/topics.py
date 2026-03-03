"""Topic schemas."""

from app.schemas.base import CamelModel


class TopicResponse(CamelModel):
    id: str
    name: str
    slug: str
    description: str
    icon: str
    sort_order: int
    category: str
    problem_count: int


class TopicListResponse(CamelModel):
    data: list[TopicResponse]
    count: int
