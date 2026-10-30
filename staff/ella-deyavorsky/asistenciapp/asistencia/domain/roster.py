"""Lista de alumnos de un grupo: leerla, revisarla y sus errores (spec 007)."""

import csv
import io

from asistencia.domain.names import MAX_LENGTH, capitalize_name, clean_name, find_similar, name_key

MAX_STUDENTS = 200
HEADERS = {"nombre", "nombres", "name", "alumno", "alumnos"}

DUPLICATE = (
    "Ese nombre ya está en la lista. Si eres tú, elígelo en la lista; "
    "si no, diferéncialo, por ejemplo con la inicial del apellido."
)
NOT_IN_ROSTER = "Ese nombre no está en la lista de la clase."
NAME_TAKEN = "Este nombre ya está registrado. Si no has sido tú, avisa al profesor."
EMPTY_GROUP = "Este grupo todavía no tiene alumnos."
GROUP_FULL = f"Este grupo ya tiene {MAX_STUDENTS} alumnos."
HAS_OPEN_SESSION = (
    "Este grupo tiene una asistencia abierta: ciérrala o archiva el grupo antes de borrarlo."
)
ARCHIVED = "Este grupo está archivado. Restáuralo para abrir asistencias con él."
GROUP_GONE = "El grupo de esta clase se ha borrado."
GROUP_NOT_FOUND = "Ese grupo no existe."
STUDENT_NOT_FOUND = "Ese alumno no está en el grupo."
NO_GROUP = "Esta clase no tiene lista de grupo."


class DuplicateName(Exception):
    """El nombre ya existe, normalizado, en la lista o entre los registros."""


class SimilarName(Exception):
    """El nombre se parece a otro: hay que preguntar «¿Quisiste decir…?»."""

    def __init__(self, suggestion: str):
        super().__init__(f"¿Quisiste decir {suggestion}?")
        self.suggestion = suggestion


class NotInRoster(Exception):
    """El nombre no está en la copia de la lista de la sesión."""


class NameTaken(Exception):
    """El nombre de la lista ya está registrado en la sesión."""


class EmptyGroup(Exception):
    """El grupo no tiene alumnos y no puede abrir sesión."""


class GroupFull(Exception):
    """El grupo pasaría de 200 alumnos."""


class GroupHasOpenSession(Exception):
    """El grupo tiene una sesión abierta y no se puede borrar."""


class GroupArchived(Exception):
    """El grupo está archivado y no puede abrir sesión."""


class GroupGone(Exception):
    """El grupo de la sesión se ha borrado."""


class GroupNotFound(LookupError):
    """El grupo pedido no existe."""


class StudentNotFound(LookupError):
    """El alumno pedido no está en el grupo."""


class NoGroup(Exception):
    """La sesión es rápida: no tiene lista de grupo."""


def parse_pasted(text: str) -> list[str]:
    """Un nombre por línea, tal cual; las líneas vacías se quedan para contarlas (RF-1a).

    :param text: texto pegado por el profesor.
    :return: una entrada por línea.
    :rtype: list[str]

    Usage::

        >>> parse_pasted("Ana\\nLuis")
        ['Ana', 'Luis']
    """
    return (text or "").splitlines()


def _delimiter(first_line: str) -> str | None:
    semicolons, commas = first_line.count(";"), first_line.count(",")
    if not semicolons and not commas:
        return None
    return ";" if semicolons >= commas else ","


def parse_csv(text: str) -> list[str]:
    """Primera columna de un CSV separado por ``;`` o ``,``, sin BOM ni cabecera (RF-1b, CA-18).

    :param text: contenido del archivo, ya leído como texto.
    :return: los nombres, uno por fila; las filas vacías se quedan para contarlas.
    :rtype: list[str]

    Usage::

        >>> parse_csv("\\ufeffNombre;Email\\nAna;a@x.es")
        ['Ana']
    """
    text = (text or "").lstrip("﻿")
    lines = text.splitlines()
    first = next((line for line in lines if line.strip()), "")
    delimiter = _delimiter(first)
    if delimiter is None:
        rows = [[line] for line in lines]
    else:
        rows = list(csv.reader(io.StringIO(text), delimiter=delimiter))
    names = [row[0] if row else "" for row in rows]
    if names and name_key(names[0]).rstrip(":") in HEADERS:
        names = names[1:]
    return names


def review(names: list[str], existing: list[str] = ()) -> dict:
    """Revisa una lista antes de guardarla (RF-2, RF-7, CA-01, CA-02).

    :param names: nombres leídos, sin limpiar.
    :param existing: nombres que ya tiene el grupo, si se está editando.
    :return: ``students`` (los válidos, sin repetir y con mayúscula inicial),
        ``duplicates``, ``empty``, ``too_long``, ``similar`` (avisos ``{name, like}``)
        y ``too_many``.
    :rtype: dict

    Usage::

        >>> review(["Ana", "ana", ""])["duplicates"]
        ['ana']
    """
    seen = {name_key(n) for n in existing}
    known = list(existing)
    result = {"students": [], "duplicates": [], "empty": 0, "too_long": [], "similar": []}
    for raw in names:
        stripped = (raw or "").strip()
        if not stripped:
            result["empty"] += 1
            continue
        if len(stripped) > MAX_LENGTH:
            result["too_long"].append(stripped)
            continue
        name = capitalize_name(clean_name(stripped))  # RF-7b
        key = name_key(name)
        if key in seen:
            result["duplicates"].append(raw)
            continue
        like = find_similar(key, known)
        if like:
            result["similar"].append({"name": name, "like": like})
        seen.add(key)
        known.append(name)
        result["students"].append(name)
    result["too_many"] = len(existing) + len(result["students"]) > MAX_STUDENTS
    return result


def can_save(result: dict) -> bool:
    """Dice si una lista revisada se puede guardar; los parecidos solo avisan (CA-02).

    :param result: lo que devolvió :func:`review`.
    :return: ``True`` si no hay duplicados, nombres largos ni más de 200.
    :rtype: bool

    Usage::

        >>> can_save(review(["Ana", "Luis"]))
        True
    """
    return not (result["duplicates"] or result["too_long"] or result["too_many"])


def ensure_room(student_count: int, adding: int = 1) -> None:
    """Comprueba que el grupo no pasa de 200 alumnos (spec §5.1, CA-20).

    :param student_count: alumnos que ya tiene el grupo.
    :param adding: alumnos que se quieren añadir.
    :return: nada si caben.
    :rtype: None
    :raises GroupFull: si el grupo pasaría de 200.

    Usage::

        >>> ensure_room(10)
    """
    if student_count + adding > MAX_STUDENTS:
        raise GroupFull(GROUP_FULL)
