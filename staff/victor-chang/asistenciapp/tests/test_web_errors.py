"""Tests de attendance/entrypoints/web/errors.py · spec 005 CA-05, CA-07; ARCHITECTURE E4, F3."""

import logging

import pytest

from attendance.domain import errors as domain_errors
from attendance.domain.errors import AppError
from attendance.entrypoints.web import errors as web_errors
from attendance.entrypoints.web.errors import METHOD_NOT_ALLOWED, NOT_FOUND, STATUS


def open_session(client, teacher):
    return client.post("/api/sessions", json={"title": "Clase"}, headers=teacher).get_json()["id"]


def current_code(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def user_errors(module):
    return {
        obj
        for obj in vars(module).values()
        if isinstance(obj, type) and issubclass(obj, AppError) and obj is not AppError
    }


def test_every_user_error_has_a_status():  # E4: una única tabla, sin huecos
    assert user_errors(domain_errors) | user_errors(web_errors) == set(STATUS)


@pytest.mark.parametrize("error, status", STATUS.items(), ids=lambda v: getattr(v, "__name__", str(v)))
def test_each_error_answers_with_its_status_and_message(app, error, status):  # CA-05
    @app.get("/api/_prueba")
    def raise_it():
        raise error

    res = app.test_client().get("/api/_prueba")
    assert res.status_code == status
    assert res.get_json() == {"error": error.MESSAGE}


def test_unknown_api_route(client):  # CA-05, F3
    res = client.get("/api/no-existe")
    assert res.status_code == 404
    assert res.get_json() == {"error": NOT_FOUND}


def test_method_not_allowed(client, teacher):  # CA-05, F3
    res = client.put("/api/sessions", headers=teacher)
    assert res.status_code == 405
    assert res.get_json() == {"error": METHOD_NOT_ALLOWED}


def test_unexpected_error_is_logged_and_answered_in_json(client, teacher, monkeypatch, caplog):  # CA-05, E6
    sid = open_session(client, teacher)

    def boom(*_args):
        raise RuntimeError("fallo simulado")

    monkeypatch.setattr("attendance.infra.storage.list_checkins", boom)
    with caplog.at_level(logging.ERROR):
        res = client.get(f"/api/sessions/{sid}", headers=teacher)
    assert res.status_code == 500
    assert res.get_json() == {"error": AppError.MESSAGE}
    assert "fallo simulado" not in res.get_data(as_text=True)  # E5: nada interno hacia fuera
    assert "RuntimeError: fallo simulado" in caplog.text  # E6: la traza queda registrada


def test_unexpected_error_does_not_log_the_student_name(client, teacher, monkeypatch, caplog):  # CA-07, E7
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)

    def boom(*_args):
        raise RuntimeError("fallo simulado")

    monkeypatch.setattr("attendance.infra.storage.add_checkin", boom)
    with caplog.at_level(logging.DEBUG):
        res = client.post(f"/api/s/{sid}/checkin", json={"name": "Zoe Únicanombre", "code": code})
    assert res.status_code == 500
    assert "fallo simulado" in caplog.text
    assert "Únicanombre" not in caplog.text


def test_non_api_pages_keep_html_errors(client):
    res = client.get("/no-existe.html")
    assert res.status_code == 404
    assert res.mimetype == "text/html"
