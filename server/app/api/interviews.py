"""Interviews routes."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.interviews import (
    InterviewCreateRequest,
    InterviewDetailResponse,
    InterviewListResponse,
    InterviewResponse,
    LiveCountResponse,
)
from app.services import interview_service

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.get("/live", response_model=LiveCountResponse)
async def get_live_count(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> LiveCountResponse:
    """Get the count of live interviews."""
    return await interview_service.get_live_count(db, user.organization_id)


@router.get("", response_model=InterviewListResponse)
async def list_interviews(
    role_id: str | None = Query(None),
    status: str | None = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewListResponse:
    """List interviews."""
    return await interview_service.list_interviews(
        db, user.organization_id, role_id=role_id, status=status
    )


@router.get("/{interview_id}", response_model=InterviewDetailResponse)
async def get_interview(
    interview_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewDetailResponse:
    """Get a single interview with transcript."""
    return await interview_service.get_interview(db, user.organization_id, interview_id)


@router.post("", response_model=InterviewResponse, status_code=201)
async def create_interview(
    payload: InterviewCreateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewResponse:
    """Create a new interview."""
    return await interview_service.create_interview(
        db, user.organization_id, user.id, payload
    )


@router.post("/{interview_id}/complete", response_model=MessageResponse)
async def complete_interview(
    interview_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Mark an interview as completed."""
    await interview_service.complete_interview(db, user.organization_id, interview_id)
    return MessageResponse(message="Interview completed")
