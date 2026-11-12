"""Una base creada antes de la spec 007 se actualiza sola al arrancar · CA-10."""

import sqlite3

import pytest

from asistencia.storage.sqlite import init_schema, list_checkins, list_sessions

# Esquema de sesiones y registros tal como estaba antes de la spec 007.
OLD_SCHEMA = """
CREATE TABLE sessions (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, secret TEXT NOT NULL,
  opened_at TEXT NOT NULL, closed_at TEXT
);
CREATE TABLE checkins (
  id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL REFERENCES sessions(id),
  name TEXT NOT NULL, name_key TEXT NOT NULL, checked_at TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
INSERT INTO sessions VALUES ('s1', 'Clase vieja', 'aa', '2026-10-20T10:00:00.000+00:00', NULL);
INSERT INTO checkins (session_id, name, name_key, checked_at)
  VALUES ('s1', 'Ana', 'ana', '2026-10-20T10:01:00.000+00:00'),
         ('s1', 'Luis', 'luis', '2026-10-20T10:02:00.000+00:00');
"""


@pytest.fixture
def old_db(tmp_path):
    path = tmp_path / "vieja.db"
    with sqlite3.connect(path) as conn:
        conn.executescript(OLD_SCHEMA)
    return path


def columns(path, table):
    with sqlite3.connect(path) as conn:
        return {row[1] for row in conn.execute(f"PRAGMA table_info({table})")}


def test_old_database_gains_the_new_columns(old_db):  # CA-10
    init_schema(old_db)
    assert {"group_id", "group_name"} <= columns(old_db, "sessions")
    assert {"kind", "decided"} <= columns(old_db, "checkins")


def test_old_data_is_kept_as_a_quick_session(old_db):  # CA-10
    init_schema(old_db)
    assert [(s["id"], s["total"], s["group_name"]) for s in list_sessions(old_db)] == [("s1", 2, None)]
    rows = list_checkins(old_db, "s1")
    assert [(r["name"], r["kind"], r["decided"]) for r in rows] == [("Ana", None, 0), ("Luis", None, 0)]


def test_new_tables_exist_and_init_twice_is_safe(old_db):
    init_schema(old_db)
    init_schema(old_db)
    for table in ("groups", "group_students", "session_roster"):
        assert columns(old_db, table)
