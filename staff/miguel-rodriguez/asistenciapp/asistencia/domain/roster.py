"""Lista local única de nombres y personajes aprobados en 007."""
from .names import name_key

ROSTER = tuple({"key": key, "name": name, "character": character} for key, name, character in (
    ("diego-molero", "Diego Molero", "node-jack"),
    ("diego-torres", "Diego Torres", "espantatorres"),
    ("ella-deyavorsky", "Ella Deyavorsky", "mr-wobble"),
    ("esther-patino", "Esther Patino", "hombre-lobo-esther"),
    ("jimena-duran", "Jimena Duran", "ajolote"),
    ("jose-miguel", "Jose Miguel", "jack"),
    ("luis-duque", "Luis Duque", "vampire-king-leo"),
    ("manuel-diaz", "Manuel Diaz", "fantasmiko"),
    ("maria-osipuk", "Maria Osipuk", "mimo"),
    ("meghan-martin", "Meghan Martin", "fantasma"),
    ("miguel-rodriguez", "Miguel Rodriguez", "yomi"),
    ("raul-santamaria", "Raul Santamaria", "calabaza-aterradora"),
    ("sergio-cortes", "Sergio Cortes", "harry-universe"),
    ("sergio-moras", "Sergio Moras", "edgar-allan-poe"),
    ("victor-chang", "Victor Chang", "vicwolf"),
))


def resolve_slot(value: object) -> dict | None:
    """Resuelve una clave o nombre sin crear variantes de presupuesto.

    :param value: clave o nombre recibido.
    :return: referencia del roster o None.
    :rtype: dict | None

    Usage::

        resolve_slot("Jimena Durán")
    """
    if not isinstance(value, str):
        return None
    normalized = name_key(value)
    return next((r for r in ROSTER if r["key"] == value or name_key(r["name"]) == normalized), None)
