"""Evaluation service."""

import logging
import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.candidate import Candidate
from app.models.criterion import Criterion
from app.models.criterion_score import CriterionScore
from app.models.evaluation import Evaluation
from app.models.interview import Interview
from app.models.sub_criterion_score import SubCriterionScore
from app.schemas.candidates import CandidateSkills
from app.schemas.evaluations import (
    CriterionScoreResponse,
    EvaluationResponse,
    RankingCandidate,
    SubCriterionScoreResponse,
    TranscriptMessageResponse,
)
from app.schemas.candidates import CandidateResponse

logger = logging.getLogger(__name__)


async def get_evaluation(
    db: AsyncSession, org_id: uuid.UUID, candidate_id: str
) -> EvaluationResponse:
    """Get the full evaluation for a candidate."""
    candidate_result = await db.execute(
        select(Candidate)
        .options(selectinload(Candidate.role))
        .where(Candidate.id == candidate_id, Candidate.organization_id == org_id)
    )
    candidate = candidate_result.scalar_one_or_none()
    if candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    eval_result = await db.execute(
        select(Evaluation)
        .options(
            selectinload(Evaluation.criterion_scores).selectinload(CriterionScore.criterion),
            selectinload(Evaluation.sub_criterion_scores).selectinload(SubCriterionScore.sub_criterion),
            selectinload(Evaluation.interview).selectinload(Interview.transcript_messages),
        )
        .join(Interview, Evaluation.interview_id == Interview.id)
        .where(Evaluation.candidate_id == candidate_id)
        .order_by(Interview.completed_at.desc())
        .limit(1)
    )
    evaluation = eval_result.scalar_one_or_none()

    if evaluation is None:
        raise HTTPException(status_code=404, detail="No evaluation found for this candidate")

    scores = evaluation.criterion_scores
    sub_scores_by_criterion = _group_sub_scores(evaluation.sub_criterion_scores)

    criterion_scores = [
        CriterionScoreResponse(
            name=cs.criterion.name if cs.criterion else "Unknown",
            score=cs.score,
            rationale=cs.rationale,
            evidence=cs.evidence or [],
            risk_flags=cs.risk_flags or [],
            weight=cs.criterion.weight if cs.criterion else 0,
            sub_criterion_scores=sub_scores_by_criterion.get(
                cs.criterion_id, []
            ),
        )
        for cs in scores
    ]

    messages = sorted(evaluation.interview.transcript_messages, key=lambda m: m.sort_order)
    transcript = [
        TranscriptMessageResponse(
            id=str(m.id),
            speaker=m.speaker,
            text=m.text,
            timestamp=m.created_at.isoformat(),
        )
        for m in messages
    ]

    score_map = {cs.criterion.name.lower(): cs.score for cs in scores if cs.criterion}
    skills = CandidateSkills(
        tech=score_map.get("system design", score_map.get("react & typescript", 0.0)),
        behavioral=score_map.get("team collaboration", 0.0),
        communication=score_map.get("team collaboration", 0.0),
        problem_solving=score_map.get("problem solving", 0.0),
        culture=score_map.get("team collaboration", 0.0),
    )

    interview = evaluation.interview
    duration = interview.duration_seconds or 0

    candidate_response = CandidateResponse(
        id=str(candidate.id),
        name=candidate.name,
        initials=candidate.initials,
        email=candidate.email,
        score=evaluation.overall_score,
        status=candidate.status,
        date=candidate.created_at.isoformat(),
        skills=skills,
        color=candidate.color,
        role=candidate.role.title if candidate.role else "",
        role_id=str(candidate.role_id),
        duration=duration,
    )

    return EvaluationResponse(
        candidate=candidate_response,
        confidence=evaluation.confidence,
        criterion_scores=criterion_scores,
        transcript=transcript,
    )


async def get_rankings(
    db: AsyncSession, org_id: uuid.UUID, role_id: str
) -> list[RankingCandidate]:
    """Get ranked candidates for a role."""
    result = await db.execute(
        select(Candidate)
        .options(selectinload(Candidate.evaluations))
        .where(Candidate.role_id == role_id, Candidate.organization_id == org_id)
    )
    candidates = result.scalars().all()

    ranked = []
    for c in candidates:
        best_eval = max(c.evaluations, key=lambda e: e.overall_score) if c.evaluations else None
        score = best_eval.overall_score if best_eval else 0.0
        ranked.append(
            RankingCandidate(
                id=str(c.id),
                name=c.name,
                initials=c.initials,
                score=score,
                status=c.status,
                color=c.color,
                role_id=str(c.role_id),
                skills=CandidateSkills(),
            )
        )

    ranked.sort(key=lambda r: r.score, reverse=True)
    return ranked


def _group_sub_scores(
    sub_scores: list[SubCriterionScore],
) -> dict[str, list[SubCriterionScoreResponse]]:
    """Group sub-criterion scores by their parent criterion_id."""
    grouped: dict[str, list[SubCriterionScoreResponse]] = {}
    for scs in sub_scores:
        sub = scs.sub_criterion
        if not sub:
            continue
        crit_id = sub.criterion_id
        if crit_id not in grouped:
            grouped[crit_id] = []
        grouped[crit_id].append(
            SubCriterionScoreResponse(
                name=sub.name,
                score=scs.score,
                rationale=scs.rationale,
                evidence=scs.evidence or [],
                weight=sub.weight,
            )
        )
    return grouped
