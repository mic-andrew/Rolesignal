"""LLM client factory — model-agnostic via LangChain.

Switch providers by changing LLM_PROVIDER in config.
All services import get_llm() from here and get a BaseChatModel.
"""

import logging
from functools import lru_cache

from langchain_core.language_models import BaseChatModel

from app.config import settings

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def get_llm() -> BaseChatModel:
    """Return a shared LLM client based on the configured provider.

    Currently supports: "openai"
    Extensible to: "bedrock", "anthropic", etc.
    """
    provider = settings.llm_provider.lower()

    if provider == "openai":
        return _create_openai_llm()

    raise RuntimeError(f"Unsupported LLM provider: {provider}")


def _create_openai_llm() -> BaseChatModel:
    """Create an OpenAI ChatModel via LangChain."""
    if not settings.openai_api_key:
        raise RuntimeError(
            "OpenAI API key not configured. "
            "Set OPENAI_API_KEY in your .env file."
        )

    from langchain_openai import ChatOpenAI

    logger.info(
        "initializing_llm provider=openai model=%s",
        settings.llm_model,
    )
    return ChatOpenAI(
        model=settings.llm_model,
        api_key=settings.openai_api_key,
        temperature=settings.llm_temperature,
        max_tokens=settings.llm_max_tokens,
        timeout=settings.llm_timeout,
        max_retries=0,  # tenacity handles retries in consuming services
    )
