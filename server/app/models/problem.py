"""Problem model — coding challenges."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.test_case import TestCase
    from app.models.topic import Topic


class Problem(Base):
    __tablename__ = "problems"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(
        String(10), nullable=False,
    )  # easy, medium, hard
    topic_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("topics.id"), nullable=False,
    )
    constraints: Mapped[list] = mapped_column(
        JSON, nullable=False, default=list,
    )  # ["2 <= nums.length <= 10^4", ...]
    examples: Mapped[list] = mapped_column(
        JSON, nullable=False, default=list,
    )  # [{input, output, explanation}]
    starter_code: Mapped[dict] = mapped_column(
        JSON, nullable=False, default=dict,
    )  # {python: "...", javascript: "...", ...}
    driver_code: Mapped[dict] = mapped_column(
        JSON, nullable=False, default=dict,
    )  # {python: "...", ...} — stdin/stdout harness injected at submission time
    solution_code: Mapped[dict] = mapped_column(
        JSON, nullable=False, default=dict,
    )
    hints: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    time_complexity: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    space_complexity: Mapped[str] = mapped_column(String(50), nullable=False, default="")
    time_limit_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=2000)
    memory_limit_kb: Mapped[int] = mapped_column(Integer, nullable=False, default=131072)  # 128 MB
    accepted_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    submission_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[str] = mapped_column(
        String(10), nullable=False, default="active",
    )  # active, draft

    topic: Mapped["Topic"] = relationship(back_populates="problems")
    test_cases: Mapped[list["TestCase"]] = relationship(
        back_populates="problem", cascade="all, delete-orphan",
    )
