# Arquitectura

## Capas

`clients/terminal/` es el cliente de terminal. Sus archivos ejecutan funciones de `logic/`, proporcionan datos de ejemplo y muestran el resultado. Cada archivo contiene una sola línea de ejemplo: el caso correcto.

`clients/jupyter/` es el cliente Notebook de las mismas operaciones. Cada cuaderno llama a las funciones que ya existen mediante `run_logic.py`; no contiene reglas de negocio ni SQL.

`bienvenida.ipynb` es el índice. Cada operación de terminal tiene un cuaderno. `preparar-tabla-usuarios.ipynb` explica la preparación de la tabla y no es una acción de usuario.

Cada cuaderno de operación tiene el escenario, las instrucciones y una celda. Si esa celda falla, muestra una frase en español y deja el detalle en `clients/jupyter/jupyter-client.log`.

Los cuadernos se abren con `pnpm jupyter` desde `first-app`. Usan el Jupyter del `.venv`, el kernel `first-app` y la base `db/users.sqlite`. No crean usuarios de ejemplo.

`logic/` es el núcleo de la aplicación. Contiene las funcionalidades para crear, buscar, actualizar, borrar y listar usuarios, y para contarlos según el género del nombre. Aplica las reglas de negocio y decide qué resultado recibe el cliente.

`logic/` no calcula `createdAt` ni `updatedAt` y no los envía a las consultas. Esas fechas las escribe SQLite.

`queries/users.js` lee los archivos SQL, prepara las consultas, proporciona sus parámetros y las ejecuta mediante la conexión compartida. Al cargar este módulo, crea la tabla `users` si todavía no existe.

`queries/queries/` contiene un archivo `.sql` por consulta. Los archivos contienen exclusivamente SQL y no contienen JavaScript ni reglas de negocio.

`db/connection.js` abre la conexión SQLite.

`db/users.sqlite` es la base de la aplicación. Si el proceso tiene `FIRST_APP_DATABASE_FILE`, la conexión abre esa ruta. Si no la tiene, abre `db/users.sqlite`. Ninguno de los dos clientes define esa variable.

Ninguna capa accede directamente a otra capa que no sea la siguiente del recorrido: `clients/terminal/` o `clients/jupyter/`, `logic/`, `queries/users.js`, `queries/queries/*.sql`, `db/connection.js`, `db/users.sqlite`. El cuaderno de preparar la tabla llama a `createUsersTable`, igual que su cliente de terminal.

## Ficheros

- `AGENTS.md` guarda el proceso SDD, los comandos y el cierre de una tarea. Enlaza a `docs/STYLE.md`.
- `.gitignore` deja fuera `node_modules/`, `.env`, los archivos de SQLite, los checkpoints de Jupyter y el log del cliente Jupyter.
- `package.json` declara los módulos ESM, `packageManager` con `pnpm@10.34.7`, el comando `pnpm jupyter` y el control que impide instalar con otro gestor.
- `pnpm-lock.yaml` es el archivo de bloqueo que se conserva.
- `db/connection.js` abre la conexión SQLite. Acepta `FIRST_APP_DATABASE_FILE` para que un proceso use otra ruta.
- `db/users.sqlite` es la base de la aplicación cuando no se configura otra ruta.
- `queries/users.js` lee, prepara y ejecuta las consultas. Al cargarse, crea la tabla `users` si no existe.
- `queries/queries/create-users-table.sql` es el SQL que crea la tabla `users` si no existe.
- `queries/queries/insert.sql` es el SQL que inserta un usuario.
- `queries/queries/find-by-email.sql` es el SQL que busca un usuario por email.
- `queries/queries/find-by-id.sql` es el SQL que busca un usuario por id.
- `queries/queries/update.sql` es el SQL que actualiza un usuario.
- `queries/queries/delete.sql` es el SQL que borra un usuario.
- `queries/queries/list.sql` es el SQL que lista los usuarios.
- `logic/create-user.js` es `createUser(name, email)`. Crea un usuario y devuelve `id`, `name`, `email`, `createdAt` y `updatedAt`.
- `logic/find-user-by-id.js` es `findUserById(id)`. Busca por id y devuelve ese usuario, o lanza un error si no existe.
- `logic/find-user-by-email.js` es `findUserByEmail(email)`. Busca por email y devuelve ese usuario, o lanza un error si no existe.
- `logic/update-user.js` es `updateUser(id, changes)`. Cambia `name` y `email` solo cuando esas propiedades vienen en `changes`. Si falta una, conserva la que ya está guardada. Devuelve el usuario completo.
- `logic/delete-user.js` es `deleteUser(id)`. Borra el usuario y no devuelve un valor.
- `logic/list-users.js` es `listUsers()`. No recibe datos y devuelve la lista de usuarios.
- `logic/count-users-by-gender.js` es `countUsersByGender()`. No recibe datos y devuelve `{ female, male, undefined }`. Llama a Ollama en local, modelo `gemma4`, con el paquete `openai` apuntando a `http://127.0.0.1:11434/v1`. Los nombres salen en partes de hasta 6. No añade una capa. La lectura sigue siendo `listUserRows()`.
- Cada `.txt` de `clients/terminal/` contiene una sola línea: el caso correcto de esa operación.
- `clients/jupyter/bienvenida.ipynb` es el índice de los cuadernos.
- `clients/jupyter/actualizar-usuario.ipynb` ejecuta el caso de actualización.
- `clients/jupyter/borrar-usuario.ipynb` ejecuta el caso de borrado.
- `clients/jupyter/buscar-usuario-por-email.ipynb` ejecuta la búsqueda por email.
- `clients/jupyter/buscar-usuario-por-id.ipynb` ejecuta la búsqueda por id.
- `clients/jupyter/contar-usuarios-por-genero.ipynb` ejecuta el recuento por género del nombre.
- `clients/jupyter/crear-usuario.ipynb` ejecuta el alta de usuario.
- `clients/jupyter/listar-usuarios.ipynb` ejecuta el listado de usuarios.
- `clients/jupyter/preparar-tabla-usuarios.ipynb` prepara la tabla y explica que no es una acción de usuario.
- `clients/jupyter/run_logic.py` arranca Node y comunica los cuadernos con las funciones existentes.
- `docs/ARCHITECTURE.md` dice la responsabilidad de cada capa y de cada fichero.
- `docs/TREE.md` es el árbol.
- `docs/DATABASE.md` es la base de datos y las queries.
- `docs/ERRORS.md` es la lista de errores.
- `docs/STYLE.md` es la forma de cada línea y las convenciones.
- `docs/CONSTITUTION.md` conserva las specs, los paquetes y los pasos de `logic/`. Enlaza a las otras guías.
- `docs/specs/<nombre>/` describe un pedido, con `spec.md`, `plan.md` y `tasks.md`. No describe el estado del código. `<nombre>` va en kebab-case.
