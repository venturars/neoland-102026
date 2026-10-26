"""Umbrales de intentos inválidos (spec 006)."""

MAX_INVALID_PER_SECOND = 5
MAX_INVALID_PER_MINUTE = 20
ATTEMPT_RETENTION_SECONDS = 60


def should_block_after_attempt(count_last_second: int, count_last_minute: int) -> bool:
    """True tras registrar un intento si se supera 5 en 1 s o 20 en 60 s."""
    return count_last_second > MAX_INVALID_PER_SECOND or count_last_minute > MAX_INVALID_PER_MINUTE
