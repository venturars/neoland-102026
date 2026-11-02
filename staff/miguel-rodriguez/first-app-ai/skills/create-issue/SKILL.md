### Herramienta: CREATE_ISSUE

- **Descripción**: Úsala única y exclusivamente para dejar la tarea escrita en GitHub. No la uses para abrir la rama ni la pull request.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`. No uses `gh` ni un script de `tools/`.

#### Especificación de Argumentos

1. **Título** _(Obligatorio)_: Inglés, menos de 72 caracteres.
2. **Cuerpo** _(Obligatorio)_: Español. Rellena `templates/issues/basic_issue.md` con «Qué hay que hacer» y «Cómo probarlo».
3. **Persona asignada** _(Obligatorio)_: El usuario autenticado en el MCP.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Quédate con el número, el título y la URL. Si el MCP devuelve un error, comunícalo y no inventes el número.

Antes de crear, busca issues de esta tarea en el repositorio confirmado. Reutiliza una coincidencia inequívoca, incluida la issue que llega explícitamente en el encargo; si hay ambigüedad, devuelve la pregunta sin publicar. Tras un error o respuesta incompleta, comprueba si la issue llegó a crearse antes de reintentar. Lee el usuario autenticado y verifica la asignación real. No inventes la URL.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
