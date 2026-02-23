"""Schemas for the items resource.

Replace with your domain-specific schemas.
"""

from pydantic import BaseModel


class ItemBase(BaseModel):
    """Shared item fields."""

    name: str
    description: str | None = None
    status: str = "active"


class ItemCreate(ItemBase):
    """Request body for creating an item."""


class ItemResponse(ItemBase):
    """Single item response."""

    id: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class ItemListResponse(BaseModel):
    """Paginated list of items."""

    data: list[ItemResponse]
    count: int
