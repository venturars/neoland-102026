# Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connection.js`. No se abre otra base de datos ni otra conexión.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo adecuado es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

## Queries

El SQL no vive dentro de la función que lo ejecuta.

- `queries/queries/` tiene un fichero `.sql` por query. Ese fichero contiene solo el texto SQL, con parámetros con nombre (`:id`, `:name`, `:email`).
- `queries/users.js` lee esos ficheros, prepara el texto con `db` y lo ejecuta. Las funciones de este fichero se pueden reutilizar desde `logic/`.
