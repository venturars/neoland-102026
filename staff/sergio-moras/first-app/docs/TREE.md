# Árbol

Los ficheros de hoy, sin `node_modules/` ni `db/users.sqlite`, que no están en git.

```
first-app/
  AGENTS.md            cómo trabaja el agente
  package.json         dependencias y scripts format y lint
  pnpm-lock.yaml
  eslint.config.js
  .gitignore
  db/
    connection.js
  queries/
    users.js
  logic/
    classifyGender.js
    createUser.js
    deleteUser.js
    findUserByEmail.js
    listUsers.js
    updateUser.js
  clients/
    terminal/          un .txt por operación
    jupyter/           un .ipynb por operación
  docs/
    CONSTITUTIONS.md
    ARCHITECTURE.md
    TREE.md
    DATABASE.md
    ERRORS.md
    STYLE.md
    specs/             spec, plan y tasks de cada tarea
  agents/              flujo de git: un agente por momento
  skills/              flujo de git: una acción por skill
  tools/               flujo de git: scripts de bash
  templates/           plantillas de issue y de pull request
  MCPS/                referencia de los MCP de GitHub y de Socket
```

Qué hace cada fichero de la app: [ARCHITECTURE.md](ARCHITECTURE.md).
