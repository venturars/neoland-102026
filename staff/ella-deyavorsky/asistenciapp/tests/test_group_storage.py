"""Tests del almacenamiento de grupos y copias de la lista · spec 007."""

import sqlite3

import pytest

from asistencia.storage import sqlite as storage

T0 = "2026-10-27T10:00:00.000+00:00"
T1 = "2026-10-27T10:05:00.000+00:00"


@pytest.fixture
def db(tmp_path):
    path = tmp_path / "grupos.db"
    storage.init_schema(path)
    return path


@pytest.fixture
def group(db):
    g = storage.create_group(db, "SDD 2º A", T0)
    storage.add_group_students(db, g["id"], [("Ana García", "ana garcia"), ("Luis", "luis")])
    return storage.get_group(db, g["id"])


# ---------- grupos (CA-13) ----------

def test_create_and_get_group(db, group):
    assert group["name"] == "SDD 2º A"
    assert group["archived_at"] is None
    assert group["student_count"] == 2
    assert storage.get_group(db, "no-existe") is None


def test_list_groups_separates_archived(db, group):
    other = storage.create_group(db, "Otro", T0)
    storage.set_group_archived(db, other["id"], T1)
    assert [g["name"] for g in storage.list_groups(db, archived=False)] == ["SDD 2º A"]
    assert [g["name"] for g in storage.list_groups(db, archived=True)] == ["Otro"]
    storage.set_group_archived(db, other["id"], None)
    assert len(storage.list_groups(db, archived=False)) == 2


def test_rename_group(db, group):
    storage.rename_group(db, group["id"], "SDD 2º B")
    assert storage.get_group(db, group["id"])["name"] == "SDD 2º B"


def test_students_add_rename_remove(db, group):
    students = storage.list_group_students(db, group["id"])
    assert [s["name"] for s in students] == ["Ana García", "Luis"]
    luis = students[1]["id"]
    assert storage.rename_group_student(db, group["id"], luis, "Luis Pérez", "luis perez")
    assert storage.remove_group_student(db, group["id"], students[0]["id"])
    assert [s["name"] for s in storage.list_group_students(db, group["id"])] == ["Luis Pérez"]
    assert not storage.remove_group_student(db, group["id"], 999)


# ---------- sesiones con grupo y copia (CA-08, CA-09) ----------

def open_with_group(db, group):
    students = storage.list_group_students(db, group["id"])
    return storage.create_session(
        db, "Clase", T0, group=group, roster=[(s["name"], s["name_key"]) for s in students]
    )


def test_session_with_group_keeps_a_copy(db, group):  # CA-08
    session = open_with_group(db, group)
    assert session["group_id"] == group["id"]
    assert session["group_name"] == "SDD 2º A"
    luis = storage.list_group_students(db, group["id"])[1]["id"]
    storage.rename_group_student(db, group["id"], luis, "Luis Pérez", "luis perez")
    roster = storage.list_session_roster(db, session["id"])
    assert [r["name"] for r in roster] == ["Ana García", "Luis"]


def test_quick_session_has_no_group(db):
    session = storage.create_session(db, "Rápida", T0)
    assert session["group_id"] is None and session["group_name"] is None
    assert storage.list_session_roster(db, session["id"]) == []


def test_count_open_sessions_and_delete_group(db, group):  # CA-09
    session = open_with_group(db, group)
    assert storage.count_open_sessions_of_group(db, group["id"]) == 1
    storage.close_session(db, session["id"], T1)
    assert storage.count_open_sessions_of_group(db, group["id"]) == 0
    storage.delete_group(db, group["id"])
    assert storage.get_group(db, group["id"]) is None
    kept = storage.get_session(db, session["id"])
    assert kept["group_id"] is None and kept["group_name"] == "SDD 2º A"
    assert len(storage.list_session_roster(db, session["id"])) == 2
    with sqlite3.connect(db) as conn:
        assert conn.execute("SELECT COUNT(*) FROM group_students").fetchone()[0] == 0


def test_add_to_session_roster_is_idempotent(db, group):  # CA-17
    session = open_with_group(db, group)
    storage.add_to_session_roster(db, session["id"], "Marta", "marta")
    storage.add_to_session_roster(db, session["id"], "Marta", "marta")
    assert [r["name"] for r in storage.list_session_roster(db, session["id"])] == ["Ana García", "Luis", "Marta"]


# ---------- registros con tipo (CA-12, CA-17) ----------

def test_checkin_kind_and_decisions(db, group):
    session = open_with_group(db, group)
    row, created = storage.add_checkin(db, session["id"], "Ella G.", "ella g.", T1, kind="new")
    assert created and row["id"]
    found = storage.get_checkin(db, session["id"], row["id"])
    assert (found["kind"], found["decided"]) == ("new", 0)
    storage.set_checkin_decided(db, session["id"], row["id"])
    assert storage.get_checkin(db, session["id"], row["id"])["decided"] == 1
    storage.set_checkin_kind(db, session["id"], row["id"], "listed", "Ella García", "ella garcia")
    linked = storage.get_checkin(db, session["id"], row["id"])
    assert (linked["kind"], linked["name"], linked["name_key"]) == ("listed", "Ella García", "ella garcia")
    assert storage.get_checkin(db, "otra", row["id"]) is None


# ---------- un pase, un registro (spec v1.2, CA-21) ----------

def used_passes(db):
    with sqlite3.connect(db) as conn:
        return conn.execute("SELECT session_id, pass FROM used_passes").fetchall()


def test_add_checkin_with_pass_inserts_and_marks_the_pass(db, group):  # CA-21
    session = open_with_group(db, group)
    status, row = storage.add_checkin_with_pass(db, session["id"], "Luis", "luis", T1, "listed", "pase-1")
    assert status == "created" and row["name"] == "Luis"
    assert used_passes(db) == [(session["id"], "pase-1")]


def test_repeated_pass_inserts_nothing(db, group):  # CA-21
    session = open_with_group(db, group)
    storage.add_checkin_with_pass(db, session["id"], "Luis", "luis", T1, "listed", "pase-1")
    status, row = storage.add_checkin_with_pass(db, session["id"], "Ana García", "ana garcia", T1, "listed", "pase-1")
    assert (status, row) == ("pass_used", None)
    assert [c["name"] for c in storage.list_checkins(db, session["id"])] == ["Luis"]


def test_taken_name_does_not_use_the_pass(db, group):  # RF-11
    session = open_with_group(db, group)
    storage.add_checkin_with_pass(db, session["id"], "Luis", "luis", T1, "listed", "pase-1")
    status, row = storage.add_checkin_with_pass(db, session["id"], "Luis", "luis", T1, "listed", "pase-2")
    assert (status, row) == ("name_taken", None)
    assert used_passes(db) == [(session["id"], "pase-1")]
