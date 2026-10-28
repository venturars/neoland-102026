from core.validate_music_note import validate_music_note
from storage.select_music_note import select_music_note
from storage.select_music_note_category_ids import select_music_note_category_ids


def get_music_note(music_note_id: int) -> dict:
    validate_music_note(music_note_id=music_note_id)

    note = select_music_note(music_note_id)
    if note is None:
        raise RuntimeError(f"Music note not found: {music_note_id}")

    note["category_ids"] = select_music_note_category_ids(music_note_id)
    return note
