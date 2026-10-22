"""Acciones de pasar lista: abrir, cerrar, listar, exportar, quitar y registrarse.

No dibuja pantallas. Pide las reglas a ``domain`` y el guardado a ``storage``.

Usage::

  token = prepare(path)
  row, created = check_in(path, session_id, raw_name, code, now)
"""

from datetime import datetime, timezone

from asistencia.domain.codes import code_for, seconds_left
from asistencia.domain.names import clean_name, name_key
from asistencia.domain.session import ensure_code, ensure_open, require_session
from asistencia.export import to_csv
from asistencia.storage import sqlite as storage


def _iso(now) -> str:
    return datetime.fromtimestamp(now(), timezone.utc).isoformat(timespec="milliseconds")


def prepare(path) -> str:
    """Crea las tablas si faltan y devuelve el token del profesor.

    :param path: ruta del archivo donde se guarda la asistencia.
    :return: token del profesor.
    :rtype: str

    Usage::

      token = prepare(path)
    """
    storage.init_schema(path)
    return storage.get_or_create_teacher_token(path)


def public_session(path, session_id: str) -> dict:
    """Datos que ve el alumno antes de registrarse.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :return: título y si la clase sigue abierta.
    :rtype: dict

    Usage::

      info = public_session(path, session_id)
    """
    loaded = require_session(storage.get_session(path, session_id))
    return {"title": loaded["title"], "open": loaded["closed_at"] is None}


def check_in(path, session_id: str, raw_name, code, now) -> tuple[dict, bool]:
    """Registra a un alumno si la clase está abierta y el código vale.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :param raw_name: nombre tal como lo escribió el alumno.
    :param code: código de 4 cifras.
    :param now: función que devuelve el instante Unix actual.
    :return: el registro y True si se acaba de crear.
    :rtype: tuple[dict, bool]

    Usage::

      row, created = check_in(path, session_id, raw_name, code, now)
    """
    loaded = require_session(storage.get_session(path, session_id))
    ensure_open(loaded)
    name = clean_name(raw_name)
    ensure_code(loaded["secret"], "" if code is None else code, now())
    return storage.add_checkin(path, session_id, name, name_key(name), _iso(now))


def list_sessions(path) -> list[dict]:
    """Lista las clases para el panel del profesor.

    :param path: ruta del archivo.
    :return: clases, las más recientes primero.
    :rtype: list[dict]

    Usage::

      rows = list_sessions(path)
    """
    return storage.list_sessions(path)


def create_session(path, title, now) -> dict:
    """Abre una clase. Si no hay título, usa la fecha y la hora.

    :param path: ruta del archivo.
    :param title: título escrito por el profesor. Puede ir vacío.
    :param now: función que devuelve el instante Unix actual.
    :return: la clase creada.
    :rtype: dict

    Usage::

      loaded = create_session(path, title, now)
    """
    cleaned = str(title or "").strip()
    if not cleaned:
        cleaned = datetime.fromtimestamp(now()).strftime("%d/%m/%Y %H:%M")
    return storage.create_session(path, cleaned, _iso(now))


def teacher_view(path, session_id: str, now) -> dict:
    """Detalle de una clase para el panel del profesor.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :param now: función que devuelve el instante Unix actual.
    :return: la clase, sus registros y, si sigue abierta, el código vigente.
    :rtype: dict

    Usage::

      detail = teacher_view(path, session_id, now)
    """
    loaded = require_session(storage.get_session(path, session_id))
    checkins = storage.list_checkins(path, session_id)
    data = {
        "id": loaded["id"],
        "title": loaded["title"],
        "open": loaded["closed_at"] is None,
        "opened_at": loaded["opened_at"],
        "closed_at": loaded["closed_at"],
        "total": len(checkins),
        "checkins": checkins,
    }
    if data["open"]:
        data["code"] = code_for(loaded["secret"], now())
        data["seconds_left"] = seconds_left(now())
    return data


def close_session(path, session_id: str, now) -> None:
    """Cierra una clase.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :param now: función que devuelve el instante Unix actual.
    :return: None.
    :rtype: None

    Usage::

      close_session(path, session_id, now)
    """
    require_session(storage.get_session(path, session_id))
    storage.close_session(path, session_id, _iso(now))


def remove_checkin(path, session_id: str, checkin_id: int) -> bool:
    """Quita un registro de una clase.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :param checkin_id: id del registro.
    :return: True si el registro estaba en esa clase y se borró.
    :rtype: bool

    Usage::

      removed = remove_checkin(path, session_id, checkin_id)
    """
    require_session(storage.get_session(path, session_id))
    return storage.remove_checkin(path, session_id, checkin_id)


def export_csv(path, session_id: str) -> tuple[str, str]:
    """Prepara el CSV de una clase.

    :param path: ruta del archivo.
    :param session_id: id de la clase.
    :return: el texto CSV y el día de apertura, ``AAAA-MM-DD``.
    :rtype: tuple[str, str]

    Usage::

      text, day = export_csv(path, session_id)
    """
    loaded = require_session(storage.get_session(path, session_id))
    text = to_csv(storage.list_checkins(path, session_id))
    return text, loaded["opened_at"][:10]
