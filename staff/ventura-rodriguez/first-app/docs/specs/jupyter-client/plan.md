# Plan — cliente Jupyter

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`. No hay firma nueva ni SQL nuevo.

Cada documento llama al mismo sitio que su fichero de `clients/terminal/`. El texto del documento está en español. El código de la llamada sigue en inglés.

El Jupyter de la app es un `.venv` en `first-app`. No se versiona: el `.gitignore` de la raíz ya ignora `.venv/`. No es el Jupyter de Homebrew. Dentro va `notebook` `7.6.3`. El dibujo no se hace en Python.

`package.json` tiene el script `jupyter`. Se lanza con `pnpm jupyter` desde `first-app` y ejecuta `node scripts/start-jupyter.js`, compatible con Linux y Windows según `docs/specs/jupyter-cross-platform/plan.md`.

El lanzador usa `.venv/bin/python` en Linux y `.venv/Scripts/python.exe` en Windows. Si ese Python no existe, busca Python 3 y crea el entorno. Comprueba que el entorno tenga `notebook==7.6.3` y lo instala solo si hace falta, preparando pip con `ensurepip` si no está disponible. Arranca el Python del entorno con `-m notebook clients/jupyter`. El navegador se abre en la interfaz de notebooks y la lista son los documentos de esa carpeta. El kernel es el Python de ese `.venv`.

El dibujo lo hace `cli-table3` `0.6.5`. El encabezado en color sale solo si también está `@colors/colors` `1.6.1`. Esas dos dependencias ya están en `package.json` y se quedan.

El bloque parte de su carpeta y sube hasta la que contiene `logic/`. Esa es la app. Ahí arranca `node --input-type=module`. Si no la encuentra, termina con el texto `No encuentro la app.` El programa de Node hace la llamada y escribe la tabla. Si la llamada lanza un error, se ve ese mensaje, sin tabla de datos.

La tabla usa `head` y `style.head` `["cyan", "bold"]`. Columnas de un usuario, en este orden: `id`, `name`, `email`, `createdAt`, `updatedAt`. Una lista es una fila por elemento. Una lista vacía deja los encabezados y la línea `No hay filas.` Si la llamada no devuelve nada, la tabla tiene la columna `Resultado` y la fila `No devuelve datos.` El conteo usa `women`, `men`, `genderUndefined`. La creación de la tabla usa la columna `name`.

La anotación de abrir Jupyter con el directorio actual en `first-app` pasa a decir que se abre con `pnpm jupyter` desde la app.

## Ficheros

Se tocan:

- `package.json`
- `docs/CONSTITUTIONS.md`
- `clients/jupyter/create-users-table.ipynb`
- `clients/jupyter/create-user.ipynb`
- `clients/jupyter/list-users.ipynb`
- `clients/jupyter/find-user-by-name.ipynb`
- `clients/jupyter/find-user-by-email.ipynb`
- `clients/jupyter/find-user-by-id.ipynb`
- `clients/jupyter/update-user.ipynb`
- `clients/jupyter/delete-user.ipynb`
- `clients/jupyter/users-gender-count.ipynb`

En el árbol, la línea de `jupyter/` dice que se abre con el Jupyter de la app.

El script llegó a arrancar `jupyter lab` con `jupyterlab` `4.6.4`. Ahora arranca Notebook `7.6.3` con el Python del entorno local. Los documentos y el árbol no se vuelven a cambiar.

## Documentos

`create-users-table`. Crea la tabla de usuarios si no existe. No guarda usuarios. No usa `logic/`. Usa `createUsersTable` y, como el cliente de terminal, lista los nombres de `sqlite_master`. Anotación: no borra filas.

`create-user`. Guarda un usuario. Inserta una fila, el id lo pone la base, el email queda en minúsculas y las dos fechas son el momento de la alta. Usa `createUser({ name: "Ada", email: "ada@example.com" })`. Anotaciones: `Name is empty`, `Email is invalid`, `Email is already used`.

`list-users`. Muestra los usuarios guardados, de menor a mayor id. Solo lee. Usa `listUsers()`. Anotación: sin usuarios, no hay filas.

`find-user-by-name`. Muestra los usuarios con ese nombre exacto. Solo lee. Usa `findUserByName("Ada")`. Anotaciones: `Name is empty`. Si no hay ninguno, no hay filas y no sale `User not found`.

`find-user-by-email`. Muestra el usuario de ese email. Solo lee. El email se compara en minúsculas. Usa `findUserByEmail("ada@example.com")`. Anotaciones: `Email is invalid`, `User not found`.

`find-user-by-id`. Muestra el usuario de ese id. Solo lee. Usa `findUserById(3)`. Anotación: `User not found`.

`update-user`. Cambia el nombre de un usuario ya guardado. Actualiza esa fila y `updatedAt`. El id no cambia. Si no se manda email, se queda el que había. Usa `updateUser(1, { name: "Ada Lovelace" })`. Anotaciones: `User not found`, `Name is empty`, `Email is invalid`, `Email is already used`.

`delete-user`. Borra el usuario de ese id. Quita la fila y no devuelve datos. Usa `deleteUser(1)`. Anotación: `User not found`. Esto borra al usuario 1.

`users-gender-count`. Cuenta los usuarios según el género del nombre. Lo decide llama3.2 en local. Solo lee. No guarda el género. Usa `await usersGenderCount()`. Anotaciones: hace falta llama3.2 en marcha. Sin usuarios, los tres números son 0. Si no responde, `Could not classify the users`.

## Errores

No hay mensajes nuevos de `logic/`. Un fallo de la llamada se ve con el mensaje que ya lanza. Si no se encuentra la app, el texto es `No encuentro la app.`
