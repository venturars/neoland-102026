"""Validación y normalización de nombres de alumnos (spec 001 · plan §2.4)."""

import unicodedata

from attendance.domain.errors import EmptyNameError, NameTooLongError

MAX_LENGTH = 60


def clean_name(raw: str) -> str:
    """Devuelve el nombre sin espacios sobrantes (CA-08).

    El nombre se guarda tal como lo escribió el alumno: no se escapa HTML
    aquí, porque el frontend lo muestra siempre como texto (CA-12).

    Raises:
        EmptyNameError: el nombre está vacío o solo tiene espacios.
        NameTooLongError: el nombre pasa de MAX_LENGTH caracteres.
    """
    name = raw.strip()
    if not name:
        raise EmptyNameError
    if len(name) > MAX_LENGTH:
        raise NameTooLongError
    return name


def name_key(name: str) -> str:
    """Clave para detectar duplicados: sin tildes, mayúsculas ni espacios extra (CA-07)."""
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(c for c in decomposed if not unicodedata.combining(c))
    return " ".join(without_accents.casefold().split())
