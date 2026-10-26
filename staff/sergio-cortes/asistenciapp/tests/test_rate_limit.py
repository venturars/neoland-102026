"""Tests de dominio rate_limit (spec 006)."""

from asistencia.domain.rate_limit import (
    MAX_INVALID_PER_MINUTE,
    MAX_INVALID_PER_SECOND,
    should_block_after_attempt,
)


def test_should_not_block_at_allowed_limits():
    assert not should_block_after_attempt(MAX_INVALID_PER_SECOND, MAX_INVALID_PER_MINUTE)


def test_should_block_on_sixth_in_one_second():
    assert should_block_after_attempt(MAX_INVALID_PER_SECOND + 1, 1)


def test_should_block_on_twenty_first_in_minute():
    assert should_block_after_attempt(1, MAX_INVALID_PER_MINUTE + 1)
