"""Casos de uso de los registros: registrarse y quitar un registro (spec 001 CA-04, CA-06 a CA-09, CA-24).

Viven aquí y no en la ruta web para que cualquier otra fuente de registros (p. ej. Discord,
constitución P1) aplique exactamente las mismas reglas (ARCHITECTURE.md · C3). Cada caso de uso
que escribe abre su transacción con `with conn:` (D3).
"""

import sqlite3

from attendance.domain.codes import is_valid_code
from attendance.domain.errors import CheckinNotFoundError, EmptyNameError, InvalidCodeError, SessionClosedError
from attendance.domain.names import clean_name, name_key
from attendance.domain.sessions import CheckinResult, to_iso
from attendance.infra import storage
from attendance.usecases.sessions import find_session


def check_in(conn: sqlite3.Connection, session_id: str, raw_name: object, raw_code: object, t: float) -> CheckinResult:
    """Registra al alumno en la clase; si ya estaba, devuelve su registro con created=False (CA-07).

    Las comprobaciones van en este orden: clase cerrada, nombre, código.

    Args:
        conn: conexión abierta a la base de datos.
        session_id: la clase.
        raw_name: el nombre tal como llega; en T13 pasa a ser `str`.
        raw_code: el código tal como llega; en T13 pasa a ser `str`.
        t: instante del registro, en segundos Unix.

    Raises:
        SessionNotFoundError: no hay ninguna clase con ese id.
        SessionClosedError: la clase ya está cerrada (CA-09).
        EmptyNameError, NameTooLongError: el nombre no es válido (CA-08).
        InvalidCodeError: el código es incorrecto o ha caducado (CA-06).
    """
    session = find_session(conn, session_id)
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
    with conn:
        return storage.add_checkin(conn, session.id, name, name_key(name), to_iso(t))


def remove_checkin(conn: sqlite3.Connection, session_id: str, checkin_id: int) -> None:
    """Quita un registro de la clase; esa persona puede volver a registrarse (CA-24, CA-26).

    Raises:
        SessionNotFoundError: no hay ninguna clase con ese id.
        CheckinNotFoundError: ese registro no existe en esta clase.
    """
    find_session(conn, session_id)
    with conn:
        removed = storage.remove_checkin(conn, session_id, checkin_id)
    if not removed:
        raise CheckinNotFoundError
