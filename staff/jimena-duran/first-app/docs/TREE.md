# Estructura del proyecto

```
first-app/
  eslint.config.js
  src/
    db/connection.js
    db/users.sqlite         local, fuera de Git
    queries/queries/
    queries/users.js
    logic/                  una función de negocio por archivo
      create-user.js, update-user.js, delete-user.js
      list-users.js, find-user-by-email.js, find-user-by-id.js
      find-users-by-name.js
      users-gender-count.js
    clients/terminal/
    clients/jupyter/
    clients/http/
      create-user-client-server.js
      start-user-client.js
    clients/web/
      index.html
      styles.css
      app.js
  tests/
    vanilla-user-client.test.js
  agents/                 orquestador y subagentes del flujo de Git
  skills/                 instrucciones reutilizables por momento
  tools/                  herramientas PowerShell
    tests/                comprobación aislada del flujo de Git
  templates/
    issues/
      {feat,fix,docs,refactor,test,chore}_issue.md
    pull-request/
      {feat,fix,docs,refactor,test,chore}-pull-request.md
  MCPS/github-mcp-server/
  AGENTS.md
  docs/
    CONSTITUTIONS.md
    ARCHITECTURE.md
    TREE.md
    DATABASE.md
    ERRORS.md
    STYLE.md
    JUPYTER.md
    VANILLA-CLIENT.md
    GIT-AUTOMATION.md
    specs/<nombre>/       spec.md, plan.md y tasks.md
```
