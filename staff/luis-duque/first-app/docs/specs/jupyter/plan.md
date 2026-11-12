# Plan — Jupyter

Cumple `docs/specs/jupyter/spec.md`.

El cliente va en `clients/jupyter`.

## Ficheros

Se crea `clients/jupyter/`, con un documento por operación:

- `create-user.ipynb`
- `update-user.ipynb`
- `delete-user.ipynb`
- `list-users.ipynb`
- `find-user-by-id.ipynb`
- `find-user-by-email.ipynb`
- `find-user-by-name.ipynb`
- `users-gender.ipynb`

No se crea un `.gitignore` en `clients/jupyter`. El de la raíz ya tiene `.ipynb_checkpoints/`. Esos puntos de control los escribe Jupyter al abrir un documento. No forman parte del cliente.

Se toca `package.json`: el script `jupyter` queda guardado ahí. No hay otro fichero de arranque. pnpm añade `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`. `openai` sigue en `7.39.0`. `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano.

Se tocan, en el mismo cambio que el código:

- `docs/CONSTITUTIONS.MD`
- `AGENTS.MD`

No se tocan `logic`, `queries`, `db` ni `clients/terminal`.

## Firma

No hay función nueva. Cada documento llama a la función que ya existe:

| Documento | Llamada |
| --- | --- |
| `create-user.ipynb` | `createUser({ name, email })` |
| `update-user.ipynb` | `updateUser(id, changes)` |
| `delete-user.ipynb` | `deleteUser(id)` |
| `list-users.ipynb` | `listUsers()` |
| `find-user-by-id.ipynb` | `findUserById(id)` |
| `find-user-by-email.ipynb` | `findUserByEmail(email)` |
| `find-user-by-name.ipynb` | `findUserByName(name)` |
| `users-gender.ipynb` | `usersGender()` |

El script `jupyter` crea `.venv` con `py -3 -m venv .venv` si falta `.venv\Scripts\python.exe`. Si falta `.venv\Scripts\jupyter-notebook.exe`, instala `notebook` `7.6.3` con `.venv\Scripts\python.exe -m pip`. Si el paquete ya estaba y el ejecutable no, lo reinstala sin dependencias para recuperar el `.exe`. Luego ejecuta `.venv\Scripts\jupyter-notebook.exe clients\jupyter --ip=127.0.0.1`. Node de cada bloque se ejecuta en `first-app`, con `--input-type=module`, para resolver `cli-table3`. El import de la función es `./logic/...`. `clients/terminal` no cambia y sigue lanzándose desde la raíz del repositorio.

## SQL

No hay SQL nuevo. Cada documento usa la operación que ya está escrita.

## Cliente

El Jupyter de la app es un `.venv` en `first-app`. No se versiona: el `.gitignore` de la raíz ya ignora `.venv/`. No es el Jupyter instalado en el equipo. Dentro va `notebook` `7.6.3`.

`pnpm jupyter` ejecuta el script `jupyter` guardado en `package.json`: `(if not exist .venv\Scripts\python.exe py -3 -m venv .venv) & (if not exist .venv\Scripts\jupyter-notebook.exe .venv\Scripts\python.exe -m pip install notebook==7.6.3) & (if not exist .venv\Scripts\jupyter-notebook.exe .venv\Scripts\python.exe -m pip install --force-reinstall --no-deps notebook==7.6.3) & .venv\Scripts\jupyter-notebook.exe clients\jupyter --ip=127.0.0.1`. Cada `if` va entre paréntesis: en cmd, un `if` falso se come el resto de la línea. Abre `clients/jupyter` con el ejecutable de `.venv\Scripts`. No abre JupyterLab. El kernel es el Python de ese `.venv`.

Cada documento tiene un texto en español que dice qué hace la operación, y un bloque ya escrito. Quien lo abre ejecuta el bloque y no lo modifica.

El bloque llama a Node en esa carpeta con `FORCE_COLOR=1` y lee la salida como UTF-8. En Windows la salida llega por una tubería, no por la página de códigos de la consola, así que las tildes y la eñe no se rompen. La tabla la dibuja `cli-table3`. El encabezado usa `head` y `style.head` `["cyan", "bold"]`. El color sale porque está `@colors/colors`. Sin filas, el encabezado en color se queda. No valida, no escribe SQL y no abre la base.

La tabla enseña lo que la función devuelve:

- Crear, buscar por id y buscar por email: una fila con `id`, `name` y `email`.
- Actualizar: una fila con `id` y los campos enviados.
- Buscar por nombre: una fila si hay uno, o una fila por usuario si hay varios. Columnas `id`, `name` y `email`.
- Listar: una fila por usuario, con `id`, `name` y `email`. Si no hay ninguno, la tabla no tiene filas.
- Contar el género: una fila con `women`, `man` y `undefined`.
- Eliminar: si la llamada termina sin error, la tabla no tiene filas. Eso muestra que ese usuario ya no está. `deleteUser` no devuelve el usuario.

Los datos de ejemplo del bloque son los del txt de la misma operación. Crear usa el nombre `Terminal Client` y el email `terminal-client@example.com`. Actualizar usa el id `1`, el nombre `Ada Lovelace` y el email `ada@example.com`. Eliminar y buscar por id usan el id `1`. Buscar por email usa `user1@example.com`. Buscar por nombre usa `Carmen`. Listar y contar el género no llevan datos.

Si la función lanza un `Error`, el bloque muestra ese texto y no lo cambia. Un email repetido sigue saliendo como el rechazo de SQLite.

Abrir la lista no escribe en la base. Listar, buscar y contar el género tampoco. Crear, actualizar y eliminar siguen guardando el cambio que ya guardan.

## Documentación

`docs/CONSTITUTIONS.MD` gana el cliente de Jupyter en el árbol, en `clients/jupyter`, y una explicación corta: es otra forma de pedir la misma operación, en el navegador, un documento por operación, con el resultado en una tabla y el encabezado en color. Se abre con el Jupyter de la app, el `.venv` de `first-app`, mediante `pnpm jupyter`. La app sigue sin pantalla propia y sin servidor propio.

`AGENTS.MD` deja la regla nueva: el cliente de Jupyter vive en `clients/jupyter`, un `.ipynb` por acción, con el mismo nombre que el txt. El bloque importa la función de `logic` y muestra una tabla de `cli-table3` con el encabezado `["cyan", "bold"]`. El script mira `.venv\Scripts\jupyter-notebook.exe`, instala `notebook` `7.6.3` en el entorno si falta, y ejecuta ese ejecutable. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm jupyter`, que usa el `.venv` de `first-app` y `notebook` `7.6.3`. No usa el Jupyter del equipo. En Windows la salida de Node se lee en UTF-8.
