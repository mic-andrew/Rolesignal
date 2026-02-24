"""Interview model."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Interview(Base):
    __tablename__ = "interviews"

    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False
    )
    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interview_roles.id"), nullable=False
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False
    )
    token: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="pending")
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    scheduled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    config_duration: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    config_tone: Mapped[str] = mapped_column(String(50), nullable=False, default="Conversational")
    config_adaptive: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    candidate: Mapped["Candidate"] = relationship(back_populates="interviews")
    evaluation: Mapped["Evaluation | None"] = relationship(back_populates="interview", uselist=False)
    transcript_messages: Mapped[list["TranscriptMessage"]] = relationship(
        back_populates="interview", cascade="all, delete-orphan"
    )
