from core.get_user import get_user as core_get_user


def get_user(user_id: int | str) -> dict:
    id_text = str(user_id).strip()
    if not id_text.isdecimal():
        raise RuntimeError(f"User id must be a whole number: {user_id}")

    return core_get_user(int(id_text))
