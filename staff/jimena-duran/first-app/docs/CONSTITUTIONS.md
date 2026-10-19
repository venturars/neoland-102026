# Constitución de my-first-app

`my-first-app` es una aplicación pequeña para aprender a gestionar usuarios con Node.js y SQLite. La arquitectura funcional se basa en los archivos implementados en la PR #139; las adaptaciones propias de esta copia se enumeran por separado más abajo.

## Estructura actual

```text
my-first-app/
  AGENTS.md
  package.json
  db/
    connection.js
    users.sqlite
  queries/
    AGENTS.md
    users.js
  logic/
    create-user.js
    update-user.js
    delete-user.js
    list-users.js
    find-user-by-email.js
  clients/
    terminal/
      create-users-table.txt
      create-user.txt
      update-user.txt
      list-users.txt
      find-user-by-email.txt
      delete-user.txt
  docs/
    CONSTITUTIONS.md
```

## Arquitectura de referencia: PR #139

La arquitectura funcional de referencia comprende `db/connection.js`, `queries/users.js`, los módulos de `logic/` y los clientes `.txt` de `clients/terminal/`:

- `db/connection.js` crea y exporta la conexión SQLite compartida del proceso.
- `queries/users.js` centraliza las sentencias SQL y exporta funciones pequeñas que las preparan y ejecutan usando esa conexión. Los valores se pasan mediante parámetros con nombre como `:id`, `:name` y `:email`; no se concatenan datos de usuario al SQL. `CREATE TABLE` no necesita parámetros cuando no recibe valores de entrada. Importar el módulo no ejecuta automáticamente las consultas que exporta; la conexión compartida se inicializa a través de `db/connection.js`.
- `logic/` contiene las reglas de negocio, con una funcionalidad pública por archivo: `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js` y `find-user-by-email.js`. Las reglas de negocio no se trasladan a `queries/` ni a los clientes.
- `clients/terminal/` contiene fragmentos PowerShell pegables. Cada archivo importa las funciones necesarias, muestra sus resultados y completa su demostración en un único proceso Node.

## Adaptaciones locales

Estas decisiones describen esta copia y no cambian la arquitectura funcional de referencia:

- `db/connection.js` permite configurar `USERS_DB_PATH`. Si la variable no está definida, la base predeterminada es `db/users.sqlite`, resuelta desde la ubicación del archivo de conexión y no desde el directorio actual de la terminal. La variable se lee al importar el módulo.
- `db/users.sqlite` es el binario de la PR #139. Git lo excluye mediante la regla global `**/db/users.sqlite`; este proyecto no tiene un archivo `.gitignore` local.
- `package.json` declara módulos ES y conserva el script `test` placeholder de la PR. No hay directorio `tests/` ni suite de pruebas local; tampoco hay directorio `docs/specs/`.
- `queries/AGENTS.md` es una instrucción local adicional para esa carpeta.
- Cada cliente de terminal configura `USERS_DB_PATH=:memory:` antes de importar módulos, para que la demostración no modifique el archivo de base incluido.

## Tecnologías y convenciones

El proyecto usa Node.js con módulos ES (`"type": "module"` en `package.json`) y SQLite integrado (`node:sqlite`). No declara dependencias externas.

- Los nombres de archivo usan `kebab-case`; las funciones y variables usan `camelCase`.
- Las funciones se exportan con nombre y los imports locales incluyen la extensión `.js`.
- El formato sigue el estándar de Prettier: comillas dobles, punto y coma, coma final, indentación de dos espacios y ancho de 80 caracteres. No hay configuración propia de Prettier.

## Base de datos y datos

La aplicación usa una conexión SQLite y una tabla `users`:

- `id` es `INTEGER PRIMARY KEY` y SQLite asigna su valor.
- `name` es `TEXT NOT NULL`.
- `email` es `VARCHAR(64) NOT NULL UNIQUE`. El límite de 64 caracteres se valida en la lógica; no se confía en que SQLite aplique por sí sola la longitud declarada.
- `createdAt` y `updatedAt` son `TEXT NOT NULL` con el formato `YYYY-MM-DD HH:MM:SS`, generado por SQLite con `datetime('now', 'localtime')`.
- El email se recorta y se pasa a minúsculas antes de validarlo, compararlo o guardarlo. Se rechaza si supera 64 caracteres, no contiene exactamente una `@`, no hay texto a ambos lados de la `@` o contiene espacios internos.
- La validación de email es básica: no comprueba que el buzón exista y no pretende implementar toda la especificación RFC.
- El nombre se recorta y no puede quedar vacío.
- El email no se puede repetir. Al actualizar, el usuario puede conservar su propio email; otro usuario no puede tenerlo.
- Una actualización cambia `updatedAt` y conserva `createdAt`.

## Funciones de negocio

La primera versión incluye crear, actualizar, eliminar, listar y buscar por email. Se usa una función exportada por archivo en `logic/`, como en la estructura de la PR:

- `createUser(input)` recibe `{ name, email }` y crea y devuelve el usuario.
- `updateUser(id, changes)` actualiza `name`, `email` o ambos y devuelve el usuario actualizado. Los campos permitidos no indicados conservan su valor actual.
- `deleteUser(id)` elimina el usuario y no devuelve datos.
- `listUsers()` devuelve la lista de usuarios.
- `findUserByEmail(email)` busca y devuelve el usuario; si no existe, indica el error de negocio definido abajo.

La consulta interna por ID puede usarse para validar la existencia de un usuario antes de actualizarlo o eliminarlo; no se añade como funcionalidad pública en esta primera versión.

Todas las operaciones públicas que reciben un ID requieren un entero positivo. Un ID inválido produce `User ID is invalid`. Actualizar o eliminar un ID válido que no existe produce `User not found`.

`changes` debe incluir al menos un campo permitido. Un objeto vacío produce `No changes provided`. Los únicos campos permitidos son `name` y `email`; cualquier otro campo produce `Invalid update fields`, sin ignorarlo silenciosamente.

Cada función de `logic/` sigue este orden: validar sus parámetros, comprobar las demás reglas de negocio, realizar la operación necesaria y devolver solo los datos que necesita el cliente. No se devuelven filas crudas de SQLite ni detalles internos de la base de datos.

## Errores

Se usa `throw new Error("mensaje")`. No se crean clases propias, códigos opacos ni objetos de resultado como `{ ok: true }`. Los mensajes son exactamente uno de estos:

- `Name is empty`
- `Email is invalid`
- `Email is already used`
- `User not found`
- `User ID is invalid`
- `No changes provided`
- `Invalid update fields`
- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`
- `Could not create the users table`

Los errores de SQLite durante las operaciones de usuarios se capturan dentro de `logic/` y se convierten al mensaje correspondiente a la operación. Si falla `createUsersTable()`, esa función lanza `Error("Could not create the users table")`. Ningún error interno de SQLite llega al cliente.

## Ejecución manual

Los archivos `.txt` de `clients/terminal/` se pegan en PowerShell con el directorio actual en la raíz de `my-first-app`. Cada bloque configura `USERS_DB_PATH=:memory:` antes de importar los módulos y ejecuta la demostración en un único proceso Node, sin modificar `db/users.sqlite`.