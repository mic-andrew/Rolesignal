"""Progress routes — user stats and recent submissions."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.progress import UserStatsResponse
from app.schemas.submissions import SubmissionListResponse
from app.services import progress_service

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/me", response_model=UserStatsResponse)
async def get_my_stats(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserStatsResponse:
    """Get current user's stats, streaks, and topic progress."""
    stats = await progress_service.get_user_stats(db, user.id)
    return UserStatsResponse(**stats)


@router.get("/me/submissions", response_model=SubmissionListResponse)
async def get_my_recent_submissions(
    limit: int = 10,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> SubmissionListResponse:
    """Get current user's recent submissions."""
    submissions = await progress_service.get_recent_submissions(db, user.id, limit=limit)
    return SubmissionListResponse(data=submissions, count=len(submissions))
