"""El registro comprueba el nombre antes de guardarlo."""

import pytest

from app import create_app
from asistencia.comprobar_nombre import ALIAS, INVALID, REAL, NoSePudoComprobar

TOKEN = "token-de-prueba"


def client_for(tmp_path, clock, comprobar):
    app = create_app(tmp_path / "nombres.db", token=TOKEN, now=clock, comprobar=comprobar)
    return app.test_client()


def open_session(client):
    res = client.post(
        "/api/sessions",
        json={"title": "Clase"},
        headers={"X-Teacher-Token": TOKEN},
    )
    return res.get_json()["id"]


def code_of(client, sid):
    return client.get(
        f"/api/sessions/{sid}",
        headers={"X-Teacher-Token": TOKEN},
    ).get_json()["code"]


def check_in(client, sid, name):
    return client.post(
        f"/api/s/{sid}/checkin",
        json={"name": name, "code": code_of(client, sid)},
    )


def names_of(client, sid):
    data = client.get(
        f"/api/sessions/{sid}",
        headers={"X-Teacher-Token": TOKEN},
    ).get_json()
    return data["total"], [row["name"] for row in data["checkins"]]


def test_real_name_is_listed(tmp_path, clock):
    seen = []
    client = client_for(tmp_path, clock, lambda name: seen.append(name) or REAL)
    sid = open_session(client)
    res = check_in(client, sid, "Ana García")
    assert res.status_code == 201
    total, names = names_of(client, sid)
    assert total == 1
    assert names == ["Ana García"]
    assert seen == ["ana garcía"]


def test_alias_stays_off_the_list_and_the_download(tmp_path, clock):
    client = client_for(tmp_path, clock, lambda name: ALIAS)
    sid = open_session(client)
    res = check_in(client, sid, "el moto")
    assert res.status_code == 400
    assert res.get_json()["error"] == "El nombre no es válido porque es un alias o un mote."
    total, names = names_of(client, sid)
    assert total == 0 and names == []
    csv = client.get(
        f"/api/sessions/{sid}/export",
        headers={"X-Teacher-Token": TOKEN},
    ).get_data(as_text=True)
    assert "el moto" not in csv.casefold()


def test_text_that_is_not_a_name_is_rejected(tmp_path, clock):
    client = client_for(tmp_path, clock, lambda name: INVALID)
    sid = open_session(client)
    res = check_in(client, sid, "12345")
    assert res.status_code == 400
    assert res.get_json()["error"] == "El nombre no es válido."
    assert names_of(client, sid) == (0, [])


def test_short_real_names_are_listed(tmp_path, clock):
    client = client_for(tmp_path, clock, lambda name: REAL)
    sid = open_session(client)
    assert check_in(client, sid, "Pepe").status_code == 201
    assert check_in(client, sid, "Dani").status_code == 201
    assert names_of(client, sid)[1] == ["Pepe", "Dani"]


def test_each_word_starts_with_a_capital(tmp_path, clock):
    client = client_for(tmp_path, clock, lambda name: REAL)
    sid = open_session(client)
    check_in(client, sid, "maría de la cruz")
    assert names_of(client, sid)[1] == ["María De La Cruz"]


def test_an_accepted_name_is_not_checked_again(tmp_path, clock):
    seen = []

    def ask(name):
        seen.append(name)
        return REAL

    client = client_for(tmp_path, clock, ask)
    first = open_session(client)
    check_in(client, first, "maría garcía")
    second = open_session(client)
    check_in(client, second, "MARÍA GARCÍA")
    assert seen == ["maría garcía"]
    assert names_of(client, second)[1] == ["María García"]


def test_a_rejected_alias_is_not_checked_again(tmp_path, clock):
    seen = []

    def ask(name):
        seen.append(name)
        return ALIAS

    client = client_for(tmp_path, clock, ask)
    sid = open_session(client)
    assert check_in(client, sid, "el moto").status_code == 400
    assert check_in(client, sid, "El Moto").status_code == 400
    assert seen == ["el moto"]


def test_another_text_is_checked_after_a_rejection(tmp_path, clock):
    seen = []

    def ask(name):
        seen.append(name)
        return ALIAS if name == "el moto" else REAL

    client = client_for(tmp_path, clock, ask)
    sid = open_session(client)
    check_in(client, sid, "el moto")
    assert check_in(client, sid, "Ana").status_code == 201
    assert seen == ["el moto", "ana"]


def test_invalid_code_does_not_ask(tmp_path, clock):
    def ask(name):
        raise AssertionError(name)

    client = client_for(tmp_path, clock, ask)
    sid = open_session(client)
    current = code_of(client, sid)
    wrong = "0000" if current != "0000" else "1111"
    res = client.post(f"/api/s/{sid}/checkin", json={"name": "Ana", "code": wrong})
    assert res.status_code == 422


def test_closed_session_does_not_ask(tmp_path, clock):
    def ask(name):
        raise AssertionError(name)

    client = client_for(tmp_path, clock, ask)
    sid = open_session(client)
    client.post(f"/api/sessions/{sid}/close", headers={"X-Teacher-Token": TOKEN})
    res = client.post(f"/api/s/{sid}/checkin", json={"name": "Ana", "code": "0000"})
    assert res.status_code == 409


def test_when_the_check_fails_the_name_is_listed(tmp_path, clock):
    def ask(name):
        raise NoSePudoComprobar()

    client = client_for(tmp_path, clock, ask)
    sid = open_session(client)
    res = check_in(client, sid, "ana")
    assert res.status_code == 201
    assert names_of(client, sid)[1] == ["Ana"]
    assert "alias" not in res.get_json()
