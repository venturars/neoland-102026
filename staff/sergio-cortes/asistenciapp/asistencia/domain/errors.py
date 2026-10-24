"""Errores de negocio que la capa web traduce a HTTP."""


class SessionNotFound(Exception):
    """La sesión no existe."""


class SessionClosed(Exception):
    """La asistencia ya está cerrada."""


class InvalidCode(Exception):
    """El código no es válido o ha caducado."""


class InvalidName(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class CheckinNotFound(Exception):
    """El registro de asistencia no existe en esa sesión."""
