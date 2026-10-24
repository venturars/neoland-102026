"""Tests API rate limit por IP (spec 006)."""

from asistencia.infra.sqlite import connect

from test_api import INVALID_CODE, current_code, open_session

BLOCKED = (
    "Demasiados intentos incorrectos. Tu conexión quedó bloqueada. "
    "Pide al profesor que te desbloquee."
)

TEST_IP = "198.51.100.42"
OTHER_IP = "198.51.100.99"


def post_checkin(client, sid, name, code, ip=TEST_IP):
    return client.post(
        f"/api/s/{sid}/checkin",
        json={"name": name, "code": code},
        environ_base={"REMOTE_ADDR": ip},
    )


def test_sixth_invalid_code_in_one_second_blocks(client, teacher):
    sid = open_session(client, teacher)
    for _ in range(5):
        res = post_checkin(client, sid, "Ana", "0000")
        assert res.status_code == 422
        assert res.get_json()["error"] == INVALID_CODE
    res = post_checkin(client, sid, "Ana", "0000")
    assert res.status_code == 429
    assert res.get_json()["error"] == BLOCKED


def test_blocked_ip_rejects_valid_code(client, teacher):
    sid = open_session(client, teacher)
    for _ in range(6):
        post_checkin(client, sid, "Ana", "0000")
    code = current_code(client, teacher, sid)
    res = post_checkin(client, sid, "Ana", code)
    assert res.status_code == 429
    assert res.get_json()["error"] == BLOCKED


def test_valid_check_in_does_not_count_as_invalid(client, teacher):
    sid = open_session(client, teacher)
    code = current_code(client, teacher, sid)
    res = post_checkin(client, sid, "Ana", code)
    assert res.status_code == 201
    for _ in range(5):
        assert post_checkin(client, sid, "Luis", "0000").status_code == 422
    res = post_checkin(client, sid, "Luis", code)
    assert res.status_code == 201


def test_invalid_name_does_not_increment_invalid_attempts(client, teacher):
    sid = open_session(client, teacher)
    for _ in range(6):
        res = client.post(
            f"/api/s/{sid}/checkin",
            json={"name": "", "code": "0000"},
            environ_base={"REMOTE_ADDR": TEST_IP},
        )
        assert res.status_code == 400
    res = post_checkin(client, sid, "Ana", "0000")
    assert res.status_code == 422


def test_teacher_lists_and_unblocks_ips(client, teacher):
    sid = open_session(client, teacher)
    for _ in range(6):
        post_checkin(client, sid, "Ana", "0000", ip=TEST_IP)
    listed = client.get("/api/blocked-ips", headers=teacher).get_json()
    assert len(listed) == 1
    assert listed[0]["ip"] == TEST_IP
    assert "blockedAt" in listed[0]

    assert client.delete(f"/api/blocked-ips/{TEST_IP}", headers=teacher).status_code == 200
    assert client.get("/api/blocked-ips", headers=teacher).get_json() == []

    code = current_code(client, teacher, sid)
    assert post_checkin(client, sid, "Ana", code).status_code == 201


def test_teacher_unblock_all(client, teacher):
    sid = open_session(client, teacher)
    for _ in range(6):
        post_checkin(client, sid, "A", "0000", ip=TEST_IP)
    for _ in range(6):
        post_checkin(client, sid, "B", "0000", ip=OTHER_IP)
    res = client.delete("/api/blocked-ips", headers=teacher)
    assert res.status_code == 200
    assert res.get_json()["removed"] == 2


def test_blocked_ips_require_teacher_token(client):
    assert client.get("/api/blocked-ips").status_code == 401
    assert client.delete("/api/blocked-ips").status_code == 401


def test_purge_drops_expired_attempt_rows(client, teacher, clock, tmp_path):
    sid = open_session(client, teacher)
    for _ in range(3):
        post_checkin(client, sid, "Ana", "0000")
    clock.advance(61)
    post_checkin(client, sid, "Ana", "0000")
    conn = connect(tmp_path / "test.db")
    count = conn.execute("SELECT COUNT(*) AS n FROM invalid_code_attempts").fetchone()["n"]
    conn.close()
    assert count == 1


def test_twenty_first_invalid_in_minute_blocks(client, teacher, clock):
    sid = open_session(client, teacher)
    for i in range(20):
        clock.advance(2)
        res = post_checkin(client, sid, f"Alumno{i}", "0000")
        assert res.status_code == 422
    res = post_checkin(client, sid, "Ultimo", "0000")
    assert res.status_code == 429
    assert res.get_json()["error"] == BLOCKED
