# Estructura del proyecto

```
first-app/
  README.md
  eslint.config.js
  src/
    db/server.js
    db/users.sqlite         local, fuera de Git
    queries/queries/        constantes SQL en módulos .js
      create-users-table.js, find-all.js, find-by-id.js
      find-by-email.js, find-by-name.js, insert.js
      list-tables.js, remove.js, update.js
    queries/users.js
    logic/                  una función de negocio por archivo
      create-user.js, update-user.js, delete-user.js
      list-users.js, find-user-by-email.js, find-user-by-id.js
      find-user-by-name.js
      users-gender-count.js
    clients/terminal/
    clients/jupyter/
    clients/browser/
      index.html
      app.js
      styles.css
    clients/http/
      app.js
    clients/electron/
      main.js
      index.html
      app.js
      styles.css
    clients/chrome/
      server.js
      manifest.json
      index.html
      popup.js
      styles.css
    clients/vscode/
      package.json
      extension.js
      index.html
      panel.js
      styles.css
  agents/                 orquestador y subagentes del flujo de Git
  skills/                 instrucciones reutilizables por momento
  tools/                  ocho scripts Bash originales del flujo de Git
    create-pr-base-staging.sh
  templates/
    issues/
      {feat,fix,docs,refactor,test,chore}_issue.md
    pull-request/
      {feat,fix,docs,refactor,test,chore}-pull-request.md
  MCPS/github-mcp-server/
  MCPS/socket-mcp/mcp.txt  referencia del MCP remoto con OAuth
  AGENTS.md
  docs/
    CONSTITUTIONS.md
    ARCHITECTURE.md
    TREE.md
    DATABASE.md
    ERRORS.md
    STYLE.md
    JUPYTER.md
    GIT-AUTOMATION.md
    SOCKET.md             consulta PURL y alertas por versión
    specs/<nombre>/       spec.md, plan.md y tasks.md
    specs/express-rest-client/
      spec.md, plan.md, tasks.md, verification.md, bruno.md
      bruno/              peticiones ficticias para Bruno en VS Code
    specs/host-sql-on-node-server/
      spec.md, plan.md, tasks.md, verification.md
```
