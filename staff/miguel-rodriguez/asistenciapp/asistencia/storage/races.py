"""SQL de carrera sin commits internos; la acción controla cada transacción."""
import sqlite3
from pathlib import Path
from .sqlite import get_session, is_race as has_mode

def connect(path: str | Path) -> sqlite3.Connection:
    """Abre conexión de carrera con escritura explícita y espera acotada.

    :param path: archivo SQLite local que se abre.
    :return: conexión que el llamante debe cerrar.
    :rtype: sqlite3.Connection

    Usage::

        connect(path)
    """
    c = sqlite3.connect(path, timeout=0.5, isolation_level=None, autocommit=sqlite3.LEGACY_TRANSACTION_CONTROL)
    try:
        c.row_factory = sqlite3.Row
        c.execute('PRAGMA foreign_keys=ON')
        c.execute('PRAGMA synchronous=FULL')
    except BaseException:
        c.close()
        raise
    return c

def get_race(c: sqlite3.Connection, sid: str) -> dict | None:
    """Lee clase y metadatos de carrera, sin decidir fase.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        get_race(conn, session_id)
    """
    row = c.execute('SELECT r.*,s.title,s.secret,s.opened_at,s.closed_at FROM races r JOIN sessions s ON s.id=r.session_id WHERE r.session_id=?', (sid,)).fetchone()
    if row is None:
        return None
    data = dict(row)
    data['secret'] = bytes.fromhex(data['secret'])
    return data

def slots(c: sqlite3.Connection, sid: str) -> list[dict]:
    """Lee las plazas de una carrera.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :return: filas encontradas en el orden definido por la consulta.
    :rtype: list[dict]

    Usage::

        slots(conn, session_id)
    """
    return [dict(r) for r in c.execute('SELECT * FROM race_slots WHERE session_id=? ORDER BY rowid', (sid,))]

def slot(c: sqlite3.Connection, sid: str, key: str) -> dict | None:
    """Consulta una plaza sin acceso a otra carrera.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        slot(conn, session_id, "jimena-duran")
    """
    row = c.execute('SELECT * FROM race_slots WHERE session_id=? AND roster_key=?', (sid, key)).fetchone()
    return dict(row) if row else None

def access_slot(c: sqlite3.Connection, sid: str, digest: str) -> dict | None:
    """Busca el hash solo dentro de su carrera.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param digest: hash SHA-256 del permiso, sin guardar su valor original.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        access_slot(conn, session_id, credential_hash)
    """
    row = c.execute('SELECT s.*,a.credential_hash FROM race_slots s JOIN race_access a USING(session_id,roster_key) WHERE a.session_id=? AND a.credential_hash=?', (sid, digest)).fetchone()
    return dict(row) if row else None

def operations(c: sqlite3.Connection, sid: str, key: str) -> list[dict]:
    """Lee como máximo las tres operaciones de una plaza.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :return: filas encontradas en el orden definido por la consulta.
    :rtype: list[dict]

    Usage::

        operations(conn, session_id, "jimena-duran")
    """
    return [dict(r) for r in c.execute('SELECT * FROM race_operations WHERE session_id=? AND roster_key=? ORDER BY attempt_no', (sid, key))]

def operation(c: sqlite3.Connection, sid: str, key: str, oid: str) -> dict | None:
    """Consulta un identificador de operación propio.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :param oid: UUID de la operación propia.
    :return: fila encontrada o None si no existe.
    :rtype: dict | None

    Usage::

        operation(conn, session_id, "jimena-duran", operation_id)
    """
    row = c.execute('SELECT * FROM race_operations WHERE session_id=? AND roster_key=? AND operation_id=?', (sid, key, oid)).fetchone()
    return dict(row) if row else None

def count_operations(c: sqlite3.Connection, sid: str, key: str) -> int:
    """Cuenta reservas y resultados sin devolver presupuesto.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :return: contador o identificador guardado.
    :rtype: int

    Usage::

        count_operations(conn, session_id, "jimena-duran")
    """
    return c.execute('SELECT COUNT(*) FROM race_operations WHERE session_id=? AND roster_key=?', (sid, key)).fetchone()[0]

