"""UserProgress model — tracks per-user, per-problem solve status."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User


class UserProgress(Base):
    __tablename__ = "user_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "problem_id", name="uq_user_problem"),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False,
    )
    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("problems.id"), nullable=False,
    )
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="not_started",
    )  # not_started, attempted, solved
    best_submission_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("submissions.id"), nullable=True,
    )
    attempts_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    solved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )

    user: Mapped["User"] = relationship()
    problem: Mapped["Problem"] = relationship()
    best_submission: Mapped["Submission | None"] = relationship()
