# Estilo

## Cómo nombrar

Escribe los nombres de archivo en inglés.

Usa un archivo por acción, con la forma `accion-user`. Listar es la excepción y va en plural: `list-users`, porque devuelve todos los usuarios. No uses `list-user`. Buscar por `id` se llama `find-user-by-id`. Buscar por email se llama `find-user-by-email`. Buscar por nombre se llama `find-user-by-name`. En `src/logic` no termines un nombre en `query`. El recuento de género se llama `users-gender` en el archivo y `usersGender` en la función.

Nombra cada módulo de una consulta igual que su acción: `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js`, `find-user-by-id.js`, `find-user-by-email.js`, `find-user-by-name.js`. El esquema se llama `create-table-users.js`. No uses `users.sql`.

En `src/queries/users.js`, la función que pide cada consulta se llama igual que ese archivo, en camelCase: `createTableUsers`, `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. No uses `insertUser`, `saveUser`, `removeUser`, `selectUsers`, `selectUserById` ni `selectUserByEmail`. `createTableUsers` se espera antes de cada operación y no se llama a sí misma.

En `src/clients/terminal` usa el mismo nombre de acción y la extensión `.txt`.

No llames al esquema `users.sqlite` ni `schema.sql`.

Llama `users.sqlite` al archivo que crea SQLite. No uses `users.db`.

En `src/logic/shared.js` llama a las validaciones `validateNombre`, `validateEmail` y `validateId`. La del nombre lleva `Nombre`.

## Cómo escribir el código

Usa módulos de JavaScript: `import` y `export`. `package.json` ya tiene `"type": "module"`.

La dependencia `openai` está en `package.json`, versión `7.39.0`. El gestor de paquetes es pnpm `12.15.0`, declarado en `package.json` con `packageManager`. Instala y añade dependencias con pnpm desde `first-app`. `pnpm-lock.yaml` lo escribe pnpm. No lo edites a mano. No uses npm ni yarn, y no crees `package-lock.json` ni `yarn.lock`.

El único que abre la base y ejecuta SQL es `src/db/server.js`. La conexión no se exporta. No crees `connection.js` ni una función `openDatabase`. No abras la base en ningún otro archivo.

`src/queries/users.js` pide la ejecución a `http://127.0.0.1:3000/execute` y espera. El texto de cada consulta está en su módulo. Lo importa. No lo lee del disco en cada llamada.

No escribas SQL en `src/logic` y no abras SQLite desde ahí. Valida y llama a la función de `src/queries/users.js` con el mismo nombre: `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` o `findUserByName`. Importa ese archivo como módulo, porque `src/logic` ya exporta una función con ese nombre.

No escribas SQL ni validación en `src/clients`. El cliente de terminal solo llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail`, `findUserByName` o `usersGender`. El cliente del navegador solo llama a `listUsers`, `updateUser` y `deleteUser`.

No valides dentro de `src/queries`. Ejecuta la consulta que corresponde.
