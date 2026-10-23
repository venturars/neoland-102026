"""Validación y normalización de nombres de alumnos (plan §2.4)."""

import unicodedata

MAX_LENGTH = 60


def clean_name(raw: str | None) -> str:
    """Recorta y valida el nombre sin escapar su contenido.

    :param raw: nombre recibido o ausencia de nombre.
    :return: nombre válido; lanza ValueError si no cumple los límites.
    :rtype: str

    Usage::

        clean_name("  Ana García  ")
    """
    name = (raw or "").strip()
    if not name:
        raise ValueError("Escribe tu nombre.")
    if len(name) > MAX_LENGTH:
        raise ValueError(f"El nombre no puede tener más de {MAX_LENGTH} caracteres.")
    return name


def name_key(name: str) -> str:
    """Normaliza el nombre para detectar duplicados.

    :param name: nombre válido.
    :return: clave sin tildes, mayúsculas ni espacios adicionales.
    :rtype: str

    Usage::

        name_key("Ana García")
    """
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(c for c in decomposed if not unicodedata.combining(c))
    return " ".join(without_accents.casefold().split())
