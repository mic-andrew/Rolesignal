"""Submission service — run and submit code solutions."""

import logging
import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.problem import Problem
from app.models.submission import Submission
from app.models.test_case import TestCase
from app.models.user_progress import UserProgress
from app.services import judge0_service

logger = logging.getLogger(__name__)


async def run_code(
    db: AsyncSession,
    user_id: uuid.UUID,
    problem_id: uuid.UUID,
    language: str,
    source_code: str,
) -> list[dict]:
    """Run code against sample test cases only. No submission record created."""
    problem = await db.get(Problem, problem_id)
    if not problem:
        raise ValueError("Problem not found")

    full_code = _wrap_with_driver(
        source_code, language, problem.driver_code,
    )

    test_cases = await _get_test_cases(db, problem_id, sample_only=True)
    if not test_cases:
        return []

    tc_dicts = [
        {
            "input": tc.input,
            "expected_output": tc.expected_output,
        }
        for tc in test_cases
    ]
    tokens = await judge0_service.batch_submit(
        full_code, language, tc_dicts,
    )
    results = await judge0_service.batch_get_results(tokens)

    return [
        {
            "test_case_id": str(test_cases[i].id),
            "passed": results[i]["status"] == "accepted",
            "input": test_cases[i].input,
            "expected_output": test_cases[i].expected_output,
            "actual_output": results[i]["stdout"],
            "runtime_ms": results[i]["runtime_ms"],
            "status": results[i]["status"],
        }
        for i in range(len(test_cases))
    ]


async def submit_solution(
    db: AsyncSession,
    user_id: uuid.UUID,
    problem_id: uuid.UUID,
    language: str,
    source_code: str,
) -> Submission:
    """Submit solution against ALL test cases. Creates submission record."""
    problem = await db.get(Problem, problem_id)
    if not problem:
        raise ValueError("Problem not found")

    full_code = _wrap_with_driver(
        source_code, language, problem.driver_code,
    )

    test_cases = await _get_test_cases(db, problem_id, sample_only=False)
    if not test_cases:
        raise ValueError("No test cases found for this problem")

    # Create submission record
    submission = Submission(
        user_id=user_id,
        problem_id=problem_id,
        language=language,
        source_code=source_code,
        status="running",
    )
    db.add(submission)
    await db.flush()

    # Execute against all test cases
    tc_dicts = [
        {
            "input": tc.input,
            "expected_output": tc.expected_output,
        }
        for tc in test_cases
    ]
    tokens = await judge0_service.batch_submit(
        full_code, language, tc_dicts,
    )
    results = await judge0_service.batch_get_results(tokens)

    # Determine overall status
    all_accepted = all(r["status"] == "accepted" for r in results)
    if all_accepted:
        submission.status = "accepted"
    else:
        # Use the first non-accepted status
        for r in results:
            if r["status"] != "accepted":
                submission.status = r["status"]
                break

    # Aggregate runtime and memory
    runtimes = [r["runtime_ms"] for r in results if r["runtime_ms"] is not None]
    memories = [r["memory_kb"] for r in results if r["memory_kb"] is not None]
    submission.runtime_ms = max(runtimes) if runtimes else None
    submission.memory_kb = max(memories) if memories else None
    submission.stdout = results[0]["stdout"] if results else None
    submission.stderr = results[0]["stderr"] if results else None
    submission.judge0_token = tokens[0] if tokens else None

    # Update problem counters
    problem.submission_count += 1
    if submission.status == "accepted":
        problem.accepted_count += 1

    # Update user progress
    await _update_user_progress(db, user_id, problem_id, submission)

    await db.commit()
    await db.refresh(submission)
    return submission


async def get_user_submissions(
    db: AsyncSession,
    user_id: uuid.UUID,
    problem_id: uuid.UUID | None = None,
    page: int = 1,
    per_page: int = 20,
) -> tuple[list[Submission], int]:
    """List user's submissions, optionally filtered by problem."""
    query = select(Submission).where(Submission.user_id == user_id)
    if problem_id:
        query = query.where(Submission.problem_id == problem_id)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    query = query.order_by(Submission.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    return list(result.scalars().all()), total


async def get_submission(
    db: AsyncSession,
    submission_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Submission | None:
    """Get a single submission by ID (only if owned by user)."""
    result = await db.execute(
        select(Submission).where(
            Submission.id == submission_id,
            Submission.user_id == user_id,
        ),
    )
    return result.scalar_one_or_none()


def _wrap_with_driver(
    source_code: str,
    language: str,
    driver_code: dict,
) -> str:
    """Combine user's solution with the driver harness.

    Most languages: driver is appended after user code.
    Go: uses ``// USER_CODE_HERE`` placeholder because
    ``package main`` must appear at the top of the file.
    """
    driver = driver_code.get(language, "")
    if not driver:
        logger.warning("no_driver_code language=%s", language)
        return source_code
    if "// USER_CODE_HERE" in driver:
        return driver.replace("// USER_CODE_HERE", source_code)
    return f"{source_code}\n{driver}"


async def _get_test_cases(
    db: AsyncSession,
    problem_id: uuid.UUID,
    sample_only: bool,
) -> list[TestCase]:
    """Fetch test cases for a problem."""
    query = select(TestCase).where(TestCase.problem_id == problem_id)
    if sample_only:
        query = query.where(TestCase.is_sample == True)  # noqa: E712
    query = query.order_by(TestCase.sort_order)
    result = await db.execute(query)
    return list(result.scalars().all())


async def _update_user_progress(
    db: AsyncSession,
    user_id: uuid.UUID,
    problem_id: uuid.UUID,
    submission: Submission,
) -> None:
    """Update user progress after a submission."""
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.problem_id == problem_id,
        ),
    )
    progress = result.scalar_one_or_none()

    if not progress:
        progress = UserProgress(
            user_id=user_id,
            problem_id=problem_id,
            status="attempted",
            attempts_count=1,
        )
        db.add(progress)
    else:
        progress.attempts_count += 1

    if submission.status == "accepted":
        progress.status = "solved"
        progress.best_submission_id = submission.id
        if not progress.solved_at:
            progress.solved_at = datetime.now(timezone.utc)
    elif progress.status != "solved":
        progress.status = "attempted"
