# Instrucciones del agente

Trabajas en `staff/luis-duque/first-app`. Estas instrucciones son para ti. Léelas antes de cambiar código y síguelas. Escríbelas para que otro agente las entienda sin conocer el historial del chat. No escribas nombres de personas.

El proyecto gestiona usuarios: crear, actualizar, eliminar, listar y buscar por `id` o por email. No hagas otra operación salvo que te la pidan.

Si el código y este archivo no coinciden, no cambies el estilo por tu cuenta. Pregunta a quien te encargó el cambio.

## Alcance

No añadas pantalla, servidor ni framework. No añadas otro cliente salvo que te lo pidan.

No crees un `README`. La explicación para personas está en `docs/CONSTITUTIONS.MD`.

No crees clases de error. Usa `Error`.

No crees consultas ni funciones que no te hayan pedido. Las únicas operaciones son crear, actualizar, eliminar, listar todos, buscar por `id` y buscar por email.

No uses `try/catch` en `queries/users.js`. Si SQLite rechaza un email repetido, deja salir ese error.

No separes la lógica de la base de datos. `logic` llama a `queries`. `queries` usa la conexión de `db`.

## Dónde va cada cosa

Pon la conexión en `db`: `connection.js` y, cuando se abra la base, `users.sqlite`. Pon el esquema en `queries/queries/create-table-users.sql`.

Pon la validación y las operaciones en `logic`: `shared.js`, `create-user.js`, `update-user.js`, `delete-user.js`, `list-users.js`, `find-user-by-id.js` y `find-user-by-email.js`. `shared.js` va dentro de `logic`, no en la raíz.

Pon la entrada por terminal en `clients/terminal`: `create-user.txt`, `update-user.txt`, `delete-user.txt`, `list-users.txt`, `find-user-by-id.txt` y `find-user-by-email.txt`. Cada archivo contiene una sola línea, y esa línea es el comando de cmd. El comando llama a la función de `logic` de su acción con `node --input-type=module -e` y el `import` `./staff/luis-duque/first-app/logic/...`. No valida, no escribe SQL y no abre la base. Tira esa línea desde cmd, en la raíz del repositorio, porque Node resuelve el `import` desde la carpeta de trabajo. No uses PowerShell y no pases el archivo por la entrada estándar. `create-user.txt` lleva el nombre y el email al final del comando. `update-user.txt` lleva el id y después `name=...`, `email=...` o los dos. `delete-user.txt` lleva el id. `list-users.txt` no lleva argumentos. `find-user-by-id.txt` lleva el id. `find-user-by-email.txt` lleva el email.

Pon la ejecución de todo el SQL en `queries/users.js`, también `create-table-users.sql`. Pon el texto de cada consulta en `queries/queries`, en `create-table-users.sql`, `create-user.sql`, `update-user.sql`, `delete-user.sql`, `list-users.sql`, `find-user-by-id.sql` y `find-user-by-email.sql`. `db/connection.js` no lee ni ejecuta ninguna consulta.

Pon la explicación general del proyecto en `docs/CONSTITUTIONS.MD`.

## Cómo nombrar

Escribe los nombres de archivo en inglés.

Usa un archivo por acción, con la forma `accion-user`. Listar es la excepción y va en plural: `list-users`, porque devuelve todos los usuarios. No uses `list-user`. Buscar por `id` se llama `find-user-by-id`. Buscar por email se llama `find-user-by-email`. En `logic` no termines un nombre en `query`.

Nombra cada `.sql` de una acción igual que su acción: `create-user.sql`, `update-user.sql`, `delete-user.sql`, `list-users.sql`, `find-user-by-id.sql`, `find-user-by-email.sql`. El esquema se llama `create-table-users.sql`. No uses `users.sql`.

En `queries/users.js`, la función que ejecuta cada consulta se llama igual que ese archivo, en camelCase: `createTableUsers`, `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById` y `findUserByEmail`. No uses `insertUser`, `saveUser`, `removeUser`, `selectUsers`, `selectUserById` ni `selectUserByEmail`. `createTableUsers` se ejecuta al cargar `queries/users.js`.

