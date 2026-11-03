# Base de datos

Hay una sola base, `src/db/users.sqlite`, y un solo fichero que la abre: `src/db/server.js`, con `node:sqlite`. El fichero de la base no se sube a git.

## Tabla `users`

- `id` es `INTEGER PRIMARY KEY`. SQLite lo incrementa solo.
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`.
- `createdAt` y `updatedAt` son `TEXT NOT NULL`, con la fecha `YYYY-MM-DD HH:MM:SS` de `datetime('now', 'localtime')`.

## Servidor

`src/db/server.js` es todo `src/db/`. Abre la base, crea la tabla si no existe y escucha solo en `127.0.0.1:3000`. Solo atiende datos: no sirve la web ni ningún otro fichero. Cualquier ruta que no sea `/execute` da 404.

`POST /execute` recibe `{ method, sql, params }`:

| `method` | Responde |
| --- | --- |
| `exec` | `{ ok: true }` |
| `get` | `{ row }`, con `null` si no hay fila |
| `all` | `{ rows }` |
| `run` | `{ changes }` |

Cualquier otra cosa, o un fallo de SQLite, da 500 con el cuerpo vacío.

## Quién puede llamar a `/execute`

- **La terminal y Jupyter** llaman desde Node y no envían `Origin`.
- **La web** se abre como fichero con `pnpm browser`. Chrome la presenta con origen `file://` (por `--allow-file-access-from-files`), o `null` sin ese flag. Solo esos dos orígenes reciben permiso CORS, con `Access-Control-Allow-Origin` igual al origen que llega, en el `OPTIONS` previo y en el `POST`.
- **Otra web** tiene otro origen: el `OPTIONS` y el `POST` dan 403.

Además:

- Solo se acepta `Content-Type: application/json`; si no, 415. Así nadie puede mandar una petición «simple» sin pasar por el permiso.
- Si la cabecera `Host` no es `127.0.0.1:3000`, se responde 403. Protege del DNS rebinding.

Riesgo conocido: una página de otra web metida en un iframe con `sandbox` también tiene origen `null`, y cualquier otro fichero local abierto en ese Chrome tiene origen `file://`. Es el precio de abrir la web como fichero. El servidor solo escucha en `127.0.0.1` y no guarda nada sensible.

## Consultas

`src/queries/queries/` tiene un fichero `.js` por consulta. Cada uno exporta una constante en mayúsculas con el texto SQL. Los parámetros van con nombre: `:id`, `:name` y `:email`.

`src/queries/users.js` envía cada consulta a `http://127.0.0.1:3000/execute` y devuelve las filas tal cual. Si el servidor no responde bien, lanza un `Error`, que `logic` traduce.
