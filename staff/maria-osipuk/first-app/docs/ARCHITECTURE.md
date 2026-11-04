# Arquitectura

## Capas

`src/clients/terminal/` es el cliente de terminal. Sus archivos ejecutan funciones de `src/logic/`, proporcionan datos de ejemplo y muestran el resultado. Cada archivo contiene una sola línea de ejemplo: el caso correcto.

`src/clients/jupyter/` es el cliente Notebook de las mismas operaciones. Cada cuaderno llama a las funciones que ya existen mediante `run_logic.py`; no contiene reglas de negocio ni SQL.

`bienvenida.ipynb` es el índice. Cada operación de terminal tiene un cuaderno. `preparar-tabla-usuarios.ipynb` explica la preparación de la tabla y no es una acción de usuario.

Cada cuaderno de operación tiene el escenario, las instrucciones y una celda. Si esa celda falla, muestra una frase en español y deja el detalle en `src/clients/jupyter/jupyter-client.log`.

Los cuadernos se abren con `./scripts/jupyter.sh` desde `first-app`. Usan el Jupyter del `.venv` y el kernel `first-app`, y necesitan el servidor de datos arrancado. No crean usuarios de ejemplo.

`src/clients/web/` es el cliente de navegador, con tres pantallas: selección (con el alta de usuario), menú y edición. `index.html` define sus controles y `styles.css` su diseño adaptable con lila y fondo continuo con matices lilas y rosados. `app.js` importa las funciones de `src/logic/` directamente, lee los formularios y traduce los errores. Se abre desde `file://` con `pnpm run web`. La selección se mantiene en memoria; recargar vuelve a la lista. «Ir a notas» está deshabilitada, sin pantalla ni petición asociada.

`src/clients/http/` es el cliente REST, construido con Express. `app.js` conecta crear, listar, ver, modificar y borrar con las funciones de `src/logic/`. Traduce la petición y la respuesta; no contiene validación de negocio ni SQL. Se arranca con `pnpm run http`, escucha en `127.0.0.1:3001` y necesita el servidor de datos arrancado. No sustituye a `src/db/server.js`.

`src/logic/` es el núcleo de la aplicación. Contiene las funcionalidades para crear, buscar, actualizar, borrar y listar usuarios, y para contarlos según el género del nombre. Aplica las reglas de negocio y decide qué resultado recibe el cliente.

`src/logic/` no calcula `createdAt` ni `updatedAt` y no los envía a las consultas. Esas fechas las escribe SQLite.

Las funciones de `src/logic/` son `async` y no importan módulos `node:*`, para que el navegador pueda importarlas. La excepción es `countUsersByGender`, que usa el paquete `openai` y solo se ejecuta desde terminal y Jupyter.

`src/queries/users.js` importa el SQL de `src/queries/queries/` y lo envía al servidor de datos con `fetch`, mediante `execute(method, sql, params)`. No abre SQLite ni lee archivos.

`src/queries/queries/` contiene un módulo `.js` por consulta, que exporta el SQL como una constante en mayúsculas. No contiene funciones ni reglas de negocio.

`src/db/server.js` es el servidor de datos y el único proceso que abre SQLite. Escucha en `127.0.0.1:3000`, ejecuta lo que llega a `POST /execute` y crea la tabla `users` al arrancar. Como ejecuta cualquier SQL recibido, solo escucha en el equipo local. Se arranca con `pnpm start`.

`src/db/users.sqlite` es la base de la aplicación. Si el servidor de datos arranca con `FIRST_APP_DATABASE_FILE`, abre esa ruta; todos los clientes usan entonces ese archivo.

Todos los clientes (terminal, Jupyter, web y REST) llaman a la lógica; la lógica llama a las consultas; las consultas piden al servidor de datos que ejecute el SQL. Ningún cliente importa archivos de otro. El cuaderno de preparar la tabla llama a `createUsersTable`, igual que su cliente de terminal.

## Flujo de git

`agents/git-workflow-agent.md` es el orquestador. Lee lo que pide la persona responsable, mira la rama y los cambios con `skills/check-status` y elige un solo momento. No ejecuta git ni el MCP por su cuenta: llama a un subagente de `agents/` o a una skill de `skills/`. No hace merge a `staging`.

