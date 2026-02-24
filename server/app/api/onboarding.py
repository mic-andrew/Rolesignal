"""Onboarding routes."""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.onboarding import (
    OnboardingCompleteResponse,
    OnboardingProfileRequest,
    OnboardingRoleRequest,
    OnboardingTeamRequest,
)
from app.services import onboarding_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/onboarding", tags=["onboarding"])


@router.put("/profile", response_model=MessageResponse)
async def complete_profile(
    payload: OnboardingProfileRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Step 1: Complete user profile."""
    await onboarding_service.complete_profile(db, user, payload)
    return MessageResponse(message="Profile updated")


@router.post("/team", response_model=MessageResponse)
async def invite_team(
    payload: OnboardingTeamRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Step 2: Invite team members."""
    await onboarding_service.invite_team(db, user.organization, payload)
    return MessageResponse(message=f"Invited {len(payload.emails)} team members")


@router.post("/role", response_model=OnboardingCompleteResponse)
async def create_first_role(
    payload: OnboardingRoleRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> OnboardingCompleteResponse:
    """Create first role and complete onboarding."""
    return await onboarding_service.create_first_role(db, user.organization, user, payload)
