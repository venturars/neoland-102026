### Herramienta: LINK_PR_TO_ISSUE

- **Descripción**: Úsala desde el orquestador, después de `create-pr`, para dejar `Closes #N` en el cuerpo y enlazar la issue en Development. `create-pr` no la llama: puede abrir la pull request sin issue. No la uses para abrir la pull request ni para cambiar la base. Este paso deja la issue abierta. La issue se cierra cuando la pull request se fusiona.
- **Cuerpo**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt` actualiza el cuerpo. No uses un script de `tools/`.
- **Development**: `gh api graphql`. No uses el MCP para este enlace.
- **Cierre**: El mismo servidor remoto cierra la issue. Solo cuando la pull request ya está fusionada. No uses un script de `tools/`.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: La URL o el número de la pull request.
2. **Issue** _(Obligatorio)_: El número de la issue. En la sección Issue del cuerpo tiene que quedar la línea `Closes #N`.

#### Reglas de Invocación Críticas

- **Cuerpo**: Conserva el resto del cuerpo en español. Si `Closes #N` ya está, no lo dupliques. Si aparece `Related to #N` u otra línea con ese número, sustitúyela por `Closes #N`.
- **Estado al enlazar**: La pull request acaba de abrirse y sigue abierta. No cambies el estado de la issue. No la cierres en este paso.
- **Development**: Lee el id de nodo de la issue y el de la pull request con `gh`. Luego llama a `addCloseIssueReferences`. Eso es la barra Development. `issueId` es el id de la issue. `pullRequestIds` lleva el id de la pull request.

Los ids:

```
gh api graphql -f query='query($owner:String!,$name:String!,$issue:Int!,$pr:Int!) { repository(owner:$owner, name:$name) { issue(number:$issue) { id } pullRequest(number:$pr) { id } } }' -f owner=OWNER -f name=REPO -F issue=N -F pr=M
```

El enlace:

```
gh api graphql -f query='mutation($issueId:ID!,$pullRequestId:ID!) { addCloseIssueReferences(input:{issueId:$issueId, pullRequestIds:[$pullRequestId]}) { issue { number } } }' -f issueId=ID_DE_LA_ISSUE -f pullRequestId=ID_DE_LA_PULL_REQUEST
```

`Closes #N` y la barra Development dejan el cierre para la fusión. La base de estas pull request es `staging`. La rama por defecto del repositorio es `main`. GitHub cierra la issue al fusionar en `main`. Fusionar en `staging` deja la issue abierta.

- **Cuando la pull request ya está fusionada**: Si la issue sigue abierta, ciérrala con motivo `completed`. Si GitHub ya la cerró, no hagas nada.
- **Si falla**: Comunica el error. No inventes el enlace.
