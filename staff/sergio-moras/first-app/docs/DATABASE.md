# Base de datos

## Fichero y conexión
- El fichero es `db/users.sqlite` (principio 4 de [CONSTITUTIONS.md](CONSTITUTIONS.md)). No está en git.
- Hay una sola conexión: la que exporta `db/connection.js`, con `node:sqlite`.
- La tabla se crea al abrir la conexión, si no existe.

## Tabla `users`
| Columna | Tipo |
|---|---|
| `id` | `INTEGER PRIMARY KEY AUTOINCREMENT` |
| `name` | `TEXT NOT NULL` |
| `email` | `TEXT NOT NULL UNIQUE` |
| `created_at` | `TEXT NOT NULL DEFAULT (datetime('now'))` |
| `updated_at` | `TEXT NOT NULL DEFAULT (datetime('now'))` |

- El email se guarda siempre sin espacios y en minúsculas.
- `updated_at` se actualiza en cada modificación.
- Las fechas se guardan como texto `YYYY-MM-DD HH:MM:SS`.

## SQL
- Todo el SQL vive en `queries/users.js`. No hay SQL fuera de `queries/`.
- Los valores van como parámetros `?`, nunca pegados al texto del SQL.
- `queries/` no valida ni decide mensajes.

## Campos que devuelve `logic/`
Lo que devuelve `logic/` usa camelCase: `id`, `name`, `email`, `createdAt` y `updatedAt`. La traducción desde `created_at` y `updated_at` la hace `logic/`. Las columnas de la tabla no cambian.

Hoy `logic/` todavía devuelve `created_at` y `updated_at`. Lo alinea la tarea que aplica las guías al código.

## Pruebas
Cómo se prueba sin tocar los datos: principio 4 de [CONSTITUTIONS.md](CONSTITUTIONS.md).
