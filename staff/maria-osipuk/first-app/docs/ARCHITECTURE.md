# Arquitectura

## Capas

`src/clients/terminal/` es el cliente de terminal. Sus archivos ejecutan funciones de `src/logic/`, proporcionan datos de ejemplo y muestran el resultado. Cada archivo contiene una sola línea de ejemplo: el caso correcto.

`src/clients/jupyter/` es el cliente Notebook de las mismas operaciones. Cada cuaderno llama a las funciones que ya existen mediante `run_logic.py`; no contiene reglas de negocio ni SQL.

`bienvenida.ipynb` es el índice. Cada operación de terminal tiene un cuaderno. `preparar-tabla-usuarios.ipynb` explica la preparación de la tabla y no es una acción de usuario.

Cada cuaderno de operación tiene el escenario, las instrucciones y una celda. Si esa celda falla, muestra una frase en español y deja el detalle en `src/clients/jupyter/jupyter-client.log`.

Los cuadernos se abren con `./scripts/jupyter.sh` desde `first-app`. Usan el Jupyter del `.venv`, el kernel `first-app` y la base `src/db/users.sqlite`. No crean usuarios de ejemplo.

`src/clients/web/` contiene las tres pantallas del navegador: selección, menú y edición de usuario. `index.html` define sus controles y `styles.css` su diseño adaptable con lila y fondo continuo con matices lilas y rosados. Los módulos JavaScript leen los formularios y llaman al cliente HTTP mediante `fetch`. La selección se mantiene en memoria; recargar vuelve a la lista. «Ir a notas» está deshabilitada, sin pantalla ni petición asociada.

`src/clients/http/` es el adaptador local, construido con `node:http`. Sirve solo los archivos públicos declarados y conecta el listado, búsqueda por id, modificación y borrado con las funciones existentes de `src/logic/`. Traduce entradas y errores de transporte; no contiene validación de negocio ni SQL. Se arranca con `pnpm start` y escucha en `127.0.0.1:3000`.

`src/logic/` es el núcleo de la aplicación. Contiene las funcionalidades para crear, buscar, actualizar, borrar y listar usuarios, y para contarlos según el género del nombre. Aplica las reglas de negocio y decide qué resultado recibe el cliente.

`src/logic/` no calcula `createdAt` ni `updatedAt` y no los envía a las consultas. Esas fechas las escribe SQLite.

`src/queries/users.js` lee los archivos SQL, prepara las consultas, proporciona sus parámetros y las ejecuta mediante la conexión compartida. Al cargar este módulo, crea la tabla `users` si todavía no existe.

`src/queries/queries/` contiene un archivo `.sql` por consulta. Los archivos contienen exclusivamente SQL y no contienen JavaScript ni reglas de negocio.

`src/db/connection.js` abre la conexión SQLite.

`src/db/users.sqlite` es la base de la aplicación. Si el proceso tiene `FIRST_APP_DATABASE_FILE`, la conexión abre esa ruta. Si no la tiene, abre `src/db/users.sqlite`. Terminal y HTTP pueden recibir esa variable del entorno. El puente Jupyter usa la ruta predeterminada de su copia de la aplicación.

Ninguna capa accede directamente a otra capa que no sea la siguiente del recorrido: `src/clients/terminal/` o `src/clients/jupyter/`, `src/logic/`, `src/queries/users.js`, `src/queries/queries/*.sql`, `src/db/connection.js`, `src/db/users.sqlite`. El navegador se comunica por HTTP con su adaptador, que entra en el mismo recorrido desde `src/logic/`. El cuaderno de preparar la tabla llama a `createUsersTable`, igual que su cliente de terminal.

## Flujo de git

`agents/git-workflow-agent.md` es el orquestador. Lee lo que pide la persona responsable, mira la rama y los cambios con `skills/check-status` y elige un solo momento. No ejecuta git ni el MCP por su cuenta: llama a un subagente de `agents/` o a una skill de `skills/`. No hace merge a `staging`.

