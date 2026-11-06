# Plan — cliente HTTP nativo de usuarios

Issue: #1091.

Añade `src/clients/node-http/app.js` con `createServer` de `node:http`.
No cambia `src/logic/` ni `src/queries/`. No hay paquete npm nuevo.

El cliente importa `createUser`, `listUsers`, `findUserById`,
`updateUser` y `deleteUser`. No valida: mapea el `Error.message` al
mismo HTTP que `src/clients/http/app.js`. Si el mensaje no está en la
tabla, responde 500 con el `Could not …` de la acción.
`updateUser({ id, name?, email? })`. `deleteUser({ id })`. Id de ruta
como texto. Lee el JSON del cuerpo como `src/db/server.js`. `ORIGIN`
`http://127.0.0.1:3004`. Script `node-http` en `package.json`. La base
sigue en SQLite; hace falta `pnpm server`.

Rutas: `POST /users` (201), `GET /users` (200), `GET /users/:id` (200),
`PATCH /users/:id` (200), `DELETE /users/:id` (204 vacío). Otra ruta →
404 vacío. Éxito en JSON; error en `{ message }`. Sigue
`docs/STYLE.md` y `docs/ERRORS.md`.

## Jupyter

Cinco documentos en `src/clients/node-http/jupyter/`: crear, listar,
ver uno, cambiar y borrar. Texto en español. El bloque pide a `ORIGIN`
con `request` de `node:http` (subprocess Node, como el cliente Jupyter).
No importa `src/logic/`. Escribe el código HTTP y el cuerpo. `DELETE`
en 204 no escribe JSON. Si no hay servidor, se ve el error de la
petición.

`start-node-http-jupyter.js` copia `start-jupyter.js` y abre
`src/clients/node-http/jupyter`. Script `node-http-jupyter`. `jupyter`
sigue abriendo `src/clients/jupyter`.

## Ficheros

Crean: `src/clients/node-http/app.js`, `jupyter/create-user.ipynb`,
`jupyter/list-users.ipynb`, `jupyter/find-user-by-id.ipynb`,
`jupyter/update-user.ipynb`, `jupyter/delete-user.ipynb`,
`start-node-http-jupyter.js`.

Tocan: `package.json`, `docs/ARCHITECTURE.md`, `docs/TREE.md`,
`README.md`. `format` incluye `src/clients/node-http/**/*.js`.

## Errores

Igual que el plan de `express-rest-client` (misma tabla HTTP ↔ mensaje).

## Paquetes

Ninguno. `node:http` es nativo. No hay Socket.

Verificación: prueba manual HTTP en 3004 y los notebooks; Express,
Chrome y Nest sin cambios; `pnpm jupyter` igual; `pnpm format` y
`pnpm lint`.
