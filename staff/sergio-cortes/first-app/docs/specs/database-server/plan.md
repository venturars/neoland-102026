# Plan — servidor de la base de usuarios

Issue: #827.

No es una funcionalidad nueva en `logic/`. Es un refactor de dónde se abre la
base y de cómo `queries/user.js` obtiene el resultado del SQL. Las reglas de
negocio no cambian de capa ni de nombre. No hay paquete nuevo ni cambio de
versión. No hay validación Socket.

La constitución, el árbol, la arquitectura y la base de datos dicen hoy que
`src/db/connections.js` exporta la única conexión y que `src/queries/user.js`
lee cada `.sql` y lo ejecuta en el mismo proceso. Este desarrollo deja la
conexión y la lectura del SQL en un proceso servidor, hace que `user.js` pida
el resultado por HTTP y hace que las funciones de `logic/` devuelvan una
promesa. Las guías vivas se actualizan para reflejar ese contrato.

## Ficheros

Se crea:

- `src/db/server.js` (sustituye a `src/db/connections.js`)

Se borra:

- `src/db/connections.js`

Se toca:

- `src/queries/user.js`
- Los ocho ficheros de `src/logic/` (`create-user.js`, `update-user.js`,
  `delete-user.js`, `find-user-by-id.js`, `find-user-by-email.js`,
  `find-user-by-name.js`, `list-users.js`, `user-gender-count.js`)
- Los nueve `.txt` de `src/clients/terminal/` (incluido
  `create-user-table.txt`)
- Los nueve cuadernos de `src/clients/jupyter/` que copian esos `.txt`
- `docs/DATABASE.md`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`
- `docs/CONSTITUTIONS.md`
- `package.json` (script nuevo para arrancar el servidor de la base)

No se toca:

- `src/queries/queries/*.sql`
- `src/clients/http/**`
- `src/clients/web/**`
- `pnpm-lock.yaml`, `eslint.config.js`

## Parecido

`src/db/server.js` abre `users.sqlite` como hacía `connections.js` y ejecuta
cada sentencia con `exec`, `get`, `all` o `run`. `user.js` sigue exportando
las mismas ocho operaciones con los mismos parámetros de entrada; solo deja
de usar `readFileSync` y `db.prepare` y pasa a `fetch`.

Cada fichero de `logic/` sigue el mismo orden de validación, reglas, query y
salida; añade `await` dentro del `try` que ya envuelve la query.

## Firma

Las funciones de `logic/` conservan nombre y parámetros. Todas devuelven una
`Promise` con el mismo valor que devolvían en síncrono.

En `queries/user.js`:

- `createUsersTable()` — ya no recibe `database`.
- `insert(user)`, `findById(id)`, `findByEmail(email)`, `findByName(name)`,
  `findAll()`, `update(user)`, `remove(id)` — mismos parámetros.

Cada una es `async` y devuelve una promesa.

## Servidor (`src/db/server.js`)

- Abre la única base `src/db/users.sqlite` con `DatabaseSync`.
- Arranca con `pnpm server` desde first-app (script `server` en `package.json`:
  `node src/db/server.js`). Escucha en `127.0.0.1:3000`. Importar `user.js`
  no arranca el servidor.
- Al arrancar lee cada `.sql` de `src/queries/queries/` y lo guarda en un
  objeto cuya clave es el nombre del fichero.
- Atiende `POST /execute`. El cuerpo es `{ "method", "file", "params" }`.
  `method` es `exec`, `get`, `all` o `run`. `file` es el nombre del `.sql`.
  `params` es el objeto de parámetros (`id`, `name`, `email`), o `{}`.
- Un fichero que no esté en esa carpeta, o un `method` distinto de esos
  cuatro, responde con error HTTP. `OPTIONS` responde 204 con
  `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: POST` y
  `Access-Control-Allow-Headers: content-type`. Las respuestas JSON llevan
  `Access-Control-Allow-Origin: *`.
- Ejecución:

  | función            | file                        | method |
  | ------------------ | --------------------------- | ------ |
  | createUsersTable   | create-users-table.sql      | exec   |
  | insert             | insert.sql                  | get    |
  | findById           | find-by-id.sql              | get    |
  | findByEmail        | find-by-email.sql           | get    |
  | findByName         | find-by-name.sql            | all    |
  | findAll            | find-all.sql                | all    |
  | update             | update.sql                  | get    |
  | remove             | remove.sql                  | run    |

- Respuesta JSON: fila, lista de filas, `{ "changes", "lastInsertRowid" }` como
  números para `run`, `null` si `exec` termina o si `get` no devuelve fila.
  `user.js` convierte ese `null` en `undefined`.
- Si SQLite lanza, el servidor responde con error HTTP; `user.js` lanza y el
  `catch` de `logic/` sigue produciendo el mismo `DatabaseError`.
- Implementación con `node:http` y sin dependencias nuevas.

## Cliente de queries (`src/queries/user.js`)

- Quita `readFileSync` y el import de `../db/connections.js`.
- Cada función exportada hace `POST http://127.0.0.1:3000/execute` con el
  JSON `{ method, file, params }` descrito arriba.
- Si la respuesta no es correcta, lanza.
- Si el cuerpo es `null`, devuelve `undefined`.

## Logic

- Cada función exportada pasa a `async`.
- Donde hoy se llama a una query dentro de `try`, se usa `await`.
- Fuera del `try` siguen los `if` con `NotFoundError`, `ConflictError`, etc.

`usersGenderCount` también hace `await findAll()`. El uso de OpenAI no cambia;
ese fichero sigue ligado a Node.

## Clientes terminal y Jupyter

- En cada `.txt`, la llamada a `logic/` o a `createUsersTable` lleva `await`.
  El heredoc sigue siendo un módulo ES (`node --input-type=module`).
- `create-user-table.txt` deja de importar la conexión; solo importa
  `createUsersTable` y hace `await createUsersTable()`.
- Los cuadernos copian el mismo texto que su `.txt`.

## HTTP y web

No se editan. Al quedar `logic/` en promesa, esos clientes quedan rotos hasta
adaptarlos en otro desarrollo. No pueden convivir en el puerto `3000` con
`server.js`.

## Errores

No hay mensaje nuevo. Los mismos `ValidationError`, `NotFoundError`,
`ConflictError` y `DatabaseError` de `docs/ERRORS.md`.

## Documentación

- `docs/DATABASE.md`: una sola base; la conexión y la ejecución del SQL viven
  en `server.js`; `user.js` pide el resultado por HTTP; los `.sql` siguen en
  `src/queries/queries/`.
- `docs/ARCHITECTURE.md`: sustituir `connections.js` por `server.js`; describir
  el `POST /execute` con `method`, `file` y `params`, y que `user.js` ya no
  abre la base; el script `server` de `package.json` arranca el servidor desde
  first-app.
- `docs/TREE.md`: `server.js` en lugar de `connections.js`.
- `docs/CONSTITUTIONS.md`: las funciones de `logic/` devuelven una promesa; la
  query sigue siendo `src/queries/user.js` pero ya no abre la base en el mismo
  proceso.

## Validación Socket

No aplica. No hay paquete nuevo.
