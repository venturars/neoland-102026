"""Validación y resolución de alumnos recibidos como datos explícitos."""
from .names import name_key


def validate_roster(roster: list[dict], available_characters: set[str]) -> None:
    """Valida referencias únicas, personajes disponibles y orden explícito.

    :param roster: registros con key, name, character y display_order.
    :param available_characters: referencias de personajes permitidas por la app.
    :return: None si los registros son válidos; ValueError en otro caso.
    :rtype: None

    Usage::

        validate_roster([], set())
    """
    keys = set()
    names = set()
    positions = set()
    for row in roster:
        if not isinstance(row, dict):
            raise ValueError('Registro de alumno inválido.')
        for field in ('key', 'name', 'character'):
            value = row.get(field)
            if not isinstance(value, str) or not value.strip():
                raise ValueError('Referencia de alumno incompleta.')
        key, name = row['key'], name_key(row['name'])
        position = row.get('display_order')
        if type(position) is not int or position < 0 or position in positions:
            raise ValueError('Orden del catálogo inválido.')
        if key in keys or name in names:
            raise ValueError('Referencia de alumno repetida.')
        if row['character'] not in available_characters:
            raise ValueError('Personaje del catálogo no disponible.')
        keys.add(key)
        names.add(name)
        positions.add(position)
    # Una clave exacta tampoco puede resolver al nombre de otra persona.
    for row in roster:
        other_names = names - {name_key(row['name'])}
        if name_key(row['key']) in other_names:
            raise ValueError('La clave coincide con el nombre de otro alumno.')


def resolve_slot(value: object, roster: list[dict] | tuple[dict, ...]) -> dict | None:
    """Resuelve una clave exacta o nombre sin crear otra plaza.

    :param value: clave o nombre recibido.
    :param roster: participantes explícitos de la carrera.
    :return: referencia encontrada o None.
    :rtype: dict | None

    Usage::

        resolve_slot('Ada', [{'key': 'ada', 'name': 'Ada', 'character': 'piloto'}])
    """
    if not isinstance(value, str):
        return None
    normalized = name_key(value)
    return next((row for row in roster if row['key'] == value or name_key(row['name']) == normalized), None)
