"""Decide si un ordenador se ha pasado de intentos de pasar lista.

No abre el fichero y no dibuja la página.
Ejemplo: over_limit(6, 6) es verdadero.
"""

from ipaddress import ip_address

# This file only answers one question: has this computer tried too many times?
# It does not save anything, and it does not draw the page.

# A person may try to check in this many times in one second.
# The 5th try is still allowed. The 6th is too many.
MAX_PER_SECOND = 5

# A person may try to check in this many times in one minute.
# The 20th try is still allowed. The 21st is too many.
MAX_PER_MINUTE = 20

# This is the sentence the blocked person sees on the page.
# It stays in Spanish because that is the language of the app.
BAN_MESSAGE = (
    "Demasiados intentos. Este ordenador queda bloqueado y ya no puede pasar lista."
)


class Banned(Exception):
    """Ese ordenador superó los intentos permitidos."""

    def __init__(self) -> None:
        # Attach the Spanish sentence, so the page can show it.
        super().__init__(BAN_MESSAGE)


def over_limit(in_the_second: int, in_the_minute: int) -> bool:
    """Dice si esos recuentos se pasan del tope.

    Recibe los intentos del último segundo y los del último minuto, incluido el de ahora.
    Devuelve True si el segundo pasa de 5 o el minuto de 20.
    Ejemplo: over_limit(6, 6).
    """
    # in_the_second is how many tries happened in the last second, including this one.
    # in_the_minute is how many tries happened in the last minute, including this one.
    # Answer yes if either number is over its limit.
    # Five in a second is still ok. Six is not.
    # Twenty in a minute is still ok. Twenty-one is not.
    return in_the_second > MAX_PER_SECOND or in_the_minute > MAX_PER_MINUTE


def _one_ip(value: str | None) -> str:
    # One address only. A list, a port, or an empty value is not a computer.
    if not isinstance(value, str) or "," in value or "%" in value:
        return ""
    try:
        address = ip_address(value.strip())
    except ValueError:
        return ""
    mapped = getattr(address, "ipv4_mapped", None)
    return str(mapped or address)


def counted_address(peer: str | None, cloudflare_ip: str | None, trust_tunnel: bool) -> str:
    """El ordenador que se cuenta en este intento.

    Recibe la conexión directa, la dirección que manda el túnel y si el túnel está encendido.
    Devuelve esa dirección. Vacío si no hay una sola dirección válida.
    Ejemplo: counted_address("127.0.0.1", "8.8.8.8", True) -> "8.8.8.8"
    """
    # On this computer, the student is whoever connected.
    # Through the public link, the tunnel is that connection, so the student is the address Cloudflare sends.
    direct = _one_ip(peer)
    if not trust_tunnel or not direct or not ip_address(direct).is_loopback:
        return direct
    visitor = _one_ip(cloudflare_ip)
    if visitor and ip_address(visitor).is_global:
        return visitor
    return direct
