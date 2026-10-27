# Base de datos

## `queries/users.js`

Es la capa de ejecución de consultas.

Lee los archivos SQL, prepara las consultas, proporciona sus parámetros y las ejecuta mediante la conexión compartida.

Al cargar este módulo, crea la tabla `users` si todavía no existe.

## `queries/queries/`

Contiene un archivo `.sql` por consulta.

Los archivos contienen exclusivamente SQL y no contienen JavaScript ni reglas de negocio.

## `db/`

`db/connection.js` abre la conexión SQLite.

`db/users.sqlite` es la base de la aplicación. Si el proceso tiene `FIRST_APP_DATABASE_FILE`, la conexión abre esa ruta. Si no la tiene, abre `db/users.sqlite`. Ni el cliente de terminal ni el cliente Jupyter definen esa variable.

## Usuario

La tabla `users` contiene:

- `id`;
- `name`;
- `email`;
- `created_at`;
- `updated_at`.

Las reglas de tipo, formato y validación están definidas en `AGENTS.md`.

En una base creada con el script actual, `created_at` y `updated_at` usan `DEFAULT (datetime('now', 'localtime'))`. Las consultas de alta y de modificación también escriben esa fecha en SQL. `CREATE TABLE IF NOT EXISTS` no cambia una tabla que ya existía.

## Decisiones fundamentales

- Existe una sola conexión SQLite por proceso.
- La base de la aplicación es `db/users.sqlite`. Un proceso solo abre otro archivo si trae `FIRST_APP_DATABASE_FILE`.
- Cada consulta SQL tiene su propio archivo.
- Los archivos `.sql` están separados del código JavaScript.
- Las consultas se ejecutan desde `queries/users.js`.

## Reglas de implementación

- Lee los archivos SQL una vez al cargar el módulo.
- Utiliza parámetros SQL con nombre.
- Nunca concatenes datos del usuario dentro del SQL.
- No cambies el esquema como efecto secundario de otra tarea.
- `logic/` no llama a `createUsersTable()` ni crea tablas. La tabla `users` queda preparada al cargar `queries/users.js`. Asegurarla con `CREATE TABLE IF NOT EXISTS` no es un cambio de esquema.

## Cambios en la base de datos

Antes de cambiar columnas, tipos o restricciones:

1. Explica el esquema actual.
2. Explica el cambio propuesto.
3. Indica si los datos existentes pueden verse afectados.
4. Presenta el plan de migración.
5. Espera autorización.
