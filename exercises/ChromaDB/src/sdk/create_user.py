from core.create_user import create_user as core_create_user


def create_user(name: str, email: str, age: int | str, gender: str) -> dict:
    # El cliente puede mandar la edad como texto: "34"
    age_text = str(age).strip()
    if not age_text.isdecimal():
        raise RuntimeError(f"Age must be a whole number: {age}")

    clean_name = name.strip()
    clean_email = email.strip().lower()
    clean_age = int(age_text)
    clean_gender = gender.strip().lower()

    return core_create_user(clean_name, clean_email, clean_age, clean_gender)
