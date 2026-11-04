# Plan — pantallas en el navegador

Cumple `docs/specs/sql-server-browser/spec.md`. Issue: #829.

No hay operación nueva. Crear, actualizar, eliminar, listar, buscar y contar el género se quedan. Sus nombres no cambian. No hay paquete nuevo. No entra Socket: el servidor usa `node:http` y `node:sqlite`. Quien pide ejecutar una consulta usa `fetch`, que ya está en Node y en el navegador.

## Ficheros

Se crea `src/db/server.js`. Ahí viven la dirección, la conexión y el servidor. No exporta la conexión.

Se crean, con el texto SQL que hoy está en el `.sql` del mismo nombre:

- `src/queries/queries/create-table-users.js`
- `src/queries/queries/create-user.js`
- `src/queries/queries/update-user.js`
- `src/queries/queries/delete-user.js`
- `src/queries/queries/list-users.js`
- `src/queries/queries/find-user-by-id.js`
- `src/queries/queries/find-user-by-email.js`
- `src/queries/queries/find-user-by-name.js`

Se borran `src/db/connection.js` y los ocho `.sql` de `src/queries/queries/`. `users.sqlite` se queda en `src/db/`.

Se crean:

- `src/clients/browser/index.html`
- `src/clients/browser/app.js`
- `src/clients/browser/styles.css`

Se tocan:

- `src/queries/users.js`
- `src/logic/create-user.js`
- `src/logic/update-user.js`
- `src/logic/delete-user.js`
- `src/logic/list-users.js`
- `src/logic/find-user-by-id.js`
- `src/logic/find-user-by-email.js`
- `src/logic/find-user-by-name.js`
- `package.json`

`src/logic/users-gender.js` no se toca: ya espera a `listUsers`. `src/logic/shared.js` no se toca. No se tocan `src/clients/terminal` ni `src/clients/jupyter`.

En el mismo cambio que el código se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/STYLE.md` y `docs/ERRORS.md`.

## Servidor

`src/db/server.js` es el único que abre la base. La constante `ORIGIN` vale `http://127.0.0.1:3000`. La conexión es `new DatabaseSync` sobre `users.sqlite`, al lado de este fichero. No importa lógica ni consultas. No sirve la página.

Escucha en el puerto y el host de `ORIGIN`. Al escuchar, hace `console.log` de `ORIGIN`.

`package.json` gana el script `server`: `node src/db/server.js`. Se lanza con `pnpm server` desde `first-app`.

Solo responde a `/execute`. Toda respuesta lleva `access-control-allow-origin` con `*`. Un `OPTIONS` responde 204, con `access-control-allow-methods` en `POST` y `access-control-allow-headers` en `content-type`. Otra ruta u otro método responde 404.

Un `POST /execute` lee el cuerpo JSON. Trae `method`, `sql` y `params`. `params` es una lista, para los `?` que ya tiene cada consulta. Esa lista se reparte al llamar: `statement.run(...params)`, y lo mismo con `get` y `all`. Una lista vacía no añade parámetros.

- `exec` llama a `db.exec(sql)` y responde `{ "ok": true }`.
- `get` responde `{ "row": fila o null }`. Si no hay fila, `get` devuelve `undefined` y en JSON esa ausencia es `null`.
- `all` responde `{ "rows": filas }`. Sin filas, `[]`.
- `run` responde `{ "changes": número, "lastInsertRowid": número }`. `lastInsertRowid` sale como número, porque JSON no guarda un entero grande.

Si el cuerpo no es JSON, o SQLite lanza, la respuesta es 500 con `{ "message": texto }`. El texto es el de ese error. Un email repetido sigue saliendo con el texto de SQLite.

## Consultas

Cada módulo exporta una constante en mayúsculas. El texto no cambia. Siguen los `?`, en el mismo orden.

`create-table-users.js` exporta `CREATE_TABLE_USERS`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);
```

`create-user.js` exporta `CREATE_USER`:

```sql
INSERT INTO users (name, email)
VALUES (?, ?);
```

`update-user.js` exporta `UPDATE_USER`:

```sql
UPDATE users
SET name = COALESCE(?, name),
    email = COALESCE(?, email)
WHERE id = ?;
```

`delete-user.js` exporta `DELETE_USER`:

```sql
DELETE FROM users
WHERE id = ?;
```

`list-users.js` exporta `LIST_USERS`:

```sql
SELECT *
FROM users;
```

`find-user-by-id.js` exporta `FIND_USER_BY_ID`:

```sql
SELECT *
FROM users
WHERE id = ?;
```

`find-user-by-email.js` exporta `FIND_USER_BY_EMAIL`:

```sql
SELECT *
FROM users
WHERE email = ?;
```

`find-user-by-name.js` exporta `FIND_USER_BY_NAME`:

```sql
SELECT *
FROM users
WHERE name = ?;
```

`src/queries/users.js` importa esas constantes. No lee el disco. No abre la base. No usa `try/catch`.

Pide la ejecución a `http://127.0.0.1:3000/execute` con `POST` y `content-type` `application/json`. Si la respuesta no es correcta, lanza un `Error` con `message`. Si lo es, usa el cuerpo.

Antes de cada operación espera a `createTableUsers`. `createTableUsers` pide `exec` con `CREATE_TABLE_USERS` y no se llama a sí misma.

Las funciones siguen llamándose igual:

