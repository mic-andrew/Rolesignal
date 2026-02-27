"""Interviews routes."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.interviews import (
    AddCandidateRequest,
    InterviewCreateRequest,
    InterviewDetailResponse,
    InterviewLaunchRequest,
    InterviewLaunchResponse,
    InterviewListResponse,
    InterviewResponse,
    InterviewUpdateRequest,
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


@router.post(
    "/launch",
    response_model=InterviewLaunchResponse,
    status_code=201,
)
async def launch_interviews(
    payload: InterviewLaunchRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewLaunchResponse:
    """Create role + candidates + interviews and send emails."""
    return await interview_service.launch_interviews(
        db, user.organization_id, user.id, payload
    )


@router.delete("/{interview_id}", response_model=MessageResponse)
async def delete_interview(
    interview_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Delete an interview."""
    await interview_service.delete_interview(
        db, user.organization_id, user.id, interview_id
    )
    return MessageResponse(message="Interview deleted")


@router.post(
    "/{interview_id}/complete",
    response_model=MessageResponse,
)
async def complete_interview(
    interview_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Mark an interview as completed."""
    await interview_service.complete_interview(
        db, user.organization_id, interview_id
    )
    return MessageResponse(message="Interview completed")


@router.patch(
    "/{interview_id}",
    response_model=InterviewResponse,
)
async def update_interview(
    interview_id: str,
    payload: InterviewUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewResponse:
    """Update interview configuration."""
    return await interview_service.update_interview(
        db, user.organization_id, interview_id, payload
    )


@router.post(
    "/roles/{role_id}/candidates",
    response_model=InterviewResponse,
    status_code=201,
)
async def add_candidate_to_role(
    role_id: str,
    payload: AddCandidateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> InterviewResponse:
    """Add a candidate to an existing role and create their interview."""
    return await interview_service.add_candidate_to_role(
        db, user.organization_id, user.id, role_id, payload
    )
