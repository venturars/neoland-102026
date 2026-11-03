# Arquitectura

## Capas
El código de la app está en `src/`. El resto de `first-app/` es documentación, configuración y flujo de git.

El flujo es `clients → logic → queries → db`. Cada capa solo llama a la siguiente. Entre `queries/` y `db/` hay una petición HTTP local: `db/` es un servidor que tiene que estar en marcha (`pnpm db`).

| Capa | Hace | No hace |
|---|---|---|
| `clients/` | Llama a una función de `logic/` con unos valores y muestra el resultado o el error | Validar, decidir mensajes ni tocar la base |
| `logic/` | Valida los datos, aplica las reglas, llama a `queries/` y devuelve el resultado o lanza un error de [ERRORS.md](ERRORS.md) | SQL, imprimir, leer `process.argv` ni llamar a `process.exit` |
| `queries/` | Escribe el SQL, pide cada consulta por su nombre al servidor de `db/` y devuelve las filas | Validar ni decidir mensajes, salvo el de base parada |
| `db/` | Abre la base, crea la tabla si no existe y ejecuta las consultas de `queries/` que le piden por su nombre | Reglas de negocio ni ejecutar SQL que le llegue de fuera |

La base de datos está en [DATABASE.md](DATABASE.md). El árbol completo, en [TREE.md](TREE.md).

## Ficheros
- `src/db/connection.js`: la única conexión a `src/db/users.sqlite`. Crea la tabla `users` si no existe. Solo la importa `server.js`.
- `src/db/server.js`: el servidor de la base. Ejecuta las consultas de `users-sql.js` que le piden por su nombre.
- `src/queries/users-sql.js`: todo el SQL de la tabla `users`, en `USER_QUERIES`, un texto por nombre.
- `src/queries/users.js`: pide las consultas al servidor con `fetch`. Exporta `insertUser`, `selectUserByEmail`, `selectAllUsers`, `selectUsersByName`, `updateUserById` y `deleteUserById`.
- `src/logic/create-user.js`: crea un usuario.
- `src/logic/find-user-by-email.js`: busca un usuario por su email.
- `src/logic/find-user-by-name.js`: busca los usuarios con un nombre exacto, por id.
- `src/logic/list-users.js`: lista los usuarios por id.
- `src/logic/update-user.js`: cambia el nombre, el email o los dos de un usuario.
- `src/logic/delete-user.js`: borra un usuario.
- `src/logic/classify-gender.js`: cuenta hombres, mujeres y no definidos con un modelo de Ollama. Exporta también `countGenders`, que hace el conteo sobre una lista.
- `src/clients/terminal/<operación>.txt`: el comando que se pega en la terminal.
- `src/clients/jupyter/<operación>.ipynb`: el documento que se ejecuta en Jupyter.
- `src/clients/browser/server.js`: el servidor del cliente de navegador. Sirve las pantallas y llama a `listUsers`, `updateUser` y `deleteUser`.
- `src/clients/browser/public/`: las pantallas del navegador (`index.html`, `styles.css` y `app.js`).

## Una operación
Una operación tiene, con el mismo nombre:
1. Un fichero en `logic/` que exporta su función.
2. Una consulta en `src/queries/users-sql.js` y una función en `src/queries/users.js`, si usa la base.
3. Un `.txt` en `src/clients/terminal/`.
4. Un `.ipynb` en `src/clients/jupyter/`.

Una operación nueva es un fichero nuevo en `logic/`. Un fichero de `logic/` ya creado no se reemplaza para encajar otra operación.

## Un fichero de `logic/`
- Exporta una función `async`, con el nombre de la acción. Llama a `queries/` con `await`.
- Valida los parámetros, aplica las reglas de negocio y llama a `queries/`.
- Devuelve el resultado o lanza `throw new Error` con un mensaje de [ERRORS.md](ERRORS.md).
- No lee `process.argv`, no imprime y no llama a `process.exit`. Eso lo hace el cliente.

## Clientes

### Terminal
Cada `.txt` es un comando que se pega desde `first-app/`, en PowerShell o en Git Bash:
- `node --no-warnings --input-type=module -e "` en la primera línea, el código sangrado debajo y `"` sola en la última.
- El código importa la función de `logic/`, la llama con `await` dentro de un `try` y muestra el resultado. En el `catch` escribe `Error: <mensaje>` y termina con `process.exit(1)`.
- Dentro del código, solo comillas simples y sin `${...}`: una comilla doble cerraría el comando y Git Bash sustituiría `${...}`.

### Jupyter
Cada `.ipynb` tiene un bloque de texto (qué hace, qué pasa en la base, qué comando usa y anotaciones) y un bloque de Python que:
- sube de carpeta hasta la que contiene `logic/`, o se para con `App not found.`;
- lanza Node con el código de la operación y lee su salida en UTF-8;
- muestra el resultado en una tabla de `cli-table3` con el encabezado en color, o el `Error: <mensaje>`.

### Navegador
Se arranca con `pnpm browser` desde `first-app/` y se abre `http://127.0.0.1:3000`. Tiene tres pantallas: elegir el usuario en una lista, sus opciones (volver, modificar y notas, que está desactivada) y modificar o eliminar.

El JavaScript del navegador no puede importar `logic/`, porque `logic` usa `node:sqlite`. Por eso el cliente tiene dos partes:
- `server.js`, con `node:http`, es el que importa las funciones de `logic/`. Escucha solo en `127.0.0.1`.
- `public/app.js` cambia de pantalla y llama al servidor con `fetch`.

| Petición | Llama a | Responde |
|---|---|---|
| `GET /`, `/styles.css`, `/app.js` | — | El fichero de `public/` |
| `GET /users` | `listUsers()` | 200 y la lista en JSON |
| `PUT /users/<id>` con `{ name, email }` | `updateUser(id, name, email)` | 200 y el usuario en JSON |
| `DELETE /users/<id>` | `deleteUser(id)` | 200 y `{ id }` |

Si `logic` lanza un error, el servidor responde 400 y `{ "error": "<mensaje>" }`, y la pantalla lo muestra como `Error: <mensaje>`. Cualquier otra ruta da 404 y `Not found.` El servidor no valida nada: el `<id>` llega como texto y lo valida `logic`.

## Servidor de la base
Se arranca con `pnpm db` desde `first-app/` y escucha en `http://127.0.0.1:4000`, solo en este equipo. Se para con Ctrl+C. Los clientes necesitan que esté en marcha.

Solo atiende `POST /query` con `{ "query": "<nombre>", "params": [ ... ] }`. Busca el nombre en `USER_QUERIES` y ejecuta ese SQL con los valores en orden. Siempre devuelve una lista de filas; `queries/users.js` toma la primera cuando espera una sola.

| Caso | Responde |
|---|---|
| Consulta hecha | 200 y `{ "rows": [ ... ] }` |
| El nombre no está en `USER_QUERIES` | 404 y `{ "error": "Unknown query: <nombre>" }` |
| El cuerpo no es JSON, o falta `query` de texto o `params` en lista | 400 y `{ "error": "Invalid request." }` |
| Otra ruta u otro método | 404 y `{ "error": "Not found." }` |
| SQLite falla | 500 y `{ "error": "<mensaje de SQLite>" }` |

`queries/users.js` lanza el `error` de la respuesta tal cual. Si no llega a conectar, lanza `Database is not running. Start it with pnpm db.` ([ERRORS.md](ERRORS.md#base-parada)).
