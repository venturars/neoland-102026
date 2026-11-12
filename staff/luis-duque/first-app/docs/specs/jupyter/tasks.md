# Tareas — Jupyter

1. Abre el `.gitignore` de la raíz del repositorio.
   La línea `.ipynb_checkpoints/` ya está. No se añade otra.
   No se crea `clients/jupyter/.gitignore`.
   Esos puntos de control no forman parte del cliente.

2. Abre `package.json` en `first-app`.
   El script `jupyter` crea `.venv` con `py -3` si falta `python.exe`, e instala `notebook` `7.6.3` si falta `jupyter-notebook.exe`.
   Luego ejecuta `.venv\Scripts\jupyter-notebook.exe clients\jupyter --ip=127.0.0.1`.
   pnpm añade `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`. No se crea otro fichero de arranque. No se tocan `logic`, `queries`, `db` ni `clients/terminal`.

3. Crea `clients/jupyter/create-user.ipynb`.
   El texto en español dice que crea un usuario. El bloque llama a `createUser({ name: "Terminal Client", email: "terminal-client@example.com" })` desde `./logic/create-user.js`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
   La tabla tiene una fila con `id`, `name` y `email`. No valida, no escribe SQL y no abre la base.

4. Crea `clients/jupyter/update-user.ipynb`.
   El texto en español dice que actualiza un usuario. El bloque llama a `updateUser(1, { name: "Ada Lovelace", email: "ada@example.com" })` desde `./logic/update-user.js`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
   La tabla tiene una fila con `id` y los campos enviados. No valida, no escribe SQL y no abre la base.

5. Crea `clients/jupyter/delete-user.ipynb`.
   El texto en español dice que elimina un usuario. El bloque llama a `deleteUser(1)` desde `./logic/delete-user.js`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
   Si no hay error, la tabla no tiene filas. No valida, no escribe SQL y no abre la base.

6. Crea `clients/jupyter/list-users.ipynb`.
   El texto en español dice que lista los usuarios. El bloque llama a `listUsers()` desde `./logic/list-users.js`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
   La tabla tiene una fila por usuario, con `id`, `name` y `email`, o ninguna fila. No valida, no escribe SQL y no abre la base.

7. Crea `clients/jupyter/find-user-by-id.ipynb`.
   El texto en español dice que busca por id. El bloque llama a `findUserById(1)` desde `./logic/find-user-by-id.js`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
   La tabla tiene una fila con `id`, `name` y `email`. No valida, no escribe SQL y no abre la base.

8. Crea `clients/jupyter/find-user-by-email.ipynb`.
   El texto en español dice que busca por email. El bloque llama a `findUserByEmail("user1@example.com")` desde `./logic/find-user-by-email.js`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
   La tabla tiene una fila con `id`, `name` y `email`. No valida, no escribe SQL y no abre la base.

9. Crea `clients/jupyter/find-user-by-name.ipynb`.
   El texto en español dice que busca por nombre. El bloque llama a `findUserByName("Carmen")` desde `./logic/find-user-by-name.js`.
   Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
   La tabla tiene una fila, o una por usuario, con `id`, `name` y `email`. No valida, no escribe SQL y no abre la base.

10. Crea `clients/jupyter/users-gender.ipynb`.
    El texto en español dice que cuenta el género de los nombres guardados. El bloque llama a `usersGender()` desde `./logic/users-gender.js`.
    Node se lanza en la app con `--input-type=module` y `FORCE_COLOR=1`. `cli-table3` dibuja la tabla y el encabezado es `["cyan", "bold"]`. Un `Error` se muestra tal cual.
    La tabla tiene una fila con `women`, `man` y `undefined`. No valida, no escribe SQL y no abre la base.

11. En el mismo cambio, abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Dejan escrito el cliente de `clients/jupyter`: un documento por operación, el resultado en una tabla con el encabezado en color y `pnpm jupyter` desde `first-app`.
    El Jupyter es el `.venv` de la app, con `notebook` `7.6.3`. La app sigue sin pantalla propia y sin servidor propio.
    No cambian las operaciones que ya existen. Los dos se leen y coinciden con el código.

12. Desde `first-app`, lanza `pnpm jupyter`.
    El navegador abre un documento por cada acción, en `127.0.0.1`.
    Son los ocho documentos. No se abre JupyterLab.
    Abrirlos no escribe en la base.
