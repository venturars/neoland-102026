from db.connect_db import connect_db
from storage.read_query import read_query


def select_music_notes() -> list[dict]:
    query = read_query("select_music_notes")

    connection = connect_db()
    rows = connection.execute(query).fetchall()
    connection.close()

    notes = []
    for row in rows:
        notes.append(dict(row))
    return notes
