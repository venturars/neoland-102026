"""Preparación y lectura del catálogo dentro de la transacción de carrera."""
import csv
import sqlite3
from ..domain.race import RaceError
from ..domain.roster import validate_roster
from ..storage import roster as storage

CATALOG_EMPTY = 'No hay alumnos disponibles para preparar la carrera. Revisa el catálogo guardado.'
CATALOG_UNAVAILABLE = 'No se pudo cargar el catálogo de alumnos. Revisa los datos guardados antes de preparar otra carrera.'


def prepare_catalog(connection: sqlite3.Connection) -> list[dict]:
    """Prepara una vez o lee el catálogo, sin repararlo ni confirmar cambios.

    :param connection: conexión de la transacción de escritura del llamante.
    :return: referencias key/name/character en su orden guardado.
    :rtype: list[dict]

    Usage::

        prepare_catalog(connection)
    """
    try:
        version = storage.read_state(connection)
        exists = storage.table_exists(connection)
        first_preparation = version is None and not exists
        if first_preparation:
            students = storage.read_initial_students()
        elif version == '1' and exists:
            students = storage.list_students(connection)
        else:
            raise ValueError('Estado del catálogo incoherente.')
        if not students:
            raise RaceError('catalog_empty', CATALOG_EMPTY)
        validate_roster(students, storage.available_characters())
        if first_preparation:
            storage.create_catalog(connection)
            storage.insert_students(connection, students)
            storage.mark_prepared(connection)
    except (OSError, UnicodeError, csv.Error, ValueError, sqlite3.Error):
        raise RaceError('catalog_unavailable', CATALOG_UNAVAILABLE) from None
    students = sorted(students, key=lambda row: row['display_order'])
    return [{'key': row['key'], 'name': row['name'], 'character': row['character']} for row in students]
