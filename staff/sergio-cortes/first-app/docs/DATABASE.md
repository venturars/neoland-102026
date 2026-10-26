# Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connections.js`. No se abre otra base de datos ni otra conexión.

La tabla se llama `users`. Su formato es este:

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`. La base asigna el número.
- `email`: `TEXT NOT NULL UNIQUE`.
- `name`: `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`. El alta no escribe esas columnas: las pone el default de la tabla. Al actualizar, el SQL pone `updatedAt = datetime('now', 'localtime')`.

## Queries

El SQL no vive dentro de la función que lo ejecuta. Vive aparte.

`queries/queries/` contiene solo SQL agnóstico. Cada sentencia está en su propio `.sql`, sin JavaScript.

`queries/` contiene la función que llama a ese SQL. En este proyecto es `queries/user.js`: lee el `.sql`, lo guarda en una constante y, al final del fichero, la función exportada lo ejecuta con `run`, `all` o `get`.
