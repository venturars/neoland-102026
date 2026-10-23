"""Tests de las rutas del alumno (attendance/entrypoints/web/public.py) · spec 001 CA-04 a CA-09, CA-12; spec 005 CA-06.

Vienen de test_api.py (spec 005 · T13). Cambian solo los de entradas mal formadas (spec 005 · plan §2.6).
"""

import pytest
from web_helpers import check_in, current_code, open_session, total_of

from attendance.domain.errors import EmptyNameError, NameTooLongError
from attendance.entrypoints.web.errors import MalformedRequestError

INVALID_CODE = "El código no es válido o ha caducado. Pide el código actual al profesor."
CLOSED = "La asistencia de esta clase ya está cerrada. Si acabas de llegar, avisa al profesor."


def test_public_session_info_does_not_leak_the_list(client, teacher):
    sid = open_session(client, teacher)
    check_in(client, sid, "Ana", current_code(client, teacher, sid))
    data = client.get(f"/api/s/{sid}").get_json()
    assert data == {"title": "Clase de prueba", "open": True}


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


# ---------- Entradas mal formadas (spec 005 · plan §2.6, CA-06; ARCHITECTURE T3) ----------


def post_raw(client, sid, raw):
    return client.post(f"/api/s/{sid}/checkin", data=raw, content_type="application/json")


@pytest.mark.parametrize(
    "raw",
    [
        "[1]",  # JSON que no es un objeto
        '"Ana"',
        "{roto",  # JSON roto
        '{"name": 123, "code": "1234"}',  # nombre que no es texto
        '{"name": ["Ana"], "code": "1234"}',
        '{"name": null, "code": "1234"}',
        '{"name": "Ana", "code": 1234}',  # código que no es texto: no se convierte
        '{"name": "Ana", "code": ["1234"]}',
    ],
)
def test_malformed_checkin_is_rejected(client, teacher, raw):  # CA-06
    sid = open_session(client, teacher)
    res = post_raw(client, sid, raw)
    assert res.status_code == 400
    assert res.get_json() == {"error": MalformedRequestError.MESSAGE}
    assert total_of(client, teacher, sid) == 0


@pytest.mark.parametrize("raw", ['{"name": "Ana", "code": "١٢٣٤"}', '{"name": "Ana", "code": "12é4"}'])
def test_code_with_odd_characters_is_an_invalid_code(client, teacher, raw):  # spec 001 CA-06
    sid = open_session(client, teacher)
    res = post_raw(client, sid, raw)
    assert res.status_code == 422
    assert res.get_json() == {"error": INVALID_CODE}


def test_check_in_without_body_asks_for_the_name(client, teacher):  # spec 001 CA-08
    sid = open_session(client, teacher)
    res = client.post(f"/api/s/{sid}/checkin")
    assert res.status_code == 400
    assert res.get_json() == {"error": EmptyNameError.MESSAGE}


def test_malformed_checkin_in_a_closed_session_is_still_malformed(client, teacher):  # E1: la forma, primero
    sid = open_session(client, teacher)
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    assert post_raw(client, sid, "[1]").status_code == 400
    assert check_in(client, sid, "Ana", "1234").get_json() == {"error": CLOSED}


@pytest.mark.parametrize("name", ["Анна Иванова", "李雷", "محمد", "Zoë Ñúñez"])
def test_names_in_other_alphabets_are_accepted(client, teacher, name):  # ARCHITECTURE T3
    sid = open_session(client, teacher)
    res = check_in(client, sid, name, current_code(client, teacher, sid))
    assert res.status_code == 201
    assert res.get_json()["name"] == name


def test_long_names_count_characters_not_bytes(client, teacher):  # spec 001 CA-08, ARCHITECTURE T3
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    assert check_in(client, sid, "á" * 60, code).status_code == 201
    res = check_in(client, sid, "é" * 61, code)
    assert res.status_code == 400
    assert res.get_json() == {"error": NameTooLongError.MESSAGE}
