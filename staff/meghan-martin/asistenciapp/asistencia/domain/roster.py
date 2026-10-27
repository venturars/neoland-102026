"""La lista de la clase: quién está y qué nombres coinciden con lo escrito."""

from asistencia.domain.names import name_key

# The class, in the order the teacher sees. Not the attendance file.
CLASS_NAMES = (
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
)


def matches(text: str) -> list[str]:
    """Nombres de la clase que contienen ese texto.

    Recibe lo que escribió el alumno. Vacío devuelve los quince.
    Devuelve los nombres, en el orden de la clase.

    Ejemplo: matches("sergio") -> ["Sergio Cortes", "Sergio Moras"]
    """
    # Capitals do not matter. An empty box shows everyone.
    query = name_key(text or "")
    if not query:
        return list(CLASS_NAMES)
    return [name for name in CLASS_NAMES if query in name_key(name)]


def official_name(text: str) -> str | None:
    """El nombre de la lista, si el texto es exactamente uno de ellos.

    Recibe el texto. Devuelve la grafía de la lista, o nada.

    Ejemplo: official_name("meghan martin") -> "Meghan Martin"
    """
    # "meghan martin" and "Meghan Martin" are the same person.
    key = name_key(text or "")
    for name in CLASS_NAMES:
        if name_key(name) == key:
            return name
    return None
