from core.validate_music_note import validate_music_note
from storage.delete_music_note import delete_music_note as delete_music_note_row
from storage.delete_music_note_categories import delete_music_note_categories
from storage.select_music_note import select_music_note
from storage.select_music_note_category_ids import select_music_note_category_ids


def delete_music_note(music_note_id: int) -> dict:
    validate_music_note(music_note_id=music_note_id)

    note = select_music_note(music_note_id)
    if note is None:
        raise RuntimeError(f"Music note not found: {music_note_id}")

    note["category_ids"] = select_music_note_category_ids(music_note_id)
    delete_music_note_categories(music_note_id)
    delete_music_note_row(music_note_id)
    return note
