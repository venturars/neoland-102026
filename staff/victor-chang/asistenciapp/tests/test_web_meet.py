"""Tests de la entrada web del modo automático (spec 004 · T12; plan §4).

spec 004 CA-01, CA-02, CA-04, CA-13, CA-14, CA-16, CA-18, CA-20. Google se sustituye por una
función falsa que da los participantes (T4): la app no sabe de dónde salen.
"""

import pytest
from conftest import TOKEN
from web_helpers import check_in, open_session

from attendance.config import Config
from attendance.domain.errors import (
    MeetingEndedError,
    MeetingLinkInvalidError,
    MeetingNotVisibleError,
    MeetLoginNotCompletedError,
    MeetNotConfiguredError,
    MeetPermissionMissingError,
    MeetServiceError,
    NotAutomaticSessionError,
    NotCodeSessionError,
    SessionClosedError,
    SessionNotFoundError,
)
from attendance.domain.participants import MeetingAttendance, Who
from attendance.entrypoints.web import create_app
from attendance.entrypoints.web.errors import MalformedRequestError, TeacherUnauthorizedError

LINK = "https://meet.google.com/abc-defg-hij?authuser=1"
STARTED = "2026-10-23T06:56:00Z"


class FakeMeeting:
    """Lo que daría Google: unos nombres, o un error. Apunta con qué se le llamó."""

    def __init__(self, names=("Ana García", "Luis Pérez"), ended=False, error=None):
        self.names = tuple(names)
        self.ended = ended
        self.error = error
        self.calls = []

    def __call__(self, meeting_code, who):
        self.calls.append((meeting_code, who))
        if self.error is not None:
            raise self.error
        return MeetingAttendance(names=self.names, started_at=STARTED, ended=self.ended)


@pytest.fixture
def meeting():
    return FakeMeeting()


@pytest.fixture
def app(tmp_path, clock, meeting):
    config = Config(db_path=tmp_path / "test.db", port=8000, timezone=None)
    return create_app(config, clock=clock, teacher_token=TOKEN, fetch_participants=meeting)


def open_automatic(client, teacher, meeting_link=LINK):
    res = client.post(
        "/api/sessions", json={"title": "Meet", "mode": "automatic", "meeting": meeting_link}, headers=teacher
    )
    assert res.status_code == 201
    return res.get_json()["id"]


def sync(client, teacher, sid, who="now"):
    return client.post(f"/api/sessions/{sid}/meet-sync", json={"who": who}, headers=teacher)


# ---------- Abrir una clase (CA-01, CA-04, CA-14) ----------


def test_open_an_automatic_session(client, teacher):  # CA-01
    res = client.post("/api/sessions", json={"title": "Meet", "mode": "automatic", "meeting": LINK}, headers=teacher)
    assert res.status_code == 201
    data = res.get_json()
    assert data == {"id": data["id"], "title": "Meet", "mode": "automatic"}


def test_mode_defaults_to_code(client, teacher):  # CA-04
    res = client.post("/api/sessions", json={"title": "Clase"}, headers=teacher)
    assert res.get_json()["mode"] == "code"


@pytest.mark.parametrize("mode", ["meet", "", "AUTOMATIC", 1, None])
def test_unknown_mode_is_a_malformed_request(client, teacher, mode):
    res = client.post("/api/sessions", json={"mode": mode, "meeting": LINK}, headers=teacher)
    assert res.status_code == 400
    assert res.get_json() == {"error": MalformedRequestError.MESSAGE}


@pytest.mark.parametrize("body", [{"mode": "automatic"}, {"mode": "automatic", "meeting": "zoom.us/j/123"}])
def test_missing_or_wrong_meeting_link(client, teacher, body):  # CA-14
    res = client.post("/api/sessions", json=body, headers=teacher)
    assert res.status_code == 422
    assert res.get_json() == {"error": MeetingLinkInvalidError.MESSAGE}
    assert client.get("/api/sessions", headers=teacher).get_json() == []


def test_meeting_must_be_text(client, teacher):
    res = client.post("/api/sessions", json={"mode": "automatic", "meeting": 123}, headers=teacher)
    assert res.status_code == 400


# ---------- Leer una clase (CA-01, CA-02, CA-04) ----------


def test_list_and_public_view_include_the_mode(client, teacher):
    code_sid = open_session(client, teacher)
    meet_sid = open_automatic(client, teacher)
    modes = {s["id"]: s["mode"] for s in client.get("/api/sessions", headers=teacher).get_json()}
    assert modes == {code_sid: "code", meet_sid: "automatic"}
    assert client.get(f"/api/s/{meet_sid}").get_json() == {"title": "Meet", "open": True, "mode": "automatic"}


def test_teacher_view_of_an_automatic_session_has_no_code(client, teacher):  # CA-02
    sid = open_automatic(client, teacher)
    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert data["mode"] == "automatic"
    assert data["meetingCode"] == "abc-defg-hij"
    assert "code" not in data and "secondsLeft" not in data and "studentUrl" not in data


def test_teacher_view_of_a_code_session_is_as_before(client, teacher):  # CA-04
    sid = open_session(client, teacher)
    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert data["mode"] == "code"
    assert data["meetingCode"] is None
    assert {"code", "secondsLeft", "studentUrl"} <= data.keys()


