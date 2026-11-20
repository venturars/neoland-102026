"""Paso 2 (clase): MCP "a mano" con Flask — tools, resources y prompts.

NO es un servidor MCP compatible con Cursor.
Es un microscopio: las mismas ideas (catálogo + leer/ejecutar) sin la librería mcp.

Endpoints:
  GET  /tools                         → tools/list
  POST /tools/<nombre>                → tools/call
  GET  /resources                     → resources/list
  GET  /resources/<path:uri>          → resources/read  (ej. outreach/estados)
  GET  /prompts                       → prompts/list
  GET  /prompts/<nombre>?args...      → prompts/get
"""

from flask import Flask, jsonify, request

app = Flask(__name__)

# --- Capa 4: negocio (igual que en server.py) --------------------------------

ESTADOS_VALIDOS = {"active", "inactive", "prospect", "bounced"}

CONTACTOS: list[dict[str, str]] = [
    {"nombre": "Ana García", "empresa": "Acme", "email": "ana@acme.com", "estado": "prospect"},
    {"nombre": "Luis Pérez", "empresa": "Globex", "email": "luis@globex.com", "estado": "active"},
    {"nombre": "Marta Ruiz", "empresa": "Initech", "email": "marta@initech.com", "estado": "bounced"},
]


class ToolBusinessError(Exception):
    """Error de negocio recuperable (equivalente pedagógico a ToolError de MCP).

    Mensaje claro para la IA: qué falló y cómo corregirlo.
    No es un crash del servidor.
    """


def listar_contactos(estado: str | None = None) -> list[dict[str, str]]:
    """Lista los contactos. Si se indica estado, filtra por él."""
    if estado is None:
        return CONTACTOS
    return [c for c in CONTACTOS if c["estado"] == estado]


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


def cambiar_estado(email: str, nuevo_estado: str) -> str:
    """Cambia el estado de un contacto identificado por su email."""
    if nuevo_estado not in ESTADOS_VALIDOS:
        raise ToolBusinessError(
            f"Estado invalido {nuevo_estado!r}. Usa uno de: {sorted(ESTADOS_VALIDOS)}"
        )

    for contacto in CONTACTOS:
        if contacto["email"] == email:
            anterior = contacto["estado"]
            contacto["estado"] = nuevo_estado 
            return f"{contacto['nombre']}: {anterior} -> {nuevo_estado}"

    raise ToolBusinessError(f"No existe ningún contacto con email {email!r}.")


# --- Capa 3: catálogo (esto lo genera MCPServer solo mirando decoradores) ----

# A mano escribimos el "menú" que tools/list devolvería.
TOOLS_CATALOG = {
    "listar_contactos": {
        "name": "listar_contactos",
        "description": "Lista los contactos. Si se indica estado, filtra por él "
        "(active, inactive, prospect, bounced).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "estado": {
                    "type": "string",
                    "description": "Filtro opcional por estado",
                }
            },
        },
        # Puntero a la función real (dispatch). La librería MCP también guarda esto.
        "_fn": listar_contactos,
    },
    "buscar_contacto": {
        "name": "buscar_contacto",
        "description": "Busca contactos cuyo nombre, empresa o email contenga el texto indicado.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "texto": {
                    "type": "string",
                    "description": "Texto a buscar en nombre, empresa o email",
                }
            },
            "required": ["texto"],
        },
        "_fn": buscar_contacto,
    },
    "cambiar_estado": {
        "name": "cambiar_estado",
        "description": "Cambia el estado de un contacto identificado por su email.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string",
                    "description": "Email del contacto",
                },
                "nuevo_estado": {
                    "type": "string",
                    "description": "Nuevo estado: active, inactive, prospect o bounced",
                },
            },
            "required": ["email", "nuevo_estado"],
        },
        "_fn": cambiar_estado,
    },
}


def estados() -> str:
    """Lista los estados posibles de un contacto y su significado. (solo lectura)"""
    return "\n".join(
        [
            "active: contacto activo, recibe campanas",
            "inactive: contacto desactivado",
            "prospect: contacto potencial, todavia no contactado",
            "bounced: el email reboto",
        ]
    )


# En MCP real la URI es outreach://estados.
# En Flask usamos path HTTP: /resources/outreach/estados
RESOURCES_CATALOG = {
    "outreach/estados": {
        "uri": "outreach://estados",
        "name": "estados",
        "description": "Lista los estados posibles de un contacto y su significado.",
        "_fn": estados,
    },
}


