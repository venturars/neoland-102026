"""Validación y normalización de nombres de alumnos (plan §2.4)."""

import unicodedata
from difflib import SequenceMatcher
from typing import Iterable

MAX_LENGTH = 60
SIMILAR_RATIO = 0.8
LOWERCASE_WORDS = {"de", "del", "la", "las", "los", "y", "e"}


def clean_name(raw: str | None) -> str:
    """Devuelve el nombre sin espacios sobrantes o lanza ValueError (CA-08).

    El nombre se guarda tal como lo escribió el alumno: no se escapa HTML
    aquí, porque el frontend lo muestra siempre como texto (CA-12).

    :param raw: lo que escribió el alumno.
    :return: el nombre sin espacios sobrantes.
    :rtype: str
    :raises ValueError: si está vacío o pasa de ``MAX_LENGTH`` caracteres.

    Usage::

        >>> clean_name("  Ana García ")
        'Ana García'
    """
    name = (raw or "").strip()
    if not name:
        raise ValueError("Escribe tu nombre.")
    if len(name) > MAX_LENGTH:
        raise ValueError(f"El nombre no puede tener más de {MAX_LENGTH} caracteres.")
    return name


def _capitalize_word(word: str) -> str:
    return "-".join(part[:1].upper() + part[1:] for part in word.split("-"))


def capitalize_name(name: str) -> str:
    """Pone en mayúscula la primera letra de cada palabra (spec 007, RF-7b, CA-22).

    Solo para los nombres que introduce el profesor en la lista de un grupo.
    «de», «del», «la», «las», «los», «y» y «e» se quedan como están si no son
    la primera palabra, y el resto de cada palabra no cambia: «McDonald» sigue igual.

    :param name: nombre ya limpio, de :func:`clean_name`.
    :return: el nombre con mayúscula inicial en cada palabra.
    :rtype: str

    Usage::

        >>> capitalize_name("maría de la fuente")
        'María de la Fuente'
    """
    words = name.split(" ")  # sin split() a secas: los espacios dobles se conservan
    return " ".join(
        word if i > 0 and word.casefold() in LOWERCASE_WORDS else _capitalize_word(word)
        for i, word in enumerate(words)
    )


def name_key(name: str) -> str:
    """Clave para detectar duplicados: sin tildes, mayúsculas ni espacios extra (CA-07).

    :param name: nombre ya limpio.
    :return: la clave de comparación.
    :rtype: str

    Usage::

        >>> name_key("Ána  García")
        'ana garcia'
    """
    decomposed = unicodedata.normalize("NFD", name)
    without_accents = "".join(c for c in decomposed if not unicodedata.combining(c))
    return " ".join(without_accents.casefold().split())


def _words(key: str) -> list[str]:
    return [w.strip(".") for w in key.split() if w.strip(".")]


def _is_initial_of(a: str, b: str) -> bool:
    return len(a) == 1 and len(b) > 1 and b.startswith(a)


def is_similar(a_key: str, b_key: str) -> bool:
    """Dice si dos nombres se parecen, para preguntar «¿Quisiste decir…?» (spec 007, CA-05).

    Se parecen si, sin ser iguales, casi coinciden letra a letra (erratas) o
    tienen la misma primera palabra y una inicial que encaja con un apellido.

    :param a_key: clave de un nombre, de :func:`name_key`.
    :param b_key: clave del otro nombre.
    :return: ``True`` si se parecen.
    :rtype: bool

    Usage::

        >>> is_similar("ella g", "ella garcia")
        True
        >>> is_similar("ana lopez", "pedro ruiz")
        False
    """
    if a_key == b_key:
        return False
    if SequenceMatcher(None, a_key, b_key).ratio() >= SIMILAR_RATIO:
        return True
    a, b = _words(a_key), _words(b_key)
    if len(a) < 2 or len(b) < 2 or a[0] != b[0]:
        return False
    return any(_is_initial_of(x, y) or _is_initial_of(y, x) for x in a[1:] for y in b[1:])


def find_similar(key: str, names: Iterable[str]) -> str | None:
    """Busca el primer nombre que se parece a ``key`` (spec 007, CA-05).

    :param key: clave del nombre nuevo, de :func:`name_key`.
    :param names: nombres con los que comparar, tal como se muestran.
    :return: el primer nombre parecido, o ``None``.
    :rtype: str | None

    Usage::

        >>> find_similar("ella g", ["Pedro Ruiz", "Ella García"])
        'Ella García'
    """
    return next((n for n in names if is_similar(key, name_key(n))), None)
