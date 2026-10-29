# Arquitectura

- `AGENTS.md` dice cómo se trabaja: el orden de un cambio, el estilo y qué hacer al cerrar una tarea.
- `package.json` declara el proyecto. Los scripts `format` y `lint` lanzan Prettier y ESLint.
- `pnpm-lock.yaml` fija las versiones de las dependencias.

- `scripts/` arranca Jupyter sobre `src/clients/jupyter/`.
  - `scripts/jupyter.js` arranca Jupyter sobre `src/clients/jupyter/`.

- `src/db/` abre la base de datos y no tiene reglas de negocio.
  - `src/db/connection.js` abre `src/db/users.sqlite`.
  - `src/db/users.sqlite` es la base de datos del proyecto.

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

- `src/logic/` guarda las reglas de negocio.
  - `src/logic/shared.js` comprueba el nombre, el email y el id, y deja el usuario plano.
  - `src/logic/create-user.js` crea un usuario.
  - `src/logic/list-users.js` lista los usuarios.
  - `src/logic/find-user-by-email.js` busca un usuario por email.
  - `src/logic/find-user-by-id.js` busca un usuario por id.
  - `src/logic/find-user-by-name.js` busca usuarios por nombre.
  - `src/logic/update-user.js` cambia un usuario.
  - `src/logic/delete-user.js` borra un usuario.
  - `src/logic/users-gender-count.js` cuenta los usuarios según el sexo que sugiere el nombre. No guarda el sexo.

- `src/queries/` guarda el SQL y lo ejecuta. No hay reglas de negocio.
  - `src/queries/users.js` lee los `.sql` y los ejecuta.
  - `src/queries/queries/create-users-table.sql` crea la tabla `users`.
  - `src/queries/queries/insert-user.sql` inserta un usuario.
  - `src/queries/queries/find-all.sql` lee todos los usuarios.
  - `src/queries/queries/find-by-email.sql` busca por email.
  - `src/queries/queries/find-by-id.sql` busca por id.
  - `src/queries/queries/find-by-name.sql` busca por nombre.
  - `src/queries/queries/update-user.sql` cambia un usuario.
  - `src/queries/queries/remove-user.sql` borra un usuario.

- `src/clients/` agrupa los clientes.

- `src/clients/terminal/` llama a `src/logic/` y es el test manual.
  - `src/clients/terminal/create-users-table.txt` prueba crear la tabla.
  - `src/clients/terminal/insert-user.txt` prueba crear un usuario.
  - `src/clients/terminal/find-all.txt` prueba listar los usuarios.
  - `src/clients/terminal/find-by-email.txt` prueba buscar por email.
  - `src/clients/terminal/find-by-id.txt` prueba buscar por id.
  - `src/clients/terminal/find-user-by-name.txt` prueba buscar por nombre.
  - `src/clients/terminal/update-user.txt` prueba cambiar un usuario.
  - `src/clients/terminal/remove-user.txt` prueba borrar un usuario.
  - `src/clients/terminal/users-gender-count.txt` prueba el recuento por sexo del nombre.

- `src/clients/jupyter/` sirve para validar las funcionalidades desde Jupyter.
  - `src/clients/jupyter/create-users-table.ipynb` valida crear la tabla.
  - `src/clients/jupyter/insert-user.ipynb` valida crear un usuario.
  - `src/clients/jupyter/find-all.ipynb` valida listar los usuarios.
  - `src/clients/jupyter/find-by-email.ipynb` valida buscar por email.
  - `src/clients/jupyter/find-by-id.ipynb` valida buscar por id.
  - `src/clients/jupyter/find-user-by-name.ipynb` valida buscar por nombre.
  - `src/clients/jupyter/update-user.ipynb` valida cambiar un usuario.
  - `src/clients/jupyter/remove-user.ipynb` valida borrar un usuario.
  - `src/clients/jupyter/users-gender-count.ipynb` valida el recuento por sexo del nombre.
