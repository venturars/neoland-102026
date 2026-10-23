"""Tests de asistencia/names.py · CA-07, CA-08, CA-12."""

import pytest

from asistencia.names import MAX_LENGTH, clean_name, name_key


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
