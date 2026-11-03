### Herramienta: LINK_PR_TO_ISSUE

- **Descripción**: Úsala desde el orquestador, después de `create-pr`, para dejar `Closes #N` en el cuerpo y enlazar la issue en Development. `create-pr` no la llama: puede abrir la pull request sin issue. No la uses para abrir la pull request ni para cambiar la base. No cierres la issue tú: no llames a la API para cerrarla. La línea `Closes #N` de la plantilla de la pull request es el cierre.
- **Cuerpo**: El servidor remoto descrito en `MCPS/github-mcp-server/mcp.txt` actualiza el cuerpo. El header de ese fichero va en mcp.json. Si falta, añádelo antes de llamar. No uses un script de `tools/`.
- **Development**: `gh api graphql`. No uses el MCP para este enlace.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: La URL o el número de la pull request que acaba de abrirse.
2. **Issue** _(Obligatorio)_: El número de la issue. En la sección Issue del cuerpo tiene que quedar la línea `Closes #N`.

#### Reglas de Invocación Críticas

- **Cuerpo**: Conserva el resto del cuerpo en español. Si `Closes #N` ya está, no lo dupliques. Si la sección Issue tiene `Related to #N` u otra línea suelta con el número, sustitúyela por `Closes #N`.
- **Development**: Lee el id de nodo de la issue y el de la pull request con `gh`. Luego llama a `addCloseIssueReferences`. Eso es la barra Development. `issueId` es el id de la issue. `pullRequestIds` lleva el id de la pull request.

Los ids:

```
gh api graphql -f query='query($owner:String!,$name:String!,$issue:Int!,$pr:Int!) { repository(owner:$owner, name:$name) { issue(number:$issue) { id } pullRequest(number:$pr) { id } } }' -f owner=OWNER -f name=REPO -F issue=N -F pr=M
```

El enlace:

```
gh api graphql -f query='mutation($issueId:ID!,$pullRequestId:ID!) { addCloseIssueReferences(input:{issueId:$issueId, pullRequestIds:[$pullRequestId]}) { issue { number } } }' -f issueId=ID_DE_LA_ISSUE -f pullRequestId=ID_DE_LA_PULL_REQUEST
```

No cierres la issue ahora. GitHub la cierra al fusionar la pull request que lleva `Closes #N` en la rama por defecto. La base de estas pull request es `staging`. Si la rama por defecto sigue siendo `main`, fusionar en `staging` no la cierra.

- **Si falla**: Comunica el error. No inventes el enlace.