- Pensar la tarea: `agents/help-me-to-think.md`, que entrevista con `skills/grill-with-docs` si el cambio vive en esta app y con `skills/grill-me` si no.
- Dejarla escrita: `agents/create-issue.md`, con `skills/create-issue` y la plantilla del tipo en `templates/issues/`.
- Empezar: `skills/pull-changes` adelanta `staging`. `agents/create-branch.md` abre la rama con `skills/create-branch-from-staging`. `agents/create-commit.md` hace el commit vacío con `skills/create-empty-commit`. `agents/launch-push.md` sube la rama con `skills/launch-push`. `agents/create-pr.md` abre la pull request en draft con `skills/create-pr-base-staging`, `skills/assign-author` y `skills/create-draft`, y la plantilla del tipo en `templates/pull-request/`. Por último, el orquestador enlaza la issue con `skills/link-pr-to-issue`, añade `Closes #N` y comprueba la asociación en Development. No cierra la issue manualmente.
- Guardar un trozo: `agents/create-commit.md` con `skills/commit-changes`, y `agents/launch-push.md`.
- Que la revisen: `skills/assign-reviewers` asigna a los revisores que nombra la persona responsable y saca la pull request de draft.

Las reglas de los títulos y de los tipos se consultan en las plantillas correspondientes. El cierre automático de una issue depende de fusionar en la rama predeterminada; si sigue siendo `main`, fusionar en `staging` no la cierra.

Las skills que lanzan un script usan los de `tools/`, siempre desde la raíz del repositorio git. `skills/create-branch` abre la rama desde una base que no es `staging`. Las demás hablan con el MCP de GitHub, descrito en `MCPS/github-mcp-server/mcp.txt`.

## Ficheros

- `AGENTS.md` guarda el proceso SDD, los comandos y el cierre de una tarea. Enlaza a las guías con las reglas del código y al flujo de git de `agents/git-workflow-agent.md`.
- `.gitignore` deja fuera `node_modules/`, `.env`, los archivos de SQLite, los checkpoints de Jupyter y el log del cliente Jupyter.
- `.prettierignore` evita que Prettier entre en `.venv/`, `node_modules/` y el archivo de bloqueo generado por pnpm.
- `package.json` declara los módulos ESM, `packageManager` con `pnpm@10.34.7`, los comandos `pnpm start`, `pnpm test`, `pnpm format` y `pnpm lint`, y el control que impide instalar con otro gestor.
- `pnpm-lock.yaml` fija las versiones de las dependencias de la aplicación y de las herramientas de desarrollo.
- `eslint.config.js` limita ESLint a los archivos JavaScript, ignora el entorno y las dependencias, activa las reglas `no-undef` y `no-unused-vars`, y limita los globals del navegador y de las pruebas a sus carpetas.
- `scripts/jupyter.sh` entra en la raíz de `first-app` y abre los cuadernos con el Jupyter del `.venv`.
- `src/db/connection.js` abre la conexión SQLite. Acepta `FIRST_APP_DATABASE_FILE` para que un proceso use otra ruta.
- `src/db/users.sqlite` es la base de la aplicación cuando no se configura otra ruta.
- `src/queries/users.js` lee, prepara y ejecuta las consultas. Al cargarse, crea la tabla `users` si no existe.
- `src/queries/queries/create-users-table.sql` es el SQL que crea la tabla `users` si no existe.
- `src/queries/queries/insert.sql` es el SQL que inserta un usuario.
- `src/queries/queries/find-by-email.sql` es el SQL que busca un usuario por email.
- `src/queries/queries/find-by-id.sql` es el SQL que busca un usuario por id.
- `src/queries/queries/update.sql` es el SQL que actualiza un usuario.
- `src/queries/queries/delete.sql` es el SQL que borra un usuario.
- `src/queries/queries/list.sql` es el SQL que lista los usuarios.
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
- `src/clients/jupyter/run_logic.py` arranca Node y comunica los cuadernos con las funciones existentes.
- `agents/` guarda los siete subagentes del flujo de git: el orquestador y los seis que llama.
- `skills/` guarda una carpeta por skill, cada una con su `SKILL.md`. Dice cuándo se usa, qué argumentos lleva y cómo se leen sus respuestas.
- `tools/` guarda los siete scripts de git que lanzan las skills. Se ejecutan desde la raíz del repositorio y no admiten force push.
- `templates/issues/` guarda las seis plantillas de issues por tipo. Cada una define la forma del título y del cuerpo de su tarea.
- `templates/pull-request/` guarda las seis plantillas de pull requests por tipo, con la lista de comprobación y la referencia `Closes #N`.
- `MCPS/github-mcp-server/mcp.txt` documenta el servidor remoto de GitHub y el header de configuración de Cursor incluido en el template. Su ejemplo utiliza un marcador de credencial.
- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos, las queries y los tipos y formatos de cada campo.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es el nivel del código, la forma de cada línea, los comentarios y las convenciones.
- `docs/CONSTITUTION.md` conserva las specs, los paquetes, el contrato de las funciones, las reglas de implementación y seguridad, la sincronización de la documentación y los pasos de `src/logic/`. Enlaza a las otras guías.
- `docs/specs/<nombre>/` describe un pedido, con `spec.md`, `plan.md` y `tasks.md`. No describe el estado del código. `<nombre>` va en kebab-case.

