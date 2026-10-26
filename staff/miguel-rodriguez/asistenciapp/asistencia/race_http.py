"""Adaptación HTTP de carreras: autenticación, cookie, origen y JSON acotado."""
from datetime import datetime, timezone
from ipaddress import ip_address
import hmac
import json
import re
import math
from pathlib import Path
from typing import Callable
from urllib.parse import urlsplit
from flask import Flask, Response, jsonify, request
from werkzeug.exceptions import HTTPException
from .qr import generate_qr
from .origin import registration_origin
from .usecases import races
from .usecases.races import RaceError, Outcome

def cookie_name(sid: str) -> str:
    """Nombre de permiso aislado para cada carrera.

    :param sid: identificador de la carrera guardada.
    :return: texto derivado sin publicar secretos adicionales.
    :rtype: str

    Usage::

        cookie_name(session_id)
    """
    return f'race_{sid}'

def canonical_origin(value: str | None, local_http: bool, trust_cloudflare: bool) -> str | None:
    """Valida configuración real; nunca usa Host reenviado como autoridad.

    :param value: origen configurado por el servidor, no por el visitante.
    :param local_http: permitir HTTP únicamente en loopback de desarrollo.
    :param trust_cloudflare: confiar solo en el conector local explícitamente configurado.
    :return: resultado del contrato descrito, con el tipo indicado.
    :rtype: str | None

    Usage::

        canonical_origin("http://localhost:8000", True, False)
    """
    if not isinstance(value, str):
        return None
    try:
        parsed = urlsplit(value)
        local = parsed.hostname == 'localhost'
        if not local:
            try:
                local = ip_address(parsed.hostname).is_loopback
            except (ValueError, TypeError):
                local = False
        if parsed.username or parsed.password or parsed.query or parsed.fragment or (parsed.path not in ('', '/')):
            return None
        if not parsed.hostname or parsed.scheme not in ('http', 'https'):
            return None
        if parsed.scheme == 'http' and (trust_cloudflare or not local_http or (not local)):
            return None
        port = parsed.port
        host = parsed.hostname.lower()
        if ':' in host:
            host = f'[{host}]'
        authority = host if port is None or port == {'https': 443, 'http': 80}[parsed.scheme] else f'{host}:{port}'
        return f'{parsed.scheme}://{authority}'
    except ValueError:
        return None

