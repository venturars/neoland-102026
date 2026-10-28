from db.connect_db import connect_db
from storage.read_query import read_query


def insert_music_note(user_creator_id: int, song_link: str, title: str, description: str) -> int:
    query = read_query("insert_music_note")

    connection = connect_db()
    cursor = connection.execute(
        query,
        {
            "song_link": song_link,
            "user_creator_id": user_creator_id,
            "title": title,
            "description": description,
        },
    )
    connection.commit()
    connection.close()

    return cursor.lastrowid
