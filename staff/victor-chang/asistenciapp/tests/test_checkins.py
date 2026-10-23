"""Tests de attendance/usecases/checkins.py · spec 001 CA-04, CA-06 a CA-09, CA-24, CA-26; sin Flask.

Con una base de datos real y temporal, y la hora fijada por el test (ARCHITECTURE.md · T2).
"""

from contextlib import closing
from datetime import UTC

import pytest

from attendance.domain.codes import code_for
from attendance.domain.errors import (
    CheckinNotFoundError,
    EmptyNameError,
    InvalidCodeError,
    SessionClosedError,
    SessionNotFoundError,
)
from attendance.domain.sessions import to_iso
from attendance.infra import storage
from attendance.usecases import sessions
from attendance.usecases.checkins import check_in, remove_checkin

T = 1_800_000_000.0


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
    return sessions.create_session(conn, "Clase", T, UTC)


def test_valid_code_registers(conn, session):  # CA-04
    result = check_in(conn, session.id, " Ana ", code_for(session.secret, T), T)
    assert result.created
    assert (result.checkin.name, result.checkin.checked_at) == ("Ana", to_iso(T))


def test_check_in_is_saved(db_path, conn, session):  # D3: el caso de uso confirma su transacción
    check_in(conn, session.id, "Ana", code_for(session.secret, T), T)
    with closing(storage.connect(db_path)) as other:
        assert [c.name for c in storage.list_checkins(other, session.id)] == ["Ana"]


def test_same_name_twice_is_not_created_again(conn, session):  # CA-07
    code = code_for(session.secret, T)
    first = check_in(conn, session.id, "Ana García", code, T)
    again = check_in(conn, session.id, "ana garcia", code, T + 5)
    assert not again.created
    assert again.checkin == first.checkin


def test_unknown_session(conn):
    with pytest.raises(SessionNotFoundError):
        check_in(conn, "no-existe", "Ana", "1234", T)


def test_closed_session_is_rejected(conn, session):  # CA-09
    sessions.close_session(conn, session.id, T)
    with pytest.raises(SessionClosedError):
        check_in(conn, session.id, "Ana", code_for(session.secret, T), T)


def test_invalid_name_is_rejected(conn, session):  # CA-08
    with pytest.raises(EmptyNameError):
        check_in(conn, session.id, "  ", code_for(session.secret, T), T)


@pytest.mark.parametrize("code", ["0000x", None, "١٢٣٤"])
def test_invalid_code_is_rejected(conn, session, code):  # CA-06
    with pytest.raises(InvalidCodeError):
        check_in(conn, session.id, "Ana", code, T)


def test_closed_is_checked_before_name(conn, session):
    sessions.close_session(conn, session.id, T)
    with pytest.raises(SessionClosedError):
        check_in(conn, session.id, "", "", T)


def test_numeric_code_is_not_converted_to_text(conn, session):  # spec 005 CA-06, ARCHITECTURE E1
    # Un instante cuyo código no empieza por 0, para que el número tenga las mismas 4 cifras.
    t = next(T + i * 30 for i in range(100) if not code_for(session.secret, T + i * 30).startswith("0"))
    with pytest.raises(InvalidCodeError):
        check_in(conn, session.id, "Ana", int(code_for(session.secret, t)), t)


def test_rejected_check_in_saves_nothing(conn, session):
    with pytest.raises(InvalidCodeError):
        check_in(conn, session.id, "Ana", "nope", T)
    assert storage.list_checkins(conn, session.id) == []


def test_remove_checkin(db_path, conn, session):  # CA-24
    checkin = check_in(conn, session.id, "Ana", code_for(session.secret, T), T).checkin
    remove_checkin(conn, session.id, checkin.id)
    with closing(storage.connect(db_path)) as other:
        assert storage.list_checkins(other, session.id) == []


def test_removed_person_can_check_in_again(conn, session):  # CA-26
    code = code_for(session.secret, T)
    checkin = check_in(conn, session.id, "Ana García", code, T).checkin
    remove_checkin(conn, session.id, checkin.id)
    assert check_in(conn, session.id, "ana garcia", code, T).created


def test_remove_checkin_from_another_session(conn, session):  # CA-24
    other = sessions.create_session(conn, "Otra", T, UTC)
    checkin = check_in(conn, session.id, "Ana", code_for(session.secret, T), T).checkin
    with pytest.raises(CheckinNotFoundError):
        remove_checkin(conn, other.id, checkin.id)
    with pytest.raises(CheckinNotFoundError):
        remove_checkin(conn, session.id, 99_999)


def test_remove_checkin_from_unknown_session(conn):
    with pytest.raises(SessionNotFoundError):
        remove_checkin(conn, "no-existe", 1)
