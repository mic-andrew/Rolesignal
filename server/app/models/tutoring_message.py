"""TutoringMessage model — individual messages in a tutoring session."""

from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.tutoring_session import TutoringSession


class TutoringMessage(Base):
    __tablename__ = "tutoring_messages"

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tutoring_sessions.id"), nullable=False,
    )
    speaker: Mapped[str] = mapped_column(
        String(10), nullable=False,
    )  # ai, user
    content: Mapped[str] = mapped_column(Text, nullable=False)
    message_type: Mapped[str] = mapped_column(
        String(20), nullable=False, default="text",
    )  # text, hint, explanation, code_review

    session: Mapped["TutoringSession"] = relationship(back_populates="messages")
