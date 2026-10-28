from core.get_music_note import get_music_note as core_get_music_note


def get_music_note(music_note_id: int | str) -> dict:
    id_text = str(music_note_id).strip()
    if not id_text.isdecimal():
        raise RuntimeError(f"Music note id must be a whole number: {music_note_id}")

    return core_get_music_note(int(id_text))
