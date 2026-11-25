# Clase: MCP con el ejemplo Outreach

Documento para estudiantes junior de AI Engineering.  
Usamos el servidor de este repo (`server.py`) como caso real.

> **Estado del material**
> - Parte 1 — lista (MCP con la librería oficial: local vs remoto)
> - Parte 2 — lista (mismo outreach “a mano” con Flask, para ver el trasfondo)

---

## Introducción — ¿Qué es un MCP y para qué sirve?

### En una frase

**MCP (Model Context Protocol)** es un “enchufe estándar” entre un **agente de IA** (Cursor, Claude, etc.) y **herramientas o datos del mundo real** (APIs, bases de datos, tu app, un CRM…).

Sin algo así, el modelo solo puede hablar con el texto que le pones en el chat.  
Con MCP, puede **consultar**, **actuar** y **usar plantillas** de forma ordenada.

### Por qué importa en AI Engineering

En AI Engineering no basta con “hablar con el LLM”. Hay que **conectar** el modelo con sistemas reales de forma:

- **segura** (no pegar secretos a lo loco en el prompt),  
- **repetible** (mismo contrato en local, en CI, en otro cliente),  
- **mantenible** (la lógica vive en código, no en un prompt gigante).

MCP da un lenguaje común: el cliente pregunta *qué puedes hacer* y luego *haz esto*.  
Tú no reinventas un conector distinto para cada chat o cada IDE.

```text
  Humano  →  Agente de IA  →  MCP  →  tu código / APIs / datos
                 ↑
           tools, resources, prompts
```

### Usar un MCP que ya existe

**Objetivo:** no reinventar la rueda.

Ejemplos típicos: GitHub, bases de datos, buscadores, tickets, docs internas ya empaquetadas como MCP.

Lo usas cuando:

- alguien ya expuso bien esa integración,  
- solo necesitas **consumir** capacidades (listar issues, buscar docs…),  
- quieres ir rápido y centrarte en el producto / el agente.

En la práctica: configuras la URL o el comando en `mcp.json` y el agente ya ve las tools.

### Crear un MCP propio

**Objetivo:** exponer **tu** dominio a cualquier cliente compatible.

Lo creas cuando:

- la lógica es de tu empresa o proyecto (como este **Outreach**: contactos, estados, emails),  
- no hay un MCP público que haga exactamente eso,  
- quieres que Cursor (u otro agente) use **tus** reglas y datos, no un prompt improvisado.

Escribes el servidor una vez (`server.py`); luego lo usas en local (`stdio`) o lo publicas por HTTP para que otros lo conecten.

### Resumen para llevarse

| Pregunta | Respuesta corta |
|----------|-----------------|
| ¿Qué es? | Protocolo estándar agente ↔ herramientas/datos |
| ¿Para qué? | Que la IA pueda actuar fuera del chat, con un contrato claro |
| ¿Usar uno existente? | Integrar rápido capacidades ya hechas |
| ¿Crear el tuyo? | Darle a la IA acceso controlado a **tu** negocio |

En esta clase hacemos las dos miradas: **usar** el MCP Outreach (Parte 1) y **entender qué hay debajo** al imitarlo con Flask (Parte 2).

### Tools, resources y prompts — para qué sirve cada uno (en la práctica)

MCP expone tres tipos de capacidades. Las **tools** se notan enseguida; **resources** y **prompts** a veces confunden porque no son un comando de chat tipo `/estado`.

#### Tool — las “manos” de la IA

Sirve para **hacer algo** o **consultar con parámetros**: listar contactos, buscar, cambiar un estado.

- Quién la dispara casi siempre: **la IA**, cuando lo necesita.
- Tú no tienes que escribir `/listar_contactos`: el agente elige la tool si encaja con tu petición en lenguaje natural (“lista los prospectos”).

#### Resource — la “biblioteca” (solo lectura)

Sirve para **contexto estable** con una URI (`outreach://estados`). **No cambia datos**.

