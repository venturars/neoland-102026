"""Acceso a la base de datos SQLite (plan §3).

Las funciones reciben una conexión abierta. Cada caso de uso la abre y
la cierra; las escrituras conservan sus transacciones.
"""
from pathlib import Path
import secrets
import sqlite3

QUERY_DIR = Path(__file__).parent / 'queries/sqlite'
SCHEMA = (QUERY_DIR / 'schema.sql').read_text(encoding='utf-8')


def connect(path: str | Path) -> sqlite3.Connection:
    """Abre una conexión local con integridad referencial.

    :param path: archivo de base de datos.
    :return: conexión abierta, que debe cerrar quien llama.
    :rtype: sqlite3.Connection

    Usage::

        connect(path)
    """
    query = (QUERY_DIR / 'enable-foreign-keys.sql').read_text(encoding='utf-8')
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute(query)
    return connection


def init_schema(connection: sqlite3.Connection) -> None:
    """Inicializa las tablas existentes sin sustituirlas.

    :param connection: conexión abierta.
    :return: None.
    :rtype: None

    Usage::

        init_schema(connection)
    """
    connection.executescript(SCHEMA)


def get_or_create_teacher_token(connection: sqlite3.Connection) -> str:
    """Recupera el token guardado o crea el primero.

    :param connection: conexión abierta.
    :return: token persistente del profesor.
    :rtype: str

    Usage::

        get_or_create_teacher_token(connection)
    """
    query = (QUERY_DIR / 'get-teacher-token.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query)
    row = cursor.fetchone()
    if row:
        return row['value']
    token = secrets.token_urlsafe(24)
    with connection:
        query = (QUERY_DIR / 'insert-teacher-token.sql').read_text(encoding='utf-8')
        connection.execute(query, (token,))
    return token


def _session(row: sqlite3.Row | None) -> dict | None:
    """Convierte una fila de sesión y decodifica su secreto.

    :param row: fila SQLite o None.
    :return: sesión ordinaria o None.
    :rtype: dict | None

    Usage::

        _session(row)
    """
    if row is None:
        return None
    session = dict(row)
    session['secret'] = bytes.fromhex(session['secret'])
    return session


def create_session(connection: sqlite3.Connection, title: str, opened_at: str) -> dict:
    """Guarda una sesión con identificador y secreto aleatorios.

    :param connection: conexión abierta.
    :param title: título ya preparado.
    :param opened_at: hora de apertura en formato ISO.
    :return: sesión recién guardada.
    :rtype: dict

    Usage::

        create_session(connection, "Clase", opened_at)
    """
    session_id = secrets.token_urlsafe(6)
    secret = secrets.token_bytes(16)
    with connection:
        query = (QUERY_DIR / 'insert-session.sql').read_text(encoding='utf-8')
        connection.execute(query, (session_id, title, secret.hex(), opened_at))
    return get_session(connection, session_id)


def get_session(connection: sqlite3.Connection, session_id: str) -> dict | None:
    """Consulta una sesión por su identificador.

    :param connection: conexión abierta.
    :param session_id: identificador de la clase.
    :return: sesión o None si no existe.
    :rtype: dict | None

    Usage::

        get_session(connection, session_id)
    """
    query = (QUERY_DIR / 'get-session.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id,))
    row = cursor.fetchone()
    return _session(row)


def list_sessions(connection: sqlite3.Connection) -> list[dict]:
    """Consulta las sesiones y sus totales en el orden existente.

    :param connection: conexión abierta.
    :return: lista de sesiones, de más reciente a más antigua.
    :rtype: list[dict]

    Usage::

        list_sessions(connection)
    """
    query = (QUERY_DIR / 'list-sessions.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query)
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def close_session(connection: sqlite3.Connection, session_id: str, closed_at: str) -> None:
    """Guarda el primer cierre de una sesión.

    :param connection: conexión abierta.
    :param session_id: identificador de la clase.
    :param closed_at: hora de cierre ISO.
    :return: None; un cierre previo permanece intacto.
    :rtype: None

    Usage::

        close_session(connection, session_id, closed_at)
    """
    with connection:
        query = (QUERY_DIR / 'close-session.sql').read_text(encoding='utf-8')
        connection.execute(query, (closed_at, session_id))


def add_checkin(
    connection: sqlite3.Connection,
    session_id: str,
    name: str,
    name_key: str,
    checked_at: str,
) -> tuple[dict, bool]:
    """Inserta un registro si no existe su clave en esa clase.

    :param connection: conexión abierta.
    :param session_id: identificador de la clase.
    :param name: nombre ya validado.
    :param name_key: clave normalizada del nombre.
    :param checked_at: hora de registro ISO.
    :return: registro y si la inserción creó una fila.
    :rtype: tuple[dict, bool]

    Usage::

        add_checkin(connection, session_id, "Ana", "ana", checked_at)
    """
    with connection:
        query = (QUERY_DIR / 'insert-checkin.sql').read_text(encoding='utf-8')
        insert_cursor = connection.execute(query, (session_id, name, name_key, checked_at))
        created = insert_cursor.rowcount == 1
    query = (QUERY_DIR / 'get-checkin.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, name_key))
    row = cursor.fetchone()
    checkin = dict(row)
    return checkin, created


def list_checkins(connection: sqlite3.Connection, session_id: str) -> list[dict]:
    """Consulta los registros de una clase.

    :param connection: conexión abierta.
    :param session_id: identificador de la clase.
    :return: registros ordenados por hora e ID.
    :rtype: list[dict]

    Usage::

        list_checkins(connection, session_id)
    """
    query = (QUERY_DIR / 'list-checkins.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def remove_checkin(connection: sqlite3.Connection, session_id: str, checkin_id: int) -> bool:
    """Elimina un registro únicamente si pertenece a la clase.

    :param connection: conexión abierta.
    :param session_id: identificador de la clase.
    :param checkin_id: identificador del registro.
    :return: si se eliminó una fila.
    :rtype: bool

    Usage::

        remove_checkin(connection, session_id, checkin_id)
    """
    with connection:
        query = (QUERY_DIR / 'remove-checkin.sql').read_text(encoding='utf-8')
        cursor = connection.execute(query, (checkin_id, session_id))
    return cursor.rowcount == 1


def purge_registration_attempts(connection: sqlite3.Connection, cutoff: float) -> None:
    """Elimina globalmente intentos caducados dentro de la transacción llamante.

    :param connection: conexión con transacción abierta.
    :param cutoff: instante máximo que se elimina, inclusive.
    :return: None.
    :rtype: None

    Usage::

        purge_registration_attempts(connection, now - 60)
    """
    query = (QUERY_DIR / 'purge-registration-attempts.sql').read_text(encoding='utf-8')
    connection.execute(query, (cutoff,))


def address_is_blocked(connection: sqlite3.Connection, address: str) -> bool:
    """Consulta si una dirección está en la lista persistente.

    :param connection: conexión abierta.
    :param address: dirección canónica.
    :return: si existe su fila de bloqueo.
    :rtype: bool

    Usage::

        address_is_blocked(connection, address)
    """
    query = (QUERY_DIR / 'address-is-blocked.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (address,))
    row = cursor.fetchone()
    return row is not None


def registration_attempt_times(connection: sqlite3.Connection, address: str) -> list[float]:
    """Consulta tiempos de intentos sin interpretar límites.

    :param connection: conexión abierta.
    :param address: dirección canónica.
    :return: tiempos guardados de esa dirección.
    :rtype: list[float]

    Usage::

        registration_attempt_times(connection, address)
    """
    query = (QUERY_DIR / 'registration-attempt-times.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (address,))
    rows = cursor.fetchall()
    return [row[0] for row in rows]


def insert_registration_attempt(connection: sqlite3.Connection, address: str, instant: float) -> None:
    """Añade un intento dentro de la transacción llamante.

    :param connection: conexión abierta.
    :param address: dirección canónica.
    :param instant: instante Unix del intento.
    :return: None.
    :rtype: None

    Usage::

        insert_registration_attempt(connection, address, now)
    """
    query = (QUERY_DIR / 'insert-registration-attempt.sql').read_text(encoding='utf-8')
    connection.execute(query, (address, instant))


def insert_blocked_address(connection: sqlite3.Connection, address: str) -> None:
    """Guarda solo la dirección del bloqueo, sin datos de asistencia.

    :param connection: conexión abierta.
    :param address: dirección canónica.
    :return: None.
    :rtype: None

    Usage::

        insert_blocked_address(connection, address)
    """
    query = (QUERY_DIR / 'insert-blocked-address.sql').read_text(encoding='utf-8')
    connection.execute(query, (address,))


def is_race(connection: sqlite3.Connection, session_id: str) -> bool:
    """Consulta modo sin exigir que una base anterior ya esté inicializada.

    :param connection: conexión de la acción existente.
    :param session_id: clase consultada.
    :return: si existe su fila de carrera; las bases anteriores son normales.
    :rtype: bool

    Usage::

        is_race(connection, "clase")
    """
    query = (QUERY_DIR / 'race-table-exists.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query)
    exists = cursor.fetchone()
    if exists is None:
        return False
    query = (QUERY_DIR / 'is-race.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id,))
    row = cursor.fetchone()
    return row is not None
