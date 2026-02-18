"""
Enhanced health check route with dependency status reporting.
"""

from __future__ import annotations

import os
import time
from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

_start_time = time.time()


class DependencyStatus(BaseModel):
    name: str
    status: Literal["ok", "degraded", "unavailable"]
    latency_ms: float | None = None
    detail: str | None = None


class HealthResponse(BaseModel):
    status: Literal["ok", "degraded", "unavailable"]
    version: str
    uptime_seconds: float
    dependencies: list[DependencyStatus]


def _check_model_availability() -> DependencyStatus:
    """Check if ML models are loaded / accessible."""
    try:
        from app.services.text_analysis_service import TextAnalysisService  # noqa: F401
        return DependencyStatus(name="ml_models", status="ok")
    except Exception as exc:
        return DependencyStatus(name="ml_models", status="degraded", detail=str(exc))


def _check_tts_service() -> DependencyStatus:
    """Lightweight check that the TTS service module is importable."""
    try:
        from app.services.tts_service import TTSService  # noqa: F401
        return DependencyStatus(name="tts_service", status="ok")
    except Exception as exc:
        return DependencyStatus(name="tts_service", status="unavailable", detail=str(exc))


@router.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """
    Extended health check.

    Returns overall service status and individual dependency statuses.
    Useful for load-balancer health probes and monitoring dashboards.
    """
    deps = [_check_model_availability(), _check_tts_service()]
    overall: Literal["ok", "degraded", "unavailable"] = "ok"
    for dep in deps:
        if dep.status == "unavailable":
            overall = "unavailable"
            break
        if dep.status == "degraded":
            overall = "degraded"

    return HealthResponse(
        status=overall,
        version=os.getenv("APP_VERSION", "0.1.0"),
        uptime_seconds=round(time.time() - _start_time, 2),
        dependencies=deps,
    )