| Tools | Resources |
|-------|-----------|
| Hacer algo / consultar con argumentos | Leer un documento o dato fijo / semi-fijo |
| “Cambia el estado de Ana” | “Aquí está el glosario de estados” |
| La IA las elige cuando actúa | Se inyectan o se leen como contexto |

**Casos reales:** glosario de estados, política de tono de emails, esquema de una API, códigos de error, README de dominio.

**Por qué no es `/estado` en el chat:** MCP no es una barra de slash-commands. El **cliente** (Cursor) decide cómo mostrarlos (panel, lectura bajo demanda, adjunto). A veces se sienten “menos visibles” que las tools; igual aportan: **contexto nombrado y reutilizable**, para que la IA no alucine (p.ej. qué significa `bounced`).

Regla mental: **resource = biblioteca de consulta; tool = manos.**

#### Prompt — el “atajo de briefing” del humano

Sirve para guardar una **plantilla con huecos** (`nombre`, `empresa`) en el servidor. Arrancas una tarea **siempre igual**, sin reescribir el brief.

**Casos reales:**

- “Redacta email de primer contacto a {nombre} en {empresa}”
- “Resume este PR con nuestro formato de release”
- “Genera test plan para el ticket {id}”
- “Responde al cliente enfadado con tono X”

**¿Lo lanzas tú o la IA sola?**

- Los **prompts MCP** están pensados sobre todo para **elección del usuario** (menú / comando del servidor con argumentos).
- El agente **no** suele invocarlos automáticamente como hace con las tools.
- Las **tools** sí las elige sola; el **prompt** más bien **tú lanzas la plantilla** y el modelo continúa con ese texto.

Ojo: el prompt **no envía el email**; solo genera las instrucciones para redactarlo.

Regla mental: **prompt MCP = atajo de briefing humano; tool = acción que la IA puede decidir sola.**

#### Cómo encajan las tres (ejemplo Outreach)

1. **Resource** `estados` → se sabe qué valores son válidos.  
2. **Tool** `cambiar_estado` → la IA actualiza a Ana a `active`.  
3. **Prompt** `redactar_email` → **tú** eliges la plantilla (Sergio + empresa) y el modelo redacta.

| Pieza | ¿Quién la dispara casi siempre? | ¿Para qué? |
|-------|----------------------------------|------------|
| **Tool** | La IA | Actuar / consultar con params |
| **Resource** | Cliente / a veces la IA al leer contexto | Informar sin side-effects |
| **Prompt** | El humano | Empezar una tarea con un texto estándar |

Si en el día a día solo usas tools, es normal: son las más “agenticas”. Resources y prompts brillan cuando quieres **contexto estable** y **flujos de equipo repetibles**.

---

## Parte 1 — Crear y usar un MCP con la librería oficial

### 1.1 ¿Qué problema resuelve MCP?

Un LLM (como el agente de Cursor) solo “sabe” lo que hay en su contexto.  
Si quieres que **consulte datos**, **ejecute acciones** o **use plantillas** de tu dominio, necesita un contrato estándar para hablar con tu código.

**MCP (Model Context Protocol)** es ese contrato:

```text
┌─────────────┐         protocolo MCP          ┌──────────────────┐
│  Cliente    │  <──────────────────────────>  │  Servidor MCP    │
│  (Cursor,   │   tools / resources / prompts  │  (tu server.py)  │
│   Claude…)  │                                │                  │
└─────────────┘                                └──────────────────┘
```

Idea clave: **el mismo servidor** puede conectarse a distintos clientes.  
Tú escribes la lógica una vez; el cliente decide cuándo llamar a cada cosa.

---

### 1.2 Las tres piezas que exponemos

En nuestro ejemplo hay tres tipos de capacidades. No son lo mismo:

