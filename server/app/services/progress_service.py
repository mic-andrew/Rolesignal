"""Progress service — user stats, streaks, and topic progress."""

import logging
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.problem import Problem
from app.models.submission import Submission
from app.models.topic import Topic
from app.models.user_progress import UserProgress

logger = logging.getLogger(__name__)


async def get_user_stats(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> dict:
    """Get comprehensive user stats: solved counts, streaks, acceptance rate, topic progress."""
    # Solved counts by difficulty
    solved_query = (
        select(Problem.difficulty, func.count())
        .join(UserProgress, UserProgress.problem_id == Problem.id)
        .where(UserProgress.user_id == user_id, UserProgress.status == "solved")
        .group_by(Problem.difficulty)
    )
    result = await db.execute(solved_query)
    solved_by_difficulty = {row[0]: row[1] for row in result.all()}

    easy_solved = solved_by_difficulty.get("easy", 0)
    medium_solved = solved_by_difficulty.get("medium", 0)
    hard_solved = solved_by_difficulty.get("hard", 0)
    total_solved = easy_solved + medium_solved + hard_solved

    # Acceptance rate
    total_subs = await db.execute(
        select(func.count()).where(Submission.user_id == user_id),
    )
    total_submissions = total_subs.scalar() or 0

    accepted_subs = await db.execute(
        select(func.count()).where(
            Submission.user_id == user_id,
            Submission.status == "accepted",
        ),
    )
    accepted_submissions = accepted_subs.scalar() or 0
    acceptance_rate = round((accepted_submissions / total_submissions) * 100, 1) if total_submissions > 0 else 0.0

    # Streaks
    current_streak, longest_streak = await _compute_streaks(db, user_id)

    # Topic progress
    topic_progress = await _compute_topic_progress(db, user_id)

    return {
        "total_solved": total_solved,
        "easy_solved": easy_solved,
        "medium_solved": medium_solved,
        "hard_solved": hard_solved,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "acceptance_rate": acceptance_rate,
        "topic_progress": topic_progress,
    }


async def get_recent_submissions(
    db: AsyncSession,
    user_id: uuid.UUID,
    limit: int = 10,
) -> list[dict]:
    """Get recent submissions for the user."""
    result = await db.execute(
        select(Submission, Problem.title, Problem.slug)
        .join(Problem, Submission.problem_id == Problem.id)
        .where(Submission.user_id == user_id)
        .order_by(Submission.created_at.desc())
        .limit(limit),
    )
    rows = result.all()

    return [
        {
            "id": str(sub.id),
            "problem_id": str(sub.problem_id),
            "problem_title": title,
            "problem_slug": slug,
            "language": sub.language,
            "status": sub.status,
            "runtime_ms": sub.runtime_ms,
            "memory_kb": sub.memory_kb,
            "created_at": sub.created_at.isoformat(),
        }
        for sub, title, slug in rows
    ]


async def _compute_streaks(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> tuple[int, int]:
    """Compute current and longest solve streaks (days with at least one accepted submission)."""
    result = await db.execute(
        select(func.date(Submission.created_at))
        .where(Submission.user_id == user_id, Submission.status == "accepted")
        .group_by(func.date(Submission.created_at))
        .order_by(func.date(Submission.created_at).desc()),
    )
    dates = [row[0] for row in result.all()]

    if not dates:
        return 0, 0

    today = datetime.now(timezone.utc).date()

    # Current streak: count consecutive days starting from today or yesterday
    current_streak = 0
    expected = today
    for d in dates:
        if d == expected:
            current_streak += 1
            expected -= timedelta(days=1)
        elif d == today - timedelta(days=1) and current_streak == 0:
            # Allow streak to start from yesterday
            current_streak = 1
            expected = d - timedelta(days=1)
        else:
            break

    # Longest streak
    longest_streak = 1
    streak = 1
    for i in range(1, len(dates)):
        if (dates[i - 1] - dates[i]).days == 1:
            streak += 1
            longest_streak = max(longest_streak, streak)
        else:
            streak = 1

    return current_streak, longest_streak


async def _compute_topic_progress(
    db: AsyncSession,
    user_id: uuid.UUID,
) -> list[dict]:
    """Compute solved/total for each topic."""
    # Total problems per topic
    total_query = (
        select(Topic.id, Topic.name, func.count(Problem.id))
        .join(Problem, Problem.topic_id == Topic.id)
        .where(Problem.status == "active")
        .group_by(Topic.id, Topic.name)
        .order_by(Topic.sort_order)
    )
    total_result = await db.execute(total_query)
    topic_totals = {row[0]: {"topic_id": str(row[0]), "topic_name": row[1], "total": row[2]} for row in total_result.all()}

    # Solved per topic
    solved_query = (
        select(Problem.topic_id, func.count())
        .join(UserProgress, UserProgress.problem_id == Problem.id)
        .where(UserProgress.user_id == user_id, UserProgress.status == "solved")
        .group_by(Problem.topic_id)
    )
    solved_result = await db.execute(solved_query)
    solved_map = {row[0]: row[1] for row in solved_result.all()}

    return [
        {
            "topic_id": data["topic_id"],
            "topic_name": data["topic_name"],
            "solved": solved_map.get(tid, 0),
            "total": data["total"],
        }
        for tid, data in topic_totals.items()
    ]
