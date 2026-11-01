"""Tests de asistencia/infra/tunnel.py · CA-20.

Las líneas son copias reales de la salida de cloudflared 2026.10.1.
"""

import pytest

from asistencia.infra.tunnel import find_tunnel_url

URL_LINE = (
    "2026-10-20T08:33:25Z INF |  https://actual-academics-century-ratio.trycloudflare.com"
    "                                  |"
)


def test_finds_url_in_real_line():
    assert find_tunnel_url(URL_LINE) == "https://actual-academics-century-ratio.trycloudflare.com"


@pytest.mark.parametrize(
    "line",
    [
        # Contiene otras URLs de Cloudflare que NO son la del túnel.
        "2026-10-20T08:33:15Z INF Thank you for trying Cloudflare Tunnel. ... "
        "(https://www.cloudflare.com/website-terms/) ... "
        "https://developers.cloudflare.com/cloudflare-one/connections/connect-apps",
        # Menciona trycloudflare.com pero aún no hay URL.
        "2026-10-20T08:33:15Z INF Requesting new quick Tunnel on trycloudflare.com...",
        "2026-10-20T08:33:25Z INF Starting metrics server on 127.0.0.1:20241/metrics",
        "",
    ],
)
def test_ignores_other_lines(line):
    assert find_tunnel_url(line) is None
