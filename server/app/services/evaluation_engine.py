"""Post-interview evaluation engine.

Scores each sub-criterion independently using LLM, then computes
weighted averages for parent criteria and overall score.
"""

import json
import logging
import uuid

from langchain_core.messages import HumanMessage, SystemMessage
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.models.candidate import Candidate
from app.models.criterion import Criterion
from app.models.criterion_score import CriterionScore
from app.models.evaluation import Evaluation
from app.models.interview import Interview
from app.models.sub_criterion_score import SubCriterionScore
from app.models.transcript_message import TranscriptMessage
from app.services.llm_service import get_llm
from app.services.prompts import EVALUATION_HUMAN, EVALUATION_SYSTEM

logger = logging.getLogger(__name__)


async def evaluate_interview(
    db: AsyncSession, interview_id: uuid.UUID
) -> None:
    """Evaluate an interview, creating Evaluation + score records.

    Sets interview status to "evaluating" → "evaluated" on success,
    or reverts to "completed" on failure for retry.
    """
    interview = await _fetch_interview(db, interview_id)
    interview.status = "evaluating"
    await db.flush()

    try:
        transcript = await _fetch_transcript(db, interview_id)
        if not transcript:
            logger.warning(
                "evaluation_skipped_no_transcript id=%s",
                interview_id,
            )
            interview.status = "completed"
            return

        criteria = await _fetch_criteria_with_subs(db, interview.role_id)
        if not criteria:
            logger.warning(
                "evaluation_skipped_no_criteria id=%s", interview_id
            )
            interview.status = "completed"
            return

        llm_result = await _call_llm(transcript, criteria)

        evaluation = _create_evaluation(
            db, interview, criteria, llm_result
        )
        db.add(evaluation)

        interview.status = "evaluated"

        candidate = await db.get(Candidate, interview.candidate_id)
        if candidate:
            candidate.status = "reviewed"
            candidate.score = evaluation.overall_score

        await db.flush()

        logger.info(
            "evaluation_completed id=%s score=%.1f confidence=%.2f",
            interview_id,
            evaluation.overall_score,
            evaluation.confidence,
        )

    except Exception:
        interview.status = "completed"
        raise


async def _fetch_interview(
    db: AsyncSession, interview_id: uuid.UUID
) -> Interview:
    """Load interview with candidate eagerly."""
    result = await db.execute(
        select(Interview)
        .options(selectinload(Interview.candidate))
        .where(Interview.id == interview_id)
    )
    interview = result.scalar_one_or_none()
    if not interview:
        raise ValueError(f"Interview {interview_id} not found")
    return interview


async def _fetch_transcript(
    db: AsyncSession, interview_id: uuid.UUID
) -> str:
    """Build a formatted transcript string from messages."""
    result = await db.execute(
        select(TranscriptMessage)
        .where(TranscriptMessage.interview_id == interview_id)
        .order_by(TranscriptMessage.sort_order)
    )
    messages = result.scalars().all()
    if not messages:
        return ""

    lines = []
    for msg in messages:
        speaker = "Interviewer" if msg.speaker == "ai" else "Candidate"
        lines.append(f"{speaker}: {msg.text}")
    return "\n\n".join(lines)


async def _fetch_criteria_with_subs(
    db: AsyncSession, role_id: uuid.UUID
) -> list[Criterion]:
    """Load criteria with sub-criteria for a role."""
    result = await db.execute(
        select(Criterion)
        .options(selectinload(Criterion.sub_criteria))
        .where(Criterion.role_id == role_id)
        .order_by(Criterion.sort_order)
    )
    return list(result.scalars().all())


