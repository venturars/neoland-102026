from core.validate_music_note import validate_music_note
from storage.delete_music_note_categories import delete_music_note_categories
from storage.insert_music_note_category import insert_music_note_category
from storage.select_category import select_category
from storage.select_music_note import select_music_note
from storage.select_music_note_category_ids import select_music_note_category_ids
from storage.update_music_note import update_music_note as update_music_note_row


def update_music_note(
    music_note_id: int,
    song_link: str,
    title: str,
    description: str,
    category_ids: list[int],
) -> dict:
    validate_music_note(
        music_note_id=music_note_id,
        song_link=song_link,
        title=title,
        description=description,
        category_ids=category_ids,
    )

    if select_music_note(music_note_id) is None:
        raise RuntimeError(f"Music note not found: {music_note_id}")

    for category_id in category_ids:
        if select_category(category_id) is None:
            raise RuntimeError(f"Category not found: {category_id}")

    seen_category_ids = []
    for category_id in category_ids:
        if category_id in seen_category_ids:
            raise RuntimeError(f"Category is duplicated: {category_id}")
        seen_category_ids.append(category_id)

    delete_music_note_categories(music_note_id)
    update_music_note_row(music_note_id, song_link, title, description)
    for category_id in category_ids:
        insert_music_note_category(music_note_id, category_id)

    note = select_music_note(music_note_id)
    note["category_ids"] = select_music_note_category_ids(music_note_id)
    return note
