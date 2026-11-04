# Plan — cliente web de usuarios

Funcionalidad nueva. No cambia la lógica, el almacén, el SQL ni la base. Solo añade dos clientes: un servidor HTTP y la web que este sirve.

## Ficheros

Se crean, en `src/clients/http/`, un fichero por función:

- `start-http-server.js` — abre el almacén con `db` de `src/db/connection.js` y `createSqliteStore` de `src/queries/users.js`. Escucha en `127.0.0.1:3000` y escribe la URL en la consola.
- `handle-request.js` — si la ruta empieza por `/api/users`, llama a `handle-users.js`. Si no, llama a `serve-web-file.js`.
- `handle-users.js` — traduce cada ruta a una operación de `src/logic/index.js`.
- `read-json-body.js` — lee el cuerpo de la petición como JSON.
- `send-json.js` — responde con un estado y un JSON.
- `send-http-error.js` — convierte el `Error` en un estado HTTP y en `{ error }`.
- `serve-web-file.js` — sirve los ficheros de `src/clients/web/`.

Se crean, en `src/clients/web/`:

- `index.html`, `styles.css`
- `main.js`, `state.js`, `show-screen.js`, `show-message.js`, `navigate.js`
- `load-user-selection.js`, `select-user.js`, `show-user-menu.js`, `open-user-editor.js`, `save-user.js`, `delete-selected-user.js`, `show-notes.js`

Se tocan:

- `docs/CONSTITUCION.md`
- `AGENTS.md`
- `package.json` — script `start` y `format`
- `eslint.config.js` — globals del navegador para `src/clients/web/`

## API

| Método y ruta | Operación | Respuesta buena |
| --- | --- | --- |
| `GET /api/users` | `listUsers(store)` | 200, array de `{ id, nombre, email }` |
| `GET /api/users/:id` | `findUserById(store, id)` | 200, `{ id, nombre, email }` |
| `PATCH /api/users/:id` | `updateUser(store, id, { nombre, email })` | 200, usuario cambiado |
| `DELETE /api/users/:id` | `deleteUser(store, id)` | 200, usuario borrado |

El cuerpo del `PATCH` es `{ nombre, email }`. El servidor pasa solo esos dos campos a `updateUser`. No valida nada: las reglas son de `src/logic/`.

Una ruta o un método que no está en la tabla devuelve 404 `{ error: "Not found" }`.

## Errores HTTP

| Mensaje | Estado |
| --- | --- |
| `There is no user with id <id>` | 404 |
| `Name is required`, `Email is invalid`, `A name or an email is required`, `Email <email> is already registered` | 400 |
| Cuerpo que no es JSON | 400, `{ error: "Body is not valid JSON" }` |
| Cualquier otro fallo | 500, `{ error: "Unexpected error" }` |

Los 400 y 404 devuelven el mensaje original en `error`. El 500 no enseña el fallo interno.

## Ficheros web

`serve-web-file.js` tiene una lista fija con el nombre de cada fichero de `src/clients/web/` y su `Content-Type`. `/` sirve `index.html`. Una ruta que no está en la lista devuelve 404. Así `../` no puede salir de la carpeta.

## Cliente

`index.html` tiene cuatro `<section data-screen>`: `selection`, `menu`, `edit` y `notes`. Solo se ve una. También tiene un `<p id="message" role="status">` para los mensajes. Carga `main.js` como `type="module"`.

`STATE` en `state.js` guarda `selectedUser` e `isBusy`. Recargar la página vuelve a la selección.

`navigate.js` escucha los clics en los botones con `data-action` (`selection`, `menu`, `edit` y `notes`) y llama a la pantalla que toca.

Cada petición usa `fetch`. Mientras espera, se desactivan los botones de la pantalla y `isBusy` vale `true`. Si `response.ok` es falso, se muestra `error` del JSON. Si `fetch` lanza, se muestra `No se ha podido conectar con la aplicación`.

Borrar pide `confirm("¿Eliminar a <nombre>?")` antes del `DELETE`.

Los textos de usuario se ponen con `textContent`, nunca con `innerHTML`.

## Comprobación

- `pnpm lint` sin errores.
- `pnpm start` y abrir `http://127.0.0.1:3000`. Recorrer las cuatro pantallas y los casos de la spec. Si la lista sale vacía, crear antes un usuario con `src/clients/terminal/create-user.txt`.
- `curl -i http://127.0.0.1:3000/api/users/999` devuelve 404 con `There is no user with id 999`.
- `curl -i --path-as-is http://127.0.0.1:3000/../src/db/connection.js` devuelve 404.

## Antes de escribir el código

Hoy la constitución dice «HTTP y frontend no se añaden». Al implementar, primero se cambia, y solo después se escribe el código:

- En `docs/CONSTITUCION.md`, la tabla de quién sabe qué incluye `src/clients/http/*` (servidor local con `node:http`, llama a `src/logic/` y traduce los errores a HTTP) y `src/clients/web/*` (HTML, CSS y JS vanilla, que llama a la API y no copia validaciones).
- «Qué no entra» pasa a decir: el HTTP solo escucha en `127.0.0.1`, sin login. No se añaden paquetes para el servidor ni para la web. Las notas aún no existen.
- En `AGENTS.md`, «Comandos» incluye `pnpm start`.
