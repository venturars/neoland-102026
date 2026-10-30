"""Tests de la mayúscula inicial en las listas del profesor · spec 007 v1.3, RF-7b, CA-22."""

import pytest


@pytest.fixture
def group(client, teacher):
    """Grupo «SDD» creado con «ana lópez» escrito en minúscula."""
    res = client.post("/api/groups", json={"name": "SDD", "students": ["ana lópez"]}, headers=teacher)
    assert res.status_code == 201, res.get_json()
    return res.get_json()


def names_of(client, teacher, gid):
    return [s["name"] for s in client.get(f"/api/groups/{gid}", headers=teacher).get_json()["students"]]


def code_of(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]


# ---------- listas del profesor: con mayúscula ----------

def test_create_group_capitalizes(group):  # CA-22
    assert [s["name"] for s in group["students"]] == ["Ana López"]


def test_add_students_capitalizes(client, teacher, group):  # CA-22
    res = client.post(f"/api/groups/{group['id']}/students", json={"names": ["luis de la rosa"]}, headers=teacher)
    assert res.status_code == 201, res.get_json()
    assert names_of(client, teacher, group["id"]) == ["Ana López", "Luis de la Rosa"]


def test_rename_student_capitalizes(client, teacher, group):  # CA-22
    sid = group["students"][0]["id"]
    res = client.patch(f"/api/groups/{group['id']}/students/{sid}", json={"name": "luis"}, headers=teacher)
    assert res.status_code == 200, res.get_json()
    assert names_of(client, teacher, group["id"]) == ["Luis"]


def test_preview_capitalizes_students_but_not_duplicates(client, teacher):  # CA-22, CA-02
    data = client.post(
        "/api/groups/preview", json={"text": "maría de la fuente\nMARIA DE LA FUENTE", "source": "paste"},
        headers=teacher,
    ).get_json()
    assert data["students"] == ["María de la Fuente"]
    assert data["duplicates"] == ["MARIA DE LA FUENTE"]


# ---------- lo que escriben los alumnos: tal cual ----------

def test_quick_session_keeps_the_name_as_typed(client, teacher):  # CA-22, RF-22
    sid = client.post("/api/sessions", json={"title": "Rápida"}, headers=teacher).get_json()["id"]
    res = client.post(f"/api/s/{sid}/checkin", json={"name": "ana", "code": code_of(client, teacher, sid)})
    assert res.status_code == 201, res.get_json()
    view = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert [c["name"] for c in view["checkins"]] == ["ana"]


def test_newcomer_keeps_the_name_as_typed(client, teacher, group):  # CA-22
    sid = client.post("/api/sessions", json={"title": "Clase", "groupId": group["id"]}, headers=teacher).get_json()["id"]
    p = client.post(f"/api/s/{sid}/unlock", json={"code": code_of(client, teacher, sid)}).get_json()["pass"]
    res = client.post(f"/api/s/{sid}/checkin", json={"pass": p, "name": "ella g.", "isNew": True})
    assert res.status_code == 201, res.get_json()
    view = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()
    assert [n["name"] for n in view["newcomers"]] == ["ella g."]
