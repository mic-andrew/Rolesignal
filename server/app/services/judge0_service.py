"""Judge0 service — code execution via self-hosted Judge0 API."""

import asyncio
import logging

import httpx
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.config import settings

logger = logging.getLogger(__name__)

# Judge0 language IDs
LANGUAGE_IDS: dict[str, int] = {
    "python": 71,       # Python 3
    "javascript": 63,   # Node.js
    "typescript": 74,   # TypeScript (Node.js)
    "java": 62,         # Java (OpenJDK)
    "cpp": 54,          # C++ (GCC)
    "go": 60,           # Go
}

# Judge0 status ID to our status mapping
STATUS_MAP: dict[int, str] = {
    1: "running",        # In Queue
    2: "running",        # Processing
    3: "accepted",       # Accepted
    4: "wrong_answer",   # Wrong Answer
    5: "time_limit",     # Time Limit Exceeded
    6: "compile_error",  # Compilation Error
    7: "runtime_error",  # Runtime Error (SIGSEGV)
    8: "runtime_error",  # Runtime Error (SIGXFSZ)
    9: "runtime_error",  # Runtime Error (SIGFPE)
    10: "runtime_error", # Runtime Error (SIGABRT)
    11: "runtime_error", # Runtime Error (NZEC)
    12: "runtime_error", # Runtime Error (Other)
    13: "runtime_error", # Internal Error
    14: "runtime_error", # Exec Format Error
}


def _get_language_id(language: str) -> int:
    """Get Judge0 language ID from language name."""
    lang_id = LANGUAGE_IDS.get(language)
    if not lang_id:
        raise ValueError(f"Unsupported language: {language}. Supported: {list(LANGUAGE_IDS.keys())}")
    return lang_id


@retry(
    retry=retry_if_exception_type((httpx.TimeoutException, httpx.ConnectError)),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
)
async def create_submission(
    source_code: str,
    language: str,
    stdin: str,
    expected_output: str | None = None,
) -> str:
    """Submit code to Judge0, return submission token."""
    async with httpx.AsyncClient(timeout=settings.judge0_api_timeout) as client:
        payload: dict = {
            "source_code": source_code,
            "language_id": _get_language_id(language),
            "stdin": stdin,
        }
        if expected_output is not None:
            payload["expected_output"] = expected_output

        response = await client.post(
            f"{settings.judge0_api_url}/submissions",
            json=payload,
            params={"base64_encoded": "false", "wait": "false"},
        )
        response.raise_for_status()
        return response.json()["token"]


async def batch_submit(
    source_code: str,
    language: str,
    test_cases: list[dict],
) -> list[str]:
    """Submit code against multiple test cases, return tokens."""
    async with httpx.AsyncClient(timeout=settings.judge0_api_timeout) as client:
        lang_id = _get_language_id(language)
        submissions = [
            {
                "source_code": source_code,
                "language_id": lang_id,
                "stdin": tc["input"],
                "expected_output": tc["expected_output"],
            }
            for tc in test_cases
        ]

        response = await client.post(
            f"{settings.judge0_api_url}/submissions/batch",
            json={"submissions": submissions},
            params={"base64_encoded": "false"},
        )
        response.raise_for_status()
        return [item["token"] for item in response.json()]


async def get_submission_result(token: str) -> dict:
    """Get result for a single submission token."""
    async with httpx.AsyncClient(timeout=settings.judge0_api_timeout) as client:
        response = await client.get(
            f"{settings.judge0_api_url}/submissions/{token}",
            params={
                "base64_encoded": "false",
                "fields": "status_id,stdout,stderr,time,memory,compile_output",
            },
        )
        response.raise_for_status()
        return _parse_result(response.json())


async def batch_get_results(tokens: list[str]) -> list[dict]:
    """Get results for multiple tokens. Polls until all complete."""
    max_wait = settings.judge0_max_wait_seconds
    delay = 0.5
    elapsed = 0.0

    while elapsed < max_wait:
        async with httpx.AsyncClient(timeout=settings.judge0_api_timeout) as client:
            response = await client.get(
                f"{settings.judge0_api_url}/submissions/batch",
                params={
                    "tokens": ",".join(tokens),
                    "base64_encoded": "false",
                    "fields": "token,status_id,stdout,stderr,time,memory,compile_output",
                },
            )
            response.raise_for_status()
            results = response.json()["submissions"]

        # Check if all are done (status_id >= 3)
        all_done = all(r["status_id"] >= 3 for r in results)
        if all_done:
            return [_parse_result(r) for r in results]

        await asyncio.sleep(delay)
        elapsed += delay
        delay = min(delay * 2, 4.0)

    # Timeout — return whatever we have
    logger.warning("judge0_batch_timeout tokens=%d elapsed=%.1f", len(tokens), elapsed)
    return [_parse_result(r) for r in results]


def _parse_result(raw: dict) -> dict:
    """Parse Judge0 response into our format."""
    status_id = raw.get("status_id", 13)
    return {
        "status": STATUS_MAP.get(status_id, "runtime_error"),
        "stdout": (raw.get("stdout") or "").strip(),
        "stderr": (raw.get("stderr") or raw.get("compile_output") or "").strip(),
        "runtime_ms": int(float(raw["time"]) * 1000) if raw.get("time") else None,
        "memory_kb": raw.get("memory"),
        "token": raw.get("token", ""),
    }
