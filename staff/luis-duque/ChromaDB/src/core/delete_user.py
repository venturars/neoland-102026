from storage.delete_user import delete_user as delete_user_row
from storage.select_user import select_user


def delete_user(user_id: int) -> dict:
    user = select_user(user_id)
    if user is None:
        raise RuntimeError(f"User not found: {user_id}")

    delete_user_row(user_id)

    return user