- Pensar la tarea: `agents/help-me-to-think.md`, que entrevista con `skills/grill-with-docs` si el cambio vive en esta app y con `skills/grill-me` si no.
- Dejarla escrita: `agents/create-issue.md`, con `skills/create-issue` y la plantilla del tipo en `templates/issues/`.
- Empezar: `skills/pull-changes` adelanta `staging`. `agents/create-branch.md` abre la rama con `skills/create-branch-from-staging`. `agents/create-commit.md` hace el commit vacío con `skills/create-empty-commit`. `agents/launch-push.md` sube la rama con `skills/launch-push`. `agents/create-pr.md` abre la pull request en draft y asignada con `skills/create-pr-base-staging` y la plantilla del tipo en `templates/pull-request/`. Por último, el orquestador enlaza la issue con `skills/link-pr-to-issue`, añade `Closes #N` y comprueba la asociación en Development. No cierra la issue manualmente.
- Guardar un trozo: `agents/create-commit.md` con `skills/commit-changes`, y `agents/launch-push.md`.
- Que la revisen: `skills/assign-reviewers` asigna a los revisores que nombra la persona responsable y saca la pull request de draft.

Las reglas de los títulos y de los tipos se consultan en las plantillas correspondientes. El cierre automático de una issue depende de fusionar en la rama predeterminada; si sigue siendo `main`, fusionar en `staging` no la cierra.

Las skills que lanzan un script usan los de `tools/`, siempre desde la raíz del repositorio git. `skills/create-branch` abre la rama desde una base que no es `staging`. Las demás hablan con el MCP de GitHub, descrito en `MCPS/github-mcp-server/mcp.txt`.

## Ficheros

