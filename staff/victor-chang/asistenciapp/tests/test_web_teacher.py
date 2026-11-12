"""Tests de las rutas del profesor (attendance/entrypoints/web/teacher.py).

spec 001 CA-01, CA-02, CA-09 a CA-19, CA-24 a CA-26; spec 005 CA-06, CA-08.

Vienen de test_api.py (spec 005 · T14). Cambia solo el de abrir con un cuerpo mal formado (spec 005 · P1).
"""

import re

import pytest
from web_helpers import check_in, current_code, open_session

from attendance.domain.errors import TitleTooLongError
from attendance.entrypoints.web.errors import MalformedRequestError

CLOSED = "La asistencia de esta clase ya está cerrada. Si acabas de llegar, avisa al profesor."


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
    assert client.delete("/api/sessions/no-existe/checkins/1", headers=teacher).status_code == 404
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


# ---------- Entradas mal formadas y título (spec 005 · plan §2.6, CA-06, CA-08; ARCHITECTURE T3) ----------


def sessions_of(client, teacher):
    return client.get("/api/sessions", headers=teacher).get_json()


@pytest.mark.parametrize("raw", ["[1]", '"Clase"', "{roto", '{"title": {"a": 1}}', '{"title": 5}', '{"title": null}'])
def test_create_session_with_malformed_body_is_rejected(client, teacher, raw):  # spec 005 CA-06 y P1
    res = client.post("/api/sessions", data=raw, content_type="application/json", headers=teacher)
    assert res.status_code == 400
    assert res.get_json() == {"error": MalformedRequestError.MESSAGE}
    assert sessions_of(client, teacher) == []


def test_create_session_without_body_uses_date(client, teacher):  # spec 001 CA-02
    res = client.post("/api/sessions", headers=teacher)
    assert res.status_code == 201
    assert re.fullmatch(r"\d{2}/\d{2}/\d{4} \d{2}:\d{2}", res.get_json()["title"])


@pytest.mark.parametrize("title", ["a" * 20, "  " + "b" * 20 + "  ", "Клас 1 · 李雷", "مرحبا"])
def test_titles_up_to_the_limit_are_accepted(client, teacher, title):  # spec 005 CA-08
    res = client.post("/api/sessions", json={"title": title}, headers=teacher)
    assert res.status_code == 201
    assert res.get_json()["title"] == title.strip()


@pytest.mark.parametrize("title", ["a" * 21, "é" * 21, "x" * 1000])
def test_title_over_the_limit_is_rejected(client, teacher, title):  # spec 005 CA-08
    res = client.post("/api/sessions", json={"title": title}, headers=teacher)
    assert res.status_code == 400
    assert res.get_json() == {"error": TitleTooLongError.MESSAGE}
    assert sessions_of(client, teacher) == []
