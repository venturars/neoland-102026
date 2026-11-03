Issue: #790

# Plan de los clientes web y HTTP independientes

## Decisión técnica

Hoy el navegador no puede importar `src/logic/` porque, por debajo, `src/queries/users.js` lee archivos con `node:fs` y `src/db/connection.js` abre SQLite con `node:sqlite`. Esos dos módulos solo existen en Node.

La solución es sacar SQLite a un proceso propio y dejar `src/logic/` y `src/queries/` con JavaScript que existe en Node y en el navegador: `import` y `fetch`.

- **`src/db/server.js`** es el único proceso que abre la base. Escucha en `127.0.0.1:3000` y tiene una sola ruta, `POST /execute`, que recibe `{ method, sql, params }` y ejecuta la sentencia con `node:sqlite`.
- **`src/queries/queries/*.js`**: cada consulta deja de ser un `.sql` leído con `readFileSync` y pasa a ser un módulo que exporta el texto SQL como una constante en mayúsculas.
- **`src/queries/users.js`** importa esas constantes y, en lugar de usar la conexión, las envía al servidor con `fetch`. Sus funciones pasan a ser `async`.
- **`src/logic/`** no cambia sus reglas. Cada función pasa a ser `async` y espera a la consulta con `await`.

Con esto, `src/logic/` y `src/queries/` no importan ningún módulo `node:*`. El navegador importa la lógica directamente desde `file://` y no necesita el cliente HTTP.

`countUsersByGender` sigue importando el paquete `openai`, que solo se resuelve en Node. No lo usan ni la web ni el HTTP, así que se queda como está.

No se añaden paquetes ni cambian versiones, así que no hay revisión con Socket. Se usan Node 24, `node:http`, `node:sqlite` y `node:test`.

## Recorridos

- **Web:** Chrome abre `src/clients/web/index.html` desde `file://` → `app.js` → `src/logic/` → `src/queries/users.js` → `fetch` → `src/db/server.js` → SQLite.
- **HTTP:** petición JSON → `src/clients/http/app.js` → `src/logic/` → consultas → `fetch` → servidor de datos → SQLite.
- **Terminal y Jupyter:** las mismas funciones de `src/logic/`, ahora con `await` y con el servidor de datos arrancado.

Ningún cliente importa archivos de otro. Cada cliente traduce los errores de la lógica a sus propias frases (ver la pregunta 3).

## Servidor de datos

| Entrada `method` | Qué hace en SQLite         | Respuesta `200`                |
| ---------------- | -------------------------- | ------------------------------ |
| `exec`           | `database.exec(sql)`       | `{ ok: true }`                 |
| `get`            | `prepare(sql).get(params)` | `{ row }` o `{ row: null }`    |
| `all`            | `prepare(sql).all(params)` | `{ rows }`                     |
| `run`            | `prepare(sql).run(params)` | `{ changes, lastInsertRowid }` |

- Otra ruta u otro `method` → `404`. Un JSON mal formado o un fallo de SQLite → `500` sin cuerpo, para no enseñar detalles de la base.
- Responde a `OPTIONS` y añade `access-control-allow-origin: *` porque una página abierta desde `file://` tiene origen `null` y Chrome bloquea el `fetch` sin esa cabecera.
- Al arrancar ejecuta `CREATE_USERS_TABLE`, así la tabla existe antes de la primera petición. `createUsersTable()` se conserva en `src/queries/users.js` para el ejemplo de terminal y el cuaderno de preparar la tabla.
- Lee `FIRST_APP_DATABASE_FILE` con la misma regla que hoy tiene `connection.js`; si no la hay, abre `src/db/users.sqlite`.
- Ejecuta el SQL que recibe. Es aceptable solo porque escucha en `127.0.0.1`; queda escrito en `docs/ARCHITECTURE.md` como límite consciente.

`src/queries/users.js` fija la dirección del servidor en una constante, `DATABASE_SERVER = "http://127.0.0.1:3000"`. Una respuesta que no es `ok` o un `fetch` que no llega lanzan `Error("Query failed")`; la lógica ya captura cualquier fallo de consulta y lo cambia por su propio error (`Unable to …`), así que los clientes no ven el detalle.

## Rutas de los clientes

