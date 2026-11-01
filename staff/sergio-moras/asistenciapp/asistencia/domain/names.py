"""Validación de los nombres que escriben los alumnos.

Usage::

  >>> name = clean_name("  Ana García ")
  >>> name_key(name)
  'ana garcia'
"""

import unicodedata

MAX_LENGTH = 60


class InvalidName(ValueError):
    """El nombre está vacío o es demasiado largo. El mensaje es el que ve el alumno."""


def clean_name(raw: str | None) -> str:
    """Devuelve el nombre sin espacios al principio ni al final.

    El nombre se guarda tal como lo escribió el alumno: no se escapa HTML aquí,
    porque las pantallas lo muestran siempre como texto.

    :param raw: lo que escribió el alumno (puede ser ``None``).
    :return: el nombre limpio.
    :rtype: str
    :raises InvalidName: si queda vacío o pasa de ``MAX_LENGTH`` caracteres.

    Usage::

      >>> clean_name("  Ana García ")
      'Ana García'
    """
    name = (raw or "").strip()
    if not name:
        raise InvalidName("Escribe tu nombre.")
    if len(name) > MAX_LENGTH:
        raise InvalidName(f"El nombre no puede tener más de {MAX_LENGTH} caracteres.")
    return name


def name_key(name: str) -> str:
    """Devuelve la clave con la que se detectan nombres repetidos.

    Ignora tildes, mayúsculas y espacios de más, así «Ana  García» y
    «ana garcia» son la misma persona.

    :param name: nombre ya limpio.
    :return: clave normalizada.
    :rtype: str

    Usage::

      >>> name_key("Ana  García")
      'ana garcia'
    """
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(c for c in decomposed if not unicodedata.combining(c))
    return " ".join(without_accents.casefold().split())
