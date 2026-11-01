"""Tests de asistencia/domain/attempts.py · spec 006 CA-01, CA-02."""

from asistencia.domain.attempts import MAX_PER_MINUTE, MAX_PER_SECOND, exceeds_limit

T = 1_800_000_000.0


def test_up_to_five_in_the_same_second_are_allowed():
    previous = [T] * (MAX_PER_SECOND - 1)
    assert not exceeds_limit(previous, T)


def test_sixth_in_the_same_second_exceeds():
    previous = [T] * MAX_PER_SECOND
    assert exceeds_limit(previous, T)


def test_attempts_older_than_a_second_do_not_count_for_the_second_limit():
    previous = [T - 1.5] * MAX_PER_SECOND
    assert not exceeds_limit(previous, T)


def test_up_to_twenty_in_a_minute_are_allowed():
    previous = [T - 3 * i for i in range(1, MAX_PER_MINUTE)]  # 19 anteriores, uno cada 3 s
    assert not exceeds_limit(previous, T)


def test_twenty_first_in_a_minute_exceeds():
    previous = [T - 2.5 * i for i in range(1, MAX_PER_MINUTE + 1)]  # 20 anteriores en 50 s
    assert exceeds_limit(previous, T)


def test_attempts_older_than_a_minute_do_not_count():
    previous = [T - 61 - i for i in range(100)]
    assert not exceeds_limit(previous, T)
