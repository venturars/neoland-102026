"""Tests de asistencia/export.py · CA-14."""

from datetime import timezone

import pytest

from asistencia.infra.export import to_csv


def rows(*pairs, arrival="A tiempo"):
    return [{"name": name, "checked_at": at, "arrival": arrival} for name, at in pairs]


def lines(csv_text):
    return csv_text.lstrip("﻿").splitlines()


def test_starts_with_bom():
    assert to_csv([], tz=timezone.utc).startswith("﻿")


def test_header_uses_semicolon():
    assert lines(to_csv([], tz=timezone.utc)) == ["Nombre;Hora;Estado"]


def test_rows_are_sorted_by_time_and_formatted():
    text = to_csv(
        rows(
            ("Luis", "2026-10-20T15:05:00+00:00"),
            ("Ana García", "2026-10-20T15:01:30+00:00"),
        ),
        tz=timezone.utc,
    )
    assert lines(text)[1:] == [
        "Ana García;20/10/2026 15:01:30;A tiempo",
        "Luis;20/10/2026 15:05:00;A tiempo",
    ]


def test_names_with_separator_or_quotes_are_quoted():
    text = to_csv(rows(('Ana; "la jefa"', "2026-10-20T15:00:00+00:00")), tz=timezone.utc)
    assert lines(text)[1] == '"Ana; ""la jefa""";20/10/2026 15:00:00;A tiempo'


@pytest.mark.parametrize("dangerous", ["=SUMA(A1)", "+34", "-1", "@cmd"])
def test_formula_like_names_are_neutralised(dangerous):
    text = to_csv(
        rows((dangerous, "2026-10-20T15:00:00+00:00"), arrival="Llegada tardía"),
        tz=timezone.utc,
    )
    assert lines(text)[1].startswith("'" + dangerous)
    assert lines(text)[1].endswith(";Llegada tardía")
