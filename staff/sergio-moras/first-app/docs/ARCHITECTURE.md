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
- `src/clients/browser/`: las pantallas del navegador (`index.html`, `styles.css` y `app.js`), que se abren desde el disco. `app.js` llama a `listUsers`, `updateUser` y `deleteUser`.
- `src/clients/rest/server.js`: el cliente API REST, con Express. Una ruta por operación de `logic/`.
- `src/clients/electron/`: el cliente de escritorio. `main.js` abre la ventana; `index.html`, `styles.css` y `app.js` son sus pantallas. `app.js` llama a `listUsers`, `createUser`, `updateUser` y `deleteUser`.

## Una operación
Una operación tiene, con el mismo nombre:
1. Un fichero en `logic/` que exporta su función.
2. Una consulta en `src/queries/users-sql.js` y una función en `src/queries/users.js`, si usa la base.
3. Un `.txt` en `src/clients/terminal/`.
4. Un `.ipynb` en `src/clients/jupyter/`.
5. Una ruta en `src/clients/rest/server.js`.

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
Se arranca con `pnpm db` y, en otra terminal, `pnpm browser`, desde `first-app/`. `pnpm browser` abre `src/clients/browser/index.html` en Chrome, en una ventana con un perfil aparte. Tiene tres pantallas: elegir el usuario en una lista, sus opciones (volver, modificar y notas, que está desactivada) y modificar o eliminar.

`app.js` importa `listUsers`, `updateUser` y `deleteUser` de `logic/` y las llama con `await`, como la terminal. Funciona porque `queries/users.js` solo usa `fetch` para hablar con el servidor de la base. Si `logic` lanza un error, la pantalla lo muestra como `Error: <mensaje>`.

No hay servidor del navegador: la página se abre desde el disco (`file://`) y Chrome lee de ahí los módulos de `logic/` y `queries/`. Por seguridad, Chrome no carga módulos desde `file://`, así que `pnpm browser` lo abre con:
- `--user-data-dir="%TEMP%\first-app-chrome"`: un perfil solo para esta app, aparte del Chrome de siempre.
- `--allow-file-access-from-files`: quita ese bloqueo, solo en ese perfil.

El comando usa `start` de `cmd`, que es lo que usa `pnpm` en Windows. Para cerrar la app se cierra la ventana de Chrome.

### API REST
Se arranca con `pnpm db` y, en otra terminal, `pnpm api`, desde `first-app/`. Escucha en `http://127.0.0.1:3000`, solo en este equipo, y se para con Ctrl+C. Usa Express (`express` 5.3.0).

`server.js` es un cliente como la terminal: cada ruta lee la petición, llama a una función de `logic/` con `await` y responde en JSON. No valida nada. Los cuerpos van en JSON.

| Petición | Llama a | Bien |
|---|---|---|
| `GET /users` | `listUsers()` | 200 y la lista |
| `GET /users?name=<nombre>` | `findUserByName(nombre)` | 200 y la lista |
| `GET /users/email/<email>` | `findUserByEmail(email)` | 200 y el usuario |
| `POST /users` con `{ name, email }` | `createUser(name, email)` | 201 y el usuario |
| `PATCH /users/<id>` con `{ name }`, `{ email }` o los dos | `updateUser(id, name, email)` | 200 y el usuario. Lo que no se envía no cambia |
| `DELETE /users/<id>` | `deleteUser(id)` | 200 y `{ id }` |
| `GET /users/genders` | `classifyGender()` | 200 y `{ men, women, undefinedGender }` |

Si `logic` lanza un error, la respuesta es `{ "error": "<mensaje>" }` con el mensaje de [ERRORS.md](ERRORS.md) tal cual. El código lo elige `getStatus` según cómo empieza el mensaje:

| El mensaje empieza por | Código |
|---|---|
| `Name is required.`, `Email is required.`, `Invalid email:`, `Invalid id:`, `Provide a new name, a new email, or both.` | 400 |
| `User not found:` | 404 |
| `Email already exists:` | 409 |
| `Users could not be classified:` | 502 |
| `Database is not running.` | 503 |
| Otro | 500 |

