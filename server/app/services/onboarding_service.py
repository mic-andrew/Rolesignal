"""Onboarding service."""

import logging
import secrets

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.candidate import Candidate
from app.models.criterion import Criterion
from app.models.interview import Interview
from app.models.organization import Organization
from app.models.role import InterviewRole
from app.models.user import User
from app.schemas.onboarding import (
    OnboardingCompleteResponse,
    OnboardingProfileRequest,
    OnboardingRoleRequest,
    OnboardingTeamRequest,
)
from app.services import audit_service

logger = logging.getLogger(__name__)


async def complete_profile(
    db: AsyncSession, user: User, payload: OnboardingProfileRequest
) -> None:
    """Update user profile."""
    user.name = payload.name
    if payload.avatar_url:
        user.avatar_url = payload.avatar_url

    parts = payload.name.strip().split()
    if len(parts) >= 2:
        user.initials = (parts[0][0] + parts[-1][0]).upper()
    else:
        user.initials = payload.name[:2].upper()

    await db.flush()
    logger.info("onboarding_profile user_id=%s", user.id)


async def invite_team(
    db: AsyncSession, org: Organization, payload: OnboardingTeamRequest
) -> None:
    """Invite team members. Skips emails that already exist."""
    if not payload.emails:
        return

    result = await db.execute(
        select(User.email).where(User.email.in_(payload.emails))
    )
    existing_emails = {row[0] for row in result}

    new_emails = [e for e in payload.emails if e not in existing_emails]
    skipped = len(payload.emails) - len(new_emails)

    for email in new_emails:
        initials = email[:2].upper()
        member = User(
            organization_id=org.id,
            email=email,
            name=email.split("@")[0],
            initials=initials,
            role="Recruiter",
            status="invited",
        )
        db.add(member)

    await db.flush()
    logger.info(
        "onboarding_team org_id=%s invited=%d skipped=%d",
        org.id, len(new_emails), skipped,
    )


async def create_first_role(
    db: AsyncSession,
    org: Organization,
    user: User,
    payload: OnboardingRoleRequest,
) -> OnboardingCompleteResponse:
    """Create the first role, optionally a candidate + interview, and complete onboarding."""
    role = InterviewRole(
        organization_id=org.id,
        title=payload.title,
        department=payload.department,
        seniority=payload.seniority,
        location=payload.location,
        status="live",
    )
    db.add(role)
    await db.flush()

    for i, c in enumerate(payload.criteria):
        criterion = Criterion(
            role_id=role.id,
            name=c.name,
            description=c.description,
            weight=c.weight,
            question_count=c.question_count,
            color="#7C6FFF",
            sort_order=i,
        )
        db.add(criterion)

    await db.flush()

    interview_link: str | None = None

    if payload.candidate:
        initials = _make_initials(payload.candidate.name)
        candidate = Candidate(
            role_id=role.id,
            organization_id=org.id,
            name=payload.candidate.name,
            initials=initials,
            email=payload.candidate.email,
            status="pending",
            color="#7C6FFF",
        )
        db.add(candidate)
        await db.flush()

        token = secrets.token_urlsafe(32)
        interview = Interview(
            candidate_id=candidate.id,
            role_id=role.id,
            organization_id=org.id,
            token=token,
            status="pending",
            config_duration=30,
            config_tone="Professional",
            config_adaptive=True,
        )
        db.add(interview)
        await db.flush()

        interview_link = f"{settings.frontend_url}/i/{token}"
        logger.info(
            "onboarding_candidate_created candidate_id=%s interview_id=%s",
            candidate.id, interview.id,
        )

    org.onboarding_completed = True
    await db.flush()

    await audit_service.log_event(
        db, org.id, user.id, "system", "Onboarding Complete",
        f"Organization setup completed. First role: {role.title}", "🎉",
    )

    logger.info("onboarding_complete org_id=%s role_id=%s", org.id, role.id)
    return OnboardingCompleteResponse(
        message="Onboarding complete",
        role_id=str(role.id),
        interview_link=interview_link,
    )


def _make_initials(name: str) -> str:
    parts = name.strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return name[:2].upper()
