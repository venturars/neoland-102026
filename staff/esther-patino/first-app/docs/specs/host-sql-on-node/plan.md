# Plan — base en un servidor

Issue: #818.

No es una funcionalidad nueva. Los ficheros de `src/logic/` se quedan. Sus funciones pasan a ser async. El nombre y los parámetros no cambian. No hay paquete nuevo. No hay mensaje nuevo.

No entra Socket. No se añade ningún paquete de Node. El servidor usa `node:http` y `node:sqlite`. La capa de consultas usa `fetch`, que ya está en Node y en el navegador.

Esas comprobaciones ya están hechas: `fetch` a un servidor local devuelve la fila. `fetch` de un `file://` falla. `statement.get` sin fila devuelve `undefined` y en JSON esa ausencia es `null`. `statement.all` devuelve `[]`. `statement.run` devuelve `changes` como número. Esa comprobación del `file://` se queda. `docs/specs/open-screens-from-disk` abre la página desde el disco y llama a las reglas, que siguen pidiendo la ejecución a `http://127.0.0.1:3000/execute`.

## Decisión

La base se usa por un servidor Node propio. `src/db/server.js` escucha en `http://127.0.0.1:3000`, solo responde a `/execute` y no exporta la conexión. `package.json` gana el script `server`.

`pnpm start` sigue sirviendo las pantallas y también usa el puerto 3000. No se lanzan a la vez. Este cambio no mueve las pantallas. `docs/specs/open-screens-from-disk` sustituye después ese servicio: las pantallas se abren con `pnpm open` y la base sigue en `pnpm server`.

Cada consulta vive en su módulo, aparte de `src/queries/users.js`. Ese módulo exporta el texto. `users.js` lo importa. No lee el disco. No hay una petición para leer el archivo: el texto viaja dentro del módulo, también en el navegador.

`users.js` pide al servidor que ejecute ese texto. Las funciones de `src/logic/` esperan esa respuesta con `await`. El orden del cuerpo no cambia. Quien imprime el resultado también espera.

`src/logic/users-gender-count.js` sigue importando `openai`. Solo espera a `findAll`.

Se modifican `docs/ARCHITECTURE.md`, `docs/database.md`, `docs/tree.md`, `docs/CONSTITUTIONS.md` y `docs/style.md`.

## Ficheros

Se crea `src/db/server.js`. Ahí viven la dirección, la conexión y el servidor. No hay `origin.js`.

Se crean:

- `src/queries/queries/create-users-table.js`
- `src/queries/queries/find-by-id.js`
- `src/queries/queries/find-by-email.js`
- `src/queries/queries/find-by-name.js`
- `src/queries/queries/find-all.js`
- `src/queries/queries/insert.js`
- `src/queries/queries/update.js`
- `src/queries/queries/remove.js`
- `src/queries/queries/list-tables.js`

Se borran `src/db/connection.js` y los ocho `.sql` de `src/queries/queries/`.

Se tocan:

- `src/queries/users.js`
- `src/logic/create-user.js`
- `src/logic/update-user.js`
- `src/logic/delete-user.js`
- `src/logic/list-users.js`
- `src/logic/find-user-by-email.js`
- `src/logic/find-user-by-id.js`
- `src/logic/find-user-by-name.js`
- `src/logic/users-gender-count.js`
- `src/clients/http/handle-users.js`
- `src/clients/terminal/insert-user.txt`
- `src/clients/terminal/update-user.txt`
- `src/clients/terminal/remove-user.txt`
- `src/clients/terminal/find-all.txt`
- `src/clients/terminal/find-by-email.txt`
- `src/clients/terminal/find-by-id.txt`
- `src/clients/terminal/find-user-by-name.txt`
- `src/clients/terminal/create-users-table.txt`
- `src/clients/jupyter/insert-user.ipynb`
- `src/clients/jupyter/update-user.ipynb`
- `src/clients/jupyter/remove-user.ipynb`
- `src/clients/jupyter/find-all.ipynb`
- `src/clients/jupyter/find-by-email.ipynb`
- `src/clients/jupyter/find-by-id.ipynb`
- `src/clients/jupyter/find-user-by-name.ipynb`
- `src/clients/jupyter/create-users-table.ipynb`
- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/database.md`
- `docs/tree.md`
- `docs/CONSTITUTIONS.md`
- `docs/style.md`

No se toca `src/clients/terminal/users-gender-count.txt`. No se toca `src/clients/jupyter/users-gender-count.ipynb`. Esos dos ya esperan. No se toca `src/clients/web/`.

`list-tables.js` es el `SELECT` que el cliente de la tabla pasa a ejecutar. Sale del cliente y queda aparte de `users.js`.

`src/clients/http/handle-users.js` llama a `src/logic/`. Esas llamadas pasan a esperar. Las rutas no cambian.

## Servidor

`src/db/server.js` es el único fichero de `src/db/` junto a `users.sqlite`. No exporta `db`.

La constante `ORIGIN` vale `http://127.0.0.1:3000`.

