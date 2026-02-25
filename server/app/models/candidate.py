"""Candidate model."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.evaluation import Evaluation
    from app.models.interview import Interview
    from app.models.role import InterviewRole


class Candidate(Base):
    __tablename__ = "candidates"

    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interview_roles.id"), nullable=False
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    initials: Mapped[str] = mapped_column(String(4), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")
    color: Mapped[str] = mapped_column(String(20), nullable=False, default="#7C6FFF")

    role: Mapped["InterviewRole"] = relationship(back_populates="candidates")
    interviews: Mapped[list["Interview"]] = relationship(back_populates="candidate")
    evaluations: Mapped[list["Evaluation"]] = relationship(back_populates="candidate")
