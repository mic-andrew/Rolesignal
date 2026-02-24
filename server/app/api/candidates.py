"""Candidates routes."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.candidates import (
    CandidateCreateRequest,
    CandidateListResponse,
    CandidateResponse,
    CandidateUpdateRequest,
)
from app.schemas.common import MessageResponse
from app.services import candidate_service

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.get("", response_model=CandidateListResponse)
async def list_candidates(
    role_id: str | None = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CandidateListResponse:
    """List candidates, optionally filtered by role."""
    return await candidate_service.list_candidates(db, user.organization_id, role_id=role_id)


@router.get("/{candidate_id}", response_model=CandidateResponse)
async def get_candidate(
    candidate_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CandidateResponse:
    """Get a single candidate."""
    return await candidate_service.get_candidate(db, user.organization_id, candidate_id)


@router.post("", response_model=CandidateResponse, status_code=201)
async def create_candidate(
    payload: CandidateCreateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CandidateResponse:
    """Create a new candidate."""
    return await candidate_service.create_candidate(
        db, user.organization_id, user.id, payload
    )


@router.put("/{candidate_id}", response_model=CandidateResponse)
async def update_candidate(
    candidate_id: str,
    payload: CandidateUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CandidateResponse:
    """Update a candidate."""
    return await candidate_service.update_candidate(
        db, user.organization_id, user.id, candidate_id, payload
    )


@router.delete("/{candidate_id}", response_model=MessageResponse)
async def delete_candidate(
    candidate_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Delete a candidate."""
    await candidate_service.delete_candidate(
        db, user.organization_id, user.id, candidate_id
    )
    return MessageResponse(message="Candidate deleted")
