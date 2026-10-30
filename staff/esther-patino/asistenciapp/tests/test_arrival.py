"""Tests de asistencia/domain/arrival.py · CA-01, CA-02."""

from datetime import datetime, timedelta

from asistencia.domain.arrival import LATE, ON_TIME, label

OPENED = "2026-10-27T10:00:00.000+00:00"


def at(delta):
    return (datetime.fromisoformat(OPENED) + delta).isoformat()


def test_before_opening_is_on_time():
    assert label(OPENED, at(timedelta(seconds=-1))) == ON_TIME


def test_exactly_five_minutes_is_on_time():
    assert label(OPENED, at(timedelta(minutes=5))) == ON_TIME


def test_one_second_after_five_minutes_is_late():
    assert label(OPENED, at(timedelta(minutes=5, seconds=1))) == LATE
