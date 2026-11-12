"""Tests de dominio attempts (spec 006)."""

from asistencia.domain.attempts import MAX_PER_MINUTE, MAX_PER_SECOND, over_limit


def test_should_not_block_at_allowed_limits():
    assert not over_limit(MAX_PER_SECOND, MAX_PER_MINUTE)


def test_should_block_on_sixth_in_one_second():
    assert over_limit(MAX_PER_SECOND + 1, 1)


def test_should_block_on_twenty_first_in_minute():
    assert over_limit(1, MAX_PER_MINUTE + 1)
