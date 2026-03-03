"""Pivot to DSA learning platform.

Drop all interview-specific tables and create new DSA domain tables.

Revision ID: b1c2d3e4f5g6
Revises: a1b2c3d4e5f6
Create Date: 2026-03-03 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "b1c2d3e4f5g6"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Drop old interview-specific tables (reverse dependency order) ──
    # Use IF EXISTS since downgrade doesn't recreate these
    for table in [
        "sub_criterion_scores", "criterion_scores", "transcript_messages",
        "evaluations", "interviews", "candidates", "sub_criteria",
        "criteria", "interview_roles", "interview_templates",
        "integrations", "criteria_templates", "audit_events",
    ]:
        op.execute(f"DROP TABLE IF EXISTS {table} CASCADE")

    # ── Create new DSA tables ──

    op.create_table(
        "topics",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
        sa.Column("slug", sa.String(100), nullable=False, unique=True),
        sa.Column("description", sa.Text, nullable=False, server_default=""),
        sa.Column("icon", sa.String(50), nullable=False, server_default="code"),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("category", sa.String(30), nullable=False, server_default="core_dsa"),
        sa.Column("problem_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    op.create_table(
        "problems",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(255), nullable=False, unique=True),
        sa.Column("description", sa.Text, nullable=False),
        sa.Column("difficulty", sa.String(10), nullable=False),
        sa.Column("topic_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("topics.id"), nullable=False),
        sa.Column("constraints", postgresql.JSON, nullable=False, server_default="[]"),
        sa.Column("examples", postgresql.JSON, nullable=False, server_default="[]"),
        sa.Column("starter_code", postgresql.JSON, nullable=False, server_default="{}"),
        sa.Column("driver_code", postgresql.JSON, nullable=False, server_default="{}"),
        sa.Column("solution_code", postgresql.JSON, nullable=False, server_default="{}"),
        sa.Column("hints", postgresql.JSON, nullable=False, server_default="[]"),
        sa.Column("time_complexity", sa.String(50), nullable=False, server_default=""),
        sa.Column("space_complexity", sa.String(50), nullable=False, server_default=""),
        sa.Column("time_limit_ms", sa.Integer, nullable=False, server_default="2000"),
        sa.Column("memory_limit_kb", sa.Integer, nullable=False, server_default="131072"),
        sa.Column("accepted_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("submission_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("status", sa.String(10), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    op.create_table(
        "test_cases",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("problem_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("problems.id"), nullable=False),
        sa.Column("input", sa.Text, nullable=False),
        sa.Column("expected_output", sa.Text, nullable=False),
        sa.Column("is_sample", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("sort_order", sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    op.create_table(
        "submissions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("problem_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("problems.id"), nullable=False),
        sa.Column("language", sa.String(20), nullable=False),
        sa.Column("source_code", sa.Text, nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("runtime_ms", sa.Integer, nullable=True),
        sa.Column("memory_kb", sa.Integer, nullable=True),
        sa.Column("judge0_token", sa.String(100), nullable=True),
        sa.Column("stdout", sa.Text, nullable=True),
        sa.Column("stderr", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    op.create_table(
        "user_progress",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("problem_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("problems.id"), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="not_started"),
        sa.Column("best_submission_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("submissions.id"), nullable=True),
        sa.Column("attempts_count", sa.Integer, nullable=False, server_default="0"),
        sa.Column("solved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.UniqueConstraint("user_id", "problem_id", name="uq_user_problem"),
    )

    op.create_table(
        "tutoring_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("problem_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("problems.id"), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("voice_enabled", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    op.create_table(
        "tutoring_messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("session_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("tutoring_sessions.id"), nullable=False),
        sa.Column("speaker", sa.String(10), nullable=False),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("message_type", sa.String(20), nullable=False, server_default="text"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    # Indexes for common query patterns
    op.create_index("ix_problems_topic_id", "problems", ["topic_id"])
    op.create_index("ix_problems_difficulty", "problems", ["difficulty"])
    op.create_index("ix_test_cases_problem_id", "test_cases", ["problem_id"])
    op.create_index("ix_submissions_user_id", "submissions", ["user_id"])
    op.create_index("ix_submissions_problem_id", "submissions", ["problem_id"])
    op.create_index("ix_user_progress_user_id", "user_progress", ["user_id"])
    op.create_index("ix_tutoring_sessions_user_id", "tutoring_sessions", ["user_id"])
    op.create_index("ix_tutoring_messages_session_id", "tutoring_messages", ["session_id"])


def downgrade() -> None:
    # Drop new tables
    op.drop_table("tutoring_messages")
    op.drop_table("tutoring_sessions")
    op.drop_table("user_progress")
    op.drop_table("submissions")
    op.drop_table("test_cases")
    op.drop_table("problems")
    op.drop_table("topics")
    # Note: old interview tables would need to be recreated for a full downgrade.
    # Since this is a complete pivot, downgrade is intentionally incomplete.
