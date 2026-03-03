"""FastAPI application entry point."""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.api import auth, problems, progress, seed, submissions, topics, tutoring
from app.config import settings as app_settings

logging.basicConfig(
    level=getattr(logging, app_settings.log_level),
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="RoleSignal API",
    description="RoleSignal — DSA Learning Platform API",
    version="0.2.0",
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

# Protected routes
app.include_router(problems.router, prefix="/api")
app.include_router(topics.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(tutoring.router, prefix="/api")
app.include_router(seed.router, prefix="/api")


class HealthResponse(BaseModel):
    status: str
    version: str


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Health check endpoint."""
    return HealthResponse(status="healthy", version="0.2.0")
