"""Participantes de una reunión: quién cuenta y cómo se nombran en la lista (spec 004 · plan §2.2, §2.8).

No sabe nada de Google: recibe los nombres visibles que da una plataforma, así que sirve igual para
otras fuentes, como Discord (constitución P1; ARCHITECTURE.md · C3).
"""

from collections.abc import Iterable
from dataclasses import dataclass
from enum import StrEnum

from attendance.domain.names import MAX_LENGTH

GUEST_NAME = "Invitado sin nombre"


class Who(StrEnum):
    """Quién cuenta en una toma de asistencia (spec 004 · CA-18)."""

    NOW = "now"  # quién está en la llamada ahora (CA-05)
    EVERYONE = "everyone"  # todos los que han estado en algún momento (CA-19)


@dataclass(frozen=True)
class MeetingAttendance:
    """Lo que devuelve una plataforma al pedirle los participantes (spec 004 · CA-20).

    Attributes:
        names: los nombres visibles, tal como los da la plataforma, sin el profesor.
        started_at: inicio de la reunión elegida, en ISO 8601 UTC.
        ended: si esa reunión ya terminó.
    """

    names: tuple[str, ...]
    started_at: str
    ended: bool


@dataclass(frozen=True)
class SyncResult:
    """El resultado de una toma de asistencia automática (spec 004 · CA-05 a CA-07, CA-10, CA-20).

    Attributes:
        added: personas nuevas en la lista con esta toma.
        found: personas que dio la plataforma (sin el profesor).
        total: personas en la lista de la clase después de la toma.
        meeting_started_at: inicio de la reunión de la que es la toma, en ISO 8601 UTC.
        meeting_ended: si esa reunión ya había terminado.
    """

    added: int
    found: int
    total: int
    meeting_started_at: str
    meeting_ended: bool


def names_from_platform(display_names: Iterable[str]) -> list[str]:
    """Convierte los nombres visibles de una plataforma en nombres para la lista (spec 004 · CA-08).

    Quita los espacios de los extremos; un nombre vacío pasa a "Invitado sin nombre" (numerado si hay
    varios en la misma toma) y uno de más de MAX_LENGTH caracteres se recorta, porque el alumno no
    puede corregirlo como en el modo código.
    """
    names: list[str] = []
    guests = 0
    for raw in display_names:
        name = raw.strip()[:MAX_LENGTH].rstrip()
        if not name:
            guests += 1
            name = GUEST_NAME if guests == 1 else f"{GUEST_NAME} {guests}"
        names.append(name)
    return names
