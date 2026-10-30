from storage.select_user import select_user


def get_user(user_id: int) -> dict:
    user = select_user(user_id)
    if user is None:
        raise RuntimeError(f"User not found: {user_id}")

    return user
