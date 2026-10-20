# Constitución — first-app


## Índice

1. [Funcionalidad general](#1-funcionalidad-general)
2. [Funciones ](#2funciones)
3. [Normas básicas](#3-normas-básicas)
4. [Estructura](#4-estructura)
5. [Errores](#5-errores)

## 1. Funcionalidad general

Una app pequeña de usuarios en Node. No es una web. Se usa desde cmd.

Se puede crear, listar, buscar por email, actualizar y eliminar un usuario. Los datos viven en el archivo `db/users.sqlite`.

Un usuario es un objeto plano con exactamente estos campos:

- `id` — entero. Lo asigna SQLite.
- `name` — texto.
- `email` — texto en minúsculas.
- `createdAt` — texto. Lo escribe SQLite.
- `updatedAt` — texto. Lo escribe SQLite.

La lógica no inventa el id ni la hora.

## 2. Funciones

| Texto | Import |
| --- | --- |
| `create-users-table.txt` | `createUsersTable` desde `logic/list-users.js` |
| `insert-user.txt` | `insertUser` desde `logic/create-user.js` |
| `find-all.txt` | `findAll` desde `logic/list-users.js` |
| `find-by-email.txt` | `findByEmail` desde `logic/find-user-by-email.js` |
| `find-by-id.txt` | `findById` desde `logic/update-user.js` |
| `update-user.txt` | `updateUserQuery` desde `logic/update-user.js` |
| `remove-user.txt` | `removeUser` desde `logic/delete-user.js` |

`updateUserQuery` es la consulta SQL. `updateUser` es la acción de negocio. Comparten archivo y por eso el nombre de la consulta cambia.

## 3. Normas básicas

- Una acción de negocio por archivo en `logic/`.
- Nombre, email e id se comprueban en `logic/user-rules.js`. Crear y actualizar usan las mismas comprobaciones.
- El SQL está solo en `queries/sql/*.sql`. Un archivo por sentencia.
- Solo `queries/run-query.js` lee esos archivos y los ejecuta.
- La lógica no abre los `.sql`. Llama a las funciones de `run-query.js`.
- Los `.txt` de `clients/terminal` importan desde `logic/`. No capturan errores.
- Si algo falla, se lanza `throw new Error("...")`. No se devuelve `{ ok: false }`.
- Los mensajes de error están en inglés y son los de la sección 4.


## 4. Estructura

```
first-app/
  logic/                 Acciones y reglas. Una acción por archivo.
  queries/run-query.js   Único sitio que ejecuta SQL.
  queries/sql/           Un .sql por sentencia.
  db/connection.js       Abre db/users.sqlite.
  db/users.sqlite        Base de datos.
  clients/terminal/      Un .txt por consulta, para cmd.
  docs/CONSTITUTION.md   Este documento.
```

Orden dentro de cada acción:

1. Comprobar lo que llega.
2. Llamar a la consulta que busca.
3. Llamar a la consulta que guarda o borra.
4. Devolver un usuario plano.


## 5. Errores

| Frase | Cuándo |
| --- | --- |
| `Name is empty` | El nombre no es texto o queda vacío. |
| `Email is invalid` | Falta `@`, hay espacios dentro, las partes están vacías o pasa de 64 caracteres. |
| `Email is already used` | Ese email ya pertenece a otro usuario. |
| `Invalid id` | El id no es un entero mayor o igual que 1. |
| `User not found` | Actualizar, eliminar o buscar alguien que no está. |

Listar una tabla vacía no es un error: devuelve `[]`.


