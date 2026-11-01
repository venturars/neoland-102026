"""Acciones de carrera: reserva duradera A y confirmación B, sin HTTP."""
from contextlib import closing, contextmanager
from datetime import datetime, timezone
from hashlib import sha256
import hmac
import json
import re
import secrets
from pathlib import Path
from threading import Lock
from typing import Callable, Iterator
from uuid import uuid4
import sqlite3
from ..domain.race import RaceError, phase, valid_operation_id, MAX_ATTEMPTS, COUNTDOWN_SECONDS, LIFETIME_SECONDS
from ..domain.roster import resolve_slot
from .roster import prepare_catalog
from ..domain.names import name_key
from ..domain.codes import code_for, seconds_left, is_valid_code
from ..domain.registration import normalize_address
from ..storage import races as store
Clock = Callable[[], float]

def _is_busy(exc: sqlite3.OperationalError) -> bool:
    """Reconoce bloqueos por código SQLite, sin ocultar otros fallos SQL.

    :param exc: fallo operativo de SQLite.
    :return: si el código base indica BUSY o LOCKED.
    :rtype: bool

    Usage::

        _is_busy(error)
    """
    return (getattr(exc, 'sqlite_errorcode', 0) & 255) in (sqlite3.SQLITE_BUSY, sqlite3.SQLITE_LOCKED)

def _connect(db: str | Path) -> sqlite3.Connection:
    """Abre conexión y traduce un bloqueo anterior a cualquier transacción.

    :param db: archivo local de asistencia.
    :return: conexión configurada que debe cerrar el llamante.
    :rtype: sqlite3.Connection

    Usage::

        _connect(path)
    """
    try:
        return store.connect(db)
    except sqlite3.OperationalError as exc:
        if _is_busy(exc):
            raise RaceError("storage_busy", 'El servicio está ocupado. Repite el mismo envío sin crear otro.') from None
        raise

@contextmanager
def _reading_connection(db: str | Path) -> Iterator[sqlite3.Connection]:
    """Acota conexiones de lectura y traduce contención sin reserva nueva.

    :param db: archivo local de asistencia.
    :return: conexión de lectura cerrada también ante errores.
    :rtype: Iterator[sqlite3.Connection]

    Usage::

        _reading_connection(path)
    """
    with closing(_connect(db)) as c:
        try:
            yield c
        except sqlite3.OperationalError as exc:
            if _is_busy(exc):
                raise RaceError("storage_busy", 'El servicio está ocupado. Repite el mismo envío sin crear otro.') from None
            raise

def _iso(now: float) -> str:
    """Convierte reloj del servidor a la fecha existente de asistencia.

    :param now: instante Unix leído del servidor.
    :return: texto derivado sin publicar secretos adicionales.
    :rtype: str

    Usage::

        _iso(1800000000.0)
    """
    return datetime.fromtimestamp(now, timezone.utc).isoformat(timespec='milliseconds')

def _commit(c: sqlite3.Connection, stage: str) -> None:
    """Confirma una frontera explícita; stage permite inyectar fallos en tests.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param stage: frontera de confirmación para verificar fallos A/B.
    :return: None después de confirmar la transacción actual.
    :rtype: None

    Usage::

        _commit(conn, "A")
    """
    c.commit()

def _purge_expired(c: sqlite3.Connection, now: float) -> None:
    """Cierra y limpia únicamente carreras vencidas que aún tienen trabajo.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param now: instante Unix leído del servidor.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        _purge_expired(conn, 1800000000.0)
    """
    for sid in store.expired(c, now):
        store.close(c, sid, _iso(now))
        store.purge(c, sid)

