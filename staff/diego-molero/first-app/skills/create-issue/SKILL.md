### Herramienta: CREATE_ISSUE

- **Descripción**: Úsala única y exclusivamente para dejar la tarea escrita en GitHub. No la uses para abrir la rama ni la pull request.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Título** _(Obligatorio)_: Inglés, menos de 72 caracteres y empieza por un verbo, según la plantilla del tipo.
2. **Cuerpo** _(Obligatorio)_: Español. Rellena `templates/issues/<tipo>_issue.md`, con tipo feat, fix, docs, refactor, test o chore, conservando todas sus secciones. Si el tipo no está en la lista, elige el más cercano al cambio y úsalo también en la rama y la PR.
3. **Persona asignada** _(Obligatorio)_: El usuario autenticado en el MCP o en la CLI oficial.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Quédate con el número, el título y la URL. Si el MCP devuelve un error, comunícalo y no inventes el número.

La identidad, la consulta previa para evitar duplicados, la alternativa oficial gh y la verificación posterior siguen `MCPS/github-mcp-server/mcp.txt`. Un formulario abierto no acredita una escritura; si el MCP no ejecuta, comprueba antes el estado y usa esa alternativa sin cambiar tokens ni configuración personal.
