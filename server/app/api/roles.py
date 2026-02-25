"""Roles routes."""

import logging

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.base import CamelModel
from app.schemas.common import MessageResponse
from app.schemas.roles import (
    RoleCreateRequest,
    RoleDetailResponse,
    RoleListResponse,
    RoleResponse,
    RoleUpdateRequest,
)
from app.services import role_service
from app.services.criteria_parser import extract_criteria
from app.services.file_parser import extract_text

logger = logging.getLogger(__name__)

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
    await role_service.delete_role(
        db, user.organization_id, user.id, role_id
    )
    return MessageResponse(message="Role closed")


# --- File upload & criteria extraction ---


class ExtractedTextResponse(CamelModel):
    text: str


class CriterionParsed(CamelModel):
    name: str
    description: str
    weight: int
    question_count: int
    color: str


class ExtractCriteriaRequest(BaseModel):
    text: str


class ExtractCriteriaResponse(CamelModel):
    criteria: list[CriterionParsed]


@router.post(
    "/upload-jd",
    response_model=ExtractedTextResponse,
)
async def upload_jd(
    file: UploadFile,
    _user: User = Depends(get_current_user),
) -> ExtractedTextResponse:
    """Extract text from an uploaded JD file."""
    try:
        text = await extract_text(file)
    except ValueError as exc:
        raise HTTPException(
            status_code=400, detail=str(exc)
        ) from exc
    return ExtractedTextResponse(text=text)


@router.post(
    "/extract-criteria",
    response_model=ExtractCriteriaResponse,
)
async def extract_criteria_endpoint(
    payload: ExtractCriteriaRequest,
    _user: User = Depends(get_current_user),
) -> ExtractCriteriaResponse:
    """Parse text into structured evaluation criteria."""
    parsed = extract_criteria(payload.text)
    criteria = [CriterionParsed(**c) for c in parsed]
    return ExtractCriteriaResponse(criteria=criteria)
