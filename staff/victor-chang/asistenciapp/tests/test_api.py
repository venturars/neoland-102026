"""Tests de la API (app.py) · T06–T11."""

import re

import pytest

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada. Si acabas de llegar, avisa al profesor."


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
    assert client.get("/api/s/no-existe").get_json()["error"] == "Esta clase no existe. Revisa el enlace."


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


# ---------- Entradas mal formadas: siempre JSON, nunca un 500 ----------

@pytest.mark.parametrize(
    "raw, status",
    [
        ("[1]", 400),  # JSON que no es un objeto
        ('"Ana"', 400),
        ('{"name": 123, "code": "1234"}', 400),  # nombre que no es texto
        ('{"name": ["Ana"], "code": "1234"}', 400),
        ('{"name": "Ana", "code": "١٢٣٤"}', 422),  # dígitos árabes desde el móvil
        ('{"name": "Ana", "code": "12é4"}', 422),
    ],
)
def test_malformed_checkin_is_rejected_as_json(client, teacher, raw, status):
    sid = open_session(client, teacher)
    res = client.post(f"/api/s/{sid}/checkin", data=raw, content_type="application/json")
    assert res.status_code == status
    assert res.get_json()["error"]


@pytest.mark.parametrize("raw", ["[1]", '{"title": {"a": 1}}', '{"title": 5}'])
def test_create_session_with_malformed_body_uses_date(client, teacher, raw):  # CA-02
    res = client.post("/api/sessions", data=raw, content_type="application/json", headers=teacher)
    assert res.status_code == 201
    assert re.fullmatch(r"\d{2}/\d{2}/\d{4} \d{2}:\d{2}", res.get_json()["title"])


def test_unexpected_error_is_json_500(client, teacher, monkeypatch):
    sid = open_session(client, teacher)

    def boom(*_args):
        raise RuntimeError("fallo simulado")

    monkeypatch.setattr("attendance.infra.storage.list_checkins", boom)
    res = client.get(f"/api/sessions/{sid}", headers=teacher)
    assert res.status_code == 500
    assert res.get_json()["error"]
