"""Servidor MCP de ejemplo para el proyecto outreach.

Expone:
- TOOLS     -> funciones que la IA puede llamar.
- RESOURCES -> datos que se pueden leer por URI.
- PROMPTS   -> plantillas de mensajes que el usuario puede elegir.

Modos de ejecución:
- Local (stdio, por defecto): lo lanza el cliente (Cursor, Inspector).
    uv run python server.py
- HTTP (para Railway u otro hosting): escucha en 0.0.0.0:$PORT, ruta /mcp.
    MCP_TRANSPORT=streamable-http uv run python server.py
"""

import os

from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ToolError

mcp = MCPServer("Outreach")

# Datos en memoria para que el ejemplo no necesite base de datos.
# Los estados coinciden con ContactStatus del proyecto outreach original.
ESTADOS_VALIDOS = {"active", "inactive", "prospect", "bounced"}

CONTACTOS: list[dict[str, str]] = [
    {"nombre": "Ana García", "empresa": "Acme", "email": "ana@acme.com", "estado": "prospect"},
    {"nombre": "Luis Pérez", "empresa": "Globex", "email": "luis@globex.com", "estado": "active"},
    {"nombre": "Marta Ruiz", "empresa": "Initech", "email": "marta@initech.com", "estado": "bounced"},
]


# --- TOOLS: la IA puede llamarlas --------------------------------------------


@mcp.tool()
def listar_contactos(estado: str | None = None) -> list[dict[str, str]]:
    """Lista los contactos. Si se indica estado, filtra por él (active, inactive, prospect, bounced)."""
    if estado is None:
        return CONTACTOS
    return [c for c in CONTACTOS if c["estado"] == estado]


@mcp.tool()
def buscar_contacto(texto: str) -> list[dict[str, str]]:
    """Busca contactos cuyo nombre, empresa o email contenga el texto indicado."""
    needle = texto.lower()
    return [
        c
        for c in CONTACTOS
        if needle in c["nombre"].lower()
        or needle in c["empresa"].lower()
        or needle in c["email"].lower()
    ]


@mcp.tool()
def cambiar_estado(email: str, nuevo_estado: str) -> str:
    """Cambia el estado de un contacto identificado por su email."""
    if nuevo_estado not in ESTADOS_VALIDOS:
        # ToolError devuelve el error a la IA como resultado de la herramienta,
        # para que pueda corregirse y volver a intentarlo.
        raise ToolError(f"Estado inválido {nuevo_estado!r}. Usa uno de: {sorted(ESTADOS_VALIDOS)}")

    for contacto in CONTACTOS:
        if contacto["email"] == email:
            anterior = contacto["estado"]
            contacto["estado"] = nuevo_estado
            return f"{contacto['nombre']}: {anterior} -> {nuevo_estado}"

    raise ToolError(f"No existe ningún contacto con email {email!r}.")


# --- RESOURCES: datos que la IA puede leer por URI ---------------------------


@mcp.resource("outreach://estados")
def estados() -> str:
    """Lista los estados posibles de un contacto y su significado."""
    return "\n".join(
        [
            "active: contacto activo, recibe campañas",
            "inactive: contacto desactivado",
            "prospect: contacto potencial, todavía no contactado",
            "bounced: el email rebotó",
        ]
    )


# --- PROMPTS: plantillas que el usuario puede invocar ------------------------


@mcp.prompt()
def redactar_email(nombre: str, empresa: str) -> str:
    """Genera un prompt para redactar un email de primer contacto."""
    return (
        f"Redacta un email corto y cordial de primer contacto para {nombre}, "
        f"que trabaja en {empresa}. Menciona que somos Neoland y propón una llamada de 15 minutos."
    )


if __name__ == "__main__":
    if os.getenv("MCP_TRANSPORT", "stdio") == "streamable-http":
        # Railway (y otros hostings) necesitan escuchar en todas las interfaces y en el puerto indicado.
        mcp.run(
            transport="streamable-http",
            host="0.0.0.0",
            port=int(os.getenv("PORT", "8000")),
        )
    else:
        mcp.run()
