"""Tests de attendance/infra/storage.py · spec 005 CA-02; ARCHITECTURE D1–D5."""

import secrets
import sqlite3
from contextlib import closing

import pytest

from attendance.domain.sessions import Checkin, CheckinResult, Session, SessionSummary
from attendance.infra import storage

AT = "2027-01-15T08:00:00.000+00:00"

# Esquema de la spec 001 (plan 001 §3), copiado tal cual: la BD que ya usa el profesor.
SPEC_001_SCHEMA = """
CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, secret TEXT NOT NULL,
  opened_at TEXT NOT NULL, closed_at TEXT
);
CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES sessions(id),
  name TEXT NOT NULL, name_key TEXT NOT NULL, checked_at TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
"""


def new_session(conn, title="Clase"):
    return storage.create_session(conn, secrets.token_urlsafe(6), title, secrets.token_bytes(16), AT)


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


def test_writes_are_not_saved_without_a_transaction(db_path):  # D3
    with closing(storage.connect(db_path)) as conn:
        session = new_session(conn, "Clase")
    with closing(storage.connect(db_path)) as conn:
        assert storage.get_session(conn, session.id) is None


def test_writes_inside_a_transaction_are_saved(db_path):  # D3
    with closing(storage.connect(db_path)) as conn:
        with conn:
            session = new_session(conn, "Clase")
    with closing(storage.connect(db_path)) as conn:
        assert storage.get_session(conn, session.id) == session


def test_returns_domain_types(conn):  # D1, M4
    session = new_session(conn, "Clase")
    assert isinstance(session, Session)
    result = storage.add_checkin(conn, session.id, "Ana", "ana", AT)
    assert result == CheckinResult(Checkin(result.checkin.id, "Ana", AT), created=True)
    assert storage.list_checkins(conn, session.id) == [result.checkin]
    assert storage.list_sessions(conn) == [SessionSummary(session.id, "Clase", AT, None, 1)]


def test_same_name_key_is_not_added_twice(conn):  # spec 001 CA-07
    session = new_session(conn, "Clase")
    first = storage.add_checkin(conn, session.id, "Ana García", "ana garcia", AT)
    again = storage.add_checkin(conn, session.id, "ana garcia", "ana garcia", "2027-01-15T08:05:00.000+00:00")
    assert not again.created
    assert again.checkin == first.checkin


def test_database_enforces_its_rules(conn):  # D5
    session = new_session(conn, "Clase")
    insert = "INSERT INTO checkins (session_id, name, name_key, checked_at) VALUES (?, ?, ?, ?)"
    conn.execute(insert, (session.id, "Ana", "ana", AT))
    with pytest.raises(sqlite3.IntegrityError):  # UNIQUE (session_id, name_key)
        conn.execute(insert, (session.id, "ANA", "ana", AT))
    with pytest.raises(sqlite3.IntegrityError):  # NOT NULL
        conn.execute(insert, (session.id, None, "eva", AT))
    with pytest.raises(sqlite3.IntegrityError):  # REFERENCES sessions(id)
        conn.execute(insert, ("no-existe", "Eva", "eva", AT))


def test_spec_001_database_still_works(tmp_path):  # spec 005 CA-02
    path = tmp_path / "antigua.db"
    with closing(sqlite3.connect(path)) as old:
        old.executescript(SPEC_001_SCHEMA)
        old.execute("INSERT INTO config VALUES ('teacher_token', 'token-antiguo')")
        old.execute("INSERT INTO sessions VALUES ('s1', 'Clase antigua', ?, ?, NULL)", ("ab" * 16, AT))
        old.execute(
            "INSERT INTO checkins (session_id, name, name_key, checked_at) VALUES ('s1', 'Ana', 'ana', ?)",
            (AT,),
        )
        old.commit()

    with closing(storage.connect(path)) as conn:
        storage.init_schema(conn)
        with conn:
            assert storage.get_or_create_teacher_token(conn) == "token-antiguo"
        assert storage.get_session(conn, "s1") == Session("s1", "Clase antigua", b"\xab" * 16, AT, None)
        assert [c.name for c in storage.list_checkins(conn, "s1")] == ["Ana"]


def test_remove_checkin_only_in_its_session(conn):  # spec 001 CA-24
    one = new_session(conn, "Una")
    other = new_session(conn, "Otra")
    checkin = storage.add_checkin(conn, one.id, "Ana", "ana", AT).checkin
    assert not storage.remove_checkin(conn, other.id, checkin.id)
    assert storage.remove_checkin(conn, one.id, checkin.id)
    assert storage.list_checkins(conn, one.id) == []
