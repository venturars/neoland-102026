# Estilo

## Cómo nombrar

Escribe los nombres de archivo en inglés.

Usa un archivo por acción, con la forma `accion-user`. Listar es la excepción y va en plural: `list-users`, porque devuelve todos los usuarios. No uses `list-user`. Buscar por `id` se llama `find-user-by-id`. Buscar por email se llama `find-user-by-email`. Buscar por nombre se llama `find-user-by-name`. En `logic` no termines un nombre en `query`. El recuento de género se llama `users-gender` en el archivo y `usersGender` en la función.

Nombra cada `.sql` de una acción igual que su acción: `create-user.sql`, `update-user.sql`, `delete-user.sql`, `list-users.sql`, `find-user-by-id.sql`, `find-user-by-email.sql`, `find-user-by-name.sql`. El esquema se llama `create-table-users.sql`. No uses `users.sql`.

En `queries/users.js`, la función que ejecuta cada consulta se llama igual que ese archivo, en camelCase: `createTableUsers`, `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. No uses `insertUser`, `saveUser`, `removeUser`, `selectUsers`, `selectUserById` ni `selectUserByEmail`. `createTableUsers` se ejecuta al cargar `queries/users.js`.

En `clients/terminal` usa el mismo nombre de acción y la extensión `.txt`.

No llames al esquema `users.sqlite` ni `schema.sql`.

Llama `users.sqlite` al archivo que crea SQLite. No uses `users.db`.

En `logic/shared.js` llama a las validaciones `validateNombre`, `validateEmail` y `validateId`. La del nombre lleva `Nombre`.

## Cómo escribir el código

Usa módulos de JavaScript: `import` y `export`. `package.json` ya tiene `"type": "module"`.

La dependencia `openai` está en `package.json`, versión `7.39.0`. El gestor de paquetes es pnpm `12.15.0`, declarado en `package.json` con `packageManager`. Instala y añade dependencias con pnpm desde `first-app`. `pnpm-lock.yaml` lo escribe pnpm. No lo edites a mano. No uses npm ni yarn, y no crees `package-lock.json` ni `yarn.lock`.

Deja la conexión solo en `db/connection.js`. Mantenla corta: exporta `database` directamente con `new DatabaseSync` sobre `users.sqlite`. No crees una función `openDatabase`. No leas ni ejecutes SQL ahí. No abras la base en ningún otro archivo.

Haz que `queries/users.js` sea el único archivo que lee y ejecuta las consultas, incluida `create-table-users.sql`.

No escribas SQL en `logic` y no abras SQLite desde ahí. Valida y llama a la función de `queries/users.js` con el mismo nombre: `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` o `findUserByName`. Importa ese archivo como módulo, porque `logic` ya exporta una función con ese nombre.

No escribas SQL ni validación en `clients`. El cliente de terminal solo llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail`, `findUserByName` o `usersGender`.

No valides dentro de `queries`. Ejecuta la consulta que corresponde.
