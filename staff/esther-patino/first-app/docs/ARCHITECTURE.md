# Arquitectura

- `AGENTS.md` dice cómo se trabaja: el orden de un cambio, el estilo y qué hacer al cerrar una tarea.
- `package.json` declara el proyecto. Los scripts `format` y `lint` lanzan Prettier y ESLint.
- `pnpm-lock.yaml` fija las versiones de las dependencias.

- `scripts/` arranca Jupyter sobre `src/clients/jupyter/`.
  - `scripts/jupyter.js` arranca Jupyter sobre `src/clients/jupyter/`.

- `src/db/` abre la base de datos y no contiene reglas de negocio.
  - `src/db/server.js` es el único fichero de esa capa junto a la base. Abre la única conexión, guarda la dirección `http://127.0.0.1:3000` y ejecuta el SQL que recibe. No exporta la conexión.
  - `src/db/users.sqlite` es el único fichero de la base de datos.

- `agents/git-workflow-agent.md` reconoce el momento y llama al subagente o a la skill que toca.
- `agents/help-me-to-think.md` hace las preguntas que haga falta hasta que la tarea se puede dejar escrita.
- `agents/create-issue.md` crea la issue con título en inglés y descripción en español, asignada a quien está autenticado.
- `agents/create-branch.md` crea la rama desde `staging`. El tipo es el de la plantilla. Si no hay plantilla, elige la más cercana.
- `agents/create-commit.md` hace un commit pequeño con ficheros nombrados.
- `agents/create-pr.md` abre la pull request contra `staging`, en draft y asignada a quien está autenticado, en una sola invocación, sin enlazar la issue.
- `agents/launch-push.md` publica `HEAD` en `origin` y deja el upstream puesto.
- `skills/grill-with-docs/SKILL.md` entrevista cuando el cambio vive en este proyecto.
- `skills/grill-me/SKILL.md` entrevista cuando el repositorio no responde.
- `skills/create-issue/SKILL.md` deja la tarea escrita en GitHub.
- `skills/assign-author/SKILL.md` asigna la issue o la pull request al usuario autenticado.
- `skills/check-status/SKILL.md` dice la rama, los cambios sin commit y el remoto.
- `skills/pull-changes/SKILL.md` adelanta `staging` en fast-forward.
- `skills/create-branch-from-staging/SKILL.md` abre la rama desde `staging`. El tipo es el de la plantilla.
- `skills/create-branch/SKILL.md` abre la rama desde una base que no es `staging`. El tipo es el de la plantilla.
- `skills/create-empty-commit/SKILL.md` hace el commit vacío `chore: open #N`.
- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros nombrados.
- `skills/launch-push/SKILL.md` sube la rama actual y fija el upstream.
- `skills/create-pr-base-staging/SKILL.md` abre la pull request con base `staging`, en draft y asignada a quien está autenticado, en una sola invocación.
- `skills/create-draft/SKILL.md` pasa a draft una pull request que ya existe.
- `skills/link-pr-to-issue/SKILL.md` deja `Closes #N` y no llama a la API para cerrar la issue. GitHub la cierra al fusionar en la rama por defecto. Fusionar solo en `staging` no la cierra.
- `skills/assign-reviewers/SKILL.md` asigna a quienes miran la pull request y la saca de draft.
- `tools/check-status.sh` escribe la rama, el remoto y los cambios.
- `tools/pull-changes.sh` adelanta `staging` en fast-forward.
- `tools/create-branch-from-staging.sh` crea la rama desde `staging`. No rechaza un tipo fuera de la lista de seis. La descripción va en minúsculas y con guiones.
- `tools/create-branch.sh` crea la rama desde otra base. No rechaza un tipo fuera de la lista de seis. La descripción va en minúsculas y con guiones.
- `tools/create-empty-commit.sh` crea el commit vacío de apertura.
- `tools/commit-changes.sh` guarda los ficheros nombrados.
- `tools/launch-push.sh` sube la rama y fija el upstream.
- `tools/create-pr-base-staging.sh` crea la pull request con base `staging`, en draft y asignada a quien está autenticado.
- `templates/issues/feat_issue.md` es el cuerpo de la issue de tipo feat.
- `templates/issues/fix_issue.md` es el cuerpo de la issue de tipo fix.
- `templates/issues/docs_issue.md` es el cuerpo de la issue de tipo docs.
- `templates/issues/refactor_issue.md` es el cuerpo de la issue de tipo refactor.
- `templates/issues/test_issue.md` es el cuerpo de la issue de tipo test.
- `templates/issues/chore_issue.md` es el cuerpo de la issue de tipo chore.
- `templates/pull-request/feat-pull-request.md` es el cuerpo de la pull request de tipo feat.
- `templates/pull-request/fix-pull-request.md` es el cuerpo de la pull request de tipo fix.
- `templates/pull-request/docs-pull-request.md` es el cuerpo de la pull request de tipo docs.
- `templates/pull-request/refactor-pull-request.md` es el cuerpo de la pull request de tipo refactor.
- `templates/pull-request/test-pull-request.md` es el cuerpo de la pull request de tipo test.
- `templates/pull-request/chore-pull-request.md` es el cuerpo de la pull request de tipo chore.
- `MCPS/github-mcp-server/mcp.txt` es la dirección del MCP de GitHub.
- `MCPS/socket-mcp/mcp.txt` es la dirección del MCP de Socket.

- `docs/` guarda la constitución y las specs.
  - `docs/CONSTITUTIONS.md` manda el comportamiento de la app.
  - `docs/tree.md` es el árbol.
  - `docs/ARCHITECTURE.md` dice la función de cada carpeta y de cada archivo.
  - `docs/database.md` dice la base de datos y las consultas.
  - `docs/errors.md` dice los errores.
  - `docs/style.md` dice los comandos y el estilo.

