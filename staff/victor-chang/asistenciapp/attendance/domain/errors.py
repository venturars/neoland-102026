"""Errores que puede provocar un usuario, con su mensaje (spec 005 · plan §2.7 · CA-05; spec 004 · plan §2.7).

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


# ---------- Modo automático (spec 004 · plan §2.7) ----------
# Son de la reunión, no de Google: así la tabla de la entrada web no depende de la infraestructura (C1).


class NotCodeSessionError(AppError):
    """Check-in por código en una clase automática (spec 004 · CA-02)."""

    MESSAGE = "Esta clase no usa código: la asistencia se toma automáticamente desde Meet."


class NotAutomaticSessionError(AppError):
    """Tomar asistencia de Meet en una clase de código."""

    MESSAGE = "Esta clase usa código: los alumnos se registran con el enlace y el código."


class MeetingLinkInvalidError(AppError):
    """El enlace o código de la reunión falta o está mal escrito."""

    MESSAGE = "Pega el enlace o el código de la reunión de Meet (p. ej. abc-defg-hij)."


class MeetingNotVisibleError(AppError):
    """Esta cuenta no ve ninguna reunión con ese código (spec 004 · CA-13, CA-14).

    La plataforma responde lo mismo si no existe, no ha empezado, caducó o la cuenta no la ve.
    """

    MESSAGE = (
        "No hay ninguna reunión con ese enlace que esta cuenta pueda ver. Revisa el enlace, "
        "entra en la reunión con esta cuenta o pide al organizador que tome la asistencia."
    )


class MeetingEndedError(AppError):
    """Se pidió quién está ahora en una reunión que ya terminó (spec 004 · CA-21)."""

    MESSAGE = "Esta reunión ya terminó. Usa «Todos los que han estado» para registrar a quienes estuvieron."


class MeetPermissionMissingError(AppError):
    """Se inició sesión sin conceder el permiso de Meet (spec 004 · plan §2.4)."""

    MESSAGE = (
        "Falta el permiso de Google Meet. Vuelve a tomar la asistencia y marca la casilla "
        "«Ver información sobre tus reuniones de Google Meet»."
    )


class MeetLoginNotCompletedError(AppError):
    """No se aceptó el permiso de Google a tiempo (spec 004 · CA-11)."""

    MESSAGE = "No se completó el permiso de Google. Vuelve a tomar la asistencia y acepta en la ventana de Google."


class MeetNotConfiguredError(AppError):
    """Falta la llave de la app, o la API de Meet está desactivada en Google Cloud."""

    MESSAGE = "Falta preparar la app en Google Cloud. Sigue los pasos de «Modo automático» en el README."


class MeetServiceError(AppError):
    """Google o la red fallan."""

    MESSAGE = "Google Meet no responde ahora mismo. Inténtalo de nuevo en unos segundos."
