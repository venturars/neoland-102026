### Herramienta: ASSIGN_REVIEWERS

- **Descripción**: Úsala cuando el alumno nombra a quienes tienen que mirar la pull request. Resuelve el login dentro de este repositorio, asigna esos logins y sácala de draft. No la uses para asignar al autor.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: El número o la URL.
2. **Revisores** _(Obligatorio)_: Los nombres que dijo el alumno, separados por comas.

#### Reglas de Invocación Críticas

- **Login**: Resolver cada nombre entre colaboradores o autores de commits del repositorio. No elegir candidatos públicos ajenos ni coincidencias ambiguas.
- **Si no hay login de colaborador**: Dilo y no pidas la revisión de ese nombre.
- **Procesamiento de respuestas**: Quita al autor de la lista si aparece. Deja la pull request lista para revisión. Si el MCP falla, comunica el error y no marques la revisión como pedida.

La identidad, la consulta previa para evitar duplicados, la alternativa oficial gh y la verificación posterior siguen `MCPS/github-mcp-server/mcp.txt`. Un formulario abierto no acredita una escritura; si el MCP no ejecuta, comprueba antes el estado y usa esa alternativa sin cambiar tokens ni configuración personal.
