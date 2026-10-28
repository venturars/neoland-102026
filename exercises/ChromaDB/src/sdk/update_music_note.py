from core.update_music_note import update_music_note as core_update_music_note


def update_music_note(
    music_note_id: int | str,
    song_link: str,
    title: str,
    description: str,
    category_ids: list[int | str],
) -> dict:
    if type(category_ids) is not list:
        raise RuntimeError("Categories must be a list")

    id_text = str(music_note_id).strip()
    if not id_text.isdecimal():
        raise RuntimeError(f"Music note id must be a whole number: {music_note_id}")

    clean_song_link = song_link.strip()
    clean_title = title.strip()
    clean_description = description.strip()

    clean_category_ids = []
    for category_id in category_ids:
        category_text = str(category_id).strip()
        if not category_text.isdecimal():
            raise RuntimeError(f"Category id must be a whole number: {category_id}")
        clean_category_ids.append(int(category_text))

    clean_music_note_id = int(id_text)
    return core_update_music_note(
        clean_music_note_id,
        clean_song_link,
        clean_title,
        clean_description,
        clean_category_ids,
    )
