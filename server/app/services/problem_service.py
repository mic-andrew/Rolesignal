"""Problem service — problem listing, detail, and filtering."""

import logging
import uuid

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.problem import Problem
from app.models.test_case import TestCase
from app.models.topic import Topic
from app.models.user_progress import UserProgress

logger = logging.getLogger(__name__)


async def list_problems(
    db: AsyncSession,
    user_id: uuid.UUID,
    *,
    topic: str | None = None,
    difficulty: str | None = None,
    search: str | None = None,
    status: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[dict], int]:
    """List problems with optional filters. Returns (items, total_count).

    Each item is a dict with problem fields + topic_name + user_status + acceptance_rate.
    """
    # Base query
    query: Select = (
        select(
            Problem,
            Topic.name.label("topic_name"),
            UserProgress.status.label("user_status"),
        )
        .join(Topic, Problem.topic_id == Topic.id)
        .outerjoin(
            UserProgress,
            (UserProgress.problem_id == Problem.id) & (UserProgress.user_id == user_id),
        )
        .where(Problem.status == "active")
    )

    # Filters
    if topic:
        query = query.where(Topic.slug == topic)
    if difficulty:
        query = query.where(Problem.difficulty == difficulty)
    if search:
        query = query.where(Problem.title.ilike(f"%{search}%"))
    if status and status != "all":
        if status == "not_started":
            query = query.where(
                (UserProgress.status == None) | (UserProgress.status == "not_started"),  # noqa: E711
            )
        else:
            query = query.where(UserProgress.status == status)

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    # Paginate
    query = query.order_by(Problem.created_at).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    rows = result.all()

    items = []
    for problem, topic_name, user_status in rows:
        acceptance = (
            round(
                (problem.accepted_count / problem.submission_count) * 100, 1,
            )
            if problem.submission_count > 0
            else None
        )
        items.append({
            "id": str(problem.id),
            "title": problem.title,
            "slug": problem.slug,
            "difficulty": problem.difficulty,
            "topic_id": str(problem.topic_id),
            "topic_name": topic_name,
            "acceptance_rate": acceptance,
            "accepted_count": problem.accepted_count,
            "submission_count": problem.submission_count,
            "user_status": user_status or "not_started",
        })

    return items, total


async def get_problem_detail(
    db: AsyncSession,
    slug: str,
    user_id: uuid.UUID,
) -> dict | None:
    """Get full problem detail including sample test cases."""
    result = await db.execute(
        select(Problem, Topic.name.label("topic_name"))
        .join(Topic, Problem.topic_id == Topic.id)
        .where(Problem.slug == slug, Problem.status == "active"),
    )
    row = result.first()
    if not row:
        return None

    problem, topic_name = row

    # User progress
    progress_result = await db.execute(
        select(UserProgress.status).where(
            UserProgress.user_id == user_id,
            UserProgress.problem_id == problem.id,
        ),
    )
    user_status = progress_result.scalar() or "not_started"

    # Sample test cases
    test_cases_result = await db.execute(
        select(TestCase)
        .where(TestCase.problem_id == problem.id, TestCase.is_sample == True)  # noqa: E712
        .order_by(TestCase.sort_order),
    )
    sample_tests = test_cases_result.scalars().all()

    acceptance = (
        round(
            (problem.accepted_count / problem.submission_count) * 100, 1,
        )
        if problem.submission_count > 0
        else None
    )

    return {
        "id": str(problem.id),
        "title": problem.title,
        "slug": problem.slug,
        "difficulty": problem.difficulty,
        "topic_id": str(problem.topic_id),
        "topic_name": topic_name,
        "acceptance_rate": acceptance,
        "accepted_count": problem.accepted_count,
        "submission_count": problem.submission_count,
        "user_status": user_status,
        "description": problem.description,
        "constraints": problem.constraints,
        "examples": problem.examples,
        "starter_code": problem.starter_code,
        "hints": problem.hints,
        "time_complexity": problem.time_complexity,
        "space_complexity": problem.space_complexity,
        "time_limit_ms": problem.time_limit_ms,
        "memory_limit_kb": problem.memory_limit_kb,
        "test_cases": [
            {
                "id": str(tc.id),
                "input": tc.input,
                "expected_output": tc.expected_output,
                "is_sample": tc.is_sample,
            }
            for tc in sample_tests
        ],
    }


async def get_problem_by_slug(
    db: AsyncSession,
    slug: str,
) -> Problem | None:
    """Get a problem by slug (minimal, for route lookups)."""
    result = await db.execute(
        select(Problem).where(
            Problem.slug == slug, Problem.status == "active",
        ),
    )
    return result.scalar_one_or_none()
