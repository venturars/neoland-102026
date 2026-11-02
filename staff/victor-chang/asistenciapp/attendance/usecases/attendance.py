"""Caso de uso: tomar la asistencia de una clase automática desde su reunión (spec 004 · plan §2.2).

spec 004 CA-05 a CA-07, CA-10, CA-18 a CA-20. No sabe de Google: recibe la función que da los
participantes (en la app, `GoogleMeet.participants`), así que vale para cualquier plataforma (P1, C3).
"""

import sqlite3
from collections.abc import Callable

from attendance.domain.errors import NotAutomaticSessionError, SessionClosedError
from attendance.domain.names import name_key
from attendance.domain.participants import MeetingAttendance, SyncResult, Who, names_from_platform
from attendance.domain.sessions import Mode, to_iso
from attendance.infra import storage
from attendance.usecases.sessions import find_session

FetchParticipants = Callable[[str, Who], MeetingAttendance]


def sync_from_meeting(
    conn: sqlite3.Connection,
    fetch_participants: FetchParticipants,
    session_id: str,
    who: Who,
    t: float,
) -> SyncResult:
    """Registra en la clase a quienes están (`now`) o han estado (`everyone`) en su reunión.

    Repetirla solo añade a los nuevos, y nunca quita a nadie (CA-06, CA-07). Todos los registros de
    una toma van en una sola transacción y llevan la hora de la toma (D3, plan §2.11).

    Args:
        conn: conexión abierta a la base de datos.
        fetch_participants: da los participantes de una reunión, sin el profesor.
        session_id: la clase.
        who: quién cuenta en esta toma (CA-18).
        t: instante de la toma, en segundos Unix.

    Raises:
        SessionNotFoundError: no hay ninguna clase con ese id.
        SessionClosedError: la clase ya está cerrada.
        NotAutomaticSessionError: la clase es de código.
        Los errores de reunión que lance `fetch_participants` (p. ej. MeetingEndedError); entonces no se guarda nada.
    """
    session = find_session(conn, session_id)
    if not session.is_open:
        raise SessionClosedError
    if session.mode is not Mode.AUTOMATIC or session.meeting_code is None:
        raise NotAutomaticSessionError
    attendance = fetch_participants(session.meeting_code, who)  # antes de escribir nada
    names = names_from_platform(attendance.names)
    checked_at = to_iso(t)
    added = 0
    with conn:
        for name in names:
            if storage.add_checkin(conn, session.id, name, name_key(name), checked_at).created:
                added += 1
    return SyncResult(
        added=added,
        found=len(names),
        total=len(storage.list_checkins(conn, session.id)),
        meeting_started_at=attendance.started_at,
        meeting_ended=attendance.ended,
    )