Una ruta o un método que no existe da 404 y `Not found.`; un cuerpo que no es JSON, 400 y `Invalid request.` La API no da permiso a los navegadores (`Access-Control-Allow-Origin`), así que una página web no puede llamarla. Un mensaje nuevo en [ERRORS.md](ERRORS.md) se añade también a la tabla de `getStatus`.

### Escritorio
Se arranca con `pnpm db` y, en otra terminal, `pnpm electron`, desde `first-app/`. Abre una ventana propia con Electron (`electron` 45.2.2, en `devDependencies`). Al cerrarla, la aplicación sale. Tiene dos pantallas: la lista de usuarios con el alta, y la ficha de un usuario, que se abre pulsándolo, con sus datos, guardar cambios y borrar con confirmación.

Electron tiene dos partes:
- `main.js`, el proceso principal: abre la ventana y carga `index.html` desde su carpeta. La página no tiene acceso a Node, no puede ir a otra dirección y no puede abrir ventanas.
- La página (`index.html`, `styles.css` y `app.js`): un cliente como el del navegador, con pantallas propias. `app.js` importa `logic/` y lo llama con `await`. Si `logic` lanza un error, la pantalla lo muestra como `Error: <mensaje>`.

La página lleva una CSP: solo carga sus propios ficheros y solo puede llamar a `http://127.0.0.1:4000`. Cargada desde el disco, la ventana no envía cabecera `Origin`, así que la base la atiende sin cambios.

Si la variable `ELECTRON_RUN_AS_NODE` está puesta, Electron se comporta como Node y `main.js` falla al importar `BrowserWindow`. La terminal normal no la tiene.

## Servidor de la base
Se arranca con `pnpm db` desde `first-app/` y escucha en `http://127.0.0.1:4000`, solo en este equipo. Se para con Ctrl+C. Los clientes necesitan que esté en marcha.

Solo atiende `POST /query` con `{ "query": "<nombre>", "params": [ ... ] }`. Busca el nombre en `USER_QUERIES` y ejecuta ese SQL con los valores en orden. Siempre devuelve una lista de filas; `queries/users.js` toma la primera cuando espera una sola.

| Caso | Responde |
|---|---|
| Consulta hecha | 200 y `{ "rows": [ ... ] }` |
| El nombre no está en `USER_QUERIES` | 404 y `{ "error": "Unknown query: <nombre>" }` |
| El cuerpo no es JSON, o falta `query` de texto o `params` en lista | 400 y `{ "error": "Invalid request." }` |
| Otra ruta u otro método | 404 y `{ "error": "Not found." }` |
| `POST` sin `Content-Type: application/json` | 400 y `{ "error": "Invalid request." }` |
| Trae una cabecera `Origin` que no es `file://` | 403 y `{ "error": "Forbidden origin." }` |
| `OPTIONS /query` | 204 y el permiso para el navegador |
| SQLite falla | 500 y `{ "error": "<mensaje de SQLite>" }` |

El navegador solo puede llamar a la base desde una página del disco abierta con `pnpm browser`: Chrome con `--allow-file-access-from-files` envía `Origin: file://`. Todas las respuestas llevan `Access-Control-Allow-Origin: file://`, nunca `*`, y `OPTIONS /query` contesta la pregunta que el navegador hace antes de cada `POST`. Una web (`http://` o `https://`) recibe 403, y un Chrome normal que abre un fichero del disco envía `Origin: null` y también recibe 403. Otra página del disco abierta en el perfil de la app sí podría llamar a la base: ese perfil es solo para esta app. La terminal, Jupyter y la ventana de escritorio no envían `Origin`, así que no les afecta.

`queries/users.js` lanza el `error` de la respuesta tal cual. Si no llega a conectar, lanza `Database is not running. Start it with pnpm db.` ([ERRORS.md](ERRORS.md#base-parada)).
