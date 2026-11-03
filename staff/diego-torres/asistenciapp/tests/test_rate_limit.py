"""Límite de intentos de registrarse por IP. CA-01 a CA-07."""

import sqlite3

from app import create_app
from tests.conftest import TOKEN

BAN = "Esta dirección queda bloqueada por haber superado los intentos permitidos."


def open_session(client, teacher, title="Clase de prueba"):
    res = client.post("/api/sessions", json={"title": title}, headers=teacher)
    assert res.status_code == 201
    return res.get_json()["id"]


def current_code(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def attempt(client, sid, name, code, ip, body=None, headers=None):
    payload = {"name": name, "code": code}
    if body:
        payload.update(body)
    return client.post(
        f"/api/s/{sid}/checkin",
        json=payload,
        headers=headers,
        environ_base={"REMOTE_ADDR": ip},
    )


def test_five_bad_codes_in_one_second_are_not_a_ban_and_the_sixth_is(client, teacher):
    sid = open_session(client, teacher)
    ip = "203.0.113.5"
    for _ in range(5):
        res = attempt(client, sid, "Ana", "abcd", ip)
        assert res.status_code == 422
    res = attempt(client, sid, "Ana", "abcd", ip)
    assert res.status_code == 429
    assert res.get_json()["error"] == BAN
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 0


def test_the_twenty_first_attempt_in_a_minute_bans(client, teacher, clock):
    sid = open_session(client, teacher)
    ip = "203.0.113.20"
    for _ in range(20):
        res = attempt(client, sid, "Ana", "abcd", ip)
        assert res.status_code == 422
        clock.advance(0.3)
    res = attempt(client, sid, "Ana", "abcd", ip)
    assert res.status_code == 429
    assert res.get_json()["error"] == BAN


def test_one_valid_check_in_under_the_limit_is_saved(client, teacher):
    sid = open_session(client, teacher)
    res = attempt(client, sid, "Ana García", current_code(client, teacher, sid), "203.0.113.2")
    assert res.status_code == 201
    assert res.get_json()["name"] == "Ana García"
    assert "checkedAt" in res.get_json()


def test_reading_the_list_does_not_count(client, teacher):
    sid = open_session(client, teacher)
    ip = "203.0.113.30"
    for _ in range(30):
        assert client.get(f"/api/s/{sid}", environ_base={"REMOTE_ADDR": ip}).status_code == 200
        assert (
            client.get(
                f"/api/sessions/{sid}",
                headers=teacher,
                environ_base={"REMOTE_ADDR": ip},
            ).status_code
            == 200
        )
    res = attempt(client, sid, "Ana", current_code(client, teacher, sid), ip)
    assert res.status_code == 201


def test_a_blocked_ip_cannot_check_in_with_the_current_code(client, teacher):
    sid = open_session(client, teacher)
    ip = "203.0.113.40"
    for _ in range(6):
        attempt(client, sid, "Ana", "abcd", ip)
    res = attempt(client, sid, "Ana", current_code(client, teacher, sid), ip)
    assert res.status_code == 429
    assert res.get_json()["error"] == BAN
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 0


def test_the_block_survives_opening_the_app_again(tmp_path, clock, teacher):
    path = tmp_path / "asistencia.db"
    ip = "203.0.113.50"
    first = create_app(path, token=TOKEN, now=clock)
    client = first.test_client()
    sid = open_session(client, teacher)
    for _ in range(6):
        attempt(client, sid, "Ana", "abcd", ip)

    again = create_app(path, token=TOKEN, now=clock).test_client()
    res = attempt(again, sid, "Ana", current_code(again, teacher, sid), ip)
    assert res.status_code == 429
    assert res.get_json()["error"] == BAN


def test_a_different_ip_in_the_body_or_headers_does_not_change_the_block(client, teacher, app):
    sid = open_session(client, teacher)
    real = "203.0.113.8"
    other = "198.51.100.9"
    headers = {"X-Forwarded-For": other, "CF-Connecting-IP": "198.51.100.10"}
    for _ in range(6):
        res = attempt(
            client,
            sid,
            "Ana",
            "abcd",
            real,
            body={"ip": "198.51.100.11"},
            headers=headers,
        )
    assert res.status_code == 429

    saved = attempt(client, sid, "Ana", current_code(client, teacher, sid), other)
    assert saved.status_code == 201

    still = attempt(
        client,
        sid,
        "Luis",
        current_code(client, teacher, sid),
        real,
        body={"ip": other},
        headers=headers,
    )
    assert still.status_code == 429
    assert still.get_json()["error"] == BAN

    conn = sqlite3.connect(app.config["DB_PATH"])
    try:
        blocked = [row[0] for row in conn.execute("SELECT ip FROM blocked_ips")]
    finally:
        conn.close()
    assert blocked == [real]