def register_routes(app: Flask, db: str | Path, now: Callable[[], float], trust_cloudflare: bool) -> None:
    """Registra rutas concretas en la factoría real; sin app de pruebas paralela.

    :param app: aplicación Flask real que registra este adaptador.
    :param db: archivo local de la copia de asistencia.
    :param now: reloj callable del servidor que devuelve segundos Unix.
    :param trust_cloudflare: confiar solo en el conector local explícitamente configurado.
    :return: None; las rutas quedan registradas y la limpieza inicial confirmada.
    :rtype: None

    Usage::

        register_routes(app, path, clock, False)
    """
    races.cleanup(db, now)

    def is_race_request() -> bool:
        """Identifica rutas nuevas para cabeceras y fallos de adaptación.

        :return: resultado de la condición consultada.
        :rtype: bool

        Usage::

            is_race_request()
        """
        return bool(request.environ.get('race_context')) or request.path.startswith('/api/races/') or request.path == '/api/sessions/races' or (re.fullmatch('/api/sessions/[^/]+/race(?:/[^/]+)?', request.path) is not None)

    def origin() -> str:
        """Lee configuración al atender, después de arrancar el túnel.

        :return: texto derivado sin publicar secretos adicionales.
        :rtype: str

        Usage::

            origin()
        """
        configured = canonical_origin(app.config.get('RACE_ORIGIN'), app.config.get('RACE_LOCAL_HTTP', False), trust_cloudflare)
        if configured is None:
            raise RaceError(503, 'No está configurado el acceso de carrera. Consulta al profesor.')
        return configured

    def checked_browser() -> None:
        """Exige origen de navegador propio sin confundirlo con IP.

        :return: None si el origen configurado y las cabeceras son válidos; si no, lanza un rechazo.
        :rtype: None

        Usage::

            checked_browser()
        """
        configured = origin()
        given = request.headers.get('Origin')
        if request.headers.get('Sec-Fetch-Site') == 'cross-site' or (given is not None and given != configured):
            raise RaceError(403, 'El envío debe hacerse desde la página de esta carrera.')
        if configured.startswith('http:'):
            try:
                loopback = ip_address(request.remote_addr or '').is_loopback
            except ValueError:
                loopback = False
            if not loopback:
                raise RaceError(403, 'El acceso HTTP de desarrollo solo permite conexión local.')

    def body() -> dict:
        """Limita el cuerpo nuevo y conserva el gasto de JSON inválido autorizado.

        :return: datos autorizados del contrato, según la responsabilidad de esta función.
        :rtype: dict

        Usage::

            body()
        """
        if request.content_length is not None and request.content_length > 2048:
            raise RaceError(413, 'El envío es demasiado grande. Envía solo los datos de carrera.')
        if request.mimetype != 'application/json':
            raise RaceError(415, 'Envía los datos desde el formulario de carrera.')
        raw = request.stream.read(2049)
        if len(raw) > 2048:
            raise RaceError(413, 'El envío es demasiado grande. Envía solo los datos de carrera.')
        try:
            data = json.loads(raw)
        except (ValueError, UnicodeError, RecursionError):
            data = None
        if not isinstance(data, dict):
            if request.path.endswith('/attempt'):
                return {}
            raise RaceError(400, 'Los datos del envío no son válidos.')
        return data

    def answer(result: dict | Outcome) -> tuple[Response, int]:
        """Traduce un resultado ya confirmado sin exponer secretos internos.

        :param result: datos autorizados o resultado del caso de uso.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            answer(result)
        """
        if isinstance(result, Outcome):
            response, status = (jsonify(result.body), result.status)
        else:
            result = dict(result)
            entry = result.pop('entrySecret', None)
            if entry is not None:
                result['joinUrl'] = f"{origin()}/race.html?r={result['id']}#join={entry}"
            response, status = (jsonify(result), 200)
        return (response, status)

    def write_checks(entry: bool=False) -> dict:
        """Valida frontera de entrada sin gastar intentos por peticiones ajenas.

        :param entry: exigir la cabecera propia de entrada al lobby.
        :return: datos autorizados del contrato, según la responsabilidad de esta función.
        :rtype: dict

        Usage::

            write_checks(True)
        """
        checked_browser()
        if entry and request.headers.get('X-Race-Request') != '1':
            raise RaceError(403, 'Abre el enlace de carrera para entrar.')
        return body()

    @app.before_request
    def cleanup_due() -> None:
        """El siguiente tráfico limpia todos los temporales de carrera vencidos.

        :return: None después de limpiar las carreras vencidas y reconocer el modo de la ruta.
        :rtype: None

        Usage::

            cleanup_due()
        """
        races.cleanup(db, now)
        legacy_sid = (request.view_args or {}).get('session_id')
        if legacy_sid is not None and races.is_race(db, legacy_sid):
            request.environ['race_context'] = True

    @app.after_request
    def protect_response(response: Response) -> Response:
        """Evita caché de resultados y permisos nuevos, también ante errores.

        :param response: respuesta HTTP construida para esta petición.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: Response

        Usage::

            protect_response(response)
        """
        if is_race_request():
            response.headers['Cache-Control'] = 'no-store'
        return response

    @app.errorhandler(RaceError)
    def business_error(exc: RaceError) -> tuple[Response, int]:
        """Traduce rechazo de negocio sin reintentos de escritura.

        :param exc: error que se traduce sin registrar secretos.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            business_error(error)
        """
        response = jsonify(error=str(exc))
        if exc.status == 503:
            response.headers['Retry-After'] = '1'
        return (response, exc.status)

    @app.errorhandler(Exception)
    def unexpected(exc: Exception) -> Response | tuple[Response, int]:
        """No vuelca cuerpo, código, cookies o variables ante error técnico.

        :param exc: error que se traduce sin registrar secretos.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: Response | tuple[Response, int]

        Usage::

            unexpected(error)
        """
        if isinstance(exc, HTTPException):
            if request.path.startswith('/api/'):
                return (jsonify(error='No encontrado.' if exc.code == 404 else 'Método o petición no permitidos.'), exc.code)
            return exc
        app.logger.error('Fallo interno de %s', type(exc).__name__)
        message = 'No se pudo confirmar el envío. Consulta tu estado antes de hacer otro.' if is_race_request() else 'Error inesperado.'
        return (jsonify(error=message), 500)

    @app.post('/api/sessions/races')
    def prepare() -> tuple[Response, int]:
        """Prepara carrera solo desde acceso de profesor y origen configurado.

        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            prepare()
        """
        fields = write_checks()
        result = races.prepare(db, fields.get('title'), now)
        response, _ = answer(result)
        return (response, 201)

    @app.get('/api/sessions/<sid>/race')
    def teacher(sid: str) -> tuple[Response, int]:
        """Publica al profesor enlace o código según fase autorizada.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            teacher(session_id)
        """
        origin()
        return answer(races.teacher_state(db, sid, now))

    @app.get('/api/sessions/<sid>/race/qr.svg')
    def qr(sid: str) -> Response:
        """Entrega el QR solo al profesor y durante el lobby.

        :param sid: carrera cuya entrada se representa.
        :return: SVG local sin caché, o rechazo si no queda entrada vigente.
        :rtype: Response

        Usage::

            qr(session_id)
        """
        state, _ = answer(races.teacher_state(db, sid, now))
        link = state.get_json().get('joinUrl')
        if link is None:
            raise RaceError(410, 'La entrada ya está cerrada. Consulta el estado de la carrera.')
        response = Response(generate_qr(link), mimetype='image/svg+xml')
        response.headers['Cache-Control'] = 'no-store'
        return response

    @app.post('/api/sessions/<sid>/race/start')
    def start(sid: str) -> tuple[Response, int]:
        """Da la salida del grupo fijo con token del profesor.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            start(session_id)
        """
        write_checks()
        return answer(races.start(db, sid, now))

    @app.post('/api/sessions/<sid>/race/release')
    def release(sid: str) -> tuple[Response, int]:
        """Retira una ocupación equivocada únicamente durante lobby.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            release(session_id)
        """
        fields = write_checks()
        return answer(races.release(db, sid, fields.get('roster_key'), now))

    @app.post('/api/sessions/<sid>/race/close')
    def close(sid: str) -> tuple[Response, int]:
        """Cierra sin devolver intentos o borrar resultados recuperables.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            close(session_id)
        """
        write_checks()
        return answer(races.close(db, sid, now))

    @app.post('/api/races/<sid>/lobby')
    def lobby(sid: str) -> tuple[Response, int]:
        """Consulta disponibilidad con entrada vigente y cabecera propia.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            lobby(session_id)
        """
        fields = write_checks(True)
        return answer(races.lobby(db, sid, fields.get('join_secret'), now))

    @app.post('/api/races/<sid>/join')
    def join(sid: str) -> tuple[Response, int]:
        """Ocupa plaza y fija permiso solo después del commit.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            join(session_id)
        """
        fields = write_checks(True)
        result, credential = races.join(db, sid, fields.get('join_secret'), fields.get('roster_key'), request.cookies.get(cookie_name(sid)), now)
        response, status = answer(result)
        if credential is not None:
            response.set_cookie(cookie_name(sid), credential, max_age=max(0, math.floor(result['expiresAt'] - now())), expires=datetime.fromtimestamp(result['expiresAt'], timezone.utc), httponly=True, secure=trust_cloudflare or origin().startswith('https:'), samesite='Strict', path=f'/api/races/{sid}')
        return (response, status)

    @app.get('/api/races/<sid>/me')
    def me(sid: str) -> tuple[Response, int]:
        """Recupera estado y protección CSRF propios, nunca códigos.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            me(session_id)
        """
        checked_browser()
        return answer(races.me(db, sid, request.cookies.get(cookie_name(sid)), now))

    @app.post('/api/races/<sid>/attempt')
    def attempt(sid: str) -> tuple[Response, int]:
        """Exige permiso, CSRF y origen antes de reservar; no reintenta B.

        :param sid: identificador de la carrera guardada.
        :return: resultado del contrato descrito, con el tipo indicado.
        :rtype: tuple[Response, int]

        Usage::

            attempt(session_id)
        """
        checked_browser()
        token = request.cookies.get(cookie_name(sid))
        own = races.me(db, sid, token, now)
        given = request.headers.get('X-Race-CSRF', '')
        if not hmac.compare_digest(given.encode(), own['csrfToken'].encode()):
            raise RaceError(403, 'El acceso del envío no es válido. Recarga tu página de carrera.')
        fields = body()
        address = registration_origin(request.remote_addr, request.headers.get('CF-Connecting-IP'), trust_cloudflare=trust_cloudflare)
        return answer(races.attempt(db, sid, token, fields, address, now))
