"""Evaluation model."""

import uuid

from sqlalchemy import Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    interview_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("interviews.id"), unique=True, nullable=False
    )
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False
    )
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)

    interview: Mapped["Interview"] = relationship(back_populates="evaluation")
    candidate: Mapped["Candidate"] = relationship(back_populates="evaluations")
    criterion_scores: Mapped[list["CriterionScore"]] = relationship(
        back_populates="evaluation", cascade="all, delete-orphan"
    )