- `docs/specs/<nombre>/` es un desarrollo.
  - `spec.md` es el negocio.
  - `plan.md` es la técnica.
  - `tasks.md` son los pasos.

- `src/logic/` guarda las reglas de negocio. Cada función es async y espera a `src/queries/`.
  - `src/logic/shared.js` comprueba el nombre, el email y el id, y deja el usuario plano.
  - `src/logic/create-user.js` crea un usuario.
  - `src/logic/list-users.js` lista los usuarios.
  - `src/logic/find-user-by-email.js` busca un usuario por email.
  - `src/logic/find-user-by-id.js` busca un usuario por id.
  - `src/logic/find-user-by-name.js` busca usuarios por nombre.
  - `src/logic/update-user.js` cambia un usuario.
  - `src/logic/delete-user.js` borra un usuario.
  - `src/logic/users-gender-count.js` cuenta los usuarios según el sexo que sugiere el nombre. No guarda el sexo.

- `src/queries/queries/` guarda el texto de cada consulta. Hay un módulo `.js` por consulta. Exporta el texto y no lo ejecuta.
- `src/queries/users.js` importa ese texto y pide la ejecución al servidor. No importa `src/db/server.js`. No hay reglas de negocio en `src/queries/`.

- `src/clients/` agrupa los clientes.

- `src/clients/terminal/` llama con `await` y es el test manual.
  - `src/clients/terminal/create-users-table.txt` llama a `src/queries/users.js` con `await` y no importa la conexión.
  - `src/clients/terminal/insert-user.txt` prueba crear un usuario.
  - `src/clients/terminal/find-all.txt` prueba listar los usuarios.
  - `src/clients/terminal/find-by-email.txt` prueba buscar por email.
  - `src/clients/terminal/find-by-id.txt` prueba buscar por id.
  - `src/clients/terminal/find-user-by-name.txt` prueba buscar por nombre.
  - `src/clients/terminal/update-user.txt` prueba cambiar un usuario.
  - `src/clients/terminal/remove-user.txt` prueba borrar un usuario.
  - `src/clients/terminal/users-gender-count.txt` prueba el recuento por sexo del nombre.

- `src/clients/jupyter/` sirve para validar las funcionalidades desde Jupyter.
  - `src/clients/jupyter/create-users-table.ipynb` valida crear la tabla.
  - `src/clients/jupyter/insert-user.ipynb` valida crear un usuario.
  - `src/clients/jupyter/find-all.ipynb` valida listar los usuarios.
  - `src/clients/jupyter/find-by-email.ipynb` valida buscar por email.
  - `src/clients/jupyter/find-by-id.ipynb` valida buscar por id.
  - `src/clients/jupyter/find-user-by-name.ipynb` valida buscar por nombre.
  - `src/clients/jupyter/update-user.ipynb` valida cambiar un usuario.
  - `src/clients/jupyter/remove-user.ipynb` valida borrar un usuario.
  - `src/clients/jupyter/users-gender-count.ipynb` valida el recuento por sexo del nombre.

- `src/clients/http/` llama a `src/logic/`, escucha en el puerto 3001.
  - `src/clients/http/app.js` crea, lista, ve, modifica y borra usuarios. Se arranca con `pnpm http`.
  - `src/clients/http/bruno/` son las peticiones `.bru` contra `http://127.0.0.1:3001`. Los comandos están en `docs/style.md`.

- `src/clients/nest/` llama a `src/logic/`, escucha en el puerto 3003 y no repite sus reglas. Las clases quedan en el módulo y en el controlador. `pnpm nest` lo compila con Babel a `src/clients/nest-run` y arranca ese `main.js`. También expone Swagger UI en `/api` del mismo puerto. No sustituye a `src/db/server.js` ni al cliente HTTP.

- `src/clients/chrome/` llama a `src/logic/`, escucha en el puerto 3002.
  - `src/clients/chrome/server.js` crea, lista, ve, modifica y borra usuarios. Se arranca con `pnpm chrome`.
  - `src/clients/chrome/manifest.json` es el manifiesto de la extensión.
  - `src/clients/chrome/index.html` es el popup.
  - `src/clients/chrome/styles.css` es la hoja del popup.
  - `src/clients/chrome/popup.js` pide las rutas de la API con `fetch` y no importa `src/logic/`.

- `src/clients/vscode/` abre su panel en una pestaña. `extension.js` llama a `src/logic/` y no repite sus reglas. La página no importa `src/logic/`.
  - `src/clients/vscode/extension.js` crea, lista, busca, ve, modifica y borra usuarios. Se abre con el comando «Abrir usuarios».
  - `src/clients/vscode/package.json` es el manifiesto de la extensión.
  - `src/clients/vscode/index.html` es el panel.
  - `src/clients/vscode/styles.css` es la hoja del panel.
  - `src/clients/vscode/app.js` pide las acciones y no importa `src/logic/` ni `vscode`.

- `src/clients/web/` son las tres pantallas del navegador. Se abren desde el disco con `pnpm open`. Llaman a `src/logic/` y no piden `/api/users`.
  - `src/clients/web/index.html` define la lista, el menú y la modificación.
  - `src/clients/web/styles.css` es la hoja compartida.
  - `src/clients/web/app.js` es la lógica de las tres pantallas. Carga la lista con `listUsers()`, elige por id con `findUserById(id)`, guarda con `updateUser(id, { name, email })` y borra con `deleteUser(id)`.
