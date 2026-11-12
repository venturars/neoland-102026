"""Validación y normalización de nombres de alumnos.

Usage::

  name = clean_name(raw)
  key = name_key(name)
"""

import unicodedata

MAX_LENGTH = 60


def clean_name(raw: str | None) -> str:
    """Devuelve el nombre sin espacios sobrantes.

    El nombre se guarda tal como lo escribió el alumno. No se escapa HTML
    aquí: la pantalla lo muestra como texto.

    :param raw: texto que escribió el alumno. Puede ser vacío o None.
    :return: nombre sin espacios al borde.
    :rtype: str
    :raises ValueError: si falta el nombre o pasa de 60 caracteres.

    Usage::

      name = clean_name(raw)
    """
    name = (raw or "").strip()
    if not name:
        raise ValueError("Escribe tu nombre.")
    if len(name) > MAX_LENGTH:
        raise ValueError(f"El nombre no puede tener más de {MAX_LENGTH} caracteres.")
    return name


def name_key(name: str) -> str:
    """Clave para detectar duplicados: sin tildes, mayúsculas ni espacios extra.

    :param name: nombre ya limpio.
    :return: clave comparable.
    :rtype: str

    Usage::

      key = name_key(name)
    """
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(c for c in decomposed if not unicodedata.combining(c))
    return " ".join(without_accents.casefold().split())
