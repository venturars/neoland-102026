# Plan — cliente REST de usuarios

Issue: #857.

Añade `express@5.3.0` y `src/clients/http/app.js`. También añade
`find-user-by-id` en `src/logic/` y su `.txt` en terminal, porque
`GET /users/:id` no existe sin esa función. No cambia reglas en el resto
de `logic/`.

El cliente importa `createUser`, `listUsers`, `findUserById`,
`updateUser` y `deleteUser`. Las funciones son síncronas; el cliente no
valida: mapea el `Error.message` al HTTP. `updateUser({ id, name?, email? })`.
`deleteUser({ id })`. El id de ruta es texto. `ORIGIN`
`http://127.0.0.1:3001`. Script `http` en `package.json`. La base sigue
en SQLite; no hay servidor SQL en el puerto 3000.

Rutas: `POST /users` (201), `GET /users` (200), `GET /users/:id` (200),
`PATCH /users/:id` (200), `DELETE /users/:id` (204 vacío). Otra ruta →
404 vacío. Éxito en JSON; error en `{ message }`.

## Ficheros

Crean: `src/logic/find-user-by-id.js`, `src/clients/http/app.js`,
`src/clients/terminal/find-user-by-id.txt`.

Tocan: `package.json`, `pnpm-lock.yaml`, `docs/ERRORS.md`,
`docs/CONSTITUTIONS.md`, `docs/TREE.md`, `docs/ARCHITECTURE.md`. `format`
incluye `src/clients/http/**/*.js`.

## Errores

| Fallo | Mensaje | HTTP |
| --- | --- | --- |
| Nombre vacío | `Name is empty` | 400 |
| Email inválido | `Email is invalid` | 400 |
| Id inválido | `User id is not valid` | 400 |
| Email en uso | `Email is already used` | 409 |
| Usuario ausente | `No user exists with that id` | 404 |
| SQLite al crear | `Could not create the user` | 500 |
| SQLite al listar | `Could not list the users` | 500 |
| SQLite al ver uno | `Could not find the user` | 500 |
| SQLite al modificar | `Could not update the user` | 500 |
| SQLite al borrar | `Could not delete the user` | 500 |

`ERRORS.md` y `CONSTITUTIONS.md` añaden `Could not find the user` y la
firma de `findUserById(id)`.

## Paquetes y Socket

`express@5.3.0`. `depscore`: license 100, maintenance 92, quality 100,
supplyChain 97, vulnerability 100; ninguna stat bajo 50. `threat_feed`:
403 `threat_feed_not_entitled`. Tras `pnpm install`, el árbol (3 capas)
se compara con el plan de referencia de Ventura; alertas en aceptación.