| Pieza | ¿Quién la dispara? | ¿Para qué sirve? | En nuestro código |
|-------|--------------------|------------------|-------------------|
| **Tool** | La IA (cuando lo necesita) | Ejecutar una acción o consulta | `listar_contactos`, `buscar_contacto`, `cambiar_estado` |
| **Resource** | La IA / el cliente (lectura por URI) | Datos de contexto, sin “acción” | `outreach://estados` |
| **Prompt** | El **usuario** (elige la plantilla) | Arrancar una conversación con un texto ya preparado | `redactar_email` |

Regla práctica para junior:

- Si es **hacer algo** → tool  
- Si es **leer información estable** → resource  
- Si es **plantilla de mensaje para el humano** → prompt  

#### Tools (ejemplo)

```python
@mcp.tool()
def listar_contactos(estado: str | None = None) -> list[dict[str, str]]:
    """Lista los contactos. Si se indica estado, filtra por él..."""
    ...
```

Lo importante:

1. El **docstring** se convierte en la descripción que ve la IA.  
2. Los **tipos de los parámetros** ayudan a generar el schema JSON.  
3. El **return** es lo que la IA recibe como resultado.

Errores “recuperables” (para que la IA pueda corregir):

```python
raise ToolError("Estado inválido ...")
```

#### Resource (ejemplo)

```python
@mcp.resource("outreach://estados")
def estados() -> str:
    """Lista los estados posibles de un contacto y su significado."""
    ...
```

Se lee por URI (`outreach://estados`), no se “invoca” como una función con argumentos de negocio.

#### Prompt (ejemplo)

```python
@mcp.prompt()
def redactar_email(nombre: str, empresa: str) -> str:
    """Genera un prompt para redactar un email de primer contacto."""
    return (
        f"Redacta un email corto ... para {nombre}, "
        f"que trabaja en {empresa}. ..."
    )
```

Ojo: el prompt **no envía el email**. Solo genera instrucciones para que el modelo redacte el texto.

---

### 1.3 La librería MCP oculta el protocolo

En este proyecto usamos:

```python
from mcp.server import MCPServer

mcp = MCPServer("Outreach")
```

Con decoradores (`@mcp.tool()`, `@mcp.resource()`, `@mcp.prompt()`) registras capacidades.  
La librería se encarga de:

- anunciar al cliente qué tools/resources/prompts existen  
- validar argumentos  
- serializar respuestas  
- hablar el protocolo MCP por el **transport** elegido  

Tú te centras en la lógica de negocio (contactos, estados, emails).

> Nota técnica (útil en clase): en modo HTTP, el SDK de Python monta una app **Starlette** y la sirve con **uvicorn** (misma familia tecnológica que FastAPI, no es “Flask por debajo”).

---

### 1.4 Transport: lo mismo de negocio, dos formas de conectarse

El **transport** es *cómo viajan los bytes* entre cliente y servidor.  
**No cambia** qué tools tienes; solo cambia el canal.

| Transport | Qué es | Cuándo usarlo |
|-----------|--------|---------------|
| `stdio` (por defecto) | El cliente lanza tu proceso como proceso hijo y habla por stdin/stdout | Local, desarrollo, un solo usuario en su máquina |
| `streamable-http` | Servidor HTTP real en un puerto (ruta típica `/mcp`) | Despliegue, que otras personas/herramientas lo usen por URL |
| `sse` | Transport HTTP antiguo | Evitarlo; está supersedido |

En nuestro `server.py`:

```python
if __name__ == "__main__":
    if os.getenv("MCP_TRANSPORT", "stdio") == "streamable-http":
        mcp.run(
            transport="streamable-http",
            host="0.0.0.0",   # necesario en hosting (Railway, etc.)
            port=int(os.getenv("PORT", "8000")),
        )
    else:
        mcp.run()  # stdio
```

#### Diferencias que sí importan en la práctica

