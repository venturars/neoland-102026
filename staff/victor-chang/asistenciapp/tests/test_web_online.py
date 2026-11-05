"""Tests de la clase online y de la app en la web · spec 007 CA-04, CA-07, CA-08; plan §4.

T06: credencial de las rutas nuevas y piezas que recibe `create_app`.
"""

import pytest

from attendance.config import Config
from attendance.entrypoints.web import context, create_app
from attendance.infra.tunnel import Tunnel

# ---------- T06 · credencial (plan §4; X3) ----------


@pytest.mark.parametrize(
    "method, path",
    [
        ("get", "/api/app"),
        ("post", "/api/online"),
        ("delete", "/api/online"),
    ],
)
@pytest.mark.parametrize("headers", [{}, {"X-Teacher-Token": "token-falso"}])
def test_new_routes_require_the_teacher_token(client, method, path, headers):
    res = getattr(client, method)(path, headers=headers)
    assert res.status_code == 401
    assert "error" in res.get_json()


@pytest.mark.parametrize("method, path", [("get", "/api/app"), ("post", "/api/online"), ("delete", "/api/online")])
def test_with_the_token_the_check_passes(client, teacher, method, path):
    assert getattr(client, method)(path, headers=teacher).status_code != 401


def test_sessions_are_still_private(client):
    assert client.get("/api/sessions").status_code == 401


@pytest.mark.parametrize("path", ["/api/apps", "/api/online-extra", "/api/application"])
def test_only_the_exact_prefixes_are_private(client, path):  # "/api/app" no protege "/api/apps"
    assert client.get(path).status_code == 404


def test_student_routes_stay_open(client):  # el alumno no tiene token
    assert client.get("/api/s/no-existe").status_code == 404


# ---------- T06 · piezas de create_app (plan §4; C4) ----------


def test_by_default_there_is_no_tunnel_and_it_is_not_the_desktop(app):
    pieces = context.of(app)
    assert pieces.tunnel is None
    assert pieces.desktop is False


def test_create_app_keeps_the_tunnel_and_the_desktop_flag(tmp_path):
    online = Tunnel(executable=None, port=8000)
    config = Config(db_path=tmp_path / "test.db", port=8000, timezone=None)
    pieces = context.of(create_app(config, teacher_token="t", tunnel=online, desktop=True))
    assert pieces.tunnel is online
    assert pieces.desktop is True
