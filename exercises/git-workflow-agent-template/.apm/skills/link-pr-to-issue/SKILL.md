---
name: link-pr-to-issue
description: "Deja Related to #N en el cuerpo de la pull request y la enlaza con la issue en Development sin cerrarla. Úsala desde el orquestador git-workflow después de create-pr."
---

### Herramienta: LINK_PR_TO_ISSUE

- **Descripción**: Úsala desde el orquestador, después de `create-pr`, para dejar `Related to #N` en el cuerpo y enlazar la issue en Development. `create-pr` no la llama: puede abrir la pull request sin issue. No la uses para abrir la pull request ni para cambiar la base. No cierres la issue: no escribas `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves` ni `resolved`.
- **Cuerpo**: El servidor MCP `github`, declarado en `apm.yml`, actualiza el cuerpo. No uses un script.
- **Development**: `gh api graphql`. No uses el MCP para este enlace.

#### Especificación de Argumentos

1. **Pull request** _(Obligatorio)_: La URL o el número de la pull request que acaba de abrirse.
2. **Issue** _(Obligatorio)_: El número de la issue. En la sección Issue del cuerpo tiene que quedar la línea `Related to #N`.

#### Reglas de Invocación Críticas

- **Cuerpo**: Conserva el resto del cuerpo en español. Si `Related to #N` ya está, no lo dupliques. Si aparece una palabra de cierre junto al número, sustitúyela por `Related to #N`.
- **Cuándo enlazar en Development**: El enlace de Development cierra la issue cuando la pull request se fusiona en la rama por defecto del repositorio. Mira la rama por defecto con `gh repo view --json defaultBranchRef -q .defaultBranchRef.name`. Si la base de la pull request es otra rama (por ejemplo `staging` cuando la rama por defecto es `main`), enlaza: fusionar no cierra la issue. Si la base es la rama por defecto, no enlaces en Development: deja solo `Related to #N` y dilo.
- **Development**: Lee el id de nodo de la issue y el de la pull request con `gh`. Luego llama a `addCloseIssueReferences`. Eso es la barra Development. `issueId` es el id de la issue. `pullRequestIds` lleva el id de la pull request. `OWNER` y `REPO` salen de `gh repo view --json owner,name`.

Los ids:

```
gh api graphql -f query='query($owner:String!,$name:String!,$issue:Int!,$pr:Int!) { repository(owner:$owner, name:$name) { issue(number:$issue) { id } pullRequest(number:$pr) { id } } }' -f owner=OWNER -f name=REPO -F issue=N -F pr=M
```

El enlace:

```
gh api graphql -f query='mutation($issueId:ID!,$pullRequestId:ID!) { addCloseIssueReferences(input:{issueId:$issueId, pullRequestIds:[$pullRequestId]}) { issue { number } } }' -f issueId=ID_DE_LA_ISSUE -f pullRequestId=ID_DE_LA_PULL_REQUEST
```

- **Si falla**: Comunica el error. No inventes el enlace. Si `gh` no está instalado o no tiene sesión, dilo y deja solo `Related to #N`.
