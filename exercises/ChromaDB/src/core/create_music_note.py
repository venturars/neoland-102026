from core.validate_music_note import validate_music_note
from storage.insert_music_note import insert_music_note
from storage.insert_music_note_category import insert_music_note_category
from storage.select_category import select_category
from storage.select_music_note import select_music_note
from storage.select_music_note_category_ids import select_music_note_category_ids
from storage.select_user import select_user


def create_music_note(
    user_creator_id: int,
    song_link: str,
    title: str,
    description: str,
    category_ids: list[int],
) -> dict:
    validate_music_note(
        user_creator_id=user_creator_id,
        song_link=song_link,
        title=title,
        description=description,
        category_ids=category_ids,
    )

    if select_user(user_creator_id) is None:
        raise RuntimeError(f"User not found: {user_creator_id}")

    for category_id in category_ids:
        if select_category(category_id) is None:
            raise RuntimeError(f"Category not found: {category_id}")

    seen_category_ids = []
    for category_id in category_ids:
        if category_id in seen_category_ids:
            raise RuntimeError(f"Category is duplicated: {category_id}")
        seen_category_ids.append(category_id)

    music_note_id = insert_music_note(user_creator_id, song_link, title, description)
    for category_id in category_ids:
        insert_music_note_category(music_note_id, category_id)

    note = select_music_note(music_note_id)
    note["category_ids"] = select_music_note_category_ids(music_note_id)
    return note
