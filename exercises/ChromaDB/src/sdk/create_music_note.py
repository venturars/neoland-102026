from core.create_music_note import create_music_note as core_create_music_note


def create_music_note(
    user_creator_id: int | str,
    song_link: str,
    title: str,
    description: str,
    category_ids: list[int | str],
) -> dict:
    if type(category_ids) is not list:
        raise RuntimeError("Categories must be a list")

    user_id_text = str(user_creator_id).strip()
    if not user_id_text.isdecimal():
        raise RuntimeError(f"User id must be a whole number: {user_creator_id}")

    clean_song_link = song_link.strip()
    clean_title = title.strip()
    clean_description = description.strip()

    clean_category_ids = []
    for category_id in category_ids:
        category_text = str(category_id).strip()
        if not category_text.isdecimal():
            raise RuntimeError(f"Category id must be a whole number: {category_id}")
        clean_category_ids.append(int(category_text))

    clean_user_id = int(user_id_text)
    return core_create_music_note(
        clean_user_id,
        clean_song_link,
        clean_title,
        clean_description,
        clean_category_ids,
    )
