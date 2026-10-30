# Plan — cliente Jupyter

Cumple `docs/specs/jupyter-client/spec.md`. No es una acción nueva. No se toca ningún fichero de `logic/`. No hay firma nueva ni SQL nuevo.

Cada documento llama al mismo sitio que su fichero de `clients/terminal/`. El texto del documento está en español. El código de la llamada sigue en inglés.

El Jupyter de la app es un `.venv` en `first-app`. No se versiona: el `.gitignore` de la raíz ya ignora `.venv/`. No es el Jupyter de Homebrew. Dentro va `notebook` `7.6.3`.

`package.json` tiene el script `jupyter`. Se lanza con `npm run jupyter` desde `first-app`. Si no existe `.venv/bin/jupyter-notebook`, el script crea el `.venv` con `python3 -m venv .venv` si falta, e instala `notebook==7.6.3`. Si ese ejecutable ya está, no reinstala. Después arranca `.venv/bin/jupyter notebook clients/jupyter`. El navegador se abre en la interfaz de notebooks y la lista son los documentos de esa carpeta. No arranca `jupyter lab`. El kernel es el `python3` de ese `.venv`.

El dibujo lo hace `cli-table3` `0.6.5`. El encabezado en color sale con `@colors/colors` `1.6.1`. Esas dos dependencias se añaden. No estaban.

El bloque parte de su carpeta y sube hasta la que contiene `logic/`. Esa es la app. Ahí arranca `node --input-type=module`. Si no la encuentra, termina con el texto `No encuentro la app.` El programa de Node hace la llamada y escribe la tabla. Si la llamada lanza un error, se ve ese mensaje, sin tabla de datos.

La tabla usa `head` y `style.head` `["cyan", "bold"]`. Columnas de una persona, en este orden: `id`, `name`, `email`, `createdAt`, `updatedAt`. Una lista es una fila por elemento. Una lista vacía deja los encabezados y la línea `No hay filas.` Si la llamada no devuelve nada, la tabla tiene la columna `Resultado` y la fila `No devuelve datos.` El conteo usa `women`, `men`, `genderUndefined`. La creación de la tabla usa la columna `name`.

## Ficheros

Se tocan:

- `package.json`
- `docs/CONSTITUTIONS.md`
- `AGENTS.md`
- `clients/jupyter/create-users-table.ipynb`
- `clients/jupyter/create-user.ipynb`
- `clients/jupyter/list-users.ipynb`
- `clients/jupyter/find-user-by-email.ipynb`
- `clients/jupyter/find-user-by-id.ipynb`
- `clients/jupyter/update-user.ipynb`
- `clients/jupyter/delete-user.ipynb`
- `clients/jupyter/users-gender-count.ipynb`

No se toca `logic/`. No hay documento para buscar por nombre: esa acción no está en `clients/terminal/`.

## Documentos

`create-users-table`. Crea la tabla de usuarios si no existe. No guarda personas. No usa `logic/`. Usa `createUsersTable` y, como el cliente de terminal, lista los nombres de `sqlite_master`. Anotación: no borra filas.

`create-user`. Guarda a Ada. Inserta una fila, el id lo pone la base, el email queda en minúsculas y las dos fechas son el momento del alta. Usa `createUser({ name: "Ada", email: "ada@example.com" })`. Anotaciones: `Name is empty`, `Email is invalid`, `Email is already used`.

`list-users`. Muestra las personas guardadas, de menor a mayor id. Solo lee. Usa `listUsers()`. Anotación: sin personas, no hay filas.

`find-user-by-email`. Muestra la persona de ese email. Solo lee. El email se compara en minúsculas. Usa `findUserByEmail("ada@example.com")`. Anotaciones: `Email is invalid`, `User not found`.

`find-user-by-id`. Muestra la persona de ese id. Solo lee. Usa `findUserById(1)`. Anotaciones: `Invalid id`, `User not found`.

`update-user`. Cambia el nombre de una persona ya guardada. Actualiza esa fila y `updatedAt`. El id no cambia. Si no se manda email, se queda el que había. Usa `updateUser(1, { name: "Ada Lovelace" })`. Anotaciones: `User not found`, `Name is empty`, `Email is invalid`, `Email is already used`, `Invalid id`.

`delete-user`. Borra la persona de ese id. Quita la fila y no devuelve datos. Usa `deleteUser(1)`. Anotaciones: `User not found`, `Invalid id`. Esto borra a la persona 1.

`users-gender-count`. Cuenta las personas según el género del nombre. Lo decide Ollama en local, con `nimble-v3` o `OLLAMA_MODEL`. Solo lee. No guarda el género. Usa `await usersGenderCount()`. Anotaciones: hace falta Ollama en marcha. Sin personas, los tres números son 0. Si no responde, `Could not classify the users`.

## Errores

No hay mensajes nuevos de `logic/`. Un fallo de la llamada se ve con el mensaje que ya lanza. Si no se encuentra la app, el texto es `No encuentro la app.`
