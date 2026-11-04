### Herramienta: CREATE_PR_BASE_STAGING

- **Descripción**: Úsala desde el agente `create-pr` para abrir la pull request con base `staging`. No la uses para enlazar la issue: eso es `link-pr-to-issue`. No la uses para dejarla en draft: eso es `create-draft`.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

Fuente de la forma del cuerpo: [github-pr](https://www.skills.sh/gentleman-programming/gentleman-skills/github-pr), adaptada a esta plantilla. La base es `staging` y la descripción va en español.

#### Especificación de Argumentos

1. **Base** _(Obligatorio)_: `staging`.
2. **Cabeza** _(Obligatorio)_: La rama que acaba de subirse.
3. **Título** _(Obligatorio)_: El título de la issue.
4. **Cuerpo** _(Obligatorio)_: Español, con la plantilla del tipo en `templates/pull-request/`. La sección Issue se deja vacía. Si el tipo no tiene plantilla, usa la más cercana.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si ya hay una pull request de esa rama hacia `staging`, actualiza esa. No abras otra. Devuelve la URL. Si el MCP falla, comunica el error y no inventes el enlace.
