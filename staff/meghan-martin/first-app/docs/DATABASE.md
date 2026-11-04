# Base de datos

Hay una sola base: `src/db/users.sqlite`. Hay una sola conexión: el `db` que exporta `src/db/connection.js`. Solo `src/db/server.js` la importa. Si existe `USERS_DB_PATH` en ese programa, se usa ese fichero. `src/db/users.sqlite` existe en disco y no se sube a git.

El programa se arranca con `npm run db` desde `first-app` y escucha en `http://127.0.0.1:3000`. Si no está en marcha, la operación termina con `Database is not running. Start it with npm run db.`

El texto SQL vive en `src/queries/users-sql.js`, con parámetros con nombre (`:id`, `:name`, `:email`). `src/queries/users.js` pide cada sentencia por su nombre. Ahí no se decide si un email es válido.

Tabla `users`:

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo: 1, 2, 3…
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE`. El tipo es `TEXT` con `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`.

Una persona que devuelve logic es un objeto plano con exactamente `id`, `name`, `email`, `createdAt` y `updatedAt`. No se devuelve la fila cruda de SQLite.

El email se recorta, se pasa a minúsculas y lleva un solo `@`, con las dos partes llenas, sin espacios y con longitud de hasta 64. Si no, no es un email válido.
