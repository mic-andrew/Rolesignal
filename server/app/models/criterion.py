"""Criterion model."""

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Criterion(Base):
    __tablename__ = "criteria"

    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interview_roles.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    weight: Mapped[int] = mapped_column(Integer, nullable=False, default=20)
    question_count: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    color: Mapped[str] = mapped_column(String(20), nullable=False, default="#7C6FFF")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    role: Mapped["InterviewRole"] = relationship(back_populates="criteria")
