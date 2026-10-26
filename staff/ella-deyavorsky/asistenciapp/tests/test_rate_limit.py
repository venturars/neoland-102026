"""Tests de la regla de límite por IP · spec 006 · CA-01 a CA-05."""

import pytest

from asistencia.domain.rate_limit import (
    BAN_MESSAGE,
    MAX_PER_MINUTE,
    MAX_PER_SECOND,
    IpBanned,
    ensure_not_blocked,
    is_over_limit,
)


def test_limits_are_the_ones_in_the_spec():
    assert (MAX_PER_SECOND, MAX_PER_MINUTE) == (5, 20)


def test_five_in_a_second_is_allowed():  # CA-01
    assert is_over_limit(5, 5) is False


def test_sixth_in_a_second_is_over_the_limit():  # CA-02
    assert is_over_limit(6, 6) is True


def test_twenty_in_a_minute_is_allowed():  # CA-03
    assert is_over_limit(1, 20) is False


def test_twenty_first_in_a_minute_is_over_the_limit():  # CA-04
    assert is_over_limit(1, 21) is True


def test_not_blocked_passes():
    assert ensure_not_blocked(False) is None


def test_blocked_raises_with_a_spanish_message():  # CA-05
    with pytest.raises(IpBanned) as error:
        ensure_not_blocked(True)
    assert str(error.value) == BAN_MESSAGE
    assert "bloqueada" in BAN_MESSAGE and "profesor" in BAN_MESSAGE
