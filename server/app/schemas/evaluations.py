"""Evaluation schemas."""

from app.schemas.base import CamelModel
from app.schemas.candidates import CandidateResponse, CandidateSkills


class CriterionScoreResponse(CamelModel):
    name: str
    score: float
    rationale: str
    evidence: list[str]
    risk_flags: list[str]


class TranscriptMessageResponse(CamelModel):
    id: str
    speaker: str
    text: str
    timestamp: str


class EvaluationResponse(CamelModel):
    candidate: CandidateResponse
    confidence: float
    criterion_scores: list[CriterionScoreResponse]
    transcript: list[TranscriptMessageResponse]


class RankingCandidate(CamelModel):
    id: str
    name: str
    initials: str
    score: float
    status: str
    color: str
    role_id: str
    skills: CandidateSkills
