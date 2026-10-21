# Constitución — first-app

## 1. Funcionalidad general

Una app pequeña de usuarios en Node. No es una web. Se usa desde PowerShell.

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
| `create-users-table.txt` | abre `db/connection.js` |
| `insert-user.txt` | `insertUser` desde `logic/create-user.js` |
| `find-all.txt` | `findAll` desde `logic/list-users.js` |
| `find-by-email.txt` | `findByEmail` desde `logic/find-user-by-email.js` |
| `find-by-id.txt` | `findById` desde `logic/update-user.js` |
| `update-user.txt` | `updateUserQuery` desde `logic/update-user.js` |
| `remove-user.txt` | `removeUser` desde `logic/delete-user.js` |

`updateUserQuery` es la consulta SQL. `updateUser` es la acción de negocio. Comparten archivo y por eso el nombre de la consulta cambia.

## 3. Normas básicas

- Una acción de negocio por archivo en `logic/`.
- Nombre, email e id se comprueban en `logic/shared.js`. Crear y actualizar usan las mismas comprobaciones.
- El SQL está solo en `queries/queries/*.sql`. Un archivo por sentencia.
- `create-users-table.sql` solo lo lee y lo ejecuta `db/connection.js`. Si `db/users.sqlite` no existe, se crea al conectar.
- `queries/users.js` lee y ejecuta el resto de sentencias. No usa `create-users-table.sql`.
- La lógica no abre los `.sql`. Llama a las funciones de `users.js`.
- Los `.txt` de `clients/terminal` se pegan en PowerShell desde la raíz del repositorio. Entran en `first-app` y no capturan errores.
- Si algo falla, se lanza `throw new Error("...")`. No se devuelve `{ ok: false }`.
- Los mensajes de error están en inglés y son los de la sección 5.


## 4. Estructura

```
first-app/
  logic/                 Acciones y reglas. Una acción por archivo.
  queries/users.js       Ejecuta el SQL salvo create-users-table.sql.
  queries/queries/       Un .sql por sentencia.
  db/connection.js       Crea db/users.sqlite si no existe y ejecuta create-users-table.sql.
  db/users.sqlite        Base de datos.
  clients/terminal/      Un .txt por consulta, para PowerShell.
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

## Registro de cambios

- 2026-10-21. Índices 2, 3 y 4. `create-users-table.sql` solo se usa en `db/connection.js`. Esa conexión crea `db/users.sqlite` si no existe. `logic/` y `queries/users.js` ya no llaman a esa sentencia.
- 2026-10-21. Índice 4. La conexión ya no usa `USERS_DB_PATH`. Abre siempre `db/users.sqlite`.
- 2026-10-21. Índices 1, 3 y 4. Los `.txt` se pegan en PowerShell desde la raíz del repositorio y entran en `first-app`.




