# Enlazar la issue

Úsala desde el orquestador, después de abrir la pull request. `agents/create-pr.md` no la llama.

En la sección Issue del cuerpo deja la línea `Closes #N`, una sola vez. No cierres la issue con la API.

Antes de decir si el merge la cierra, mira la rama por defecto real del repositorio. El 3 de noviembre de 2026 esa rama es `staging`, así que fusionar la pull request en `staging` cierra la issue. Si la rama por defecto fuera otra, fusionar en `staging` no la cerraría. No cambies la rama por defecto ni la base para forzar el cierre. La base sigue siendo `staging`.

La barra Development se hace con `gh api graphql`.

Los ids:

```
gh api graphql -f query='query($owner:String!,$name:String!,$issue:Int!,$pr:Int!) { repository(owner:$owner, name:$name) { issue(number:$issue) { id } pullRequest(number:$pr) { id } } }' -f owner=OWNER -f name=REPO -F issue=N -F pr=M
```

El enlace:

```
gh api graphql -f query='mutation($issueId:ID!,$pullRequestId:ID!) { addCloseIssueReferences(input:{issueId:$issueId, pullRequestIds:[$pullRequestId]}) { issue { number } } }' -f issueId=ID_DE_LA_ISSUE -f pullRequestId=ID_DE_LA_PULL_REQUEST
```

Si Development ya está enlazado, no repitas la mutación. Si falla, dilo. No inventes el enlace.
