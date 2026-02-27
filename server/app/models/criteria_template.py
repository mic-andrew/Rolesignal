"""Criteria template model for the reusable criteria library."""

from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class CriteriaTemplate(Base):
    __tablename__ = "criteria_templates"

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(
        Text, nullable=False, default=""
    )
    criteria: Mapped[dict] = mapped_column(JSON, nullable=False)
    # criteria JSON shape:
    # [
    #   {
    #     "name": "...", "description": "...", "weight": 25,
    #     "sub_criteria": [
    #       {"name": "...", "description": "...", "weight": 50}
    #     ]
    #   }
    # ]
