# Base de datos

Hay una sola base: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connection.js`. Si existe `USERS_DB_PATH`, se usa ese fichero. `db/users.sqlite` existe en disco y no se sube a git.

El texto SQL vive en `queries/queries/`. Hay un fichero `.sql` por sentencia, con parámetros con nombre (`:id`, `:name`, `:email`). `queries/users.js` lo lee y lo ejecuta. Ahí no se decide si un email es válido.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE`. El tipo es `TEXT` con `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

Una persona que devuelve logic es un objeto plano con exactamente `id`, `name`, `email`, `createdAt` y `updatedAt`. No se devuelve la fila cruda de SQLite.

El email se recorta, se pasa a minúsculas y lleva un solo `@`, con las dos partes llenas, sin espacios y con longitud de hasta 64. Si no, no es un email válido.
