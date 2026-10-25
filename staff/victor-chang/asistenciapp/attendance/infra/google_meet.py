"""Google Meet: el único módulo que habla con Google (spec 004 · plan §2.3, §2.4, §2.7; ARCHITECTURE.md · F4).

- `parse_meeting_code`: el formato de los enlaces de Meet.
- `GoogleMeet.participants`: quién está, o quién ha estado, en una reunión. Usa la vía `conferenceRecords`,
  la que funcionó en el spike con una cuenta gratuita (plan §0).
- El permiso de Google (OAuth) vive en `google_auth.py`.

Cada llamada tiene un tiempo máximo, cada fallo se traduce a un error con nombre del dominio, y nada de
lo que responde Google (que puede llevar nombres) se registra ni se muestra (E5, E7).
"""

import logging
import re
from pathlib import Path
from typing import Any

import requests
from google.oauth2.credentials import Credentials

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
from attendance.infra.google_auth import GooglePermission, LoginFlow

logger = logging.getLogger(__name__)

API = "https://meet.googleapis.com/v2"
USERINFO = "https://openidconnect.googleapis.com/v1/userinfo"
TIMEOUT_SECONDS = 10
MAX_PAGES = 10
PARTICIPANT_KINDS = ("signedinUser", "anonymousUser", "phoneUser")

# Código de reunión de Meet: tres grupos de letras ASCII ([a-z], no \w, ARCHITECTURE.md · E1), solo o
# dentro del enlace, con parámetros opcionales (p. ej. ?authuser=1).
MEETING_LINK = re.compile(
    r"(?:(?:https?://)?meet\.google\.com/)?(?P<code>[a-z]{3}-[a-z]{4}-[a-z]{3})/?(?:\?[\w=&.-]*)?"
)


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
        self._permission = GooglePermission(client_path, token_path, login)
        self._http = http or requests.Session()

    def participants(self, meeting_code: str, who: Who) -> MeetingAttendance:
        """Los nombres de quienes están (`now`) o han estado (`everyone`) en la reunión, sin el profesor.

        Se usa la reunión en curso con ese código; si no hay, la última que terminó (spec 004 · CA-20).

        Raises:
            MeetingNotVisibleError: esta cuenta no ve ninguna reunión con ese código (CA-13, CA-14).
            MeetingEndedError: se pidió `now` y la reunión ya terminó (CA-21).
            MeetNotConfiguredError, MeetPermissionMissingError, MeetLoginNotCompletedError: falta preparar algo.
            MeetServiceError: Google o la red fallan.
        """
        credentials = self._permission.credentials()
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
            self._permission.forget()
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
