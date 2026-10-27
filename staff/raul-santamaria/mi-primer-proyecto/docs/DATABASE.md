# Base de datos

Hay una sola base: `db/users.sqlite`.

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`.
- `email`: `VARCHAR(64) NOT NULL UNIQUE`.
- `name`: `VARCHAR(64) NOT NULL`.
- `created_at`: fecha de alta. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- `updated_at`: fecha de última actualización. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- Una fecha se guarda como `TEXT` en ISO-8601 (`YYYY-MM-DD`). SQLite no valida un tipo `DATE`.

La conexión se abre al cargar `db/connection.js` y se queda abierta. Las queries no la abren ni la cierran.

El SQLite de Node ejecuta cada sentencia en el momento. Las funciones de `queries/users.js` son síncronas.

El `CREATE TABLE` vive en una query de `queries/queries/`. `queries/users.js` la lee y la ejecuta al cargar el módulo.

## Queries

Cada sentencia SQL es un fichero `.sql` en `queries/queries/`. Solo contiene SQL. `queries/users.js` lee esos ficheros y los ejecuta.
