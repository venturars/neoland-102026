"""Tests de la API (app.py) · T06–T11."""

import re

import pytest

from app import create_app
from asistencia.infra import db
from tests.conftest import TOKEN

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada."
BANNED = "No puedes pasar lista: tu acceso está bloqueado."


def open_session(client, teacher, title="Clase de prueba"):
    res = client.post("/api/sessions", json={"title": title}, headers=teacher)
    assert res.status_code == 201
    return res.get_json()["id"]


def current_code(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def check_in(client, sid, name, code):
    return client.post(f"/api/s/{sid}/checkin", json={"name": name, "code": code})


# ---------- T06 · base y acceso del profesor (CA-15, CA-17) ----------

@pytest.mark.parametrize(
    "method, path",
    [
        ("get", "/api/sessions"),
        ("post", "/api/sessions"),
        ("get", "/api/sessions/abc"),
        ("post", "/api/sessions/abc/close"),
        ("get", "/api/sessions/abc/export"),
    ],
)
@pytest.mark.parametrize("headers", [{}, {"X-Teacher-Token": "token-falso"}])
def test_teacher_routes_require_token(client, method, path, headers):
    res = getattr(client, method)(path, headers=headers)
    assert res.status_code == 401
    assert "error" in res.get_json()


def test_unknown_api_route_is_404_json(client):
    res = client.get("/api/no-existe")
    assert res.status_code == 404
    assert "error" in res.get_json()


def test_public_session_info_does_not_leak_the_list(client, teacher):
    sid = open_session(client, teacher)
    check_in(client, sid, "Ana", current_code(client, teacher, sid))
    data = client.get(f"/api/s/{sid}").get_json()
    assert data == {"title": "Clase de prueba", "open": True}


# ---------- T07 · crear y listar sesiones (CA-01, CA-02, CA-16) ----------

def test_create_session_with_title(client, teacher):  # CA-01
    res = client.post("/api/sessions", json={"title": "  Clase 20/10 – SDD "}, headers=teacher)
    assert res.status_code == 201
    assert res.get_json()["title"] == "Clase 20/10 – SDD"
    assert re.fullmatch(r"\d{4}", current_code(client, teacher, res.get_json()["id"]))


@pytest.mark.parametrize("body", [{}, {"title": ""}, {"title": "   "}])
def test_create_session_without_title_uses_date(client, teacher, body):  # CA-02
    res = client.post("/api/sessions", json=body, headers=teacher)
    assert res.status_code == 201
    assert re.fullmatch(r"\d{2}/\d{2}/\d{4} \d{2}:\d{2}", res.get_json()["title"])


def test_list_sessions_newest_first_with_totals(client, teacher, clock):  # CA-16
    first = open_session(client, teacher, "Primera")
    check_in(client, first, "Ana", current_code(client, teacher, first))
    check_in(client, first, "Luis", current_code(client, teacher, first))
    clock.advance(3600)
    second = open_session(client, teacher, "Segunda")

    sessions = client.get("/api/sessions", headers=teacher).get_json()
    assert [(s["id"], s["title"], s["total"]) for s in sessions] == [
        (second, "Segunda", 0),
        (first, "Primera", 2),
    ]
    assert {"openedAt", "closedAt"} <= sessions[0].keys()


# ---------- T08 · registro del alumno (CA-04 … CA-08, CA-12) ----------

def test_check_in_with_current_code(client, teacher):  # CA-04
    sid = open_session(client, teacher)
    res = check_in(client, sid, "Ana García", current_code(client, teacher, sid))
    assert res.status_code == 201
    data = res.get_json()
    assert data["name"] == "Ana García"
    assert "checkedAt" in data


def test_check_in_with_previous_code(client, teacher, clock):  # CA-05
    sid = open_session(client, teacher)
    previous = current_code(client, teacher, sid)
    clock.advance(30)
    assert check_in(client, sid, "Ana", previous).status_code == 201


def test_check_in_with_code_from_two_windows_ago(client, teacher, clock):  # CA-06
    sid = open_session(client, teacher)
    old = current_code(client, teacher, sid)
    clock.advance(30)
    middle = current_code(client, teacher, sid)
    clock.advance(30)
    if old in (middle, current_code(client, teacher, sid)):
        pytest.skip("Coincidencia casual de códigos (1 entre 5.000)")
    res = check_in(client, sid, "Ana", old)
    assert res.status_code == 422
    assert res.get_json()["error"] == INVALID_CODE


@pytest.mark.parametrize("code", ["abcd", "", "12345"])
def test_check_in_with_wrong_code(client, teacher, code):  # CA-06
    sid = open_session(client, teacher)
    res = check_in(client, sid, "Ana", code)
    assert res.status_code == 422
    assert res.get_json()["error"] == INVALID_CODE


def test_duplicate_name_is_not_added_twice(client, teacher, clock):  # CA-07
    sid = open_session(client, teacher)
    first = check_in(client, sid, "Ana García", current_code(client, teacher, sid)).get_json()
    clock.advance(10)
    res = check_in(client, sid, "  ana   GARCIA ", current_code(client, teacher, sid))
    assert res.status_code == 200
    assert res.get_json() == {"already": True, "name": "Ana García", "checkedAt": first["checkedAt"]}
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 1


@pytest.mark.parametrize("name", ["", "   ", "a" * 61])
def test_invalid_name_is_rejected(client, teacher, name):  # CA-08
    sid = open_session(client, teacher)
    res = check_in(client, sid, name, current_code(client, teacher, sid))
    assert res.status_code == 400
    assert res.get_json()["error"]


def test_html_name_is_returned_literally(client, teacher):  # CA-12
    sid = open_session(client, teacher)
    check_in(client, sid, "<b>Ana</b>", current_code(client, teacher, sid))
    checkins = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["checkins"]
    assert checkins[0]["name"] == "<b>Ana</b>"


def test_unknown_session(client):
    assert client.get("/api/s/no-existe").status_code == 404
    assert check_in(client, "no-existe", "Ana", "1234").status_code == 404


# ---------- T09 · vista del profesor (CA-10, CA-11) ----------

def test_teacher_view(client, teacher, clock):  # CA-10, CA-11
    sid = open_session(client, teacher)
    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert data["open"] is True
    assert data["total"] == 0 and data["checkins"] == []
    assert 1 <= data["secondsLeft"] <= 30
    assert data["studentUrl"].endswith(f"/alumno.html?s={sid}")

    check_in(client, sid, "Luis", data["code"])
    clock.advance(5)
    check_in(client, sid, "Ana", current_code(client, teacher, sid))

    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert data["total"] == 2
    assert [c["name"] for c in data["checkins"]] == ["Luis", "Ana"]


# ---------- T10 · cerrar sesión (CA-09, CA-13) ----------

def test_closed_session(client, teacher):  # CA-09, CA-13
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    assert client.post(f"/api/sessions/{sid}/close", headers=teacher).status_code == 200

    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert data["open"] is False
    assert "code" not in data
    assert data["closedAt"]
    assert client.get(f"/api/s/{sid}").get_json()["open"] is False

    res = check_in(client, sid, "Ana", code)
    assert res.status_code == 409
    assert res.get_json()["error"] == CLOSED


def test_close_unknown_session(client, teacher):
    assert client.post("/api/sessions/no-existe/close", headers=teacher).status_code == 404


# ---------- T11 · exportar (CA-14) ----------

def test_export_csv(client, teacher, clock):  # CA-14
    sid = open_session(client, teacher)
    check_in(client, sid, "Luis", current_code(client, teacher, sid))
    clock.advance(5)
    check_in(client, sid, "Ana García", current_code(client, teacher, sid))

    res = client.get(f"/api/sessions/{sid}/export", headers=teacher)
    assert res.status_code == 200
    assert res.mimetype == "text/csv"
    assert "attachment" in res.headers["Content-Disposition"]
    assert ".csv" in res.headers["Content-Disposition"]

    rows = res.get_data(as_text=True).lstrip("﻿").splitlines()
    assert rows[0] == "Nombre;Hora"
    assert [r.split(";")[0] for r in rows[1:]] == ["Luis", "Ana García"]


# ---------- T13 · acceso a través del túnel (CA-19) ----------

def test_student_url_uses_public_tunnel_address(client, teacher):  # CA-19
    sid = open_session(client, teacher)
    res = client.get(
        f"/api/sessions/{sid}",
        headers={**teacher, "X-Forwarded-Proto": "https", "X-Forwarded-Host": "abc.trycloudflare.com"},
    )
    assert res.get_json()["studentUrl"] == f"https://abc.trycloudflare.com/alumno.html?s={sid}"


# ---------- T22 · quitar registros (CA-24, CA-25, CA-26) ----------

def checkins_of(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["checkins"]


def test_checkins_include_id(client, teacher):
    sid = open_session(client, teacher)
    check_in(client, sid, "Ana", current_code(client, teacher, sid))
    assert isinstance(checkins_of(client, teacher, sid)[0]["id"], int)


def test_remove_checkin(client, teacher):  # CA-24
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    check_in(client, sid, "Ana", code)
    check_in(client, sid, "Falso", code)
    fake = next(c for c in checkins_of(client, teacher, sid) if c["name"] == "Falso")

    res = client.delete(f"/api/sessions/{sid}/checkins/{fake['id']}", headers=teacher)
    assert res.status_code == 200

    data = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert [c["name"] for c in data["checkins"]] == ["Ana"]
    assert data["total"] == 1
    csv = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert "Falso" not in csv and "Ana" in csv


def test_remove_checkin_from_closed_session(client, teacher):  # CA-24
    sid = open_session(client, teacher)
    check_in(client, sid, "Ana", current_code(client, teacher, sid))
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    checkin_id = checkins_of(client, teacher, sid)[0]["id"]
    assert client.delete(f"/api/sessions/{sid}/checkins/{checkin_id}", headers=teacher).status_code == 200
    assert checkins_of(client, teacher, sid) == []


def test_remove_unknown_or_other_session_checkin(client, teacher):  # CA-24
    sid = open_session(client, teacher)
    other = open_session(client, teacher, "Otra")
    check_in(client, other, "Ana", current_code(client, teacher, other))
    other_id = checkins_of(client, teacher, other)[0]["id"]

    assert client.delete(f"/api/sessions/{sid}/checkins/{other_id}", headers=teacher).status_code == 404
    assert client.delete(f"/api/sessions/{sid}/checkins/99999", headers=teacher).status_code == 404
    assert client.delete(f"/api/sessions/no-existe/checkins/1", headers=teacher).status_code == 404
    assert len(checkins_of(client, teacher, other)) == 1  # la de la otra sesión sigue ahí


@pytest.mark.parametrize("headers", [{}, {"X-Teacher-Token": "token-falso"}])
def test_remove_requires_token(client, teacher, headers):  # CA-25
    sid = open_session(client, teacher)
    check_in(client, sid, "Ana", current_code(client, teacher, sid))
    checkin_id = checkins_of(client, teacher, sid)[0]["id"]
    assert client.delete(f"/api/sessions/{sid}/checkins/{checkin_id}", headers=headers).status_code == 401
    assert len(checkins_of(client, teacher, sid)) == 1


def test_removed_person_can_check_in_again(client, teacher):  # CA-26
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    check_in(client, sid, "Ana García", code)
    checkin_id = checkins_of(client, teacher, sid)[0]["id"]
    client.delete(f"/api/sessions/{sid}/checkins/{checkin_id}", headers=teacher)
    assert check_in(client, sid, "ana garcia", code).status_code == 201


# ---------- 006 · control de acceso por IP (CA-01 a CA-10) ----------

def post_from(client, sid, name, code, ip):
    return client.post(
        f"/api/s/{sid}/checkin",
        json={"name": name, "code": code, "ip": "198.51.100.9"},
        headers={"X-Forwarded-For": "198.51.100.9", "CF-Connecting-IP": "198.51.100.9"},
        environ_overrides={"REMOTE_ADDR": ip},
    )


def test_blacklist_saves_and_reads(tmp_path):  # CA-05, CA-09
    path = tmp_path / "lista.db"
    conn = db.connect(path)
    db.init_schema(conn)
    assert db.is_banned(conn, "203.0.113.8") is False
    db.ban(conn, "203.0.113.8", "2026-10-24T14:00:00.000+00:00")
    assert db.is_banned(conn, "203.0.113.8") is True
    conn.close()

    again = db.connect(path)
    db.init_schema(again)
    assert db.is_banned(again, "203.0.113.8") is True
    again.close()


def test_blacklist_cannot_be_changed(tmp_path):  # CA-10
    conn = db.connect(tmp_path / "lista.db")
    db.init_schema(conn)
    db.ban(conn, "203.0.113.8", "2026-10-24T14:00:00.000+00:00")
    db.ban(conn, "203.0.113.8", "2026-10-24T18:00:00.000+00:00")
    row = conn.execute("SELECT banned_at FROM blacklist WHERE ip = ?", ("203.0.113.8",)).fetchone()
    assert row["banned_at"] == "2026-10-24T14:00:00.000+00:00"
    names = {item for item in dir(db) if item.startswith(("unban", "remove_ban", "delete_ban"))}
    assert names == set()
    conn.close()


def test_checkins_have_no_ip_column(tmp_path):  # CA-08
    conn = db.connect(tmp_path / "lista.db")
    db.init_schema(conn)
    columns = [row["name"] for row in conn.execute("PRAGMA table_info(checkins)")]
    assert "ip" not in columns
    conn.close()


def test_five_calls_in_one_second_still_check_in(client, teacher):  # CA-01
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    for i in range(5):
        res = post_from(client, sid, f"Alumno {i}", code, "203.0.113.8")
        assert res.status_code == 201


def test_invalid_code_counts_toward_the_limit(client, teacher):  # CA-02
    sid = open_session(client, teacher)
    for i in range(5):
        res = post_from(client, sid, f"Alumno {i}", "0000", "203.0.113.10")
        assert res.status_code == 422
        assert res.get_json()["error"] == INVALID_CODE
    res = post_from(client, sid, "Alumno 5", "0000", "203.0.113.10")
    assert res.status_code == 403
    assert res.get_json()["error"] == BANNED


def test_sixth_call_in_one_second_is_banned(client, teacher):  # CA-03, CA-08
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    ip = "203.0.113.11"
    for i in range(5):
        assert post_from(client, sid, f"Alumno {i}", code, ip).status_code == 201
    res = post_from(client, sid, "Alumno 5", code, ip)
    assert res.status_code == 403
    assert res.get_json()["error"] == BANNED
    names = [item["name"] for item in checkins_of(client, teacher, sid)]
    assert names == [f"Alumno {i}" for i in range(5)]
    assert "ip" not in checkins_of(client, teacher, sid)[0]
    csv = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert ip not in csv
    assert "Alumno 5" not in csv


def test_twenty_first_call_in_one_minute_is_banned(client, teacher, clock):  # CA-04
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    ip = "203.0.113.12"
    for i in range(20):
        res = post_from(client, sid, f"Alumno {i}", code, ip)
        assert res.status_code == 201
        clock.advance(1)
    res = post_from(client, sid, "Alumno 20", code, ip)
    assert res.status_code == 403
    assert res.get_json()["error"] == BANNED


def test_banned_ip_stays_blocked_with_a_valid_code(client, teacher, clock):  # CA-05
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    ip = "203.0.113.13"
    for _ in range(6):
        post_from(client, sid, "Ana", code, ip)
    clock.advance(120)
    res = post_from(client, sid, "Luis", code, ip)
    assert res.status_code == 403
    assert res.get_json()["error"] == BANNED
    assert [item["name"] for item in checkins_of(client, teacher, sid)] == ["Ana"]


def test_spoofed_ip_does_not_avoid_the_ban(client, teacher):  # CA-06
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    real = "203.0.113.14"
    fake = "198.51.100.9"
    for i in range(6):
        post_from(client, sid, f"Alumno {i}", code, real)
    ok = post_from(client, sid, "Otra persona", code, fake)
    assert ok.status_code == 201
    again = post_from(client, sid, "Sigue bloqueada", code, real)
    assert again.status_code == 403


def test_ban_survives_time_close_and_a_new_app(tmp_path, clock):  # CA-09
    path = tmp_path / "misma.db"
    teacher = {"X-Teacher-Token": TOKEN}
    first = create_app(path, token=TOKEN, now=clock)
    client = first.test_client()
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    ip = "203.0.113.15"
    for _ in range(6):
        post_from(client, sid, "Ana", code, ip)
    assert client.post(f"/api/sessions/{sid}/close", headers=teacher).status_code == 200
    clock.advance(3600)

    second = create_app(path, token=TOKEN, now=clock)
    client = second.test_client()
    sid = open_session(client, teacher, "Clase siguiente")
    code = current_code(client, teacher, sid)
    res = post_from(client, sid, "Ana", code, ip)
    assert res.status_code == 403
    assert res.get_json()["error"] == BANNED


def test_nobody_can_remove_or_change_a_banned_ip(client, teacher):  # CA-10
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    ip = "203.0.113.16"
    for _ in range(6):
        post_from(client, sid, "Ana", code, ip)
    missing = client.delete("/api/no-existe", headers=teacher)
    attempt = client.delete(f"/api/sessions/blacklist/{ip}", headers=teacher)
    assert attempt.status_code == missing.status_code
    assert attempt.status_code != 200
    assert post_from(client, sid, "Luis", code, ip).status_code == 403
