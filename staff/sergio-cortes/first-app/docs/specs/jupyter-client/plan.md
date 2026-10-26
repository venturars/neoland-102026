# Plan — cliente Jupyter

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`. El cliente de terminal se queda. No hay cuaderno del conteo por género.

En `clients/jupyter/` solo hay cuadernos. No hay ficheros `.py` ni `requirements.txt`. El bloque de cada cuaderno es JavaScript. La tabla la pintan `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`, instaladas en `package.json`. El encabezado usa `style.head` `["cyan", "bold"]`.

Se abre con `pnpm jupyter` desde `first-app`. El script crea `.venv` si falta. Si no está `.venv/bin/jupyter-notebook`, instala `notebook==7.6.3`. `.venv/` no se versiona. Después arranca `jupyter notebook` en `clients/jupyter`.

## Ficheros

No se crean ni se tocan `logic/`, `queries/` ni `db/`.

Se quedan estos cuadernos:

- `clients/jupyter/create-user-table.ipynb`
- `clients/jupyter/create-user.ipynb`
- `clients/jupyter/update-user.ipynb`
- `clients/jupyter/delete-user.ipynb`
- `clients/jupyter/find-user-by-id.ipynb`
- `clients/jupyter/find-user-by-email.ipynb`
- `clients/jupyter/find-user-by-name.ipynb`
- `clients/jupyter/list-users.ipynb`

Se quitan `clients/jupyter/bridge.py` y `clients/jupyter/requirements.txt`.

Se tocan:

- `package.json` y `pnpm-lock.yaml`: entran `cli-table3` y `@colors/colors`. El script `jupyter` crea `.venv` y abre los cuadernos.
- `docs/CONSTITUTIONS.md`: el árbol y el cliente Jupyter dejan de citar Python, `bridge.py`, `requirements.txt` y `rich`.

## Parecido

Cada `.txt` de `clients/terminal/` llama a una función y muestra el resultado, sin capturar el error. El cuaderno hace esa misma llamada en JavaScript y pinta el resultado con `cli-table3`.

## Firma

No hay firma nueva.

## SQL

No hay SQL.

## Errores

El cuaderno no captura el error. Si la función lanza, se ve ese mensaje y no hay tabla de datos.

## Cliente

Cada cuaderno, en este orden:

1. Título
2. Qué hace
3. Qué pasa en la base de datos
4. Qué funciones del dominio usa
5. Anotaciones
6. Bloque JavaScript
7. Respuesta ya ejecutada, en la tabla de colores

La llamada es la del `.txt` de terminal.

- `create-user-table` usa `createUsersTable(db)`. No usa `logic/`. La tabla tiene `lastInsertRowid` y `changes`. Anotación: no borra filas.
- `create-user` usa `createUser({ name: "Ada", email: "ada@example.com" })`. Inserta una fila, el id lo pone la base y las dos fechas son el alta. Anotaciones: `Name is empty`, `Email is invalid`, `Email is already used`, `Could not create the user`.
- `update-user` usa `updateUser({ id: 1, name: "Ada Lovelace", email: "ada@example.com" })`. Cambia nombre, correo y `updatedAt`. El id no cambia. Anotaciones: `Id is invalid`, `Name is empty`, `Email is invalid`, `User not found`, `Email is already used`, `Could not update the user`.
- `delete-user` usa `deleteUser(1)`. Quita la fila y muestra los datos que tenía. Anotaciones: `Id is invalid`, `User not found`, `Could not delete the user`. Borra a la persona 1.
- `find-user-by-id` usa `findUserById(1)`. Solo lee. Anotaciones: `Id is invalid`, `User not found`, `Could not find the user`.
- `find-user-by-email` usa `findUserByEmail("ada@example.com")`. Solo lee. Anotaciones: `Email is invalid`, `User not found`, `Could not find the user`.
- `find-user-by-name` usa `findUserByName("Grace")`. Solo lee, ordenado por id. Si no hay nadie, la tabla no tiene filas y no sale `User not found`. Anotaciones: `Name is empty`, `Could not find the user`.
- `list-users` usa `listUsers()`. Solo lee, de menor a mayor id. Si no hay nadie, la tabla no tiene filas. Anotación: `Could not list the users`.

Columnas de una persona, en este orden: `id`, `name`, `email`, `createdAt`, `updatedAt`. Una lista es una fila por elemento.
