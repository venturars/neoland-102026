"""Tests de attendance/usecases/attendance.py · spec 004 CA-05 a CA-07, CA-10, CA-18, CA-19, CA-20.

Con una base de datos real y temporal, la hora fijada por el test y una función de participantes falsa
en lugar de Google (ARCHITECTURE.md · T2, T4).
"""

from contextlib import closing
from datetime import UTC

import pytest

from attendance.domain.errors import (
    MeetServiceError,
    NotAutomaticSessionError,
    SessionClosedError,
    SessionNotFoundError,
)
from attendance.domain.participants import GUEST_NAME, MeetingAttendance, Who
from attendance.domain.sessions import Mode, to_iso
from attendance.infra import storage
from attendance.usecases import sessions
from attendance.usecases.attendance import sync_from_meeting

T = 1_800_000_000.0
STARTED = "2027-01-15T07:55:00Z"


class FakeMeet:
    """Sustituye a Google: devuelve los nombres que decide el test y apunta cada llamada."""

    def __init__(self, *takes, ended=False, error=None):
        self.takes = list(takes)
        self.ended = ended
        self.error = error
        self.calls = []

    def __call__(self, meeting_code, who):
        self.calls.append((meeting_code, who))
        if self.error:
            raise self.error
        names = self.takes[min(len(self.calls), len(self.takes)) - 1]
        return MeetingAttendance(names=tuple(names), started_at=STARTED, ended=self.ended)


@pytest.fixture
def db_path(tmp_path):
    path = tmp_path / "t.db"
    with closing(storage.connect(path)) as conn:
        storage.init_schema(conn)
    return path


@pytest.fixture
def conn(db_path):
    with closing(storage.connect(db_path)) as conn:
        yield conn


@pytest.fixture
def session(conn):
    return sessions.create_session(conn, "Clase", T, UTC, mode=Mode.AUTOMATIC, meeting="abc-defg-hij")


def names_in(conn, session):
    return [c.name for c in storage.list_checkins(conn, session.id)]


def test_first_take(conn, session):  # CA-05
    meet = FakeMeet(["Ana García", "Luis", "Eva"])
    result = sync_from_meeting(conn, meet, session.id, Who.NOW, T)
    assert (result.added, result.found, result.total) == (3, 3, 3)
    assert names_in(conn, session) == ["Ana García", "Luis", "Eva"]
    assert {c.checked_at for c in storage.list_checkins(conn, session.id)} == {to_iso(T)}  # la hora de la toma
    assert meet.calls == [("abc-defg-hij", Who.NOW)]  # el código guardado y la opción elegida (CA-18)


def test_which_meeting_is_reported(conn, session):  # CA-20
    result = sync_from_meeting(conn, FakeMeet(["Ana"], ended=True), session.id, Who.EVERYONE, T)
    assert (result.meeting_started_at, result.meeting_ended) == (STARTED, True)


def test_a_take_is_saved(db_path, conn, session):  # D3: el caso de uso confirma su transacción
    sync_from_meeting(conn, FakeMeet(["Ana"]), session.id, Who.NOW, T)
    with closing(storage.connect(db_path)) as other:
        assert [c.name for c in storage.list_checkins(other, session.id)] == ["Ana"]


def test_second_take_only_adds_newcomers(conn, session):  # CA-06
    meet = FakeMeet(["Ana García", "Luis"], ["  ANA garcia ", "Luís", "Eva"])
    sync_from_meeting(conn, meet, session.id, Who.NOW, T)
    result = sync_from_meeting(conn, meet, session.id, Who.NOW, T + 600)
    assert (result.added, result.found, result.total) == (1, 3, 3)
    assert names_in(conn, session) == ["Ana García", "Luis", "Eva"]  # se conserva el primer nombre


def test_leaving_does_not_remove_anyone(conn, session):  # CA-07
    meet = FakeMeet(["Ana", "Luis"], ["Ana"])
    sync_from_meeting(conn, meet, session.id, Who.NOW, T)
    result = sync_from_meeting(conn, meet, session.id, Who.NOW, T + 600)
    assert result.total == 2
    assert names_in(conn, session) == ["Ana", "Luis"]


def test_empty_meeting(conn, session):  # CA-10
    result = sync_from_meeting(conn, FakeMeet([]), session.id, Who.NOW, T)
    assert (result.added, result.found, result.total) == (0, 0, 0)


def test_everyone_counts_each_person_once(conn, session):  # CA-19
    result = sync_from_meeting(conn, FakeMeet(["Ana", "ana", "Luis"]), session.id, Who.EVERYONE, T)
    assert result.total == 2
    assert names_in(conn, session) == ["Ana", "Luis"]


def test_nameless_guests(conn, session):  # CA-08, con names_from_platform
    sync_from_meeting(conn, FakeMeet(["", "Ana", " "]), session.id, Who.NOW, T)
    assert names_in(conn, session) == [GUEST_NAME, "Ana", f"{GUEST_NAME} 2"]


def test_code_session_is_refused(conn):  # spec 004 · plan §2.7
    code_session = sessions.create_session(conn, "Clase", T, UTC)
    meet = FakeMeet(["Ana"])
    with pytest.raises(NotAutomaticSessionError):
        sync_from_meeting(conn, meet, code_session.id, Who.NOW, T)
    assert meet.calls == []  # ni siquiera se pregunta a Google


def test_closed_session_is_refused(conn, session):
    sessions.close_session(conn, session.id, T)
    meet = FakeMeet(["Ana"])
    with pytest.raises(SessionClosedError):
        sync_from_meeting(conn, meet, session.id, Who.EVERYONE, T)
    assert meet.calls == []


def test_unknown_session(conn):
    with pytest.raises(SessionNotFoundError):
        sync_from_meeting(conn, FakeMeet(["Ana"]), "no-existe", Who.NOW, T)


def test_when_google_fails_nothing_is_saved(conn, session):
    with pytest.raises(MeetServiceError):
        sync_from_meeting(conn, FakeMeet(error=MeetServiceError()), session.id, Who.NOW, T)
    assert names_in(conn, session) == []


def test_a_take_is_all_or_nothing(conn, session, monkeypatch):  # D3: una sola transacción
    real_add = storage.add_checkin
    calls = []

    def fail_on_second(*args):
        calls.append(1)
        if len(calls) == 2:
            raise RuntimeError("fallo simulado")  # T4: provocar a propósito un error imprevisto
        return real_add(*args)

    monkeypatch.setattr("attendance.infra.storage.add_checkin", fail_on_second)
    with pytest.raises(RuntimeError):
        sync_from_meeting(conn, FakeMeet(["Ana", "Luis", "Eva"]), session.id, Who.NOW, T)
    monkeypatch.undo()
    assert names_in(conn, session) == []  # no queda ni "Ana"
