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


def to_group_csv(group_name: str, opened_at: str, roster: list[dict], checkins: list[dict], tz=None) -> str:
    """Descarga de una sesión con grupo: una sola tabla con «Estado» (spec 007, RF-21, CA-07).

    Una fila por alumno de la copia de la lista (presente o ausente) y otra por
    cada nuevo. La «Hora» es la del registro de presentes y nuevos; los ausentes
    no tienen hora. Mismo formato que :func:`to_csv`: ``;``, UTF-8 con BOM y sin
    fórmulas (CA-18).

    :param group_name: nombre del grupo, tal como estaba al abrir la sesión.
    :param opened_at: hora de apertura de la sesión, en ISO 8601 UTC.
    :param roster: copia de la lista, con ``name``.
    :param checkins: registros, con ``name``, ``kind`` y ``checked_at``.
    :param tz: zona horaria; ``None`` usa la hora local del servidor.
    :return: el CSV.
    :rtype: str

    Usage::

        >>> to_group_csv("SDD", "2026-10-27T10:00:00+00:00", [], []).splitlines()[0]
        '\ufeffGrupo;Fecha;Nombre;Estado;Hora'
    """
    out = io.StringIO()
    writer = csv.writer(out, delimiter=";", lineterminator="\r\n")
    writer.writerow(["Grupo", "Fecha", "Nombre", "Estado", "Hora"])
    group = _safe(group_name)
    day = datetime.fromisoformat(opened_at).astimezone(tz).strftime("%d/%m/%Y %H:%M")
    present = {c["name"]: c for c in checkins if c["kind"] == "listed"}
    for entry in roster:
        c = present.get(entry["name"])
        state, hour = ("presente", _local_time(c["checked_at"], tz)) if c else ("ausente", "")
        writer.writerow([group, day, _safe(entry["name"]), state, hour])
    for c in sorted((c for c in checkins if c["kind"] == "new"), key=lambda c: c["checked_at"]):
        writer.writerow([group, day, _safe(c["name"]), "nuevo", _local_time(c["checked_at"], tz)])
    return BOM + out.getvalue()
