"""Tests de asistencia/domain/roster.py · spec 007 · CA-01, CA-02, CA-18, CA-20."""

import pytest

from asistencia.domain import roster
from asistencia.domain.roster import (
    MAX_STUDENTS,
    GroupFull,
    can_save,
    ensure_room,
    parse_csv,
    parse_pasted,
    review,
)

NAMES_25 = [f"Alumno {i:02d}" for i in range(1, 26)]


# ---------- leer la lista (RF-1) ----------

def test_pasted_lines_are_names():  # CA-01
    assert parse_pasted("\n".join(NAMES_25)) == NAMES_25


def test_pasted_keeps_empty_lines_for_review():
    assert parse_pasted("Ana\n\nLuis\r\n") == ["Ana", "", "Luis"]


@pytest.mark.parametrize("separator", [",", ";"])
def test_csv_reads_first_column_with_either_separator(separator):  # CA-18
    text = f"Nombre{separator}Email\nÁngela Núñez{separator}a@x.es\nLuis{separator}l@x.es\n"
    assert parse_csv(text) == ["Ángela Núñez", "Luis"]


def test_csv_with_bom_and_accents():  # CA-18
    assert parse_csv("﻿Alumnos\nJosé Pérez\nMaría\n") == ["José Pérez", "María"]


def test_csv_without_header_keeps_first_row():
    assert parse_csv("Ana;1\nLuis;2\n") == ["Ana", "Luis"]


def test_csv_with_one_column():
    assert parse_csv("Ana\nLuis\n") == ["Ana", "Luis"]


def test_csv_quoted_name_with_comma():
    assert parse_csv('Nombre,Edad\n"García, Ana",20\n') == ["García, Ana"]


# ---------- revisar la lista (RF-2, RF-7) ----------

def test_review_counts_students_and_empty_lines():  # CA-01
    result = review(NAMES_25 + ["", "  "])
    assert len(result["students"]) == 25
    assert result["empty"] == 2
    assert can_save(result)


def test_review_marks_normalized_duplicates():  # CA-02
    result = review(["María García", "maria  garcia"])
    assert result["duplicates"] == ["maria  garcia"]
    assert not can_save(result)


def test_review_marks_duplicates_against_saved_names():  # CA-02
    result = review(["MARÍA GARCÍA"], existing=["María García"])
    assert result["duplicates"] == ["MARÍA GARCÍA"]
    assert not can_save(result)


def test_review_marks_long_names():
    result = review(["a" * 61])
    assert result["too_long"] == ["a" * 61]
    assert not can_save(result)


def test_review_warns_about_similar_names_but_allows_saving():  # CA-05
    result = review(["Ella García", "Ella G."])
    assert result["similar"] == [{"name": "Ella G.", "like": "Ella García"}]
    assert can_save(result)


def test_review_rejects_more_than_200():
    result = review([f"Alumno {i}" for i in range(MAX_STUDENTS + 1)])
    assert result["too_many"]
    assert not can_save(result)


def test_review_counts_saved_students_for_the_limit():
    result = review(["Nueva"], existing=[f"Alumno {i}" for i in range(MAX_STUDENTS)])
    assert result["too_many"]


# ---------- límite de 200 (CA-20) ----------

def test_ensure_room_allows_up_to_200():  # CA-20
    ensure_room(MAX_STUDENTS - 1)


def test_ensure_room_rejects_over_200():  # CA-20
    with pytest.raises(GroupFull, match="Este grupo ya tiene 200 alumnos"):
        ensure_room(MAX_STUDENTS)


@pytest.mark.parametrize(
    "message",
    ["DUPLICATE", "NOT_IN_ROSTER", "NAME_TAKEN", "EMPTY_GROUP", "GROUP_FULL",
     "HAS_OPEN_SESSION", "ARCHIVED", "GROUP_GONE", "GROUP_NOT_FOUND", "STUDENT_NOT_FOUND", "NO_GROUP"],
)
def test_errors_have_spanish_messages(message):
    text = getattr(roster, message)
    assert text[0].isupper() and text.endswith(".")


def test_similar_name_carries_the_suggestion():  # CA-05
    error = roster.SimilarName("Ella García")
    assert error.suggestion == "Ella García"
    assert str(error) == "¿Quisiste decir Ella García?"
