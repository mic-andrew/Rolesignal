"""Audit service."""

import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_event import AuditEvent
from app.schemas.audit import AuditEventResponse, AuditListResponse

logger = logging.getLogger(__name__)


async def log_event(
    db: AsyncSession,
    org_id: uuid.UUID,
    user_id: uuid.UUID | None,
    type: str,
    action: str,
    detail: str,
    emoji: str = "",
) -> None:
    """Log an audit event."""
    event = AuditEvent(
        organization_id=org_id,
        user_id=user_id,
        type=type,
        action=action,
        detail=detail,
        emoji=emoji,
    )
    db.add(event)
    await db.flush()
    logger.info("audit_event type=%s action=%s org_id=%s", type, action, org_id)


async def list_events(
    db: AsyncSession, org_id: uuid.UUID, *, page: int = 1, per_page: int = 20
) -> AuditListResponse:
    """List audit events for an organization."""
    offset = (page - 1) * per_page
    total = await db.scalar(
        select(func.count(AuditEvent.id)).where(AuditEvent.organization_id == org_id)
    )
    result = await db.execute(
        select(AuditEvent)
        .where(AuditEvent.organization_id == org_id)
        .order_by(AuditEvent.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    events = result.scalars().all()
    return AuditListResponse(
        data=[_to_response(e) for e in events],
        count=total or 0,
    )


def _time_ago(dt: datetime) -> str:
    """Convert a datetime to a human-readable time ago string."""
    now = datetime.now(timezone.utc)
    diff = now - dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else now - dt
    seconds = int(diff.total_seconds())
    if seconds < 60:
        return "just now"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes}m ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours}h ago"
    days = hours // 24
    return f"{days}d ago"


def _to_response(event: AuditEvent) -> AuditEventResponse:
    return AuditEventResponse(
        id=str(event.id),
        type=event.type,
        action=event.action,
        detail=event.detail,
        time=_time_ago(event.created_at),
        emoji=event.emoji,
    )