La conexión es la que hoy abre `src/db/connection.js`: `DatabaseSync` sobre `users.sqlite`, al lado de este fichero. `node:sqlite`, `node:path` y `node:url` se quedan en este fichero. No lee `create-users-table.sql`: ese texto lo pide `createUsersTable()`.

El servidor escucha en el puerto y el host de `ORIGIN`. Al escuchar, hace `console.log` de `ORIGIN`.

`package.json` tiene el script `server`. Ejecuta `node src/db/server.js`. El script `start` no cambia.

Solo responde a `/execute`. Toda respuesta lleva `access-control-allow-origin` con `*`. Un `OPTIONS` responde 204 con `access-control-allow-methods` en `POST` y `access-control-allow-headers` en `content-type`.

Un `POST /execute` lee el cuerpo JSON. Trae `method`, `sql` y `params`.

- `exec` llama a `db.exec(sql)` y responde `{ "ok": true }`.
- `get` prepara `sql`, llama a `get(params)` y responde `{ "row": fila o null }`.
- `all` prepara `sql`, llama a `all(params)` y responde `{ "rows": filas }`.
- `run` prepara `sql`, llama a `run(params)` y responde `{ "changes": número }`.

Si SQLite lanza, la respuesta es 500. Otra ruta o otro método responde 404.

## Consultas

Cada módulo exporta una constante en mayúsculas. El texto es el de ahora. Los parámetros con nombre se quedan.

`create-users-table.js` exporta `CREATE_USERS_TABLE`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email VARCHAR(64) NOT NULL UNIQUE,
  createdAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
```

`find-by-id.js` exporta `FIND_BY_ID`:

```sql
SELECT * FROM users WHERE id = :id
```

`find-by-email.js` exporta `FIND_BY_EMAIL`:

```sql
SELECT * FROM users WHERE email = :email
```

`find-by-name.js` exporta `FIND_BY_NAME`:

```sql
SELECT * FROM users WHERE name = :name ORDER BY id
```

`find-all.js` exporta `FIND_ALL`:

```sql
SELECT * FROM users ORDER BY id
```

`insert.js` exporta `INSERT_USER`:

```sql
INSERT INTO users (name, email)
VALUES (:name, :email)
RETURNING *
```

`update.js` exporta `UPDATE_USER`:

```sql
UPDATE users
SET name = :name,
    email = :email,
    updatedAt = datetime('now', 'localtime')
WHERE id = :id
RETURNING *
```

`remove.js` exporta `REMOVE_USER`:

```sql
DELETE FROM users WHERE id = :id
```

`list-tables.js` exporta `LIST_TABLES`:

```sql
SELECT name FROM sqlite_master WHERE type = 'table'
```

`src/queries/users.js` importa esas constantes. No importa `node:fs`, `node:path`, `node:url`, `db` ni `server.js`. Importar `server.js` cargaría Node en el cliente.

Una función `execute(method, sql, params)` hace `POST` a `http://127.0.0.1:3000/execute`. El cuerpo es `{ method, sql, params }`. La cabecera `content-type` es `application/json`. Si la respuesta no es ok, lanza `Error`. Si es ok, devuelve el JSON.

Ese `Error` no es un mensaje de la lista. Donde `src/logic/` ya tiene un `try`, lo sustituye por la frase que ya usa. No se añade un `try` nuevo: en esta app solo lo tienen `find-user-by-name.js` y `users-gender-count.js`.

Las funciones exportadas quedan así. El nombre y los parámetros de las que ya existen no cambian. Pasan a ser async.

- `createUsersTable()` llama a `execute("exec", CREATE_USERS_TABLE, {})` y no devuelve nada.
- `findById(id)` llama a `execute("get", FIND_BY_ID, { id })` y devuelve `row`.
- `findByEmail(email)` llama a `execute("get", FIND_BY_EMAIL, { email })` y devuelve `row`.
- `findByName(name)` llama a `execute("all", FIND_BY_NAME, { name })` y devuelve `rows`.
- `insertUser({ name, email })` llama a `execute("get", INSERT_USER, { name, email })` y devuelve `row`.
- `updateUser({ id, name, email })` llama a `execute("get", UPDATE_USER, { id, name, email })` y devuelve `row`.
- `removeUser(id)` llama a `execute("run", REMOVE_USER, { id })` y devuelve el cuerpo.
- `findAll()` llama a `execute("all", FIND_ALL, {})` y devuelve `rows`.
- `listTables()` llama a `execute("all", LIST_TABLES, {})` y devuelve `rows`.

