from db.connect_db import connect_db
from storage.read_query import read_query


def delete_music_note_categories(music_note_id: int) -> None:
    query = read_query("delete_music_note_categories")

    connection = connect_db()
    connection.execute(query, {"music_note_id": music_note_id})
    connection.commit()
    connection.close()
