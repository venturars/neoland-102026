"""Acciones de la asistencia: abrir, cerrar, anotar, listar, borrar y exportar.

Cada acción pide las reglas y el almacén. No pinta la página.
Ejemplo: check_in(ruta, id_clase, "Ana", "4821", ahora, direccion)
devuelve el registro y si era nuevo.
"""

from datetime import datetime, timezone

# Banned is the signal "this computer is blocked".
# over_limit answers "is this count past 5 in a second, or past 20 in a minute?"
from asistencia.domain.attempts import Banned, over_limit
from asistencia.domain.codes import code_for, seconds_left
from asistencia.domain.names import clean_name, name_key
from asistencia.domain.session import ensure_code, ensure_open, require_session
from asistencia.export import to_csv
from asistencia.storage import sqlite as store


def _iso(t: float) -> str:
    return datetime.fromtimestamp(t, timezone.utc).isoformat(timespec="milliseconds")


def prepare(path) -> str:
    """Prepara el fichero y devuelve la clave del profesor.

    Recibe la ruta. Devuelve la clave.
    Ejemplo: prepare(ruta).
    """
    return store.prepare(path)


def public_session(path, session_id: str) -> dict:
    """Lo que ve el alumno: título y si la clase sigue abierta.

    Recibe la ruta y el id. Devuelve título y si está abierta.
    Ejemplo: public_session(ruta, id_clase).
    """
    session = require_session(store.get_session(path, session_id))
    return {"title": session["title"], "open": session["closed_at"] is None}


def check_in(
    path, session_id: str, name: str, code: str, t: float, address: str
) -> tuple[dict, bool]:
    """Anota a la persona si el ordenador no está bloqueado, la clase está abierta y el código vale.

    Recibe la ruta, el id, el nombre, el código, el instante y la dirección.
    Devuelve el registro y True si es la primera vez.
    Ejemplo: check_in(ruta, id_clase, "Ana", "4821", ahora, direccion).
    """
    # address is the computer that sent this try, not an address typed in the form.
    # Stop here if that computer was already blocked. Do not mark anyone present.
    if store.is_computer_blocked(path, address):
        raise Banned()
    # Remember this try, then forget tries older than one minute.
    store.add_checkin_attempt(path, address, t)
    store.prune_checkin_attempts(path, t - 60)
    # Count this computer's tries in the last second and in the last minute.
    # This try is already included in both counts.
    in_the_second = store.count_checkin_attempts(path, address, t - 1)
    in_the_minute = store.count_checkin_attempts(path, address, t - 60)
    # 5 in a second and 20 in a minute are still allowed. One more blocks.
    if over_limit(in_the_second, in_the_minute):
        # Save the block so it is still there after the app is closed.
        store.block_computer(path, address, _iso(t))
        raise Banned()
    # Under the limit, check-in continues as before:
    # the class exists, it is open, the name is valid, and the code is valid.
    session = require_session(store.get_session(path, session_id))
    ensure_open(session)
    clean = clean_name(name)
    ensure_code(session["secret"], code, t)
    return store.add_checkin(path, session_id, clean, name_key(clean), _iso(t))


def list_sessions(path) -> list[dict]:
    """Devuelve las clases para el panel, las más nuevas primero.

    Recibe la ruta. Devuelve la lista con el total de presentes.
    Ejemplo: list_sessions(ruta).
    """
    return store.list_sessions(path)


def create_session(path, title: str | None, t: float) -> dict:
    """Abre una clase. Si el título viene vacío, usa la fecha y la hora.

    Recibe la ruta, el título y el instante. Devuelve la clase.
    Ejemplo: create_session(ruta, "Clase de Python", ahora).
    """
    text = str(title or "").strip()
    if not text:
        text = datetime.fromtimestamp(t).strftime("%d/%m/%Y %H:%M")
    return store.create_session(path, text, _iso(t))


def close_session(path, session_id: str, t: float) -> None:
    """Cierra la clase si existe.

    Recibe la ruta, el id y el instante. No devuelve nada.
    Ejemplo: close_session(ruta, id_clase, ahora).
    """
    require_session(store.get_session(path, session_id))
    store.close_session(path, session_id, _iso(t))


def export_csv(path, session_id: str) -> tuple[str, str]:
    """Devuelve el CSV de la clase y el día del nombre de fichero.

    Recibe la ruta y el id. Devuelve el texto CSV y el día (YYYY-MM-DD).
    Ejemplo: export_csv(ruta, id_clase).
    """
    session = require_session(store.get_session(path, session_id))
    rows = store.list_checkins(path, session_id)
    return to_csv(rows), session["opened_at"][:10]


def remove_checkin(path, session_id: str, checkin_id: int) -> bool:
    """Borra un presente si la clase existe y el registro es suyo.

    Recibe la ruta, el id de la clase y el id del registro.
    Devuelve True si lo borró.
    Ejemplo: remove_checkin(ruta, id_clase, 3).
    """
    require_session(store.get_session(path, session_id))
    return store.remove_checkin(path, session_id, checkin_id)


def teacher_view(path, session_id: str, t: float) -> dict:
    """Lo que ve el profesor: clase, presentes y, si sigue abierta, el código.

    Recibe la ruta, el id y el instante. Devuelve esos datos.
    Ejemplo: teacher_view(ruta, id_clase, ahora).
    """
    session = require_session(store.get_session(path, session_id))
    checkins = store.list_checkins(path, session_id)
    data = {
        "id": session["id"],
        "title": session["title"],
        "open": session["closed_at"] is None,
        "openedAt": session["opened_at"],
        "closedAt": session["closed_at"],
        "total": len(checkins),
        "checkins": checkins,
    }
    if data["open"]:
        data["code"] = code_for(session["secret"], t)
        data["secondsLeft"] = seconds_left(t)
    return data
