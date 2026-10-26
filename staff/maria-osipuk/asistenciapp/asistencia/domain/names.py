"""Validación y normalización de nombres de alumnos."""

import unicodedata

MAX_LENGTH = 60


def clean_name(raw: object) -> str:
    """Nombre sin espacios sobrantes.

    El nombre se guarda tal como lo escribió el alumno. No se escapa HTML
    aquí: la pantalla lo muestra como texto.

    :param raw: Texto recibido.
    :return: Nombre recortado.
    :rtype: str
    :raises ValueError: Si falta el nombre o supera los 60 caracteres.

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
    """Clave para detectar duplicados: sin tildes, mayúsculas ni espacios extra.

    :param name: Nombre ya aceptado.
    :return: Clave comparable.
    :rtype: str

    Usage::

        name_key("Ana García") == name_key("ana garcia")
    """
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(character for character in decomposed if not unicodedata.combining(character))
    return " ".join(without_accents.casefold().split())
