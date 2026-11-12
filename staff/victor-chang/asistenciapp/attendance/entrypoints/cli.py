"""Entrada de línea de comandos: el atajo `python app.py --meet <código>` (spec 004 · HU-01; decisión §8.2).

Crea la clase automática y hace la primera toma con los mismos casos de uso que la web (ARCHITECTURE.md · C3).
No imprime nada: devuelve el texto y lo imprime `app.py`, que es quien habla con la terminal.
"""

import sqlite3
from dataclasses import dataclass
from datetime import UTC, datetime, tzinfo

from attendance.domain.errors import AppError
from attendance.domain.participants import SyncResult, Who
from attendance.domain.sessions import Mode
from attendance.usecases import attendance, sessions
from attendance.usecases.attendance import FetchParticipants


@dataclass(frozen=True)
class MeetStart:
    """Lo que deja el atajo `--meet` (ARCHITECTURE.md · M4).

    Attributes:
        session_id: la clase abierta, para enlazar el panel a ella.
        message: el resultado de la primera toma, o por qué falló, listo para imprimir.
    """

    session_id: str
    message: str


def start_meet_session(
    conn: sqlite3.Connection,
    fetch_participants: FetchParticipants,
    meeting: str,
    who: Who,
    t: float,
    tz: tzinfo | None,
) -> MeetStart:
    """Abre una clase automática para la reunión y toma la asistencia una vez.

    Si la toma falla, la clase queda abierta y el texto lo explica, para reintentar desde el panel.

    Args:
        conn: conexión abierta a la base de datos.
        fetch_participants: da los participantes de una reunión (en la app, `GoogleMeet.participants`).
        meeting: el enlace o el código de la reunión de Meet.
        who: quién cuenta en la primera toma (`--meet-todos` → todos los que han estado).
        t: instante de apertura y de la toma, en segundos Unix.
        tz: zona horaria del título y de la hora de la reunión; None usa la del sistema.

    Returns:
        La clase abierta y el texto del resultado.

    Raises:
        MeetingLinkInvalidError: el enlace no es de Meet; no se crea ninguna clase (spec 004 · CA-14).
    """
    session = sessions.create_session(conn, "", t, tz, Mode.AUTOMATIC, meeting)
    try:
        result = attendance.sync_from_meeting(conn, fetch_participants, session.id, who, t)
    except AppError as exc:
        return MeetStart(
            session.id, f"No se pudo tomar la asistencia: {exc.MESSAGE} Puedes reintentarlo desde el panel."
        )
    return MeetStart(session.id, sync_message(result, who, tz))


def sync_message(result: SyncResult, who: Who, tz: tzinfo | None) -> str:
    """El resultado de una toma, con la reunión de la que es (spec 004 · plan §4; CA-10, CA-20)."""
    parts = [_meeting_label(result.meeting_started_at, tz)] if result.meeting_started_at else []
    if result.found == 0:
        parts.append("No hay participantes en la reunión")
    else:
        added = "Añadida 1 persona nueva" if result.added == 1 else f"Añadidas {result.added} personas nuevas"
        seen = "en la llamada ahora" if who is Who.NOW else "estuvieron en la reunión"
        parts += [added, f"{result.found} {seen}"]
    return " · ".join(parts)


def _meeting_label(started_at: str, tz: tzinfo | None) -> str:
    # Google da la hora en UTC con fracciones de hasta nueve cifras: basta hasta los segundos (plan §2.11).
    started = datetime.strptime(started_at[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=UTC).astimezone(tz)
    return f"Reunión del {started:%d/%m} a las {started:%H:%M}"
