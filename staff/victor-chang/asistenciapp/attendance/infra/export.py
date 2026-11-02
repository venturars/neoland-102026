"""Exportación de la lista de asistencia a CSV (spec 001 · plan §2.6, CA-14).

Se llama export.py y no csv.py para no tapar el módulo `csv` estándar.
"""

import csv
import io
from collections.abc import Iterable
from datetime import datetime, tzinfo

from attendance.domain.sessions import Checkin

BOM = "﻿"
FORMULA_PREFIXES = ("=", "+", "-", "@")


def _safe(name: str) -> str:
    # Evita que Excel interprete el nombre como una fórmula.
    return "'" + name if name.startswith(FORMULA_PREFIXES) else name


def _local_time(iso: str, tz: tzinfo | None) -> str:
    return datetime.fromisoformat(iso).astimezone(tz).strftime("%d/%m/%Y %H:%M:%S")


def to_csv(checkins: Iterable[Checkin], tz: tzinfo | None = None) -> str:
    """CSV para Excel con nombre y hora local de cada registro. tz=None → hora local del servidor."""
    out = io.StringIO()
    writer = csv.writer(out, delimiter=";", lineterminator="\r\n")
    writer.writerow(["Nombre", "Hora"])
    for checkin in sorted(checkins, key=lambda c: c.checked_at):
        writer.writerow([_safe(checkin.name), _local_time(checkin.checked_at, tz)])
    return BOM + out.getvalue()
