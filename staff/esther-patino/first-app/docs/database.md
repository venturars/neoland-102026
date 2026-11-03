## La base de datos

Hay una sola base de datos: `src/db/users.sqlite`. Hay una sola conexión: la que abre `src/db/server.js`. No se exporta. No se abre otra base de datos ni otra conexión.

Ese archivo es el del proyecto y no se reemplaza. No se borra para empezar de cero, no se cambia por otra copia, no se renombra y no se abre otra ruta. Tampoco se usa una base en memoria.

La tabla se llama `users`. Las columnas son estas:

- `id INTEGER PRIMARY KEY`. Al insertar no se manda el id. SQLite pone el siguiente número: 1, luego 2, luego 3. Son valores incrementales.
- `name TEXT NOT NULL`.
- `email VARCHAR(64) NOT NULL UNIQUE`. Cabe en 64 caracteres y no puede repetirse.
- `createdAt TEXT NOT NULL`. Valor por defecto: `datetime('now', 'localtime')`.
- `updatedAt TEXT NOT NULL`. El mismo valor por defecto al crear.

Cada consulta es un módulo `.js` que exporta el texto. `src/queries/users.js` lo importa y `src/db/server.js` lo ejecuta. No hay reglas de negocio aquí. El SQL usa parámetros con nombre (`:id`, `:name`, `:email`).