```text
LOCAL (stdio)
─────────────
Cursor ──lanza──> python server.py
         <── JSON-RPC por stdin/stdout ──>

- El proceso vive mientras Cursor lo necesita
- No hay URL pública
- Ideal para probar en clase en tu laptop


REMOTO (streamable-http)
────────────────────────
Cursor (u otro cliente) ──HTTPS──> https://tu-app.up.railway.app/mcp
                                   │
                                   └── proceso Python escuchando 0.0.0.0:$PORT

- El servidor ya está “encendido” en la nube
- Cualquier cliente con la URL puede conectarse
- Hay que pensar en puerto, host, HTTPS, auth (más adelante)
```

Comparación rápida:

| Tema | `stdio` | `streamable-http` |
|------|---------|-------------------|
| Quién arranca el proceso | El cliente (Cursor) | Tú / la plataforma (Railway) |
| Dirección | Proceso local | URL (HTTP/HTTPS) |
| Config en Cursor | comando + args (o `mcp run`) | `"url": "https://.../mcp"` |
| Compartir con otros | Difícil (su máquina) | Fácil (misma URL) |
| Host | No aplica | En cloud: `0.0.0.0` (no solo `127.0.0.1`) |
| Puerto | No aplica | `PORT` del hosting |

---

### 1.5 Cómo lo conectamos en este proyecto

#### Dependencias

`pyproject.toml` declara:

```toml
dependencies = [
    "mcp[cli]>=2.3.0",
]
```

Instalar / sincronizar:

```bash
make sync
# equivalente: uv sync
```

#### Comandos locales (Makefile)

Hay **un solo servidor** (`server.py`). Los comandos no son “MCPs distintos”: cambian *quién lo arranca* y *con qué cara lo pruebas*.

`uv run` solo significa: “usa el entorno de este proyecto”. No es otra forma de MCP.

| Comando | Equivalente | ¿Qué es? | ¿Para qué? |
|---------|-------------|----------|------------|
| `make mcp-dev` | `uv run mcp dev server.py` | Servidor + **Inspector** (UI en el navegador) | Depurar / probar tools a mano |
| `make mcp-run` | `uv run mcp run server.py` | Solo el servidor (stdio) | Como lo usaría Cursor en local |
| `make mcp-http` | `MCP_TRANSPORT=streamable-http … python server.py` | Solo el servidor (HTTP en `/mcp`) | Probar modo “desplegado” en local |
| (directo) | `uv run python server.py` | Solo el servidor (stdio por defecto) | El proceso real, sin CLI `mcp` |

##### Imagen mental

```text
                    ┌─────────────────────────┐
                    │   CLIENTES (hablan MCP) │
                    ├─────────────────────────┤
  mcp dev  ───────► │  Inspector (navegador)  │  ← visual, para ti
  Cursor   ───────► │  Agente de Cursor       │  ← cliente real en el día a día
  URL/HTTP ───────► │  Cliente remoto         │
                    └───────────┬─────────────┘
                                │ protocolo MCP
                    ┌───────────▼─────────────┐
                    │      server.py          │  ← ÚNICA lógica de negocio
                    └─────────────────────────┘
```

Analogía rápida (como una API Flask):

- `server.py` → el servidor  
- `mcp dev` (Inspector) → el “Postman” visual  
- Cursor → el cliente real  

Detalles útiles:

- **`mcp dev`**: abre una consola visual y, detrás, arranca tu `server.py`. Necesita `npx` (la UI es una app Node).
- **`python server.py` / `mcp run`**: el proceso espera mensajes por stdin. Si lo lanzas a mano en la terminal **parece colgado**: es normal; está esperando a un cliente (Cursor). No es una web.
- **HTTP** (`make mcp-http`): el mismo `server.py`, pero escuchando en un puerto (`http://127.0.0.1:8000/mcp`) en vez de stdin/stdout.

##### Qué usar cuándo

1. Entender / depurar tools a mano → `make mcp-dev`  
2. Que Cursor lo use en local → `mcp.json` con `command`/`args` (Cursor lanza el proceso; no hace falta dejarlo corriendo a mano)  
3. Probar modo deploy en local → `make mcp-http`  
4. Producción → Railway con `streamable-http` + `url` en el `mcp.json`