| Cliente | Método y ruta           | Lógica                    | Respuesta             |
| ------- | ----------------------- | ------------------------- | --------------------- |
| http    | `POST /api/users`       | `createUser(name, email)` | `201` con el usuario. |
| http    | `PATCH /api/users/:id`  | `updateUser(id, changes)` | `200` con el usuario. |
| http    | `DELETE /api/users/:id` | `deleteUser(id)`          | `204` sin cuerpo.     |

Cualquier otra ruta da `404` y cualquier otro método da `405` con `Allow`. El HTTP escucha en `127.0.0.1:3001`.

La web no tiene rutas: es una página con tres pantallas que se muestran y ocultan en el mismo documento, como ahora.

## Archivos

| Ubicación                                                                                                                        | Cambio                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/db/server.js`                                                                                                               | Nuevo. Servidor de datos descrito arriba.                                                                                                                                                                                                                                                                                                       |
| `src/db/connection.js`                                                                                                           | Se borra. Su lectura de `FIRST_APP_DATABASE_FILE` pasa a `server.js`.                                                                                                                                                                                                                                                                           |
| `src/queries/queries/*.sql`                                                                                                      | Los 7 se sustituyen por `.js` con el mismo nombre (`create-users-table.js`, `delete.js`, `find-by-email.js`, `find-by-id.js`, `insert.js`, `list.js`, `update.js`). Cada uno exporta una constante: `CREATE_USERS_TABLE`, `DELETE_USER`, `FIND_USER_BY_EMAIL`, `FIND_USER_BY_ID`, `INSERT_USER`, `LIST_USERS`, `UPDATE_USER`. El SQL no cambia. |
| `src/queries/users.js`                                                                                                           | Importa las constantes, quita `readFileSync` y la conexión, añade `execute(method, sql, params)` con `fetch` y deja las funciones exportadas con los mismos nombres, ahora `async`. Ya no crea la tabla al cargarse. `insertUser` y `updateUserRow` siguen devolviendo la fila leída después con `findUserById`.                                |
| `src/logic/*.js`                                                                                                                 | Las 7 funciones pasan a `async` y usan `await` al llamar a las consultas. Reglas, mensajes y valores devueltos sin cambios.                                                                                                                                                                                                                     |
| `src/clients/web/index.html`                                                                                                     | Mismas tres pantallas, más el formulario de crear en la selección. Enlaza `styles.css` y `app.js` con rutas relativas (`./`), para que funcionen desde `file://`.                                                                                                                                                                               |
| `src/clients/web/styles.css`                                                                                                     | Mismo diseño lila. Estilos para el formulario de crear; se quitan los que ya no tienen elemento.                                                                                                                                                                                                                                                |
| `src/clients/web/app.js`                                                                                                         | Nuevo. Importa `listUsers`, `findUserById`, `createUser`, `updateUser` y `deleteUser` de `../../logic/`. Lee los formularios, muestra pantallas y mensajes, pide confirmación con `confirm()` antes de borrar y traduce los errores.                                                                                                            |
| `src/clients/web/*.js` (resto)                                                                                                   | Se borran los 11 módulos actuales: `main.js`, `state.js`, `navigate.js`, `save-user.js`, etc.                                                                                                                                                                                                                                                   |
| `src/clients/http/app.js`                                                                                                        | Nuevo. Reúne servidor, arranque, enrutado y adaptación a la lógica. Exporta `createHttpServer()` y solo escucha en `3001` si se ejecuta directamente (`import.meta.main`).                                                                                                                                                                      |
| `src/clients/http/handle-users.js`, `handle-request.js`, `create-http-server.js`, `start-http-server.js`, `serve-public-file.js` | Se borran: su contenido útil pasa a `app.js`. `POST` a la colección llama a `createUser`; se quitan `GET` de la lista y por id.                                                                                                                                                                                                                 |
| `src/clients/http/read-json-body.js`, `send-json.js`, `send-http-error.js`                                                       | Se conservan. `send-http-error.js` añade `Unable to create user` y quita los mensajes de listar y buscar.                                                                                                                                                                                                                                       |
| `src/clients/terminal/*.txt`                                                                                                     | Cada línea añade `await` delante de la llamada. `create-users-table.txt` llama a `await createUsersTable()`.                                                                                                                                                                                                                                    |
| `src/clients/jupyter/run_logic.py`                                                                                               | Todas las funciones se ejecutan con `await` (el puente ya lo admite). El texto de ayuda dice que antes hay que arrancar el servidor de datos. Los cuadernos no cambian.                                                                                                                                                                         |
| `tests/http-client.test.js`                                                                                                      | Se reescribe: arranca `server.js` con una base temporal y el HTTP en un puerto libre, y recorre crear, modificar y eliminar con los casos que fallan. Comprueba que la lista y la página ya no existen.                                                                                                                                         |
| `tests/shared-database.test.js`                                                                                                  | Nuevo. Con el mismo servidor de datos temporal: lo creado por HTTP se lee con `listUsers()` (el mismo camino que la web), y lo modificado con `updateUser()` se ve por HTTP.                                                                                                                                                                    |
| `tests/database-server.test.js`                                                                                                  | Nuevo. `exec`, `get`, `all` y `run` responden lo esperado; ruta, `method` o JSON incorrectos dan `404` o `500` sin detalles.                                                                                                                                                                                                                    |
| `package.json`                                                                                                                   | `start` arranca `src/db/server.js`. Nuevos `start:http` (`src/clients/http/app.js`) y `web` (abre Chrome con `--allow-file-access-from-files` y un perfil temporal sobre `src/clients/web/index.html`).                                                                                                                                         |
| `eslint.config.js`                                                                                                               | `fetch` pasa a ser global de `src/queries/`. `src/clients/web/` conserva los globals del navegador y añade `confirm`.                                                                                                                                                                                                                           |
| `README.md`, `docs/WEB-CLIENT-GUIDE.md`                                                                                          | Orden de arranque (primero `pnpm start`), comandos de cada cliente y recorrido nuevo.                                                                                                                                                                                                                                                           |
| `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`                                                                       | Servidor de datos, consultas en `.js`, lógica `async`, archivos nuevos y borrados.                                                                                                                                                                                                                                                              |
| `docs/STYLE.md`                                                                                                                  | Las funciones de negocio son `async` y se llaman con `await`. Excepciones de la pregunta 2.                                                                                                                                                                                                                                                     |
| `docs/CONSTITUTION.md`                                                                                                           | Enmienda de la pregunta 1.                                                                                                                                                                                                                                                                                                                      |

La carpeta `clients/jupyter/` de la raíz de la app, sin seguimiento, es una copia suelta y antigua de tres cuadernos: no la usa ningún comando. No forma parte del pedido; el cliente Jupyter es `src/clients/jupyter/`.

## Detalles de `src/clients/web/app.js`

- El id del usuario elegido sale del `<select>`; se convierte con `Number` y la lógica lo valida.
- Todo texto de usuario se pinta con `textContent`, nunca con `innerHTML`.
- Un error conocido de la lógica se traduce a la frase en español. Uno desconocido, como un servidor de datos parado, muestra un mensaje genérico.
- La selección vive en memoria, como hoy: recargar vuelve a la lista.

## Verificación

1. `pnpm test`: las tres pruebas pasan con una base temporal. Cada prueba arranca su propio servidor de datos en el `3000`; si el puerto está ocupado (por ejemplo, porque el servidor real está arrancado), la prueba falla antes de enviar ninguna consulta, así nunca toca la base real.
2. `pnpm start` y `pnpm run web`: crear, modificar y eliminar en Chrome, con los casos que fallan de la spec, con ratón y teclado y en ancho de móvil.
3. Con `pnpm start` parado, abrir la web: muestra que no se ha podido cargar la lista.
4. `pnpm run start:http` y probar con `curl` crear, modificar, eliminar, un JSON inválido y `GET /api/users`, que debe dar `404` o `405`.
5. `grep`: `src/logic/` y `src/queries/` no importan `node:`; `src/clients/web/` no importa nada de `src/clients/http/`, y al revés.
6. Ejecutar un ejemplo de terminal y un cuaderno Jupyter con el servidor de datos sobre una base temporal.
7. `pnpm format` y `pnpm lint`, limitados a los archivos del pedido.

## Decisiones

Respuestas de la persona responsable a las preguntas del plan:

1. **Enmienda de la constitución:** autorizada. La web crea, modifica y borra; el HTTP ofrece esas tres operaciones; SQLite queda detrás de un servidor de datos local y la lógica no depende de Node.
2. **Excepciones de estilo:** aprobadas. Los dos `app.js` reúnen varias funciones y `execute()` es el único envoltorio de `fetch` de las consultas. Se escriben en `docs/STYLE.md`.
3. **Traducciones de errores:** una copia en cada cliente (web, HTTP y Jupyter), aceptando la duplicación.