def redactar_email(nombre: str, empresa: str) -> str:
    """Genera un prompt para redactar un email de primer contacto."""
    return (
        f"Redacta un email corto y cordial de primer contacto para {nombre}, "
        f"que trabaja en {empresa}. Menciona que somos Neoland y propón una llamada de 15 minutos."
    )


PROMPTS_CATALOG = {
    "redactar_email": {
        "name": "redactar_email",
        "description": "Genera un prompt para redactar un email de primer contacto.",
        "arguments": [
            {"name": "nombre", "description": "Nombre del contacto", "required": True},
            {"name": "empresa", "description": "Empresa del contacto", "required": True},
        ],
        "_fn": redactar_email,
    },
}


# --- Capa 2 (simplificada): HTTP en vez de JSON-RPC MCP ----------------------


@app.get("/tools")
def tools_list():
    """Equivale a tools/list: devolver el menú, sin ejecutar nada."""
    tools = []
    for meta in TOOLS_CATALOG.values():
        tools.append(
            {
                "name": meta["name"],
                "description": meta["description"],
                "inputSchema": meta["inputSchema"],
            }
        )
    return jsonify({"tools": tools})


@app.post("/tools/<nombre>")
def tools_call(nombre: str):
    """Equivale a tools/call: name en la URL, arguments en el body JSON."""
    meta = TOOLS_CATALOG.get(nombre)
    if meta is None:
        return jsonify({"error": f"Tool desconocida: {nombre!r}"}), 404

    # arguments = lo que en MCP iría en params.arguments
    arguments = request.get_json(silent=True) or {}

    # En Flask NOSOTROS convertimos el return de Python a JSON (jsonify).
    # Con la librería mcp, ella empaquetaría el resultado en el formato MCP.
    try:
        resultado = meta["_fn"](**arguments)
    except ToolBusinessError as exc:
        # 400 = "tu petición está mal / no se puede aplicar"
        # Mensaje pensado para que una IA (o un humano) sepa cómo corregir.
        return jsonify({"error": str(exc)}), 400
    except TypeError as exc:
        # p.ej. falta un argumento requerido o un argumenoto no existe
        return jsonify({"error": str(exc)}), 400

    return jsonify({"content": resultado})


@app.get("/resources")
def resources_list():
    """Equivale a resources/list: catálogo de URIs legibles (sin side-effects)."""
    resources = [
        {
            "uri": meta["uri"],
            "name": meta["name"],
            "description": meta["description"],
        }
        for meta in RESOURCES_CATALOG.values()
    ]
    return jsonify({"resources": resources})


@app.get("/resources/<path:uri_path>")
def resources_read(uri_path: str):
    """Equivale a resources/read: solo lectura por URI."""
    meta = RESOURCES_CATALOG.get(uri_path)
    if meta is None:
        return jsonify({"error": f"Resource desconocido: {uri_path!r}"}), 404

    # No hay body de "acción": solo devolvemos el contenido informativo.
    return jsonify({"uri": meta["uri"], "text": meta["_fn"]()})


@app.get("/prompts")
def prompts_list():
    """Equivale a prompts/list: plantillas que el usuario puede elegir."""
    prompts = [
        {
            "name": meta["name"],
            "description": meta["description"],
            "arguments": meta["arguments"],
        }
        for meta in PROMPTS_CATALOG.values()
    ]
    return jsonify({"prompts": prompts})


@app.get("/prompts/<nombre>")
def prompts_get(nombre: str):
    """Equivale a prompts/get: rellena la plantilla con query params."""
    meta = PROMPTS_CATALOG.get(nombre)
    if meta is None:
        return jsonify({"error": f"Prompt desconocido: {nombre!r}"}), 404

    # Los args del prompt vienen en la query (?nombre=Sergio&empresa=Acme)
    arguments = {key: request.args.get(key) for key in ("nombre", "empresa")}
    missing = [k for k, v in arguments.items() if not v]
    if missing:
        return jsonify({"error": f"Faltan argumentos: {missing}"}), 400

    try:
        texto = meta["_fn"](**arguments)
    except TypeError as exc:
        return jsonify({"error": str(exc)}), 400

    # Ojo: esto NO envía un email. Solo devuelve instrucciones para el modelo.
    return jsonify({"name": nombre, "messages": [{"role": "user", "content": texto}]})


if __name__ == "__main__":
    # http://127.0.0.1:5001/tools
    app.run(host="127.0.0.1", port=5001, debug=True)
