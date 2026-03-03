"""Topic service — topic listing and detail."""

import logging

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.problem import Problem
from app.models.topic import Topic

logger = logging.getLogger(__name__)


async def list_topics(db: AsyncSession) -> list[dict]:
    """Return all topics with live problem counts."""
    result = await db.execute(
        select(
            Topic,
            func.count(Problem.id).label("live_count"),
        )
        .outerjoin(
            Problem,
            (Problem.topic_id == Topic.id) & (Problem.status == "active"),
        )
        .group_by(Topic.id)
        .order_by(Topic.category, Topic.sort_order),
    )
    rows = result.all()

    return [
        {
            "id": str(topic.id),
            "name": topic.name,
            "slug": topic.slug,
            "description": topic.description,
            "icon": topic.icon,
            "sort_order": topic.sort_order,
            "category": topic.category,
            "problem_count": live_count,
        }
        for topic, live_count in rows
    ]
