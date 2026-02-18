"""
Standardised error response models for the ML service.
All error responses follow the same envelope so clients can handle them uniformly.
"""

from __future__ import annotations

from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel


class ErrorCode(str, Enum):
    VALIDATION_ERROR = "validation_error"
    MODEL_UNAVAILABLE = "model_unavailable"
    AUDIO_DECODE_ERROR = "audio_decode_error"
    LANGUAGE_NOT_SUPPORTED = "language_not_supported"
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
    INTERNAL_ERROR = "internal_error"
    SERVICE_UNAVAILABLE = "service_unavailable"


class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str
    code: Optional[str] = None


class ErrorResponse(BaseModel):
    """Standard error envelope returned by all ML service endpoints."""

    error: ErrorCode
    message: str
    details: list[ErrorDetail] = []
    request_id: Optional[str] = None

    model_config = {"json_schema_extra": {
        "example": {
            "error": "validation_error",
            "message": "Request validation failed",
            "details": [
                {"field": "reference_text", "message": "field required", "code": "missing"}
            ],
            "request_id": "req_abc123",
        }
    }}


class SuccessResponse(BaseModel):
    """Thin wrapper for successful responses that need metadata."""

    data: Any
    request_id: Optional[str] = None
    model_version: Optional[str] = None
