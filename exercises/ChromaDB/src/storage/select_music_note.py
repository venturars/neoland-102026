from db.connect_db import connect_db
from storage.read_query import read_query


def select_music_note(music_note_id: int) -> dict | None:
    query = read_query("select_music_note")

    connection = connect_db()
    row = connection.execute(query, {"id": music_note_id}).fetchone()
    connection.close()

    if row is None:
        return None
    return dict(row)
