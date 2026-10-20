# Constitución

first-app es una app para aprender los conceptos básicos de login. Se construye con IA siguiendo el sistema SDD.

## Árbol

```text
first-app/
├── package.json
│       Nombre de la app, ESM, Node >=22, licencia MIT y autor. Sin dependencias.
├── .gitignore
│       Ignora node_modules/ y db/users.sqlite.
├── AGENTS.MD
│       Reglas del agente. Apunta a esta constitución.
├── docs/
│   └── CONSTITUTIONS.md
│           Esta información base.
├── db/
│   ├── connections.js
│   │       Exporta db = new DatabaseSync(DATABASE_PATH). DATABASE_PATH se arma con fileURLToPath, dirname y join, y apunta a users.sqlite junto a ese fichero.
│   └── users.sqlite
│           Fichero de la base. Lo crea la primera apertura. No se versiona.
├── logic/
│   ├── create-user.js
│   │       createUser(input). Lee name y email. Rechaza nombre vacío, email inválido y un email que ya existe. Llama a insert y devuelve la fila. No abre la base.
│   ├── update-user.js
│   │       updateUser(input). Lee id, name y email. Rechaza un id que no sea un número, nombre vacío y email inválido. Lee la fila por id y, si no está, no actualiza. Rechaza un email que pertenece a otro usuario. Llama a update y devuelve la fila. No abre la base.
│   ├── delete-user.js
│   │       deleteUser(id). El argumento es el id. Rechaza un id que no sea un número. Lee la fila, llama a remove y devuelve la fila. No abre la base.
│   ├── find-user-by-id.js
│   │       findUserById(id). El argumento es el id. Rechaza un id que no sea un número. Llama a findById y devuelve la fila. No abre la base.
│   ├── find-user-by-email.js
│   │       findUserByEmail(email). El argumento es el email. Rechaza un email inválido. Llama a findByEmail y devuelve la fila. No abre la base.
│   └── list-users.js
│           listUsers(). No recibe argumentos. Llama a findAll y devuelve las filas. No abre la base.
├── queries/
│   ├── user.js
│   │       Importa db. createUsersTable recibe la conexión. insert, findById, findByEmail, findAll, update y remove usan db y ejecutan run, all o get.
│   └── queries/
│       ├── create-users-table.sql
│       │       CREATE TABLE IF NOT EXISTS users con id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, y createdAt y updatedAt con DEFAULT (datetime('now', 'localtime')).
│       ├── insert.sql
│       │       Inserta name y email. Las fechas las pone el default. Devuelve la fila.
│       ├── find-by-id.sql
│       │       Una fila por id, con SELECT *.
│       ├── find-by-email.sql
│       │       Una fila por email, con SELECT *.
│       ├── find-all.sql
│       │       Todas las filas, con SELECT *, ordenadas por id.
│       ├── update.sql
│       │       Cambia name y email, y pone updatedAt = datetime('now', 'localtime'). Devuelve la fila.
│       └── remove.sql
│               Borra por id.
└── clients/
    └── terminal/
        ├── create-user-table.txt
        │       Importa db y llama a createUsersTable(db).
        ├── create-user.txt
        │       Llama a createUser y muestra la fila. No abre la base.
        ├── update-user.txt
        │       Llama a updateUser con id 1 y muestra la fila. No abre la base.
        ├── delete-user.txt
        │       Llama a deleteUser(1) y muestra la fila. No abre la base.
        ├── find-user-by-id.txt
        │       Llama a findUserById(1) y muestra la fila. No abre la base.
        ├── find-user-by-email.txt
        │       Llama a findUserByEmail("ada@example.com") y muestra la fila. No abre la base.
        └── list-users.txt
                Llama a listUsers y muestra las filas. No abre la base.
```

## Base de datos

Hay una sola base de datos: `db/users.sqlite`. Hay una sola conexión: el `db` que exporta `db/connections.js`. No se abre otra base de datos ni otra conexión.

La tabla se llama `users`. Su formato es este:

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`. La base asigna el número.
- `email`: `TEXT NOT NULL UNIQUE`.
- `name`: `TEXT NOT NULL`.
- `createdAt` y `updatedAt` son fechas. SQLite no tiene un tipo `DATE` propio. El tipo es `TEXT` con la fecha en `YYYY-MM-DD HH:MM:SS`, que es lo que devuelve `datetime('now', 'localtime')`. El alta no escribe esas columnas: las pone el default de la tabla. Al actualizar, el SQL pone `updatedAt = datetime('now', 'localtime')`.

## Logic no se reemplaza

Los ficheros de `logic/` no son un adaptador ni una capa intercambiable. No se sustituyen por otra implementación, no se convierten en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

## Un fichero logic

Un fichero, una función. El nombre, la entrada y la salida los define la firma. No hay un comentario de contrato encima de la función.

El nombre es la acción (`createUser`, `updateUser`, `deleteUser`, `findUserById`, `findUserByEmail`, `listUsers`).

Si la función usa varios datos, como `name`, `email` e `id`, recibe un solo `input` y lee ahí cada valor. Si el dato es uno solo, como `id`, `email` o `name`, el argumento es ese valor. No se mete en un objeto.

`createUser(input)` lee `name` y `email`. `updateUser(input)` lee `id`, `name` y `email`. `deleteUser(id)` y `findUserById(id)` reciben el `id`. `findUserByEmail(email)` recibe el `email`. `listUsers()` no recibe argumentos.

Ningún fichero de `logic/` abre la base. Llaman a `queries/user.js`. Donde hay una fila, devuelven `id`, `name`, `email`, `createdAt` y `updatedAt`.

El cuerpo sigue este orden, y no se mezcla:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio. Ahí se puede llamar a una query de lectura, como `findById` o `findByEmail`, para comprobar la regla antes de escribir.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.

## Queries

El SQL no vive dentro de la función que lo ejecuta. Vive aparte.

`queries/queries/` contiene solo SQL agnóstico. Cada sentencia está en su propio `.sql`, sin JavaScript.

`queries/` contiene la función que llama a ese SQL. En este proyecto es `queries/user.js`: lee el `.sql`, lo guarda en una constante y, al final del fichero, la función exportada lo ejecuta con `run`, `all` o `get`.
