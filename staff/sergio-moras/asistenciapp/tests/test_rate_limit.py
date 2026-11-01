"""Tests del límite de intentos por IP en la API · spec 006."""

import sqlite3

import pytest

from app import create_app
from conftest import TOKEN

BLOCKED = "Esta conexión ha quedado bloqueada por demasiados intentos de registro. Habla con el profesor."


def open_session(client, teacher):
    res = client.post("/api/sessions", json={"title": "Clase"}, headers=teacher)
    return res.get_json()["id"]


def current_code(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


def attempt(client, sid, code, name="Ana", **kwargs):
    return client.post(f"/api/s/{sid}/checkin", json={"name": name, "code": code}, **kwargs)


def assert_blocked(res):
    assert res.status_code == 429
    assert res.get_json() == {"error": BLOCKED}


# ---------- El límite (CA-01, CA-02, CA-04) ----------

def test_sixth_attempt_in_the_same_second_is_blocked(client, teacher):
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    assert attempt(client, sid, code).status_code == 201
    for _ in range(4):
        assert attempt(client, sid, "0000" if code != "0000" else "1111").status_code == 422
    assert_blocked(attempt(client, sid, code, name="Luis"))


def test_twenty_first_attempt_in_a_minute_is_blocked(client, teacher, clock):
    sid = open_session(client, teacher)
    for _ in range(20):
        assert attempt(client, sid, "abcd").status_code == 422
        clock.advance(2.5)
    assert_blocked(attempt(client, sid, "abcd"))


def test_attempts_to_a_missing_class_also_count(client):
    for _ in range(5):
        assert attempt(client, "no-existe", "1234").status_code == 404
    assert_blocked(attempt(client, "no-existe", "1234"))


def test_other_routes_do_not_count(client, teacher):  # CA-03
    sid = open_session(client, teacher)
    for _ in range(30):
        client.get("/")
        client.get(f"/api/s/{sid}")
        client.get(f"/api/sessions/{sid}", headers=teacher)
    assert attempt(client, sid, current_code(client, teacher, sid)).status_code == 201


# ---------- El bloqueo (CA-05, CA-06) ----------

def block(client, sid):
    for _ in range(6):
        attempt(client, sid, "abcd")


def test_blocked_ip_stays_blocked_everywhere(client, teacher, clock):
    block(client, open_session(client, teacher))
    other = open_session(client, teacher)
    assert_blocked(attempt(client, other, current_code(client, teacher, other)))
    clock.advance(24 * 3600)
    other = open_session(client, teacher)
    assert_blocked(attempt(client, other, current_code(client, teacher, other)))


def test_block_survives_a_restart(tmp_path, clock, teacher):
    db = tmp_path / "persistente.db"
    first = create_app(db, token=TOKEN, now=clock).test_client()
    block(first, open_session(first, teacher))

    second = create_app(db, token=TOKEN, now=clock).test_client()
    sid = open_session(second, teacher)
    assert_blocked(attempt(second, sid, current_code(second, teacher, sid)))


# ---------- Qué IP se cuenta (CA-08, CA-09) ----------

def test_without_tunnel_forwarding_headers_are_ignored(client, teacher):
    sid = open_session(client, teacher)
    for i in range(5):
        headers = {"CF-Connecting-IP": f"203.0.113.{i}", "X-Forwarded-For": f"198.51.100.{i}"}
        assert attempt(client, sid, "abcd", headers=headers).status_code == 422
    assert_blocked(attempt(client, sid, "abcd", headers={"CF-Connecting-IP": "203.0.113.99"}))


@pytest.fixture
def tunnel_client(tmp_path, clock):
    return create_app(tmp_path / "tunel.db", token=TOKEN, now=clock, behind_tunnel=True).test_client()


def test_through_tunnel_each_public_ip_has_its_own_counter(tunnel_client, teacher):
    sid = open_session(tunnel_client, teacher)
    for _ in range(5):
        for ip in ("203.0.113.1", "203.0.113.2"):
            res = attempt(tunnel_client, sid, "abcd", headers={"CF-Connecting-IP": ip})
            assert res.status_code == 422
    assert_blocked(attempt(tunnel_client, sid, "abcd", headers={"CF-Connecting-IP": "203.0.113.1"}))
    code = current_code(tunnel_client, teacher, sid)
    ok = attempt(tunnel_client, sid, code, headers={"CF-Connecting-IP": "203.0.113.3"})
    assert ok.status_code == 201


def test_through_tunnel_x_forwarded_for_and_invalid_values_are_ignored(tunnel_client, teacher):
    sid = open_session(tunnel_client, teacher)
    for i in range(5):
        headers = {"CF-Connecting-IP": "no-es-una-ip", "X-Forwarded-For": f"198.51.100.{i}"}
        assert attempt(tunnel_client, sid, "abcd", headers=headers).status_code == 422
    assert_blocked(attempt(tunnel_client, sid, "abcd"))  # todos contaron como la conexión local


def test_through_tunnel_header_only_trusted_from_the_local_connection(tunnel_client, teacher):
    sid = open_session(tunnel_client, teacher)
    outside = {"environ_base": {"REMOTE_ADDR": "198.51.100.7"}}
    for i in range(5):
        res = attempt(tunnel_client, sid, "abcd", headers={"CF-Connecting-IP": f"203.0.113.{i}"}, **outside)
        assert res.status_code == 422
    assert_blocked(attempt(tunnel_client, sid, "abcd", **outside))


# ---------- Privacidad (CA-11) ----------

def test_checkins_and_csv_have_no_ip(tmp_path, clock, teacher):
    db = tmp_path / "privacidad.db"
    client = create_app(db, token=TOKEN, now=clock).test_client()
    sid = open_session(client, teacher)
    assert attempt(client, sid, current_code(client, teacher, sid)).status_code == 201

    with sqlite3.connect(db) as conn:
        columns = [row[1] for row in conn.execute("PRAGMA table_info(checkins)")]
    assert columns == ["id", "session_id", "name", "name_key", "checked_at"]

    csv_text = client.get(f"/api/sessions/{sid}/export", headers=teacher).get_data(as_text=True)
    assert "127.0.0.1" not in csv_text
