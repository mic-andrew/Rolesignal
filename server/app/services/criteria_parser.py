"""Heuristic criteria extraction from text."""

import logging
import re

logger = logging.getLogger(__name__)

_BULLET_RE = re.compile(r"^[\d]+[.)]\s*|^[-*•→▪]\s*")
_MAX_CRITERIA = 8


def extract_criteria(text: str) -> list[dict]:
    """Parse text into structured evaluation criteria.

    Handles numbered lists, bullet points, and colon/dash-separated
    name-description pairs. Distributes weights equally.
    """
    lines = text.strip().splitlines()
    raw: list[tuple[str, str]] = []

    for line in lines:
        line = line.strip()
        if not line or len(line) < 5:
            continue

        # Strip leading bullets / numbers
        line = _BULLET_RE.sub("", line).strip()
        if not line or len(line) < 5:
            continue

        name, desc = _split_name_desc(line)
        if name and len(name) >= 3:
            raw.append((name, desc))

    criteria = raw[:_MAX_CRITERIA]

    if not criteria:
        return []

    base = 100 // len(criteria)
    remainder = 100 % len(criteria)

    return [
        {
            "name": name,
            "description": desc,
            "weight": base + (1 if i < remainder else 0),
            "question_count": 3,
            "color": "#7C6FFF",
        }
        for i, (name, desc) in enumerate(criteria)
    ]


def _split_name_desc(line: str) -> tuple[str, str]:
    """Split a line into (name, description)."""
    # "Name: description"
    if ":" in line:
        parts = line.split(":", 1)
        if len(parts[0]) < 80:
            return parts[0].strip(), parts[1].strip()

    # "Name - description"
    if " - " in line:
        parts = line.split(" - ", 1)
        if len(parts[0]) < 80:
            return parts[0].strip(), parts[1].strip()

    # "Name. Description sentence"
    if ". " in line:
        parts = line.split(". ", 1)
        if len(parts[0]) < 60:
            return parts[0].strip(), parts[1].strip()

    # Whole line is the name
    return line[:80].strip(), ""
