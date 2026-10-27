"""Spec 006: límites, permanencia, limpieza y origen de conexión fiable."""

import sqlite3
from concurrent.futures import ThreadPoolExecutor

import pytest

from app import create_app

NOW = 1_800_000_000.0
TOKEN = "security-test"
HEADERS = {"X-Teacher-Token": TOKEN}


def guard(path, address, instant=NOW):
    from asistencia.usecases.attendance import guard_registration
    return guard_registration(path, address, instant)


def blocked_error():
    from asistencia.domain.registration import AddressBlocked
    return AddressBlocked


@pytest.fixture
def database(tmp_path):
    path = tmp_path / "security.db"
    create_app(path, token=TOKEN)
    return path


def rows(path, table):
    with sqlite3.connect(path) as conn:
        return conn.execute(f"SELECT * FROM {table}").fetchall()


def test_sixth_attempt_blocks_and_other_address_is_independent(database):
    for _ in range(5):
        guard(database, "8.8.8.8")
    with pytest.raises(blocked_error()):
        guard(database, "8.8.8.8")
    guard(database, "1.1.1.1")
    assert rows(database, "blocked_addresses") == [("8.8.8.8",)]


def test_twenty_first_attempt_blocks_even_below_second_limit(database):
    for i in range(20):
        guard(database, "8.8.8.8", NOW + i * 2)
    with pytest.raises(blocked_error()):
        guard(database, "8.8.8.8", NOW + 40)


def test_exact_second_boundary_and_rolling_window(database):
    for _ in range(5):
        guard(database, "8.8.8.8", NOW + .99)
    with pytest.raises(blocked_error()):
        guard(database, "8.8.8.8", NOW + 1.01)
    for _ in range(5):
        guard(database, "1.1.1.1", NOW)
    guard(database, "1.1.1.1", NOW + 1)


def test_exact_minute_boundary_removes_the_oldest_attempt(database):
    for i in range(20):
        guard(database, "8.8.8.8", NOW + i * 2)
    guard(database, "8.8.8.8", NOW + 60)
    assert len(rows(database, "registration_attempts")) == 20
    assert not rows(database, "blocked_addresses")


def test_cleanup_removes_inactive_addresses_but_not_recent_data_or_bans(database):
    for _ in range(5):
        guard(database, "8.8.8.8")
    with pytest.raises(blocked_error()):
        guard(database, "8.8.8.8")
    guard(database, "1.1.1.1", NOW + 30)
    guard(database, "9.9.9.9", NOW + 60)
    assert sorted(rows(database, "registration_attempts")) == [("1.1.1.1", NOW + 30), ("9.9.9.9", NOW + 60)]
    assert rows(database, "blocked_addresses") == [("8.8.8.8",)]


def test_block_survives_time_and_application_restart(database):
    for _ in range(5):
        guard(database, "8.8.8.8")
    with pytest.raises(blocked_error()):
        guard(database, "8.8.8.8")
    create_app(database, token=TOKEN)
    with pytest.raises(blocked_error()):
        guard(database, "8.8.8.8", NOW + 100_000)
    assert not rows(database, "registration_attempts")


@pytest.mark.parametrize("address", [None, "", "not-an-ip"])
def test_unknown_origin_rejects_without_fake_identity_and_still_cleans(database, address):
    from asistencia.domain.registration import OriginUnavailable
    guard(database, "8.8.8.8")
    with pytest.raises(OriginUnavailable):
        guard(database, address, NOW + 60)
    assert not rows(database, "registration_attempts")
    assert not rows(database, "blocked_addresses")


def test_concurrent_connections_cannot_exceed_five(database):
    def attempt(_):
        try:
            guard(database, "8.8.8.8")
            return True
        except blocked_error():
            return False
    with ThreadPoolExecutor(max_workers=8) as pool:
        admitted = list(pool.map(attempt, range(8)))
    assert admitted.count(True) == 5
    assert admitted.count(False) == 3
    assert rows(database, "blocked_addresses") == [("8.8.8.8",)]


