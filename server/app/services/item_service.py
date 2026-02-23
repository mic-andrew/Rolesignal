"""Item service — example business logic module.

All domain logic lives here. Routes delegate everything to services.
Replace with your domain-specific services.
"""

import logging

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.item import Item
from app.schemas.items import ItemCreate, ItemListResponse, ItemResponse

logger = logging.getLogger(__name__)


async def list_items(
    db: AsyncSession,
    *,
    page: int = 1,
    per_page: int = 20,
) -> ItemListResponse:
    """Return a paginated list of items."""
    offset = (page - 1) * per_page

    total = await db.scalar(select(func.count(Item.id)))  # pylint: disable=not-callable

    result = await db.execute(select(Item).offset(offset).limit(per_page))
    items = result.scalars().all()

    return ItemListResponse(
        data=[_to_response(item) for item in items],
        count=total or 0,
    )


async def get_item(db: AsyncSession, item_id: str) -> ItemResponse:
    """Return a single item by ID."""
    result = await db.execute(select(Item).where(Item.id == item_id))
    item = result.scalar_one_or_none()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    return _to_response(item)


async def create_item(db: AsyncSession, payload: ItemCreate) -> ItemResponse:
    """Create and persist a new item."""
    item = Item(name=payload.name, description=payload.description, status=payload.status)
    db.add(item)
    await db.flush()
    await db.refresh(item)

    logger.info("item_created id=%s name=%s", item.id, item.name)
    return _to_response(item)


def _to_response(item: Item) -> ItemResponse:
    """Map an ORM model to a response schema."""
    return ItemResponse(
        id=str(item.id),
        name=item.name,
        description=item.description,
        status=item.status,
        created_at=item.created_at.isoformat(),
        updated_at=item.updated_at.isoformat(),
    )
