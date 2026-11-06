### Herramienta: CREATE_DRAFT

- **Descripción**: Úsala desde el agente `create-pr` para pasar a draft una pull request que ya existía. No la uses para crearla: `create-pr-base-staging` ya la abre en draft. No la uses para pedir revisión.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt`.

#### Especificación de Argumentos

1. **Pull request** : El número o la URL de la pull request de la rama actual.

#### Reglas de Invocación Críticas

- **Procesamiento de respuestas**: Si ya está en draft, no la cambies. Si está lista para revisión, devuélvela a draft. Si no existe, dilo y no crees una.
