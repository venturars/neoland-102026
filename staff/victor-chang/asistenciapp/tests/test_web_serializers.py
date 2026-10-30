"""Tests de attendance/entrypoints/web/serializers.py · spec 005 · plan §2.2; ARCHITECTURE D7, F2."""

import json

import pytest

from attendance.domain.participants import SyncResult
from attendance.domain.sessions import Checkin, CheckinResult, Mode, Session, SessionSummary, TeacherView
from attendance.entrypoints.web import serializers

AT = "2027-01-15T08:00:00.000+00:00"
SECRET = bytes.fromhex("c0ffee" * 5 + "ab")
OPEN = Session("s1", "Clase", SECRET, AT, None)
CLOSED = Session("s1", "Clase", SECRET, AT, AT)
AUTOMATIC = Session("s2", "Meet", SECRET, AT, None, Mode.AUTOMATIC, "abc-defg-hij")
ANA = Checkin(7, "Ana", AT)
OPEN_VIEW = TeacherView(OPEN, (ANA,), "1234", 12)
URL = "https://abc.trycloudflare.com/alumno.html?s=s1"


def test_checkin_for_the_teacher_has_its_id():
    assert serializers.checkin_json(ANA) == {"id": 7, "name": "Ana", "checkedAt": AT}


def test_check_in_result_for_the_student_has_no_id():  # spec 001 CA-04, CA-07
    assert serializers.check_in_result_json(CheckinResult(ANA, created=True)) == {"name": "Ana", "checkedAt": AT}
    assert serializers.check_in_result_json(CheckinResult(ANA, created=False)) == {
        "already": True,
        "name": "Ana",
        "checkedAt": AT,
    }


def test_public_session_has_no_list():
    assert serializers.public_session_json(OPEN) == {"title": "Clase", "open": True, "mode": "code"}
    assert serializers.public_session_json(CLOSED) == {"title": "Clase", "open": False, "mode": "code"}
    assert serializers.public_session_json(AUTOMATIC)["mode"] == "automatic"  # spec 004 · CA-02


def test_created_session():  # spec 001 CA-01
    assert serializers.created_session_json(OPEN) == {"id": "s1", "title": "Clase", "mode": "code"}


def test_session_summary():  # spec 001 CA-16
    summary = SessionSummary("s1", "Clase", AT, None, 3)
    assert serializers.session_summary_json(summary) == {
        "id": "s1",
        "title": "Clase",
        "openedAt": AT,
        "closedAt": None,
        "total": 3,
        "mode": "code",
    }


def test_teacher_view_of_an_open_session():  # spec 001 CA-10, CA-11
    assert serializers.teacher_view_json(OPEN_VIEW, URL) == {
        "id": "s1",
        "title": "Clase",
        "openedAt": AT,
        "closedAt": None,
        "open": True,
        "mode": "code",
        "meetingCode": None,
        "studentUrl": URL,
        "total": 1,
        "checkins": [{"id": 7, "name": "Ana", "checkedAt": AT}],
        "code": "1234",
        "secondsLeft": 12,
    }


def test_teacher_view_of_a_closed_session_has_no_code():  # spec 001 CA-13
    data = serializers.teacher_view_json(TeacherView(CLOSED, (), None, None), URL)
    assert data["open"] is False
    assert "code" not in data and "secondsLeft" not in data


def test_teacher_view_of_an_automatic_session_has_no_code_nor_student_link():  # spec 004 · CA-02
    data = serializers.teacher_view_json(TeacherView(AUTOMATIC, (ANA,), None, None), URL)
    assert data["mode"] == "automatic"
    assert data["meetingCode"] == "abc-defg-hij"
    assert "code" not in data and "secondsLeft" not in data and "studentUrl" not in data


def test_sync_result():  # spec 004 · CA-05 a CA-07, CA-20
    result = SyncResult(added=1, found=3, total=5, meeting_started_at=AT, meeting_ended=True)
    assert serializers.sync_result_json(result) == {
        "added": 1,
        "found": 3,
        "total": 5,
        "meetingStartedAt": AT,
        "meetingEnded": True,
    }


@pytest.mark.parametrize(
    "data",
    [
        serializers.public_session_json(OPEN),
        serializers.created_session_json(OPEN),
        serializers.teacher_view_json(OPEN_VIEW, URL),
    ],
)
def test_the_secret_never_leaves(data):  # D7
    text = json.dumps(data)
    assert "secret" not in text
    assert SECRET.hex() not in text
