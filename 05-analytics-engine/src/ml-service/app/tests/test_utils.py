"""
Unit tests for the ML service utility functions.
"""

from __future__ import annotations

import pytest
from app.utils import clamp, proficiency_to_numeric, generate_request_id


def test_generate_request_id():
    """Verify request IDs are valid and unique."""
    id1 = generate_request_id()
    id2 = generate_request_id()
    assert id1.startswith("req_")
    assert len(id1) == 14  # req_ + 10 chars
    assert id1 != id2


def test_clamp():
    """Verify numeric clamping logic."""
    assert clamp(0.5) == 0.5
    assert clamp(-1.0) == 0.0
    assert clamp(2.0) == 1.0
    assert clamp(10.0, min_val=0, max_val=5) == 5.0
    assert clamp(-5.0, min_val=-2, max_val=2) == -2.0


@pytest.mark.parametrize("level, expected", [
    ("A1", 1),
    ("B2", 4),
    ("C2", 6),
    ("X1", 1),  # Default case
    ("a1", 1),  # Case insensitive
])
def test_proficiency_to_numeric(level, expected):
    """Verify CEFR level to numeric mapping."""
    assert proficiency_to_numeric(level) == expected
