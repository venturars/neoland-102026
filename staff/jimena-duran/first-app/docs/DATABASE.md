# Base de datos y consultas

La aplicación utiliza únicamente `db/users.sqlite` y la conexión exportada por `db/connection.js`. No se crean bases ni conexiones alternativas.

La tabla `users` tiene estas reglas:

- `id` es `INTEGER PRIMARY KEY` y SQLite lo genera de forma incremental.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `name` es `TEXT NOT NULL`.
- `createdAt` y `updatedAt` se almacenan como `TEXT` con el formato `YYYY-MM-DD HH:MM:SS`, producido por `datetime('now', 'localtime')`.

## Consultas SQL

El texto SQL no se escribe dentro de la función de lógica que lo utiliza. En `queries/queries/` cada consulta tiene su propio `.sql`, que contiene solo SQL y parámetros nombrados (`:id`, `:name`, `:email`). `queries/users.js` carga esos archivos, prepara las sentencias con `db` y las ejecuta; sus funciones pueden ser llamadas desde `logic/`.