En `clients/terminal` usa el mismo nombre de acción y la extensión `.txt`.

No llames al esquema `users.sqlite` ni `schema.sql`.

Llama `users.sqlite` al archivo que crea SQLite. No uses `users.db`.

En `logic/shared.js` llama a las validaciones `validateNombre`, `validateEmail` y `validateId`. La del nombre lleva `Nombre`.

## Cómo escribir el código

Usa módulos de JavaScript: `import` y `export`. `package.json` ya tiene `"type": "module"`.

La dependencia `openai` está en `package.json`, versión `7.39.0`. Se instala con pnpm desde `first-app`. `pnpm-lock.yaml` lo escribe pnpm. No lo edites a mano y no pases esa dependencia a npm.

Deja la conexión solo en `db/connection.js`. Mantenla corta: exporta `database` directamente con `new DatabaseSync` sobre `users.sqlite`. No crees una función `openDatabase`. No leas ni ejecutes SQL ahí. No abras la base en ningún otro archivo.

Haz que `queries/users.js` sea el único archivo que lee y ejecuta las consultas, incluida `create-table-users.sql`.

No escribas SQL en `logic` y no abras SQLite desde ahí. Valida y llama a la función de `queries/users.js` con el mismo nombre: `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById` o `findUserByEmail`. Importa ese archivo como módulo, porque `logic` ya exporta una función con ese nombre.

No escribas SQL ni validación en `clients`. El cliente de terminal solo llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById` o `findUserByEmail`.

No valides dentro de `queries`. Ejecuta la consulta que corresponde.

## Datos

Un usuario tiene `id`, `name` y `email`.

Haz que `validateNombre` exija un texto, le quite los espacios de los extremos y rechace más de 100 caracteres.

Haz que `validateEmail` exija un texto, le quite los espacios, lo pase a minúsculas y compruebe que tenga forma de email.

Haz que `validateId` acepte un entero positivo. Un texto numérico como `"3"` vale y se convierte a número.

Deja que SQLite asigne el `id` al crear. No lo generes en la lógica.

Mantén el email único en la tabla. No añadas una consulta previa para comprobarlo.

Al actualizar, acepta solo el nombre, solo el email o los dos. Conserva el campo que no llega. Exige al menos uno. Si el `id` no existe, ninguna fila cambia y `logic` lanza un `Error`.

Al eliminar, si el `id` no existe, ninguna fila se borra y `logic` lanza un `Error`.

Al listar, `listUsers` devuelve todos los usuarios en una sola consulta: `SELECT * FROM users`. No filtres filas ni pongas `LIMIT`. Cada usuario lleva `id`, `name` y `email`. Si no hay ninguno, devuelve una lista vacía. No lances un `Error` por estar vacía. `listUsers` no recibe datos y no los valida.

Al buscar por `id`, `findUserById` valida el id y devuelve ese usuario. Si no existe, `logic` lanza un `Error`.

Al buscar por email, `findUserByEmail` valida el email y devuelve ese usuario. Si no existe, `logic` lanza un `Error`.

## Qué documentos mantienes

Mantén los dos documentos en el mismo cambio que provoque la novedad.

`docs/CONSTITUTIONS.MD` es para una persona. Déjalo con una explicación corta de la app, el árbol de carpetas, una explicación general de cada componente y los pasos de crear, actualizar, eliminar, listar y buscar. No lo conviertas en un recorrido archivo por archivo. Actualízalo cuando cambie el comportamiento, la estructura o el papel de un componente. Tiene que coincidir con el código.

Este archivo, `AGENTS.MD`, es tu información de agente. Actualízalo cuando te den una regla, un estilo, un nombre o algo que haya que hacer o dejar de hacer. Sigue siendo concreto y legible. Conserva las reglas que sigan en vigor. Si una instrucción nueva anula otra, quédate solo con la nueva. No pongas nombres de personas.

## Git

`.cursor/` está en el `.gitignore` de la raíz del repositorio. No lo quites de ahí y no lo subas.
