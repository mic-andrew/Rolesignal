"""Sub-criterion score model."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.evaluation import Evaluation
    from app.models.sub_criterion import SubCriterion


class SubCriterionScore(Base):
    __tablename__ = "sub_criterion_scores"

    evaluation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("evaluations.id", ondelete="CASCADE"),
        nullable=False,
    )
    sub_criterion_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sub_criteria.id"),
        nullable=False,
    )
    score: Mapped[float] = mapped_column(Float, nullable=False)
    rationale: Mapped[str] = mapped_column(
        Text, nullable=False, default=""
    )
    evidence: Mapped[list] = mapped_column(
        JSON, nullable=False, default=list
    )

    evaluation: Mapped["Evaluation"] = relationship(
        back_populates="sub_criterion_scores"
    )
    sub_criterion: Mapped["SubCriterion"] = relationship()
