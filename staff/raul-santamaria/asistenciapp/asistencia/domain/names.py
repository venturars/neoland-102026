"""Acepta o rechaza el nombre que escribe el alumno.

Usage::

  >>> from asistencia.domain.names import clean_name, name_key
  >>> clean_name("  Ana  ")
"""

import unicodedata

MAX_LENGTH = 60


def clean_name(raw) -> str:
    """Devuelve el nombre sin espacios sobrantes o lanza ValueError.

    El nombre se guarda tal como lo escribió el alumno: no se escapa HTML
    aquí, porque el frontend lo muestra siempre como texto.

    :param raw: texto tal como llegó.
    :return: nombre limpio.
    :rtype: str
    :raises ValueError: si está vacío o supera el máximo.

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
