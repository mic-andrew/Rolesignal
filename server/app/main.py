"""FastAPI application entry point."""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import (
    auth,
    audit,
    candidates,
    criteria_library,
    dashboard,
    evaluations,
    interview_public,
    interviews,
    onboarding,
    roles,
    settings,
)
from app.config import settings as app_settings
from app.schemas.common import HealthResponse

logging.basicConfig(
    level=getattr(logging, app_settings.log_level),
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="RoleSignal API",
    description="RoleSignal API",
    version="0.1.0",
    redirect_slashes=False,
)


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request, exc: Exception,
) -> JSONResponse:
    """Catch unhandled exceptions, return structured JSON."""
    logger.exception(
        "unhandled_error path=%s", request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal error occurred. Please try again.",
        },
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Public routes
app.include_router(auth.router, prefix="/api")
app.include_router(interview_public.router, prefix="/api")

# Protected routes
app.include_router(onboarding.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(roles.router, prefix="/api")
app.include_router(candidates.router, prefix="/api")
app.include_router(interviews.router, prefix="/api")
app.include_router(evaluations.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(criteria_library.router, prefix="/api")
app.include_router(audit.router, prefix="/api")


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="healthy", version="0.1.0")
