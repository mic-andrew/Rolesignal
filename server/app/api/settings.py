"""Settings routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.settings import (
    IntegrationResponse,
    InviteRequest,
    TeamMemberResponse,
    TemplateCreateRequest,
    TemplateResponse,
)
from app.services import settings_service

router = APIRouter(prefix="/settings", tags=["settings"])


# ── Team ─────────────────────────────────────────────────────────────────────

@router.get("/team", response_model=list[TeamMemberResponse])
async def list_team(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[TeamMemberResponse]:
    """List team members."""
    return await settings_service.list_team(db, user.organization_id)


@router.post("/team/invite", response_model=TeamMemberResponse, status_code=201)
async def invite_member(
    payload: InviteRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TeamMemberResponse:
    """Invite a new team member."""
    return await settings_service.invite_member(db, user.organization_id, user.id, payload)


@router.delete("/team/{member_id}", response_model=MessageResponse)
async def remove_member(
    member_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Remove a team member."""
    await settings_service.remove_member(db, user.organization_id, user.id, member_id)
    return MessageResponse(message="Team member removed")


# ── Templates ────────────────────────────────────────────────────────────────

@router.get("/templates", response_model=list[TemplateResponse])
async def list_templates(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[TemplateResponse]:
    """List interview templates."""
    return await settings_service.list_templates(db, user.organization_id)


@router.post("/templates", response_model=TemplateResponse, status_code=201)
async def create_template(
    payload: TemplateCreateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> TemplateResponse:
    """Create an interview template."""
    return await settings_service.create_template(db, user.organization_id, payload)


@router.delete("/templates/{template_id}", response_model=MessageResponse)
async def delete_template(
    template_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Delete a template."""
    await settings_service.delete_template(db, user.organization_id, template_id)
    return MessageResponse(message="Template deleted")


# ── Integrations ─────────────────────────────────────────────────────────────

@router.get("/integrations", response_model=list[IntegrationResponse])
async def list_integrations(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[IntegrationResponse]:
    """List integrations."""
    return await settings_service.list_integrations(db, user.organization_id)


@router.put("/integrations/{integration_id}", response_model=IntegrationResponse)
async def toggle_integration(
    integration_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> IntegrationResponse:
    """Toggle an integration's connected status."""
    return await settings_service.toggle_integration(
        db, user.organization_id, integration_id
    )
