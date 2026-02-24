"""Dashboard schemas."""

from app.schemas.base import CamelModel


class DashboardMetrics(CamelModel):
    active_roles: int
    interviews_this_week: int
    avg_fit_score: float
    pending_reviews: int


class PipelineColumn(CamelModel):
    stage: str
    label: str
    count: int
    color: str
    candidate_ids: list[str]


class ActivityItem(CamelModel):
    id: str
    emoji: str
    text: str
    time_ago: str


class RoleOverview(CamelModel):
    id: str
    title: str
    department: str
    candidate_count: int
    avg_score: float
    status: str


class DashboardResponse(CamelModel):
    metrics: DashboardMetrics
    pipeline: list[PipelineColumn]
    roles: list[RoleOverview]
    activity: list[ActivityItem]
