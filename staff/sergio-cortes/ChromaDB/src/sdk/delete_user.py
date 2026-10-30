from core.delete_user import delete_user as core_delete_user


def delete_user(user_id: int | str) -> dict:
    id_text = str(user_id).strip()
    if not id_text.isdecimal():
        raise RuntimeError(f"User id must be a whole number: {user_id}")

    return core_delete_user(int(id_text))