@contextmanager
def _write(db: str | Path, clock: Clock, stage: str='action') -> Iterator[sqlite3.Connection]:
    """Una escritura explícita; nunca devuelve consumo de otra transacción.

    :param db: archivo local de la copia de asistencia.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :param stage: frontera de confirmación para verificar fallos A/B.
    :return: conexión temporal que se cierra al salir del contexto.
    :rtype: Iterator[sqlite3.Connection]

    Usage::

        _write(path, clock, "A")
    """
    c = _connect(db)
    try:
        try:
            c.execute('BEGIN IMMEDIATE')
        except sqlite3.OperationalError as exc:
            if _is_busy(exc):
                raise RaceError("storage_busy", 'El servicio está ocupado. Repite el mismo envío sin crear otro.') from None
            raise
        yield c
        _commit(c, stage)
    except RaceError as exc:
        if exc.reason in ('access_expired', 'entry_closed'):
            _purge_expired(c, clock())
            _commit(c, 'expiry')
        else:
            c.rollback()
        raise
    except BaseException:
        c.rollback()
        raise
    finally:
        c.close()

def cleanup(db: str | Path, clock: Clock) -> None:
    """Limpia al atender tráfico o arrancar, sin escritura si no hay vencidos.

    :param db: archivo local de la copia de asistencia.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        cleanup(path, clock)
    """
    with _reading_connection(db) as c:
        if not store.expired(c, clock()):
            return
    with _write(db, clock, 'cleanup') as c:
        _purge_expired(c, clock())

@contextmanager
def _read(db: str | Path, clock: Clock) -> Iterator[sqlite3.Connection]:
    """Mantiene una instantánea; una caducidad rechazada se limpia tras soltarla.

    :param db: archivo local de la copia de asistencia.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: conexión temporal que se cierra al salir del contexto.
    :rtype: Iterator[sqlite3.Connection]

    Usage::

        _read(path, clock)
    """
    cleanup(db, clock)
    with _reading_connection(db) as c:
        try:
            c.execute('BEGIN')
            yield c
        except RaceError as exc:
            c.rollback()
            if exc.reason in ('access_expired', 'entry_closed'):
                cleanup(db, clock)
            raise
        finally:
            c.rollback()

def _require_unexpired(r: dict, now: float) -> None:
    """Rechaza acceso temporal en el límite original, sin prolongarlo.

    :param r: metadatos de la carrera consultada.
    :param now: instante Unix recién leído del servidor.
    :return: None si el acceso sigue vigente; si no, rechaza su caducidad.
    :rtype: None

    Usage::

        _require_unexpired(race, clock())
    """
    if now >= r['expires_at']:
        raise RaceError("access_expired", 'Tu acceso a esta carrera ha caducado. Consulta al profesor.')

def _race(c: sqlite3.Connection, sid: str, now: float, temporal: bool=False) -> dict:
    """Exige carrera real y, para permisos temporales, caducidad no alcanzada.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param sid: identificador de la carrera guardada.
    :param now: instante Unix leído del servidor.
    :param temporal: exigir caducidad antes de devolver datos privados.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        _race(conn, session_id, 1800000000.0, True)
    """
    r = store.get_race(c, sid)
    if r is None:
        raise RaceError("race_missing", 'Esta carrera no existe. Revisa el enlace.')
    if temporal:
        _require_unexpired(r, now)
    return r

def is_race(db: str | Path, sid: str) -> bool:
    """Consulta modo guardado para impedir desvíos por campos del cliente.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :return: resultado de la condición consultada.
    :rtype: bool

    Usage::

        is_race(path, session_id)
    """
    with _reading_connection(db) as c:
        return store.has_mode(c, sid)

def _phase(r: dict, now: float) -> str:
    """Deriva fase desde los valores guardados y el reloj actual.

    :param r: fila de carrera con sus metadatos internos.
    :param now: instante Unix leído del servidor.
    :return: texto derivado sin publicar secretos adicionales.
    :rtype: str

    Usage::

        _phase(race, 1800000000.0)
    """
    return phase(r['starts_at'], r['closed_at'], r['expires_at'], now)

