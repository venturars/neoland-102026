"""Casos de uso anti-abuso por IP (spec 006)."""

from collections.abc import Callable
from datetime import datetime, timezone

from asistencia.domain.errors import IpBlocked
from asistencia.domain.rate_limit import (
    ATTEMPT_RETENTION_SECONDS,
    should_block_after_attempt,
)
from asistencia.ports.rate_limit_repository import RateLimitRepository


def assert_not_blocked(repo: RateLimitRepository, ip: str) -> None:
    if repo.is_blocked(ip):
        raise IpBlocked()


def after_invalid_code(
    repo: RateLimitRepository,
    ip: str,
    now: Callable[[], float],
    now_iso: Callable[[], str],
) -> dict:
    ts = now()
    cutoff = datetime.fromtimestamp(
        ts - ATTEMPT_RETENTION_SECONDS, timezone.utc
    ).isoformat(timespec="milliseconds")
    repo.purge_attempts_older_than(cutoff)
    repo.record_invalid_attempt(ip, now_iso())
    since_second = datetime.fromtimestamp(ts - 1, timezone.utc).isoformat(
        timespec="milliseconds"
    )
    since_minute = cutoff
    count_second = repo.count_invalid_attempts(ip, since_second)
    count_minute = repo.count_invalid_attempts(ip, since_minute)
    if should_block_after_attempt(count_second, count_minute):
        repo.block_ip(ip, now_iso())
        return {"blocked": True}
    return {"blocked": False}


def list_blocked_ips(repo: RateLimitRepository) -> list[dict]:
    return [
        {"ip": row["ip"], "blockedAt": row["blocked_at"]} for row in repo.list_blocked()
    ]


def unblock_ip(repo: RateLimitRepository, ip: str) -> bool:
    return repo.unblock_ip(ip)


def unblock_all_ips(repo: RateLimitRepository) -> int:
    return repo.unblock_all()
