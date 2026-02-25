"""Interview role model."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.candidate import Candidate
    from app.models.criterion import Criterion
    from app.models.organization import Organization


class InterviewRole(Base):
    __tablename__ = "interview_roles"

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str] = mapped_column(String(255), nullable=False)
    seniority: Mapped[str] = mapped_column(String(50), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="live")

    organization: Mapped["Organization"] = relationship(back_populates="roles")
    criteria: Mapped[list["Criterion"]] = relationship(back_populates="role", cascade="all, delete-orphan")
    candidates: Mapped[list["Candidate"]] = relationship(back_populates="role")
