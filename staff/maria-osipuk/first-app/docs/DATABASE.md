# Base de datos

## `src/queries/users.js`

Es la capa de ejecución de consultas.

Lee los archivos SQL, prepara las consultas, proporciona sus parámetros y las ejecuta mediante la conexión compartida.

Al cargar este módulo, crea la tabla `users` si todavía no existe.

## `src/queries/queries/`

Contiene un archivo `.sql` por consulta.

Los archivos contienen exclusivamente SQL y no contienen JavaScript ni reglas de negocio.

## `src/db/`

`src/db/connection.js` abre la conexión SQLite.

`src/db/users.sqlite` es la base de la aplicación. Si el proceso tiene `FIRST_APP_DATABASE_FILE`, la conexión abre esa ruta. Si no la tiene, abre `src/db/users.sqlite`. Ni el cliente de terminal ni el cliente Jupyter definen esa variable.

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
- Un futuro formulario HTML usará `<input type="email" />`, pero no sustituye la validación de `src/logic/`.

### `created_at` y `updated_at`

- JavaScript `string`, SQLite `TEXT NOT NULL`.
- Las genera SQLite, como se explica en «Usuario».
- `src/logic/` decide cuándo se crea o se modifica un usuario, pero no calcula estas fechas con `new Date()` ni las envía a la consulta.
- No se aceptan desde el cliente.

## Decisiones fundamentales

- Existe una sola conexión SQLite por proceso.
- La base de la aplicación es `src/db/users.sqlite`. Un proceso solo abre otro archivo si trae `FIRST_APP_DATABASE_FILE`.
- Cada consulta SQL tiene su propio archivo.
- Los archivos `.sql` están separados del código JavaScript.
- Las consultas se ejecutan desde `src/queries/users.js`.

## Reglas de implementación

- Lee los archivos SQL una vez al cargar el módulo.
- Utiliza parámetros SQL con nombre.
- Nunca concatenes datos del usuario dentro del SQL.
- No cambies el esquema como efecto secundario de otra tarea.
- `src/logic/` no llama a `createUsersTable()` ni crea tablas. La tabla `users` queda preparada al cargar `src/queries/users.js`. Asegurarla con `CREATE TABLE IF NOT EXISTS` no es un cambio de esquema.

## Cambios en la base de datos

Antes de cambiar columnas, tipos o restricciones:

1. Explica el esquema actual.
2. Explica el cambio propuesto.
3. Indica si los datos existentes pueden verse afectados.
4. Presenta el plan de migración.
5. Espera autorización.
