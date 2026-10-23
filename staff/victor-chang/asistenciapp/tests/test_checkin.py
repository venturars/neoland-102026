"""Tests de attendance/usecases/checkins.py · CA-04, CA-06 a CA-09, sin Flask."""

from datetime import UTC

import pytest

from attendance.domain.codes import code_for
from attendance.domain.errors import EmptyNameError, InvalidCodeError, SessionClosedError
from attendance.infra import storage
from attendance.usecases import sessions
from attendance.usecases.checkins import register

T = 1_800_000_000.0
AT = "2027-01-15T08:00:00.000+00:00"


@pytest.fixture
def conn(tmp_path):
    conn = storage.connect(tmp_path / "t.db")
    storage.init_schema(conn)
    yield conn
    conn.close()


@pytest.fixture
def session(conn):
    return sessions.create_session(conn, "Clase", T, UTC)


def test_valid_code_registers(conn, session):  # CA-04
    result = register(conn, session, " Ana ", code_for(session.secret, T), T, AT)
    assert result.created
    assert (result.checkin.name, result.checkin.checked_at) == ("Ana", AT)


def test_same_name_twice_is_not_created_again(conn, session):  # CA-07
    code = code_for(session.secret, T)
    register(conn, session, "Ana García", code, T, AT)
    assert not register(conn, session, "ana garcia", code, T, AT).created


def test_closed_session_is_rejected(conn, session):  # CA-09
    sessions.close_session(conn, session.id, T)
    closed = sessions.find_session(conn, session.id)
    with pytest.raises(SessionClosedError):
        register(conn, closed, "Ana", code_for(session.secret, T), T, AT)


def test_invalid_name_is_rejected(conn, session):  # CA-08
    with pytest.raises(EmptyNameError):
        register(conn, session, "  ", code_for(session.secret, T), T, AT)


@pytest.mark.parametrize("code", ["0000x", None, "١٢٣٤"])
def test_invalid_code_is_rejected(conn, session, code):  # CA-06
    with pytest.raises(InvalidCodeError):
        register(conn, session, "Ana", code, T, AT)


def test_closed_is_checked_before_name(conn, session):
    sessions.close_session(conn, session.id, T)
    closed = sessions.find_session(conn, session.id)
    with pytest.raises(SessionClosedError):
        register(conn, closed, "", "", T, AT)


def test_numeric_code_is_not_converted_to_text(conn, session):  # spec 005 CA-06, ARCHITECTURE E1
    # Un instante cuyo código no empieza por 0, para que el número tenga las mismas 4 cifras.
    t = next(T + i * 30 for i in range(100) if not code_for(session.secret, T + i * 30).startswith("0"))
    with pytest.raises(InvalidCodeError):
        register(conn, session, "Ana", int(code_for(session.secret, t)), t, AT)
