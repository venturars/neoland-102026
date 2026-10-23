"""Errores que puede provocar un usuario, con su mensaje (spec 005 · plan §2.7 · CA-05).

Cada error lleva su mensaje como constante (ARCHITECTURE.md · E3, E5). La traducción a
cada plataforma (p. ej. el código HTTP) la hace la capa de entrada (E4).
"""


class AppError(Exception):
    """Base de los errores que puede provocar un usuario."""

    MESSAGE = "Error inesperado. Inténtalo de nuevo en unos segundos."

    def __init__(self) -> None:
        """Usa el mensaje de la clase como texto de la excepción."""
        super().__init__(self.MESSAGE)


class EmptyNameError(AppError):
    """El alumno no ha escrito su nombre (spec 001 · CA-08)."""

    MESSAGE = "Escribe tu nombre."


class NameTooLongError(AppError):
    """El nombre pasa del límite de `names.MAX_LENGTH` (spec 001 · CA-08)."""

    # El número coincide con names.MAX_LENGTH; lo comprueba test_errors.py.
    MESSAGE = "El nombre no puede tener más de 60 caracteres. Escríbelo más corto."


class TitleTooLongError(AppError):
    """El título de una clase nueva pasa de `sessions.MAX_TITLE_LENGTH` (spec 005 · CA-08)."""

    # El número coincide con sessions.MAX_TITLE_LENGTH; lo comprueba test_errors.py.
    MESSAGE = "El título no puede tener más de 20 caracteres. Escríbelo más corto."


class InvalidCodeError(AppError):
    """El código es incorrecto o ha caducado (spec 001 · CA-06)."""

    MESSAGE = "El código no es válido o ha caducado. Pide el código actual al profesor."


class SessionClosedError(AppError):
    """La clase ya está cerrada y no acepta registros (spec 001 · CA-09)."""

    MESSAGE = "La asistencia de esta clase ya está cerrada. Si acabas de llegar, avisa al profesor."


class SessionNotFoundError(AppError):
    """La clase pedida no existe."""

    MESSAGE = "Esta clase no existe. Revisa el enlace."


class CheckinNotFoundError(AppError):
    """El registro no existe en esa clase (spec 001 · CA-24)."""

    MESSAGE = "Ese registro ya no está en esta clase. Recarga la lista."