def _format_criteria_for_prompt(criteria: list[Criterion]) -> str:
    """Format criteria tree into text for the evaluation prompt."""
    parts = []
    for c in criteria:
        sub_lines = []
        for sc in sorted(c.sub_criteria, key=lambda s: s.sort_order):
            sub_lines.append(
                f"    - {sc.name} (weight: {sc.weight}%): {sc.description}"
            )
        subs = "\n".join(sub_lines) if sub_lines else "    (no sub-criteria)"
        parts.append(
            f"  {c.name} (weight: {c.weight}%):\n"
            f"    Description: {c.description}\n"
            f"    Sub-criteria:\n{subs}"
        )
    return "\n\n".join(parts)


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry=retry_if_exception_type((Exception,)),
    reraise=True,
)
async def _call_llm(
    transcript: str, criteria: list[Criterion]
) -> dict:
    """Call LLM to evaluate the transcript. Retries on failure."""
    llm = get_llm()
    criteria_text = _format_criteria_for_prompt(criteria)
    human_msg = EVALUATION_HUMAN.format(
        transcript=transcript, criteria=criteria_text,
    )

    response = await llm.ainvoke([
        SystemMessage(content=EVALUATION_SYSTEM),
        HumanMessage(content=human_msg),
    ])

    raw = response.content
    if isinstance(raw, list):
        raw = raw[0].get("text", "") if raw else ""

    cleaned = _extract_json(raw)
    result = json.loads(cleaned)

    if "criteria" not in result:
        raise ValueError("LLM response missing 'criteria' key")

    return result


def _extract_json(text: str) -> str:
    """Extract JSON from LLM response that may have markdown fences."""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        start = 1
        end = len(lines)
        for i, line in enumerate(lines[1:], 1):
            if line.strip() == "```":
                end = i
                break
        text = "\n".join(lines[start:end])
    return text.strip()


def _create_evaluation(
    db: AsyncSession,
    interview: Interview,
    criteria: list[Criterion],
    llm_result: dict,
) -> Evaluation:
    """Create Evaluation + CriterionScore + SubCriterionScore records."""
    confidence = min(max(llm_result.get("confidence", 0.7), 0.0), 1.0)

    llm_criteria_map = {}
    for lc in llm_result.get("criteria", []):
        name = lc.get("criterion_name", "").strip().lower()
        llm_criteria_map[name] = lc

    criterion_scores = []
    sub_criterion_scores = []
    weighted_sum = 0.0
    total_weight = 0

    for criterion in criteria:
        llm_crit = llm_criteria_map.get(criterion.name.strip().lower(), {})
        llm_subs_map = {}
        for ls in llm_crit.get("sub_criteria", []):
            sub_name = ls.get("sub_criterion_name", "").strip().lower()
            llm_subs_map[sub_name] = ls

        sub_weighted_sum = 0.0
        sub_total_weight = 0
        crit_evidence = []
        crit_rationale_parts = []

        for sub in sorted(criterion.sub_criteria, key=lambda s: s.sort_order):
            llm_sub = llm_subs_map.get(sub.name.strip().lower(), {})
            sub_score = max(0, min(100, llm_sub.get("score", 0)))
            sub_rationale = llm_sub.get("rationale", "Not evaluated")
            sub_evidence = llm_sub.get("evidence", [])

            if not isinstance(sub_evidence, list):
                sub_evidence = [str(sub_evidence)]

            sc_score = SubCriterionScore(
                sub_criterion_id=sub.id,
                score=sub_score,
                rationale=sub_rationale,
                evidence=sub_evidence,
            )
            sub_criterion_scores.append(sc_score)

            sub_weighted_sum += sub_score * sub.weight
            sub_total_weight += sub.weight
            crit_evidence.extend(sub_evidence)
            crit_rationale_parts.append(
                f"{sub.name}: {sub_rationale}"
            )

        if sub_total_weight > 0:
            criterion_score_val = sub_weighted_sum / sub_total_weight
        else:
            criterion_score_val = 0.0

        cs = CriterionScore(
            criterion_id=criterion.id,
            score=round(criterion_score_val, 1),
            rationale="; ".join(crit_rationale_parts),
            evidence=crit_evidence[:5],
            risk_flags=[],
        )
        criterion_scores.append(cs)

        weighted_sum += criterion_score_val * criterion.weight
        total_weight += criterion.weight

    overall_score = (
        round(weighted_sum / total_weight, 1)
        if total_weight > 0
        else 0.0
    )

    evaluation = Evaluation(
        interview_id=interview.id,
        candidate_id=interview.candidate_id,
        overall_score=overall_score,
        confidence=round(confidence * 100, 1),
    )

    for cs in criterion_scores:
        evaluation.criterion_scores.append(cs)
    for scs in sub_criterion_scores:
        evaluation.sub_criterion_scores.append(scs)

    return evaluation
