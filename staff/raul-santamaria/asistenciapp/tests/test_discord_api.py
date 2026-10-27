"""API: activar Discord en una sesión. CA-01, CA-02."""

from tests.test_api import open_session


def test_enable_discord_requires_teacher_token(client):
    res = client.post("/api/sessions/abc/discord")
    assert res.status_code == 401
    assert "error" in res.get_json()


def test_enable_discord_rejects_false_token(client):
    res = client.post(
        "/api/sessions/abc/discord",
        headers={"X-Teacher-Token": "token-falso"},
    )
    assert res.status_code == 401


def test_enable_discord_on_open_session(client, teacher):
    sid = open_session(client, teacher)
    res = client.post(f"/api/sessions/{sid}/discord", headers=teacher)
    assert res.status_code == 200
    assert res.get_json().get("ok") is True

    detail = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert detail["discordEnabled"] is True


def test_enable_discord_on_closed_session(client, teacher):
    sid = open_session(client, teacher)
    assert client.post(f"/api/sessions/{sid}/close", headers=teacher).status_code == 200
    res = client.post(f"/api/sessions/{sid}/discord", headers=teacher)
    assert res.status_code == 409
    assert "error" in res.get_json()


def test_enable_discord_unknown_session(client, teacher):
    res = client.post("/api/sessions/no-existe/discord", headers=teacher)
    assert res.status_code == 404
