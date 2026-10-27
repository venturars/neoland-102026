"""Tests de asistencia/names.py · CA-07, CA-08, CA-12."""

import pytest

from asistencia.domain.names import MAX_LENGTH, clean_name, name_key


def test_strips_surrounding_spaces():
    assert clean_name("  Ana García  ") == "Ana García"


@pytest.mark.parametrize("raw", ["", "   ", None])
def test_empty_name_is_rejected(raw):  # CA-08
    with pytest.raises(ValueError, match="Escribe tu nombre"):
        clean_name(raw)


def test_name_at_max_length_is_accepted():  # CA-08
    assert clean_name("a" * MAX_LENGTH) == "a" * MAX_LENGTH


def test_name_over_max_length_is_rejected():  # CA-08
    with pytest.raises(ValueError, match="60 caracteres"):
        clean_name("a" * (MAX_LENGTH + 1))


def test_html_is_kept_literally():  # CA-12
    assert clean_name("<b>Ana</b>") == "<b>Ana</b>"


@pytest.mark.parametrize(
    "variant",
    ["Ana García", "ana garcia", "  ANA   GARCÍA ", "Ána Garcìa"],
)
def test_variants_share_the_same_key(variant):  # CA-07
    assert name_key(variant) == name_key("Ana García")


def test_different_names_have_different_keys():
    assert name_key("Ana García") != name_key("Ana Garcés")


# ---------- spec 007 · nombres parecidos (CA-05) ----------

from asistencia.domain.names import find_similar, is_similar  # noqa: E402


@pytest.mark.parametrize(
    "a, b",
    [("ella g", "ella garcia"), ("ella g.", "ella garcia"), ("maria garcia", "mria garcia")],
)
def test_similar_names(a, b):  # CA-05
    assert is_similar(a, b)
    assert is_similar(b, a)


def test_equal_keys_are_not_similar():  # CA-05: iguales es otro caso (duplicado)
    assert not is_similar("ella garcia", "ella garcia")


def test_different_names_are_not_similar():
    assert not is_similar("ana lopez", "pedro ruiz")


def test_find_similar_returns_the_first_match_or_none():  # CA-05
    assert find_similar("ella g", ["Pedro Ruiz", "Ella García", "Ella Gómez"]) == "Ella García"
    assert find_similar("ana lopez", ["Pedro Ruiz"]) is None
