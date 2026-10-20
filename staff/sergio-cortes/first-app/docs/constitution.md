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
│   └── constitution.md
│           Esta información base.
├── db/
│   ├── connections.js
│   │       openDatabase. DATABASE_PATH se arma con fileURLToPath, dirname y join, y apunta a users.sqlite junto a ese fichero.
│   └── users.sqlite
│           Fichero de la base. Lo crea la primera apertura. No se versiona.
├── logic/
│   ├── create-user.js
│   │       createUser(input). Lee name y email. Rechaza nombre vacío y email inválido. Devuelve name y email. No recibe users ni id.
│   ├── update-user.js
│   │       updateUser(input). Lee name y email. Rechaza nombre vacío y email inválido. Devuelve name y email. No recibe users ni id.
│   └── delete-user.js
│           deleteUser(input). Lee name y email. Rechaza nombre vacío y email inválido. Devuelve name y email. No recibe users ni id.
├── queries/
│   ├── user.js
│   │       Una constante por cada .sql. Al final del fichero, las funciones exportadas ejecutan run, all o get: createUsersTable, selectUsers, insertUser, selectUserById, updateUserById y deleteUserById.
│   └── queries/
│       ├── create-users-table.sql
│       │       CREATE TABLE IF NOT EXISTS users con id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, y createdAt y updatedAt con DEFAULT CURRENT_TIMESTAMP.
│       ├── select-users.sql
│       │       Todas las filas.
│       ├── insert-user.sql
│       │       Inserta name y email.
│       ├── select-user-by-id.sql
│       │       Una fila por id.
│       ├── update-user.sql
│       │       Cambia name y email, y pone updatedAt = CURRENT_TIMESTAMP.
│       └── delete-user.sql
│               Borra por id.
└── clients/
    └── terminal/
        ├── create-user-table.txt
        │       Pegado que abre la base y llama a createUsersTable.
        ├── create-user.txt
        │       Comprueba el input, inserta y muestra la fila guardada.
        ├── update-user.txt
        │       Lee la fila id 1, valida name y email, actualiza con el id de esa fila y muestra la fila guardada.
        └── delete-user.txt
                Lee la fila id 1, valida name y email, borra con el id de esa fila y muestra name y email.
```

## Base de datos

Este proyecto tiene una sola base de datos. Es el fichero SQLite `db/users.sqlite`. No hay otra base ni otra tabla.

La tabla se llama `users`. Su formato es este:

- `id`: `INTEGER PRIMARY KEY AUTOINCREMENT`. La base asigna el número.
- `email`: `TEXT NOT NULL UNIQUE`.
- `name`: `TEXT NOT NULL`.
- `createdAt`: `TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`.
- `updatedAt`: `TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`. Al actualizar una fila, el SQL pone `updatedAt = CURRENT_TIMESTAMP`.

## Logic no se reemplaza

Los ficheros de `logic/` no son un adaptador ni una capa intercambiable. No se sustituyen por otra implementación, no se convierten en plugins y no se mueven sus reglas a `queries/` ni a `clients/`.

## Un fichero logic

Un fichero, una función. El nombre, la entrada y la salida los define la firma. No hay un comentario de contrato encima de la función.

El nombre es la acción (`createUser`, `updateUser`, `deleteUser`). La entrada es un solo `input` con los datos de un usuario: `name` y `email`. No incluye `users` ni `id`. El `id` lo asigna la base de datos.

El cuerpo sigue este orden, y no se mezcla:

1. Validar los parámetros de entrada.
2. Validar el resto de reglas de negocio.
3. Aplicar la lógica de negocio.
4. Estructurar la salida y sanear la respuesta.

## Queries

El SQL no vive dentro de la función que lo ejecuta. Vive aparte.

`queries/queries/` contiene solo SQL agnóstico. Cada sentencia está en su propio `.sql`, sin JavaScript.

`queries/` contiene la función que llama a ese SQL. En este proyecto es `queries/user.js`: lee el `.sql`, lo guarda en una constante y, al final del fichero, la función exportada lo ejecuta con `run`, `all` o `get`.
