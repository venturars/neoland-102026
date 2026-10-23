"""Persistencia de intentos y bloqueo separada de los datos de asistencia."""

import sqlite3

import pytest

from asistencia.storage import sqlite as store

IP = "203.0.113.6"


@pytest.fixture
def path(tmp_path):
    path = tmp_path / "security.db"
    store.prepare(path)
    return path


def test_attempt_counts_are_scoped_to_ip_and_include_boundary(path):
    for instant in [939.0, 940.0, 999.0, 1000.0]:
        store.add_registration_attempt(path, IP, instant)
    store.add_registration_attempt(path, "198.51.100.2", 1000.0)
    assert store.count_registration_attempts(path, IP, 999.0) == 2
    assert store.count_registration_attempts(path, IP, 940.0) == 3
    assert store.count_registration_attempts(path, IP, 1000.0) == 1


def test_pruning_does_not_remove_boundary_or_blacklist(path):
    store.add_registration_attempt(path, IP, 939.0)
    store.add_registration_attempt(path, IP, 940.0)
    store.block_ip(path, IP, "2026-10-23T12:00:00+00:00")
    store.prune_registration_attempts(path, 940.0)
    assert store.count_registration_attempts(path, IP, 0) == 1
    assert store.is_ip_blocked(path, IP)


def test_block_is_persistent_idempotent_and_separate_from_checkins(path):
    store.block_ip(path, IP, "first")
    store.prepare(path)
    store.block_ip(path, IP, "second")
    assert store.is_ip_blocked(path, IP)
    assert not store.is_ip_blocked(path, "198.51.100.2")
    with sqlite3.connect(path) as conn:
        assert conn.execute("SELECT ip, blocked_at FROM blocked_ips").fetchall() == [(IP, "first")]
        assert [r[1] for r in conn.execute("PRAGMA table_info(checkins)")] == [
            "id", "session_id", "name", "name_key", "checked_at",
        ]


def test_preparing_existing_database_preserves_teacher_and_attendance(tmp_path):
    path = tmp_path / "previous.db"
    # Esquema previo a 006 y datos representativos, sin tablas de seguridad.
    with sqlite3.connect(path) as conn:
        conn.executescript("""
            CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE sessions (id TEXT PRIMARY KEY, title TEXT NOT NULL,
                secret TEXT NOT NULL, opened_at TEXT NOT NULL, closed_at TEXT);
            CREATE TABLE checkins (id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL REFERENCES sessions(id), name TEXT NOT NULL,
                name_key TEXT NOT NULL, checked_at TEXT NOT NULL, UNIQUE(session_id, name_key));
            INSERT INTO config VALUES ('teacher_token', 'previous-token');
            INSERT INTO sessions VALUES ('class', 'Anterior', '0102', 'opened', NULL);
            INSERT INTO checkins VALUES (1, 'class', 'Ana', 'ana', 'checked');
        """)
    assert store.prepare(path) == "previous-token"
    assert store.get_session(path, "class")["title"] == "Anterior"
    assert store.list_checkins(path, "class") == [{"id": 1, "name": "Ana", "checked_at": "checked"}]
    assert not store.is_ip_blocked(path, IP)
