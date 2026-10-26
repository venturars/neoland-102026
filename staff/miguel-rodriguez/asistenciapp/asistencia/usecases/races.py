"""Acciones de carrera: reserva duradera A y confirmación B, sin HTTP."""
from contextlib import closing, contextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from hashlib import sha256
import hmac
import json
import re
import secrets
from pathlib import Path
from typing import Callable, Iterator
from uuid import uuid4
import sqlite3
from ..domain.race import RaceError, Outcome, phase, valid_operation_id, MAX_ATTEMPTS, COUNTDOWN_SECONDS, LIFETIME_SECONDS
from ..domain.roster import ROSTER, resolve_slot
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
            raise RaceError(503, 'El servicio está ocupado. Repite el mismo envío sin crear otro.') from None
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
                raise RaceError(503, 'El servicio está ocupado. Repite el mismo envío sin crear otro.') from None
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
                raise RaceError(503, 'El servicio está ocupado. Repite el mismo envío sin crear otro.') from None
            raise
        yield c
        _commit(c, stage)
    except RaceError as exc:
        if exc.status == 410:
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
            if exc.status == 410:
                cleanup(db, clock)
            raise
        finally:
            c.rollback()

def _require_unexpired(r: dict, now: float) -> None:
    """Rechaza acceso temporal en el límite original, sin prolongarlo.

    :param r: metadatos de la carrera consultada.
    :param now: instante Unix recién leído del servidor.
    :return: None si el acceso no ha caducado; de lo contrario lanza 410.
    :rtype: None

    Usage::

        _require_unexpired(race, clock())
    """
    if now >= r['expires_at']:
        raise RaceError(410, 'Tu acceso a esta carrera ha caducado. Consulta al profesor.')

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
        raise RaceError(404, 'Esta carrera no existe. Revisa el enlace.')
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
        raise RaceError(403, 'Acceso de carrera no válido. Abre tu acceso original.')
    digest = sha256(token.encode()).hexdigest()
    slot = store.access_slot(c, r['session_id'], digest)
    if slot is None or not hmac.compare_digest(digest, slot['credential_hash']):
        raise RaceError(403, 'Acceso de carrera no válido. No se repone después de la salida.')
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
    """Crea clase, carrera y quince plazas juntas, sin presencias.

    :param db: archivo local de la copia de asistencia.
    :param title: título recibido para la clase.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos autorizados del contrato, según la responsabilidad de esta función.
    :rtype: dict

    Usage::

        prepare(path, "Clase", clock)
    """
    with _write(db, clock) as c:
        now = clock()
        sid = secrets.token_urlsafe(6)
        label = str(title or '').strip() or datetime.fromtimestamp(now).strftime('%d/%m/%Y %H:%M')
        store.create(c, sid, label, _iso(now), secrets.token_bytes(16), now, now + LIFETIME_SECONDS, secrets.token_urlsafe(32), ROSTER)
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
        raise RaceError(410, 'La entrada a esta carrera ya está cerrada.')
    if not isinstance(entry, str) or re.fullmatch('[A-Za-z0-9_-]{43}', entry) is None or (not hmac.compare_digest(entry, r['join_secret'] or '')):
        raise RaceError(403, 'El enlace de entrada no es válido. Pide el enlace actual al profesor.')

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
        ref = resolve_slot(key)
        if ref is None:
            raise RaceError(400, 'Elige un nombre de la lista.')
        s = store.slot(c, sid, ref['key'])
        if s['state'] != 'pendiente':
            raise RaceError(409, 'Ese nombre ya está ocupado. Revisa tu selección con el profesor.')
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
            raise RaceError(409, 'No se pueden liberar plazas después de la salida.')
        ref = resolve_slot(key)
        if ref is None:
            raise RaceError(400, 'Elige un nombre de la lista.')
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
            raise RaceError(409, 'Esta carrera ya está cerrada.')
        if r['starts_at'] is not None:
            return _teacher(c, r, now)
        if not any((s['state'] == 'listo' for s in store.slots(c, sid))):
            raise RaceError(409, 'Debe entrar al menos un participante para empezar.')
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
            raise RaceError(404, 'Esta carrera no existe.')
        return (session, store.ranking(c, sid))

