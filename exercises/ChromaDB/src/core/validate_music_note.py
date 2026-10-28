# Este objeto solo distingue "no viene en esta operación" de un valor real.
# None no sirve: también es inválido y hay que rechazarlo.
_SKIP = object()


def validate_music_note(
    user_creator_id: object = _SKIP,
    music_note_id: object = _SKIP,
    song_link: object = _SKIP,
    title: object = _SKIP,
    description: object = _SKIP,
    category_ids: object = _SKIP,
) -> None:
    if user_creator_id is not _SKIP:
        if type(user_creator_id) is not int:
            raise RuntimeError("User id must be a whole number")

    if music_note_id is not _SKIP:
        if type(music_note_id) is not int:
            raise RuntimeError("Music note id must be a whole number")

    if song_link is not _SKIP:
        if type(song_link) is not str:
            raise RuntimeError("Song link must be text")

    if title is not _SKIP:
        if type(title) is not str:
            raise RuntimeError("Title must be text")

    if description is not _SKIP:
        if type(description) is not str:
            raise RuntimeError("Description must be text")

    if category_ids is not _SKIP:
        if type(category_ids) is not list:
            raise RuntimeError("Categories must be a list")
        for category_id in category_ids:
            if type(category_id) is not int:
                raise RuntimeError("Category id must be a whole number")
