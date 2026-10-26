"""Control de intentos por dirección de conexión: CA-01 a CA-08 de la 006."""

import sqlite3

import pytest

from app import create_app
from asistencia.storage import sqlite as store
from tests.conftest import TOKEN

IP = "203.0.113.6"
OTHER = "198.51.100.7"
MESSAGE = "Esta dirección queda bloqueada por haber superado los intentos permitidos."


def session(client, teacher):
    response = client.post("/api/sessions", json={"title": "Límites"}, headers=teacher)
    assert response.status_code == 201
    sid = response.json["id"]
    code = client.get(f"/api/sessions/{sid}", headers=teacher).json["code"]
    return sid, code


def attempt(client, sid, code="bad", name="Ana", ip=IP, **kwargs):
    return client.post(f"/api/s/{sid}/checkin", json={"name": name, "code": code},
                       environ_overrides={"REMOTE_ADDR": ip}, **kwargs)


def assert_banned(response):
    assert response.status_code == 429
    assert response.json == {"error": MESSAGE}


def test_five_allowed_sixth_bans_without_creating_attendance(client, teacher, tmp_path):
    sid, code = session(client, teacher)
    for _ in range(5):
        assert attempt(client, sid).status_code == 422
    assert_banned(attempt(client, sid, code))
    assert client.get(f"/api/sessions/{sid}", headers=teacher).json["total"] == 0
    assert store.is_ip_blocked(tmp_path / "test.db", IP)


def test_twenty_allowed_twenty_first_bans(client, teacher, clock, tmp_path):
    sid, _ = session(client, teacher)
    for _ in range(20):
        assert attempt(client, sid).status_code == 422
        clock.advance(2)
    assert_banned(attempt(client, sid))
    assert store.is_ip_blocked(tmp_path / "test.db", IP)


@pytest.mark.parametrize("interval,repeats,boundary", [(0.0, 5, 1.0), (2.0, 20, 60.0)])
@pytest.mark.parametrize("offset,expected", [(0.0, 429), (0.125, 422)])
def test_sliding_windows_include_exact_boundary(client, teacher, clock, interval, repeats, boundary, offset, expected):
    sid, _ = session(client, teacher)
    start = clock.t
    for _ in range(repeats):
        assert attempt(client, sid).status_code == 422
        clock.advance(interval)
    clock.t = start + boundary + offset
    response = attempt(client, sid)
    assert response.status_code == expected
    if expected == 429:
        assert_banned(response)


@pytest.mark.parametrize("kind,status", [("code", 422), ("name", 400), ("missing", 404), ("closed", 409)])
def test_failed_registration_attempts_count(client, teacher, kind, status):
    sid, code = session(client, teacher)
    if kind == "missing":
        sid = "missing-class"
    if kind == "closed":
        client.post(f"/api/sessions/{sid}/close", headers=teacher)
    for _ in range(5):
        assert attempt(client, sid, code="bad" if kind == "code" else code,
                       name="" if kind == "name" else "Ana").status_code == status
    assert_banned(attempt(client, sid, code))


def test_valid_duplicate_and_other_ip_behave_normally(client, teacher):
    sid, code = session(client, teacher)
    first = attempt(client, sid, code)
    assert first.status_code == 201
    duplicate = attempt(client, sid, code, name=" ANA ")
    assert duplicate.status_code == 200
    assert duplicate.json == {"already": True, **first.json}
    assert attempt(client, sid, code, name="Luis", ip=OTHER).status_code == 201


def test_reading_pages_and_teacher_operations_do_not_count(client, teacher, tmp_path):
    sid, code = session(client, teacher)
    for _ in range(25):
        for path in ["/", "/alumno.html", f"/api/s/{sid}", "/api/sessions", f"/api/sessions/{sid}"]:
            assert client.get(path, headers=teacher, environ_overrides={"REMOTE_ADDR": IP}).status_code == 200
    assert store.count_registration_attempts(tmp_path / "test.db", IP, 0) == 0
    assert attempt(client, sid, code).status_code == 201


def test_limit_and_blacklist_apply_across_classes(client, teacher, tmp_path):
    first, _ = session(client, teacher)
    second, code = session(client, teacher)
    for index in range(5):
        assert attempt(client, first if index % 2 else second).status_code == 422
    assert_banned(attempt(client, first))
    assert_banned(attempt(client, second, code))
    assert store.count_registration_attempts(tmp_path / "test.db", IP, 0) == 6
    assert attempt(client, second, code, ip=OTHER).status_code == 201


def test_permanent_blacklist_survives_restarting_app(client, teacher, clock, tmp_path):
    sid, _ = session(client, teacher)
    for _ in range(6):
        attempt(client, sid)
    clock.advance(365 * 24 * 3600)
    again = create_app(tmp_path / "test.db", token=TOKEN, now=clock).test_client()
    code = again.get(f"/api/sessions/{sid}", headers=teacher).json["code"]
    assert_banned(attempt(again, sid, code))
    assert attempt(again, sid, code, ip=OTHER).status_code == 201
    assert store.count_registration_attempts(tmp_path / "test.db", IP, 0) == 0  # poda por OTHER
    assert store.is_ip_blocked(tmp_path / "test.db", IP)


def test_body_and_forwarding_headers_cannot_change_identity(client, teacher, tmp_path):
    sid, code = session(client, teacher)
    for _ in range(6):
        response = client.post(f"/api/s/{sid}/checkin", json={"name": "Ana", "code": "bad", "ip": OTHER},
                               headers={"X-Forwarded-For": OTHER, "CF-Connecting-IP": OTHER},
                               environ_overrides={"REMOTE_ADDR": IP})
    assert_banned(response)
    assert_banned(attempt(client, sid, code, headers={"X-Forwarded-For": OTHER}))
    assert attempt(client, sid, code, ip=OTHER).status_code == 201
    with sqlite3.connect(tmp_path / "test.db") as conn:
        assert conn.execute("SELECT ip FROM blocked_ips").fetchall() == [(IP,)]


def test_tunnel_clients_with_same_remote_addr_share_limit(client, teacher):
    sid, code = session(client, teacher)
    for index in range(5):
        assert attempt(client, sid, ip="127.0.0.1", headers={"CF-Connecting-IP": f"203.0.113.{index}"}).status_code == 422
    assert_banned(attempt(client, sid, code, ip="127.0.0.1", headers={"CF-Connecting-IP": OTHER}))
