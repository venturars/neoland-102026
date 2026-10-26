"""Restricciones reales y transacciones de almacenamiento (008)."""
from contextlib import closing
import sqlite3
import pytest
from asistencia.storage import sqlite as normal
from asistencia.storage import races


def test_schema_is_additive_and_initialization_idempotent(tmp_path):
    db=tmp_path/"db.sqlite"
    with closing(normal.connect(db)) as c:
        normal.init_schema(c)
        normal.create_session(c,"Anterior","before")
        original=c.execute("SELECT * FROM sessions").fetchall()
        normal.init_schema(c)
        assert c.execute("SELECT * FROM sessions").fetchall()==original
    with closing(races.connect(db)) as c:
        assert c.execute("PRAGMA foreign_keys").fetchone()[0]==1
        assert c.execute("PRAGMA synchronous").fetchone()[0]==2
        assert c.execute("PRAGMA busy_timeout").fetchone()[0]==500


def test_three_reservations_and_no_implicit_commit(tmp_path):
    db=tmp_path/"db.sqlite"
    with closing(normal.connect(db)) as c: normal.init_schema(c)
    with closing(races.connect(db)) as c:
        c.execute("BEGIN IMMEDIATE")
        races.create(c,"race","Prueba","00",b"a"*16,0,7200,"entry",[{"key":"one","name":"Uno","character":"kart"}])
        c.rollback()
        assert races.get_race(c,"race") is None
        c.execute("BEGIN IMMEDIATE")
        races.create(c,"race","Prueba","00",b"a"*16,0,7200,"entry",[{"key":"one","name":"Uno","character":"kart"}])
        for i in (1,2,3): races.insert_operation(c,"race","one",str(i),i,"hash")
        with pytest.raises(sqlite3.IntegrityError): races.insert_operation(c,"race","one","four",4,"hash")
        c.commit()
        assert races.count_operations(c,"race","one")==3
        with pytest.raises(sqlite3.IntegrityError): c.execute("UPDATE race_operations SET state='completed'")


def test_existing_006_database_keeps_every_definition_row_and_timestamp(tmp_path):
    from pathlib import Path
    db = tmp_path / "previous.sqlite"
    previous = (Path(__file__).parent / "fixtures/008-baseline.sql").read_text()
    with closing(normal.connect(db)) as conn:
        conn.executescript(previous)
        conn.execute("INSERT INTO config VALUES ('teacher_token','fictitious')")
        conn.execute("INSERT INTO sessions VALUES ('old','Anterior',?,'2026-01-01','2026-01-02')", ((b"a" * 16).hex(),))
        conn.execute("INSERT INTO checkins(session_id,name,name_key,checked_at) VALUES ('old','Ana','ana','2026-01-01')")
        conn.execute("INSERT INTO registration_attempts VALUES ('127.0.0.1', 1)")
        conn.execute("INSERT INTO blocked_addresses VALUES ('127.0.0.2')")
        conn.commit()
        tables = ['config', 'sessions', 'checkins', 'registration_attempts', 'blocked_addresses', 'sqlite_sequence']
        before = {name: [tuple(row) for row in conn.execute(f'SELECT * FROM {name}')] for name in tables}
        definitions = [tuple(row) for row in conn.execute("SELECT name,sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY name")]
        normal.init_schema(conn)
        assert {name: [tuple(row) for row in conn.execute(f'SELECT * FROM {name}')] for name in tables} == before
        for name, sql in definitions:
            assert conn.execute("SELECT sql FROM sqlite_master WHERE name=?", (name,)).fetchone()[0] == sql
        assert not normal.is_race(conn, 'old')
