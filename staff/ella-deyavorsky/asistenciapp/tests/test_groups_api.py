"""Tests de la API de grupos y de las sesiones con grupo · spec 007."""

import pytest

NAMES_25 = [f"Alumno {i:02d}" for i in range(1, 26)]


def create_group(client, teacher, name="SDD 2º A", students=("Ana García", "Luis Pérez")):
    res = client.post("/api/groups", json={"name": name, "students": list(students)}, headers=teacher)
    assert res.status_code == 201, res.get_json()
    return res.get_json()


def group_detail(client, teacher, gid):
    return client.get(f"/api/groups/{gid}", headers=teacher).get_json()


# ---------- acceso del profesor ----------

@pytest.mark.parametrize(
    "method, path",
    [("get", "/api/groups"), ("post", "/api/groups"), ("post", "/api/groups/preview"),
     ("get", "/api/groups/abc"), ("patch", "/api/groups/abc"), ("delete", "/api/groups/abc")],
)
def test_group_routes_require_token(client, method, path):
    assert getattr(client, method)(path).status_code == 401


# ---------- vista previa (CA-01, CA-02) ----------

def test_preview_of_25_pasted_names(client, teacher):  # CA-01
    res = client.post(
        "/api/groups/preview", json={"text": "\n".join(NAMES_25), "source": "paste"}, headers=teacher
    )
    data = res.get_json()
    assert res.status_code == 200
    assert len(data["students"]) == 25 and data["canSave"]


def test_preview_of_csv_with_duplicate_cannot_be_saved(client, teacher):  # CA-02
    text = "Nombre;Email\nMaría García;m@x.es\nmaria  GARCIA;m2@x.es\n"
    data = client.post("/api/groups/preview", json={"text": text, "source": "csv"}, headers=teacher).get_json()
    assert data["duplicates"] == ["maria  GARCIA"]
    assert not data["canSave"]


def test_preview_against_saved_group(client, teacher):  # CA-02
    group = create_group(client, teacher)
    data = client.post(
        "/api/groups/preview", json={"text": "ANA GARCÍA", "source": "paste", "groupId": group["id"]},
        headers=teacher,
    ).get_json()
    assert data["duplicates"] == ["ANA GARCÍA"]


# ---------- crear, listar y editar (CA-01, CA-02, CA-13) ----------

def test_create_group_with_25_students(client, teacher):  # CA-01
    group = create_group(client, teacher, students=NAMES_25)
    assert len(group["students"]) == 25


def test_create_group_with_duplicate_is_rejected(client, teacher):  # CA-02
    res = client.post("/api/groups", json={"name": "SDD", "students": ["Ana", "ANA"]}, headers=teacher)
    assert res.status_code == 409
    assert client.get("/api/groups", headers=teacher).get_json() == []


def test_create_group_needs_a_name(client, teacher):
    res = client.post("/api/groups", json={"name": "  ", "students": []}, headers=teacher)
    assert res.status_code == 400


def test_empty_group_can_be_saved(client, teacher):  # RF-8b
    assert create_group(client, teacher, students=())["students"] == []


def test_list_two_groups_and_edit_one(client, teacher):  # CA-13
    a = create_group(client, teacher, "SDD 2º A")
    create_group(client, teacher, "SDD 2º B", ["Marta"])
    listed = client.get("/api/groups", headers=teacher).get_json()
    assert [(g["name"], g["students"]) for g in listed] == [("SDD 2º A", 2), ("SDD 2º B", 1)]

    gid = a["id"]
    assert client.patch(f"/api/groups/{gid}", json={"name": "SDD 2º C"}, headers=teacher).status_code == 200
    res = client.post(f"/api/groups/{gid}/students", json={"names": ["Zoe"]}, headers=teacher)
    assert res.status_code == 201
    students = group_detail(client, teacher, gid)["students"]
    luis = next(s for s in students if s["name"] == "Luis Pérez")
    ana = next(s for s in students if s["name"] == "Ana García")
    assert client.patch(
        f"/api/groups/{gid}/students/{luis['id']}", json={"name": "Luis Pérez Gil"}, headers=teacher
    ).status_code == 200
    assert client.delete(f"/api/groups/{gid}/students/{ana['id']}", headers=teacher).status_code == 200

    detail = group_detail(client, teacher, gid)
    assert detail["name"] == "SDD 2º C"
    assert [s["name"] for s in detail["students"]] == ["Luis Pérez Gil", "Zoe"]


def test_adding_or_renaming_to_an_existing_name_is_rejected(client, teacher):  # RF-7
    group = create_group(client, teacher)
    gid = group["id"]
    res = client.post(f"/api/groups/{gid}/students", json={"names": ["luis perez"]}, headers=teacher)
    assert res.status_code == 409
    ana = next(s for s in group["students"] if s["name"] == "Ana García")
    res = client.patch(f"/api/groups/{gid}/students/{ana['id']}", json={"name": "LUIS PÉREZ"}, headers=teacher)
    assert res.status_code == 409