def _access(c: sqlite3.Connection, r: dict, token: object) -> dict:
    """Exige permiso propio sin tratar nombres o direcciones como identidad.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param r: fila de carrera con sus metadatos internos.
    :param token: permiso propio recibido; nunca una identidad basada en IP.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        _access(conn, race, credential)
    """
    if not isinstance(token, str) or re.fullmatch('[A-Za-z0-9_-]{43}', token) is None:
        raise RaceError("access_denied", 'Acceso de carrera no válido. Abre tu acceso original.')
    digest = sha256(token.encode()).hexdigest()
    slot = store.access_slot(c, r['session_id'], digest)
    if slot is None or not hmac.compare_digest(digest, slot['credential_hash']):
        raise RaceError("access_denied", 'Acceso de carrera no válido. No se repone después de la salida.')
    return slot

def _times(r: dict, now: float) -> dict:
    """Expone solo tiempos y fase, nunca secretos de clase.

    :param r: fila de carrera con sus metadatos internos.
    :param now: instante Unix leído del servidor.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        _times(race, 1800000000.0)
    """
    return {'phase': _phase(r, now), 'serverNow': now, 'startsAt': r['starts_at'], 'expiresAt': r['expires_at']}

def _own(c: sqlite3.Connection, r: dict, slot: dict, now: float, token: str) -> dict:
    """Construye lectura privada propia desde filas reales.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param r: fila de carrera con sus metadatos internos.
    :param slot: plaza propia obtenida del almacén.
    :param now: instante Unix leído del servidor.
    :param token: permiso propio recibido; nunca una identidad basada en IP.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        _own(conn, race, own_slot, 1800000000.0, credential)
    """
    sid = r['session_id']
    ops = store.operations(c, sid, slot['roster_key'])
    ranking = store.ranking(c, sid)
    result = next(({'id': row['id'], 'name': row['name'], 'checkedAt': row['checked_at'], 'position': i} for i, row in enumerate(ranking, 1) if row['id'] == slot['checkin_id']), None)
    csrf = hmac.new(r['secret'], f'race-csrf-v1:{sid}:{token}'.encode(), sha256).hexdigest()
    return {**_times(r, now), 'roster_key': slot['roster_key'], 'name': slot['display_name'], 'character': slot['character_slug'], 'state': slot['state'], 'remaining': MAX_ATTEMPTS - len(ops), 'operations': [{'operation_id': o['operation_id'], 'state': o['state']} for o in ops], 'result': result, 'csrfToken': csrf}

def _teacher(c: sqlite3.Connection, r: dict, now: float) -> dict:
    """Vista autorizable del profesor; el borde transforma entrada a URL.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param r: fila de carrera con sus metadatos internos.
    :param now: instante Unix leído del servidor.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        _teacher(conn, race, 1800000000.0)
    """
    ranking = store.ranking(c, r['session_id'])
    positions = {row['id']: i for i, row in enumerate(ranking, 1)}
    data = {**_times(r, now), 'id': r['session_id'], 'title': r['title'], 'mode': 'race', 'open': _phase(r, now) == 'open', 'openedAt': r['opened_at'], 'closedAt': r['closed_at'], 'total': len(ranking), 'checkins': [{'id': row['id'], 'name': row['name'], 'checkedAt': row['checked_at'], 'position': positions[row['id']]} for row in ranking], 'roster': [{'key': s['roster_key'], 'name': s['display_name'], 'character': s['character_slug'], 'state': s['state'], 'included': bool(s['included_at_start']), 'position': positions.get(s['checkin_id'])} for s in store.slots(c, r['session_id'])]}
    if _phase(r, now) == 'lobby':
        data['entrySecret'] = r['join_secret']
    if _phase(r, now) == 'open':
        data.update(code=code_for(r['secret'], now), secondsLeft=seconds_left(now))
    return data