#### Config del cliente apuntando al remoto

En `exercises/MCP/.mcp.json` (ejemplo en esta carpeta del monorepo) tenemos algo así:

```json
{
  "mcpServers": {
    "outreach-railway": {
      "url": "https://mcp-test-production-303973cb.up.railway.app/mcp"
    }
  }
}
```

Eso le dice a Cursor: “no lances un proceso local; habla con esta URL”.

#### Config del cliente apuntando a local

Para un MCP **local** (stdio), Cursor no “adivina” que existe un `server.py`.  
Tienes que **registrarlo** en un `mcp.json` con el comando que lo arranca.

Ejemplo de MCP local para este mismo proyecto (stdio):

```json
{
  "mcpServers": {
    "outreach-local": {
      "command": "uv",
      "args": ["run", "python", "server.py"]
    }
  }
}
```

Qué significa cada campo:

| Campo | Rol |
|-------|-----|
| `outreach-local` | Nombre del servidor en Cursor (cómo lo verás en la UI / tools) |
| `command` | Ejecutable que Cursor lanza como proceso hijo |
| `args` | Argumentos: aquí “corre `server.py` con el entorno de `uv`” |

Variante para monorepo (workspace = raíz del bootcamp; el código está en `exercises/MCP`):

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

Si el workspace es solo la carpeta `exercises/MCP`, `${workspaceFolder}` ya apunta ahí y basta `["run", "python", "server.py"]` o `--directory` con `${workspaceFolder}`.

Diferencia clave respecto al remoto:

| | Local (stdio) | Remoto (HTTP) |
|--|---------------|---------------|
| Clave en JSON | `command` + `args` | `url` |
| Quién arranca el proceso | Cursor, al conectar el MCP | Railway (u otro host) ya lo tiene corriendo |
| Dónde vive el código | En tu máquina / este repo | En el servidor desplegado |

##### ¿Dónde puede vivir ese `mcp.json`?

Cursor lee la configuración MCP de archivos concretos. **No escanea el repo buscando servidores.**

| Ámbito | Ruta típica | Alcance |
|--------|-------------|---------|
| Proyecto | `.cursor/mcp.json` | Solo este workspace (se puede commitear para el equipo) |
| Global | `~/.cursor/mcp.json` | Todos tus proyectos en esa máquina |

Si el mismo nombre de servidor aparece en proyecto y en global, **gana el del proyecto**.

##### Idea que debe quedar clara

- Tener `server.py` en el disco **no** activa el MCP.  
- Hace falta un `mcp.json` (de proyecto o global) — o registrarlo por la UI de Cursor / marketplace — para que el agente sepa que existe y cómo arrancarlo.  
- Sin esa config, el agente **no** lo lee “siempre”: simplemente no lo ve.

---

### 1.6 Flujo mental que debe quedar claro

1. Escribes funciones normales de Python.  
2. Las marcas con decoradores MCP.  
3. Eliges transport (`stdio` o HTTP) según *dónde* vive el servidor.  
4. El cliente descubre tools/resources/prompts.  
5. La IA (o el usuario, en prompts) las usa.  
6. Tu función se ejecuta; el resultado vuelve al modelo.

En clase ya vimos ejemplos reales de ese ciclo:

- listar contactos  
- leer estados (`outreach://estados`)  
- usar el prompt `redactar_email`  

---

### 1.7 Checklist para el estudiante

Antes de dar por cerrada la Parte 1, deberías poder responder:

1. ¿Qué diferencia hay entre tool, resource y prompt?  
2. ¿Por qué el docstring de una tool importa tanto?  
3. ¿Qué problema resuelve el transport?  
4. ¿Cuándo usarías `stdio` y cuándo `streamable-http`?  
5. ¿Por qué en Railway ponemos `host="0.0.0.0"`?  
6. ¿Qué cambia en la config de Cursor entre local y remoto?