def test_direct_mode_ignores_client_supplied_forwarded_headers(database):
    client = create_app(database, token=TOKEN, now=lambda: NOW).test_client()
    for i in range(6):
        response = client.post("/api/s/missing/checkin", json={"ip": f"8.8.8.{i}"}, headers={
            "X-Forwarded-For": f"8.8.8.{i}", "CF-Connecting-IP": f"8.8.4.{i}",
            "X-Real-IP": f"1.1.1.{i}", "Forwarded": f"for=9.9.9.{i}",
        })
        assert response.status_code == (404 if i < 5 else 429)
    assert rows(database, "blocked_addresses") == [("127.0.0.1",)]
    assert "bloqueada" in response.get_json()["error"]
    assert "Retry-After" not in response.headers


@pytest.mark.parametrize("payload", [{}, {"name": "Ana", "code": "bad"}, [1]])
def test_every_registration_attempt_counts_before_session_and_body_validation(database, payload):
    client = create_app(database, token=TOKEN, now=lambda: NOW).test_client()
    for _ in range(5):
        assert client.post("/api/s/missing/checkin", json=payload).status_code == 404
    assert client.post("/api/s/other/checkin", json=payload).status_code == 429
    assert not rows(database, "checkins")


def test_success_duplicates_and_closed_class_all_consume_attempts(database):
    client = create_app(database, token=TOKEN, now=lambda: NOW).test_client()
    sid = client.post("/api/sessions", json={}, headers=HEADERS).get_json()["id"]
    code = client.get(f"/api/sessions/{sid}", headers=HEADERS).get_json()["code"]
    for i in range(5):
        assert client.post(f"/api/s/{sid}/checkin", json={"name": "Ana", "code": code}).status_code == (201 if i == 0 else 200)
    client.post(f"/api/sessions/{sid}/close", headers=HEADERS)
    assert client.post(f"/api/s/{sid}/checkin", json={}).status_code == 429
    assert len(rows(database, "checkins")) == 1


def test_other_routes_keep_working_without_consuming_attempts(database):
    client = create_app(database, token=TOKEN, now=lambda: NOW).test_client()
    sid = client.post("/api/sessions", json={}, headers=HEADERS).get_json()["id"]
    for _ in range(10):
        assert client.get("/").status_code == 200
        assert client.get(f"/api/s/{sid}").status_code == 200
        assert client.get("/api/sessions", headers=HEADERS).status_code == 200
        assert client.get(f"/api/sessions/{sid}", headers=HEADERS).status_code == 200
        assert client.get(f"/api/sessions/{sid}/export", headers=HEADERS).status_code == 200
    assert not rows(database, "registration_attempts")
    for _ in range(5):
        guard(database, "127.0.0.1")
    with pytest.raises(blocked_error()):
        guard(database, "127.0.0.1")
    assert client.get(f"/api/s/{sid}").status_code == 200
    assert client.get(f"/api/sessions/{sid}/export", headers=HEADERS).status_code == 200
    assert client.post(f"/api/sessions/{sid}/close", headers=HEADERS).status_code == 200


@pytest.mark.parametrize("peer,header,expected", [
    ("127.0.0.1", "8.8.8.8", "8.8.8.8"),
    ("::1", "2606:4700:4700::1111", "2606:4700:4700::1111"),
    ("127.0.0.1", "::ffff:8.8.8.8", "8.8.8.8"),
    ("8.8.8.8", "1.1.1.1", None),
    ("127.0.0.1", "127.0.0.2", None),
    ("127.0.0.1", "8.8.8.8, 1.1.1.1", None),
    ("127.0.0.1", "", None),
    (None, "8.8.8.8", None),
])
def test_tunnel_origin_requires_local_connector_and_one_global_address(peer, header, expected):
    from asistencia.origin import registration_origin
    assert registration_origin(peer, header, trust_cloudflare=True) == expected


def test_tunnel_mode_is_explicit_and_rejects_missing_origin(database):
    app = create_app(database, token=TOKEN, now=lambda: NOW, trust_cloudflare=True)
    client = app.test_client()
    assert client.post("/api/s/missing/checkin", json={}).status_code == 403
    assert client.post("/api/s/missing/checkin", json={}, headers={"CF-Connecting-IP": "8.8.8.8"}).status_code == 404
    assert client.post("/api/s/missing/checkin", json={}, headers={"CF-Connecting-IP": "1.1.1.1"}, environ_overrides={"REMOTE_ADDR": "8.8.8.8"}).status_code == 403
    assert rows(database, "registration_attempts") == [("8.8.8.8", NOW)]


