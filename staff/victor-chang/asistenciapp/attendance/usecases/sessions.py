"""Casos de uso de las clases: abrir, cerrar, ver y exportar.

spec 001 CA-01, CA-02, CA-10 a CA-14; spec 004 CA-01 a CA-03.

Las reglas que antes decidían las rutas viven aquí (spec 005 · plan §2.3; ARCHITECTURE.md · C2).
Cada caso de uso que escribe abre su transacción con `with conn:` (D3).
"""

import secrets
import sqlite3
from datetime import tzinfo

from attendance.domain.codes import code_for, seconds_left
from attendance.domain.errors import SessionNotFoundError
from attendance.domain.meetings import parse_meeting_code
from attendance.domain.sessions import (
    ExportFile,
    Mode,
    Session,
    TeacherView,
    clean_title,
    default_title,
    local_day,
    to_iso,
)
from attendance.infra import storage
from attendance.infra.export import to_csv


def create_session(
    conn: sqlite3.Connection,
    title: str,
    t: float,
    tz: tzinfo | None,
    mode: Mode = Mode.CODE,
    meeting: str = "",
) -> Session:
    """Abre una clase nueva; sin título, se titula con su fecha local (spec 001 · CA-01, CA-02; spec 005 · CA-08).

    Args:
        conn: conexión abierta a la base de datos.
        title: título escrito por el profesor; puede estar vacío.
        t: instante de apertura, en segundos Unix.
        tz: zona horaria del título por defecto; None usa la del sistema.
        mode: cómo se pasa lista en esta clase; no se puede cambiar después (spec 004 · P3).
        meeting: en modo automático, el enlace o código de la reunión de Meet; en modo código se ignora.

    Raises:
        TitleTooLongError: el título pasa de 20 caracteres.
        MeetingLinkInvalidError: modo automático sin enlace, o con un enlace que no es de Meet (spec 004 · CA-14).
    """
    title = clean_title(title) or default_title(t, tz)
    meeting_code = parse_meeting_code(meeting) if mode is Mode.AUTOMATIC else None
    with conn:
        return storage.create_session(
            conn,
            secrets.token_urlsafe(6),
            title,
            secrets.token_bytes(16),
            to_iso(t),
            mode=mode,
            meeting_code=meeting_code,
        )


def find_session(conn: sqlite3.Connection, session_id: str) -> Session:
    """La clase con ese id.

    Raises:
        SessionNotFoundError: no hay ninguna clase con ese id.
    """
    session = storage.get_session(conn, session_id)
    if session is None:
        raise SessionNotFoundError
    return session


def close_session(conn: sqlite3.Connection, session_id: str, t: float) -> None:
    """Cierra la clase; si ya estaba cerrada, conserva su primera hora de cierre (spec 001 · CA-13).

    Raises:
        SessionNotFoundError: no hay ninguna clase con ese id.
    """
    find_session(conn, session_id)
    with conn:
        storage.close_session(conn, session_id, to_iso(t))


def teacher_view(conn: sqlite3.Connection, session_id: str, t: float) -> TeacherView:
    """Lo que ve el profesor: la clase, sus registros y el código, solo si está abierta y es de código.

    Sin código en una clase cerrada (spec 001 · CA-13) ni en una automática (spec 004 · CA-02).

    Raises:
        SessionNotFoundError: no hay ninguna clase con ese id.
    """
    session = find_session(conn, session_id)
    checkins = tuple(storage.list_checkins(conn, session_id))
    if not session.is_open or session.mode is not Mode.CODE:
        return TeacherView(session=session, checkins=checkins, code=None, seconds_left=None)
    return TeacherView(
        session=session,
        checkins=checkins,
        code=code_for(session.secret, t),
        seconds_left=seconds_left(t),
    )


def export_attendance(conn: sqlite3.Connection, session_id: str, tz: tzinfo | None) -> ExportFile:
    """La lista de la clase en CSV, con el día local de apertura en el nombre (spec 001 · CA-14; plan 004 §2.12).

    Raises:
        SessionNotFoundError: no hay ninguna clase con ese id.
    """
    session = find_session(conn, session_id)
    day = local_day(session.opened_at, tz)
    return ExportFile(
        filename=f"asistencia-{day}-{session_id}.csv",
        content=to_csv(storage.list_checkins(conn, session_id), tz),
    )
