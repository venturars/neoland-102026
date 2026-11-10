# Árbol

Los ficheros de hoy, sin `node_modules/` ni `src/db/users.sqlite`, que no están en git.

```
first-app/
  AGENTS.md            cómo trabaja el agente
  package.json         dependencias y scripts format, lint, db, browser, api, electron, chrome y vscode
  pnpm-lock.yaml
  eslint.config.js
  .gitignore
  .gitattributes       finales de línea LF en los .js
  src/                 el código de la app
    db/
      connection.js
      server.js        el servidor de la base
    queries/
      users-sql.js     el SQL, una consulta por nombre
      users.js
    logic/
      classify-gender.js
      create-user.js
      delete-user.js
      find-user-by-email.js
      find-user-by-name.js
      list-users.js
      update-user.js
    clients/
      terminal/        un .txt por operación
      jupyter/         un .ipynb por operación
      browser/         index.html, styles.css y app.js, que se abren desde el disco
      rest/
        server.js      la API REST, con Express
      electron/
        main.js        abre la ventana de escritorio
        index.html, styles.css y app.js   las pantallas de la ventana
      chrome/
        server.js      la API de la extensión, con Fastify
        extension/     manifest.json, popup.html, styles.css y popup.js: lo que carga Chrome
      vscode/
        package.json   el manifiesto de la extensión de VS Code
        extension.js   registra el panel y llama a logic/
        index.html, styles.css, panel.js e icon.svg   el panel y su icono
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
