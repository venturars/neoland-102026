### Herramienta: ASSIGN_REVIEWERS

- **Descripción**: Úsala al empezar, después de enlazar la issue. Los revisores de esta app son Miguel (`mglnglxx`) y Jimena (`jiji-mena`). No la uses para asignar al autor.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: El número o la URL.
2. **Revisores** _(Obligatorio)_: `mglnglxx` y `jiji-mena`.

#### Reglas de Invocación Críticas

- **Login**: Pide la revisión a esos dos logins. No elijas a otra persona.
- **Procesamiento de respuestas**: Quita a quien abre la pull request si aparece en la lista. Deja la pull request lista para revisión. Si el MCP falla, comunica el error y no marques la revisión como pedida.
