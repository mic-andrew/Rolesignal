"""Roles routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.roles import (
    RoleCreateRequest,
    RoleDetailResponse,
    RoleListResponse,
    RoleResponse,
    RoleUpdateRequest,
)
from app.services import role_service

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("", response_model=RoleListResponse)
async def list_roles(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RoleListResponse:
    """List all roles for the organization."""
    return await role_service.list_roles(db, user.organization_id)


@router.get("/{role_id}", response_model=RoleDetailResponse)
async def get_role(
    role_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RoleDetailResponse:
    """Get a single role with criteria."""
    return await role_service.get_role(db, user.organization_id, role_id)


@router.post("", response_model=RoleDetailResponse, status_code=201)
async def create_role(
    payload: RoleCreateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RoleDetailResponse:
    """Create a new role with criteria."""
    return await role_service.create_role(db, user.organization_id, user.id, payload)


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(
    role_id: str,
    payload: RoleUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RoleResponse:
    """Update a role."""
    return await role_service.update_role(db, user.organization_id, role_id, payload)


@router.delete("/{role_id}", response_model=MessageResponse)
async def delete_role(
    role_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Soft-delete a role."""
    await role_service.delete_role(db, user.organization_id, user.id, role_id)
    return MessageResponse(message="Role closed")
