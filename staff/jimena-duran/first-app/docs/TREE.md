# Estructura del proyecto

```
first-app/
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
  agents/                 orquestador y subagentes del flujo de Git
  skills/                 instrucciones reutilizables por momento
  tools/                  siete scripts Bash originales del flujo de Git
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
    specs/host-sql-on-node-server/
      spec.md, plan.md, tasks.md, verification.md
```
