### Herramienta: CREATE_DRAFT

- **Descripción**: Pasa una pull request a draft.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Pull request** : El número o la URL de la pull request de la rama actual.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Confirma el estado draft. Si ya está en draft, conserva ese estado. Si no existe, comunica el error.