def prepare(db: str | Path, title: object, clock: Clock) -> dict:
    """Crea clase, carrera y plazas del catálogo juntas, sin presencias.

    :param db: archivo local de la copia de asistencia.
    :param title: título recibido para la clase.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        prepare(path, "Clase", clock)
    """
    with _write(db, clock) as c:
        roster = prepare_catalog(c)
        now = clock()
        sid = secrets.token_urlsafe(6)
        label = str(title or '').strip() or datetime.fromtimestamp(now).strftime('%d/%m/%Y %H:%M')
        store.create(c, sid, label, _iso(now), secrets.token_bytes(16), now, now + LIFETIME_SECONDS, secrets.token_urlsafe(32), roster)
        return {'id': sid, 'title': label, **_times(_race(c, sid, now), now)}

def teacher_state(db: str | Path, sid: str, clock: Clock) -> dict:
    """Consulta fase, grupo y clasificación sin esperar a la presentación.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        teacher_state(path, session_id, clock)
    """
    with _read(db, clock) as c:
        now = clock()
        return _teacher(c, _race(c, sid, now), now)

def _entry(r: dict, entry: object, now: float) -> None:
    """Valida secreto de entrada solo en lobby vigente.

    :param r: fila de carrera con sus metadatos internos.
    :param entry: secreto vigente de entrada al lobby.
    :param now: instante Unix leído del servidor.
    :return: None; los cambios permanecen bajo la transacción del llamante.
    :rtype: None

    Usage::

        _entry(race, entry_secret, 1800000000.0)
    """
    if _phase(r, now) != 'lobby':
        raise RaceError("entry_closed", 'La entrada a esta carrera ya está cerrada.')
    if not isinstance(entry, str) or re.fullmatch('[A-Za-z0-9_-]{43}', entry) is None or (not hmac.compare_digest(entry, r['join_secret'] or '')):
        raise RaceError("access_denied", 'El enlace de entrada no es válido. Pide el enlace actual al profesor.')

def lobby(db: str | Path, sid: str, entry: object, clock: Clock) -> dict:
    """Lista disponibilidad con entrada vigente, sin códigos o permisos ajenos.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param entry: secreto vigente de entrada al lobby.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        lobby(path, session_id, entry_secret, clock)
    """
    with _read(db, clock) as c:
        r = _race(c, sid, clock())
        now = clock()
        _require_unexpired(r, now)
        _entry(r, entry, now)
        roster = [{'key': s['roster_key'], 'name': s['display_name'], 'character': s['character_slug'], 'available': s['state'] == 'pendiente'} for s in store.slots(c, sid)]
        now = clock()
        _require_unexpired(r, now)
        return {**_times(r, now), 'roster': roster}

def _resolve_race_slot(connection: sqlite3.Connection, session_id: str, value: object) -> dict | None:
    """Resuelve contra las plazas guardadas, nunca contra el catálogo actual."""
    slots = store.slots(connection, session_id)
    roster = [{'key': slot['roster_key'], 'name': slot['display_name'], 'character': slot['character_slug']} for slot in slots]
    return resolve_slot(value, roster)


def join(db: str | Path, sid: str, entry: object, key: object, existing: object, clock: Clock) -> tuple[dict, str | None]:
    """Ocupa una plaza; el permiso se entrega aparte para fijar cookie.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param entry: secreto vigente de entrada al lobby.
    :param key: clave canónica de la plaza del roster.
    :param existing: permiso previo del navegador para esta misma carrera.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: resultado del contrato descrito, con el tipo indicado.
    :rtype: tuple[dict, str | None]

    Usage::

        join(path, session_id, entry_secret, "jimena-duran", None, clock)
    """
    with _write(db, clock) as c:
        now = clock()
        r = _race(c, sid, now, True)
        _entry(r, entry, now)
        if existing:
            try:
                owned = _access(c, r, existing)
            except RaceError:
                owned = None
            if owned is not None:
                return (_own(c, r, owned, now, existing), None)
        ref = _resolve_race_slot(c, sid, key)
        if ref is None:
            raise RaceError("invalid_input", 'Elige un nombre de la lista.')
        s = store.slot(c, sid, ref['key'])
        if s['state'] != 'pendiente':
            raise RaceError("state_conflict", 'Ese nombre ya está ocupado. Revisa tu selección con el profesor.')
        token = secrets.token_urlsafe(32)
        store.occupy(c, sid, ref['key'], sha256(token.encode()).hexdigest())
        return (_own(c, r, store.slot(c, sid, ref['key']), now, token), token)

