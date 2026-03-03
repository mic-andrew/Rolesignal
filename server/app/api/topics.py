"""Topic routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.topics import TopicListResponse, TopicResponse
from app.services import topic_service

router = APIRouter(prefix="/topics", tags=["topics"])


@router.get("", response_model=TopicListResponse)
async def list_topics(
    db: AsyncSession = Depends(get_db),
) -> TopicListResponse:
    """List all DSA topics with live problem counts."""
    topics = await topic_service.list_topics(db)
    return TopicListResponse(
        data=[TopicResponse.model_validate(t, from_attributes=True) for t in topics],
        count=len(topics),
    )
