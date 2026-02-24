"""Authentication service."""

import logging

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.organization import Organization
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from app.utils.google_oauth import verify_google_token
from app.utils.security import create_access_token, hash_password, verify_password

logger = logging.getLogger(__name__)


async def register(db: AsyncSession, payload: RegisterRequest) -> AuthResponse:
    """Register a new user and organization."""
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    org = Organization(name=payload.org_name)
    db.add(org)
    await db.flush()

    initials = _make_initials(payload.name)
    user = User(
        organization_id=org.id,
        email=payload.email,
        name=payload.name,
        initials=initials,
        password_hash=hash_password(payload.password),
        role="Admin",
        status="active",
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    await db.refresh(org)

    logger.info("user_registered user_id=%s org_id=%s", user.id, org.id)
    token = create_access_token({"sub": str(user.id)})
    return AuthResponse(token=token, user=_to_user_response(user, org))


async def login(db: AsyncSession, payload: LoginRequest) -> AuthResponse:
    """Authenticate a user with email and password."""
    result = await db.execute(
        select(User)
        .options(selectinload(User.organization))
        .where(User.email == payload.email)
    )
    user = result.scalar_one_or_none()

    if user is None or user.password_hash is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    logger.info("user_logged_in user_id=%s", user.id)
    token = create_access_token({"sub": str(user.id)})
    return AuthResponse(token=token, user=_to_user_response(user, user.organization))


async def google_login(db: AsyncSession, payload: GoogleLoginRequest) -> AuthResponse:
    """Authenticate or register a user via Google OAuth."""
    try:
        google_info = verify_google_token(payload.credential)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    result = await db.execute(
        select(User)
        .options(selectinload(User.organization))
        .where(User.email == google_info.email)
    )
    user = result.scalar_one_or_none()

    if user is None:
        org = Organization(name=f"{google_info.name}'s Team")
        db.add(org)
        await db.flush()

        user = User(
            organization_id=org.id,
            email=google_info.email,
            name=google_info.name,
            initials=_make_initials(google_info.name),
            google_id=google_info.google_id,
            avatar_url=google_info.picture,
            role="Admin",
            status="active",
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)
        await db.refresh(org)
        logger.info("google_user_registered user_id=%s", user.id)
    else:
        if not user.google_id:
            user.google_id = google_info.google_id
        if google_info.picture:
            user.avatar_url = google_info.picture
        await db.flush()
        logger.info("google_user_logged_in user_id=%s", user.id)

    org = user.organization
    token = create_access_token({"sub": str(user.id)})
    return AuthResponse(token=token, user=_to_user_response(user, org))


def _to_user_response(user: User, org: Organization) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        initials=user.initials,
        role=user.role,
        organization_id=str(user.organization_id),
        onboarding_completed=org.onboarding_completed,
        avatar_url=user.avatar_url,
    )


def _make_initials(name: str) -> str:
    parts = name.strip().split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return name[:2].upper()