- `AGENTS.md` guarda el proceso SDD, los comandos y el cierre de una tarea. Enlaza a las guías con las reglas del código y al flujo de git de `agents/git-workflow-agent.md`.
- `.gitignore` deja fuera `node_modules/`, `.env`, los archivos de SQLite, los checkpoints de Jupyter y el log del cliente Jupyter.
- `.prettierignore` evita que Prettier entre en `.venv/`, `node_modules/` y el archivo de bloqueo generado por pnpm.
- `package.json` declara los módulos ESM, `packageManager` con `pnpm@10.34.7`, los comandos `pnpm start` (servidor de datos), `pnpm run web`, `pnpm run http`, `pnpm test` (de una prueba en una), `pnpm format` y `pnpm lint`, y el control que impide instalar con otro gestor.
- `pnpm-lock.yaml` fija las versiones de las dependencias de la aplicación y de las herramientas de desarrollo.
- `eslint.config.js` limita ESLint a los archivos JavaScript, ignora el entorno y las dependencias, activa las reglas `no-undef` y `no-unused-vars`, y limita `fetch` a las consultas y las pruebas y los globals del navegador a `src/clients/web/`.
- `scripts/jupyter.sh` entra en la raíz de `first-app` y abre los cuadernos con el Jupyter del `.venv`.
- `src/db/server.js` es el servidor de datos. Exporta `openDatabase()` y `createDatabaseServer(database)` para las pruebas y solo escucha si se ejecuta directamente. Acepta `FIRST_APP_DATABASE_FILE`.
- `src/db/users.sqlite` es la base de la aplicación cuando no se configura otra ruta.
- `src/queries/users.js` envía las consultas al servidor de datos y devuelve sus filas. Sus funciones son `async`.
- `src/queries/queries/create-users-table.js` exporta `CREATE_USERS_TABLE`, el SQL que crea la tabla `users` si no existe.
- `src/queries/queries/insert.js` exporta `INSERT_USER`, el SQL que inserta un usuario.
- `src/queries/queries/find-by-email.js` exporta `FIND_USER_BY_EMAIL`, el SQL que busca un usuario por email.
- `src/queries/queries/find-by-id.js` exporta `FIND_USER_BY_ID`, el SQL que busca un usuario por id.
- `src/queries/queries/update.js` exporta `UPDATE_USER`, el SQL que actualiza un usuario.
- `src/queries/queries/delete.js` exporta `DELETE_USER`, el SQL que borra un usuario.
- `src/queries/queries/list.js` exporta `LIST_USERS`, el SQL que lista los usuarios.
- Todas las funciones de `src/logic/` son `async` y se llaman con `await`.
- `src/logic/create-user.js` es `createUser(name, email)`. Crea un usuario y devuelve `id`, `name`, `email`, `createdAt` y `updatedAt`.
- `src/logic/find-user-by-id.js` es `findUserById(id)`. Busca por id y devuelve ese usuario, o lanza un error si no existe.
- `src/logic/find-user-by-email.js` es `findUserByEmail(email)`. Busca por email y devuelve ese usuario, o lanza un error si no existe.
- `src/logic/update-user.js` es `updateUser(id, changes)`. Cambia `name` y `email` solo cuando esas propiedades vienen en `changes`. Si falta una, conserva la que ya está guardada. Devuelve el usuario completo.
- `src/logic/delete-user.js` es `deleteUser(id)`. Borra el usuario y no devuelve un valor.
- `src/logic/list-users.js` es `listUsers()`. No recibe datos y devuelve la lista de usuarios.
- `src/logic/count-users-by-gender.js` es `countUsersByGender()`. No recibe datos y devuelve `{ female, male, undefined }`. Llama a Ollama en local, modelo `gemma4`, con el paquete `openai` apuntando a `http://127.0.0.1:11434/v1`. Los nombres salen en partes de hasta 6. No añade una capa. La lectura sigue siendo `listUserRows()`.
- Cada `.txt` de `src/clients/terminal/` contiene una sola línea: el caso correcto de esa operación.
- `src/clients/jupyter/bienvenida.ipynb` es el índice de los cuadernos.
- `src/clients/jupyter/actualizar-usuario.ipynb` ejecuta el caso de actualización.
- `src/clients/jupyter/borrar-usuario.ipynb` ejecuta el caso de borrado.
- `src/clients/jupyter/buscar-usuario-por-email.ipynb` ejecuta la búsqueda por email.
- `src/clients/jupyter/buscar-usuario-por-id.ipynb` ejecuta la búsqueda por id.
- `src/clients/jupyter/contar-usuarios-por-genero.ipynb` ejecuta el recuento por género del nombre.
- `src/clients/jupyter/crear-usuario.ipynb` ejecuta el alta de usuario.
- `src/clients/jupyter/listar-usuarios.ipynb` ejecuta el listado de usuarios.
- `src/clients/jupyter/preparar-tabla-usuarios.ipynb` prepara la tabla y explica que no es una acción de usuario.
- `src/clients/jupyter/run_logic.py` arranca Node, espera cada función con `await` y comunica los cuadernos con las funciones existentes.
- `agents/` guarda los siete subagentes del flujo de git: el orquestador y los seis que llama.
- `skills/` guarda una carpeta por skill, cada una con su `SKILL.md`. Dice cuándo se usa, qué argumentos lleva y cómo se leen sus respuestas.
- `tools/` guarda los ocho scripts de git que lanzan las skills. Se ejecutan desde la raíz del repositorio y no admiten force push.
- `templates/issues/` guarda las seis plantillas de issues por tipo. Cada una define la forma del título y del cuerpo de su tarea.
- `templates/pull-request/` guarda las seis plantillas de pull requests por tipo, con la lista de comprobación y la referencia `Closes #N`.
- `MCPS/github-mcp-server/mcp.txt` documenta el servidor remoto de GitHub y el header de configuración de Cursor incluido en el template. Su ejemplo utiliza un marcador de credencial.
- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos, las queries y los tipos y formatos de cada campo.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es el nivel del código, la forma de cada línea, el contrato de las funciones de negocio, los comentarios y las convenciones.
- `docs/CONSTITUTION.md` recoge el propósito, el alcance y los principios generales.
- `AGENTS.md` recoge el proceso SDD y sus aprobaciones, los paquetes con pnpm y Socket, y qué documento se actualiza según lo que cambie.
- `docs/specs/<nombre>/` describe un pedido, con `spec.md`, `plan.md` y `tasks.md`. No describe el estado del código. `<nombre>` va en kebab-case.

## Archivos del cliente web y sus pruebas

- `README.md` explica el arranque de cada cliente, las pantallas, los archivos y las comprobaciones.
- `src/clients/web/index.html` define las tres pantallas, los formularios de alta y edición, sus etiquetas y la opción deshabilitada de notas.
- `src/clients/web/styles.css` define la paleta compartida, la distribución adaptable y los estados visuales.
- `src/clients/web/app.js` importa la lógica, gestiona las pantallas, los formularios, la confirmación del borrado y la traducción de errores.
- `tests/database-server.test.js` comprueba el servidor de datos con una base temporal.
- `tests/shared-database.test.js` comprueba que la lógica que usa la web y otro proceso Node, como un ejemplo de terminal, ven la misma base, y que sin servidor de datos se recibe el error de la operación.

- `docs/WEB-CLIENT-GUIDE.md` explica el servidor de datos, el cliente web y el recorrido de las operaciones para su lectura educativa.
