# Plan — cliente Chrome de usuarios

Issue: #944.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma nueva ni SQL nuevo. No se añade un `.txt` en `src/clients/terminal/`.

Hay un paquete nuevo: `fastify@5.12.8`. El resumen de Socket está más abajo. Aún no está instalado. El árbol es el que resolvió npm para esa versión y sus rangos, hasta 3 capas. Son 40 paquetes, sin repetir versión. Si `pnpm` resuelve otra versión dentro de un rango, esa versión no es la de este resumen y hay que volver a pasarla por Socket.

Todo el cliente vive en `src/clients/chrome/`. La API Fastify importa las funciones que ya existen y devuelve su resultado. El popup no importa `src/logic/`: pide a esa API. Se parece al cliente HTTP: la llamada está en el cliente y la regla sigue en `src/logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`. Ver uno usa `findUserById(id)`. Modificar usa `updateUser(id, changes)`. Borrar usa `deleteUser(id)`. No se importa `users-gender-count.js`, `find-user-by-name.js` ni `find-user-by-email.js`.

`validateId` rechaza un texto: el fallo es `Invalid id`. El id de la ruta es texto. La API lo pasa a número con `Number` antes de llamar. No lanza su propio mensaje. `Number("1")` es `1`. `Number("abc")` es `NaN` y `validateId` lanza `Invalid id`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se arranca con `pnpm server`. Esta API vive en `src/clients/chrome/server.js` y escucha en `http://127.0.0.1:3002`. La constante es `ORIGIN`. El cliente HTTP sigue en el 3001. `package.json` tiene el script `chrome`, que lanza `server.js`. Se lanza con `pnpm chrome` desde `first-app`. Al arrancar escribe esa dirección. El logger de Fastify va apagado.

Fastify lee el cuerpo JSON. Crear y modificar leen `name` y `email`. Si un campo no viene, no entra en `changes`, y `updateUser` conserva el valor guardado. La API no valida el nombre ni el email. Si lo lanzado no es un `Error` con un mensaje de la tabla de abajo, responde 500 con el `Could not` de esa acción. No inventa un mensaje.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista. Si no hay usuarios, la lista es `[]`.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta responde 404 y un cuerpo vacío. No hay mensaje nuevo.

Si la función lanza un `Error` con un mensaje de la tabla de abajo, el cuerpo es JSON con la clave `message` y ese texto.

El popup pide esas rutas con `fetch`. `manifest.json` es Manifest V3. El popup es `index.html`. El permiso de host es `http://127.0.0.1:3002/*`. No hay paquete de CORS. Los textos del popup van en español. El código va en inglés. Si `fetch` no llega, el popup muestra el `Could not` de esa acción.

## Ficheros

Se crean:

