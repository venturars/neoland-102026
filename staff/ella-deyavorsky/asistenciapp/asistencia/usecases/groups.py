"""Acciones de los grupos del profesor: crear, revisar, editar, archivar y borrar (spec 007).

Como ``attendance``, cada acción recibe la ruta de la base de datos (``db_path``)
y, si hace falta, el reloj (``now``); decide con el dominio, guarda y lee con
el almacenamiento y devuelve diccionarios.
"""

import os
from datetime import datetime, timezone
from typing import Callable

from asistencia.domain.names import MAX_LENGTH, clean_name, find_similar, name_key
from asistencia.domain.roster import (
    DUPLICATE,
    GROUP_FULL,
    GROUP_NOT_FOUND,
    STUDENT_NOT_FOUND,
    DuplicateName,
    GroupFull,
    GroupNotFound,
    StudentNotFound,
    can_save,
    parse_csv,
    parse_pasted,
    review,
)
from asistencia.domain.session import ensure_can_delete
from asistencia.storage import sqlite as storage

Clock = Callable[[], float]
DbPath = str | os.PathLike[str]

GROUP_NAME_MISSING = "Escribe el nombre del grupo."
GROUP_NAME_TOO_LONG = f"El nombre del grupo no puede tener más de {MAX_LENGTH} caracteres."


def _now_iso(now: Clock) -> str:
    return datetime.fromtimestamp(now(), timezone.utc).isoformat(timespec="milliseconds")


def _group(db_path: DbPath, group_id: str) -> dict:
    group = storage.get_group(db_path, group_id)
    if group is None:
        raise GroupNotFound(GROUP_NOT_FOUND)
    return group


def _clean_group_name(raw: str | None) -> str:
    name = str(raw or "").strip()
    if not name:
        raise ValueError(GROUP_NAME_MISSING)
    if len(name) > MAX_LENGTH:
        raise ValueError(GROUP_NAME_TOO_LONG)
    return name


def _summary(group: dict) -> dict:
    return {
        "id": group["id"],
        "name": group["name"],
        "students": group["student_count"],
        "archived": group["archived_at"] is not None,
    }


def _review_view(result: dict) -> dict:
    return {
        "students": result["students"],
        "duplicates": result["duplicates"],
        "empty": result["empty"],
        "tooLong": result["too_long"],
        "similar": result["similar"],
        "tooMany": result["too_many"],
        "canSave": can_save(result),
    }


def _ensure_saveable(result: dict) -> None:
    # El servidor vuelve a revisar: nunca se fía de la vista previa del navegador (RF-7).
    if result["duplicates"]:
        raise DuplicateName(DUPLICATE)
    if result["too_long"]:
        clean_name(result["too_long"][0])  # lanza el ValueError con el mensaje de siempre
    if result["too_many"]:
        raise GroupFull(GROUP_FULL)


def _existing_names(db_path: DbPath, group_id: str | None) -> list[str]:
    if not group_id:
        return []
    _group(db_path, group_id)
    return [s["name"] for s in storage.list_group_students(db_path, group_id)]


def preview_roster(db_path: DbPath, text: str, source: str, group_id: str | None = None) -> dict:
    """Revisa una lista pegada o un CSV sin guardarla (RF-2, CA-01, CA-02).

    :param db_path: ruta de la base de datos.
    :param text: el texto pegado o el contenido del CSV.
    :param source: ``"paste"`` o ``"csv"``.
    :param group_id: grupo que se está editando, para comparar con sus nombres.
    :return: alumnos válidos, problemas y si se puede guardar (``canSave``).
    :rtype: dict
    :raises GroupNotFound: si ``group_id`` no existe.

    Usage::

        >>> preview_roster(db_path, "Ana\\nLuis", "paste")["canSave"]  # doctest: +SKIP
        True
    """
    names = parse_csv(text) if source == "csv" else parse_pasted(text)
    return _review_view(review(names, _existing_names(db_path, group_id)))


def create_group(db_path: DbPath, name: str | None, students: list[str], now: Clock) -> dict:
    """Crea un grupo con su lista; puede estar vacía (RF-1, RF-8b).

    :param db_path: ruta de la base de datos.
    :param name: nombre del grupo.
    :param students: nombres de los alumnos.
    :param now: reloj que devuelve segundos Unix.
    :return: el grupo con sus alumnos, como :func:`group_detail`.
    :rtype: dict
    :raises ValueError: si falta el nombre o algún nombre es demasiado largo.
    :raises DuplicateName: si hay nombres repetidos.
    :raises GroupFull: si pasa de 200 alumnos.

    Usage::

        >>> create_group(db_path, "SDD", ["Ana"], time.time)["name"]  # doctest: +SKIP
        'SDD'
    """
    group_name = _clean_group_name(name)
    result = review(list(students or []))
    _ensure_saveable(result)
    group = storage.create_group(db_path, group_name, _now_iso(now))
    storage.add_group_students(db_path, group["id"], [(n, name_key(n)) for n in result["students"]])
    return group_detail(db_path, group["id"])


def list_groups(db_path: DbPath, archived: bool = False) -> list[dict]:
    """Grupos activos o archivados, con su número de alumnos (RF-4, RF-5).

    :param db_path: ruta de la base de datos.
    :param archived: ``True`` para los archivados.
    :return: ``id``, ``name``, ``students`` y ``archived`` de cada grupo.
    :rtype: list[dict]

    Usage::

        >>> list_groups(db_path)  # doctest: +SKIP
        [{'id': 'g1', 'name': 'SDD', 'students': 25, 'archived': False}]
    """
    return [_summary(g) for g in storage.list_groups(db_path, archived)]


