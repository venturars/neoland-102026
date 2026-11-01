"""Validación y normalización de nombres de alumnos (plan §2.4)."""

import unicodedata

MAX_LENGTH = 60


def clean_name(raw) -> str:
    """Devuelve el nombre sin espacios sobrantes o lanza ValueError (CA-08).

    El nombre se guarda tal como lo escribió el alumno: no se escapa HTML
    aquí, porque el frontend lo muestra siempre como texto (CA-12).
    """
    name = (raw or "").strip()
    if not name:
        raise ValueError("Escribe tu nombre.")
    if len(name) > MAX_LENGTH:
        raise ValueError(f"El nombre no puede tener más de {MAX_LENGTH} caracteres.")
    return name


def name_key(name: str) -> str:
    """Clave para detectar duplicados: sin tildes, mayúsculas ni espacios extra (CA-07)."""
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(c for c in decomposed if not unicodedata.combining(c))
    return " ".join(without_accents.casefold().split())