## Archivos del cliente de navegador y sus pruebas

- `README.md` explica el arranque, las pantallas, los archivos y las comprobaciones.
- `src/clients/http/create-http-server.js` crea el servidor sin elegir puerto para permitir pruebas aisladas.
- `src/clients/http/start-http-server.js` arranca el servidor local y muestra su dirección o un error de arranque.
- `src/clients/http/handle-request.js` elige entre peticiones de usuarios y archivos públicos y captura sus errores.
- `src/clients/http/handle-users.js` adapta GET, PATCH y DELETE a las operaciones existentes, convirtiendo el id de la ruta tras comprobarlo.
- `src/clients/http/read-json-body.js` lee un objeto JSON sin acumular más de 64 KiB de entrada.
- `src/clients/http/send-json.js` envía respuestas JSON sin caché.
- `src/clients/http/send-http-error.js` convierte errores conocidos en respuestas HTTP con frases en español.
- `src/clients/http/serve-public-file.js` sirve únicamente los archivos declarados del navegador, con su tipo de contenido.
- `src/clients/web/index.html` define las tres pantallas, formularios, etiquetas y la opción deshabilitada de notas.
- `src/clients/web/styles.css` define la paleta compartida, la distribución adaptable y los estados visuales.
- `src/clients/web/state.js` conserva el usuario seleccionado y si hay una operación pendiente.
- `src/clients/web/main.js` conecta los eventos con sus funciones y carga la selección inicial.
- `src/clients/web/show-screen.js` muestra una sección y mueve el foco a su encabezado.
- `src/clients/web/show-message.js` muestra mensajes como texto, sin interpretar HTML.
- `src/clients/web/load-user-selection.js` carga la lista y distingue carga, error y lista vacía.
- `src/clients/web/select-user.js` recupera el usuario elegido por id antes de mostrar el menú.
- `src/clients/web/show-user-menu.js` muestra los últimos datos guardados de la selección.
- `src/clients/web/open-user-editor.js` rellena el formulario con los datos guardados.
- `src/clients/web/navigate.js` gestiona los botones de navegación; no hay acción para notas.
- `src/clients/web/save-user.js` envía nombre y email, evita envíos repetidos y conserva el formulario al fallar.
- `src/clients/web/delete-selected-user.js` confirma el borrado y solo después lo solicita; al terminar recarga la lista.
- `tests/http-client.test.js` comprueba integración, entradas incorrectas, persistencia, errores y archivos privados con una base temporal.

- `docs/WEB-CLIENT-GUIDE.md` explica el código del cliente y el recorrido de las operaciones para su lectura educativa.
