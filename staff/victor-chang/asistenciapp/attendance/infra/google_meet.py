"""Google Meet: el único módulo que habla con Google (spec 004 · plan §2.3, §2.4, §2.7; ARCHITECTURE.md · F4).

- `parse_meeting_code`: el formato de los enlaces de Meet.
- `GoogleMeet.participants`: quién está, o quién ha estado, en una reunión. Usa la vía `conferenceRecords`,
  la que funcionó en el spike con una cuenta gratuita (plan §0).
- `run_browser_login`: el permiso OAuth en el navegador del ordenador donde corre la app.

Cada llamada tiene un tiempo máximo, cada fallo se traduce a un error con nombre del dominio, y nada de
lo que responde Google (que puede llevar nombres) se registra ni se muestra (E5, E7).
"""

import logging
import os
import re
from collections.abc import Callable
from pathlib import Path
from typing import Any

import requests
from google.auth.exceptions import RefreshError, TransportError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow, WSGITimeoutError
from oauthlib.oauth2.rfc6749.errors import OAuth2Error

from attendance.domain.errors import (
    MeetingEndedError,
    MeetingLinkInvalidError,
    MeetingNotVisibleError,
    MeetLoginNotCompletedError,
    MeetNotConfiguredError,
    MeetPermissionMissingError,
    MeetServiceError,
)
from attendance.domain.participants import MeetingAttendance, Who

logger = logging.getLogger(__name__)

API = "https://meet.googleapis.com/v2"
USERINFO = "https://openidconnect.googleapis.com/v1/userinfo"
MEET_SCOPE = "https://www.googleapis.com/auth/meetings.space.readonly"
SCOPES = [MEET_SCOPE, "openid"]  # sin email (P4)
TIMEOUT_SECONDS = 10
LOGIN_TIMEOUT_SECONDS = 120
MAX_PAGES = 10
PARTICIPANT_KINDS = ("signedinUser", "anonymousUser", "phoneUser")

# Código de reunión de Meet: tres grupos de letras ASCII ([a-z], no \w, ARCHITECTURE.md · E1), solo o
# dentro del enlace, con parámetros opcionales (p. ej. ?authuser=1).
MEETING_LINK = re.compile(
    r"(?:(?:https?://)?meet\.google\.com/)?(?P<code>[a-z]{3}-[a-z]{4}-[a-z]{3})/?(?:\?[\w=&.-]*)?"
)

LoginFlow = Callable[[Path], Credentials]


def parse_meeting_code(text: str) -> str:
    """El código de la reunión (`abc-defg-hij`) a partir de un enlace de Meet o del propio código.

    Acepta mayúsculas y espacios alrededor.

    Raises:
        MeetingLinkInvalidError: no es un enlace ni un código de Meet.
    """
    text = text.strip()
    # Antes de pasar a minúsculas: lower() convierte algunos símbolos (p. ej. el signo Kelvin) en letras ASCII.
    if not text.isascii():
        raise MeetingLinkInvalidError
    match = MEETING_LINK.fullmatch(text.lower())
    if match is None:
        raise MeetingLinkInvalidError
    return match.group("code")


def run_browser_login(client_path: Path) -> Credentials:
    """Pide el permiso de Google en el navegador y espera, como mucho, 2 minutos (spec 004 · CA-11).

    Raises:
        MeetLoginNotCompletedError: no se aceptó a tiempo, o se pulsó "Cancelar".
        MeetPermissionMissingError: se aceptó sin la casilla de Meet.
    """
    flow = InstalledAppFlow.from_client_secrets_file(str(client_path), SCOPES)
    try:
        # port=0: un puerto libre que elige el sistema, para no chocar con el de la app.
        # prompt="consent": Google entrega siempre el permiso para renovarlo después.
        credentials: Credentials = flow.run_local_server(
            port=0,
            timeout_seconds=LOGIN_TIMEOUT_SECONDS,
            prompt="consent",
        )
    except WSGITimeoutError as exc:
        raise MeetLoginNotCompletedError from exc
    except OAuth2Error as exc:
        raise MeetLoginNotCompletedError from exc
    except Warning as exc:
        # oauthlib avisa así de que se concedieron menos permisos de los pedidos (casillas de Google).
        if MEET_SCOPE not in (getattr(exc, "new_scope", None) or []):
            raise MeetPermissionMissingError from exc
        raise MeetLoginNotCompletedError from exc
    return credentials


