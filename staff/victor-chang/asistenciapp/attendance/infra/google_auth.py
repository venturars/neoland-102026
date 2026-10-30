"""El permiso de Google (OAuth) para leer las reuniones de Meet (spec 004 · plan §2.4; CA-11, CA-12).

- `run_browser_login`: pide el permiso en el navegador del ordenador donde corre la app.
- `GooglePermission`: lo guarda (solo para el usuario), lo reutiliza, lo renueva y, si caduca, lo vuelve a pedir.

Se separó de `google_meet.py` para que cada módulo trate una sola cosa (ARCHITECTURE.md · M1).
"""

import logging
import os
from collections.abc import Callable
from pathlib import Path

from google.auth.exceptions import RefreshError, TransportError
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow, WSGITimeoutError
from oauthlib.oauth2.rfc6749.errors import OAuth2Error

from attendance.domain.errors import (
    MeetLoginNotCompletedError,
    MeetNotConfiguredError,
    MeetPermissionMissingError,
    MeetServiceError,
)

logger = logging.getLogger(__name__)

MEET_SCOPE = "https://www.googleapis.com/auth/meetings.space.readonly"
SCOPES = [MEET_SCOPE, "openid"]  # sin email (P4)
LOGIN_TIMEOUT_SECONDS = 120

LoginFlow = Callable[[Path], Credentials]


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


class GooglePermission:
    """El permiso de una cuenta de Google, guardado en un archivo (M3: comparte estado entre tomas)."""

    def __init__(self, client_path: Path, token_path: Path, login: LoginFlow | None = None) -> None:
        """Prepara el permiso sin pedirlo todavía.

        Args:
            client_path: la llave de la app (Config.google_client_path).
            token_path: dónde se guarda el permiso (Config.google_token_path).
            login: cómo se pide el permiso; por defecto, en el navegador. Los tests pasan uno falso.
        """
        self._client_path = client_path
        self._token_path = token_path
        self._login = login or run_browser_login
        self._credentials: Credentials | None = None

    def credentials(self) -> Credentials:
        """Un permiso válido: el guardado, renovado si hace falta, o uno nuevo pedido en el navegador.

        Raises:
            MeetNotConfiguredError: falta la llave de la app.
            MeetPermissionMissingError: se concedió el permiso sin la casilla de Meet.
            MeetLoginNotCompletedError: no se aceptó el permiso.
            MeetServiceError: Google no responde al renovarlo.
        """
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
            self.forget()  # archivo dañado: se vuelve a pedir el permiso
            return None
        return saved

    def _refreshed(self, credentials: Credentials) -> Credentials | None:
        try:
            credentials.refresh(Request())  # type: ignore[no-untyped-call]
        except RefreshError:
            # Mientras la app de Google esté en prueba, el permiso caduca a los 7 días (spec P7, opción A).
            logger.info("El permiso de Google ha caducado; se volverá a pedir")
            self.forget()
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

    def forget(self) -> None:
        """Olvida el permiso (en memoria y en disco): la próxima vez se volverá a pedir."""
        self._credentials = None
        self._token_path.unlink(missing_ok=True)
