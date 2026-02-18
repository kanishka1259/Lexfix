"""
Pydantic validation schemas for the analytics engine ML service.
Centralises request/response models for all routes.
"""

from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field, field_validator


# ---------------------------------------------------------------------------
# Shared
# ---------------------------------------------------------------------------

class LanguageCode(str, Enum):
    EN = "en"
    ES = "es"
    FR = "fr"
    DE = "de"
    ZH = "zh"
    JA = "ja"
    AR = "ar"


# ---------------------------------------------------------------------------
# Pronunciation
# ---------------------------------------------------------------------------

class PronunciationRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64-encoded audio file (WAV/MP3)")
    reference_text: str = Field(..., min_length=1, max_length=500)
    language: LanguageCode = LanguageCode.EN

    @field_validator("audio_base64")
    @classmethod
    def audio_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("audio_base64 must not be empty")
        return v


class PronunciationScore(BaseModel):
    overall: float = Field(..., ge=0.0, le=1.0, description="Overall pronunciation score 0-1")
    fluency: float = Field(..., ge=0.0, le=1.0)
    accuracy: float = Field(..., ge=0.0, le=1.0)
    phoneme_errors: list[str] = Field(default_factory=list)
    feedback: str


# ---------------------------------------------------------------------------
# Text Analysis
# ---------------------------------------------------------------------------

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000)
    language: LanguageCode = LanguageCode.EN
    include_grammar: bool = True
    include_vocabulary: bool = True
    include_readability: bool = False


class TextAnalysisResponse(BaseModel):
    grammar_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    vocabulary_level: Optional[str] = None  # A1, A2, B1, B2, C1, C2
    readability_score: Optional[float] = None
    suggestions: list[str] = Field(default_factory=list)
    confidence: float = Field(..., ge=0.0, le=1.0)


# ---------------------------------------------------------------------------
# Recommendations
# ---------------------------------------------------------------------------

class RecommendationRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    completed_lesson_ids: list[str] = Field(default_factory=list)
    target_language: LanguageCode = LanguageCode.EN
    proficiency_level: str = Field("A1", pattern=r"^(A1|A2|B1|B2|C1|C2)$")
    max_recommendations: int = Field(5, ge=1, le=20)


# ---------------------------------------------------------------------------
# TTS
# ---------------------------------------------------------------------------

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    language: LanguageCode = LanguageCode.EN
    voice_speed: float = Field(1.0, ge=0.5, le=2.0)
    voice_pitch: float = Field(1.0, ge=0.5, le=2.0)
