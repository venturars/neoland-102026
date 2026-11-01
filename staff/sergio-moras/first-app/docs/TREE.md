# Árbol

Los ficheros de hoy, sin `node_modules/` ni `db/users.sqlite`, que no están en git.

```
first-app/
  AGENTS.md            cómo trabaja el agente
  package.json         dependencias y scripts format y lint
  pnpm-lock.yaml
  eslint.config.js
  .gitignore
  .gitattributes       finales de línea LF en los .js
  db/
    connection.js
  queries/
    users.js
  logic/
    classify-gender.js
    create-user.js
    delete-user.js
    find-user-by-email.js
    list-users.js
    update-user.js
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