@dataclass
class _Execution:
    """Derecho local no serializado del creador de A; una llamada a B."""
    key: str
    oid: str
    used: bool = False

def _fingerprint(r: dict, key: str, fields: dict) -> str:
    """Huella de contenido normalizado sin persistir códigos.

    :param r: fila de carrera con sus metadatos internos.
    :param key: clave canónica de la plaza del roster.
    :param fields: objeto recibido; solo sus campos del contrato tienen autoridad.
    :return: texto derivado sin publicar secretos adicionales.
    :rtype: str

    Usage::

        _fingerprint(race, "jimena-duran", fields)
    """
    if 'code' not in fields:
        payload = ['missing']
    elif isinstance(fields['code'], str):
        payload = ['string', fields['code'].strip()]
    else:
        payload = ['other', fields['code']]
    content = json.dumps(['race-operation-v1', r['session_id'], key, payload], ensure_ascii=True, separators=(',', ':'), sort_keys=True)
    return hmac.new(r['secret'], content.encode(), sha256).hexdigest()

def _operation_result(c: sqlite3.Connection, r: dict, slot: dict, op: dict, now: float, token: str) -> Outcome:
    """Reconstruye resultado propio sin reproducir éxitos retirados.

    :param c: conexión de la transacción actual, sin commit implícito.
    :param r: fila de carrera con sus metadatos internos.
    :param slot: plaza propia obtenida del almacén.
    :param op: operación reservada o completada de la plaza.
    :param now: instante Unix leído del servidor.
    :param token: permiso propio recibido; nunca una identidad basada en IP.
    :return: datos y estado del resultado propio.
    :rtype: Outcome

    Usage::

        _operation_result(conn, race, own_slot, operation, 1800000000.0, credential)
    """
    body = _own(c, r, slot, now, token)
    if slot['state'] == 'retirado':
        return Outcome({**body, 'message': 'El profesor retiró tu asistencia.'})
    if op['state'] == 'reserved':
        return Outcome({**body, 'operationState': 'unconfirmed', 'message': 'Este envío aún no tiene resultado confirmado. El intento sigue gastado. Consulta tu estado.'}, 202)
    kind = op['result_kind']
    if kind in ('success', 'already'):
        return Outcome({**body, 'already': True})
    messages = {'invalid_code': 'El código no es válido o ha caducado. Pide el código actual al profesor.', 'invalid_operation': 'El envío no tiene un identificador válido. El intento se ha gastado.', 'not_processed': 'El registro no está disponible. Consulta el estado de la carrera.'}
    return Outcome({**body, 'error': messages[kind]}, op['result_status'])

def _reserve(db: str | Path, sid: str, token: str, fields: dict, clock: Clock) -> Outcome | _Execution:
    """A confirma consumo; solo una reserva nueva devuelve ejecución local.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param token: permiso propio recibido; nunca una identidad basada en IP.
    :param fields: objeto recibido; solo sus campos del contrato tienen autoridad.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: resultado recuperado o derecho local nuevo para ejecutar B una sola vez.
    :rtype: Outcome | _Execution

    Usage::

        _reserve(path, session_id, credential, fields, clock)
    """
    with _write(db, clock, 'A') as c:
        now = clock()
        r = _race(c, sid, now, True)
        slot = _access(c, r, token)
        key = slot['roster_key']
        if not slot['included_at_start']:
            raise RaceError(409, 'Espera la salida del profesor.')
        if slot['state'] == 'retirado':
            return Outcome({**_own(c, r, slot, now, token), 'message': 'El profesor retiró tu asistencia.'})
        oid = fields.get('operation_id')
        valid_id = valid_operation_id(oid)
        fp = _fingerprint(r, key, fields)
        previous = store.operation(c, sid, key, oid) if valid_id else None
        if previous is not None:
            if not hmac.compare_digest(fp, previous['payload_fingerprint']):
                raise RaceError(409, 'Ese envío ya se usó con otro contenido. Consulta tu estado.')
            return _operation_result(c, r, slot, previous, now, token)
        if slot['checkin_id'] is not None:
            return Outcome({**_own(c, r, slot, now, token), 'already': True})
        if _phase(r, now) != 'open':
            raise RaceError(409, 'El registro de carrera no está abierto. Consulta al profesor.')
        used = store.count_operations(c, sid, key)
        if used >= MAX_ATTEMPTS:
            raise RaceError(429, 'No te quedan intentos en esta carrera.')
        if not valid_id:
            oid = str(uuid4())
        store.insert_operation(c, sid, key, oid, used + 1, fp)
        raw = fields.get('code')
        if not valid_id or not isinstance(raw, str) or re.fullmatch('[0-9]{4}', raw.strip()) is None:
            kind, status = ('invalid_operation', 400) if not valid_id else ('invalid_code', 422)
            store.complete_operation(c, sid, key, oid, kind, status)
            return _operation_result(c, r, slot, store.operation(c, sid, key, oid), now, token)
        return _Execution(key, oid)

