"""Tope de intentos de registro por dirección · CA-01 a CA-21."""

import re
import sqlite3
from pathlib import Path

from app import create_app
from asistencia.domain.attempts import BLOCKED_MESSAGE, exceeds
from asistencia.storage import sqlite as storage
from tests.conftest import TOKEN

VISITOR = "203.0.113.10"
OTHER = "203.0.113.11"


def test_exceeds_counts_the_attempt_already_included():
    assert exceeds(5, 20) is False
    assert exceeds(6, 6) is True
    assert exceeds(1, 21) is True


def open_session(client, teacher, title="Clase de prueba"):
    res = client.post("/api/sessions", json={"title": title}, headers=teacher)
    return res.get_json()["id"]


def current_code(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def post(client, sid, name, code, remote="127.0.0.1", visitor=None, forwarded=None, extra=None):
    headers = {}
    if visitor is not None:
        headers["CF-Connecting-IP"] = visitor
    if forwarded is not None:
        headers["X-Forwarded-For"] = forwarded
    body = {"name": name, "code": code}
    if extra:
        body.update(extra)
    return client.post(
        f"/api/s/{sid}/checkin",
        json=body,
        headers=headers,
        environ_base={"REMOTE_ADDR": remote},
    )


def attempt_rows(db_path, address):
    with sqlite3.connect(db_path) as connection:
        return connection.execute(
            "SELECT attempted_at FROM registration_attempts WHERE address = ? ORDER BY id",
            (address,),
        ).fetchall()


def test_fifth_registers_and_sixth_blocks(client, teacher):  # CA-01, CA-02, CA-05, CA-08, CA-16
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    assert re.fullmatch(r"\d{4}", code)
    for index in range(4):
        assert post(client, sid, f"Ana {index}", code, visitor=VISITOR).status_code == 201
    fifth = post(client, sid, "Ana 4", code, visitor=VISITOR)
    assert fifth.status_code == 201
    sixth = post(client, sid, "Ana 5", code, visitor=VISITOR)
    assert sixth.status_code == 429
    assert sixth.get_json()["error"] == BLOCKED_MESSAGE
    assert "caduc" not in BLOCKED_MESSAGE
    detail = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert detail["total"] == 5
    assert all("address" not in row and set(row) == {"id", "name", "checkedAt"} for row in detail["checkins"])


def test_twentieth_registers_and_twenty_first_blocks(client, teacher, clock):  # CA-03, CA-04
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    last = None
    for index in range(20):
        if index and index % 4 == 0:
            clock.advance(1)
        last = post(client, sid, f"Luis {index}", code, visitor=VISITOR)
        assert last.status_code == 201
    blocked = post(client, sid, "Luis 20", code, visitor=VISITOR)
    assert blocked.status_code == 429
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 20


def test_rejected_attempts_count(client, teacher):  # CA-06
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    assert post(client, sid, "Ana", code, visitor=OTHER).status_code == 201
    assert post(client, sid, "Ana", code, visitor=OTHER).status_code == 200
    assert post(client, sid, "", code, visitor=OTHER).status_code == 400
    assert post(client, sid, "Luis", "no-vale", visitor=OTHER).status_code == 422
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    assert post(client, sid, "Mara", code, visitor=OTHER).status_code == 409
    blocked = post(client, sid, "Nora", code, visitor=OTHER)
    assert blocked.status_code == 429


def test_blocked_address_stays_blocked_after_restart(tmp_path, clock):  # CA-07, CA-09, CA-13
    db_path = tmp_path / "asistencia.db"
    first = create_app(db_path, token=TOKEN, now=clock)
    client = first.test_client()
    teacher = {"X-Teacher-Token": TOKEN}
    sid = open_session(client, teacher)
    other = open_session(client, teacher, "Otra")
    code = current_code(client, teacher, sid)
    for index in range(6):
        post(client, sid, f"Ana {index}", code, visitor=VISITOR)
    stored = len(attempt_rows(db_path, VISITOR))
    again = create_app(db_path, token=TOKEN, now=clock).test_client()
    blocked = post(again, sid, "Ana nueva", code, visitor=VISITOR)
    assert blocked.status_code == 429
    other_code = current_code(again, teacher, other)
    assert post(again, other, "Otra persona", other_code, visitor=VISITOR).status_code == 429
    assert len(attempt_rows(db_path, VISITOR)) == stored


def test_attendance_export_has_no_address(client, teacher):  # CA-10
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    assert post(client, sid, "Ana", code, visitor=VISITOR).status_code == 201
    exported = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert VISITOR not in exported
    assert "Nombre;Hora" in exported


def test_attempts_outside_the_minute_are_removed(tmp_path):  # CA-11, CA-12
    db_path = tmp_path / "asistencia.db"
    storage.prepare(db_path)
    storage.note_attempt(db_path, VISITOR, 1_000.0)
    blocked, in_second, in_minute = storage.note_attempt(db_path, VISITOR, 1_059.0)
    assert (blocked, in_second, in_minute) == (False, 1, 2)
    assert [row[0] for row in attempt_rows(db_path, VISITOR)] == [1_000.0, 1_059.0]
    storage.note_attempt(db_path, VISITOR, 1_060.0)
    assert [row[0] for row in attempt_rows(db_path, VISITOR)] == [1_059.0, 1_060.0]


def test_other_requests_do_not_count(client, teacher):  # CA-14
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    post(client, sid, "Ana", code, visitor=VISITOR)
    checkin_id = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["checkins"][0]["id"]
    for _ in range(25):
        assert client.get("/").status_code == 200
        assert client.get("/alumno.html").status_code == 200
        assert client.get("/api/sessions", headers=teacher).status_code == 200
        assert client.get(f"/api/s/{sid}").status_code == 200
        assert client.get(f"/api/sessions/{sid}", headers=teacher).status_code == 200
    client.delete(f"/api/sessions/{sid}/checkins/{checkin_id}", headers=teacher)
    client.get(f"/api/sessions/{sid}/export", headers=teacher)
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    opened = open_session(client, teacher, "Siguiente")
    fresh = current_code(client, teacher, opened)
    assert post(client, opened, "Luis", fresh, visitor=VISITOR).status_code == 201


def test_another_address_is_not_blocked(client, teacher):  # CA-15
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    for index in range(6):
        post(client, sid, f"Ana {index}", code, visitor=VISITOR)
    assert post(client, sid, "Luis", code, visitor=OTHER).status_code == 201


def test_student_json_and_forwarded_header_are_ignored(client, teacher):  # CA-17
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    for index in range(6):
        post(
            client,
            sid,
            f"Ana {index}",
            code,
            remote="198.51.100.20",
            visitor=VISITOR,
            forwarded="198.51.100.99",
            extra={"ip": OTHER},
        )
    assert post(client, sid, "Luis", code, remote="198.51.100.21", visitor=VISITOR).status_code == 201
    assert post(client, sid, "Mara", code, remote=OTHER).status_code == 201


def test_local_connection_without_visitor_is_shared(client, teacher):  # CA-18
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    for index in range(6):
        post(client, sid, f"Ana {index}", "0000", remote="127.0.0.1")
    assert post(client, sid, "Luis", code, remote="127.0.0.1").status_code == 429
    assert post(client, sid, "Mara", code, remote="127.0.0.1", visitor=VISITOR).status_code == 201


def test_tunnel_visitor_is_used_only_from_this_computer(client, teacher):  # CA-21
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    for index in range(6):
        post(client, sid, f"Ana {index}", code, remote="127.0.0.1", visitor=VISITOR)
    assert post(client, sid, "Luis", code, remote="127.0.0.1", visitor=OTHER).status_code == 201
    assert post(client, sid, "Nora", code, remote="127.0.0.1", visitor="203.0.113.5, 198.51.100.1").status_code == 201
    assert post(client, sid, "Paz", code, remote="127.0.0.1", visitor="no-es-una-direccion").status_code == 201
    for index in range(5):
        post(client, sid, f"Local {index}", "0000", remote="127.0.0.1")
    assert post(client, sid, "Local 5", code, remote="127.0.0.1").status_code == 429
    for index in range(6):
        post(
            client,
            sid,
            f"Fuera {index}",
            code,
            remote="198.51.100.30",
            visitor="203.0.113.30",
        )
    assert post(client, sid, "Sigue", code, remote="203.0.113.30").status_code == 201
    assert post(client, sid, "Misma", code, remote="198.51.100.30").status_code == 429


def test_docs_explain_the_address_and_the_amendment():  # CA-19, CA-20
    root = Path(__file__).resolve().parents[1]
    readme = (root / "README.md").read_text(encoding="utf-8")
    constitution = (root / "docs" / "CONSTITUTION.md").read_text(encoding="utf-8")
    assert "Versión 3.0" in constitution
    assert "Excepción de la spec 006" in constitution
    for piece in (
        "dirección pública",
        "no identifica para siempre",
        "si la dirección es fija",
        "CF-Connecting-IP",
        "este ordenador",
    ):
        assert piece in readme
