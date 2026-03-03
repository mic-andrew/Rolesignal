"""Submission routes — run and submit code."""

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.submissions import (
    RunCodeRequest,
    SubmissionDetailResponse,
    SubmissionListResponse,
    SubmitSolutionRequest,
    TestResultResponse,
)
from app.services import problem_service, submission_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["submissions"])


@router.post("/problems/{slug}/run", response_model=list[TestResultResponse])
async def run_code(
    slug: str,
    payload: RunCodeRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[TestResultResponse]:
    """Run code against sample test cases only (no submission record)."""
    problem = await problem_service.get_problem_by_slug(db, slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    try:
        results = await submission_service.run_code(
            db, user.id, problem.id, payload.language, payload.source_code,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return [TestResultResponse(**r) for r in results]


@router.post("/problems/{slug}/submit", response_model=SubmissionDetailResponse)
async def submit_solution(
    slug: str,
    payload: SubmitSolutionRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SubmissionDetailResponse:
    """Submit solution against all test cases."""
    problem = await problem_service.get_problem_by_slug(db, slug)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    try:
        submission = await submission_service.submit_solution(
            db, user.id, problem.id, payload.language, payload.source_code,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return SubmissionDetailResponse(
        id=str(submission.id),
        problem_id=str(submission.problem_id),
        language=submission.language,
        status=submission.status,
        runtime_ms=submission.runtime_ms,
        memory_kb=submission.memory_kb,
        created_at=submission.created_at.isoformat(),
        source_code=submission.source_code,
        stdout=submission.stdout,
        stderr=submission.stderr,
    )


@router.get("/submissions", response_model=SubmissionListResponse)
async def list_submissions(
    problem_id: str | None = None,
    page: int = 1,
    per_page: int = 20,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SubmissionListResponse:
    """List user's submissions."""
    import uuid as uuid_mod

    pid = uuid_mod.UUID(problem_id) if problem_id else None
    submissions, total = await submission_service.get_user_submissions(
        db, user.id, problem_id=pid, page=page, per_page=per_page,
    )
    return SubmissionListResponse(
        data=[
            {
                "id": str(s.id),
                "problem_id": str(s.problem_id),
                "language": s.language,
                "status": s.status,
                "runtime_ms": s.runtime_ms,
                "memory_kb": s.memory_kb,
                "created_at": s.created_at.isoformat(),
            }
            for s in submissions
        ],
        count=total,
    )


@router.get("/submissions/{submission_id}", response_model=SubmissionDetailResponse)
async def get_submission(
    submission_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SubmissionDetailResponse:
    """Get a single submission by ID."""
    import uuid as uuid_mod

    submission = await submission_service.get_submission(
        db, uuid_mod.UUID(submission_id), user.id,
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    return SubmissionDetailResponse(
        id=str(submission.id),
        problem_id=str(submission.problem_id),
        language=submission.language,
        status=submission.status,
        runtime_ms=submission.runtime_ms,
        memory_kb=submission.memory_kb,
        created_at=submission.created_at.isoformat(),
        source_code=submission.source_code,
        stdout=submission.stdout,
        stderr=submission.stderr,
    )
