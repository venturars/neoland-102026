# Plan — cliente Jupyter

No es una funcionalidad nueva de `logic/`. No reemplaza ningún fichero de `logic/`. No hay firma nueva ni SQL nuevo.

Cada documento llama al mismo sitio que su fichero de `clients/terminal/`. El texto del documento está en español. El código de la llamada sigue en inglés.

El Jupyter de la app es un `.venv` en `mi-primer-proyecto`. No se versiona: el `.gitignore` de la raíz ya ignora `.venv/`. Dentro va `notebook` `7.6.3`. El dibujo no se hace en Python.

`package.json` tiene el script `jupyter` (`node start-jupyter.js`). Se lanza con `pnpm jupyter` desde `mi-primer-proyecto`. Funciona en Windows. Si falta el ejecutable de Jupyter Notebook (`.venv/Scripts/jupyter-notebook.exe` en Windows, `.venv/bin/jupyter-notebook` en Unix), el script crea el `.venv` si hace falta e instala `notebook==7.6.3`. Si ese ejecutable ya está, no reinstala. Después arranca Jupyter Notebook en `clients/jupyter`. El navegador se abre en la interfaz de notebooks y la lista son los documentos de esa carpeta. No arranca Lab. El kernel es el Python de ese `.venv`.

El dibujo lo hace `cli-table3` `0.6.5`. El encabezado en color sale solo si también está `@colors/colors` `1.6.1`. Esas dos dependencias están en `package.json` y se quedan.

El bloque parte de su carpeta y sube hasta la que contiene `logic/`. Esa es la app. Ahí arranca `node --input-type=module` y lee la salida con `encoding="utf-8"`. Si no la encuentra, termina con el texto `No encuentro la app.` El programa de Node hace la llamada y escribe la tabla. Si la llamada lanza un error, se ve ese mensaje, sin tabla de datos. Los datos de ejemplo del bloque se pueden editar antes de ejecutar.

La tabla usa `head` y `style.head` `["cyan", "bold"]`. Columnas de un usuario, en este orden: `id`, `name`, `email`, `createdAt`, `updatedAt`. Una lista es una fila por elemento. Una lista vacía deja los encabezados y la línea `No hay filas.` Si la llamada no devuelve nada, la tabla tiene la columna `Resultado` y la fila `No devuelve datos.` El conteo usa `women`, `men`, `genderUndefined`.

La anotación de cada documento dice que se abre con `pnpm jupyter` desde la app.

## Ficheros

Se tocan:

- `package.json`
- `start-jupyter.js`
- `docs/CONSTITUTIONS.md`
- `clients/jupyter/create-user.ipynb`
- `clients/jupyter/list-users.ipynb`
- `clients/jupyter/update-user.ipynb`
- `clients/jupyter/delete-user.ipynb`
- `clients/jupyter/users-gender-count.ipynb`

En el árbol, la línea de `jupyter/` dice que se abre con el Jupyter de la app.

## Documentos

`create-user`. Guarda un usuario. Inserta una fila, el id lo pone la base, el email queda en minúsculas y las dos fechas son el momento de la alta. Usa `createUser({ name: "Ada", email: "ada@example.com" })`. Anotaciones: `Name is empty`, `Email is invalid`, `Email is already used`.

`list-users`. Muestra los usuarios guardados, de menor a mayor id. Solo lee. Usa `listUsers()`. Anotación: sin usuarios, no hay filas.

`update-user`. Cambia el nombre de un usuario ya guardado. Actualiza esa fila y `updatedAt`. El id no cambia. Si no se manda email, se queda el que había. Usa `updateUser({ id: 1, name: "Ada Lovelace" })`. Anotaciones: `User id is not valid`, `No user exists with that id`, `Name is empty`, `Email is invalid`, `Email is already used`.

`delete-user`. Borra el usuario de ese id. Quita la fila y no devuelve datos. Usa `deleteUser({ id: 1 })`. Anotaciones: `User id is not valid`, `No user exists with that id`. Esto borra al usuario 1.

`users-gender-count`. Cuenta los usuarios según el género del nombre. Lo decide llama3.2 en local. Solo lee. No guarda el género. Usa `await usersGenderCount()`. Anotaciones: hace falta llama3.2 en marcha. Sin usuarios, los tres números son 0. Si no responde, `Could not classify the users`.

## Errores

No hay mensajes nuevos de `logic/`. Un fallo de la llamada se ve con el mensaje que ya lanza. Si no se encuentra la app, el texto es `No encuentro la app.`
