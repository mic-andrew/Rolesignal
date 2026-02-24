"""Authentication schemas."""

from pydantic import BaseModel, EmailStr

from app.schemas.base import CamelModel


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class GoogleLoginRequest(BaseModel):
    credential: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    org_name: str


class UserResponse(CamelModel):
    id: str
    email: str
    name: str
    initials: str
    role: str
    organization_id: str
    onboarding_completed: bool
    avatar_url: str | None = None


class AuthResponse(CamelModel):
    token: str
    user: UserResponse
