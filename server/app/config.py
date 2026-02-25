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

    # Email (Resend)
    resend_api_key: str = ""
    resend_from_email: str = "RoleSignal <noreply@rolesignal.com>"
    resend_template_id: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
