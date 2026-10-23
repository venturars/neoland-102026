"""Tests de attendance/domain/sessions.py · spec 005 · plan §2.2; spec 001 CA-02, CA-13."""

import dataclasses
from datetime import UTC
from zoneinfo import ZoneInfo

import pytest

from attendance.domain.errors import TitleTooLongError
from attendance.domain.sessions import (
    MAX_TITLE_LENGTH,
    Checkin,
    Session,
    SessionSummary,
    clean_title,
    default_title,
    to_iso,
)

T = 1_800_000_000.0  # 2027-01-15 08:00:00 UTC


def make_session(closed_at=None):
    return Session(id="abc", title="Clase", secret=b"s" * 16, opened_at=to_iso(T), closed_at=closed_at)


def test_to_iso_is_utc_with_milliseconds():  # D6
    assert to_iso(T) == "2027-01-15T08:00:00.000+00:00"
    assert to_iso(T + 0.1234) == "2027-01-15T08:00:00.123+00:00"


@pytest.mark.parametrize(
    "tz, expected",
    [(UTC, "15/01/2027 08:00"), (ZoneInfo("Europe/Madrid"), "15/01/2027 09:00")],
)
def test_default_title_is_the_local_date(tz, expected):  # spec 001 CA-02
    assert default_title(T, tz) == expected


def test_session_is_open_until_it_has_a_closing_time():  # spec 001 CA-13
    assert make_session().is_open
    assert not make_session(closed_at=to_iso(T)).is_open


def test_types_are_immutable():
    with pytest.raises(dataclasses.FrozenInstanceError):
        make_session().title = "Otra"  # type: ignore[misc]
    with pytest.raises(dataclasses.FrozenInstanceError):
        Checkin(id=1, name="Ana", checked_at=to_iso(T)).name = "Eva"  # type: ignore[misc]


def test_session_summary_has_no_secret():  # D7
    assert "secret" not in {f.name for f in dataclasses.fields(SessionSummary)}


def test_title_limit():  # spec 005 CA-08
    assert MAX_TITLE_LENGTH == 20
    assert clean_title("  " + "a" * 20 + "  ") == "a" * 20  # los espacios de los extremos no cuentan
    assert clean_title("Клас 1 · 李雷") == "Клас 1 · 李雷"  # cuenta caracteres, no bytes
    assert clean_title("   ") == ""
    with pytest.raises(TitleTooLongError):
        clean_title("a" * 21)


def test_default_title_fits_the_limit():  # spec 005 CA-08
    assert len(default_title(T, UTC)) <= MAX_TITLE_LENGTH
