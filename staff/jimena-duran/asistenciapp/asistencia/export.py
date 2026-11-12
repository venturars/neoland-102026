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
    """Exporta los asistentes por nombre y añade su total.

    :param rows: registros con `name` y `checked_at` (ISO UTC).
    :param tz: zona horaria; None usa la hora local del servidor.
    :return: CSV con encabezado, asistentes ordenados y total final.
    :rtype: str

    Usage::

        text = to_csv(rows)
    """
    ordered_rows = sorted(rows, key=lambda row: row["name"].casefold())
    out = io.StringIO()
    writer = csv.writer(out, delimiter=";", lineterminator="\r\n")
    writer.writerow(["Nombre", "Hora"])
    for row in ordered_rows:
        writer.writerow([_safe(row["name"]), _local_time(row["checked_at"], tz)])
    writer.writerow(["Total de registros", len(ordered_rows)])
    return BOM + out.getvalue()
