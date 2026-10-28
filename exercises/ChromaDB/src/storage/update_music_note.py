from db.connect_db import connect_db
from storage.read_query import read_query


def update_music_note(music_note_id: int, song_link: str, title: str, description: str) -> None:
    query = read_query("update_music_note")

    connection = connect_db()
    connection.execute(
        query,
        {
            "id": music_note_id,
            "song_link": song_link,
            "title": title,
            "description": description,
        },
    )
    connection.commit()
    connection.close()
