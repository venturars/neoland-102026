# Plan — lógica en el cliente con la base en un servidor

No es una funcionalidad nueva: cambia la arquitectura.

Cambio tras la revisión de la #805: el servidor solo atiende datos y todo `src/db/` es un único `server.js`. La web se abre como fichero con `pnpm browser`, como en la #816. Las operaciones son las mismas. Cambian sus firmas, la forma del usuario, los mensajes y dónde se ejecutan.

## Capas, de abajo arriba

1. `src/db/` abre la base y la sirve por HTTP. No tiene reglas.
2. `src/queries/` tiene el texto SQL y lo envía al servidor. No tiene reglas.
3. `src/logic/` tiene las reglas. Se ejecuta en el cliente.
4. `src/clients/` llama a `src/logic/` y muestra el resultado.

## Ficheros

Se crean:

- `src/db/server.js` — todo `src/db/`: abre la base, crea la tabla al empezar y atiende `/execute` en `127.0.0.1:3000`
- `scripts/browser.js` — abre `src/clients/web/index.html` como fichero en Chrome
- `src/queries/queries/*.js` — uno por consulta y con el mismo nombre que el `.sql` de hoy (`find-all.js`, `insert.js`…). Cada uno exporta una constante en mayúsculas con el texto (`FIND_ALL`, `INSERT_USER`…)
- `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/ERRORS.md`, `docs/STYLE.md`

Se tocan:

- `src/queries/users.js`
- todos los ficheros de `src/logic/`
- `src/clients/web/*.js`, `src/clients/terminal/*.txt`, `src/clients/jupyter/*.ipynb`
- `docs/CONSTITUCION.md`, `AGENTS.md`, `package.json`, `eslint.config.js`

Se borran:

- `src/queries/queries/*.sql`
- `src/db/connection.js` (lo absorbe `server.js`)
- `src/clients/http/` entera

## Servidor — `src/db/server.js`

`pnpm start` pasa a ser `node src/db/server.js`.

`POST /execute` recibe `{ method, sql, params }`:

| `method` | Qué hace con `db` | Responde |
| --- | --- | --- |
| `exec` | `db.exec(sql)` | `{ ok: true }` |
| `get` | `prepare(sql).get(params)` | `{ row }`, con `null` si no hay fila |
| `all` | `prepare(sql).all(params)` | `{ rows }` |
| `run` | `prepare(sql).run(params)` | `{ changes }` |

Otro `method`, un cuerpo que no es JSON o un fallo de SQLite → 500 con el cuerpo vacío. El detalle no sale del servidor.

Quién puede llamar:

- sin `Origin` (terminal y Jupyter): sí;
- `Origin: file://` o `Origin: null` (la página abierta como fichero; Chrome usa `file://` con `--allow-file-access-from-files`): sí, con `Access-Control-Allow-Origin` igual al origen recibido, en el `OPTIONS` y en el `POST`. Si Chrome lo pide, también `Access-Control-Allow-Private-Network: true`;
- cualquier otro origen: 403.

Solo se acepta `Content-Type: application/json` (si no, 415). Si `Host` no es `127.0.0.1:3000`, da 403.

No sirve ficheros. Cualquier ruta que no sea `/execute` da 404.

## Web como fichero

Los módulos de `src/clients/web/` importan la lógica con rutas relativas (`../../logic/<fichero>.js`). `index.html` carga `./styles.css` y `./main.js`.

`pnpm browser` ejecuta `scripts/browser.js`, que lanza Chrome con `--user-data-dir` en la carpeta temporal y `--allow-file-access-from-files`, con la URL `file://` de `index.html`.

## Consultas — `src/queries/users.js`

Constante `ORIGIN = "http://127.0.0.1:3000"`. Una función interna, `execute(method, sql, params)`, hace `fetch` a `ORIGIN + "/execute"`. Si `response.ok` es falso, lanza un `Error`, que `logic` traduce.

Exporta, cada una con su SQL:

- `createUsersTable()`
- `findAll()` → filas
- `findById(id)` → fila o `null`
- `findByEmail(email)` → fila o `null`
- `findByName(name)` → filas
- `insert({ name, email })` → fila
- `update({ id, name, email })` → fila
- `remove(id)` → `{ changes }`

Los parámetros con nombre siguen siendo `:id`, `:name` y `:email`.

`server.js` importa `CREATE_USERS_TABLE` de `src/queries/queries/create-users-table.js` y lo ejecuta al arrancar.

## Lógica — firmas

