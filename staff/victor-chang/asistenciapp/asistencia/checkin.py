"""Reglas del registro de asistencia (plan §2, CA-04, CA-06 a CA-09).

Viven aquí y no en la ruta de Flask para que cualquier otra fuente de
registros (p. ej. Discord, constitución P1) aplique exactamente las mismas.
"""

import sqlite3

from asistencia import db
from asistencia.codes import is_valid_code
from asistencia.names import clean_name, name_key


class SessionClosed(Exception):
    """La sesión ya está cerrada y no acepta registros (CA-09)."""


class InvalidCode(Exception):
    """El código es incorrecto o ha caducado (CA-06)."""


def register(
    conn: sqlite3.Connection,
    session: dict,
    raw_name: object,
    raw_code: object,
    t: float,
    checked_at: str,
) -> tuple[dict, bool]:
    """Registra al alumno en la sesión. Devuelve (registro, creado) como db.add_checkin.

    Las comprobaciones van en este orden: sesión cerrada, nombre, código.

    Raises:
        SessionClosed: la sesión ya está cerrada (CA-09).
        ValueError: el nombre no es válido (CA-08).
        InvalidCode: el código es incorrecto o ha caducado (CA-06).
    """
    if session["closed_at"] is not None:
        raise SessionClosed
    name = clean_name(raw_name)
    if not is_valid_code(session["secret"], "" if raw_code is None else raw_code, t):
        raise InvalidCode
    return db.add_checkin(conn, session["id"], name, name_key(name), checked_at)
