"""SQLite: conexión, schema e implementación del repositorio."""

from asistencia.infra.sqlite.attendance_repository import SqliteAttendanceRepository
from asistencia.infra.sqlite.connection import connect, init_schema

__all__ = ["SqliteAttendanceRepository", "connect", "init_schema"]
