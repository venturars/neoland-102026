# Base de datos

## `src/db/server.js`

Es el servidor de datos y el único proceso que abre SQLite, con `node:sqlite`. Escucha en `127.0.0.1:3000` y tiene una sola ruta, `POST /execute`, que recibe `{ method, sql, params }`:

| `method` | Qué hace                  | Respuesta `200`                |
| -------- | ------------------------- | ------------------------------ |
| `exec`   | Ejecuta el SQL sin filas. | `{ ok: true }`                 |
| `get`    | Lee una fila.             | `{ row }`, o `{ row: null }`   |
| `all`    | Lee todas las filas.      | `{ rows }`                     |
| `run`    | Escribe.                  | `{ changes, lastInsertRowid }` |

Otra ruta u otro `method` responden `404`. Un JSON mal formado o un fallo de SQLite responden `500` sin cuerpo, para no enseñar detalles de la base. Añade `access-control-allow-origin: *` porque la página del navegador se abre desde `file://`.

Al arrancar crea la tabla `users` si todavía no existe.

`src/db/users.sqlite` es la base de la aplicación. Si el servidor arranca con `FIRST_APP_DATABASE_FILE`, abre esa ruta. Como todos los clientes pasan por el servidor, todos usan ese archivo.

## `src/queries/users.js`

Es la capa de ejecución de consultas. No abre SQLite ni lee archivos: importa el SQL de `src/queries/queries/` y lo envía al servidor de datos con `fetch`, mediante su única función `execute(method, sql, params)`. Por eso solo usa `import` y `fetch`, y funciona igual en Node y en el navegador.

Sus funciones son `async`. Si el servidor responde con error o no está arrancado, lanzan `Error("Query failed")`; `src/logic/` cambia ese error por el suyo.

## `src/queries/queries/`

Contiene un módulo `.js` por consulta. Cada uno exporta el texto SQL como una constante en mayúsculas, por ejemplo `INSERT_USER`. No contiene funciones ni reglas de negocio.

## Usuario

La tabla `users` contiene:

- `id`;
- `name`;
- `email`;
- `created_at`;
- `updated_at`.

Las reglas de tipo, formato y validación de cada campo están en «Tipos y formatos».

En una base creada con el script actual, `created_at` y `updated_at` usan `DEFAULT (datetime('now', 'localtime'))`. Las consultas de alta y de modificación también escriben esa fecha en SQL. `CREATE TABLE IF NOT EXISTS` no cambia una tabla que ya existía.

## Tipos y formatos

Cada tipo es el de JavaScript y el de SQLite. Un valor de otro tipo no se convierte en silencio: se rechaza.

### `id`

- JavaScript `number`, SQLite `INTEGER`. SQLite lo genera al crear el usuario.
- Número entero mayor que cero. Se rechazan texto, decimales, cero, negativos y `NaN`.
- Validación: `Number.isInteger(id) && id > 0`.

### `name`

- JavaScript `string`, SQLite `TEXT NOT NULL`.
- Se aplica `trim()` y, después, no puede quedar vacío.
- Se rechazan `""`, `"   "`, `null` y `123`. Válido: `Ada Lovelace`.

### `email`

- JavaScript `string` con una dirección de email válida, SQLite `TEXT NOT NULL UNIQUE`. No puede repetirse.
- Se aplica `trim().toLowerCase()`.
- Un único `@`, con contenido a ambos lados, y como máximo 64 caracteres.
- La comprobación se escribe en pasos visibles: `split("@")`, un solo `@`, texto a ambos lados y longitud. No se sustituye por una expresión regular.
- Se rechazan `ada`, `@example.com`, `ada@`, `ada@@example.com`, `""` y `null`. Válido: `ada@example.com`.
- El formulario del navegador usa `<input type="email" />`, pero no sustituye la validación de `src/logic/`.

### `created_at` y `updated_at`

- JavaScript `string`, SQLite `TEXT NOT NULL`.
- Las genera SQLite, como se explica en «Usuario».
- `src/logic/` decide cuándo se crea o se modifica un usuario, pero no calcula estas fechas con `new Date()` ni las envía a la consulta.
- No se aceptan desde el cliente.

## Decisiones fundamentales

- Solo el servidor de datos abre SQLite. Ningún cliente, ni `src/logic/`, ni `src/queries/` lo hace.
- La base de la aplicación es `src/db/users.sqlite`. El servidor solo abre otro archivo si arranca con `FIRST_APP_DATABASE_FILE`.
- Cada consulta SQL tiene su propio módulo.
- Las consultas se ejecutan desde `src/queries/users.js`.

## Reglas de implementación

- Utiliza parámetros SQL con nombre.
- Nunca concatenes datos del usuario dentro del SQL.
- No cambies el esquema como efecto secundario de otra tarea.
- `src/logic/` no llama a `createUsersTable()` ni crea tablas. La tabla `users` queda preparada al arrancar el servidor de datos. Asegurarla con `CREATE TABLE IF NOT EXISTS` no es un cambio de esquema.
- El servidor de datos ejecuta el SQL que recibe. Por eso escucha solo en `127.0.0.1` y no se publica fuera del equipo.

## Cambios en la base de datos

Antes de cambiar columnas, tipos o restricciones:

1. Explica el esquema actual.
2. Explica el cambio propuesto.
3. Indica si los datos existentes pueden verse afectados.
4. Presenta el plan de migración.
5. Espera autorización.
