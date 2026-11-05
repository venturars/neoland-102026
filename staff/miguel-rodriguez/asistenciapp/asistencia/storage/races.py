"""SQL de carrera sin commits internos; la acción controla cada transacción."""
import sqlite3
from pathlib import Path
from .sqlite import get_session, is_race as has_mode

QUERY_DIR = Path(__file__).parent / 'queries/races'


def connect(path: str | Path) -> sqlite3.Connection:
    """Abre conexión de carrera con escritura explícita y espera acotada.

    :param path: archivo SQLite local que se abre.
    :return: conexión que el llamante debe cerrar.
    :rtype: sqlite3.Connection

    Usage::

        connect(path)
    """
    connection = sqlite3.connect(path, timeout=0.5, isolation_level=None, autocommit=sqlite3.LEGACY_TRANSACTION_CONTROL)
    try:
        connection.row_factory = sqlite3.Row
        query = (QUERY_DIR / 'enable-foreign-keys.sql').read_text(encoding='utf-8')
        connection.execute(query)
        query = (QUERY_DIR / 'synchronous-full.sql').read_text(encoding='utf-8')
        connection.execute(query)
    except BaseException:
        connection.close()
        raise
    return connection


def get_race(connection: sqlite3.Connection, session_id: str) -> dict | None:
    """Lee clase y metadatos de carrera, sin decidir fase.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        get_race(connection, session_id)
    """
    query = (QUERY_DIR / 'get-race.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id,))
    row = cursor.fetchone()
    if row is None:
        return None
    data = dict(row)
    data['secret'] = bytes.fromhex(data['secret'])
    return data


def slots(connection: sqlite3.Connection, session_id: str) -> list[dict]:
    """Lee las plazas de una carrera.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :return: filas encontradas en el orden definido por la consulta.
    :rtype: list[dict]

    Usage::

        slots(connection, session_id)
    """
    query = (QUERY_DIR / 'list-slots.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def slot(connection: sqlite3.Connection, session_id: str, roster_key: str) -> dict | None:
    """Consulta una plaza sin acceso a otra carrera.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        slot(connection, session_id, "jimena-duran")
    """
    query = (QUERY_DIR / 'get-slot.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, roster_key))
    row = cursor.fetchone()
    return dict(row) if row else None


def access_slot(connection: sqlite3.Connection, session_id: str, credential_hash: str) -> dict | None:
    """Busca el hash solo dentro de su carrera.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param credential_hash: hash SHA-256 del permiso, sin guardar su valor original.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        access_slot(connection, session_id, credential_hash)
    """
    query = (QUERY_DIR / 'access-slot.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, credential_hash))
    row = cursor.fetchone()
    return dict(row) if row else None


def operations(connection: sqlite3.Connection, session_id: str, roster_key: str) -> list[dict]:
    """Lee como máximo las tres operaciones de una plaza.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :return: filas encontradas en el orden definido por la consulta.
    :rtype: list[dict]

    Usage::

        operations(connection, session_id, "jimena-duran")
    """
    query = (QUERY_DIR / 'list-operations.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, roster_key))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def operation(
    connection: sqlite3.Connection,
    session_id: str,
    roster_key: str,
    operation_id: str,
) -> dict | None:
    """Consulta un identificador de operación propio.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :param operation_id: UUID de la operación propia.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        operation(connection, session_id, "jimena-duran", operation_id)
    """
    query = (QUERY_DIR / 'get-operation.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, roster_key, operation_id))
    row = cursor.fetchone()
    return dict(row) if row else None


def count_operations(connection: sqlite3.Connection, session_id: str, roster_key: str) -> int:
    """Cuenta reservas y resultados sin devolver presupuesto.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :return: número de reservas y resultados guardados.
    :rtype: int

    Usage::

        count_operations(connection, session_id, "jimena-duran")
    """
    query = (QUERY_DIR / 'count-operations.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, roster_key))
    row = cursor.fetchone()
    return row[0]


def ranking(connection: sqlite3.Connection, session_id: str) -> list[dict]:
    """Lee asistencias reales por orden de confirmación.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :return: filas encontradas en el orden definido por la consulta.
    :rtype: list[dict]

    Usage::

        ranking(connection, session_id)
    """
    query = (QUERY_DIR / 'ranking.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]


def create(
    connection: sqlite3.Connection,
    session_id: str,
    title: str,
    opened_at: str,
    secret: bytes,
    prepared_at: float,
    expires_at: float,
    join_secret: str,
    roster: list | tuple,
) -> None:
    """Inserta clase, carrera y plazas sin confirmar la conexión.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param title: título recibido para la clase.
    :param opened_at: fecha de creación en el formato existente.
    :param secret: secreto de clase usado por el código rotatorio.
    :param prepared_at: instante Unix de preparación.
    :param expires_at: límite original de vigencia en segundos Unix.
    :param join_secret: secreto vigente de entrada al lobby.
    :param roster: lista canónica de nombres y personajes.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        create(connection, session_id, "Clase", opened_at, secret, 1800000000.0, 1800007200.0, entry_secret, students)
    """
    query = (QUERY_DIR / 'insert-session.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, title, secret.hex(), opened_at))
    query = (QUERY_DIR / 'insert-race.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, prepared_at, expires_at, join_secret))
    query = (QUERY_DIR / 'insert-slots.sql').read_text(encoding='utf-8')
    values = [
        (session_id, row['key'], row['name'], row['character'])
        for row in roster
    ]
    connection.executemany(query, values)


def occupy(
    connection: sqlite3.Connection,
    session_id: str,
    roster_key: str,
    credential_hash: str,
) -> None:
    """Guarda hash y ocupación de una plaza libre.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :param credential_hash: hash SHA-256 del permiso, sin guardar su valor original.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        occupy(connection, session_id, "jimena-duran", credential_hash)
    """
    query = (QUERY_DIR / 'insert-access.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, roster_key, credential_hash))
    query = (QUERY_DIR / 'mark-slot-ready.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, roster_key))


def release(connection: sqlite3.Connection, session_id: str, roster_key: str) -> None:
    """Revoca el acceso sin recrear la plaza.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        release(connection, session_id, "jimena-duran")
    """
    query = (QUERY_DIR / 'remove-access.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, roster_key))
    query = (QUERY_DIR / 'mark-slot-pending.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, roster_key))


def start(connection: sqlite3.Connection, session_id: str, instant: float) -> None:
    """Fija grupo, salida y revoca el secreto del lobby.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param instant: instante del cambio en el formato indicado por el tipo.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        start(connection, session_id, instant)
    """
    query = (QUERY_DIR / 'include-started-slots.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id,))
    query = (QUERY_DIR / 'start-race.sql').read_text(encoding='utf-8')
    connection.execute(query, (instant, session_id))


def close(connection: sqlite3.Connection, session_id: str, instant: str) -> None:
    """Conserva el primer cierre y revoca las altas.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param instant: instante del cambio en el formato indicado por el tipo.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        close(connection, session_id, instant)
    """
    query = (QUERY_DIR / 'close-session.sql').read_text(encoding='utf-8')
    connection.execute(query, (instant, session_id))
    query = (QUERY_DIR / 'revoke-join-secret.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id,))


def insert_operation(
    connection: sqlite3.Connection,
    session_id: str,
    roster_key: str,
    operation_id: str,
    attempt_no: int,
    payload_fingerprint: str,
) -> None:
    """Reserva una oportunidad; el llamante confirma antes de evaluar.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :param operation_id: UUID de la operación propia.
    :param attempt_no: número de oportunidad de uno a tres.
    :param payload_fingerprint: HMAC del contenido normalizado; no es el código enviado.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        insert_operation(connection, session_id, "jimena-duran", operation_id, 1, fingerprint)
    """
    query = (QUERY_DIR / 'insert-operation.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, roster_key, operation_id, attempt_no, payload_fingerprint))


def complete_operation(
    connection: sqlite3.Connection,
    session_id: str,
    roster_key: str,
    operation_id: str,
    result_kind: str,
    checkin_id: int | None = None,
) -> None:
    """Completa la operación sin confirmar la transacción del llamante.

    :param connection: conexión de la transacción actual.
    :param session_id: identificador de la carrera.
    :param roster_key: clave canónica de la plaza.
    :param operation_id: identificador de la operación reservada.
    :param result_kind: resultado que queda confirmado.
    :param checkin_id: asistencia confirmada o ausencia de ella.
    :return: None; el llamante conserva la responsabilidad del commit.
    :rtype: None

    Usage::

        complete_operation(connection, session_id, "jimena-duran", operation_id, "invalid_code")
    """
    # Conserva el formato guardado por 008; el adaptador decide la respuesta HTTP.
    stored_statuses = {
        'success': 201,
        'already': 200,
        'invalid_operation': 400,
        'invalid_code': 422,
        'not_processed': 409,
    }
    legacy_status = stored_statuses[result_kind]
    query = (QUERY_DIR / 'complete-operation.sql').read_text(encoding='utf-8')
    connection.execute(query, (result_kind, legacy_status, checkin_id, session_id, roster_key, operation_id))


def add_checkin(
    connection: sqlite3.Connection,
    session_id: str,
    roster_key: str,
    name: str,
    name_key: str,
    instant: str,
) -> int:
    """Inserta asistencia y enlaza su plaza, sin commit interno.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param roster_key: clave canónica de la plaza del roster.
    :param name: nombre canónico del roster.
    :param name_key: nombre normalizado para la unicidad existente.
    :param instant: instante del cambio en el formato indicado por el tipo.
    :return: identificador de la asistencia insertada.
    :rtype: int

    Usage::

        add_checkin(connection, session_id, "jimena-duran", "Jimena Duran", "jimena duran", instant)
    """
    query = (QUERY_DIR / 'insert-checkin.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, name, name_key, instant))
    checkin_id = cursor.lastrowid
    query = (QUERY_DIR / 'register-slot.sql').read_text(encoding='utf-8')
    connection.execute(query, (checkin_id, session_id, roster_key))
    return checkin_id


def remove_checkin(connection: sqlite3.Connection, session_id: str, checkin_id: int) -> bool:
    """Retira plaza antes de borrar asistencia de la misma clase.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :param checkin_id: identificador de la asistencia que se retira.
    :return: resultado de la condición consultada.
    :rtype: bool

    Usage::

        remove_checkin(connection, session_id, 1)
    """
    query = (QUERY_DIR / 'remove-slot.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id, checkin_id))
    query = (QUERY_DIR / 'remove-checkin.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id, checkin_id))
    return cursor.rowcount == 1


def all_registered(connection: sqlite3.Connection, session_id: str) -> bool:
    """Consulta si el grupo no vacío ya tiene todas sus asistencias.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :return: resultado de la condición consultada.
    :rtype: bool

    Usage::

        all_registered(connection, session_id)
    """
    query = (QUERY_DIR / 'all-registered.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (session_id,))
    row = cursor.fetchone()
    slot_count, registered_count = row
    return slot_count > 0 and slot_count == registered_count


def expired(connection: sqlite3.Connection, now: float) -> list[str]:
    """Busca trabajo vencido sin reescribir carreras limpias.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param now: instante Unix leído del servidor.
    :return: identificadores de carreras con limpieza pendiente.
    :rtype: list[str]

    Usage::

        expired(connection, 1800000000.0)
    """
    query = (QUERY_DIR / 'expired-races.sql').read_text(encoding='utf-8')
    cursor = connection.execute(query, (now,))
    rows = cursor.fetchall()
    return [row[0] for row in rows]


def purge(connection: sqlite3.Connection, session_id: str) -> None:
    """Elimina solo secretos y operaciones temporales de carrera.

    :param connection: conexión de la transacción actual, sin commit implícito.
    :param session_id: identificador de la carrera guardada.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        purge(connection, session_id)
    """
    query = (QUERY_DIR / 'revoke-join-secret.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id,))
    query = (QUERY_DIR / 'purge-access.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id,))
    query = (QUERY_DIR / 'purge-operations.sql').read_text(encoding='utf-8')
    connection.execute(query, (session_id,))
