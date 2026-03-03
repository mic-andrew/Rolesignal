"""Application configuration using Pydantic Settings.

All configuration is loaded from environment variables.
Never use os.getenv() in service code — import settings from here.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "postgresql+asyncpg://rolesignal:rolesignal_dev@localhost:5432/rolesignal"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # App
    app_env: str = "development"
    cors_origins: list[str] = ["http://localhost:5173"]
    log_level: str = "INFO"
    frontend_url: str = "http://localhost:5173"

    # Auth
    secret_key: str = "dev-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours
    google_client_id: str = ""
    google_client_secret: str = ""

    # Judge0 (code execution)
    judge0_api_url: str = "http://localhost:2358"
    judge0_api_timeout: int = 30
    judge0_max_wait_seconds: int = 15

    # LLM (model-agnostic)
    llm_provider: str = "openai"
    llm_model: str = "gpt-4o-mini"
    llm_temperature: float = 0.3
    llm_max_tokens: int = 4096
    llm_timeout: int = 60

    # OpenAI credentials
    openai_api_key: str = ""

    # OpenAI Realtime — Voice tutoring (separate key)
    openai_realtime_api_key: str = ""
    openai_realtime_model: str = "gpt-4o-mini-realtime-preview"
    openai_realtime_voice: str = "alloy"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