`row` puede ser `null`. Las comprobaciones de `src/logic/` siguen valiendo porque `null` no pasa un `if (fila)`.

## Logic

Cada función exportada pasa a ser async. La llamada a `src/queries/` lleva `await` en el sitio donde ya está. El resto de la función no cambia.

- `createUser(input)` espera a `findByEmail` y a `insertUser`.
- `updateUser(id, changes)` espera a `findById`, a `findByEmail` y a `saveUser`.
- `deleteUser(id)` espera a `findById` y a `removeUser`.
- `listUsers()` espera a `findAll`.
- `findUserByEmail(email)` espera a `findByEmail`.
- `findUserById(id)` espera a `findById`.
- `findUserByName(name)` espera a `findByName` dentro del `try` que ya tiene.
- `usersGenderCount()` espera a `findAll` dentro del `try` que ya tiene.

Las reexportaciones se quedan.

## Clientes

En cada cliente de terminal que llama a una función, la llamada lleva `await`. El import no cambia. `users-gender-count.txt` ya tiene `await` y se queda.

`create-users-table.txt` deja de importar `db`. Espera a `createUsersTable()` y a `listTables()`, e imprime lo que devuelve `listTables()`.

En cada notebook, el programa de Node pone `await` en la llamada. El resto del documento no cambia. `users-gender-count.ipynb` ya espera y se queda.

`create-users-table.ipynb` deja de importar `db`. Espera a `createUsersTable()` y a `listTables()`. La tabla sigue dibujando la columna `name`.

`handle-users.js` espera a `listUsers`, `findUserById`, `updateUser` y `deleteUser`.

## Documentación

En `docs/ARCHITECTURE.md`, las líneas de la base y de las consultas quedan así. El resto no cambia.

```
- `src/db/` abre la base de datos y no contiene reglas de negocio.
- `src/db/server.js` es el único fichero de esa capa junto a la base. Abre la única conexión, guarda la dirección `http://127.0.0.1:3000` y ejecuta el SQL que recibe. No exporta la conexión.
- `src/db/users.sqlite` es el único fichero de la base de datos.
- `src/queries/queries/` guarda el texto de cada consulta. Hay un módulo `.js` por consulta. Exporta el texto y no lo ejecuta.
- `src/queries/users.js` importa ese texto y pide la ejecución al servidor. No importa `src/db/server.js`. No hay reglas de negocio en `src/queries/`.
- `src/logic/` es el núcleo de la app. Aquí viven las reglas de negocio. Una funcionalidad por fichero. Cada función es async y espera a `src/queries/`.
```

La línea de `src/clients/terminal/` dice que llama con `await`. `create-users-table.txt` llama a `src/queries/users.js` con `await` y no importa la conexión.

En `docs/database.md`, la primera frase queda así. La tabla `users` no cambia.

```
Hay una sola base de datos: `src/db/users.sqlite`. Hay una sola conexión: la que abre `src/db/server.js`. No se exporta. No se abre otra base de datos ni otra conexión.
```

La sección de queries dice que cada consulta es un módulo `.js` que exporta el texto, y que `src/queries/users.js` lo importa y `src/db/server.js` lo ejecuta.

En `docs/tree.md`, `db/` muestra `server.js` y `users.sqlite`. `queries/queries/` muestra los módulos `.js` y ya no los `.sql`. El resto del árbol no cambia.

`docs/CONSTITUTIONS.md` dice que la base se abre desde ese servidor y que quien pide los datos no la abre.

`docs/style.md` dice que la lógica no abre los `.sql` y que espera a la consulta. El comando de la base es `pnpm server`. El de las pantallas lo sustituye después `docs/specs/open-screens-from-disk`: es `pnpm open`.

## Errores

No hay un mensaje nuevo.

| Fallo de la spec                                   | Mensaje                                                 |
| -------------------------------------------------- | ------------------------------------------------------- |
| El nombre no vale                                  | `Name is empty`                                         |
| El email no vale                                   | `Email is invalid`                                      |
| Ese email ya está en otro usuario                  | `Email is already used`                                 |
| El id no vale                                      | `Invalid id`                                            |
| Se busca, se cambia o se borra alguien que no está | `User not found`                                        |
| Falla la búsqueda por nombre                       | `Could not find the user`                               |
| La cuenta del sexo no puede hacerse                | `Could not classify the users`                          |
| No se llega a la base                              | la frase que esa función ya usa, si ya captura el fallo |