def test_similar_names_are_warned_not_rejected(client, teacher):  # RF-14 para el profesor
    group = create_group(client, teacher, students=["Ella García"])
    res = client.post(f"/api/groups/{group['id']}/students", json={"names": ["Ella G."]}, headers=teacher)
    assert res.status_code == 201
    assert res.get_json()["similar"] == [{"name": "Ella G.", "like": "Ella García"}]


def test_unknown_group_or_student_is_404(client, teacher):
    assert client.get("/api/groups/no-existe", headers=teacher).status_code == 404
    group = create_group(client, teacher)
    assert client.delete(f"/api/groups/{group['id']}/students/999", headers=teacher).status_code == 404


# ---------- archivar, restaurar y borrar (RF-5, RF-6) ----------

def test_archive_and_restore(client, teacher):
    group = create_group(client, teacher)
    gid = group["id"]
    client.patch(f"/api/groups/{gid}", json={"archived": True}, headers=teacher)
    assert client.get("/api/groups", headers=teacher).get_json() == []
    archived = client.get("/api/groups?archived=1", headers=teacher).get_json()
    assert [g["id"] for g in archived] == [gid] and archived[0]["archived"]
    client.patch(f"/api/groups/{gid}", json={"archived": False}, headers=teacher)
    assert [g["id"] for g in client.get("/api/groups", headers=teacher).get_json()] == [gid]


def test_delete_group_without_sessions(client, teacher):
    group = create_group(client, teacher)
    assert client.delete(f"/api/groups/{group['id']}", headers=teacher).status_code == 200
    assert client.get(f"/api/groups/{group['id']}", headers=teacher).status_code == 404


# ---------- sesiones con grupo (CA-08, CA-09, CA-19) ----------

def open_group_session(client, teacher, gid, title="Clase con grupo"):
    return client.post("/api/sessions", json={"title": title, "groupId": gid}, headers=teacher)


def session_view(client, teacher, sid):
    return client.get(f"/api/sessions/{sid}", headers=teacher).get_json()


def test_session_with_group_shows_counter_and_absent(client, teacher):  # RF-18
    group = create_group(client, teacher)
    res = open_group_session(client, teacher, group["id"])
    assert res.status_code == 201
    view = session_view(client, teacher, res.get_json()["id"])
    assert view["group"] == {"id": group["id"], "name": "SDD 2º A", "deleted": False}
    assert view["rosterSize"] == 2 and view["presentCount"] == 0
    assert view["absent"] == ["Ana García", "Luis Pérez"]
    assert view["present"] == [] and view["newcomers"] == []


def test_quick_session_view_has_no_group_fields(client, teacher):  # CA-10
    sid = client.post("/api/sessions", json={"title": "Rápida"}, headers=teacher).get_json()["id"]
    assert "group" not in session_view(client, teacher, sid)


def test_empty_group_cannot_open_a_session(client, teacher):  # CA-19
    group = create_group(client, teacher, students=())
    res = open_group_session(client, teacher, group["id"])
    assert res.status_code == 409
    assert res.get_json()["error"] == "Este grupo todavía no tiene alumnos."


def test_archived_group_cannot_open_a_session(client, teacher):  # RF-5
    group = create_group(client, teacher)
    client.patch(f"/api/groups/{group['id']}", json={"archived": True}, headers=teacher)
    assert open_group_session(client, teacher, group["id"]).status_code == 409


def test_unknown_group_cannot_open_a_session(client, teacher):
    assert open_group_session(client, teacher, "no-existe").status_code == 404


def test_renaming_in_group_does_not_change_past_session(client, teacher):  # CA-08
    group = create_group(client, teacher)
    sid = open_group_session(client, teacher, group["id"]).get_json()["id"]
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    luis = next(s for s in group["students"] if s["name"] == "Luis Pérez")
    client.patch(f"/api/groups/{group['id']}/students/{luis['id']}", json={"name": "Luis P. Gil"}, headers=teacher)
    assert session_view(client, teacher, sid)["absent"] == ["Ana García", "Luis Pérez"]


def test_group_with_open_session_cannot_be_deleted_but_can_be_archived(client, teacher, clock):  # CA-09
    group = create_group(client, teacher)
    sid = open_group_session(client, teacher, group["id"]).get_json()["id"]
    res = client.delete(f"/api/groups/{group['id']}", headers=teacher)
    assert res.status_code == 409
    assert "archiva" in res.get_json()["error"]
    assert client.patch(f"/api/groups/{group['id']}", json={"archived": True}, headers=teacher).status_code == 200
    view = session_view(client, teacher, sid)
    assert view["open"] and "code" in view


def test_deleted_group_keeps_closed_sessions(client, teacher):  # RF-23
    group = create_group(client, teacher)
    sid = open_group_session(client, teacher, group["id"]).get_json()["id"]
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    assert client.delete(f"/api/groups/{group['id']}", headers=teacher).status_code == 200
    view = session_view(client, teacher, sid)
    assert view["group"] == {"id": None, "name": "SDD 2º A", "deleted": True}
    assert view["rosterSize"] == 2


# ---------- decidir sobre los nuevos (CA-06, CA-12, CA-17, CA-20) ----------

