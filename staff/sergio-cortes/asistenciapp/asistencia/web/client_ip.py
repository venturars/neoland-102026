"""IP del cliente vista por el servidor (ProxyFix + túnel)."""

from flask import Request


def client_ip(request: Request) -> str:
    return request.remote_addr or "unknown"
