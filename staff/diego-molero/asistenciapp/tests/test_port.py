"""Tests de port_in_use (app.py) · T14b."""

import socket

from app import port_in_use


def test_detects_listening_port_and_free_port():
    server = socket.socket()
    server.bind(("127.0.0.1", 0))  # 0 = puerto libre elegido por el sistema
    server.listen()
    port = server.getsockname()[1]
    assert port_in_use(port)
    server.close()
    assert not port_in_use(port)
