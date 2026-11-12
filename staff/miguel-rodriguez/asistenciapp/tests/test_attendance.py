"""Compatibilidad con datos anteriores y cierre de recursos de las acciones."""

import sqlite3

import pytest

from asistencia.domain.codes import code_for

NOW = 1_800_000_000.0
SECRET = b"0123456789abcdef"
LEGACY_SCHEMA = '\nCREATE TABLE IF NOT EXISTS config (\n  key   TEXT PRIMARY KEY,\n  value TEXT NOT NULL\n);\n\nCREATE TABLE IF NOT EXISTS sessions (\n  id         TEXT PRIMARY KEY,\n  title      TEXT NOT NULL,\n  secret     TEXT NOT NULL,\n  opened_at  TEXT NOT NULL,\n  closed_at  TEXT\n);\n\nCREATE TABLE IF NOT EXISTS checkins (\n  id          INTEGER PRIMARY KEY AUTOINCREMENT,\n  session_id  TEXT NOT NULL REFERENCES sessions(id),\n  name        TEXT NOT NULL,\n  name_key    TEXT NOT NULL,\n  checked_at  TEXT NOT NULL,\n  UNIQUE (session_id, name_key)\n);\n'


@pytest.fixture
def legacy_database(tmp_path):
    path = tmp_path / "previous.db"
    with sqlite3.connect(path) as conn:
        conn.executescript(LEGACY_SCHEMA)
        conn.execute("INSERT INTO config VALUES ('teacher_token', 'previous-token')")
        conn.execute("INSERT INTO sessions VALUES (?, ?, ?, ?, NULL)", ("previous-session", "Clase anterior", SECRET.hex(), "2026-10-20T10:00:00.000+00:00"))
        conn.execute("INSERT INTO checkins (session_id, name, name_key, checked_at) VALUES (?, ?, ?, ?)", ("previous-session", "Ana", "ana", "2026-10-20T10:01:00.000+00:00"))
    return path


@pytest.fixture
def connections(monkeypatch):
    from asistencia.storage import sqlite as storage
    original = storage.connect
    opened = []

    def track(path):
        conn = original(path)
        opened.append(conn)
        return conn

    monkeypatch.setattr(storage, "connect", track)
    return opened


@pytest.mark.parametrize("operation", ["prepare", "public_session", "list_sessions", "teacher_view", "create_session", "check_in", "close_session", "remove_checkin", "export_session"])
def test_actions_close_connections_on_success(legacy_database, connections, operation):
    from asistencia.usecases import attendance
    args = {
        "prepare": (), "public_session": ("previous-session",),
        "list_sessions": (), "teacher_view": ("previous-session", NOW),
        "create_session": ("Nueva", NOW),
        "check_in": ("previous-session", {"name": "Luis", "code": code_for(SECRET, NOW)}, NOW),
        "close_session": ("previous-session", NOW),
        "remove_checkin": ("previous-session", 1),
        "export_session": ("previous-session",),
    }
    getattr(attendance, operation)(legacy_database, *args[operation])
    assert len(connections) == 1
    with pytest.raises(sqlite3.ProgrammingError, match="closed"):
        connections[0].execute("SELECT 1")


def test_action_closes_connection_on_domain_error(legacy_database, connections):
    from asistencia.domain.session import SessionNotFound
    from asistencia.usecases import attendance
    with pytest.raises(SessionNotFound):
        attendance.public_session(legacy_database, "missing")
    assert len(connections) == 1
    with pytest.raises(sqlite3.ProgrammingError, match="closed"):
        connections[0].execute("SELECT 1")


def test_action_closes_connection_on_storage_error(legacy_database, connections, monkeypatch):
    from asistencia.storage import sqlite as storage
    from asistencia.usecases import attendance

    def fail(*args):
        raise sqlite3.OperationalError("controlled failure")

    monkeypatch.setattr(storage, "add_checkin", fail)
    with pytest.raises(sqlite3.OperationalError):
        attendance.check_in(legacy_database, "previous-session", {"name": "Luis", "code": code_for(SECRET, NOW)}, NOW)
    assert len(connections) == 1
    with pytest.raises(sqlite3.ProgrammingError, match="closed"):
        connections[0].execute("SELECT 1")


def test_previous_database_keeps_original_tables_and_data(legacy_database):
    from asistencia.usecases import attendance
    with sqlite3.connect(legacy_database) as conn:
        tables = ("config", "sessions", "checkins", "sqlite_sequence")
        before = {table: (conn.execute("SELECT sql FROM sqlite_master WHERE name = ?", (table,)).fetchone(), conn.execute(f"SELECT * FROM {table}").fetchall()) for table in tables}
    assert attendance.prepare(legacy_database) == "previous-token"
    assert attendance.public_session(legacy_database, "previous-session") == {"title": "Clase anterior", "open": True}
    view = attendance.teacher_view(legacy_database, "previous-session", NOW)
    assert view["checkins"] == [{"id": 1, "name": "Ana", "checkedAt": "2026-10-20T10:01:00.000+00:00"}]
    assert view["openedAt"] == "2026-10-20T10:00:00.000+00:00"
    with sqlite3.connect(legacy_database) as conn:
        after = {table: (conn.execute("SELECT sql FROM sqlite_master WHERE name = ?", (table,)).fetchone(), conn.execute(f"SELECT * FROM {table}").fetchall()) for table in tables}
        assert after == before
        assert conn.execute("SELECT * FROM registration_attempts").fetchall() == []
        assert conn.execute("SELECT * FROM blocked_addresses").fetchall() == []
