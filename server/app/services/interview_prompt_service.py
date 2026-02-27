"""Build system prompts for the AI interviewer."""

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.criterion import Criterion
from app.models.interview import Interview
from app.models.role import InterviewRole
from app.services.prompts import INTERVIEW_SYSTEM, TONE_INSTRUCTIONS

logger = logging.getLogger(__name__)


async def build_interview_system_prompt(
    db: AsyncSession,
    interview_id: str,
) -> str:
    """Build the system prompt for the AI interviewer from role + criteria data."""
    result = await db.execute(
        select(Interview)
        .options(selectinload(Interview.candidate))
        .where(Interview.id == interview_id)
    )
    interview = result.scalar_one()

    role_result = await db.execute(
        select(InterviewRole)
        .options(
            selectinload(InterviewRole.criteria)
            .selectinload(Criterion.sub_criteria)
        )
        .where(InterviewRole.id == interview.role_id)
    )
    role = role_result.scalar_one()

    criteria_text = _format_criteria(role.criteria)
    tone_instruction = TONE_INSTRUCTIONS.get(
        interview.config_tone,
        TONE_INSTRUCTIONS["Professional"],
    )

    return INTERVIEW_SYSTEM.format(
        role_title=role.title,
        department=role.department,
        seniority=role.seniority,
        duration=interview.config_duration,
        tone=interview.config_tone,
        candidate_name=interview.candidate.name,
        tone_instruction=tone_instruction,
        criteria_text=criteria_text,
    )


def _format_criteria(criteria: list) -> str:
    """Format the criteria tree into text for the system prompt."""
    lines = []
    for c in sorted(criteria, key=lambda x: x.sort_order):
        lines.append(f"\n{c.name} (Weight: {c.weight}%)")
        if c.description:
            lines.append(f"  Description: {c.description}")
        for sc in sorted(c.sub_criteria, key=lambda x: x.sort_order):
            lines.append(
                f"  - {sc.name}: {sc.description} "
                f"(Weight: {sc.weight}%)"
            )
    return "\n".join(lines)
