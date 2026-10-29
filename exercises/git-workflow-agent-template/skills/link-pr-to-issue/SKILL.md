### Herramienta: LINK_PR_TO_ISSUE

- **Descripción**: Úsala desde el orquestador, después de `create-pr`, para dejar `Related to #N` en el cuerpo de la pull request. `create-pr` no la llama: puede abrir la pull request sin issue. No la uses para abrir la pull request ni para cambiar la base. No cierres la issue: no escribas `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves` ni `resolved`.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`. No uses `gh` ni un script de `tools/`.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: La URL o el número de la pull request que acaba de abrirse.
2. **Issue** _(Obligatorio)_: El número de la issue. En la sección Issue del cuerpo tiene que quedar la línea `Related to #N`.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Conserva el resto del cuerpo en español. Si `Related to #N` ya está, no lo dupliques. Si aparece una palabra de cierre junto al número, sustitúyela por `Related to #N`. Si el MCP falla, comunica el error.
