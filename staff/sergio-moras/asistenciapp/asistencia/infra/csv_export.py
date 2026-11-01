"""Exportación de la lista de asistencia a CSV para Excel o Google Sheets.

Se llama csv_export.py y no csv.py para no tapar el módulo `csv` estándar.

Usage::

  >>> text = to_csv(sqlite_store.list_checkins(conn, session_id))
"""

import csv
import io
from datetime import datetime, tzinfo
from typing import Iterable

BOM = "﻿"
FORMULA_PREFIXES = ("=", "+", "-", "@")


def _safe(name: str) -> str:
    # Evita que Excel interprete el nombre como una fórmula.
    return "'" + name if name.startswith(FORMULA_PREFIXES) else name


def _local_time(iso: str, tz) -> str:
    return datetime.fromisoformat(iso).astimezone(tz).strftime("%d/%m/%Y %H:%M:%S")


def to_csv(rows: Iterable[dict], tz: tzinfo | None = None) -> str:
    """Convierte los registros en un CSV con columnas Nombre y Hora.

    Usa «;» como separador y empieza con BOM para que Excel en español muestre
    bien las tildes. Los nombres que parecen fórmulas se protegen con «'».

    :param rows: registros con ``name`` y ``checked_at`` (ISO UTC).
    :param tz: zona horaria de la columna Hora; ``None`` usa la del servidor.
    :return: el CSV completo, ordenado por hora.
    :rtype: str

    Usage::

      >>> to_csv([{"name": "Ana", "checked_at": "2026-11-01T10:00:00+00:00"}])
    """
    out = io.StringIO()
    writer = csv.writer(out, delimiter=";", lineterminator="\r\n")
    writer.writerow(["Nombre", "Hora"])
    for row in sorted(rows, key=lambda r: r["checked_at"]):
        writer.writerow([_safe(row["name"]), _local_time(row["checked_at"], tz)])
    return BOM + out.getvalue()
