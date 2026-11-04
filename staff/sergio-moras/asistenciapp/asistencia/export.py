"""Exportación de la lista de asistencia a CSV (plan §2.6, CA-14).

Se llama export.py y no csv.py para no tapar el módulo `csv` estándar.
"""

import csv
import io
from datetime import datetime

BOM = "﻿"
FORMULA_PREFIXES = ("=", "+", "-", "@")


def _safe(name: str) -> str:
    # Evita que Excel interprete el nombre como una fórmula.
    return "'" + name if name.startswith(FORMULA_PREFIXES) else name


def _local_time(iso: str, tz) -> str:
    return datetime.fromisoformat(iso).astimezone(tz).strftime("%d/%m/%Y %H:%M:%S")


def to_csv(rows, tz=None) -> str:
    """rows: dicts con `name` y `checked_at` (ISO UTC). tz=None → hora local del servidor."""
    out = io.StringIO()
    writer = csv.writer(out, delimiter=";", lineterminator="\r\n")
    writer.writerow(["Nombre", "Hora"])
    for row in sorted(rows, key=lambda r: r["checked_at"]):
        writer.writerow([_safe(row["name"]), _local_time(row["checked_at"], tz)])
    return BOM + out.getvalue()
