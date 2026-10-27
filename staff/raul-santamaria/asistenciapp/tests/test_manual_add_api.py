"""API: añadir check-in a mano. CA-01, CA-02, CA-03, CA-05, CA-07."""

from asistencia.domain.names import MAX_LENGTH
from tests.test_api import open_session


def test_add_manual_requires_teacher_token(client):
    res = client.post("/api/sessions/abc/checkins", json={"name": "Ana"})
    assert res.status_code == 401
    assert "error" in res.get_json()


def test_add_manual_rejects_false_token(client):
    res = client.post(
        "/api/sessions/abc/checkins",
        json={"name": "Ana"},
        headers={"X-Teacher-Token": "token-falso"},
    )
    assert res.status_code == 401


def test_add_manual_on_open_session(client, teacher):
    sid = open_session(client, teacher)
    res = client.post(
        f"/api/sessions/{sid}/checkins",
        json={"name": "Ana García"},
        headers=teacher,
    )
    assert res.status_code == 201
    body = res.get_json()
    assert body["name"] == "Ana García"
    assert "checkedAt" in body

    detail = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert detail["total"] == 1
    assert detail["checkins"][0]["name"] == "Ana García"


def test_add_manual_on_closed_session(client, teacher):
    sid = open_session(client, teacher)
    assert client.post(f"/api/sessions/{sid}/close", headers=teacher).status_code == 200
    res = client.post(
        f"/api/sessions/{sid}/checkins",
        json={"name": "Luis"},
        headers=teacher,
    )
    assert res.status_code == 201
    assert res.get_json()["name"] == "Luis"


def test_add_manual_duplicate(client, teacher):
    sid = open_session(client, teacher)
    first = client.post(
        f"/api/sessions/{sid}/checkins",
        json={"name": "Ana García"},
        headers=teacher,
    )
    second = client.post(
        f"/api/sessions/{sid}/checkins",
        json={"name": "ana garcia"},
        headers=teacher,
    )
    assert first.status_code == 201
    assert second.status_code == 200
    body = second.get_json()
    assert body["already"] is True
    assert body["name"] == "Ana García"

    detail = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert detail["total"] == 1


def test_add_manual_invalid_name(client, teacher):
    sid = open_session(client, teacher)
    empty = client.post(
        f"/api/sessions/{sid}/checkins",
        json={"name": "  "},
        headers=teacher,
    )
    long = client.post(
        f"/api/sessions/{sid}/checkins",
        json={"name": "a" * (MAX_LENGTH + 1)},
        headers=teacher,
    )
    assert empty.status_code == 400
    assert "nombre" in empty.get_json()["error"].lower()
    assert long.status_code == 400
    assert str(MAX_LENGTH) in long.get_json()["error"]
