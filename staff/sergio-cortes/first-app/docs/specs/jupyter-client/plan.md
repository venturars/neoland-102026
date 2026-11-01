# Plan — cliente Jupyter

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`. El cliente de terminal se queda.

En `clients/jupyter/` solo hay cuadernos. No hay ficheros `.py` ni `requirements.txt`. La celda es Python. Busca la carpeta de la app y arranca `node --input-type=module` con el directorio actual en `first-app`. El programa de Node es el interior del `.txt`: los `import` y la llamada, carácter por carácter. El `console.log` se sustituye por la tabla. La tabla la pintan `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`, instaladas en `package.json`. El encabezado usa `style.head` `["cyan", "bold"]`.

Se abre con `pnpm jupyter` desde `first-app`. El script `jupyter` de `package.json` ejecuta `sh scripts/jupyter.sh`, que crea `.venv` si falta, instala `notebook==7.6.3` y arranca el cuaderno en `clients/jupyter/`. `.venv/` no se versiona.

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
- `clients/jupyter/user-gender-count.ipynb`

Se quitan `clients/jupyter/bridge.py` y `clients/jupyter/requirements.txt`.

Se tocan:

- `package.json` y `pnpm-lock.yaml`: entran `cli-table3` y `@colors/colors`. El script `jupyter` es `sh scripts/jupyter.sh`.
- `docs/CONSTITUTIONS.md`: la línea de `clients/jupyter/` dice que hay un cuaderno por cada `.txt`, que el bloque arranca `node --input-type=module` con el interior de ese `.txt` y que el `console.log` pasa a ser la tabla.

## Parecido

Cada `.txt` de `clients/terminal/` se pega con el directorio actual en `first-app` y arranca `node --input-type=module`. El cuaderno hace eso mismo. El programa de Node es el interior de ese `.txt`, carácter por carácter: los `import` y la llamada. El `console.log` se sustituye por la tabla de `cli-table3`.

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
6. Bloque con el texto del `.txt` y `node --input-type=module`
7. Respuesta ya ejecutada, en la tabla de colores

El bloque es el interior del `.txt` del mismo nombre, lanzado con `node --input-type=module`.

- `create-user-table` usa `createUsersTable(db)`. No usa `logic/`. La tabla tiene `lastInsertRowid` y `changes`. Anotación: no borra filas.
- `create-user` usa `createUser({ name: "Ada", email: "ada@example.com" })`. Inserta una fila, el id lo pone la base y las dos fechas son el alta. Anotaciones: `Name is empty`, `Email is invalid`, `Email is already used`, `Could not create the user`.
- `update-user` usa `updateUser({ id: 1, name: "Ada Lovelace", email: "ada@example.com" })`. Cambia nombre, correo y `updatedAt`. El id no cambia. Anotaciones: `Id is invalid`, `Name is empty`, `Email is invalid`, `User not found`, `Email is already used`, `Could not update the user`.
- `delete-user` usa `deleteUser(1)`. Quita la fila y muestra los datos que tenía. Anotaciones: `Id is invalid`, `User not found`, `Could not delete the user`. Borra a la persona 1.
- `find-user-by-id` usa `findUserById(1)`. Solo lee. Anotaciones: `Id is invalid`, `User not found`, `Could not find the user`.
- `find-user-by-email` usa `findUserByEmail("ada@example.com")`. Solo lee. Anotaciones: `Email is invalid`, `User not found`, `Could not find the user`.
- `find-user-by-name` usa `findUserByName("Grace")`. Solo lee, ordenado por id. Si no hay nadie, la tabla no tiene filas y no sale `User not found`. Anotaciones: `Name is empty`, `Could not find the user`.
- `list-users` usa `listUsers()`. Solo lee, de menor a mayor id. Si no hay nadie, la tabla no tiene filas. Anotación: `Could not list the users`.
- `user-gender-count` usa `await usersGenderCount()`. Solo lee los nombres. La tabla tiene `woman`, `man` y `genderUndefined`. Si no hay nadie, los tres son 0. Anotación: `Could not classify the users`.

Columnas de una persona, en este orden: `id`, `name`, `email`, `createdAt`, `updatedAt`. Una lista es una fila por elemento.
