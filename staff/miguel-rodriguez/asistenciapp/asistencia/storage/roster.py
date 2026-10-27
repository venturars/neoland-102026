"""Consultas y archivo inicial del catálogo local, sin confirmar transacciones."""
import csv
from pathlib import Path
import sqlite3

STORAGE_DIR = Path(__file__).parent
QUERY_DIR = STORAGE_DIR / 'queries/roster'
INITIAL_STUDENTS = STORAGE_DIR / 'data/initial-students.csv'
CHARACTERS_DIR = STORAGE_DIR.parents[1] / 'static/race-characters'


def read_state(connection: sqlite3.Connection) -> str | None:
    """Lee el indicador de preparación, sin confundir ausencia y fallo.

    :param connection: conexión abierta por el caso de uso.
    :return: versión guardada o None si nunca se guardó.
    :rtype: str | None

    Usage::

        read_state(connection)
    """
    query = (QUERY_DIR / 'read-state.sql').read_text(encoding='utf-8')
    row = connection.execute(query).fetchone()
    return row[0] if row is not None else None


def table_exists(connection: sqlite3.Connection) -> bool:
    """Consulta si existe la tabla concreta del alumnado.

    :param connection: conexión abierta por el caso de uso.
    :return: si la tabla students existe.
    :rtype: bool

    Usage::

        table_exists(connection)
    """
    query = (QUERY_DIR / 'table-exists.sql').read_text(encoding='utf-8')
    return connection.execute(query).fetchone() is not None


def create_catalog(connection: sqlite3.Connection) -> None:
    """Crea la tabla dentro de la transacción pendiente.

    :param connection: conexión con transacción de escritura activa.
    :return: None, sin confirmar cambios.
    :rtype: None

    Usage::

        create_catalog(connection)
    """
    query = (QUERY_DIR / 'create-students.sql').read_text(encoding='utf-8')
    connection.execute(query)


def insert_students(connection: sqlite3.Connection, students: list[dict]) -> None:
    """Inserta datos validados sin reemplazar filas ni ignorar conflictos.

    :param connection: conexión con transacción de escritura activa.
    :param students: registros iniciales con clave, nombre, personaje y orden.
    :return: None, sin confirmar cambios.
    :rtype: None

    Usage::

        insert_students(connection, students)
    """
    query = (QUERY_DIR / 'insert-student.sql').read_text(encoding='utf-8')
    values = [(row['key'], row['name'], row['character'], row['display_order']) for row in students]
    connection.executemany(query, values)


def mark_prepared(connection: sqlite3.Connection) -> None:
    """Registra preparación completa en la transacción de los alumnos.

    :param connection: conexión con transacción de escritura activa.
    :return: None, sin sustituir otra configuración.
    :rtype: None

    Usage::

        mark_prepared(connection)
    """
    query = (QUERY_DIR / 'mark-prepared.sql').read_text(encoding='utf-8')
    connection.execute(query)


def list_students(connection: sqlite3.Connection) -> list[dict]:
    """Recupera registros ordenados conservando el orden para validarlo.

    :param connection: conexión abierta por el caso de uso.
    :return: registros de alumnos, sin inventar filas ausentes.
    :rtype: list[dict]

    Usage::

        list_students(connection)
    """
    query = (QUERY_DIR / 'list-students.sql').read_text(encoding='utf-8')
    return [dict(row) for row in connection.execute(query)]


def read_initial_students() -> list[dict]:
    """Lee únicamente el archivo inicial y comprueba su estructura.

    :return: quince registros iniciales con orden entero, aún por validar.
    :rtype: list[dict]

    Usage::

        read_initial_students()
    """
    with INITIAL_STUDENTS.open(encoding='utf-8', newline='') as source:
        reader = csv.DictReader(source)
        if reader.fieldnames != ['display_order', 'key', 'name', 'character']:
            raise ValueError('Columnas del catálogo inicial inválidas.')
        students = list(reader)
    if len(students) != 15:
        raise ValueError('El catálogo inicial debe contener quince alumnos.')
    for row in students:
        if None in row or any(value is None for value in row.values()):
            raise ValueError('Fila incompleta del catálogo inicial.')
        row['display_order'] = int(row['display_order'])
    return students


def available_characters() -> set[str]:
    """Lee referencias de SVG desde el directorio fijo de la aplicación.

    :return: slugs de los archivos locales de personajes.
    :rtype: set[str]

    Usage::

        available_characters()
    """
    return {path.stem for path in CHARACTERS_DIR.iterdir() if path.is_file() and path.suffix == '.svg'}
