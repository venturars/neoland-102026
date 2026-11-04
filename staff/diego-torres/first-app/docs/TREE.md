# Árbol

```
first-app/
  AGENTS.md
  package.json
  eslint.config.js
  scripts/
    jupyter.js
    browser.js
  src/
    db/
      server.js           (todo el servidor de datos)
      users.sqlite        (no está en git)
    queries/
      users.js
      queries/            (un .js por consulta)
    logic/
      index.js
      shared.js
      create-user.js
      update-user.js
      delete-user.js
      list-users.js
      find-user-by-id.js
      find-user-by-email.js
      find-user-by-name.js
      users-gender-count.js
    clients/
      web/                (index.html, styles.css y un .js por función)
      electron/           (main.js, index.html, styles.css y un .js por función)
      terminal/           (un .txt por operación)
      jupyter/            (un .ipynb por operación)
  docs/
    CONSTITUCION.md
    ARCHITECTURE.md
    DATABASE.md
    ERRORS.md
    STYLE.md
    TREE.md
    specs/
      <nombre>/
        spec.md
        plan.md
        tasks.md
  agents/
  skills/
  tools/
  templates/
  MCPS/
```
