# Base de datos

Hay una sola base de datos: `src/db/users.sqlite`. Hay una sola conexión: la que abre `src/db/server.js` cuando arranca con `pnpm server` desde first-app. No se abre otra base de datos ni otra conexión.

La tabla se llama `users`. Su formato es este:

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`. La base asigna el número.
- `email`: `TEXT NOT NULL UNIQUE`.
- `name`: `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`. El alta no escribe esas columnas: las pone el default de la tabla. Al actualizar, el SQL pone `updatedAt = datetime('now', 'localtime')`.

## Queries

El SQL no vive dentro de la función que lo ejecuta. Vive aparte.

`src/queries/queries/` contiene solo SQL agnóstico. Cada sentencia está en su propio `.sql`, sin JavaScript.

`src/db/server.js` lee esos ficheros al arrancar y los guarda por nombre de fichero. Atiende `POST /execute` con `method`, `file` y `params`. `exec` crea la tabla y no devuelve fila. `get` devuelve una fila, o `null` si no hay. `all` devuelve la lista. `run` devuelve `changes` y `lastInsertRowid`.

`src/queries/user.js` pide ese resultado por HTTP. No abre la base ni lee los `.sql`. Cada función exportada es `async` y devuelve una promesa con el mismo valor que antes.

Búsqueda por nombre y email: `find-by-name.sql` usa `LOWER(name) = LOWER(:name)` y ordena por `id`; `find-by-email.sql` usa `LOWER(email) = LOWER(:email)`. Solo aplica a esas búsquedas, no al resto de operaciones sobre `name` o `email`.
