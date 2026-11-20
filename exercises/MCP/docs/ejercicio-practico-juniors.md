# Mini ejercicio práctico — Outreach MCP

Para estudiantes junior. Tiempo orientativo: **30–45 min**.

Usa este repo: `server.py` (MCP real) y, si quieres comparar, `server_flask.py` (microscopio).

Antes de empezar, lee al menos la Parte 1 de `docs/clase-mcp-outreach.md` (y la 2 si ya la viste en clase).

---

## Objetivo

Demostrar que entiendes:

1. tools / resources / prompts  
2. listar vs llamar  
3. errores recuperables  
4. config local (`stdio`) vs HTTP  

---

## Preparación (5 min)

```bash
make sync
```

Elige **una** forma de probar (la que indique el instructor):

| Opción | Cómo |
|--------|------|
| A — Inspector | `make mcp-dev` |
| B — Cursor + MCP local | Configura `.cursor/mcp.json` con `command`/`args` y `--directory` a `exercises/MCP` si el workspace es el monorepo (ver README) |
| C — Flask microscopio | `make flask-demo` + `curl` |

---

## Parte A — Explorar (10 min)

Responde por escrito (en un fichero o en el chat de la clase):

1. Lista las **tools** disponibles. Anota nombre + un parámetro de cada una.  
2. Lee el **resource** de estados. ¿Qué estados existen?  
3. ¿Un resource cambia datos? ¿Sí o no, y por qué?

---

## Parte B — Usar tools (10 min)

1. Lista solo los contactos con estado `prospect`.  
2. Busca un contacto con el texto `globex`.  
3. Cambia el estado de `ana@acme.com` a `active`. Verifica listando de nuevo.  
4. Intenta cambiar un estado a `zzz`.  
   - ¿Qué mensaje recibes?  
   - ¿Qué haría una IA con ese mensaje?

---

## Parte C — Prompt (5 min)

1. Invoca (o simula) el prompt `redactar_email` con:
   - `nombre`: el tuyo  
   - `empresa`: una inventada  
2. ¿El prompt envió un email real? Explica en una frase qué devolvió realmente.

---

## Parte D — Local vs remoto (5 min)

Sin desplegar nada, responde:

1. Si Cursor usa `command` + `args`, ¿quién arranca `server.py`?  
2. Si Cursor usa `"url": "https://.../mcp"`, ¿quién arranca el proceso?  
3. ¿Basta con tener `server.py` en el disco, sin `mcp.json`, para que el agente vea las tools? ¿Por qué?

---

## Extra (opcional) — Flask

Con `make flask-demo`:

```bash
# menú de tools
curl -s http://127.0.0.1:5001/tools | python3 -m json.tool

# call
curl -s -X POST http://127.0.0.1:5001/tools/buscar_contacto \
  -H 'Content-Type: application/json' \
  -d '{"texto":"ana"}' | python3 -m json.tool

# resource
curl -s http://127.0.0.1:5001/resources/outreach/estados | python3 -m json.tool
```

Pregunta extra: ¿este Flask lo puede usar Cursor como MCP “de verdad”? ¿Por qué?

---

## Entrega sugerida

Un mensaje corto con:

- Respuestas A–D (y extra si aplica)  
- Captura o pegado de **un** resultado de tool y **un** error `zzz`  
- Una frase: “La librería MCP me ahorra ___ porque ___.”

---

## Criterio de “aprobado”

| Criterio | OK si… |
|----------|--------|
| Vocabulario | Distingue tool / resource / prompt |
| Flujo | Sabe que el cliente descubre capacidades y luego las usa |
| Errores | Explica por qué un mensaje claro ayuda a la IA |
| Config | Entiende `mcp.json` local vs `url` HTTP |
