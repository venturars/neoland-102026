# Base de datos

- Motor: SQLite con `node:sqlite`.
- Un solo fichero: `db/users.sqlite`.
- Una sola conexión: `db/connection.js` abre ese fichero.
- `queries/users.js` crea la tabla `users` si no existe.

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

- `id` es un entero autonumérico. Lo asigna SQLite.
- `name` y `email` son texto. Un nombre o un correo no son un número.
- `created_at` y `updated_at` son fechas. SQLite rellena `created_at` al insertar.
- `email` es único en la tabla.

`db/` no valida el formato del email ni decide si se puede borrar un usuario.

## Queries

`queries/` tiene una subcarpeta, `queries/queries/`. Cada consulta vive en su fichero `.sql`.

`users.js` lee ese fichero y lo ejecuta con `db.exec` o `db.prepare`. Los parámetros son `:id`, `:name` y `:email`.

Queries no valida nombre, email ni unicidad de negocio. Queries no captura errores. Eso es logic.
