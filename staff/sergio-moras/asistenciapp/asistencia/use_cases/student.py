"""Lo que hace el alumno: ver la clase y registrarse con su nombre y el código.

Usage::

  >>> public_info(db_path, session_id)
  {'title': 'Clase 1', 'open': True}
  >>> row, created = check_in(db_path, session_id, "Ana", "0427", time.time(), "203.0.113.7")
"""

from pathlib import Path

from asistencia.domain.attempts import Blocked, exceeds_limit
from asistencia.domain.names import clean_name, name_key
from asistencia.domain.rules import is_open, require_open, require_session, require_valid_code
from asistencia.infra import sqlite_store
from asistencia.use_cases.teacher import iso_utc


def public_info(db_path: str | Path, session_id: str) -> dict:
    """Devuelve lo que el alumno puede saber de una clase: título y si está abierta.

    :param db_path: ruta del archivo SQLite.
    :param session_id: id público de la clase.
    :return: ``title`` y ``open``.
    :rtype: dict
    :raises SessionNotFound: si la clase no existe.

    Usage::

      >>> public_info(db_path, "aB3dE5fG")
      {'title': 'Clase 1', 'open': True}
    """
    with sqlite_store.open_db(db_path) as conn:
        session = require_session(sqlite_store.get_session(conn, session_id))
    return {"title": session["title"], "open": is_open(session)}


def check_in(
    db_path: str | Path, session_id: str, raw_name: str | None, code: str, t: float, ip: str
) -> tuple[dict, bool]:
    """Registra al alumno en la clase si todo es correcto.

    Primero aplica el límite de intentos de su conexión: si está bloqueada o
    se pasa ahora, no se comprueba nada más. Después comprueba, en este orden,
    que la clase existe, que sigue abierta, que el nombre vale y que el código
    es el vigente. Si el mismo nombre ya estaba, devuelve el registro anterior
    sin crear otro.

    :param db_path: ruta del archivo SQLite.
    :param session_id: id público de la clase.
    :param raw_name: nombre tal como lo escribió el alumno.
    :param code: código que escribió el alumno.
    :param t: instante en segundos Unix.
    :param ip: IP pública de quien intenta registrarse.
    :return: el registro (``name`` y ``checked_at``) y si se acaba de crear.
    :rtype: tuple[dict, bool]
    :raises Blocked: si la conexión está bloqueada o acaba de superar el límite.
    :raises SessionNotFound: si la clase no existe.
    :raises SessionClosed: si la asistencia está cerrada.
    :raises InvalidName: si el nombre está vacío o es demasiado largo.
    :raises InvalidCode: si el código no vale.

    Usage::

      >>> row, created = check_in(db_path, "aB3dE5fG", "Ana", "0427", time.time(), "203.0.113.7")
      >>> created
      True
    """
    with sqlite_store.open_db(db_path) as conn:
        if sqlite_store.is_blocked(conn, ip):
            raise Blocked()
        previous = sqlite_store.record_attempt(conn, ip, t)
        if exceeds_limit(previous, t):
            sqlite_store.block_ip(conn, ip, iso_utc(t))
            raise Blocked()

        session = require_session(sqlite_store.get_session(conn, session_id))
        require_open(session)
        name = clean_name(raw_name)
        require_valid_code(session, code, t)
        return sqlite_store.add_checkin(conn, session_id, name, name_key(name), iso_utc(t))
