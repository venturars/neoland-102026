"""Límite de códigos fallados por IP. Spec 006 CA-01 a CA-07 y spec 008 CA-01 a CA-07."""

import sqlite3

from app import client_ip, create_app
from asistencia.domain.attempts import BAN_SECONDS
from asistencia.storage import sqlite as storage
from tests.conftest import TOKEN

BAN = (
    "Esta dirección queda bloqueada 10 minutos por fallar el código demasiadas veces. "
    "Espera y pide el código actual al profesor."
)


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


def test_correct_codes_never_count(client, teacher, clock):  # 008 CA-01
    sid = open_session(client, teacher)
    ip = "203.0.113.60"
    for i in range(25):
        res = attempt(client, sid, f"Alumno {i}", current_code(client, teacher, sid), ip)
        assert res.status_code == 201
        clock.advance(0.1)
    assert client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["total"] == 25


def test_a_correct_code_after_five_failures_is_saved(client, teacher):  # 008 CA-01
    sid = open_session(client, teacher)
    ip = "203.0.113.61"
    for _ in range(5):
        assert attempt(client, sid, "Ana", "abcd", ip).status_code == 422
    res = attempt(client, sid, "Ana", current_code(client, teacher, sid), ip)
    assert res.status_code == 201


def test_the_block_expires_after_ten_minutes(client, teacher, clock):  # 008 CA-03
    sid = open_session(client, teacher)
    ip = "203.0.113.70"
    for _ in range(6):
        attempt(client, sid, "Ana", "abcd", ip)

    clock.advance(BAN_SECONDS - 1)
    res = attempt(client, sid, "Ana", current_code(client, teacher, sid), ip)
    assert res.status_code == 429

    clock.advance(2)
    res = attempt(client, sid, "Ana", current_code(client, teacher, sid), ip)
    assert res.status_code == 201


def test_an_old_permanent_block_is_lifted(client, teacher, app):  # 008 CA-07
    # Un bloqueo "para siempre" de la spec 006, de hace meses.
    storage.block_ip(app.config["DB_PATH"], "127.0.0.1", "2026-10-23T09:00:00.000+00:00")
    sid = open_session(client, teacher)
    res = attempt(client, sid, "Ana", current_code(client, teacher, sid), "127.0.0.1")
    assert res.status_code == 201
    assert storage.is_ip_blocked(app.config["DB_PATH"], "127.0.0.1") is False


def test_behind_the_tunnel_each_student_has_their_own_ip(tmp_path, clock, teacher):  # 008 CA-05
    client = create_app(tmp_path / "tunel.db", token=TOKEN, now=clock, tunnel=True).test_client()
    sid = open_session(client, teacher)
    cheater = {"CF-Connecting-IP": "198.51.100.1"}
    for _ in range(6):
        res = attempt(client, sid, "Ana", "abcd", "127.0.0.1", headers=cheater)
    assert res.status_code == 429

    other = attempt(
        client,
        sid,
        "Luis",
        current_code(client, teacher, sid),
        "127.0.0.1",
        headers={"CF-Connecting-IP": "198.51.100.2"},
    )
    assert other.status_code == 201

    again = attempt(client, sid, "Ana", current_code(client, teacher, sid), "127.0.0.1", headers=cheater)
    assert again.status_code == 429


def test_client_ip_ignores_the_header_without_tunnel():  # 008 CA-06
    assert client_ip("127.0.0.1", "198.51.100.1", False) == "127.0.0.1"


def test_client_ip_uses_the_header_behind_the_tunnel():  # 008 CA-05
    assert client_ip("127.0.0.1", " 198.51.100.1 ", True) == "198.51.100.1"
    assert client_ip("::1", "2001:db8::1", True) == "2001:db8::1"


def test_client_ip_ignores_a_bad_header_or_a_remote_connection():  # 008 CA-06
    assert client_ip("127.0.0.1", "no-es-una-ip", True) == "127.0.0.1"
    assert client_ip("127.0.0.1", None, True) == "127.0.0.1"
    assert client_ip("203.0.113.9", "198.51.100.1", True) == "203.0.113.9"
    assert client_ip(None, None, True) == ""
