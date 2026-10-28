"""El formato de los enlaces de Google Meet (spec 004 · plan §2.3, §2.12).

Solo comprueba texto, sin E/S: así las clases no dependen de las librerías de Google (ARCHITECTURE.md · C1, O1).
"""

import re

from attendance.domain.errors import MeetingLinkInvalidError

# Código de reunión de Meet: tres grupos de letras ASCII ([a-z], no \w, ARCHITECTURE.md · E1), solo o
# dentro del enlace, con parámetros opcionales (p. ej. ?authuser=1).
MEETING_LINK = re.compile(
    r"(?:(?:https?://)?meet\.google\.com/)?(?P<code>[a-z]{3}-[a-z]{4}-[a-z]{3})/?(?:\?[\w=&.-]*)?"
)


def parse_meeting_code(text: str) -> str:
    """El código de la reunión (`abc-defg-hij`) a partir de un enlace de Meet o del propio código.

    Acepta mayúsculas y espacios alrededor.

    Raises:
        MeetingLinkInvalidError: no es un enlace ni un código de Meet.
    """
    text = text.strip()
    # Antes de pasar a minúsculas: lower() convierte algunos símbolos (p. ej. el signo Kelvin) en letras ASCII.
    if not text.isascii():
        raise MeetingLinkInvalidError
    match = MEETING_LINK.fullmatch(text.lower())
    if match is None:
        raise MeetingLinkInvalidError
    return match.group("code")
