"""LLM-powered criteria extraction using LangChain.

Replaces the heuristic criteria_parser for primary extraction.
Falls back to criteria_parser on LLM failure.
"""

import logging
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from app.services.llm_service import get_llm
from app.services.prompts import (
    CRITERIA_EXTRACTION_HUMAN,
    CRITERIA_EXTRACTION_SYSTEM,
)

logger = logging.getLogger(__name__)

_MAX_CRITERIA = 5


async def generate_criteria_from_text(
    text: str,
    *,
    max_criteria: int = _MAX_CRITERIA,
) -> list[dict[str, Any]]:
    """Extract structured criteria with sub-criteria from text using LLM.

    Returns a list of criteria dicts with shape:
    [
        {
            "name": str,
            "description": str,
            "weight": int,
            "sub_criteria": [
                {"name": str, "description": str, "weight": int}
            ]
        }
    ]

    Raises ValueError if LLM output cannot be parsed into valid criteria.
    """
    system_prompt = CRITERIA_EXTRACTION_SYSTEM.format(
        max_criteria=max_criteria,
    )
    human_msg = CRITERIA_EXTRACTION_HUMAN.format(
        text=text[:8000],
    )

    raw = await _call_llm_with_retry(system_prompt, human_msg)
    return _normalize_criteria(raw, max_criteria)


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry=retry_if_exception_type((TimeoutError, ConnectionError)),
)
async def _call_llm_with_retry(
    system_prompt: str,
    human_msg: str,
) -> dict[str, Any]:
    """Call LLM with retry on transient failures."""
    llm = get_llm()
    parser = JsonOutputParser()

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_msg),
    ]

    response = await llm.ainvoke(messages)
    return parser.parse(response.content)


def _normalize_criteria(
    parsed: dict | list,
    max_criteria: int,
) -> list[dict[str, Any]]:
    """Validate LLM output and normalize weights to sum to 100."""
    if isinstance(parsed, dict):
        criteria_list = parsed.get("criteria", parsed)
    else:
        criteria_list = parsed

    if not isinstance(criteria_list, list) or len(criteria_list) == 0:
        raise ValueError("LLM returned invalid criteria structure")

    criteria_list = criteria_list[:max_criteria]

    # Normalize top-level weights to sum to 100
    total = sum(c.get("weight", 0) for c in criteria_list)
    if total > 0 and total != 100:
        for c in criteria_list:
            c["weight"] = round(c.get("weight", 0) * 100 / total)
        diff = 100 - sum(c["weight"] for c in criteria_list)
        criteria_list[0]["weight"] += diff

    # Normalize sub-criteria weights within each parent
    for c in criteria_list:
        subs = c.get("sub_criteria", [])
        if subs:
            sub_total = sum(s.get("weight", 0) for s in subs)
            if sub_total > 0 and sub_total != 100:
                for s in subs:
                    s["weight"] = round(
                        s.get("weight", 0) * 100 / sub_total
                    )
                diff = 100 - sum(s["weight"] for s in subs)
                subs[0]["weight"] += diff

    # Ensure all criteria have required fields
    for c in criteria_list:
        c.setdefault("name", "Unnamed Criterion")
        c.setdefault("description", "")
        c.setdefault("weight", 100 // len(criteria_list))
        c.setdefault("sub_criteria", [])
        for s in c["sub_criteria"]:
            s.setdefault("name", "Unnamed Sub-criterion")
            s.setdefault("description", "")
            s.setdefault("weight", 100 // max(len(c["sub_criteria"]), 1))

    return criteria_list