def group_detail(db_path: DbPath, group_id: str) -> dict:
    """Un grupo con la lista de sus alumnos (RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :return: ``id``, ``name``, ``archived`` y ``students`` (``id`` y ``name``).
    :rtype: dict
    :raises GroupNotFound: si no existe.

    Usage::

        >>> group_detail(db_path, "g1")["students"]  # doctest: +SKIP
        [{'id': 1, 'name': 'Ana'}]
    """
    group = _group(db_path, group_id)
    students = storage.list_group_students(db_path, group_id)
    return {
        **_summary(group),
        "students": [{"id": s["id"], "name": s["name"]} for s in students],
    }


def rename_group(db_path: DbPath, group_id: str, name: str | None) -> None:
    """Cambia el nombre del grupo (RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param name: nombre nuevo.
    :return: nada.
    :rtype: None
    :raises GroupNotFound: si no existe.
    :raises ValueError: si el nombre está vacío o es demasiado largo.

    Usage::

        >>> rename_group(db_path, "g1", "SDD 2º B")  # doctest: +SKIP
    """
    _group(db_path, group_id)
    storage.rename_group(db_path, group_id, _clean_group_name(name))


def set_archived(db_path: DbPath, group_id: str, archived: bool, now: Clock) -> None:
    """Archiva o restaura un grupo; una sesión abierta sigue funcionando (RF-5, CA-09).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param archived: ``True`` para archivar, ``False`` para restaurar.
    :param now: reloj que devuelve segundos Unix.
    :return: nada.
    :rtype: None
    :raises GroupNotFound: si no existe.

    Usage::

        >>> set_archived(db_path, "g1", True, time.time)  # doctest: +SKIP
    """
    _group(db_path, group_id)
    storage.set_group_archived(db_path, group_id, _now_iso(now) if archived else None)


def delete_group(db_path: DbPath, group_id: str) -> None:
    """Borra un grupo sin sesiones abiertas; sus sesiones cerradas se conservan (RF-6, CA-09).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :return: nada.
    :rtype: None
    :raises GroupNotFound: si no existe.
    :raises GroupHasOpenSession: si tiene una sesión abierta.

    Usage::

        >>> delete_group(db_path, "g1")  # doctest: +SKIP
    """
    _group(db_path, group_id)
    ensure_can_delete(storage.count_open_sessions_of_group(db_path, group_id))
    storage.delete_group(db_path, group_id)


def add_students(db_path: DbPath, group_id: str, names: list[str]) -> dict:
    """Añade alumnos a un grupo ya guardado (RF-3, CA-13).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param names: nombres nuevos.
    :return: ``added`` (cuántos) y ``similar`` (avisos «¿Quisiste decir…?»).
    :rtype: dict
    :raises GroupNotFound: si no existe.
    :raises DuplicateName: si alguno ya está en el grupo o se repite.
    :raises GroupFull: si el grupo pasaría de 200.
    :raises ValueError: si algún nombre es demasiado largo.

    Usage::

        >>> add_students(db_path, "g1", ["Zoe"])  # doctest: +SKIP
        {'added': 1, 'similar': []}
    """
    result = review(list(names or []), _existing_names(db_path, group_id))
    _ensure_saveable(result)
    storage.add_group_students(db_path, group_id, [(n, name_key(n)) for n in result["students"]])
    return {"added": len(result["students"]), "similar": result["similar"]}


def rename_student(db_path: DbPath, group_id: str, student_id: int, name: str | None) -> dict:
    """Corrige el nombre de un alumno; las sesiones pasadas no cambian (RF-3, CA-08).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param student_id: identificador del alumno.
    :param name: nombre nuevo.
    :return: ``similar``: el nombre parecido de otro alumno, o ``None``.
    :rtype: dict
    :raises GroupNotFound: si el grupo no existe.
    :raises StudentNotFound: si el alumno no está en el grupo.
    :raises DuplicateName: si otro alumno ya se llama así.
    :raises ValueError: si el nombre no es válido.

    Usage::

        >>> rename_student(db_path, "g1", 1, "Ana García")  # doctest: +SKIP
        {'similar': None}
    """
    _group(db_path, group_id)
    clean = clean_name(name)
    key = name_key(clean)
    others = [s for s in storage.list_group_students(db_path, group_id) if s["id"] != student_id]
    if any(s["name_key"] == key for s in others):
        raise DuplicateName(DUPLICATE)
    if not storage.rename_group_student(db_path, group_id, student_id, clean, key):
        raise StudentNotFound(STUDENT_NOT_FOUND)
    return {"similar": find_similar(key, [s["name"] for s in others])}


def remove_student(db_path: DbPath, group_id: str, student_id: int) -> None:
    """Quita a un alumno del grupo; las sesiones pasadas no cambian (RF-3).

    :param db_path: ruta de la base de datos.
    :param group_id: identificador del grupo.
    :param student_id: identificador del alumno.
    :return: nada.
    :rtype: None
    :raises GroupNotFound: si el grupo no existe.
    :raises StudentNotFound: si el alumno no está en el grupo.

    Usage::

        >>> remove_student(db_path, "g1", 1)  # doctest: +SKIP
    """
    _group(db_path, group_id)
    if not storage.remove_group_student(db_path, group_id, student_id):
        raise StudentNotFound(STUDENT_NOT_FOUND)
