# Plan — personas en Chrome

Cumple `docs/specs/cliente-chrome/spec.md`. No es una acción nueva de `src/logic/`.

Este cambio solo escribe la spec, el plan y las tareas. No instala paquetes y no toca `package.json`. El código de abajo se escribe después de leer este plan.

## Tocar, después

- `src/clients/chrome/server.js`: escucha en `127.0.0.1:3002`. Llama a las funciones que ya existen. No decide si un email vale.
- `src/clients/chrome/extension/manifest.json`: extensión de Chrome, Manifest V3. Solo puede llamar a `http://127.0.0.1:3002/`.
- `src/clients/chrome/extension/popup.html`, `popup.js` y `popup.css`: la lista, el alta y la ficha. `popup.js` no importa `src/logic/`. Pide JSON a ese puerto.
- `package.json`: el script `chrome` es `node src/clients/chrome/server.js`. Se añade `fastify` `5.12.8`.
- `eslint.config.js`: `console` en `server.js`.
- `docs/CONSTITUTIONS.md`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md`: nombran este cliente.

La lista llama a `listUsers`. Abrir llama a `findUserById(id)`. Crear llama a `createUser({ name, email })` y responde 201. Guardar llama a `updateUser(id, changes)` solo con el nombre o el email que llegó. Borrar llama a `deleteUser(id)` y responde `{ id }`.

Rutas: `GET /users`, `GET /users/:id`, `POST /users`, `PATCH /users/:id`, `DELETE /users/:id`. El número de la dirección se convierte en un entero antes de llamar. No hay SQL nuevo. No hay firma nueva.

## Frases

Las que ya están en `docs/ERRORS.md`. El programa responde `{ error: frase }`. El código HTTP lo elige este cliente:

- `Name is empty`, `Email is invalid`, `Invalid id`: 400
- Cuerpo que no es JSON: 400 `Invalid request.`
- `User not found`: 404
- Ruta desconocida: 404 `Not found.`
- `Email is already used`: 409
- `Database is not running. Start it with npm run db.`: 503
- `Could not ...`: 500

La extensión muestra esa frase.

## Socket

Comprobado con Socket antes de este plan. La organización es `vibecodingneoland`. La fuente de las puntuaciones es `depscore`. La fuente de las alertas es `alerts`.

- `fastify@5.12.8`: cadena 98, calidad 100, mantenimiento 97, vulnerabilidad 100, licencia 100. Informe: https://socket.dev/npm/package/fastify
- Sus dependencias directas, en la versión más alta de cada rango, puntúan 75 o más. Ninguna baja de 50. La más baja es `abstract-logging@2.0.1`, mantenimiento 75 y calidad 77. Las otras son `pino@10.4.0`, `rfdc@1.4.1`, `avvio@9.3.1`, `semver@7.8.6`, `toad-cache@3.7.4`, `find-my-way@9.10.0`, `@fastify/error@4.2.1`, `process-warning@5.1.1`, `light-my-request@6.8.0`, `secure-json-parse@4.1.1`, `@fastify/proxy-addr@5.1.2`, `fast-json-stringify@7.2.1`, `@fastify/ajv-compiler@4.0.7` y `@fastify/fast-json-stringify-compiler@5.1.1`.
- Alertas abiertas de `fastify` en la organización: ninguna.
- El feed de amenazas no está activo en la organización, así que esa fuente no puede decir si esta versión está en una campaña.
- Las capas dos y tres no se puntuaron una a una.

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/rest/`

## Comprobar

Leer los tres documentos. Después de implementar, desde `first-app`, con `npm run db` en marcha, `npm run chrome`. Cargar la carpeta de la extensión en Chrome y seguir el ejemplo de Ada. Luego `npm run format` y `npm run lint`.