def test_direct_origin_normalizes_equivalent_ip_addresses():
    from asistencia.origin import registration_origin
    assert registration_origin("::ffff:127.0.0.1", "8.8.8.8") == "127.0.0.1"
    assert registration_origin("bad", "8.8.8.8") is None


def test_closed_class_attempts_are_counted_even_without_a_successful_registration(database):
    client = create_app(database, token=TOKEN, now=lambda: NOW).test_client()
    sid = client.post("/api/sessions", json={}, headers=HEADERS).get_json()["id"]
    client.post(f"/api/sessions/{sid}/close", headers=HEADERS)
    for _ in range(5):
        assert client.post(f"/api/s/{sid}/checkin", json={}).status_code == 409
    assert client.post(f"/api/s/{sid}/checkin", json={}).status_code == 429
    assert not rows(database, "checkins")


def test_invalid_name_and_code_count_for_an_open_class(database):
    client = create_app(database, token=TOKEN, now=lambda: NOW).test_client()
    sid = client.post("/api/sessions", json={}, headers=HEADERS).get_json()["id"]
    for i in range(5):
        response = client.post(f"/api/s/{sid}/checkin", json={"name": "" if i % 2 else "Ana", "code": "bad"})
        assert response.status_code == (400 if i % 2 else 422)
    assert client.post(f"/api/s/{sid}/checkin", json={}).status_code == 429
    assert not rows(database, "checkins")


def test_unknown_http_origin_does_not_create_attendance_or_a_ban(database):
    client = create_app(database, token=TOKEN).test_client()
    response = client.post("/api/s/missing/checkin", json={}, environ_overrides={"REMOTE_ADDR": "bad"})
    assert response.status_code == 403
    assert "origen" in response.get_json()["error"]
    assert not rows(database, "blocked_addresses")
    assert not rows(database, "registration_attempts")


def test_security_storage_failure_rolls_back_without_admitting_attempt(database, monkeypatch):
    from asistencia.storage import sqlite as storage
    original = storage.insert_registration_attempt

    def fail(conn, address, instant):
        original(conn, address, instant)
        raise sqlite3.OperationalError("controlled failure")

    monkeypatch.setattr(storage, "insert_registration_attempt", fail)
    with pytest.raises(sqlite3.OperationalError):
        guard(database, "8.8.8.8")
    assert not rows(database, "registration_attempts")
    # A fresh connection can acquire the write lock: the failed action released it.
    with sqlite3.connect(database, timeout=.1) as conn:
        conn.execute("BEGIN IMMEDIATE")
        conn.rollback()


@pytest.mark.parametrize("tunnel", [False, True])
def test_main_enables_trusted_origin_only_with_tunnel(tmp_path, monkeypatch, tunnel):
    import app as entry
    from types import SimpleNamespace
    options = {}
    terminated = []

    def fake_create(**kwargs):
        options.update(kwargs)
        return SimpleNamespace(config={"TEACHER_TOKEN": TOKEN}, run=lambda **kwargs: None)

    monkeypatch.setattr(entry, "create_app", fake_create)
    monkeypatch.setattr(entry, "port_in_use", lambda port: False)
    monkeypatch.setattr(entry, "DEFAULT_DB", tmp_path / "data" / "attendance.db")
    monkeypatch.setattr(entry, "start_tunnel", lambda port: (SimpleNamespace(terminate=lambda: terminated.append(True)), "https://example.invalid"))
    monkeypatch.setattr(entry.sys, "argv", ["app.py"] + (["--tunel"] if tunnel else []))
    entry.main()
    assert options == {"trust_cloudflare": tunnel}
    assert terminated == ([True] if tunnel else [])


def test_006_privacy_and_layer_boundaries():
    import ast
    from pathlib import Path
    root = Path(__file__).resolve().parents[1]
    constitution = (root / "docs/CONSTITUTION.md").read_text()
    assert "Versión 4.1" in constitution
    assert "no se asocian a nombres, clases ni registros" in constitution
    assert "Las clases normales conservan los límites de cinco intentos" in constitution
    assert "con bloqueo permanente de 006" in constitution
    tree = ast.parse((root / "asistencia/domain/registration.py").read_text())
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            assert not any(a.name.startswith(("sqlite3", "flask", "asistencia.storage")) for a in node.names)
        if isinstance(node, ast.ImportFrom):
            assert not (node.module or "").startswith(("flask", "asistencia.storage", "asistencia.usecases"))