def test_check_in_by_code_in_an_automatic_session(client, teacher):  # CA-02
    sid = open_automatic(client, teacher)
    res = check_in(client, sid, "Ana", "1234")
    assert res.status_code == 409
    assert res.get_json() == {"error": NotCodeSessionError.MESSAGE}


# ---------- Tomar la asistencia (CA-05 a CA-07, CA-18, CA-20) ----------


@pytest.mark.parametrize("who", ["now", "everyone"])
def test_sync_in_both_modes(client, teacher, meeting, who):  # CA-18, CA-20
    sid = open_automatic(client, teacher)
    res = sync(client, teacher, sid, who)
    assert res.status_code == 200
    assert res.get_json() == {
        "added": 2,
        "found": 2,
        "total": 2,
        "meetingStartedAt": STARTED,
        "meetingEnded": False,
    }
    assert meeting.calls == [("abc-defg-hij", Who(who))]
    names = [c["name"] for c in client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["checkins"]]
    assert sorted(names) == ["Ana García", "Luis Pérez"]


def test_sync_again_only_adds_the_new_ones(client, teacher, meeting):  # CA-06, CA-07
    sid = open_automatic(client, teacher)
    sync(client, teacher, sid)
    meeting.names = ("Ana García", "Eva Ruiz")
    data = sync(client, teacher, sid, "everyone").get_json()
    assert (data["added"], data["found"], data["total"]) == (1, 2, 3)


def test_sync_reports_an_ended_meeting(client, teacher, meeting):  # CA-20
    meeting.ended = True
    sid = open_automatic(client, teacher)
    assert sync(client, teacher, sid, "everyone").get_json()["meetingEnded"] is True


@pytest.mark.parametrize("body", [{}, {"who": "todos"}, {"who": ""}, {"who": 1}, {"who": None}])
def test_missing_or_unknown_who_is_a_malformed_request(client, teacher, meeting, body):
    sid = open_automatic(client, teacher)
    res = client.post(f"/api/sessions/{sid}/meet-sync", json=body, headers=teacher)
    assert res.status_code == 400
    assert res.get_json() == {"error": MalformedRequestError.MESSAGE}
    assert meeting.calls == []


def test_sync_in_a_code_session(client, teacher, meeting):
    sid = open_session(client, teacher)
    res = sync(client, teacher, sid)
    assert res.status_code == 409
    assert res.get_json() == {"error": NotAutomaticSessionError.MESSAGE}
    assert meeting.calls == []


def test_sync_in_a_closed_session(client, teacher, meeting):
    sid = open_automatic(client, teacher)
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    res = sync(client, teacher, sid)
    assert res.status_code == 409
    assert res.get_json() == {"error": SessionClosedError.MESSAGE}


def test_sync_in_a_session_that_does_not_exist(client, teacher):
    res = sync(client, teacher, "no-existe")
    assert res.status_code == 404
    assert res.get_json() == {"error": SessionNotFoundError.MESSAGE}


def test_sync_needs_the_teacher_token(client, teacher, meeting):  # spec 001 CA-15
    sid = open_automatic(client, teacher)
    res = client.post(f"/api/sessions/{sid}/meet-sync", json={"who": "now"})
    assert res.status_code == 401
    assert res.get_json() == {"error": TeacherUnauthorizedError.MESSAGE}
    assert meeting.calls == []


@pytest.mark.parametrize(
    "error, status",
    [
        (MeetingNotVisibleError(), 422),  # CA-13, CA-14
        (MeetingEndedError(), 422),  # CA-21
        (MeetPermissionMissingError(), 422),
        (MeetLoginNotCompletedError(), 422),
        (MeetNotConfiguredError(), 422),
        (MeetServiceError(), 502),
    ],
)
def test_meeting_errors_reach_the_teacher_and_save_nothing(client, teacher, meeting, error, status):
    sid = open_automatic(client, teacher)
    meeting.error = error
    res = sync(client, teacher, sid)
    assert res.status_code == status
    assert res.get_json() == {"error": error.MESSAGE}
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 0


def test_without_a_meeting_client_sync_says_it_is_not_configured(tmp_path, clock, teacher):
    config = Config(db_path=tmp_path / "test.db", port=8000, timezone=None)
    client = create_app(config, clock=clock, teacher_token=TOKEN).test_client()
    sid = open_automatic(client, teacher)
    res = sync(client, teacher, sid)
    assert res.status_code == 422
    assert res.get_json() == {"error": MeetNotConfiguredError.MESSAGE}


# ---------- Quitar y exportar en una clase automática (CA-16) ----------


def test_remove_and_export_in_an_automatic_session(client, teacher):  # CA-16
    sid = open_automatic(client, teacher)
    sync(client, teacher, sid)
    checkins = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["checkins"]
    luis = next(c for c in checkins if c["name"] == "Luis Pérez")
    assert client.delete(f"/api/sessions/{sid}/checkins/{luis['id']}", headers=teacher).status_code == 200
    res = client.get(f"/api/sessions/{sid}/export", headers=teacher)
    assert res.status_code == 200
    csv = res.get_data(as_text=True)
    assert "Ana García" in csv
    assert "Luis Pérez" not in csv
