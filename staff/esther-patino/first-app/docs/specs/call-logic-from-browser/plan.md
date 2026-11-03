# Plan — el navegador llama a las reglas

Issue: #826.

`docs/specs/vanilla-user-client` se queda. Las pantallas son las de su spec. El camino de su plan, las rutas `/api/users` en el puerto 3000, lo sustituye este. Esta carpeta es la que se implementa.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma nueva ni SQL nuevo. No se añade un paquete de Node. No hay chequeo de Socket.

`src/queries/users.js` ya pide `http://127.0.0.1:3000/execute` con `fetch`. Ese `fetch` también está en el navegador. `docs/specs/host-sql-on-node` ya dejó escrito que `fetch` desde un archivo del disco falla y que la respuesta lleva `access-control-allow-origin: *`. Las pantallas se sirven por HTTP en otro puerto. El JavaScript del navegador importa las funciones. Esas funciones piden los datos al programa que ya guarda la base.

`docs/specs/host-sql-on-node` dejó las pantallas en el puerto 3000 y dijo que no se lanzan a la vez que la base. Esta spec las pasa al 3001 para que la base siga en el 3000 y las dos puedan estar encendidas.

## Ficheros

No se toca `docs/specs/vanilla-user-client/`.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, la terminal ni Jupyter.

No se tocan `src/clients/web/index.html`, `styles.css`, `main.js`, `state.js`, `show-screen.js`, `show-message.js`, `show-user-menu.js`, `open-user-editor.js` ni `navigate.js`.

Se tocan:

- `src/clients/http/start-http-server.js`
- `src/clients/http/handle-request.js`
- `src/clients/http/serve-public-file.js`
- `src/clients/web/load-user-selection.js`
- `src/clients/web/select-user.js`
- `src/clients/web/save-user.js`
- `src/clients/web/delete-selected-user.js`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`

Se borran:

- `src/clients/http/handle-users.js`
- `src/clients/http/read-json-body.js`
- `src/clients/http/send-json.js`

`src/clients/http/send-http-error.js` se queda. Un archivo que no está en la lista sigue respondiendo un fallo.

`package.json` no cambia. `start` sigue arrancando `src/clients/http/start-http-server.js`. `docs/CONSTITUTIONS.md` y `AGENTS.md` no cambian: las tres pantallas siguen siendo el uso desde el navegador.

## Llamadas

No hay función nueva.

| Pantalla               | Llamada                           |
| ---------------------- | --------------------------------- |
| La lista               | `listUsers()`                     |
| Elegir un id           | `findUserById(id)`                |
| Guardar nombre y email | `updateUser(id, { name, email })` |
| Borrar                 | `deleteUser(id)`                  |

El id del desplegable es texto. La pantalla lo pasa a número antes de llamar. `validateId` rechaza un texto: el fallo es `Invalid id`.

La pantalla muestra `id`, `name` y `email`. `listUsers()` sigue devolviendo también `createdAt` y `updatedAt`. La pantalla no los muestra. `toUser` no cambia.

`updateUser` sigue validando el nombre y el email. `deleteUser` no devuelve el usuario.

No hay rutas `/api/users`. El navegador no llama a `fetch` para esas rutas.

## Archivos que se reparten

Solo se reparten los archivos de una lista cerrada. Cada entrada guarda su propia dirección de fichero, dentro de `src/clients/web/`, `src/logic/` o `src/queries/`. Una ruta pedida no se concatena a una carpeta del disco.

Las pantallas siguen en las rutas de ahora: `/`, `/index.html`, `/styles.css` y cada `.js` de `src/clients/web/`.

El navegador, al importar, pide también estas rutas:

- `/logic/list-users.js`
- `/logic/find-user-by-id.js`
- `/logic/update-user.js`
- `/logic/delete-user.js`
- `/logic/shared.js`
- `/queries/users.js`
- `/queries/queries/create-users-table.js`
- `/queries/queries/find-by-id.js`
- `/queries/queries/find-by-email.js`
- `/queries/queries/find-by-name.js`
- `/queries/queries/find-all.js`
- `/queries/queries/insert.js`
- `/queries/queries/update.js`
- `/queries/queries/remove.js`
- `/queries/queries/list-tables.js`

`src/queries/users.js` importa todos los módulos de `src/queries/queries/`. Por eso la lista los incluye. No se reparte `src/logic/users-gender-count.js`, ni `create-user.js`, ni `find-user-by-email.js`, ni `find-user-by-name.js`. No se reparten `src/db/server.js` ni `src/db/users.sqlite`.

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

`pnpm start` desde `first-app` escucha en `127.0.0.1:3001` y solo reparte la lista cerrada. Al arrancar escribe esa dirección. No abre la base y no crea usuarios de ejemplo.

Los dos se lanzan a la vez. Las pantallas se abren en `http://127.0.0.1:3001`.

## Respuesta

No se modifican `docs/ARCHITECTURE.md`, `docs/tree.md` ni `docs/style.md` antes de `tasks.md`. Esas modificaciones van en `tasks.md`, junto con el código. El código se escribe cuando se pidan esas tareas.
