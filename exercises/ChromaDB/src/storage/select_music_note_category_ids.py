from db.connect_db import connect_db
from storage.read_query import read_query


def select_music_note_category_ids(music_note_id: int) -> list[int]:
    query = read_query("select_music_note_category_ids")

    connection = connect_db()
    rows = connection.execute(query, {"music_note_id": music_note_id}).fetchall()
    connection.close()

    category_ids = []
    for row in rows:
        category_ids.append(row["category_id"])
    return category_ids
