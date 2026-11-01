# Enlazar la issue

Úsala desde el orquestador, después de abrir la pull request. `agents/create-pr.md` no la llama.

En la sección Issue del cuerpo deja la línea `Related to #N`. No escribas `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves` ni `resolved`. El enlace no cierra la issue.

La barra Development se hace con `gh api graphql`. La base de estas pull request es `staging`. La rama por defecto del repositorio es `main`, así que fusionar en `staging` no cierra la issue.

Los ids:

```
gh api graphql -f query='query($owner:String!,$name:String!,$issue:Int!,$pr:Int!) { repository(owner:$owner, name:$name) { issue(number:$issue) { id } pullRequest(number:$pr) { id } } }' -f owner=OWNER -f name=REPO -F issue=N -F pr=M
```

El enlace:

```
gh api graphql -f query='mutation($issueId:ID!,$pullRequestId:ID!) { addCloseIssueReferences(input:{issueId:$issueId, pullRequestIds:[$pullRequestId]}) { issue { number } } }' -f issueId=ID_DE_LA_ISSUE -f pullRequestId=ID_DE_LA_PULL_REQUEST
```

Si falla, dilo. No inventes el enlace.
