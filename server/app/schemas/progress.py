"""Progress schemas."""

from app.schemas.base import CamelModel


class TopicProgressResponse(CamelModel):
    topic_id: str
    topic_name: str
    solved: int
    total: int


class UserStatsResponse(CamelModel):
    total_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    current_streak: int
    longest_streak: int
    acceptance_rate: float
    topic_progress: list[TopicProgressResponse]