def _finalize(db: str | Path, sid: str, token: str, fields: dict, ticket: _Execution, clock: Clock) -> Outcome:
    """B se ejecuta una vez; su rollback no borra A ni permite reanudar.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param token: permiso propio recibido; nunca una identidad basada en IP.
    :param fields: objeto recibido; solo sus campos del contrato tienen autoridad.
    :param ticket: derecho local de ejecución, creado por A y no recuperable del cliente.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos y estado del resultado propio.
    :rtype: Outcome

    Usage::

        _finalize(path, session_id, credential, fields, execution, clock)
    """
    if ticket.used:
        raise RuntimeError('La ejecución local de esta reserva ya se utilizó')
    ticket.used = True
    try:
        with _write(db, clock, 'B') as c:
            now = clock()
            r = _race(c, sid, now, True)
            slot = _access(c, r, token)
            op = store.operation(c, sid, ticket.key, ticket.oid)
            if slot['roster_key'] != ticket.key or op is None or op['state'] != 'reserved':
                raise RaceError(409, 'Este envío ya no puede procesarse. Consulta tu estado.')
            if not slot['included_at_start'] or slot['state'] == 'retirado' or slot['checkin_id'] is not None or (_phase(r, now) != 'open'):
                kind, status = ('already', 200) if slot['checkin_id'] is not None else ('not_processed', 409)
                store.complete_operation(c, sid, ticket.key, ticket.oid, kind, status, slot['checkin_id'])
                return _operation_result(c, r, slot, store.operation(c, sid, ticket.key, ticket.oid), now, token)
            correct = is_valid_code(r['secret'], fields['code'].strip(), now)
            if not correct:
                store.complete_operation(c, sid, ticket.key, ticket.oid, 'invalid_code', 422)
                return _operation_result(c, r, slot, store.operation(c, sid, ticket.key, ticket.oid), now, token)
            cid = store.add_checkin(c, sid, ticket.key, slot['display_name'], name_key(slot['display_name']), _iso(now))
            store.complete_operation(c, sid, ticket.key, ticket.oid, 'success', 201, cid)
            if store.all_registered(c, sid):
                store.close(c, sid, _iso(now))
            return Outcome(_own(c, _race(c, sid, now), store.slot(c, sid, ticket.key), now, token), 201)
    except RaceError as exc:
        if exc.status != 503:
            raise
        return Outcome({'operationState': 'unconfirmed', 'message': 'No se pudo confirmar este envío. El intento sigue gastado. Consulta tu estado.'}, 202)

def attempt(db: str | Path, sid: str, token: object, fields: dict, address: str | None, clock: Clock) -> Outcome:
    """Coordina A y B sin repetir una evaluación ante pérdida o error.

    :param db: archivo local de la copia de asistencia.
    :param sid: identificador de la carrera guardada.
    :param token: permiso propio recibido; nunca una identidad basada en IP.
    :param fields: objeto recibido; solo sus campos del contrato tienen autoridad.
    :param address: dirección fiable de conexión; no identifica a la plaza.
    :param clock: reloj del servidor que devuelve segundos Unix.
    :return: datos y estado del resultado propio.
    :rtype: Outcome

    Usage::

        attempt(path, session_id, credential, fields, "127.0.0.1", clock)
    """
    if normalize_address(address) is None:
        raise RaceError(403, 'No se ha podido identificar el origen de conexión. Consulta al profesor.')
    reserved = _reserve(db, sid, token, fields, clock)
    if isinstance(reserved, Outcome):
        return reserved
    return _finalize(db, sid, token, fields, reserved, clock)
