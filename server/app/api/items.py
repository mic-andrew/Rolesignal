"""Items resource — example route module.

Replace this with your domain-specific routes.
Route functions are 5-15 lines. Zero business logic here.
"""

import logging

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.items import ItemCreate, ItemListResponse, ItemResponse
from app.services import item_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=ItemListResponse)
async def list_items(
    page: int = 1,
    per_page: int = 20,
    db: AsyncSession = Depends(get_db),
) -> ItemListResponse:
    """List all items with pagination."""
    return await item_service.list_items(db, page=page, per_page=per_page)


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: str, db: AsyncSession = Depends(get_db)) -> ItemResponse:
    """Get a single item by ID."""
    return await item_service.get_item(db, item_id)


@router.post("/", response_model=ItemResponse, status_code=201)
async def create_item(
    payload: ItemCreate,
    db: AsyncSession = Depends(get_db),
) -> ItemResponse:
    """Create a new item."""
    return await item_service.create_item(db, payload)
