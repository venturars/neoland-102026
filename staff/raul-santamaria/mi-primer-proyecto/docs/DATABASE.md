# Base de datos

Hay una sola base: `src/db/users.sqlite`.

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`.
- `email`: `VARCHAR(64) NOT NULL UNIQUE`.
- `name`: `VARCHAR(64) NOT NULL`.
- `created_at`: fecha de alta. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- `updated_at`: fecha de última actualización. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- Una fecha se guarda como `TEXT` en ISO-8601 (`YYYY-MM-DD`). SQLite no valida un tipo `DATE`.

La conexión vive en `src/db/server.js`. Ese proceso arranca con `pnpm server`,
ejecuta el SQL que recibe por `POST /execute` en `http://127.0.0.1:3000` y no
exporta la conexión. Al arrancar, crea la tabla si no existe.

Las funciones de `src/queries/users.js` son async. Piden al servidor cada
sentencia con `fetch`. Las de `src/logic/` también.

El `CREATE TABLE` vive en un módulo `.js` en `src/queries/queries/`.

## Queries

Cada sentencia SQL es un módulo `.js` en `src/queries/queries/` que exporta el
texto. `src/queries/users.js` lo importa y lo envía al servidor.
