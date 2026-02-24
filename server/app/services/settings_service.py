"""Settings service."""

import logging
import uuid

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.integration import Integration
from app.models.interview_template import InterviewTemplate
from app.models.user import User
from app.schemas.settings import (
    IntegrationResponse,
    InviteRequest,
    TeamMemberResponse,
    TemplateCreateRequest,
    TemplateResponse,
)
from app.services import audit_service

logger = logging.getLogger(__name__)


# ── Team ─────────────────────────────────────────────────────────────────────

async def list_team(db: AsyncSession, org_id: uuid.UUID) -> list[TeamMemberResponse]:
    """List team members for an organization."""
    result = await db.execute(
        select(User)
        .where(User.organization_id == org_id)
        .order_by(User.created_at.asc())
    )
    users = result.scalars().all()
    return [
        TeamMemberResponse(
            id=str(u.id),
            name=u.name,
            initials=u.initials,
            email=u.email,
            role=u.role,
            status=u.status,
        )
        for u in users
    ]


async def invite_member(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID, payload: InviteRequest
) -> TeamMemberResponse:
    """Invite a new team member."""
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="User already exists")

    initials = payload.email[:2].upper()
    user = User(
        organization_id=org_id,
        email=payload.email,
        name=payload.email.split("@")[0],
        initials=initials,
        role=payload.role,
        status="invited",
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    await audit_service.log_event(
        db, org_id, user_id, "human", "Team Invite",
        f"Invited {payload.email} as {payload.role}", "✉️",
    )

    return TeamMemberResponse(
        id=str(user.id),
        name=user.name,
        initials=user.initials,
        email=user.email,
        role=user.role,
        status=user.status,
    )


async def remove_member(
    db: AsyncSession, org_id: uuid.UUID, user_id: uuid.UUID, member_id: str
) -> None:
    """Remove a team member."""
    result = await db.execute(
        select(User).where(User.id == member_id, User.organization_id == org_id)
    )
    member = result.scalar_one_or_none()
    if member is None:
        raise HTTPException(status_code=404, detail="Team member not found")
    if str(member.id) == str(user_id):
        raise HTTPException(status_code=400, detail="Cannot remove yourself")

    await audit_service.log_event(
        db, org_id, user_id, "human", "Team Member Removed",
        f"Removed {member.email}", "🗑️",
    )
    await db.delete(member)
    await db.flush()


# ── Templates ────────────────────────────────────────────────────────────────

async def list_templates(db: AsyncSession, org_id: uuid.UUID) -> list[TemplateResponse]:
    """List interview templates."""
    result = await db.execute(
        select(InterviewTemplate)
        .where(InterviewTemplate.organization_id == org_id)
        .order_by(InterviewTemplate.created_at.desc())
    )
    templates = result.scalars().all()
    return [
        TemplateResponse(
            id=str(t.id),
            name=t.name,
            role=t.role_label,
            duration=t.duration,
            criteria_count=t.criteria_count,
            used_count=t.used_count,
        )
        for t in templates
    ]


async def create_template(
    db: AsyncSession, org_id: uuid.UUID, payload: TemplateCreateRequest
) -> TemplateResponse:
    """Create an interview template."""
    template = InterviewTemplate(
        organization_id=org_id,
        name=payload.name,
        role_label=payload.role_label,
        duration=payload.duration,
        criteria_count=payload.criteria_count,
    )
    db.add(template)
    await db.flush()
    await db.refresh(template)

    return TemplateResponse(
        id=str(template.id),
        name=template.name,
        role=template.role_label,
        duration=template.duration,
        criteria_count=template.criteria_count,
        used_count=template.used_count,
    )


async def delete_template(
    db: AsyncSession, org_id: uuid.UUID, template_id: str
) -> None:
    """Delete an interview template."""
    result = await db.execute(
        select(InterviewTemplate).where(
            InterviewTemplate.id == template_id,
            InterviewTemplate.organization_id == org_id,
        )
    )
    template = result.scalar_one_or_none()
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    await db.delete(template)
    await db.flush()


# ── Integrations ─────────────────────────────────────────────────────────────

async def list_integrations(db: AsyncSession, org_id: uuid.UUID) -> list[IntegrationResponse]:
    """List integrations."""
    result = await db.execute(
        select(Integration)
        .where(Integration.organization_id == org_id)
        .order_by(Integration.created_at.asc())
    )
    integrations = result.scalars().all()
    return [
        IntegrationResponse(
            id=str(i.id),
            name=i.name,
            emoji=i.emoji,
            connected=i.connected,
            description=i.description,
        )
        for i in integrations
    ]


async def toggle_integration(
    db: AsyncSession, org_id: uuid.UUID, integration_id: str
) -> IntegrationResponse:
    """Toggle an integration's connected status."""
    result = await db.execute(
        select(Integration).where(
            Integration.id == integration_id,
            Integration.organization_id == org_id,
        )
    )
    integration = result.scalar_one_or_none()
    if integration is None:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration.connected = not integration.connected
    await db.flush()

    return IntegrationResponse(
        id=str(integration.id),
        name=integration.name,
        emoji=integration.emoji,
        connected=integration.connected,
        description=integration.description,
    )
