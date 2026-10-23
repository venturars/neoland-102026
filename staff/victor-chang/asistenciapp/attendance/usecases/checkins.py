"""Reglas del registro de asistencia (plan §2, CA-04, CA-06 a CA-09).

Viven aquí y no en la ruta de Flask para que cualquier otra fuente de
registros (p. ej. Discord, constitución P1) aplique exactamente las mismas.
"""

import sqlite3

from attendance.domain.codes import is_valid_code
from attendance.domain.errors import EmptyNameError, InvalidCodeError, SessionClosedError
from attendance.domain.names import clean_name, name_key
from attendance.domain.sessions import CheckinResult, Session
from attendance.infra import storage


def register(
    conn: sqlite3.Connection,
    session: Session,
    raw_name: object,
    raw_code: object,
    t: float,
    checked_at: str,
) -> CheckinResult:
    """Registra al alumno en la sesión; si ya estaba, devuelve su registro con created=False.

    Las comprobaciones van en este orden: sesión cerrada, nombre, código.

    Raises:
        SessionClosedError: la sesión ya está cerrada (CA-09).
        EmptyNameError, NameTooLongError: el nombre no es válido (CA-08).
        InvalidCodeError: el código es incorrecto o ha caducado (CA-06).
    """
    if not session.is_open:
        raise SessionClosedError
    # Temporal hasta spec 005 · T13: la entrada aún no comprueba el tipo (E1), y un nombre
    # que no es texto se sigue tratando como vacío, como hasta ahora.
    if not isinstance(raw_name, str):
        raise EmptyNameError
    name = clean_name(raw_name)
    # Temporal hasta spec 005 · T13, como el nombre: un código que no es texto no es válido.
    if not isinstance(raw_code, str) or not is_valid_code(session.secret, raw_code, t):
        raise InvalidCodeError
    return storage.add_checkin(conn, session.id, name, name_key(name), checked_at)
