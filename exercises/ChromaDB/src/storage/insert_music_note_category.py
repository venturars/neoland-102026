from db.connect_db import connect_db
from storage.read_query import read_query


def insert_music_note_category(music_note_id: int, category_id: int) -> None:
    query = read_query("insert_music_note_category")

    connection = connect_db()
    connection.execute(
        query,
        {"music_note_id": music_note_id, "category_id": category_id},
    )
    connection.commit()
    connection.close()
