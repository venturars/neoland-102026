"""Acciones de asistencia: coordinan reglas y almacenamiento local."""
from pathlib import Path
from datetime import datetime, timezone
from asistencia.storage import sqlite as store
from asistencia.domain.session import require_session, validate_checkin
from asistencia.domain.names import name_key
from asistencia.domain.codes import code_for, seconds_left
from asistencia.export import to_csv


def prepare(path: str | Path, token: str | None = None) -> str:
    """Prepara almacenamiento y token.

    :param path: ruta del archivo SQLite.
    :param token: token opcional del profesor.
    :return: resultado de la acción indicado por su firma.
    :rtype: str

    Usage::

      result = prepare(path, token)
    """
    return store.prepare(path, token)


def get_session(path: str | Path, session_id: str) -> dict:
    """Obtiene una sesión existente.

    :param path: ruta del archivo SQLite.
    :param session_id: identificador de sesión.
    :return: resultado de la acción indicado por su firma.
    :rtype: dict

    Usage::

      result = get_session(path, session_id)
    """
    return require_session(store.get_session(path, session_id))


def public_session(path: str | Path, session_id: str) -> dict:
    """Consulta título y estado público.

    :param path: ruta del archivo SQLite.
    :param session_id: identificador de sesión.
    :return: resultado de la acción indicado por su firma.
    :rtype: dict

    Usage::

      result = public_session(path, session_id)
    """
    session = get_session(path, session_id)
    return dict(title=session["title"], open=session["closed_at"] is None)


def check_in(path: str | Path, session_id: str, name: str, code: str, instant: float) -> tuple[dict, bool]:
    """Valida y registra una asistencia.

    :param path: ruta del archivo SQLite.
    :param session_id: identificador de sesión.
    :param name: nombre recibido.
    :param code: código recibido.
    :param instant: instante del reloj inyectado.
    :return: resultado de la acción indicado por su firma.
    :rtype: tuple[dict, bool]

    Usage::

      result = check_in(path, session_id, name, code, instant)
    """
    session = get_session(path, session_id)
    name = validate_checkin(session, name, code, instant)
    checked_at = datetime.fromtimestamp(instant, timezone.utc).isoformat(timespec="milliseconds")
    return store.add_checkin(path, session_id, name, name_key(name), checked_at)


def list_sessions(path: str | Path) -> list[dict]:
    """Lista sesiones con sus totales.

    :param path: ruta del archivo SQLite.
    :return: resultado de la acción indicado por su firma.
    :rtype: list[dict]

    Usage::

      result = list_sessions(path)
    """
    return [dict(id=s["id"], title=s["title"], openedAt=s["opened_at"], closedAt=s["closed_at"], total=s["total"]) for s in store.list_sessions(path)]


def create_session(path: str | Path, title: str, instant: float) -> dict:
    """Abre una sesión de asistencia.

    :param path: ruta del archivo SQLite.
    :param title: título opcional.
    :param instant: instante del reloj inyectado.
    :return: resultado de la acción indicado por su firma.
    :rtype: dict

    Usage::

      result = create_session(path, title, instant)
    """
    title = str(title or "").strip()
    if not title:
        title = datetime.fromtimestamp(instant).strftime("%d/%m/%Y %H:%M")
    opened_at = datetime.fromtimestamp(instant, timezone.utc).isoformat(timespec="milliseconds")
    return store.create_session(path, title, opened_at)


def teacher_view(path: str | Path, session_id: str, instant: float) -> dict:
    """Consulta el estado completo de la clase.

    :param path: ruta del archivo SQLite.
    :param session_id: identificador de sesión.
    :param instant: instante del reloj inyectado.
    :return: resultado de la acción indicado por su firma.
    :rtype: dict

    Usage::

      result = teacher_view(path, session_id, instant)
    """
    session = get_session(path, session_id)
    checkins = store.list_checkins(path, session_id)
    data = dict(id=session["id"], title=session["title"], open=session["closed_at"] is None,
                openedAt=session["opened_at"], closedAt=session["closed_at"], total=len(checkins),
                checkins=[dict(id=c["id"], name=c["name"], checkedAt=c["checked_at"]) for c in checkins])
    if data["open"]:
        data["code"] = code_for(session["secret"], instant)
        data["secondsLeft"] = seconds_left(instant)
    return data


def close_session(path: str | Path, session_id: str, instant: float) -> None:
    """Cierra una sesión existente.

    :param path: ruta del archivo SQLite.
    :param session_id: identificador de sesión.
    :param instant: instante del reloj inyectado.
    :return: resultado de la acción indicado por su firma.
    :rtype: None

    Usage::

      result = close_session(path, session_id, instant)
    """
    get_session(path, session_id)
    closed_at = datetime.fromtimestamp(instant, timezone.utc).isoformat(timespec="milliseconds")
    store.close_session(path, session_id, closed_at)


def remove_checkin(path: str | Path, session_id: str, checkin_id: int) -> bool:
    """Elimina una asistencia de la sesión.

    :param path: ruta del archivo SQLite.
    :param session_id: identificador de sesión.
    :param checkin_id: identificador del registro.
    :return: resultado de la acción indicado por su firma.
    :rtype: bool

    Usage::

      result = remove_checkin(path, session_id, checkin_id)
    """
    get_session(path, session_id)
    return store.remove_checkin(path, session_id, checkin_id)


def export_session(path: str | Path, session_id: str) -> tuple[str, str]:
    """Genera CSV y fecha para la descarga.

    :param path: ruta del archivo SQLite.
    :param session_id: identificador de sesión.
    :return: resultado de la acción indicado por su firma.
    :rtype: tuple[str, str]

    Usage::

      result = export_session(path, session_id)
    """
    session = get_session(path, session_id)
    return to_csv(store.list_checkins(path, session_id)), session["opened_at"][:10]
