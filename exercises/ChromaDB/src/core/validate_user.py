from core.settings import GENDERS, MAX_AGE, MAX_NAME_LENGTH, MIN_AGE


def validate_user(name: str, email: str, age: int, gender: str) -> None:
    if name == "":
        raise RuntimeError("Name is required")
    if len(name) > MAX_NAME_LENGTH:
        raise RuntimeError(
            f"Name must have at most {MAX_NAME_LENGTH} characters"
        )

    if "@" not in email:
        raise RuntimeError(f"Email is not valid: {email}")
    # Después de la @ tiene que haber un dominio con punto: ana@mail.com
    domain = email.split("@")[-1]
    if "." not in domain:
        raise RuntimeError(f"Email is not valid: {email}")

    # bool es un int en Python: True pasaría como edad 1
    if type(age) is not int:
        raise RuntimeError("Age must be a whole number")
    if age < MIN_AGE or age > MAX_AGE:
        raise RuntimeError(f"Age must be between {MIN_AGE} and {MAX_AGE}")

    if gender not in GENDERS:
        raise RuntimeError(f"Gender must be one of: {', '.join(GENDERS)}")