---

## Parte 2 — MCP “a mano” con Flask (el microscopio)

### 2.1 Objetivo pedagógico

En la Parte 1 usamos `MCPServer` y decoradores. La librería hace mucho trabajo invisible.

En la Parte 2 reimplementamos **el mismo outreach** en `server_flask.py` **sin** la librería `mcp`, para ver las capas:

```text
1. TRANSPORT     → cómo viajan los bytes: stdio / HTTP (aquí: HTTP simple con Flask)
2. PROTOCOLO     → forma de los mensajes: JSON-RPC: method + params + id (aquí: REST simplificado, no MCP oficial)
3. CAPACIDADES   → catálogos: tools / resources / prompts
4. NEGOCIO       → tu logica: CONTACTOS, estados, redactar_email (igual que server.py)
```

Cuando usamos un MCP sdk, solo tocamos la capa de negocio.

> **Importante:** este Flask **no** es un servidor MCP compatible con Cursor.  
> Es un microscopio: mismas *ideas* (descubrir + ejecutar/leer), otro cableado.  
> En producción seguirías usando el SDK (`server.py`).

Arranque:

```bash
make flask-demo
# http://127.0.0.1:5001
```

---

### 2.2 Lo que la librería MCP hace por ti (y aquí hacemos a mano)

| Lo que hace `MCPServer` | Cómo lo vemos en Flask |
|-------------------------|-------------------------|
| Generar el catálogo desde decoradores + type hints | Dicts manuales: `TOOLS_CATALOG`, `RESOURCES_CATALOG`, `PROMPTS_CATALOG` |
| Responder a `tools/list`, `resources/list`, `prompts/list` | `GET /tools`, `GET /resources`, `GET /prompts` |
| Ejecutar `tools/call` | `POST /tools/<nombre>` + body JSON |
| Leer `resources/read` | `GET /resources/outreach/estados` |
| Rellenar `prompts/get` | `GET /prompts/redactar_email?nombre=...&empresa=...` |
| Empaquetar el return en el formato del protocolo | `jsonify(...)` — **tú** conviertes Python → JSON |
| Errores recuperables (`ToolError`) | `ToolBusinessError` → HTTP 400 + `{"error": "..."}` |

---

### 2.3 Dos movimientos: descubrir y ejecutar/leer

Los dos movimientos que importan (**tools**):  
antes de ejecutar nada, el cliente necesita el **menú**. Luego pide el **plato**.

| Movimiento | Método MCP (idea) | Pregunta | Respuesta |
|------------|-------------------|----------|-----------|
| **Descubrir** | `tools/list` | ¿Qué tools tienes y con qué argumentos? | Nombre, descripción, schema JSON |
| **Ejecutar** | `tools/call` | Ejecuta `listar_contactos` con `{estado: "active"}` | Resultado (o error) |

Lo mismo existe para resources (`resources/list` + `resources/read`) y prompts (`prompts/list` + `prompts/get`).

Antes de usar una capacidad, el cliente necesita el **menú**. Luego pide el **contenido** o la **acción**.

#### Tools

```text
1) tools/list  →  GET  /tools
2) tools/call  →  POST /tools/listar_contactos
                 Body: {"estado": "active"}
```

- En el call, **`name`** = qué tool (en Flask va en la URL).  
- **`arguments`** = parámetros del schema (en Flask van en el body JSON).

Nueva tool ≈:

1. Función de negocio  
2. Una entrada nueva en `TOOLS_CATALOG`  

**No** hace falta un endpoint Flask nuevo: el dispatcher genérico ya existe (`POST /tools/<nombre>`).

#### Resources (solo lectura)

```text
1) resources/list  →  GET /resources
2) resources/read  →  GET /resources/outreach/estados
```

Un resource **no cambia datos**: solo informa (p.ej. significado de `active` / `bounced`).  
En MCP la URI es `outreach://estados`; en Flask usamos path `/resources/outreach/estados`.

