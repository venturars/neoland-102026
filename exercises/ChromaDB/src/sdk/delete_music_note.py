from core.delete_music_note import delete_music_note as core_delete_music_note


def delete_music_note(music_note_id: int | str) -> dict:
    id_text = str(music_note_id).strip()
    if not id_text.isdecimal():
        raise RuntimeError(f"Music note id must be a whole number: {music_note_id}")

    return core_delete_music_note(int(id_text))
