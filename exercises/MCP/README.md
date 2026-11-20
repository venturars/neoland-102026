# MCP Outreach — ejercicio compartido

Servidor MCP de ejemplo con contactos (tools, resources, prompts) para la clase de AI Engineering.

Vive en el monorepo del bootcamp en **`exercises/MCP/`**. El código viene del proyecto independiente [MCP-TEST](https://github.com/sergiocortessat/MCP-TEST); aquí solo cambia la ruta y la documentación de arranque.

| Archivo | Qué es |
|---------|--------|
| `server.py` | MCP real con la librería oficial (`MCPServer`) |
| `server_flask.py` | Demo pedagógica: mismas ideas “a mano” con Flask (no es MCP compatible con Cursor) |
| `docs/clase-mcp-outreach.md` | Material de clase (Parte 1 SDK + Parte 2 Flask) |
| `docs/ejercicio-practico-juniors.md` | Mini ejercicio para juniors |

---

## Requisitos

- [uv](https://docs.astral.sh/uv/)  
- Python (ver `.python-version`)  
- Para el Inspector: `npx` (Node)  
- Cursor (u otro cliente MCP) para usar las tools desde el agente  

---

## Setup

Desde la **raíz del repositorio** (`bootcamp-102026`):

```bash
cd exercises/MCP
make sync
# equivalente: uv sync
```

Todos los comandos de este README se ejecutan con el directorio de trabajo en **`exercises/MCP`**.

---

## Comandos útiles

```bash
make help        # lista de atajos
make sync        # instala dependencias
make mcp-dev     # MCP Inspector en el navegador
make mcp-run     # servidor por stdio (lo lanza el cliente normalmente)
make mcp-http    # servidor MCP por HTTP en http://127.0.0.1:8000/mcp
make flask-demo  # microscopio Flask en http://127.0.0.1:5001
```

Notas:

- `make mcp-run` / stdio en terminal **parece colgado**: está esperando mensajes por stdin. Es normal.  
- Para usar el MCP desde Cursor en local, configura `mcp.json` (abajo); Cursor arranca el proceso por ti.

---

## Configurar el MCP en Cursor

Cursor **no** detecta `server.py` solo. Hace falta registrarlo en un `mcp.json`.

Rutas habituales:

| Ámbito | Ruta |
|--------|------|
| Proyecto (monorepo) | `.cursor/mcp.json` en la raíz del workspace |
| Global | `~/.cursor/mcp.json` |

Ejemplo comiteable en el monorepo: **`exercises/MCP/.mcp.json`** (solo el remoto de Railway). Para stdio local, suele ir en `.cursor/mcp.json` del workspace.

Tras editar la config, recarga los MCP en Cursor (o reinicia) si no aparecen.

### Opción A — MCP local (stdio)

Si abres la carpeta raíz del bootcamp, `${workspaceFolder}` **no** es `exercises/MCP`. Indica el directorio del ejercicio en `--directory`:

```json
{
  "mcpServers": {
    "outreach-local": {
      "command": "uv",
      "args": [
        "run",
        "--directory",
        "${workspaceFolder}/exercises/MCP",
        "python",
        "server.py"
      ]
    }
  }
}
```

### Opción B — MCP por HTTP (local)

1. Desde `exercises/MCP`, arranca el servidor:

```bash
make mcp-http
```

2. Configura el cliente con la URL:

```json
{
  "mcpServers": {
    "outreach-http-local": {
      "url": "http://127.0.0.1:8000/mcp"
    }
  }
}
```

### Opción C — MCP remoto (Railway u otro host)

El servidor ya está desplegado con `streamable-http`. Solo apunta a la URL:

```json
{
  "mcpServers": {
    "outreach-railway": {
      "url": "https://mcp-test-production-303973cb.up.railway.app/mcp"
    }
  }
}
```

(Ajusta la URL si tu despliegue es otro.)

### Local vs HTTP — resumen

| | Local (`stdio`) | HTTP (`url`) |
|--|-----------------|--------------|
| Config | `command` + `args` | `url` |
| Quién arranca el proceso | Cursor | Tú / Railway (`make mcp-http` o el host) |
| Típico | desarrollo en tu máquina | compartir / deploy |

---

## Qué expone el servidor (`server.py`)

**Tools:** `listar_contactos`, `buscar_contacto`, `cambiar_estado`  
**Resource:** `outreach://estados`  
**Prompt:** `redactar_email(nombre, empresa)`

---

## Demo Flask (opcional, clase Parte 2)

```bash
make flask-demo
```

Ejemplos:

```bash
curl -s http://127.0.0.1:5001/tools | python3 -m json.tool

curl -s -X POST http://127.0.0.1:5001/tools/listar_contactos \
  -H 'Content-Type: application/json' \
  -d '{"estado":"active"}' | python3 -m json.tool

curl -s http://127.0.0.1:5001/resources/outreach/estados | python3 -m json.tool
```

Esto **no** sustituye al MCP real para Cursor; sirve para entender catálogo + dispatch.

---

## Material de clase

1. Teoría y ejemplos: [`docs/clase-mcp-outreach.md`](docs/clase-mcp-outreach.md)  
2. Ejercicio juniors: [`docs/ejercicio-practico-juniors.md`](docs/ejercicio-practico-juniors.md)