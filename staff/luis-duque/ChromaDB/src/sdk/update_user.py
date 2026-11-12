from core.update_user import update_user as core_update_user


def update_user(user_id: int | str, name: str, email: str, age: int | str, gender: str) -> dict:
    id_text = str(user_id).strip()
    if not id_text.isdecimal():
        raise RuntimeError(f"User id must be a whole number: {user_id}")
    # El cliente puede mandar la edad como texto: "34"
    age_text = str(age).strip()
    if not age_text.isdecimal():
        raise RuntimeError(f"Age must be a whole number: {age}")

    clean_id = int(id_text)
    clean_name = name.strip()
    clean_email = email.strip().lower()
    clean_age = int(age_text)
    clean_gender = gender.strip().lower()

    return core_update_user(clean_id, clean_name, clean_email, clean_age, clean_gender)
