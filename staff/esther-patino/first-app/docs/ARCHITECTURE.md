# Arquitectura

- `AGENTS.md` dice cómo se trabaja: el orden de un cambio, el estilo y qué hacer al cerrar una tarea.
- `package.json` declara el proyecto. Los scripts `format` y `lint` lanzan Prettier y ESLint.
- `pnpm-lock.yaml` fija las versiones de las dependencias.

- `scripts/` arranca Jupyter sobre `clients/jupyter/`.
  - `scripts/jupyter.js` arranca Jupyter sobre `clients/jupyter/`.

- `db/` abre la base de datos y no tiene reglas de negocio.
  - `db/connection.js` abre `db/users.sqlite`.
  - `db/users.sqlite` es la base de datos del proyecto.

- `docs/` guarda la constitución y las specs.
  - `docs/CONSTITUTIONS.md` manda el comportamiento de la app.
  - `docs/tree.md` es el árbol.
  - `docs/ARCHITECTURE.md` dice la función de cada carpeta y de cada archivo.
  - `docs/database.md` dice la base de datos y las consultas.
  - `docs/errors.md` dice los errores.
  - `docs/style.md` dice los comandos y el estilo.

- `docs/specs/<nombre>/` es un desarrollo.
  - `spec.md` es el negocio.
  - `plan.md` es la técnica.
  - `tasks.md` son los pasos.

- `logic/` guarda las reglas de negocio.
  - `logic/shared.js` comprueba el nombre, el email y el id, y deja el usuario plano.
  - `logic/create-user.js` crea un usuario.
  - `logic/list-users.js` lista los usuarios.
  - `logic/find-user-by-email.js` busca un usuario por email.
  - `logic/find-user-by-id.js` busca un usuario por id.
  - `logic/find-user-by-name.js` busca usuarios por nombre.
  - `logic/update-user.js` cambia un usuario.
  - `logic/delete-user.js` borra un usuario.
  - `logic/users-gender-count.js` cuenta los usuarios según el sexo que sugiere el nombre. No guarda el sexo.

- `queries/` guarda el SQL y lo ejecuta. No hay reglas de negocio.
  - `queries/users.js` lee los `.sql` y los ejecuta.
  - `queries/queries/create-users-table.sql` crea la tabla `users`.
  - `queries/queries/insert-user.sql` inserta un usuario.
  - `queries/queries/find-all.sql` lee todos los usuarios.
  - `queries/queries/find-by-email.sql` busca por email.
  - `queries/queries/find-by-id.sql` busca por id.
  - `queries/queries/find-by-name.sql` busca por nombre.
  - `queries/queries/update-user.sql` cambia un usuario.
  - `queries/queries/remove-user.sql` borra un usuario.

- `clients/` agrupa los clientes.

- `clients/terminal/` llama a `logic/` y es el test manual.
  - `clients/terminal/create-users-table.txt` prueba crear la tabla.
  - `clients/terminal/insert-user.txt` prueba crear un usuario.
  - `clients/terminal/find-all.txt` prueba listar los usuarios.
  - `clients/terminal/find-by-email.txt` prueba buscar por email.
  - `clients/terminal/find-by-id.txt` prueba buscar por id.
  - `clients/terminal/find-user-by-name.txt` prueba buscar por nombre.
  - `clients/terminal/update-user.txt` prueba cambiar un usuario.
  - `clients/terminal/remove-user.txt` prueba borrar un usuario.
  - `clients/terminal/users-gender-count.txt` prueba el recuento por sexo del nombre.

- `clients/jupyter/` sirve para validar las funcionalidades desde Jupyter.
  - `clients/jupyter/create-users-table.ipynb` valida crear la tabla.
  - `clients/jupyter/insert-user.ipynb` valida crear un usuario.
  - `clients/jupyter/find-all.ipynb` valida listar los usuarios.
  - `clients/jupyter/find-by-email.ipynb` valida buscar por email.
  - `clients/jupyter/find-by-id.ipynb` valida buscar por id.
  - `clients/jupyter/find-user-by-name.ipynb` valida buscar por nombre.
  - `clients/jupyter/update-user.ipynb` valida cambiar un usuario.
  - `clients/jupyter/remove-user.ipynb` valida borrar un usuario.
  - `clients/jupyter/users-gender-count.ipynb` valida el recuento por sexo del nombre.
