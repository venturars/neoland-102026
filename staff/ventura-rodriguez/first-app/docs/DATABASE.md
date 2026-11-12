# Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: la que abre `db/server.js`. No se exporta. No se abre otra base de datos ni otra conexión.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo adecuado es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

## Queries

El SQL no vive dentro de la función que lo ejecuta.

- `queries/queries/` tiene un módulo `.js` por query. Ese fichero exporta el texto, con parámetros con nombre (`:id`, `:name`, `:email`).
- `queries/users.js` importa ese texto y `db/server.js` lo ejecuta. Las funciones de este fichero se pueden reutilizar desde `logic/`.