def ranking(c: sqlite3.Connection, sid: str) -> list[dict]:
    """Lee asistencias reales por orden de confirmación.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :return: filas encontradas en el orden definido por la consulta.
    :rtype: list[dict]

    Usage::

        ranking(conn, session_id)
    """
    return [dict(r) for r in c.execute('SELECT id,name,checked_at FROM checkins WHERE session_id=? ORDER BY id', (sid,))]

def create(c: sqlite3.Connection, sid: str, title: str, opened: str, secret: bytes, prepared: float, expires: float, entry: str, roster: list | tuple) -> None:
    """Inserta clase, carrera y plazas sin confirmar la conexión.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param title: título recibido para la clase.
    :param opened: fecha de creación en el formato existente.
    :param secret: secreto de clase usado por el código rotatorio.
    :param prepared: instante Unix de preparación.
    :param expires: límite original de vigencia en segundos Unix.
    :param entry: secreto vigente de entrada al lobby.
    :param roster: lista canónica de nombres y personajes.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        create(conn, session_id, "Clase", opened_at, secret, 1800000000.0, 1800007200.0, entry_secret, ROSTER)
    """
    c.execute('INSERT INTO sessions(id,title,secret,opened_at) VALUES (?,?,?,?)', (sid, title, secret.hex(), opened))
    c.execute('INSERT INTO races(session_id,prepared_at,expires_at,join_secret) VALUES (?,?,?,?)', (sid, prepared, expires, entry))
    c.executemany('INSERT INTO race_slots(session_id,roster_key,display_name,character_slug) VALUES (?,?,?,?)', [(sid, r['key'], r['name'], r['character']) for r in roster])

def occupy(c: sqlite3.Connection, sid: str, key: str, digest: str) -> None:
    """Guarda hash y ocupación de una plaza libre.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :param digest: hash SHA-256 del permiso, sin guardar su valor original.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        occupy(conn, session_id, "jimena-duran", credential_hash)
    """
    c.execute('INSERT INTO race_access VALUES (?,?,?)', (sid, key, digest))
    c.execute("UPDATE race_slots SET state='listo' WHERE session_id=? AND roster_key=?", (sid, key))

def release(c: sqlite3.Connection, sid: str, key: str) -> None:
    """Revoca el acceso sin recrear la plaza.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        release(conn, session_id, "jimena-duran")
    """
    c.execute('DELETE FROM race_access WHERE session_id=? AND roster_key=?', (sid, key))
    c.execute("UPDATE race_slots SET state='pendiente' WHERE session_id=? AND roster_key=?", (sid, key))

def start(c: sqlite3.Connection, sid: str, instant: float) -> None:
    """Fija grupo, salida y revoca el secreto del lobby.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param instant: instante del cambio en el formato indicado por el tipo.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        start(conn, session_id, instant)
    """
    c.execute("UPDATE race_slots SET included_at_start=(state='listo') WHERE session_id=?", (sid,))
    c.execute('UPDATE races SET starts_at=?,join_secret=NULL WHERE session_id=?', (instant, sid))

def close(c: sqlite3.Connection, sid: str, instant: str) -> None:
    """Conserva el primer cierre y revoca las altas.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param instant: instante del cambio en el formato indicado por el tipo.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        close(conn, session_id, instant)
    """
    c.execute('UPDATE sessions SET closed_at=? WHERE id=? AND closed_at IS NULL', (instant, sid))
    c.execute('UPDATE races SET join_secret=NULL WHERE session_id=?', (sid,))

def insert_operation(c: sqlite3.Connection, sid: str, key: str, oid: str, number: int, fingerprint: str) -> None:
    """Reserva una oportunidad; el llamante confirma antes de evaluar.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :param oid: UUID de la operación propia.
    :param number: número de oportunidad de uno a tres.
    :param fingerprint: HMAC del contenido normalizado; no es el código enviado.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        insert_operation(conn, session_id, "jimena-duran", operation_id, 1, fingerprint)
    """
    c.execute('INSERT INTO race_operations(session_id,roster_key,operation_id,attempt_no,payload_fingerprint) VALUES (?,?,?,?,?)', (sid, key, oid, number, fingerprint))

