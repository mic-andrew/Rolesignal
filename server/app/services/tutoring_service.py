"""Tutoring service — text-based AI tutoring sessions."""

import logging
import uuid
from datetime import datetime, timezone

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.problem import Problem
from app.models.tutoring_message import TutoringMessage
from app.models.tutoring_session import TutoringSession
from app.services.llm_service import get_llm
from app.services.tutoring_prompts import TUTOR_SYSTEM

logger = logging.getLogger(__name__)


async def start_session(
    db: AsyncSession,
    user_id: uuid.UUID,
    problem_id: uuid.UUID,
    voice_enabled: bool = False,
) -> TutoringSession:
    """Start a new tutoring session for a problem."""
    session = TutoringSession(
        user_id=user_id,
        problem_id=problem_id,
        started_at=datetime.now(timezone.utc),
        voice_enabled=voice_enabled,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    logger.info(
        "tutoring_session_started session_id=%s user_id=%s problem_id=%s voice=%s",
        session.id, user_id, problem_id, voice_enabled,
    )
    return session


async def send_message(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
    content: str,
    current_code: str,
    language: str,
) -> TutoringMessage:
    """Send a message in a tutoring session and get AI response."""
    # Verify session ownership
    session = await _get_session(db, session_id, user_id)
    if not session:
        raise ValueError("Tutoring session not found")
    if session.ended_at:
        raise ValueError("Tutoring session has ended")

    # Get problem context
    problem = await _get_problem(db, session.problem_id)
    if not problem:
        raise ValueError("Problem not found")

    # Save user message
    user_msg = TutoringMessage(
        session_id=session_id,
        speaker="user",
        content=content,
        message_type="text",
    )
    db.add(user_msg)
    await db.flush()

    # Build conversation for LLM
    system_prompt = _build_system_prompt(problem, current_code, language)
    history = await _get_session_messages(db, session_id)
    messages = _build_langchain_messages(system_prompt, history)

    # Call LLM
    llm = get_llm()
    ai_response = await llm.ainvoke(messages)
    ai_text = ai_response.content if isinstance(ai_response.content, str) else str(ai_response.content)

    # Classify response type
    message_type = _classify_message_type(ai_text)

    # Save AI message
    ai_msg = TutoringMessage(
        session_id=session_id,
        speaker="ai",
        content=ai_text,
        message_type=message_type,
    )
    db.add(ai_msg)
    await db.commit()
    await db.refresh(ai_msg)

    logger.info(
        "tutoring_message session_id=%s type=%s",
        session_id, message_type,
    )
    return ai_msg


async def get_session_messages(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
) -> list[TutoringMessage]:
    """Get all messages for a tutoring session."""
    session = await _get_session(db, session_id, user_id)
    if not session:
        raise ValueError("Tutoring session not found")
    return await _get_session_messages(db, session_id)


async def end_session(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
) -> TutoringSession:
    """End a tutoring session."""
    session = await _get_session(db, session_id, user_id)
    if not session:
        raise ValueError("Tutoring session not found")

    session.ended_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(session)

    logger.info("tutoring_session_ended session_id=%s", session_id)
    return session


async def get_session(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
) -> TutoringSession | None:
    """Get a tutoring session by ID."""
    return await _get_session(db, session_id, user_id)


def _build_system_prompt(problem: Problem, current_code: str, language: str) -> str:
    """Build the system prompt with problem and code context."""
    return TUTOR_SYSTEM.format(
        problem_title=problem.title,
        difficulty=problem.difficulty,
        problem_description=problem.description,
        constraints=problem.constraints or "None specified",
        time_complexity=problem.time_complexity or "Not specified",
        space_complexity=problem.space_complexity or "Not specified",
        language=language,
        current_code=current_code or "# No code written yet",
    )


def _build_langchain_messages(
    system_prompt: str,
    history: list[TutoringMessage],
) -> list:
    """Convert session history to LangChain message format."""
    messages = [SystemMessage(content=system_prompt)]
    for msg in history:
        if msg.speaker == "user":
            messages.append(HumanMessage(content=msg.content))
        else:
            messages.append(AIMessage(content=msg.content))
    return messages


def _classify_message_type(text: str) -> str:
    """Classify the AI response type based on content patterns."""
    lower = text.lower()
    if any(kw in lower for kw in ["hint:", "try thinking about", "consider using", "what if you"]):
        return "hint"
    if any(kw in lower for kw in ["complexity", "o(n)", "o(1)", "time complexity", "space complexity"]):
        return "explanation"
    if any(kw in lower for kw in ["your code", "in your solution", "looking at line", "your approach"]):
        return "code_review"
    return "text"


async def _get_session(
    db: AsyncSession,
    session_id: uuid.UUID,
    user_id: uuid.UUID,
) -> TutoringSession | None:
    """Get a session if owned by user."""
    result = await db.execute(
        select(TutoringSession).where(
            TutoringSession.id == session_id,
            TutoringSession.user_id == user_id,
        ),
    )
    return result.scalar_one_or_none()


async def _get_session_messages(
    db: AsyncSession,
    session_id: uuid.UUID,
) -> list[TutoringMessage]:
    """Get all messages for a session in order."""
    result = await db.execute(
        select(TutoringMessage)
        .where(TutoringMessage.session_id == session_id)
        .order_by(TutoringMessage.created_at),
    )
    return list(result.scalars().all())


async def _get_problem(
    db: AsyncSession,
    problem_id: uuid.UUID,
) -> Problem | None:
    """Get a problem by ID."""
    result = await db.execute(
        select(Problem).where(Problem.id == problem_id),
    )
    return result.scalar_one_or_none()
