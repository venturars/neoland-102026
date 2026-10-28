from db.connect_db import connect_db
from storage.read_query import read_query


def delete_music_note(music_note_id: int) -> None:
    query = read_query("delete_music_note")

    connection = connect_db()
    connection.execute(query, {"id": music_note_id})
    connection.commit()
    connection.close()
