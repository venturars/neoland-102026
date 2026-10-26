"""Tests de asistencia/domain/access.py · CA-01, CA-02, CA-03, CA-04."""

from asistencia.domain.access import is_attack

NOW = 1_000.0


def test_five_calls_in_one_second_are_allowed():  # CA-01
    assert is_attack([NOW] * 5, NOW) is False


def test_sixth_call_in_one_second_is_an_attack():  # CA-03
    assert is_attack([NOW] * 6, NOW) is True


def test_twenty_calls_in_one_minute_are_allowed():  # CA-01
    times = [NOW - i for i in range(20)]
    assert is_attack(times, NOW) is False


def test_twenty_first_call_in_one_minute_is_an_attack():  # CA-04
    times = [NOW - i for i in range(21)]
    assert is_attack(times, NOW) is True


def test_a_call_older_than_a_minute_does_not_count():  # CA-02
    assert is_attack([NOW - 61] * 6, NOW) is False
