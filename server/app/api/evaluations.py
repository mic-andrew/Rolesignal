"""Evaluations routes."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.evaluations import EvaluationResponse, RankingCandidate
from app.services import evaluation_service

router = APIRouter(prefix="/evaluations", tags=["evaluations"])


@router.get("/rankings", response_model=list[RankingCandidate])
async def get_rankings(
    role_id: str = Query(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[RankingCandidate]:
    """Get ranked candidates for a role."""
    return await evaluation_service.get_rankings(db, user.organization_id, role_id)


@router.get("/{candidate_id}", response_model=EvaluationResponse)
async def get_evaluation(
    candidate_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> EvaluationResponse:
    """Get the evaluation for a candidate."""
    return await evaluation_service.get_evaluation(db, user.organization_id, candidate_id)
