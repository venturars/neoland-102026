### Herramienta: LINK_PR_TO_ISSUE

- **Descripción**: Úsala desde el orquestador, después de `create-pr`, para dejar `Closes #N` en el cuerpo y enlazar la issue en Development. `create-pr` no la llama: puede abrir la pull request sin issue. No la uses para abrir la pull request ni para cambiar la base. No cierres la issue mediante la API. La línea `Closes #N` declara el cierre al integrarse en la rama por defecto; no cambia la base staging.
- **Cuerpo**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt` actualiza el cuerpo. No uses un script de `tools/`.
- **Development**: `gh api graphql`. No uses el MCP para este enlace.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: La URL o el número de la pull request que acaba de abrirse.
2. **Issue** _(Obligatorio)_: El número de la issue. En la sección Issue del cuerpo tiene que quedar la línea `Closes #N`.

#### Reglas de Invocación Críticas

- **Cuerpo**: Conserva el resto del cuerpo en español. Si `Closes #N` ya está, no lo dupliques. Si aparece `Related to #N` en la sección Issue, sustitúyelo por `Closes #N` conservando el resto del cuerpo.
- **Development**: Lee el id de nodo de la issue y el de la pull request con `gh`. Luego llama a `addCloseIssueReferences`. Eso es la barra Development. `issueId` es el id de la issue. `pullRequestIds` lleva el id de la pull request.

Los ids:

```
gh api graphql -f query='query($owner:String!,$name:String!,$issue:Int!,$pr:Int!) { repository(owner:$owner, name:$name) { issue(number:$issue) { id } pullRequest(number:$pr) { id } } }' -f owner=OWNER -f name=REPO -F issue=N -F pr=M
```

El enlace:

```
gh api graphql -f query='mutation($issueId:ID!,$pullRequestId:ID!) { addCloseIssueReferences(input:{issueId:$issueId, pullRequestIds:[$pullRequestId]}) { issue { number } } }' -f issueId=ID_DE_LA_ISSUE -f pullRequestId=ID_DE_LA_PULL_REQUEST
```

La base de estas pull request es `staging`. La rama por defecto del repositorio es `main`. Fusionar en `staging` no cierra la issue.

- **Si falla**: Comunica el error. No inventes el enlace.

Confirma primero que el repositorio tiene main como rama por defecto y que la PR apunta a staging. Lee el enlace existente antes de mutar y verifica por lectura posterior el número de issue, la PR relacionada y el estado abierto. Si ya está relacionado, no dupliques la operación. Si falta una capacidad, informa de cuál de los dos enlaces quedó pendiente.

Si la herramienta exige confirmación, espera a que se complete por su interfaz. Una tarjeta inaccesible o un permiso ausente es un bloqueo; no sustituyas MCP por gh ni desactives confirmaciones. La única excepción de herramienta prevista es el enlace Development por gh descrito en su skill.
