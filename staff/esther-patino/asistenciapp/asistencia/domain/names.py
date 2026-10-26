"""Validación y normalización de nombres de alumnos."""

import unicodedata

MAX_LENGTH = 60


def clean_name(raw) -> str:
    """Quita los espacios sobrantes del nombre que escribió el alumno.

    El nombre se guarda tal como lo escribió: no se escapa HTML aquí,
    porque el navegador lo muestra siempre como texto.

    :param raw: texto recibido, o None si no llegó.
    :return: el nombre sin espacios al inicio ni al final.
    :raises ValueError: si el nombre está vacío o pasa de 60 caracteres.
    """
    name = (raw or "").strip()
    if not name:
        raise ValueError("Escribe tu nombre.")
    if len(name) > MAX_LENGTH:
        raise ValueError(f"El nombre no puede tener más de {MAX_LENGTH} caracteres.")
    return name


def name_key(name: str) -> str:
    """Calcula la clave que detecta el mismo nombre escrito de otra forma.

    :param name: nombre ya limpio.
    :return: el nombre sin tildes, en minúsculas y con un solo espacio entre palabras.
    """
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(c for c in decomposed if not unicodedata.combining(c))
    return " ".join(without_accents.casefold().split())
