# Plan — cliente Jupyter

No es una funcionalidad nueva de usuarios. No reemplaza ningún fichero de `logic/`. No hay firma nueva ni SQL nuevo.

El texto de cada documento está en español. El código de la llamada sigue en inglés. El bloque llama a la misma función que el `.txt` de `clients/terminal/`. El texto nombra la acción de dominio.

La tabla la dibuja Node. La librería es `cli-table3` `0.6.5`. El encabezado en color sale de `@colors/colors` `1.6.1`, en cian y negrita. Hoy `package.json` solo tiene `openai`.

En este ordenador hay Node 24 y Python 3.14. No hay Jupyter instalado. Las dependencias de Node se instalan con pnpm.

Hay un documento por cada cliente de `clients/terminal/`. El orden del documento es el de la spec.

## Ficheros

Se crean:

- `clients/jupyter/create-users-table.ipynb`
- `clients/jupyter/insert-user.ipynb`
- `clients/jupyter/find-all.ipynb`
- `clients/jupyter/find-by-email.ipynb`
- `clients/jupyter/find-by-id.ipynb`
- `clients/jupyter/find-user-by-name.ipynb`
- `clients/jupyter/update-user.ipynb`
- `clients/jupyter/remove-user.ipynb`
- `clients/jupyter/users-gender-count.ipynb`

Se tocan:

- `package.json`
- `docs/CONSTITUTIONS.md`

En el árbol, `clients/jupyter/` lista esos nueve documentos. La frase que dice que la app se usa desde la terminal pasa a decir también que el CEO valida esas funcionalidades desde esos documentos.

## Arranque

El script `jupyter` de `package.json` se lanza con `pnpm jupyter` desde `first-app`. Usa `py -3`. Crea `.venv` solo si falta. Instala `notebook==7.6.3` solo si no existe `.venv/Scripts/jupyter-notebook.exe`. Después arranca ese programa sobre `clients/jupyter`. No abre Lab. `.venv/` no se versiona.

El bloque del documento está en Python. Node se ejecuta con el directorio de trabajo en la app, dos carpetas por encima del documento. Si la llamada lanza un error, se ve ese mensaje y no la tabla de datos. Si no devuelve nada, la tabla tiene la columna `Resultado` y la fila `No devuelve datos.` Una lista vacía deja los encabezados de usuario y ninguna fila.

## Documentos

`create-users-table`. Al abrir la base, la tabla `users` se crea si no existe. No guarda usuarios. No hay acción de dominio. El bloque abre `db` y lo cierra, igual que el terminal. Anotación: no borra filas y no devuelve un usuario. Se abre con `pnpm jupyter` desde la app.

`insert-user`. Guarda un usuario. La base pone el id y las dos fechas. La acción de dominio es `createUser`. El bloque llama a `insertUser({ name: "Ada", email: "ada@example.com" })`. Anotación: esta llamada no comprueba el nombre ni el email. `createUser` sí, y puede mostrar `Name is empty`, `Email is invalid` o `Email is already used`. El email se guarda como llega. Se abre con `pnpm jupyter` desde la app.

`find-all`. Muestra los usuarios, de menor a mayor id. Solo lee. La acción de dominio es `listUsers`. El bloque llama a `findAll()`. Anotación: si no hay usuarios, no hay filas. No es un fallo. Se abre con `pnpm jupyter` desde la app.

`find-by-email`. Muestra el usuario de ese email. Solo lee. La acción de dominio es `findUserByEmail`. El bloque llama a `findByEmail("ada@example.com")`. Anotación: si no está, esta llamada no muestra `User not found`. `findUserByEmail` sí. Esta llamada no comprueba el email. `findUserByEmail` puede mostrar `Email is invalid`. Se abre con `pnpm jupyter` desde la app.

`find-by-id`. Muestra el usuario de ese id. Solo lee. La acción de dominio es `findUserById`. El bloque llama a `findById(1)`. Anotación: si no está, esta llamada no muestra `User not found`. `findUserById` sí. Esta llamada no muestra `Invalid id`. `findUserById` sí. Se abre con `pnpm jupyter` desde la app.

`find-user-by-name`. Muestra los usuarios con ese nombre exacto. Solo lee. La acción de dominio y el bloque llaman a `findUserByName("Ada")`. Anotación: un nombre vacío muestra `Name is empty`. Si no hay ninguno, no hay filas y no sale `User not found`. Si no se puede leer, `Could not find the user`. Se abre con `pnpm jupyter` desde la app.

`update-user`. Cambia el nombre y el email de un usuario ya guardado, y `updatedAt`. La acción de dominio es `updateUser`. El bloque llama a `updateUserQuery({ id: 1, name: "Ada Lovelace", email: "ada@example.com" })`. Anotación: esta llamada no comprueba si el usuario existe ni el email. `updateUser` sí, y puede mostrar `User not found`, `Name is empty`, `Email is invalid` o `Email is already used`. Esto cambia al usuario 1. Se abre con `pnpm jupyter` desde la app.

`remove-user`. Borra el usuario de ese id. Quita la fila. La acción de dominio es `deleteUser`. El bloque llama a `removeUser(1)`. Anotación: esto borra al usuario 1. Esta llamada no muestra `User not found` si el id no está. `deleteUser` sí. `deleteUser` no devuelve el usuario. Esta llamada muestra cuántas filas quitó. Se abre con `pnpm jupyter` desde la app.

`users-gender-count`. Cuenta los usuarios según el sexo que sugiere el nombre. Lo decide la IA local. Solo lee. No guarda el sexo. La acción de dominio y el bloque llaman a `await usersGenderCount()`. La tabla usa `women`, `men` y `undefinedUser`. Anotación: hace falta la IA local en marcha. Sin usuarios, los tres números son 0. Si no responde, `Could not classify the users`. Se abre con `pnpm jupyter` desde la app.

## Errores

No hay mensajes nuevos de `logic/`. Un fallo de la llamada se ve con el mensaje que esa llamada ya lanza.

## Respuesta

El bloque ejecuta la misma llamada que el `.txt`. El texto nombra la acción de dominio. Esas llamadas y esas anotaciones van en `tasks.md`. Los documentos se escriben cuando se pidan esas tareas.
