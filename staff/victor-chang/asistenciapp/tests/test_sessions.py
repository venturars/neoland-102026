"""Tests de attendance/usecases/sessions.py · spec 001 CA-01, CA-02, CA-13, CA-14; spec 005 · plan §2.3.

Con una base de datos real y temporal, y la hora fijada por el test (ARCHITECTURE.md · T2).
"""

from contextlib import closing
from datetime import UTC

import pytest

from attendance.domain.codes import WINDOW_SECONDS, code_for
from attendance.domain.errors import MeetingLinkInvalidError, SessionNotFoundError, TitleTooLongError
from attendance.domain.sessions import Mode, default_title, to_iso
from attendance.infra import storage
from attendance.usecases import sessions

T = 1_800_000_000.0  # 2027-01-15 08:00:00 UTC, inicio de una ventana de 30 s


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


def test_create_session_is_saved(db_path):  # spec 001 CA-01
    with closing(storage.connect(db_path)) as conn:
        session = sessions.create_session(conn, "  Clase de SDD  ", T, UTC)
    with closing(storage.connect(db_path)) as conn:
        saved = sessions.find_session(conn, session.id)
    assert saved == session
    assert (saved.title, saved.opened_at, saved.is_open) == ("Clase de SDD", to_iso(T), True)


@pytest.mark.parametrize("title", ["", "   "])
def test_create_session_without_title_uses_the_date(conn, title):  # spec 001 CA-02
    assert sessions.create_session(conn, title, T, UTC).title == default_title(T, UTC)


def test_title_over_the_limit_opens_nothing(conn):  # spec 005 CA-08
    with pytest.raises(TitleTooLongError):
        sessions.create_session(conn, "a" * 21, T, UTC)
    assert storage.list_sessions(conn) == []


def test_each_session_has_its_own_id_and_secret(conn):  # X1
    one, other = (sessions.create_session(conn, "Clase", T, UTC) for _ in range(2))
    assert one.id != other.id
    assert one.secret != other.secret and len(one.secret) == 16


def test_find_unknown_session(conn):
    with pytest.raises(SessionNotFoundError):
        sessions.find_session(conn, "no-existe")


def test_close_session_keeps_the_first_closing_time(db_path):  # spec 001 CA-13
    with closing(storage.connect(db_path)) as conn:
        session = sessions.create_session(conn, "Clase", T, UTC)
        sessions.close_session(conn, session.id, T + 60)
        sessions.close_session(conn, session.id, T + 120)
    with closing(storage.connect(db_path)) as conn:
        assert sessions.find_session(conn, session.id).closed_at == to_iso(T + 60)


def test_close_unknown_session(conn):
    with pytest.raises(SessionNotFoundError):
        sessions.close_session(conn, "no-existe", T)


def test_teacher_view_of_an_open_session(conn):  # spec 001 CA-10, CA-11
    session = sessions.create_session(conn, "Clase", T, UTC)
    with conn:
        storage.add_checkin(conn, session.id, "Ana", "ana", to_iso(T))
    view = sessions.teacher_view(conn, session.id, T + 10)
    assert view.session == session
    assert [c.name for c in view.checkins] == ["Ana"]
    assert view.code == code_for(session.secret, T + 10)
    assert view.seconds_left == WINDOW_SECONDS - 10


def test_teacher_view_of_a_closed_session_has_no_code(conn):  # spec 001 CA-13
    session = sessions.create_session(conn, "Clase", T, UTC)
    sessions.close_session(conn, session.id, T)
    view = sessions.teacher_view(conn, session.id, T + 10)
    assert (view.code, view.seconds_left) == (None, None)


def test_teacher_view_of_unknown_session(conn):
    with pytest.raises(SessionNotFoundError):
        sessions.teacher_view(conn, "no-existe", T)


def test_export_attendance(conn):  # spec 001 CA-14
    session = sessions.create_session(conn, "Clase", T, UTC)
    with conn:
        storage.add_checkin(conn, session.id, "Ana", "ana", to_iso(T))
    export = sessions.export_attendance(conn, session.id, UTC)
    assert export.filename == f"asistencia-2027-01-15-{session.id}.csv"
    assert export.content.lstrip("﻿").splitlines() == ["Nombre;Hora", "Ana;15/01/2027 08:00:00"]


def test_export_unknown_session(conn):
    with pytest.raises(SessionNotFoundError):
        sessions.export_attendance(conn, "no-existe", UTC)


# ---------- Modo automático (spec 004 · plan §2.9) ----------


def test_automatic_session_keeps_the_meeting_code(db_path):  # spec 004 CA-01
    with closing(storage.connect(db_path)) as conn:
        session = sessions.create_session(
            conn, "Clase", T, UTC, mode=Mode.AUTOMATIC, meeting="https://meet.google.com/ABC-defg-hij?authuser=1"
        )
    with closing(storage.connect(db_path)) as conn:
        saved = sessions.find_session(conn, session.id)
    assert (saved.mode, saved.meeting_code) == (Mode.AUTOMATIC, "abc-defg-hij")


@pytest.mark.parametrize("meeting", ["", "   ", "https://zoom.us/j/123", "abc-defg"])
def test_automatic_session_needs_a_valid_link(conn, meeting):  # spec 004 CA-01, CA-14
    with pytest.raises(MeetingLinkInvalidError):
        sessions.create_session(conn, "Clase", T, UTC, mode=Mode.AUTOMATIC, meeting=meeting)
    assert storage.list_sessions(conn) == []


def test_code_session_ignores_the_meeting(conn):  # spec 004 CA-03
    session = sessions.create_session(conn, "Clase", T, UTC, mode=Mode.CODE, meeting="lo que sea")
    assert (session.mode, session.meeting_code) == (Mode.CODE, None)


def test_teacher_view_of_an_automatic_session_has_no_code(conn):  # spec 004 CA-02
    session = sessions.create_session(conn, "Clase", T, UTC, mode=Mode.AUTOMATIC, meeting="abc-defg-hij")
    view = sessions.teacher_view(conn, session.id, T + 10)
    assert view.session.is_open
    assert (view.code, view.seconds_left) == (None, None)
