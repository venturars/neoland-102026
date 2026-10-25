"""Tests de la entrada de línea de comandos (attendance/entrypoints/cli.py) · spec 004 · T13; HU-01.

El atajo `--meet` crea la clase automática y hace la primera toma con los mismos casos de uso que
la web (C3). Google se sustituye por una función falsa (T4); la BD es una real temporal.
"""

from contextlib import closing
from datetime import UTC

import pytest

from attendance.domain.errors import MeetingEndedError, MeetingLinkInvalidError, MeetServiceError
from attendance.domain.participants import MeetingAttendance, Who
from attendance.domain.sessions import Mode
from attendance.entrypoints import cli
from attendance.infra import storage

T = 1_800_000_000.0
STARTED = "2026-10-23T06:56:12.123456789Z"  # Google puede dar hasta nanosegundos


class FakeMeeting:
    def __init__(self, names=("Ana García", "Luis Pérez"), ended=False, error=None):
        self.names, self.ended, self.error = tuple(names), ended, error
        self.calls = []

    def __call__(self, meeting_code, who):
        self.calls.append((meeting_code, who))
        if self.error is not None:
            raise self.error
        return MeetingAttendance(names=self.names, started_at=STARTED, ended=self.ended)


@pytest.fixture
def conn(tmp_path):
    with closing(storage.connect(tmp_path / "test.db")) as connection:
        storage.init_schema(connection)
        yield connection


def start(conn, meeting, link="https://meet.google.com/abc-defg-hij", who=Who.NOW):
    return cli.start_meet_session(conn, meeting, link, who, T, UTC)


def test_creates_the_automatic_session_and_takes_attendance(conn):
    meeting = FakeMeeting()
    session_id, message = start(conn, meeting)
    session = storage.get_session(conn, session_id)
    assert session is not None
    assert (session.mode, session.meeting_code) == (Mode.AUTOMATIC, "abc-defg-hij")
    assert meeting.calls == [("abc-defg-hij", Who.NOW)]
    assert len(storage.list_checkins(conn, session_id)) == 2
    assert message == "Reunión del 23/10 a las 06:56 · Añadidas 2 personas nuevas · 2 en la llamada ahora"


def test_everyone(conn):  # --meet-todos
    meeting = FakeMeeting(ended=True)
    _, message = start(conn, meeting, who=Who.EVERYONE)
    assert meeting.calls == [("abc-defg-hij", Who.EVERYONE)]
    assert message.endswith("· 2 estuvieron en la reunión")


def test_one_person_is_singular(conn):
    _, message = start(conn, FakeMeeting(names=["Ana"]))
    assert "Añadida 1 persona nueva · 1 en la llamada ahora" in message


def test_nobody_in_the_meeting(conn):  # CA-10
    _, message = start(conn, FakeMeeting(names=[]))
    assert message == "Reunión del 23/10 a las 06:56 · No hay participantes en la reunión"


def test_a_wrong_link_creates_nothing(conn):  # CA-14
    meeting = FakeMeeting()
    with pytest.raises(MeetingLinkInvalidError):
        start(conn, meeting, link="zoom.us/j/123")
    assert storage.list_sessions(conn) == []
    assert meeting.calls == []


@pytest.mark.parametrize("error", [MeetingEndedError(), MeetServiceError()])
def test_a_failed_sync_keeps_the_session_and_says_why(conn, error):
    session_id, message = start(conn, FakeMeeting(error=error))
    assert storage.get_session(conn, session_id) is not None  # se puede reintentar desde el panel
    assert storage.list_checkins(conn, session_id) == []
    assert error.MESSAGE in message
    assert "panel" in message
