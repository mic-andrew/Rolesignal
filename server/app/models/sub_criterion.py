"""Sub-criterion model."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.criterion import Criterion


class SubCriterion(Base):
    __tablename__ = "sub_criteria"

    criterion_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("criteria.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(
        Text, nullable=False, default=""
    )
    weight: Mapped[int] = mapped_column(
        Integer, nullable=False, default=20
    )
    sort_order: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )

    criterion: Mapped["Criterion"] = relationship(
        back_populates="sub_criteria"
    )
