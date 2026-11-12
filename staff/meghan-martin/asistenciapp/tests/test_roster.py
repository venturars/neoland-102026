"""La lista de la clase y la búsqueda de un nombre."""

from asistencia.domain.roster import matches, official_name

CLASS = [
    "Ella Deyavorsky",
    "Meghan Martin",
    "Esther Patino",
    "Miguel Rodriguez",
    "Sergio Cortes",
    "Sergio Moras",
    "Luis Duque",
    "Diego Molero",
    "Diego Torres",
    "Manuel Diaz",
    "Jimena Duran",
    "Jose Miguel",
    "Maria Osipuk",
    "Raul Santamaria",
    "Victor Chang",
]


def test_an_empty_search_is_the_whole_class_in_order():
    assert matches("") == CLASS
    assert matches("   ") == CLASS


def test_sergio_finds_both_and_a_surname_finds_one():
    assert matches("sergio") == ["Sergio Cortes", "Sergio Moras"]
    assert matches("MEGHAN") == ["Meghan Martin"]
    assert matches("TORRES") == ["Diego Torres"]


def test_official_name_uses_the_spelling_on_the_list():
    assert official_name("Meghan Martin") == "Meghan Martin"
    assert official_name("  meghan   martin ") == "Meghan Martin"
    assert official_name("Otra Persona") is None
