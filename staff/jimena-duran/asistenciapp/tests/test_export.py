"""Tests de asistencia/export.py · CA-14 y spec 007 (CA-01 a CA-03)."""

from datetime import timedelta, timezone

import pytest

from asistencia.export import to_csv


def rows(*pairs):
    return [{"name": name, "checked_at": at} for name, at in pairs]


def lines(csv_text):
    return csv_text.lstrip("﻿").splitlines()


def test_starts_with_bom():
    assert to_csv([], tz=timezone.utc).startswith("﻿")


def test_empty_export_keeps_header_and_zero_total():
    assert to_csv([], tz=timezone.utc) == "\ufeffNombre;Hora\r\nTotal de registros;0\r\n"


def test_rows_are_sorted_by_name_ignoring_case_and_formatted():
    text = to_csv(
        rows(
            ("zoe", "2026-10-20T15:00:00+00:00"),
            ("Luis", "2026-10-20T15:01:30+00:00"),
            ("ana García", "2026-10-20T15:05:00+00:00"),
        ),
        tz=timezone.utc,
    )
    assert lines(text)[1:] == [
        "ana García;20/10/2026 15:05:00",
        "Luis;20/10/2026 15:01:30",
        "zoe;20/10/2026 15:00:00",
        "Total de registros;3",
    ]


def test_local_time_conversion_is_preserved():
    text = to_csv(
        rows(("Ana", "2026-10-20T01:00:00+00:00")),
        tz=timezone(timedelta(hours=-6)),
    )
    assert lines(text)[1:] == ["Ana;19/10/2026 19:00:00", "Total de registros;1"]


def test_names_with_separator_or_quotes_are_quoted():
    text = to_csv(rows(('Ana; "la jefa"', "2026-10-20T15:00:00+00:00")), tz=timezone.utc)
    assert lines(text)[1] == '"Ana; ""la jefa""";20/10/2026 15:00:00'
    assert lines(text)[-1] == "Total de registros;1"


@pytest.mark.parametrize("dangerous", ["=SUMA(A1)", "+34", "-1", "@cmd"])
def test_formula_like_names_are_neutralised(dangerous):
    text = to_csv(rows((dangerous, "2026-10-20T15:00:00+00:00")), tz=timezone.utc)
    assert lines(text)[1].startswith("'" + dangerous)
    assert lines(text)[-1] == "Total de registros;1"
