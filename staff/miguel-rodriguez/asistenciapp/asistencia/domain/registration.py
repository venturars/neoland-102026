"""Reglas de frecuencia de registro y normalización de sus direcciones."""

from ipaddress import ip_address


class AddressBlocked(Exception):
    """La dirección no puede registrar asistencia por superar los límites."""


class OriginUnavailable(Exception):
    """No se puede atribuir el intento a un origen fiable."""


def normalize_address(value: str | None) -> str | None:
    """Normaliza una dirección sin aceptar listas, puertos ni zonas IPv6.

    :param value: dirección única recibida de una fuente de conexión.
    :return: dirección canónica o None si no es válida.
    :rtype: str | None

    Usage::

        normalize_address("::ffff:127.0.0.1")
    """
    if not isinstance(value, str) or "%" in value:
        return None
    try:
        address = ip_address(value.strip())
    except ValueError:
        return None
    return str(getattr(address, "ipv4_mapped", None) or address)


def exceeds_limits(previous: list[float], instant: float) -> bool:
    """Comprueba los máximos móviles incluyendo el intento actual.

    :param previous: tiempos de intentos anteriores de una dirección.
    :param instant: instante Unix del intento actual.
    :return: si sería el sexto en un segundo o el vigesimoprimero en un minuto.
    :rtype: bool

    Usage::

        exceeds_limits([100.0] * 5, 100.5)
    """
    return (1 + sum(t > instant - 1 for t in previous) > 5
            or 1 + sum(t > instant - 60 for t in previous) > 20)
