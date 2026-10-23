"""Prueba de concepto DESECHABLE de la API de Meet (spec 004 · plan §0 · tarea T03). Se borra en T17.

Uso, con el entorno activado y desde la carpeta del proyecto:

    python scripts/spike_meet.py https://meet.google.com/abc-defg-hij
    python scripts/spike_meet.py abc-defg-hij --guardar    # además guarda ejemplos anonimizados

Abre el navegador para iniciar sesión con Google (elige la cuenta) y muestra lo que ve esa cuenta:
su identificador, la reunión y quién está ahora en la llamada. No guarda el permiso: cada ejecución
vuelve a pedirlo, así se puede probar con cuentas distintas.

Los nombres solo se muestran en esta terminal. Con --guardar, los ejemplos de tests/fixtures/meet/
llevan los nombres y los identificadores cambiados (P4).
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any

import requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

ROOT = Path(__file__).resolve().parent.parent
CLIENT_FILE = ROOT / "data" / "google-client.json"
FIXTURES = ROOT / "tests" / "fixtures" / "meet"
SCOPES = ["https://www.googleapis.com/auth/meetings.space.readonly", "openid"]
API = "https://meet.googleapis.com/v2"
CODE = re.compile(r"(?:https://meet\.google\.com/)?([a-z]{3}-[a-z]{4}-[a-z]{3})(?:\?.*)?")
TIMEOUT = 10


def main() -> None:
    """Inicia sesión, consulta la reunión e imprime las respuestas a las preguntas del spike."""
    parser = argparse.ArgumentParser(description="Spike de la API de Meet (spec 004, T03).")
    parser.add_argument("reunion", help="enlace o código de la reunión de Meet")
    parser.add_argument("--guardar", action="store_true", help="guarda ejemplos anonimizados para los tests")
    args = parser.parse_args()

    match = CODE.fullmatch(args.reunion.strip().lower())
    if not match:
        sys.exit("No parece un enlace o código de Meet (p. ej. abc-defg-hij).")
    code = match.group(1)
    if not CLIENT_FILE.exists():
        sys.exit(f"Falta {CLIENT_FILE.relative_to(ROOT)} (tarea T02).")

    credentials = login()
    session = requests.Session()
    session.headers["Authorization"] = f"Bearer {credentials.token}"

    me = get(session, "https://openidconnect.googleapis.com/v1/userinfo")
    print(f"\n[Pregunta 2] sub de la cuenta que ha iniciado sesión: {me.get('sub')}")

    space = get(session, f"{API}/spaces/{code}", label="spaces")
    if space is None:
        return
    conference = (space.get("activeConference") or {}).get("conferenceRecord")
    print(f"\n[Pregunta 4] ¿Reunión en curso? {'sí: ' + conference if conference else 'no (sin activeConference)'}")
    if not conference:
        save(args.guardar, "space_not_in_progress.json", space)
        return
    save(args.guardar, "space_in_progress.json", space)

    pages = []
    url = f"{API}/{conference}/participants"
    params: dict[str, str] = {"filter": "latest_end_time IS NULL", "pageSize": "250"}
    while True:
        page = get(session, url, params=params, label="participants")
        if page is None:
            return
        pages.append(page)
        if not page.get("nextPageToken"):
            break
        params["pageToken"] = page["nextPageToken"]

    participants = [p for page in pages for p in page.get("participants", [])]
    print(f"\n[Pregunta 1] Participantes activos que ve esta cuenta: {len(participants)}")
    for p in participants:
        kind = next((k for k in ("signedinUser", "anonymousUser", "phoneUser") if k in p), "?")
        info = p.get(kind, {})
        mark = "  ← ¿es la cuenta que ha iniciado sesión?" if info.get("user") == f"users/{me.get('sub')}" else ""
        print(f"  - {kind}: displayName={info.get('displayName')!r} user={info.get('user')!r}{mark}")
    for i, page in enumerate(pages, start=1):
        save(args.guardar, f"participants_page{i}.json", anonymize(page))


def login() -> Credentials:
    """Inicia sesión con Google en el navegador y comprueba que se han concedido los dos permisos."""
    print("Abriendo Google en el navegador. Elige la cuenta con la que quieres probar…")
    # Google deja conceder solo parte de los permisos (casillas en la pantalla de consentimiento).
    # Sin esto, oauthlib se para con un Warning; así el spike puede decir qué permiso falta.
    os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"  # noqa: S105 — es un ajuste de oauthlib, no un secreto
    flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_FILE), SCOPES)
    credentials = flow.run_local_server(port=0, prompt="select_account consent", timeout_seconds=120)
    granted = set(getattr(credentials, "granted_scopes", None) or flow.oauth2session.token.get("scope", []))
    missing = [s for s in SCOPES if s not in granted]
    print(f"\nPermisos concedidos: {sorted(granted)}")
    if missing:
        sys.exit(
            f"Falta el permiso {missing}. Vuelve a ejecutar y, en la pantalla de Google, marca la casilla "
            "«Ver información sobre tus reuniones de Google Meet». Si no aparece, añade ese permiso en "
            "Google Auth Platform → Acceso a datos (Data access)."
        )
    return credentials


def get(
    session: requests.Session,
    url: str,
    params: dict[str, str] | None = None,
    label: str = "",
) -> dict[str, Any] | None:
    """GET con tiempo máximo. Si Google responde con error, lo muestra y devuelve None."""
    res = session.get(url, params=params, timeout=TIMEOUT)
    if res.ok:
        data: dict[str, Any] = res.json()
        return data
    error = res.json().get("error", {}) if res.headers.get("content-type", "").startswith("application/json") else {}
    status, message = error.get("status", ""), error.get("message", "")
    print(f"\n[Pregunta 3/4] {label or url} → HTTP {res.status_code} {status}: {message}")
    save_error(label, res.status_code, error)
    return None


ERRORS: list[dict[str, Any]] = []


def save_error(label: str, status: int, error: dict[str, Any]) -> None:
    """Apunta el error (código y estado de Google, sin mensajes con datos) para guardarlo con --guardar."""
    ERRORS.append({"llamada": label, "http": status, "status": error.get("status")})


def anonymize(page: dict[str, Any]) -> dict[str, Any]:
    """Copia de la respuesta con nombres e identificadores cambiados (P4)."""
    copy = json.loads(json.dumps(page))
    for i, p in enumerate(copy.get("participants", []), start=1):
        p["name"] = f"conferenceRecords/ejemplo/participants/{i}"
        for kind in ("signedinUser", "anonymousUser", "phoneUser"):
            if kind in p:
                if p[kind].get("displayName"):
                    p[kind]["displayName"] = f"Persona {i}"
                if "user" in p[kind]:
                    p[kind]["user"] = f"users/{1000 + i}"
    return copy


def save(enabled: bool, filename: str, data: dict[str, Any]) -> None:
    """Guarda un ejemplo en tests/fixtures/meet/ si se pidió --guardar."""
    if not enabled:
        return
    FIXTURES.mkdir(parents=True, exist_ok=True)
    data = {k: ("spaces/ejemplo" if k == "name" else v) for k, v in data.items()}
    (FIXTURES / filename).write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"  (guardado tests/fixtures/meet/{filename})")


if __name__ == "__main__":
    try:
        main()
    finally:
        if ERRORS:
            print("\nErrores de Google (para anotar en tasks.md):", json.dumps(ERRORS, ensure_ascii=False))
