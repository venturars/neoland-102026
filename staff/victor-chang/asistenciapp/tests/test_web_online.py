"""Tests de la clase online y de la app en la web · spec 007 CA-04, CA-07, CA-08; plan §4.

T06: credencial de las rutas nuevas y piezas que recibe `create_app`.
T07: las rutas `/api/app` y `/api/online`, con el `Tunnel` de verdad y un cloudflared falso (T4).
"""

import pytest
from conftest import TOKEN, TUNNEL_URL, TUNNEL_URL_LINE

from attendance import __version__
from attendance.config import Config
from attendance.entrypoints.web import context, create_app
from attendance.entrypoints.web.errors import STATUS, OnlineNotAvailableError
from attendance.infra import tunnel as tunnel_module
from attendance.infra.tunnel import CloudflaredMissingError, Tunnel, TunnelExitedError, TunnelTimeoutError

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


# ---------- T07 · rutas de la app y de la clase online (plan §4) ----------


@pytest.fixture
def online(tmp_path, clock):
    """La app de escritorio con su clase online (aún cerrada): (cliente, túnel)."""
    tunnel = Tunnel(executable=None, port=8000, timeout=5)
    config = Config(db_path=tmp_path / "test.db", port=8000, timezone=None)
    app = create_app(config, clock=clock, teacher_token=TOKEN, tunnel=tunnel, desktop=True)
    return app.test_client(), tunnel


def test_the_version_is_1_0_0():  # CA-04 · plan §2.10
    assert __version__ == "1.0.0"


def test_app_info_on_the_desktop(online, teacher):  # CA-04, CA-09
    client, _tunnel = online
    res = client.get("/api/app", headers=teacher)
    assert res.status_code == 200
    assert res.get_json() == {"version": __version__, "desktop": True, "online": {"active": False}}


def test_app_info_from_source_without_a_tunnel(client, teacher):  # CA-18: arrancada desde el código
    assert client.get("/api/app", headers=teacher).get_json() == {
        "version": __version__,
        "desktop": False,
        "online": {"active": False},
    }


def test_open_the_online_class(online, teacher, fake_cloudflared):  # CA-07
    client, _tunnel = online
    fake_cloudflared(TUNNEL_URL_LINE + "\n")
    res = client.post("/api/online", headers=teacher)
    assert res.status_code == 200
    assert res.get_json() == {"active": True, "url": TUNNEL_URL}
    info = client.get("/api/app", headers=teacher).get_json()
    assert info["online"] == {"active": True, "url": TUNNEL_URL}


def test_open_twice_gives_the_same_link(online, teacher, fake_cloudflared):  # CA-07: dos clics, un túnel
    client, _tunnel = online
    fake_cloudflared(TUNNEL_URL_LINE + "\n")
    first = client.post("/api/online", headers=teacher).get_json()
    second = client.post("/api/online", headers=teacher).get_json()
    assert first == second == {"active": True, "url": TUNNEL_URL}
    assert len(fake_cloudflared.calls) == 1


def test_close_the_online_class(online, teacher, fake_cloudflared):  # CA-09, CA-12
    client, tunnel = online
    process = fake_cloudflared(TUNNEL_URL_LINE + "\n")
    client.post("/api/online", headers=teacher)
    res = client.delete("/api/online", headers=teacher)
    assert res.status_code == 200
    assert res.get_json() == {"active": False}
    assert process.terminated and tunnel.url is None
    assert client.get("/api/app", headers=teacher).get_json()["online"] == {"active": False}


def test_close_when_it_was_not_open(online, teacher):
    client, _tunnel = online
    res = client.delete("/api/online", headers=teacher)
    assert (res.status_code, res.get_json()) == (200, {"active": False})


def test_cloudflared_closes_without_a_link(online, teacher, fake_cloudflared):  # CA-08
    client, tunnel = online
    fake_cloudflared("2026-10-20T08:33:16Z ERR failed to request quick Tunnel\n")
    res = client.post("/api/online", headers=teacher)
    assert res.status_code == 502
    assert res.get_json() == {"error": TunnelExitedError.MESSAGE}
    assert tunnel.url is None


def test_cloudflared_gives_no_link_in_time(tmp_path, clock, teacher, fake_cloudflared):  # CA-08, F4
    tunnel = Tunnel(executable=None, port=8000, timeout=0.2)
    config = Config(db_path=tmp_path / "test.db", port=8000, timezone=None)
    client = create_app(config, clock=clock, teacher_token=TOKEN, tunnel=tunnel, desktop=True).test_client()
    fake_cloudflared(None)
    res = client.post("/api/online", headers=teacher)
    assert res.status_code == 502
    assert res.get_json() == {"error": TunnelTimeoutError.MESSAGE}


def test_cloudflared_is_missing(online, teacher, monkeypatch):  # CA-08
    client, _tunnel = online
    monkeypatch.setattr(tunnel_module.shutil, "which", lambda _name: None)
    res = client.post("/api/online", headers=teacher)
    assert res.status_code == 422
    assert res.get_json() == {"error": CloudflaredMissingError.MESSAGE}


def test_without_a_tunnel_the_online_class_is_not_available(client, teacher):  # create_app sin tunnel
    res = client.post("/api/online", headers=teacher)
    assert res.status_code == 409
    assert res.get_json() == {"error": OnlineNotAvailableError.MESSAGE}
    assert client.delete("/api/online", headers=teacher).get_json() == {"active": False}


def test_tunnel_errors_are_in_the_single_table():  # E4 · plan §2.12
    assert STATUS[CloudflaredMissingError] == 422
    assert STATUS[TunnelTimeoutError] == STATUS[TunnelExitedError] == 502
    assert STATUS[OnlineNotAvailableError] == 409
