# Plan — cliente de navegador

No es una funcionalidad nueva de usuarios. No reemplaza ningún fichero de `src/logic/`. No hay firma nueva ni SQL nuevo. No se añade un paquete de Node: el servidor local es `node:http`, que ya viene con Node. No hay chequeo de Socket.

El navegador no abre la base. Pide los datos a un servidor de este equipo, en `127.0.0.1:3000`. Ese servidor es otro cliente: llama a las funciones que ya existen, igual que la terminal y Jupyter. No hay una capa entre `src/logic/` y `src/queries/`.

Las pantallas son HTML, CSS y JavaScript del navegador, sin frameworks. Una función por archivo. El código va en inglés. Los textos visibles van en español. Un fallo de guardar o borrar muestra el mensaje que ya lanza `src/logic/`, sin traducirlo.

## Ficheros

Se crean:

- `src/clients/http/start-http-server.js`
- `src/clients/http/handle-request.js`
- `src/clients/http/handle-users.js`
- `src/clients/http/read-json-body.js`
- `src/clients/http/send-json.js`
- `src/clients/http/send-http-error.js`
- `src/clients/http/serve-public-file.js`
- `src/clients/web/index.html`
- `src/clients/web/styles.css`
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

Se tocan:

- `package.json`
- `docs/CONSTITUTIONS.md`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`

No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los clientes de terminal y Jupyter.

## Llamadas

No hay función nueva.

| Pantalla               | Llamada                           |
| ---------------------- | --------------------------------- |
| La lista               | `listUsers()`                     |
| Elegir un id           | `findUserById(id)`                |
| Guardar nombre y email | `updateUser(id, { name, email })` |
| Borrar                 | `deleteUser(id)`                  |

La lista que ve el navegador lleva `id`, `name` y `email`. No lleva `createdAt` ni `updatedAt`.

`updateUser` sigue validando el nombre y el email. Si falta uno de los dos en el envío, conserva el que ya estaba guardado. `deleteUser` no devuelve el usuario.

El servidor solo responde a estas peticiones:

- `GET /api/users`
- `GET /api/users/1`
- `PATCH /api/users/1`
- `DELETE /api/users/1`

El id 1 es un ejemplo. El id es el elegido en la lista. El texto del id se comprueba entero antes de pasarlo a número. `1abc` y `1.5` no eligen otro usuario: el fallo es `Invalid id`.

Solo se sirven los archivos de `src/clients/web/` que están en una lista cerrada. Una ruta pedida no se convierte en una ruta del disco. La base y el código del servidor no se descargan.

## Errores

| Fallo de la spec                          | Mensaje                 |
| ----------------------------------------- | ----------------------- |
| El nombre queda vacío                     | `Name is empty`         |
| El email no vale                          | `Email is invalid`      |
| El email es el de otro usuario            | `Email is already used` |
| El id no es un entero mayor o igual que 1 | `Invalid id`            |
| Ese usuario ya no está                    | `User not found`        |

La lista vacía no es un fallo. `listUsers()` devuelve `[]` y la pantalla dice que no hay usuarios.

## Arranque

`package.json` añade el script `start`. Se lanza con `pnpm start` desde `first-app`. Arranca `src/clients/http/start-http-server.js`. Escucha solo en `127.0.0.1:3000`. Abre la base `src/db/users.sqlite`. No crea usuarios de ejemplo.

## Respuesta

No se modifican esos documentos antes de `tasks.md`. Las modificaciones de `docs/CONSTITUTIONS.md`, `docs/ARCHITECTURE.md`, `docs/tree.md`, `docs/style.md` y `AGENTS.md` van en `tasks.md`, junto con `pnpm start`. El código se escribe cuando se pidan esas tareas.
