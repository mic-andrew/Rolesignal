"""ORM models package.

Import all models here so Alembic can discover them for autogenerate.
"""

from app.models.base import Base
from app.models.organization import Organization
from app.models.user import User
from app.models.role import InterviewRole
from app.models.criterion import Criterion
from app.models.candidate import Candidate
from app.models.interview import Interview
from app.models.evaluation import Evaluation
from app.models.criterion_score import CriterionScore
from app.models.transcript_message import TranscriptMessage
from app.models.audit_event import AuditEvent
from app.models.interview_template import InterviewTemplate
from app.models.integration import Integration

__all__ = [
    "Base",
    "Organization",
    "User",
    "InterviewRole",
    "Criterion",
    "Candidate",
    "Interview",
    "Evaluation",
    "CriterionScore",
    "TranscriptMessage",
    "AuditEvent",
    "InterviewTemplate",
    "Integration",
]
