from storage.select_users import select_users


def list_users() -> list[dict]:
    return select_users()
