import sqlite3

from db.settings import DB_PATH, SCHEMA_PATH


def connect_db() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    # Con Row cada fila se lee por nombre de columna: row["email"]
    connection.row_factory = sqlite3.Row
    # SQLite no comprueba las claves ajenas si no se activan en cada conexión
    connection.execute("PRAGMA foreign_keys = ON")

    # La primera vez crea las tablas; las siguientes no hace nada (IF NOT EXISTS)
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    connection.executescript(schema)

    return connection
