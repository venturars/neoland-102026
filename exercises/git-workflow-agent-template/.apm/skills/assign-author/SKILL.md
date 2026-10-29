### Herramienta: ASSIGN_AUTHOR

- **Descripción**: Úsala única y exclusivamente para asignar la issue o la pull request al usuario autenticado en el MCP. No la uses para asignar revisores.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Objetivo** _(Obligatorio)_: El número de la issue o de la pull request.
2. **Persona** _(Obligatorio)_: El login del usuario autenticado. No escribas otro nombre.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Confirma el login que quedó asignado. Si el MCP falla, comunica el error y no inventes el autor.
