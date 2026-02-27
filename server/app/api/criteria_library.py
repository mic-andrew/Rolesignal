"""Criteria library routes."""

import logging

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.criteria_library import (
    CriteriaTemplateCreate,
    CriteriaTemplateListResponse,
    CriteriaTemplateResponse,
    CriteriaTemplateUpdate,
)
from app.services import criteria_library_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/criteria-library",
    tags=["criteria-library"],
)


@router.get("", response_model=CriteriaTemplateListResponse)
async def list_templates(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CriteriaTemplateListResponse:
    """List all criteria templates for the organization."""
    return await criteria_library_service.list_templates(
        db, user.organization_id
    )


@router.post(
    "",
    response_model=CriteriaTemplateResponse,
    status_code=201,
)
async def create_template(
    payload: CriteriaTemplateCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CriteriaTemplateResponse:
    """Create a new criteria template."""
    return await criteria_library_service.create_template(
        db, user.organization_id, user.id, payload
    )


@router.get(
    "/{template_id}",
    response_model=CriteriaTemplateResponse,
)
async def get_template(
    template_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CriteriaTemplateResponse:
    """Get a single criteria template."""
    return await criteria_library_service.get_template(
        db, user.organization_id, template_id
    )


@router.put(
    "/{template_id}",
    response_model=CriteriaTemplateResponse,
)
async def update_template(
    template_id: str,
    payload: CriteriaTemplateUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CriteriaTemplateResponse:
    """Update a criteria template."""
    return await criteria_library_service.update_template(
        db, user.organization_id, template_id, payload
    )


@router.delete(
    "/{template_id}",
    response_model=MessageResponse,
)
async def delete_template(
    template_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Delete a criteria template."""
    await criteria_library_service.delete_template(
        db, user.organization_id, user.id, template_id
    )
    return MessageResponse(message="Template deleted")


@router.post(
    "/import-document",
    response_model=CriteriaTemplateResponse,
    status_code=201,
)
async def import_document(
    file: UploadFile,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CriteriaTemplateResponse:
    """Upload a criteria document and create a template via LLM."""
    try:
        return await criteria_library_service.import_from_document(
            db, user.organization_id, user.id, file
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400, detail=str(exc)
        ) from exc