#### Prompts (plantillas para el humano)

```text
1) prompts/list  →  GET /prompts
2) prompts/get   →  GET /prompts/redactar_email?nombre=Sergio&empresa=Acme
```

El prompt **no envía el email**: solo devuelve instrucciones para que el modelo redacte.

---

### 2.4 `request.args` vs `request.get_json()` (detalle Flask útil)

| | `request.args` | `request.get_json()` |
|--|----------------|----------------------|
| Dónde | URL (`?a=1&b=2`) | Body de la petición |
| Uso en el demo | prompts (GET) | tools (POST) |
| Ejemplo | `?nombre=Sergio&empresa=Acme` | `{"texto": "acme"}` |

Misma app Flask, dos “bandejas” de entrada distintas.

---

### 2.5 Errores legibles para la IA

En el MCP real: `raise ToolError("Estado inválido...")`.  
En Flask: `raise ToolBusinessError(...)` y el dispatcher responde **400** con JSON claro.

```python
try:
    resultado = meta["_fn"](**arguments)
except ToolBusinessError as exc:
    return jsonify({"error": str(exc)}), 400
except TypeError as exc:
    return jsonify({"error": str(exc)}), 400
```

Python elige el `except` según **la clase** del exception (no según el texto del mensaje):

- `raise ToolBusinessError(...)` → primer `except`  
- fallo de argumentos de Python → `TypeError` → segundo `except`

¿Por qué importa un mensaje claro? La IA lo lee, entiende qué falló y puede **corregir** (p.ej. usar un estado válido) o explicárselo al usuario. Un *stack trace* (volcado técnico archivo/línea) sirve al desarrollador, no tanto al modelo.

---

### 2.6 Paridad con `server.py`

| Capacidad | `server.py` (SDK) | `server_flask.py` |
|-----------|-------------------|-------------------|
| `listar_contactos` | `@mcp.tool()` | catálogo + `POST /tools/listar_contactos` |
| `buscar_contacto` | `@mcp.tool()` | catálogo + `POST /tools/buscar_contacto` |
| `cambiar_estado` | `@mcp.tool()` + `ToolError` | catálogo + `ToolBusinessError` |
| estados | `@mcp.resource("outreach://estados")` | `GET /resources/outreach/estados` |
| `redactar_email` | `@mcp.prompt()` | `GET /prompts/redactar_email?...` |

Misma capa de **negocio**. Cambia quién gestiona catálogo, transport y formato de respuesta.

---

### 2.7 Qué NO estamos imitando (a propósito)

Para no liar la clase:

- Protocolo MCP oficial completo (JSON-RPC, sesiones, streamable HTTP / SSE)  
- Compatibilidad con Cursor apuntando al Flask como si fuera un MCP real  
- `stdio` (Flask es HTTP)

El SDK (Starlette + uvicorn en modo HTTP) existe precisamente para no reimplementar eso.

---

### 2.8 Checklist Parte 2

1. ¿Qué capas oculta `MCPServer`?  
2. ¿Por qué añadir una tool no exige un endpoint nuevo en nuestro Flask?  
3. ¿Resource cambia datos o solo lee?  
4. ¿Quién convierte el `return` de Python a JSON: tú (Flask) o la librería (MCP)?  
5. ¿Para qué sirve un error 400 con mensaje claro frente a un 500 / stack trace?  
6. ¿Usarías este Flask en producción como MCP de Cursor? ¿Por qué sí/no?

---

### 2.9 Cierre de la clase (mensaje para llevarse)

- **MCP** = contrato estándar entre cliente de IA y tu código (tools / resources / prompts).  
- **Transport** = canal (`stdio` local vs HTTP remoto); no cambia el negocio.  
- **La librería** = catálogo + protocolo + empaquetado.  
- **Flask aquí** = microscopio para entender esas piezas, no el camino recomendado a producción.
