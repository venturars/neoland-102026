"""Identifica el origen de conexión del borde HTTP, sin confiar en el formulario."""

from ipaddress import ip_address

from .domain.registration import normalize_address


def registration_origin(peer: str | None, cloudflare_ip: str | None, *, trust_cloudflare: bool = False) -> str | None:
    """Resuelve el par directo o la dirección comunicada por el conector local.

    :param peer: REMOTE_ADDR del par inmediato, sin aplicar X-Forwarded-For.
    :param cloudflare_ip: CF-Connecting-IP establecido por Cloudflare.
    :param trust_cloudflare: modo explícito para el túnel local de esta app.
    :return: origen normalizado o None cuando no se cumple la frontera de confianza.
    :rtype: str | None

    Usage::

        registration_origin("127.0.0.1", None)
    """
    address = normalize_address(peer)
    if not trust_cloudflare:
        return address
    visitor = normalize_address(cloudflare_ip)
    if (address is None or not ip_address(address).is_loopback
            or visitor is None or not ip_address(visitor).is_global):
        return None
    return visitor
