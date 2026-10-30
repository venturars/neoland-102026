from core.validate_user import validate_user
from storage.insert_user import insert_user
from storage.select_user import select_user
from storage.select_user_by_email import select_user_by_email


def create_user(name: str, email: str, age: int, gender: str) -> dict:
    validate_user(name, email, age, gender)

    if select_user_by_email(email) is not None:
        raise RuntimeError(f"Email already exists: {email}")

    user_id = insert_user(name, email, age, gender)

    return select_user(user_id)