- `createUser(name, email)` pide `run` con `[name, email]` y devuelve `{ id, name, email }`. El `id` es `lastInsertRowid`.
- `updateUser(id, name, email)` pide `run` con `[name, email, id]` y devuelve `changes`.
- `deleteUser(id)` pide `run` con `[id]` y devuelve `changes`.
- `listUsers()` pide `all` con `[]` y devuelve la lista. Cada usuario es `{ id, name, email }` y el `id` es número.
- `findUserById(id)` pide `get` con `[id]`. Si `row` es `null`, devuelve `undefined`. Si no, `{ id, name, email }`.
- `findUserByEmail(email)` igual, con `[email]`.
- `findUserByName(name)` pide `all` con `[name]` y devuelve la lista.

Esas funciones pasan a ser `async`.

## Lógica

La firma no cambia. Donde hoy se usa el resultado de `src/queries/users.js` en la misma línea, se espera con `await`. El orden del cuerpo no cambia. Los mensajes no cambian.

- `createUser` espera a `users.createUser`.
- `updateUser` espera a `users.updateUser` antes de comparar con `0`.
- `deleteUser` espera a `users.deleteUser` antes de comparar con `0`.
- `listUsers` espera a `users.listUsers`.
- `findUserById` espera a `users.findUserById`.
- `findUserByEmail` espera a `users.findUserByEmail`.
- `findUserByName` espera a `users.findUserByName` antes de mirar `length`.

`usersGender` sigue igual. Si listar falla porque el programa local no está, sigue lanzando `no se han podido clasificar usuarios`.

## Cliente

La página no se sirve. `index.html` carga `styles.css` y `app.js` con `type="module"`. `app.js` importa solo `listUsers`, `updateUser` y `deleteUser` desde `src/logic/`, con rutas relativas. No importa contar el género, así que `openai` no entra en la página. No llama a `/execute`. No valida por su cuenta: si la lógica lanza, muestra `error.message`.

El texto que ve la persona está en español. El código está en inglés.

Hay cuatro pantallas. Se ve una cada vez.

La lista muestra cada usuario con su id, su nombre y su email. Si no hay ninguno, no hay filas. Un campo pide el id y un botón lo elige. Si ese id no está en la lista, la lista se queda. Si el texto no es un entero positivo, se ve `User id must be a positive integer`. Si es un entero positivo y no está, se ve `User ${id} was not found`.

El menú muestra el nombre y el id elegidos. Tres caminos: volver a la lista, modificar y notas. Volver no guarda nada y vuelve a cargar la lista.

Modificar muestra el id y deja el nombre y el email. Guardar llama a `updateUser(id, { name, email })`. Eliminar llama a `deleteUser(id)`. Si la llamada termina, se vuelve a la lista y esa lista ya muestra el cambio. Si lanza, se queda en modificar y se ve el mismo texto de siempre: `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `Provide a name or an email to update`, `User ${id} was not found`, o el texto de SQLite si el email ya existe. Un botón volver regresa al menú sin guardar.

Notas no tiene utilidad. No lee, no guarda y no borra. Un botón volver regresa al menú.

`package.json` gana el script `browser`. Se lanza con `pnpm browser` desde `first-app`, en Windows. Abre Brave con un perfil en `%TEMP%\first-app-brave`, el permiso `--allow-file-access-from-files` y `src/clients/browser/index.html`. El comando es:

```text
start "" "%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe" --user-data-dir=%TEMP%\first-app-brave --no-first-run --no-default-browser-check --allow-file-access-from-files "%CD%\src\clients\browser\index.html"
```

El script `format` también escribe `src/clients/browser/**/*.js`. `pnpm-lock.yaml` no se toca.

## Documentación

`docs/ARCHITECTURE.md` dice que las consultas se ejecutan en un programa local, en `127.0.0.1:3000`, que solo ejecuta consultas. Las pantallas del navegador son otra forma de listar, modificar y eliminar. Importan la lógica. No hay otra vía de usuarios. Terminal y Jupyter siguen, con ese programa en marcha.

`docs/TREE.md` cambia `connection.js` por `server.js`, los `.sql` por los `.js` de cada consulta, y añade `clients/browser/` con `index.html`, `app.js` y `styles.css`.

`docs/DATABASE.md` dice que `src/db/server.js` abre `users.sqlite` y ejecuta lo que le piden en `/execute`. El texto de cada consulta vive en `src/queries/queries`, un módulo por operación. `src/queries/users.js` no abre la base: se lo pide a ese programa. Crea la tabla si no existe.

`docs/STYLE.md` deja de mandar `connection.js` y los `.sql`. El único que abre la base y ejecuta SQL es `src/db/server.js`. El texto va en el módulo de la consulta. `src/queries/users.js` pide la ejecución y espera. El cliente del navegador solo llama a `listUsers`, `updateUser` y `deleteUser`.

`docs/ERRORS.md` añade que, si el programa local no está en marcha, la operación no se completa y se ve el fallo de esa llamada.

`docs/CONSTITUTIONS.MD` y `AGENTS.MD` cuentan el programa local, las pantallas y los dos comandos `pnpm server` y `pnpm browser`. Quitan la frase que prohíbe pantalla y servidor. El desarrollo abierto pasa a ser `docs/specs/sql-server-browser/`. Los pasos de funcionamiento dicen que las consultas piden la ejecución a ese programa, y que la pantalla es otra forma de pedir listar, modificar y eliminar.

## Pregunta

La constitución, `AGENTS.MD` y el código dicen que la app no tiene pantalla ni servidor, que `src/db/connection.js` abre `users.sqlite` y no ejecuta SQL, y que cada consulta es un `.sql` que lee y ejecuta `src/queries/users.js`.

La spec pide pantallas en el navegador y un programa local en `127.0.0.1:3000` que solo ejecuta consultas, con el texto de cada consulta junto a quien pide ejecutarla.

¿Se actualizan la constitución y las guías para que digan lo mismo que la spec? Hasta esa respuesta no hay `tasks.md`.
