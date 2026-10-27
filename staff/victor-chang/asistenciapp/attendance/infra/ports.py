"""Comprobar si un puerto local ya está ocupado (spec 001 · plan §5, T14b; spec 005 · plan §2.1)."""

import socket


def port_in_use(port: int) -> bool:
    """True si ya hay algo escuchando en 127.0.0.1:port (p. ej. otra AsistenciApp)."""
    with socket.socket() as probe:
        probe.settimeout(0.5)
        return probe.connect_ex(("127.0.0.1", port)) == 0