def release(db: str | Path, sid: str, key: object, clock: Clock) -> dict:
    """Revoca una ocupación solo antes de fijar el grupo.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param key: clave canónica de la plaza del roster.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        release(path, session_id, "jimena-duran", clock)
    """
    with _write(db, clock) as c:
        now = clock()
        r = _race(c, sid, now, True)
        if _phase(r, now) != 'lobby':
            raise RaceError("state_conflict", 'No se pueden liberar plazas después de la salida.')
        ref = _resolve_race_slot(c, sid, key)
        if ref is None:
            raise RaceError("invalid_input", 'Elige un nombre de la lista.')
        store.release(c, sid, ref['key'])
        return _teacher(c, r, now)

def start(db: str | Path, sid: str, clock: Clock) -> dict:
    """Fija una salida idempotente y revoca nuevas entradas.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        start(path, session_id, clock)
    """
    with _write(db, clock) as c:
        now = clock()
        r = _race(c, sid, now, True)
        if r['closed_at'] is not None:
            raise RaceError("state_conflict", 'Esta carrera ya está cerrada.')
        if r['starts_at'] is not None:
            return _teacher(c, r, now)
        if not any((s['state'] == 'listo' for s in store.slots(c, sid))):
            raise RaceError("state_conflict", 'Debe entrar al menos un participante para empezar.')
        store.start(c, sid, now + COUNTDOWN_SECONDS)
        return _teacher(c, _race(c, sid, now), now)

def me(db: str | Path, sid: str, token: object, clock: Clock) -> dict:
    """Recupera solo la plaza propia antes del límite temporal.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param token: permiso propio recibido; nunca una identidad basada en IP.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        me(path, session_id, credential, clock)
    """
    with _read(db, clock) as c:
        r = _race(c, sid, clock())
        now = clock()
        _require_unexpired(r, now)
        slot = _access(c, r, token)
        data = _own(c, r, slot, now, token)
        now = clock()
        _require_unexpired(r, now)
        data.update(_times(r, now))
        return data

def close(db: str | Path, sid: str, clock: Clock) -> dict:
    """Cierra una vez, sin eliminar reservas gastadas ni accesos de lectura.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        close(path, session_id, clock)
    """
    cleanup(db, clock)
    with _write(db, clock) as c:
        now = clock()
        _race(c, sid, now)
        store.close(c, sid, _iso(now))
        return _teacher(c, _race(c, sid, now), now)

def remove_checkin(db: str | Path, sid: str, cid: int, clock: Clock) -> bool:
    """Retira asistencia de su clase sin reabrir plaza o presupuesto.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param cid: identificador de la asistencia que se retira.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: resultado de la condición consultada.
    :rtype: bool

    Usage::

        remove_checkin(path, session_id, 1, clock)
    """
    cleanup(db, clock)
    with _write(db, clock) as c:
        _race(c, sid, clock())
        return store.remove_checkin(c, sid, cid)

def export_checkins(db: str | Path, sid: str) -> tuple[dict, list[dict]]:
    """Entrega solo asistencias reales, en orden de confirmación.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :return: resultado del contrato descrito, con el tipo indicado.
    :rtype: tuple[dict, list[dict]]

    Usage::

        export_checkins(path, session_id)
    """
    with _reading_connection(db) as c:
        session = store.get_session(c, sid)
        if session is None:
            raise RaceError("race_missing", 'Esta carrera no existe.')
        return (session, store.ranking(c, sid))

