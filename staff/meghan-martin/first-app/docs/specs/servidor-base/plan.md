# Plan — base en un programa local

Cumple `docs/specs/servidor-base/spec.md`. No hay paquetes nuevos ni SQL nuevo. Los parámetros siguen siendo `:id`, `:name` y `:email`.

## Tocar

- `src/queries/users-sql.js`: las sentencias que estaban en los `.sql`.
- `src/db/server.js`: el único que importa `src/db/connection.js`. Escucha en `127.0.0.1:3000`. Solo acepta `POST /query` con el nombre de una sentencia conocida.
- `src/queries/users.js`: pide esa sentencia y devuelve la misma fila, la misma lista o nada, como antes. Si no conecta, lanza `Database is not running. Start it with npm run db.`
- `src/logic/`: cada acción espera esa respuesta. Si el fallo es el de la base parada, deja esa frase. El resto de frases no cambia.
- `src/clients/terminal/*.txt` y `src/clients/jupyter/*.ipynb`: esperan la acción. Ya no abren la base ellos.
- `src/clients/browser/index.html`, `app.js` y `styles.css`: la página llama a `listUsers`, `findUserById`, `updateUser` y `deleteUser`. Se borra el servidor de páginas.
- `package.json`: el script `db` es `node src/db/server.js`. `browser` abre el HTML. No sirve la página.

No hay firma nueva. `createUsersTable` sigue creando la tabla solo cuando se pide, y devuelve los nombres de las tablas.

## Frases

La nueva, en `docs/ERRORS.md`:

- Base parada: `Database is not running. Start it with npm run db.`

Las demás se quedan.