| Fichero | Firma | Salida |
| --- | --- | --- |
| `create-user.js` | `createUser({ name, email })` | usuario |
| `update-user.js` | `updateUser(id, { name, email })` | usuario |
| `delete-user.js` | `deleteUser(id)` | usuario borrado |
| `find-user-by-id.js` | `findUserById(id)` | usuario |
| `find-user-by-email.js` | `findUserByEmail(email)` | usuario |
| `find-user-by-name.js` | `findUserByName(name)` | array de usuarios |
| `list-users.js` | `listUsers()` | array de usuarios |
| `users-gender-count.js` | `usersGenderCount()` | `{ women, men, genderUndefined }` |

Usuario = `{ id, name, email, createdAt, updatedAt }`, con `id` como número, tal como lo devuelve SQLite.

`shared.js` se queda: `validateName(name)` y `validateEmail(email)` con los mensajes nuevos. `validateNewUser` y `validateChanges` se rehacen con esas dos funciones. Si no llega ningún campo al modificar, se guardan los valores actuales.

Orden interno, igual que hoy: datos en la mano → lo que mira la base → guardar o borrar → copia de salida. Cada llamada a `queries` va dentro de un `try`. Su fallo se convierte en el `Could not …` de esa operación. Los errores de reglas se lanzan fuera de esos `try`, para que no se tapen.

## Errores

| Fallo de la spec | Mensaje |
| --- | --- |
| nombre vacío | `Name is empty` |
| email mal escrito | `Email is invalid` |
| email de otro usuario | `Email is already used` |
| usuario que no existe | `User not found` |
| la base falla al crear / modificar / borrar | `Could not create the user` / `Could not update the user` / `Could not delete the user` |
| la base falla al listar | `Could not list the users` |
| la base falla al buscar por id, email o nombre | `Could not find the user` |
| la base o la IA fallan al contar | `Could not classify the users` |

Desaparecen `Name is required`, `A name or an email is required`, `Email <email> is already registered`, `There is no user with id <id>` y `No se han podido clasificar los usuarios`.

## Clientes

- Web: cada módulo importa la operación desde `../../logic/<fichero>.js` y la llama directamente. Se quita `fetch("/api/…")`. El mensaje de error sale de `error.message`. Se usa `name` en lugar de `nombre`. Las cuatro pantallas no cambian.
- Terminal y Jupyter: sin `db` ni `createSqliteStore`. Se llama a la operación y se usa `name`. El comentario o la celda markdown avisa de que antes hay que lanzar `pnpm start`. Las tablas de Jupyter muestran `id`, `name`, `email`, `createdAt` y `updatedAt`.
- `create-users-table.txt` / `.ipynb` llaman a `createUsersTable()` de `src/queries/users.js`.

## Configuración

- `package.json`: `start` → `node src/db/server.js` y `browser` → `node scripts/browser.js`. `format` quita `src/clients/http/`.
- `eslint.config.js`: `fetch` como global para `src/queries/**/*.js`.

## Docs

Se escriben con nuestras palabras, sin copiar las de otras carpetas:

- `ARCHITECTURE.md`: las cuatro capas y qué sabe cada fichero (sale de la tabla «Quién sabe qué» de hoy).
- `TREE.md`: el árbol de `first-app`.
- `DATABASE.md`: la tabla `users`, el servidor, `/execute` y las consultas.
- `ERRORS.md`: la lista de la sección «Errores».
- `STYLE.md`: lo que hoy está en «Estilo» de `AGENTS.md`.
- `CONSTITUCION.md`: índice de las guías, reglas SDD, paquetes y qué no entra.
- `AGENTS.md`: apunta a esas guías en lugar de repetirlas, y avisa de que `pnpm start` tiene que estar en marcha para cualquier cliente.

## Comprobación

- `pnpm lint` sin errores.
- `pnpm start`, y en otra terminal `list-users.txt` devuelve usuarios con `name` y fechas.
- Con el servidor parado, `list-users.txt` da `Could not list the users`.
- Web en `http://127.0.0.1:3000`: seleccionar, menú, notas, modificar (email inválido → `Email is invalid`, email de otro → `Email is already used`, datos válidos → se guarda) y eliminar.
- `OPTIONS /execute` con `Origin: http://otra.web` da 403; con `Origin: file://` o `null`, 204 y ese mismo valor en `access-control-allow-origin`.
- `GET /`, `/main.js` y `/logic/list-users.js` dan 404: el servidor no sirve ficheros.
- `pnpm browser` abre la página como `file://` y funciona con `pnpm start` en marcha.

## Antes de escribir el código

La constitución actual dice que el almacén se inyecta, fija los mensajes viejos y dice que el usuario es `{ id, nombre, email }`. Al implementar, primero se reescriben los docs y solo después el código.
