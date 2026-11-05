"""Tests de attendance/infra/server.py · spec 007 CA-12; plan §2.4."""

import urllib.request

from attendance.infra.ports import port_in_use
from attendance.infra.server import start


def _get(port: int, path: str = "/") -> int:
    with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=5) as response:  # noqa: S310
        return response.status


def test_start_serves_the_app_on_a_free_local_port(app):
    server = start(app)
    try:
        assert server.port > 0  # el sistema elige un puerto libre (plan §2.4)
        assert server.host == "127.0.0.1"  # solo en local (X6)
        assert _get(server.port) == 200
        assert _get(server.port, "/profesor.html") == 200
    finally:
        server.stop()


def test_stop_frees_the_port_and_ends_the_thread(app):  # CA-12
    server = start(app)
    port = server.port
    server.stop()
    assert not port_in_use(port)
    assert not server.running


def test_stop_twice_does_not_fail(app):  # se llama en el finally de app.py aunque algo haya fallado antes
    server = start(app)
    server.stop()
    server.stop()
    assert not server.running


def test_used_with_with_it_stops_on_exit(app):  # S7
    with start(app) as server:
        port = server.port
        assert server.running and _get(port) == 200
    assert not port_in_use(port)
    assert not server.running


def test_two_servers_get_different_ports(app):  # sin el 8000 fijo: nunca "puerto en uso"
    with start(app) as first, start(app) as second:
        assert first.port != second.port
