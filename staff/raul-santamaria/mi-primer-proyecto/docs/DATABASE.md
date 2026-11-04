# Base de datos

Hay una sola base: `src/db/users.sqlite`.

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`.
- `email`: `VARCHAR(64) NOT NULL UNIQUE`.
- `name`: `VARCHAR(64) NOT NULL`.
- `created_at`: fecha de alta. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- `updated_at`: fecha de última actualización. `TEXT` en ISO-8601 (`YYYY-MM-DD`).
- Una fecha se guarda como `TEXT` en ISO-8601 (`YYYY-MM-DD`). SQLite no valida un tipo `DATE`.

La conexión la abre `src/db/server.js` al arrancar `pnpm server`. No se exporta.
Las queries no abren ni cierran la base: piden al servidor por HTTP.

Las funciones de `src/queries/users.js` son async. Las de `src/logic/` también.

El `CREATE TABLE` vive en un módulo `.js` en `src/queries/queries/`.
`src/db/server.js` lo ejecuta al arrancar.

## Queries

Cada sentencia SQL es un módulo `.js` en `src/queries/queries/` que exporta
el texto. `src/queries/users.js` lo envía al servidor en `http://127.0.0.1:3000`.
