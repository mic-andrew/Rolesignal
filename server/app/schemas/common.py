"""Shared response schemas used across the API."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    version: str


class MessageResponse(BaseModel):
    """Generic message response."""

    message: str
