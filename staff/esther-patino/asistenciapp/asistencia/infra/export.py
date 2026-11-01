"""Exportación de la lista de asistencia a CSV.

Se llama export.py y no csv.py para no tapar el módulo csv de la biblioteca estándar.
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
    """Convierte los registros en un CSV con punto y coma.

    :param rows: diccionarios con name, checked_at en ISO UTC y arrival.
    :param tz: zona horaria. None usa la hora local del servidor.
    :return: el CSV, con la marca de orden de bytes al inicio.
    """
    out = io.StringIO()
    writer = csv.writer(out, delimiter=";", lineterminator="\r\n")
    writer.writerow(["Nombre", "Hora", "Estado"])
    for row in sorted(rows, key=lambda r: r["checked_at"]):
        writer.writerow([_safe(row["name"]), _local_time(row["checked_at"], tz), row["arrival"]])
    return BOM + out.getvalue()
