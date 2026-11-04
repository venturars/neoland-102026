# Arquitectura

- `src/db/` abre la base de datos y no contiene reglas de negocio.
- `src/db/server.js` es el único fichero de esa capa junto a la base. Abre la única conexión, guarda la dirección `http://127.0.0.1:3000` y ejecuta el SQL que recibe. No exporta la conexión.
- `src/db/users.sqlite` es el único fichero de la base de datos.
- `src/queries/queries/` guarda el texto de cada consulta. Hay un módulo `.js` por consulta. Exporta el texto y no lo ejecuta.
- `src/queries/users.js` importa ese texto y pide la ejecución al servidor. No importa `src/db/server.js`. No hay reglas de negocio en `src/queries/`.
- `src/logic/` es el núcleo de la app. Aquí viven las reglas de negocio. Una funcionalidad por fichero.
- `src/logic/create-user.js` crea un usuario.
- `src/logic/update-user.js` actualiza un usuario.
- `src/logic/delete-user.js` borra un usuario.
- `src/logic/list-users.js` lista los usuarios.
- `src/logic/find-user-by-email.js` busca un usuario por email.
- `src/logic/find-user-by-id.js` busca un usuario por id.
- `src/logic/find-user-by-name.js` busca un usuario por nombre.
- `src/logic/users-gender-count.js` cuenta los usuarios por género.
- `src/clients/terminal/` llama a `src/logic/` y muestra el resultado. Es el
  primer cliente y el test manual de cada funcionalidad.
- `src/clients/terminal/create-users-table.txt` llama a `src/queries/users.js`.
- `src/clients/jupyter/` es el cliente que se abre con el Jupyter de la app.
- `src/clients/browser/` llama a `src/logic/`.
- `src/clients/browser/index.html` se abre en el navegador.
- `src/clients/http/` llama a `src/logic/`, escucha en el puerto 3001.
- `src/clients/electron/` llama a `src/logic/`, abre su ventana y no
  reutiliza `src/clients/browser/`. No sustituye a `src/db/server.js`.
- `src/clients/chrome/` llama a `src/logic/` desde su API, escucha en
  el puerto 3002 y no repite sus reglas. La extensión solo llama a esa
  API. No sustituye a `src/clients/http/` ni a `src/db/server.js`.
- `agents/git-workflow-agent.md` reconoce el momento y llama al
  subagente como un agente aparte.
- `agents/help-me-to-think.md` hace una pregunta cada vez hasta que la
  tarea se puede dejar escrita.
- `agents/create-issue.md` crea la issue asignada a quien está
  autenticado. El cuerpo sale de la plantilla del tipo.
- `agents/create-branch.md` crea la rama de trabajo. El tipo es el de
  la plantilla.
- `agents/create-commit.md` hace un commit pequeño con ficheros
  nombrados.
- `agents/create-pr.md` abre la pull request contra `staging`, en
  draft y asignada a quien está autenticado, en una sola
  invocación. No enlaza la issue.
- `agents/launch-push.md` publica `HEAD` en `origin` y deja el upstream
  puesto.
- `skills/grill-with-docs/SKILL.md` entrevista cuando el cambio vive en
  este proyecto.
- `skills/grill-me/SKILL.md` entrevista cuando el repositorio no
  responde.
- `skills/create-issue/SKILL.md` deja la tarea escrita en GitHub.
- `skills/assign-author/SKILL.md` asigna la issue o la pull request al
  usuario autenticado.
- `skills/check-status/SKILL.md` dice la rama, los cambios sin commit y
  el remoto.
- `skills/pull-changes/SKILL.md` adelanta `staging` en fast-forward.
- `skills/create-branch-from-staging/SKILL.md` abre la rama desde
  `staging`.
- `skills/create-branch/SKILL.md` abre la rama desde una base que no es
  `staging`.
- `skills/create-empty-commit/SKILL.md` hace el commit vacío
  `chore: open #N`.
- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros
  nombrados.
- `skills/launch-push/SKILL.md` sube la rama actual y fija el upstream.
- `skills/create-pr-base-staging/SKILL.md` abre la pull request
  con base `staging`, en draft y asignada a quien está
  autenticado.
- `skills/create-draft/SKILL.md` pasa a draft una pull request
  que ya existe.
- `skills/link-pr-to-issue/SKILL.md` deja `Closes #N` en el cuerpo y
  enlaza la issue en Development. No llama a la API para cerrarla.
- `skills/assign-reviewers/SKILL.md` asigna a quienes miran la pull
  request y la saca de draft.
- `tools/check-status.sh` escribe la rama, el remoto y los cambios.
- `tools/pull-changes.sh` adelanta `staging` en fast-forward.
- `tools/create-branch-from-staging.sh` crea la rama desde `staging`.
- `tools/create-branch.sh` crea la rama desde otra base.
- `tools/create-empty-commit.sh` crea el commit vacío de apertura.
- `tools/commit-changes.sh` guarda los ficheros nombrados.
- `tools/launch-push.sh` sube la rama y fija el upstream.
- `tools/create-pr-base-staging.sh` crea la pull request con base
  `staging`, en draft y asignada a quien está autenticado.
- `templates/issues/` tiene una plantilla por tipo: feat, fix, docs,
  refactor, test y chore. El cuerpo dice qué hay que hacer y cómo
  probarlo.
- `templates/pull-request/` tiene una plantilla por tipo. La sección
  Issue lleva `Closes #`.
- `MCPS/github-mcp-server/mcp.txt` es la dirección del MCP de GitHub y
  el header para que la escritura vaya directa.
- `MCPS/socket-mcp/mcp.txt` es la dirección del MCP de Socket.
- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada
  fichero.
- `docs/TREE.md` es el árbol de carpetas y ficheros.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es el estilo y las convenciones.
- `docs/CONSTITUTIONS.md` conserva las specs, los paquetes y el
  contrato de `logic/`. Enlaza a las otras guías.
- `docs/specs/<nombre>/` es un desarrollo. `<nombre>` va en kebab-case.
  Ahí viven su spec, su plan y sus tareas.
- `eslint.config.js` aplica las reglas recomendadas de ESLint al JavaScript e ignora `.venv` y `node_modules`.
