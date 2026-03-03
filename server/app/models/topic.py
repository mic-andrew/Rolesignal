"""Topic model — DSA topic categories."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.problem import Problem


class Topic(Base):
    __tablename__ = "topics"

    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    slug: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    icon: Mapped[str] = mapped_column(String(50), nullable=False, default="code")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    category: Mapped[str] = mapped_column(
        String(30), nullable=False, default="core_dsa",
    )  # core_dsa, advanced, system_design
    problem_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    problems: Mapped[list["Problem"]] = relationship(back_populates="topic")
