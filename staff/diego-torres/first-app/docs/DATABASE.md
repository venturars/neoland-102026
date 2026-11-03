# Base de datos

Hay una sola base, `src/db/users.sqlite`, y una sola conexión: el `db` que exporta `src/db/connection.js` con `node:sqlite`. El fichero no se sube a git.

## Tabla `users`

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo.
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `createdAt` y `updatedAt` son `TEXT NOT NULL`, con la fecha `YYYY-MM-DD HH:MM:SS` de `datetime('now', 'localtime')`.

## Servidor

`src/db/server.js` escucha solo en `127.0.0.1:3000`. Al arrancar crea la tabla si no existe.

`POST /execute` recibe `{ method, sql, params }`:

| `method` | Responde |
| --- | --- |
| `exec` | `{ ok: true }` |
| `get` | `{ row }`, con `null` si no hay fila |
| `all` | `{ rows }` |
| `run` | `{ changes }` |

Cualquier otra cosa, o un fallo de SQLite, da 500 con el cuerpo vacío.

Una web de otro origen no puede llamar a `/execute`:

- no hay cabeceras CORS, así que no puede leer la respuesta;
- solo se acepta `Content-Type: application/json`, que obliga al navegador a pedir permiso antes, y ese permiso nunca se da (si no, 415);
- si llega una cabecera `Origin` distinta de `http://127.0.0.1:3000`, se responde 403;
- si la cabecera `Host` no es `127.0.0.1:3000`, se responde 403. Por eso la app se abre con `127.0.0.1` y no con `localhost`.

`GET` sirve solo `.html`, `.css` y `.js`, y solo de estas carpetas:

| Ruta | Carpeta |
| --- | --- |
| `/` y `/<fichero>` | `src/clients/web/` |
| `/logic/…` | `src/logic/` |
| `/queries/…` | `src/queries/` |

`src/db/` no se sirve nunca.

## Consultas

`src/queries/queries/` tiene un fichero `.js` por consulta. Cada uno exporta una constante en mayúsculas con el texto SQL. Los parámetros van con nombre: `:id`, `:name` y `:email`.

`src/queries/users.js` envía cada consulta a `http://127.0.0.1:3000/execute` y devuelve las filas tal cual. Si el servidor no responde bien, lanza un `Error`, que `logic` traduce.
