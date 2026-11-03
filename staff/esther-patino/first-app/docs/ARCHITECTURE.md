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
- `agents/help-me-to-think.md` hace una pregunta cada vez hasta que la tarea se puede dejar escrita.
- `agents/create-issue.md` crea la issue con título en inglés y descripción en español, asignada a quien está autenticado.
- `agents/create-branch.md` crea la rama `número-tipo-descripcion`.
- `agents/create-commit.md` hace un commit pequeño con ficheros nombrados.
- `agents/create-pr.md` abre la pull request contra `staging` y la deja en draft, sin enlazar la issue.
- `agents/launch-push.md` publica `HEAD` en `origin` y deja el upstream puesto.
- `skills/grill-with-docs/SKILL.md` entrevista cuando el cambio vive en este proyecto.
- `skills/grill-me/SKILL.md` entrevista cuando el repositorio no responde.
- `skills/create-issue/SKILL.md` deja la tarea escrita en GitHub.
- `skills/assign-author/SKILL.md` asigna la issue o la pull request al usuario autenticado.
- `skills/check-status/SKILL.md` dice la rama, los cambios sin commit y el remoto.
- `skills/pull-changes/SKILL.md` adelanta `staging` en fast-forward.
- `skills/create-branch-from-staging/SKILL.md` abre la rama desde `staging`.
- `skills/create-branch/SKILL.md` abre la rama desde una base que no es `staging`.
- `skills/create-empty-commit/SKILL.md` hace el commit vacío `chore: open #N`.
- `skills/commit-changes/SKILL.md` guarda un trozo con ficheros nombrados.
- `skills/launch-push/SKILL.md` sube la rama actual y fija el upstream.
- `skills/create-pr-base-staging/SKILL.md` abre la pull request con base `staging`.
- `skills/create-draft/SKILL.md` deja la pull request en draft.
- `skills/link-pr-to-issue/SKILL.md` deja `Closes #N`. La issue se cierra cuando se fusiona la pull request.
- `skills/assign-reviewers/SKILL.md` asigna a quienes miran la pull request y la saca de draft.
- `tools/check-status.sh` escribe la rama, el remoto y los cambios.
- `tools/pull-changes.sh` adelanta `staging` en fast-forward.
- `tools/create-branch-from-staging.sh` crea la rama desde `staging`.
- `tools/create-branch.sh` crea la rama desde otra base.
- `tools/create-empty-commit.sh` crea el commit vacío de apertura.
- `tools/commit-changes.sh` guarda los ficheros nombrados.
- `tools/launch-push.sh` sube la rama y fija el upstream.
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

- `src/clients/http/` es el servidor local. Escucha en `127.0.0.1:3001` y solo reparte la lista cerrada. No llama a `src/logic/`.
  - `src/clients/http/start-http-server.js` escucha en `127.0.0.1:3001`.
  - `src/clients/http/handle-request.js` llama a `serve-public-file.js`.
  - `src/clients/http/send-http-error.js` responde un fallo si el archivo no está en la lista.
  - `src/clients/http/serve-public-file.js` sirve la lista cerrada: las pantallas y los módulos de `src/logic/` y `src/queries/` que esas pantallas importan.

- `src/clients/web/` son las tres pantallas del navegador. Llaman a `src/logic/` y no piden `/api/users`.
  - `src/clients/web/index.html` define la lista, el menú y la modificación.
  - `src/clients/web/styles.css` es la hoja compartida.
  - `src/clients/web/main.js` conecta los controles con sus funciones.
  - `src/clients/web/state.js` guarda el usuario elegido.
  - `src/clients/web/show-screen.js` muestra una pantalla.
  - `src/clients/web/show-message.js` muestra un mensaje.
  - `src/clients/web/load-user-selection.js` carga la lista con `listUsers()`.
  - `src/clients/web/select-user.js` elige un usuario por id con `findUserById(id)`.
  - `src/clients/web/show-user-menu.js` muestra el menú.
  - `src/clients/web/open-user-editor.js` abre la modificación.
  - `src/clients/web/navigate.js` vuelve o abre la modificación.
  - `src/clients/web/save-user.js` guarda el nombre y el email con `updateUser(id, { name, email })`.
  - `src/clients/web/delete-selected-user.js` borra el usuario elegido con `deleteUser(id)`.
