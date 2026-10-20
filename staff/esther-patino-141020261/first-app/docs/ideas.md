# Ideas — usuarios

Las reglas deciden. Otra capa guarda.

Hoy existe la lógica de crear, listar, buscar por email, actualizar y eliminar un usuario. Cada acción de `logic/` llama a una función de `queries/run-query.js`. Ese archivo es el único que lee los `.sql` y los ejecuta sobre `db/users.sqlite`.

## Capas

1. **Acción** (`logic/create-user.js`, `list-users.js`, `find-user-by-email.js`, `update-user.js`, `delete-user.js`). Una acción por fichero.
2. **Reglas** (`logic/user-rules.js`). Nombre, email e id. Crear y actualizar usan las mismas comprobaciones.
3. **SQL** (`queries/sql/*.sql` y `queries/run-query.js`). Un fichero `.sql` por sentencia. `run-query.js` es el único que las ejecuta.
4. **Conexión** (`db/connection.js`). Abre el archivo `db/users.sqlite`.
5. **Terminal** (`clients/terminal/*.txt`). Un texto por consulta. El import sale de `logic/`. Se pega en cmd con el directorio actual en `first-app`.

Orden dentro de cada acción:

1. Comprobar lo que llega.
2. Ejecutar la consulta que busca (¿existe este email?, ¿existe este id?).
3. Ejecutar la consulta que guarda o borra.
4. Devolver un usuario plano.

## El usuario

Un usuario es un objeto con exactamente estos campos:

- `id` — número entero, lo asigna SQLite
- `name` — texto
- `email` — texto en minúsculas
- `createdAt` — texto, lo escribe SQLite
- `updatedAt` — texto, lo escribe SQLite

La lógica no inventa el id ni la hora. Eso depende de cómo se guarde.

## Reglas

- Nombre: se quitan espacios de los extremos. Si no es texto o queda vacío, `Name is empty`.
- Email: se quitan espacios de los extremos y se pasa a minúsculas. Hace falta un solo `@`, con texto a cada lado, sin espacios dentro, y como máximo 64 caracteres. Si no, `Email is invalid`.
- El mismo email (ya normalizado) en otro usuario: `Email is already used`.
- En actualizar y eliminar, el id tiene que ser un entero mayor o igual que 1. Si no, `Invalid id`.
- Actualizar, eliminar o buscar un usuario que no está: `User not found`.
- Listar cuando no hay nadie: se devuelve `[]`, no un error. El orden es por `id`.
- En actualizar, `name` y `email` son opcionales. Lo que no se envía se queda igual. Si no se envía ninguno, se devuelve el usuario tal cual.

Si algo falla, la función lanza `throw new Error("...")` con una de esas frases. No devuelve `{ ok: false }`.

## Consultas que ejecuta cada acción

La lógica no abre los `.sql`. Llama a estas funciones de `queries/run-query.js`:

- `createUser({ name, email })` llama a `findByEmail` e `insertUser`. Devuelve el usuario guardado.
- `listUsers()` llama a `findAll`. Devuelve un array de usuarios planos, ordenados por `id`.
- `findUserByEmail(email)` llama a `findByEmail`. Devuelve el usuario plano.
- `updateUser(id, changes)` llama a `findById`, a `findByEmail` si cambia el email, y a `updateUser` de `queries/run-query.js`. Devuelve el usuario cambiado.
- `deleteUser(id)` llama a `findById` y `removeUser`. No devuelve nada si sale bien.

Todas empiezan llamando a `createUsersTable` para que la tabla exista.
