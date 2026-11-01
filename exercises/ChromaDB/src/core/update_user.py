from core.validate_user import validate_user
from storage.select_user import select_user
from storage.select_user_by_email import select_user_by_email
from storage.update_user import update_user as update_user_row


def update_user(
    user_id: int, name: str, email: str, age: int, gender: str
) -> dict:
    validate_user(name, email, age, gender)

    if select_user(user_id) is None:
        raise RuntimeError(f"User not found: {user_id}")
    # El email puede ser el suyo, pero no el de otro usuario
    owner = select_user_by_email(email)
    if owner is not None and owner["id"] != user_id:
        raise RuntimeError(f"Email already exists: {email}")

    update_user_row(user_id, name, email, age, gender)

    return select_user(user_id)