def complete_operation(c: sqlite3.Connection, sid: str, key: str, oid: str, kind: str, status: int, checkin: int | None=None) -> None:
    """Completa resultado dentro de la transacción B.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :param oid: UUID de la operación propia.
    :param kind: tipo de resultado que queda confirmado.
    :param status: estado HTTP del resultado.
    :param checkin: asistencia confirmada o ausencia de ella.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        complete_operation(conn, session_id, "jimena-duran", operation_id, "invalid_code", 422, None)
    """
    c.execute("UPDATE race_operations SET state='completed',result_kind=?,result_status=?,checkin_id=? WHERE session_id=? AND roster_key=? AND operation_id=? AND state='reserved'", (kind, status, checkin, sid, key, oid))

def add_checkin(c: sqlite3.Connection, sid: str, key: str, name: str, normalized: str, instant: str) -> int:
    """Inserta asistencia y enlaza su plaza, sin commit interno.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :param name: nombre canónico del roster.
    :param normalized: nombre normalizado para la unicidad existente.
    :param instant: instante del cambio en el formato indicado por el tipo.
    :return: contador o identificador guardado.
    :rtype: int

    Usage::

        add_checkin(conn, session_id, "jimena-duran", "Jimena Duran", "jimena duran", instant)
    """
    cursor = c.execute('INSERT INTO checkins(session_id,name,name_key,checked_at) VALUES (?,?,?,?)', (sid, name, normalized, instant))
    cid = cursor.lastrowid
    c.execute("UPDATE race_slots SET state='registrado',checkin_id=? WHERE session_id=? AND roster_key=?", (cid, sid, key))
    return cid

def remove_checkin(c: sqlite3.Connection, sid: str, cid: int) -> bool:
    """Retira plaza antes de borrar asistencia de la misma clase.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param cid: identificador de la asistencia que se retira.
    :return: resultado de la condición consultada.
    :rtype: bool

    Usage::

        remove_checkin(conn, session_id, 1)
    """
    c.execute("UPDATE race_slots SET state='retirado' WHERE session_id=? AND checkin_id=?", (sid, cid))
    return c.execute('DELETE FROM checkins WHERE session_id=? AND id=?', (sid, cid)).rowcount == 1

def all_registered(c: sqlite3.Connection, sid: str) -> bool:
    """Consulta si el grupo no vacío ya tiene todas sus asistencias.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :return: resultado de la condición consultada.
    :rtype: bool

    Usage::

        all_registered(conn, session_id)
    """
    row = c.execute('SELECT COUNT(*),SUM(checkin_id IS NOT NULL) FROM race_slots WHERE session_id=? AND included_at_start=1', (sid,)).fetchone()
    return row[0] > 0 and row[0] == row[1]

def expired(c: sqlite3.Connection, now: float) -> list[str]:
    """Busca trabajo vencido sin reescribir carreras limpias.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param now: instante Unix leído del servidor.
    :return: identificadores de carreras con limpieza pendiente.
    :rtype: list[str]

    Usage::

        expired(conn, 1800000000.0)
    """
    return [r[0] for r in c.execute('SELECT r.session_id FROM races r JOIN sessions s ON s.id=r.session_id WHERE expires_at<=? AND (s.closed_at IS NULL OR join_secret IS NOT NULL OR EXISTS(SELECT 1 FROM race_access a WHERE a.session_id=r.session_id) OR EXISTS(SELECT 1 FROM race_operations o WHERE o.session_id=r.session_id))', (now,))]

def purge(c: sqlite3.Connection, sid: str) -> None:
    """Elimina solo secretos y operaciones temporales de carrera.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        purge(conn, session_id)
    """
    c.execute('UPDATE races SET join_secret=NULL WHERE session_id=?', (sid,))
    c.execute('DELETE FROM race_access WHERE session_id=?', (sid,))
    c.execute('DELETE FROM race_operations WHERE session_id=?', (sid,))