def register_new(client, teacher, sid, name):
    code = client.get(f"/api/sessions/{sid}", headers=teacher).get_json()["code"]
    p = client.post(f"/api/s/{sid}/unlock", json={"code": code}).get_json()["pass"]
    res = client.post(f"/api/s/{sid}/checkin", json={"pass": p, "name": name, "isNew": True, "confirmSimilar": True})
    assert res.status_code == 201, res.get_json()
    return res.get_json()["id"]


def decide(client, teacher, sid, cid, action):
    return client.post(f"/api/sessions/{sid}/checkins/{cid}/decision", json={"action": action}, headers=teacher)


@pytest.fixture
def closed_with_new(client, teacher, clock):
    """Grupo de 2, sesión cerrada con un nuevo «Marta» sin decidir."""
    group = create_group(client, teacher)
    sid = open_group_session(client, teacher, group["id"]).get_json()["id"]
    cid = register_new(client, teacher, sid, "Marta")
    client.post(f"/api/sessions/{sid}/close", headers=teacher)
    return group, sid, cid


def test_closing_keeps_undecided_new(client, teacher, closed_with_new):  # CA-12
    _, sid, cid = closed_with_new
    view = session_view(client, teacher, sid)
    assert not view["open"]
    assert view["newcomers"] == [{"id": cid, "name": "Marta", "checkedAt": view["newcomers"][0]["checkedAt"], "decided": False}]


def test_keep_after_closing(client, teacher, closed_with_new):  # CA-12
    _, sid, cid = closed_with_new
    assert decide(client, teacher, sid, cid, "keep").get_json() == {"result": "kept"}
    assert session_view(client, teacher, sid)["newcomers"][0]["decided"]


def test_discard_after_closing(client, teacher, closed_with_new):  # CA-12
    _, sid, cid = closed_with_new
    assert decide(client, teacher, sid, cid, "discard").get_json() == {"result": "discarded"}
    assert session_view(client, teacher, sid)["newcomers"] == []


def test_add_puts_new_in_the_next_session(client, teacher, closed_with_new):  # CA-06
    group, sid, cid = closed_with_new
    assert decide(client, teacher, sid, cid, "add").get_json() == {"result": "added"}
    assert session_view(client, teacher, sid)["newcomers"][0]["decided"]
    nxt = open_group_session(client, teacher, group["id"]).get_json()["id"]
    assert "Marta" in session_view(client, teacher, nxt)["absent"]


def test_add_with_archived_group_works(client, teacher, closed_with_new):  # CA-17
    group, sid, cid = closed_with_new
    client.patch(f"/api/groups/{group['id']}", json={"archived": True}, headers=teacher)
    assert decide(client, teacher, sid, cid, "add").status_code == 200
    assert "Marta" in [s["name"] for s in group_detail(client, teacher, group["id"])["students"]]


def test_add_with_deleted_group_is_gone(client, teacher, closed_with_new):  # CA-17
    group, sid, cid = closed_with_new
    client.delete(f"/api/groups/{group['id']}", headers=teacher)
    res = decide(client, teacher, sid, cid, "add")
    assert res.status_code == 410
    assert decide(client, teacher, sid, cid, "keep").status_code == 200


def test_add_links_to_existing_student_and_extends_the_copy(client, teacher, closed_with_new):  # CA-17
    group, sid, cid = closed_with_new
    client.post(f"/api/groups/{group['id']}/students", json={"names": ["MARTA"]}, headers=teacher)
    res = decide(client, teacher, sid, cid, "add")
    assert res.get_json() == {"result": "linked"}
    view = session_view(client, teacher, sid)
    assert view["newcomers"] == []
    assert [p["name"] for p in view["present"]] == ["MARTA"]
    assert view["rosterSize"] == 3 and view["presentCount"] == 1
    assert [s["name"] for s in group_detail(client, teacher, group["id"])["students"]].count("MARTA") == 1


def test_other_group_changes_do_not_touch_the_copy(client, teacher, closed_with_new):  # CA-17, RF-9
    group, sid, _ = closed_with_new
    client.post(f"/api/groups/{group['id']}/students", json={"names": ["Zoe"]}, headers=teacher)
    assert session_view(client, teacher, sid)["rosterSize"] == 2


def test_add_to_full_group_is_refused(client, teacher, clock):  # CA-20
    group = create_group(client, teacher, students=[f"Alumno {i:03d}" for i in range(200)])
    sid = open_group_session(client, teacher, group["id"]).get_json()["id"]
    cid = register_new(client, teacher, sid, "Persona Nueva")
    res = decide(client, teacher, sid, cid, "add")
    assert res.status_code == 409
    assert res.get_json()["error"] == "Este grupo ya tiene 200 alumnos."
    assert group_detail(client, teacher, group["id"])["students"].__len__() == 200
    assert not session_view(client, teacher, sid)["newcomers"][0]["decided"]
    assert decide(client, teacher, sid, cid, "keep").status_code == 200


def test_decision_on_listed_or_unknown_checkin(client, teacher, closed_with_new):
    _, sid, _ = closed_with_new
    assert decide(client, teacher, sid, 999, "keep").status_code == 404
