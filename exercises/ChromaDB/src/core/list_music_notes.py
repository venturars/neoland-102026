from storage.select_music_note_category_ids import select_music_note_category_ids
from storage.select_music_notes import select_music_notes


def list_music_notes() -> list[dict]:
    notes = select_music_notes()
    for note in notes:
        note["category_ids"] = select_music_note_category_ids(note["id"])
    return notes
