"""Tests de asistencia/checkin.py · CA-04, CA-06 a CA-09, sin Flask."""

import pytest

from asistencia import db
from asistencia.checkin import InvalidCode, SessionClosed, register
from asistencia.codes import code_for

T = 1_800_000_000.0
AT = "2027-01-15T08:00:00.000+00:00"


@pytest.fixture
def conn(tmp_path):
    conn = db.connect(tmp_path / "t.db")
    db.init_schema(conn)
    yield conn
    conn.close()


@pytest.fixture
def session(conn):
    return db.create_session(conn, "Clase", AT)


def test_valid_code_registers(conn, session):  # CA-04
    row, created = register(conn, session, " Ana ", code_for(session["secret"], T), T, AT)
    assert created
    assert row == {"name": "Ana", "checked_at": AT}


def test_same_name_twice_is_not_created_again(conn, session):  # CA-07
    code = code_for(session["secret"], T)
    register(conn, session, "Ana García", code, T, AT)
    _row, created = register(conn, session, "ana garcia", code, T, AT)
    assert not created


def test_closed_session_is_rejected(conn, session):  # CA-09
    db.close_session(conn, session["id"], AT)
    closed = db.get_session(conn, session["id"])
    with pytest.raises(SessionClosed):
        register(conn, closed, "Ana", code_for(session["secret"], T), T, AT)


def test_invalid_name_is_rejected(conn, session):  # CA-08
    with pytest.raises(ValueError, match="Escribe tu nombre"):
        register(conn, session, "  ", code_for(session["secret"], T), T, AT)


@pytest.mark.parametrize("code", ["0000x", None, "١٢٣٤"])
def test_invalid_code_is_rejected(conn, session, code):  # CA-06
    with pytest.raises(InvalidCode):
        register(conn, session, "Ana", code, T, AT)


def test_closed_is_checked_before_name(conn, session):
    db.close_session(conn, session["id"], AT)
    closed = db.get_session(conn, session["id"])
    with pytest.raises(SessionClosed):
        register(conn, closed, "", "", T, AT)
