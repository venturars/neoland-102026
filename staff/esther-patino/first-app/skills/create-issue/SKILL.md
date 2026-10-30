### Herramienta: CREATE_ISSUE

- **Descripción**: Úsala única y exclusivamente para dejar la tarea escrita en GitHub. No la uses para abrir la rama ni la pull request.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`. No uses `gh` ni un script de `tools/`.

#### Especificación de Argumentos

1. **Título** _(Obligatorio)_: El título. La forma está en la plantilla del tipo.
2. **Cuerpo** _(Obligatorio)_: Español. Rellena la plantilla del tipo en `templates/issues/`, con «Qué hay que hacer» y «Cómo probarlo». Si el tipo no tiene plantilla, usa la más cercana.
3. **Persona asignada** _(Obligatorio)_: El usuario autenticado en el MCP.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Quédate con el número, el título y la URL. Si el MCP devuelve un error, comunícalo y no inventes el número.
