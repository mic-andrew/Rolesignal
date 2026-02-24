"""Audit schemas."""

from app.schemas.base import CamelModel


class AuditEventResponse(CamelModel):
    id: str
    type: str
    action: str
    detail: str
    time: str
    emoji: str


class AuditListResponse(CamelModel):
    data: list[AuditEventResponse]
    count: int