def _fingerprint(race: dict, roster_key: str, fields: dict) -> str:
    """Resume el contenido normalizado sin guardar el código enviado."""
    if 'code' not in fields:
        payload = ['missing']
    elif isinstance(fields['code'], str):
        payload = ['string', fields['code'].strip()]
    else:
        payload = ['other', fields['code']]
    content = json.dumps(
        ['race-operation-v1', race['session_id'], roster_key, payload],
        ensure_ascii=True, separators=(',', ':'), sort_keys=True,
    )
    return hmac.new(race['secret'], content.encode(), sha256).hexdigest()


def _operation_result(connection: sqlite3.Connection, race: dict, slot: dict,
                      operation: dict, now: float, token: str) -> tuple[dict, str]:
    """Recupera el resultado confirmado; una reserva no vuelve a evaluarse."""
    data = _own(connection, race, slot, now, token)
    if slot['state'] == 'retirado':
        return {**data, 'message': 'El profesor retiró tu asistencia.'}, 'removed'
    if operation['state'] == 'reserved':
        return {
            **data, 'operationState': 'unconfirmed',
            'message': 'Este envío aún no tiene resultado confirmado. El intento sigue gastado. Consulta tu estado.',
        }, 'unconfirmed'
    result_kind = operation['result_kind']
    if result_kind in ('success', 'already'):
        return {**data, 'already': True}, 'already_registered'
    messages = {
        'invalid_code': 'El código no es válido o ha caducado. Pide el código actual al profesor.',
        'invalid_operation': 'El envío no tiene un identificador válido. El intento se ha gastado.',
        'not_processed': 'El registro no está disponible. Consulta el estado de la carrera.',
    }
    return {**data, 'error': messages[result_kind]}, result_kind


def _reserve(db: str | Path, session_id: str, token: str, fields: dict,
             clock: Clock) -> tuple[dict, str] | Callable[[], tuple[dict, str]]:
    """Confirma A antes de entregar una función local de un solo uso para B."""
    with _write(db, clock, 'A') as connection:
        now = clock()
        race = _race(connection, session_id, now, True)
        slot = _access(connection, race, token)
        roster_key = slot['roster_key']
        if not slot['included_at_start']:
            raise RaceError('state_conflict', 'Espera la salida del profesor.')
        if slot['state'] == 'retirado':
            data = _own(connection, race, slot, now, token)
            return {**data, 'message': 'El profesor retiró tu asistencia.'}, 'removed'
        operation_id = fields.get('operation_id')
        valid_id = valid_operation_id(operation_id)
        fingerprint = _fingerprint(race, roster_key, fields)
        previous = store.operation(connection, session_id, roster_key, operation_id) if valid_id else None
        if previous is not None:
            if not hmac.compare_digest(fingerprint, previous['payload_fingerprint']):
                raise RaceError('state_conflict', 'Ese envío ya se usó con otro contenido. Consulta tu estado.')
            return _operation_result(connection, race, slot, previous, now, token)
        if slot['checkin_id'] is not None:
            data = _own(connection, race, slot, now, token)
            return {**data, 'already': True}, 'already_registered'
        if _phase(race, now) != 'open':
            raise RaceError('state_conflict', 'El registro de carrera no está abierto. Consulta al profesor.')
        used_attempts = store.count_operations(connection, session_id, roster_key)
        if used_attempts >= MAX_ATTEMPTS:
            raise RaceError('attempts_exhausted', 'No te quedan intentos en esta carrera.')
        if not valid_id:
            operation_id = str(uuid4())
        store.insert_operation(connection, session_id, roster_key, operation_id,
                               used_attempts + 1, fingerprint)
        raw_code = fields.get('code')
        if not valid_id or not isinstance(raw_code, str) or re.fullmatch('[0-9]{4}', raw_code.strip()) is None:
            result_kind = 'invalid_operation' if not valid_id else 'invalid_code'
            store.complete_operation(connection, session_id, roster_key, operation_id, result_kind)
            operation = store.operation(connection, session_id, roster_key, operation_id)
            return _operation_result(connection, race, slot, operation, now, token)
        code = raw_code.strip()

    # Este punto solo se alcanza si el commit A terminó sin error ni incertidumbre.
    used = False
    claim_lock = Lock()

    def execute_once() -> tuple[dict, str]:
        """Consume el permiso antes de B; un fallo posterior nunca lo repone."""
        nonlocal used
        with claim_lock:
            if used:
                raise RuntimeError('La ejecución local de esta reserva ya se utilizó')
            used = True
        return _finalize(db, session_id, token, roster_key, operation_id, code, clock)

    return execute_once


