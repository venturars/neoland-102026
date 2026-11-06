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

Las capas dos y tres salen de `package-lock.json`, con la versión que el lock resuelve dentro de `node_modules` de cada paquete. La capa dos son las 15 dependencias de `fastify@5.12.8`. La capa tres son 24 dependencias de esa capa dos.

`depscore` devolvió las cinco puntuaciones de las 39. Ninguna baja de 50. La más baja es calidad 75, en `real-require@1.0.0`. El mantenimiento más bajo es 75, en `abstract-logging@2.0.1`, `atomic-sleep@1.0.0`, `fast-deep-equal@3.1.3` y `quick-format-unescaped@4.0.4`.

Alertas: `alerts` con `org_slug` `vibecodingneoland`, `status` `open` y `artifact_type` `npm`. `items` llegó vacío y `endCursor` llegó nulo. No hay alerta abierta de npm en esa organización.

Campaña: `threat_feed` para `fastify@5.12.8`, ecosistema `npm`, respondió 403 `threat_feed_not_entitled`. El mensaje fue `Threat feed is not enabled for this organization. Please contact sales for information on enabling this feature.` No hay dato de campaña. Se acepta ese hueco. Las versiones se quedan: las puntuaciones que sí llegaron están en 50 o más y la lista de alertas abiertas está vacía.

- `@fastify/ajv-compiler@4.0.7`, capa 2. `depscore`: licencia 100, mantenimiento 89, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@fastify/error@4.2.1`, capa 2. `depscore`: licencia 100, mantenimiento 84, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@fastify/fast-json-stringify-compiler@5.1.1`, capa 2. `depscore`: licencia 100, mantenimiento 89, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@fastify/proxy-addr@5.1.2`, capa 2. `depscore`: licencia 100, mantenimiento 86, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `abstract-logging@2.0.1`, capa 2. `depscore`: licencia 100, mantenimiento 75, calidad 77, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `avvio@9.3.1`, capa 2. `depscore`: licencia 100, mantenimiento 90, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `fast-json-stringify@7.2.1`, capa 2. `depscore`: licencia 100, mantenimiento 97, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `find-my-way@9.10.0`, capa 2. `depscore`: licencia 100, mantenimiento 89, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `light-my-request@6.8.0`, capa 2. `depscore`: licencia 100, mantenimiento 89, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `pino@10.4.0`, capa 2. `depscore`: licencia 100, mantenimiento 89, calidad 100, cadena 98, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `process-warning@5.1.1`, capa 2. `depscore`: licencia 100, mantenimiento 89, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `rfdc@1.4.1`, capa 2. `depscore`: licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `secure-json-parse@4.1.1`, capa 2. `depscore`: licencia 100, mantenimiento 89, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `semver@7.8.6`, capa 2. `depscore`: licencia 100, mantenimiento 95, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `toad-cache@3.7.4`, capa 2. `depscore`: licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@fastify/deepmerge@3.2.4`, capa 3. `depscore`: licencia 100, mantenimiento 88, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@fastify/forwarded@3.1.2`, capa 3. `depscore`: licencia 100, mantenimiento 89, calidad 82, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@fastify/merge-json-schemas@0.2.2`, capa 3. `depscore`: licencia 100, mantenimiento 84, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `@pinojs/redact@0.4.0`, capa 3. `depscore`: licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `ajv-formats@3.0.1`, capa 3. `depscore`: licencia 100, mantenimiento 83, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `ajv@8.20.0`, capa 3. `depscore`: licencia 100, mantenimiento 84, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `atomic-sleep@1.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 75, calidad 85, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `cookie@2.0.1`, capa 3. `depscore`: licencia 100, mantenimiento 85, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `fast-deep-equal@3.1.3`, capa 3. `depscore`: licencia 100, mantenimiento 75, calidad 99, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `fast-querystring@1.1.2`, capa 3. `depscore`: licencia 100, mantenimiento 79, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `fast-uri@4.2.3`, capa 3. `depscore`: licencia 100, mantenimiento 98, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `fastq@1.20.3`, capa 3. `depscore`: licencia 100, mantenimiento 82, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `ipaddr.js@2.5.0`, capa 3. `depscore`: licencia 100, mantenimiento 82, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `json-schema-ref-resolver@3.0.1`, capa 3. `depscore`: licencia 100, mantenimiento 87, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `on-exit-leak-free@2.1.2`, capa 3. `depscore`: licencia 100, mantenimiento 79, calidad 85, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `pino-abstract-transport@3.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `pino-std-serializers@7.1.0`, capa 3. `depscore`: licencia 100, mantenimiento 82, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `quick-format-unescaped@4.0.4`, capa 3. `depscore`: licencia 100, mantenimiento 75, calidad 89, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `real-require@1.0.0`, capa 3. `depscore`: licencia 100, mantenimiento 83, calidad 75, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `safe-regex2@5.1.2`, capa 3. `depscore`: licencia 100, mantenimiento 87, calidad 90, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `safe-stable-stringify@2.5.0`, capa 3. `depscore`: licencia 100, mantenimiento 84, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `set-cookie-parser@3.2.2`, capa 3. `depscore`: licencia 100, mantenimiento 93, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `sonic-boom@4.2.1`, capa 3. `depscore`: licencia 100, mantenimiento 88, calidad 100, cadena 100, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.
- `thread-stream@4.2.1`, capa 3. `depscore`: licencia 100, mantenimiento 90, calidad 100, cadena 99, vulnerabilidad 100. Ninguna baja de 50. Campaña: el 403 de arriba. Alerta: la lista abierta de arriba.

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/rest/`

## Comprobar

Leer los tres documentos. Después de implementar, desde `first-app`, con `npm run db` en marcha, `npm run chrome`. Cargar la carpeta de la extensión en Chrome y seguir el ejemplo de Ada. Luego `npm run format` y `npm run lint`.
