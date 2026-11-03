### Herramienta: CREATE_ISSUE

- **Descripción**: Úsala única y exclusivamente para dejar la tarea escrita en GitHub. No la uses para abrir la rama ni la pull request.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Título** _(Obligatorio)_: Inglés, menos de 72 caracteres.
2. **Cuerpo** _(Obligatorio)_: Español. Rellena `templates/issues/basic_issue.md` con «Qué hay que hacer» y «Cómo probarlo».
3. **Persona asignada** _(Obligatorio)_: El usuario autenticado en el MCP o en la CLI oficial.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Quédate con el número, el título y la URL. Si el MCP devuelve un error, comunícalo y no inventes el número.

La identidad, la consulta previa para evitar duplicados, la alternativa oficial gh y la verificación posterior siguen `MCPS/github-mcp-server/mcp.txt`. Un formulario abierto no acredita una escritura; si el MCP no ejecuta, comprueba antes el estado y usa esa alternativa sin cambiar tokens ni configuración personal.