def _finalize(db: str | Path, session_id: str, token: str, roster_key: str,
              operation_id: str, code: str, clock: Clock) -> tuple[dict, str]:
    """Confirma B para los datos capturados por la única ejecución local de A."""
    try:
        with _write(db, clock, 'B') as connection:
            now = clock()
            race = _race(connection, session_id, now, True)
            slot = _access(connection, race, token)
            operation = store.operation(connection, session_id, roster_key, operation_id)
            if slot['roster_key'] != roster_key or operation is None or operation['state'] != 'reserved':
                raise RaceError('state_conflict', 'Este envío ya no puede procesarse. Consulta tu estado.')
            if (not slot['included_at_start'] or slot['state'] == 'retirado'
                    or slot['checkin_id'] is not None or _phase(race, now) != 'open'):
                result_kind = 'already' if slot['checkin_id'] is not None else 'not_processed'
                store.complete_operation(connection, session_id, roster_key, operation_id,
                                         result_kind, slot['checkin_id'])
                operation = store.operation(connection, session_id, roster_key, operation_id)
                return _operation_result(connection, race, slot, operation, now, token)
            if not is_valid_code(race['secret'], code, now):
                store.complete_operation(connection, session_id, roster_key, operation_id, 'invalid_code')
                operation = store.operation(connection, session_id, roster_key, operation_id)
                return _operation_result(connection, race, slot, operation, now, token)
            checkin_id = store.add_checkin(
                connection, session_id, roster_key, slot['display_name'],
                name_key(slot['display_name']), _iso(now),
            )
            store.complete_operation(connection, session_id, roster_key, operation_id, 'success', checkin_id)
            if store.all_registered(connection, session_id):
                store.close(connection, session_id, _iso(now))
            race = _race(connection, session_id, now)
            slot = store.slot(connection, session_id, roster_key)
            return _own(connection, race, slot, now, token), 'registered'
    except RaceError as exc:
        if exc.reason != 'storage_busy':
            raise
        return {
            'operationState': 'unconfirmed',
            'message': 'No se pudo confirmar este envío. El intento sigue gastado. Consulta tu estado.',
        }, 'unconfirmed'


def attempt(db: str | Path, sid: str, token: object, fields: dict,
            address: str | None, clock: Clock) -> tuple[dict, str]:
    """Coordina la reserva y su resultado sin repetir una evaluación.

    :param db: archivo local de asistencia.
    :param sid: identificador de la carrera.
    :param token: permiso propio del participante.
    :param fields: contenido del envío autorizado.
    :param address: dirección fiable de conexión; no identifica a la plaza.
    :param clock: reloj del servidor en segundos Unix.
    :return: datos visibles y significado del resultado; el adaptador decide HTTP.
    :rtype: tuple[dict, str]

    Usage::

        attempt(path, session_id, credential, fields, "127.0.0.1", clock)
    """
    if normalize_address(address) is None:
        raise RaceError('origin_unavailable', 'No se ha podido identificar el origen de conexión. Consulta al profesor.')
    reserved = _reserve(db, sid, token, fields, clock)
    if callable(reserved):
        return reserved()
    return reserved
