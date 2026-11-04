# Plan — las pantallas se abren desde el archivo

`docs/specs/vanilla-user-client` se queda. Las pantallas son las de su spec. `docs/specs/call-logic-from-browser` las dejó en `http://127.0.0.1:3001`, repartidas por `src/clients/http/`. Este camino sustituye ese reparto: se borra ese servidor y la página se abre desde el disco.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma nueva ni SQL nuevo. No se añade un paquete de Node. No hay chequeo de Socket.

La persona pidió ignorar `docs/style.md` en una sola cosa: la lógica de las pantallas vive en un solo archivo. El resto del estilo se queda.

## Ficheros

No se toca `docs/specs/vanilla-user-client/`.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, la terminal ni Jupyter.

No se toca `src/clients/web/styles.css`.

Se crea:

- `src/clients/web/app.js`

Se toca:

- `src/clients/web/index.html`
- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `AGENTS.md`
- `docs/specs/call-logic-from-browser/spec.md`
- `docs/specs/call-logic-from-browser/plan.md`
- `docs/specs/host-sql-on-node/plan.md`

Se borran:

- `src/clients/web/main.js`
- `src/clients/web/state.js`
- `src/clients/web/show-screen.js`
- `src/clients/web/show-message.js`
- `src/clients/web/load-user-selection.js`
- `src/clients/web/select-user.js`
- `src/clients/web/show-user-menu.js`
- `src/clients/web/open-user-editor.js`
- `src/clients/web/navigate.js`
- `src/clients/web/save-user.js`
- `src/clients/web/delete-selected-user.js`
- `src/clients/http/start-http-server.js`
- `src/clients/http/handle-request.js`
- `src/clients/http/send-http-error.js`
- `src/clients/http/serve-public-file.js`

`src/clients/http/` queda vacío y se borra. En `src/clients/web/` quedan `index.html`, `app.js` y `styles.css`.

## Llamadas

No hay función nueva. `app.js` importa estas y no llama a `fetch` por su cuenta:

| Pantalla               | Llamada                           |
| ---------------------- | --------------------------------- |
| La lista               | `listUsers()`                     |
| Elegir un id           | `findUserById(id)`                |
| Guardar nombre y email | `updateUser(id, { name, email })` |
| Borrar                 | `deleteUser(id)`                  |

El id del desplegable es texto. La pantalla lo pasa a número antes de llamar. `validateId` rechaza un texto: el fallo es `Invalid id`.

La pantalla muestra `id`, `name` y `email`. `listUsers()` sigue devolviendo también `createdAt` y `updatedAt`. La pantalla no los muestra.

`updateUser` sigue validando el nombre y el email. `deleteUser` no devuelve el usuario.

No hay rutas `/api/users`. No hay puerto 3001.

`index.html` deja las rutas que empiezan por `/`. La hoja es `styles.css` y el script es `app.js`, al lado del HTML, para que el archivo abierto desde el disco los encuentre.

## Errores

| Fallo de la spec                          | Mensaje                 |
| ----------------------------------------- | ----------------------- |
| El nombre queda vacío                     | `Name is empty`         |
| El email no vale                          | `Email is invalid`      |
| El email es el de otro usuario            | `Email is already used` |
| El id no es un entero mayor o igual que 1 | `Invalid id`            |
| Ese usuario ya no está                    | `User not found`        |

La lista vacía no es un fallo. `listUsers()` devuelve `[]` y la pantalla dice que no hay usuarios.

Un fallo de `src/logic/` se muestra con ese mensaje, sin traducirlo. Si el programa de la base no responde, la pantalla usa la frase de conexión que ya tiene. No se añade un mensaje nuevo.

## Arranque

`pnpm server` desde `first-app` sigue escuchando en `127.0.0.1:3000` y solo responde a `/execute`.

`package.json` pierde el script `start`, porque arranca `src/clients/http/start-http-server.js` y esa carpeta se borra.

Entra el script `open`. `pnpm open` abre `src/clients/web/index.html` en el navegador con el comando del sistema. No escucha un puerto, no abre la base y no crea usuarios de ejemplo. No añade un paquete. Lanzarlo pide permiso para abrir el navegador.

La base y la página pueden estar abiertas a la vez. La página no enciende la base.

## Decisión

Se abre el archivo desde el disco y se borra `src/clients/http/`.

`docs/specs/host-sql-on-node/plan.md` mantiene la comprobación de que `fetch` desde un `file://` falló. `docs/specs/open-screens-from-disk` sustituye la forma de abrir las pantallas: la página se abre desde el disco y `app.js` llama a `src/logic/`. Esas funciones siguen pidiendo la ejecución a `http://127.0.0.1:3000/execute`.

`docs/ARCHITECTURE.md`, `docs/tree.md`, `docs/style.md`, `AGENTS.md`, `docs/specs/call-logic-from-browser` y `docs/specs/host-sql-on-node/plan.md` se modifican antes del código. Dicen que no hay `src/clients/http/` y que las pantallas se abren con `pnpm open`.
