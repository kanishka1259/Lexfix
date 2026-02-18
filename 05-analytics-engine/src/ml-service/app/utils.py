"""
Utility functions shared across ML service routes and services.
"""

from __future__ import annotations

import uuid
from typing import Any


def generate_request_id() -> str:
    """Generate a short unique request identifier for tracing."""
    return f"req_{uuid.uuid4().hex[:10]}"


def build_success_response(data: Any, model_version: str = "0.1.0") -> dict:
    """Wrap a result in the standard success envelope."""
    return {
        "data": data,
        "request_id": generate_request_id(),
        "model_version": model_version,
    }


def build_error_response(error_code: str, message: str, details: list | None = None) -> dict:
    """Wrap an error in the standard error envelope."""
    return {
        "error": error_code,
        "message": message,
        "details": details or [],
        "request_id": generate_request_id(),
    }


def clamp(value: float, min_val: float = 0.0, max_val: float = 1.0) -> float:
    """Clamp a float value between min_val and max_val."""
    return max(min_val, min(max_val, value))


def proficiency_to_numeric(level: str) -> int:
    """Convert CEFR proficiency level string to a numeric rank (1-6)."""
    mapping = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5, "C2": 6}
    return mapping.get(level.upper(), 1)
