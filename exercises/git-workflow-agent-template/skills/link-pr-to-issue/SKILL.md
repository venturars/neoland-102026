### Herramienta: LINK_PR_TO_ISSUE

- **Descripción**: Úsala desde el orquestador, después de `create-pr`, para dejar `Related to #N` en el cuerpo y enlazar la issue en Development. `create-pr` no la llama: puede abrir la pull request sin issue. No la uses para abrir la pull request ni para cambiar la base. No cierres la issue: no escribas `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves` ni `resolved`.
- **MCP**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt` actualiza el cuerpo. El enlace de Development es la mutación GraphQL de abajo. No uses un script de `tools/`.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: La URL o el número de la pull request que acaba de abrirse.
2. **Issue** _(Obligatorio)_: El número de la issue. En la sección Issue del cuerpo tiene que quedar la línea `Related to #N`.

#### Reglas de Invocación Críticas

- **Cuerpo**: Conserva el resto del cuerpo en español. Si `Related to #N` ya está, no lo dupliques. Si aparece una palabra de cierre junto al número, sustitúyela por `Related to #N`.
- **Development**: Toma el id de nodo de la issue y el de la pull request. Llama a `addCloseIssueReferences`. Eso es la barra Development. `issueId` es el id de la issue. `pullRequestIds` lleva el id de la pull request.

```graphql
mutation {
  addCloseIssueReferences(
    input: {
      issueId: "ID_DE_LA_ISSUE"
      pullRequestIds: ["ID_DE_LA_PULL_REQUEST"]
    }
  ) {
    issue {
      number
    }
  }
}
```

La base de estas pull request es `staging`. La rama por defecto del repositorio es `main`. Fusionar en `staging` no cierra la issue.

- **Si falla**: Comunica el error. No inventes el enlace.