class GoogleMeet:
    """Cliente de la API de Meet de una cuenta: guarda su permiso y su sesión HTTP (M3)."""

    def __init__(
        self,
        client_path: Path,
        token_path: Path,
        http: requests.Session | None = None,
        login: LoginFlow | None = None,
    ) -> None:
        """Prepara el cliente sin llamar a Google: el permiso se pide en la primera toma.

        Args:
            client_path: la llave de la app (Config.google_client_path).
            token_path: dónde se guarda el permiso (Config.google_token_path).
            http: sesión HTTP; los tests pasan una falsa (T4).
            login: cómo se pide el permiso; por defecto, en el navegador.
        """
        self._client_path = client_path
        self._token_path = token_path
        self._http = http or requests.Session()
        self._login = login or run_browser_login
        self._credentials: Credentials | None = None

    def participants(self, meeting_code: str, who: Who) -> MeetingAttendance:
        """Los nombres de quienes están (`now`) o han estado (`everyone`) en la reunión, sin el profesor.

        Se usa la reunión en curso con ese código; si no hay, la última que terminó (spec 004 · CA-20).

        Raises:
            MeetingNotVisibleError: esta cuenta no ve ninguna reunión con ese código (CA-13, CA-14).
            MeetingEndedError: se pidió `now` y la reunión ya terminó (CA-21).
            MeetNotConfiguredError, MeetPermissionMissingError, MeetLoginNotCompletedError: falta preparar algo.
            MeetServiceError: Google o la red fallan.
        """
        credentials = self._valid_credentials()
        self_user = f"users/{self._get(USERINFO, credentials).get('sub')}"
        meeting = self._choose_meeting(credentials, meeting_code)
        ended = "endTime" in meeting
        if who is Who.NOW and ended:
            raise MeetingEndedError
        params = {"pageSize": "250"}
        if who is Who.NOW:
            params["filter"] = "latest_end_time IS NULL"
        people = self._list(credentials, f"{API}/{meeting['name']}/participants", "participants", params)
        names = tuple(
            _display_name(person)
            for person in people
            if person.get("signedinUser", {}).get("user") != self_user  # el profesor no cuenta (CA-09)
        )
        return MeetingAttendance(names=names, started_at=str(meeting.get("startTime", "")), ended=ended)

    # ---------- Reuniones y llamadas ----------

    def _choose_meeting(self, credentials: Credentials, meeting_code: str) -> dict[str, Any]:
        params = {"filter": f'space.meeting_code = "{meeting_code}"', "pageSize": "100"}
        meetings = self._list(credentials, f"{API}/conferenceRecords", "conferenceRecords", params)
        in_progress = [m for m in meetings if "endTime" not in m]
        if in_progress:
            return max(in_progress, key=lambda m: str(m.get("startTime", "")))
        if meetings:
            return max(meetings, key=lambda m: str(m.get("endTime", "")))
        raise MeetingNotVisibleError

    def _list(
        self,
        credentials: Credentials,
        url: str,
        key: str,
        params: dict[str, str],
    ) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        page_params = dict(params)
        for _ in range(MAX_PAGES):
            page = self._get(url, credentials, page_params)
            items.extend(page.get(key, []))
            if not page.get("nextPageToken"):
                break
            page_params["pageToken"] = str(page["nextPageToken"])
        return items

    def _get(self, url: str, credentials: Credentials, params: dict[str, str] | None = None) -> dict[str, Any]:
        try:
            response = self._http.get(
                url,
                params=params,
                headers={"Authorization": f"Bearer {credentials.token}"},
                timeout=TIMEOUT_SECONDS,
            )
        except requests.RequestException as exc:
            logger.warning("Google Meet no responde (%s)", type(exc).__name__)
            raise MeetServiceError from exc
        if not response.ok:
            self._raise_for(response)
        try:
            body = response.json()
        except ValueError as exc:
            logger.warning("Google Meet respondió algo que no es JSON")
            raise MeetServiceError from exc
        return body if isinstance(body, dict) else {}

    def _raise_for(self, response: requests.Response) -> None:
        # Solo se registra el código HTTP: el cuerpo puede llevar nombres o datos de la cuenta (E7).
        logger.warning("Google Meet respondió HTTP %s", response.status_code)
        if response.status_code == 401:
            self._forget_credentials()
            raise MeetLoginNotCompletedError
        if response.status_code == 403:
            reasons = _error_reasons(response)
            if "SERVICE_DISABLED" in reasons:
                raise MeetNotConfiguredError
            if "ACCESS_TOKEN_SCOPE_INSUFFICIENT" in reasons:
                raise MeetPermissionMissingError
            raise MeetingNotVisibleError
        if response.status_code == 404:
            raise MeetingNotVisibleError
        raise MeetServiceError

    # ---------- Permiso de Google ----------

    def _valid_credentials(self) -> Credentials:
        if not self._client_path.exists():
            raise MeetNotConfiguredError
        credentials = self._credentials or self._load_saved()
        if credentials is not None and not credentials.valid:
            credentials = self._refreshed(credentials)
        if credentials is None:
            credentials = self._login(self._client_path)
            granted = set(getattr(credentials, "granted_scopes", None) or credentials.scopes or [])
            if MEET_SCOPE not in granted:
                raise MeetPermissionMissingError  # no se guarda un permiso incompleto
            self._save(credentials)
        self._credentials = credentials
        return credentials

    def _load_saved(self) -> Credentials | None:
        if not self._token_path.exists():
            return None
        try:
            # google-auth no anota estos métodos de Credentials: se marcan solo estas llamadas (mypy strict).
            saved: Credentials = Credentials.from_authorized_user_file(  # type: ignore[no-untyped-call]
                str(self._token_path), SCOPES
            )
        except ValueError:
            self._forget_credentials()  # archivo dañado: se vuelve a pedir el permiso
            return None
        return saved

    def _refreshed(self, credentials: Credentials) -> Credentials | None:
        try:
            credentials.refresh(Request())  # type: ignore[no-untyped-call]
        except RefreshError:
            # Mientras la app de Google esté en prueba, el permiso caduca a los 7 días (spec P7, opción A).
            logger.info("El permiso de Google ha caducado; se volverá a pedir")
            self._forget_credentials()
            return None
        except TransportError as exc:
            raise MeetServiceError from exc
        self._save(credentials)
        return credentials

    def _save(self, credentials: Credentials) -> None:
        # Es un secreto: se crea solo con permisos para el usuario (0600, ARCHITECTURE.md · X).
        self._token_path.parent.mkdir(parents=True, exist_ok=True)
        fd = os.open(self._token_path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
        with os.fdopen(fd, "w") as file:
            file.write(credentials.to_json())  # type: ignore[no-untyped-call]
        os.chmod(self._token_path, 0o600)  # por si el archivo ya existía con otros permisos

    def _forget_credentials(self) -> None:
        self._credentials = None
        self._token_path.unlink(missing_ok=True)


def _display_name(person: dict[str, Any]) -> str:
    """Solo el nombre visible: del resto (cuenta, teléfono…) no sale nada de este módulo (spec 004 · CA-17)."""
    for kind in PARTICIPANT_KINDS:
        if kind in person:
            return str(person[kind].get("displayName", ""))
    return ""


def _error_reasons(response: requests.Response) -> set[str]:
    try:
        details = response.json().get("error", {}).get("details", [])
    except (ValueError, AttributeError):
        return set()
    return {str(d.get("reason")) for d in details if isinstance(d, dict)}
