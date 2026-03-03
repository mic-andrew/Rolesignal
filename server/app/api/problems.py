"""Problem routes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.problems import ProblemDetailResponse, ProblemListResponse
from app.services import problem_service

router = APIRouter(prefix="/problems", tags=["problems"])


@router.get("", response_model=ProblemListResponse)
async def list_problems(
    topic: str | None = None,
    difficulty: str | None = None,
    search: str | None = None,
    status: str | None = None,
    page: int = 1,
    per_page: int = 20,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProblemListResponse:
    """List problems with optional filters."""
    items, total = await problem_service.list_problems(
        db,
        user.id,
        topic=topic,
        difficulty=difficulty,
        search=search,
        status=status,
        page=page,
        per_page=per_page,
    )
    return ProblemListResponse(data=items, count=total)


@router.get("/{slug}", response_model=ProblemDetailResponse)
async def get_problem(
    slug: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProblemDetailResponse:
    """Get full problem detail by slug."""
    detail = await problem_service.get_problem_detail(db, slug, user.id)
    if not detail:
        raise HTTPException(status_code=404, detail="Problem not found")
    return ProblemDetailResponse(**detail)