- `src/clients/chrome/server.js`
- `src/clients/chrome/manifest.json`
- `src/clients/chrome/index.html`
- `src/clients/chrome/popup.js`
- `src/clients/chrome/styles.css`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`

`package.json` añade `fastify` en `5.12.8` y el script `chrome`, que lanza `src/clients/chrome/server.js`. El script `format` sigue siendo `prettier --write .`. No se cambia su glob.

`docs/tree.md` añade `chrome/` dentro de `clients/`, con `server.js`, `manifest.json`, `index.html`, `popup.js` y `styles.css`.

`docs/ARCHITECTURE.md` dice que `src/clients/chrome/` es el cliente de la extensión. `src/clients/chrome/server.js` llama a `src/logic/`, escucha en el puerto 3002 y no repite sus reglas. El popup es `index.html` y pide esa API. No sustituye a `src/db/server.js` ni al cliente HTTP.

`docs/style.md` añade el comando `pnpm chrome`.

`docs/CONSTITUTIONS.md` dice, en la sección 1, que también se crea, se lista, se ve, se cambia y se borra un usuario desde una extensión de Chrome, con una API Fastify en el puerto 3002, y que la base sigue en el puerto 3000. En la sección 7 dice que este cambio añade el cliente Chrome y no añade un `.txt`. `AGENTS.md` no cambia: el `.txt` sigue siendo el cliente de una funcionalidad nueva, y esta no lo es.

`docs/errors.md` no cambia. Los mensajes de la tabla ya están.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, la terminal, Jupyter, `src/clients/web/` ni `src/clients/http/`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                          | Mensaje                     | Estado |
| ----------------------------------------- | --------------------------- | ------ |
| El nombre queda vacío                     | `Name is empty`             | 400    |
| El email no vale                          | `Email is invalid`          | 400    |
| El email es el de otro usuario            | `Email is already used`     | 409    |
| El id no es un entero mayor o igual que 1 | `Invalid id`                | 400    |
| Ese usuario no está                       | `User not found`            | 404    |
| No se llega a la API al crear             | `Could not create the user` | 500    |
| No se llega al listar                     | `Could not list the users`  | 500    |
| No se llega al ver uno                    | `Could not find the user`   | 500    |
| No se llega al modificar                  | `Could not update the user` | 500    |
| No se llega al borrar                     | `Could not delete the user` | 500    |

La lista vacía no es un fallo.

## Socket

Tres datos. Cada uno dice de dónde sale.

Las stats salen de `depscore`, con la versión exacta. Ninguna está por debajo de 50. La más baja es maintenance 75, en `abstract-logging@2.0.1`, `atomic-sleep@1.0.0`, `fast-deep-equal@3.1.3` y `quick-format-unescaped@4.0.4`. 50 no baja.

La alerta sale de `alerts`, con `org_slug` `socket-dev-neoland`, que es el que devolvió `organizations`. Se pidió la lista abierta, sin filtrar por paquete. `items` llegó vacío y `endCursor` llegó nulo. La misma lista vacía salió al filtrar por `npm`. Una lista vacía es la lista de la organización. No dice que estas versiones no tengan alerta.

La campaña sale de `threat_feed` para `fastify@5.12.8`, con ese mismo `org_slug`. Respondió 403 `threat_feed_not_entitled`: la organización no tiene threat feed. No hay dato de campaña. El rechazo es de la organización, así que tampoco hay dato de campaña para el resto del árbol.

- `@fastify/ajv-compiler@4.0.7`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 92, quality 100, supplyChain 99, vulnerability 100.
- `@fastify/deepmerge@3.2.4`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100.
- `@fastify/error@4.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100.
- `@fastify/fast-json-stringify-compiler@5.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 100, supplyChain 99, vulnerability 100.
- `@fastify/forwarded@3.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 82, supplyChain 100, vulnerability 100.
- `@fastify/merge-json-schemas@0.2.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100.
- `@fastify/proxy-addr@5.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100.
- `@pinojs/redact@0.4.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100.
- `abstract-logging@2.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 77, supplyChain 100, vulnerability 100.
- `ajv@8.20.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100.
- `ajv-formats@3.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100.
- `atomic-sleep@1.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 85, supplyChain 100, vulnerability 100.
- `avvio@9.3.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 91, quality 100, supplyChain 100, vulnerability 100.
- `cookie@2.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100.
- `fast-deep-equal@3.1.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100.
- `fast-json-stringify@7.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 100, supplyChain 99, vulnerability 100.
- `fast-querystring@1.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100.
- `fast-uri@4.2.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 98, quality 100, supplyChain 100, vulnerability 100.
- `fastify@5.12.8`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 97, quality 100, supplyChain 98, vulnerability 100.
- `fastq@1.20.3`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100.
- `find-my-way@9.10.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 100, supplyChain 99, vulnerability 100.
- `ipaddr.js@2.5.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100.
- `json-schema-ref-resolver@3.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100.
- `light-my-request@6.8.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 100, supplyChain 99, vulnerability 100.
- `on-exit-leak-free@2.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 79, quality 85, supplyChain 100, vulnerability 100.
- `pino@10.4.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 90, quality 100, supplyChain 98, vulnerability 100.
- `pino-abstract-transport@3.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100.
- `pino-std-serializers@7.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100.
- `process-warning@5.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 100, supplyChain 100, vulnerability 100.
- `quick-format-unescaped@4.0.4`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 75, quality 89, supplyChain 100, vulnerability 100.
- `real-require@1.0.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 83, quality 75, supplyChain 99, vulnerability 100.
- `rfdc@1.4.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100.
- `safe-regex2@5.1.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 90, supplyChain 100, vulnerability 100.
- `safe-stable-stringify@2.5.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100.
- `secure-json-parse@4.1.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 100, supplyChain 100, vulnerability 100.
- `semver@7.8.6`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 95, quality 100, supplyChain 100, vulnerability 100.
- `set-cookie-parser@3.2.2`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100.
- `sonic-boom@4.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100.
- `thread-stream@4.2.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100.
- `toad-cache@3.7.4`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100.
