# Plan — cliente de usuarios en una extensión de Chrome

Issue: #965

Funcionalidad nueva, solo en `src/clients/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje nuevo. `src/db/server.js` y `src/queries/` no cambian.

El diseño toma de referencia el cliente de Chrome de Ventura (issue #911), por decisión de Diego. Hay cuatro diferencias acordadas: el código lleva comentarios por bloques en castellano, la ventana muestra un mensaje si la API está parada, borrar pide confirmación y la API comprueba `Host` y `Origin`.

Hay un paquete nuevo: `fastify@5.12.8`, en `dependencies`. El resultado de Socket está abajo.

## Cómo funciona

Una extensión solo puede cargar ficheros de su propia carpeta, así que no puede importar `src/logic/`. Por eso habla con una API local:

```
extensión (ventana de Chrome)
  → server.js (127.0.0.1:3002)
    → src/logic/
      → src/queries/
        → src/db/server.js (127.0.0.1:3000)
```

- `server.js` es parte del cliente. Traduce cada ruta a una operación de `src/logic/` y no valida nada.
- Quien prueba la app lanza `pnpm start` en una terminal y `pnpm chrome` en otra. Luego carga `src/clients/chrome/` en `chrome://extensions`: modo de desarrollador y «Cargar extensión sin empaquetar».
- La extensión es Manifest V3. La acción abre `index.html`. Su permiso `host_permissions` solo cubre `http://127.0.0.1:3002/*`, y con él Chrome la deja llamar a la API sin cabeceras CORS.
- `server.js` importa las operaciones fichero a fichero, no desde `logic/index.js`, para no cargar `openai`.

## Ficheros

Se crean en `src/clients/chrome/`, la carpeta que se carga en Chrome:

- `server.js` — la API con Fastify. La lanza `pnpm chrome`.
- `manifest.json` — Manifest V3, acción y `host_permissions`. No lleva comentarios, porque es JSON.
- `index.html` — la lista, los cuatro formularios, el usuario visto y un `<p id="message" role="status">`. Carga `popup.js` como `type="module"`, sin script en línea.
- `popup.js` — toda la lógica de la ventana.
- `styles.css` — el aspecto de la pantalla. El mensaje de error se distingue del resto.

Se tocan:

- `package.json` — `fastify` `5.12.8` en `dependencies`, script `"chrome": "node src/clients/chrome/server.js"` y `src/clients/chrome/**/*.{js,html,css}` en `format`.
- `pnpm-lock.yaml` — lo actualiza `pnpm install`.
- `eslint.config.js` — `document` y `fetch` para `src/clients/chrome/popup.js`. `server.js` importa `console` de `node:console`, como `src/db/server.js`.
- `AGENTS.md` — dependencias, comando `pnpm chrome`, cómo cargar la extensión, alcance de `pnpm format` y clientes que necesitan el servidor.
- `docs/ARCHITECTURE.md` — filas en «Quién sabe qué» para la API y la extensión.
- `docs/TREE.md` — `clients/chrome/`.

Los campos son `type="text"` y sin `required`, para que los mensajes sean los de `logic`. Los textos de la base se ponen con `textContent`. Lo que ve la persona está en castellano. El código lleva comentarios por bloques en castellano, también encima de cada import.

## API

| Método y ruta | Operación | Respuesta buena |
| --- | --- | --- |
| `POST /users` | `createUser({ name, email })` | 201, usuario |
| `GET /users` | `listUsers()` | 200, array de usuarios |
| `GET /users/:id` | `findUserById(id)` | 200, usuario |
| `PATCH /users/:id` | `updateUser(id, changes)` | 200, usuario |
| `DELETE /users/:id` | `deleteUser(id)` | 204, sin cuerpo |

- En `PATCH`, un campo que no llega no entra en `changes`, y `updateUser` conserva el valor guardado.
- Otra ruta responde 404 sin cuerpo.
- Un fallo responde `{ "message": "<mensaje>" }` con el estado de la tabla de errores. Si lo lanzado no es un mensaje de esa acción, responde 500 con su `Could not …`.

## Ventana

- **Crear:** envía el nombre y el email, aunque estén vacíos.
- **Listar:** muestra `id`, `name`, `email`, `createdAt` y `updatedAt`. Si no hay usuarios, la lista queda vacía.
- **Ver:** pide el id y muestra esos cinco datos.
- **Modificar:** envía `name` y `email` solo si el campo tiene texto.
- **Borrar:** pide el id. Al pulsar «Borrar» aparecen «Confirmar» y «Cancelar» en la misma ventana, con el id que se va a borrar. «Confirmar» borra, no muestra un usuario y vuelve a pedir la lista. «Cancelar» no hace nada. No se usa `confirm()`, porque un diálogo puede cerrar la ventana de la extensión.
- **API parada:** cada `fetch` va dentro de un `try/catch`. Si falla o la respuesta no es JSON, se ve el `Could not …` de esa acción. Lo mismo pasa con un id vacío, porque esa ruta no existe y responde 404 sin cuerpo.

## Firma

No hay función nueva en `src/logic/`. El cliente usa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`.

## SQL

No hay SQL.

## Errores

La ventana muestra el mensaje tal como llega.

| Fallo de la spec | Mensaje de `docs/ERRORS.md` | Estado |
| --- | --- | --- |
| El nombre queda vacío | `Name is empty` | 400 |
| El email no vale | `Email is invalid` | 400 |
| El email es de otro usuario | `Email is already used` | 409 |
| El usuario no está | `User not found` | 404 |
| No se llega al crear | `Could not create the user` | 500 |
| No se llega al listar | `Could not list the users` | 500 |
| No se llega al ver uno | `Could not find the user` | 500 |
| No se llega al modificar | `Could not update the user` | 500 |
| No se llega al borrar | `Could not delete the user` | 500 |

Si la base está parada, el mensaje lo lanza `logic`. Si está parada la API, lo pone `popup.js`, con el mismo texto. No hay mensaje nuevo.

## Protección de la API

Un `onRequest` de Fastify comprueba cada petición antes de atenderla, con las mismas ideas que `src/db/server.js`:

- Si la cabecera `Host` no es `127.0.0.1:3002`, responde 403 sin cuerpo. Protege del DNS rebinding.
- Si llega `Origin` y no empieza por `chrome-extension://`, responde 403 sin cuerpo. Sin `Origin` se atiende, como en `src/db/server.js`. No se fija un id de extensión, porque cambia según la carpeta desde la que se carga.
- Un cuerpo que no es JSON lo rechaza Fastify con 415.

No da permiso CORS a nadie. Esto no es autenticación: un programa de tu ordenador puede falsear estas cabeceras, y cualquier extensión instalada con permiso sobre ese host puede llamar a la API. Es el mismo nivel de confianza que ya tiene `src/db/server.js`.

## Riesgo que se acepta

`server.js` se carga en Chrome junto a la extensión, porque va en la misma carpeta. Chrome no lo ejecuta.

## Pruebas

La API se prueba con peticiones. La ventana la prueba Diego a mano: según el plan de Ventura, Chrome 157 ignora `--load-extension`. Aquí está Chrome 156 y no se ha probado.

## Socket

Consulta propia del 2026-11-04 a `https://mcp.socket.dev/`, sin iniciar sesión. Las versiones salen de `npm view`, resolviendo cada rango a su versión más alta, desde `fastify@5.12.8` y hasta 3 capas. Se han mirado las dependencias normales, las opcionales y los peers obligatorios. Son 48 paquetes y ninguno llega como opcional ni como peer. Aún no está instalado.

- **Stats:** salen de la herramienta `depscore`. Responde por los 48. Ninguna está por debajo de 50. La más baja es 75.
- **Alertas: sin comprobar.** La herramienta `alerts` necesita una organización. `organizations` responde 401 sin iniciar sesión. Según su documentación, Socket pide OAuth en el navegador. `depscore` avisa de que sus puntuaciones no enumeran alertas, así que estas stats no dicen que no haya ninguna.
- **Campañas: sin comprobar.** `threat_feed` también va por organización, y no se ha podido llamar por el mismo motivo.

Tras instalar, se compara con **todas** las entradas nuevas del `pnpm-lock.yaml`, no solo con esta lista. Si algo no coincide, se para y esa versión vuelve a Socket.

| Capa | Paquete | license | maintenance | quality | supplyChain | vulnerability |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `fastify@5.12.8` | 100 | 97 | 100 | 98 | 100 |
| 1 | `@fastify/ajv-compiler@4.0.7` | 100 | 92 | 100 | 99 | 100 |
| 1 | `@fastify/error@4.2.1` | 100 | 86 | 100 | 100 | 100 |
| 1 | `@fastify/fast-json-stringify-compiler@5.1.1` | 100 | 85 | 100 | 99 | 100 |
| 1 | `@fastify/proxy-addr@5.1.2` | 100 | 88 | 100 | 100 | 100 |
| 1 | `abstract-logging@2.0.1` | 100 | 75 | 77 | 100 | 100 |
| 1 | `avvio@9.3.1` | 100 | 91 | 100 | 100 | 100 |
| 1 | `fast-json-stringify@7.2.1` | 100 | 96 | 100 | 99 | 100 |
| 1 | `find-my-way@9.10.0` | 100 | 89 | 100 | 99 | 100 |
| 1 | `light-my-request@6.8.0` | 100 | 89 | 100 | 99 | 100 |
| 1 | `pino@10.4.0` | 100 | 90 | 100 | 98 | 100 |
| 1 | `process-warning@5.1.1` | 100 | 89 | 100 | 100 | 100 |
| 1 | `rfdc@1.4.1` | 100 | 81 | 100 | 100 | 100 |
| 1 | `secure-json-parse@4.1.1` | 100 | 89 | 100 | 100 | 100 |
| 1 | `semver@7.8.6` | 100 | 95 | 100 | 100 | 100 |
| 1 | `toad-cache@3.7.4` | 100 | 81 | 100 | 100 | 100 |
| 2 | `@fastify/deepmerge@3.2.4` | 100 | 86 | 100 | 100 | 100 |
| 2 | `@fastify/forwarded@3.1.2` | 100 | 87 | 82 | 100 | 100 |
| 2 | `@fastify/merge-json-schemas@0.2.2` | 100 | 86 | 100 | 100 | 100 |
| 2 | `@pinojs/redact@0.4.0` | 100 | 81 | 100 | 100 | 100 |
| 2 | `ajv-formats@3.0.1` | 100 | 83 | 100 | 99 | 100 |
| 2 | `ajv@8.20.0` | 100 | 84 | 100 | 99 | 100 |
| 2 | `atomic-sleep@1.0.0` | 100 | 75 | 85 | 100 | 100 |
| 2 | `cookie@2.0.1` | 100 | 85 | 100 | 100 | 100 |
| 2 | `fast-deep-equal@3.1.3` | 100 | 75 | 99 | 100 | 100 |
| 2 | `fast-querystring@1.1.2` | 100 | 79 | 100 | 99 | 100 |
| 2 | `fast-uri@4.2.3` | 100 | 98 | 100 | 100 | 100 |
| 2 | `fastq@1.20.3` | 100 | 82 | 100 | 100 | 100 |
| 2 | `ipaddr.js@2.5.0` | 100 | 82 | 100 | 100 | 100 |
| 2 | `json-schema-ref-resolver@3.0.1` | 100 | 88 | 100 | 100 | 100 |
| 2 | `on-exit-leak-free@2.1.2` | 100 | 79 | 85 | 100 | 100 |
| 2 | `pino-abstract-transport@3.0.0` | 100 | 81 | 100 | 100 | 100 |
| 2 | `pino-std-serializers@7.1.0` | 100 | 82 | 100 | 100 | 100 |
| 2 | `quick-format-unescaped@4.0.4` | 100 | 75 | 89 | 100 | 100 |
| 2 | `real-require@1.0.0` | 100 | 83 | 75 | 99 | 100 |
| 2 | `safe-regex2@5.1.2` | 100 | 87 | 90 | 100 | 100 |
| 2 | `safe-stable-stringify@2.5.0` | 100 | 84 | 100 | 100 | 100 |
| 2 | `set-cookie-parser@3.2.2` | 100 | 93 | 100 | 100 | 100 |
| 2 | `sonic-boom@4.2.1` | 100 | 88 | 100 | 100 | 100 |
| 2 | `thread-stream@4.2.1` | 100 | 84 | 100 | 99 | 100 |
| 3 | `dequal@2.0.3` | 100 | 79 | 100 | 100 | 100 |
| 3 | `fast-decode-uri-component@1.0.1` | 100 | 75 | 81 | 100 | 100 |
| 3 | `fast-uri@3.1.9` | 100 | 98 | 100 | 100 | 100 |
| 3 | `json-schema-traverse@1.0.0` | 100 | 75 | 99 | 100 | 100 |
| 3 | `require-from-string@2.0.2` | 100 | 75 | 80 | 100 | 100 |
| 3 | `ret@0.5.1` | 100 | 90 | 99 | 100 | 100 |
| 3 | `reusify@1.1.0` | 100 | 79 | 100 | 100 | 100 |
| 3 | `split2@4.2.0` | 100 | 80 | 95 | 100 | 100 |

## Decisiones de Diego

- **Constitución:** dice «No se añaden paquetes para el servidor ni para la web». Fastify es de un cliente nuevo, no de `src/db/` ni de `src/clients/web/`, así que no choca.
- **Borrar:** pide confirmación, aunque el cliente de referencia no lo haga.
- **API:** comprueba `Host` y `Origin`, aunque el cliente de referencia no lo haga.

- **Socket:** acepta los 48 paquetes con las stats comprobadas y las alertas y campañas sin comprobar. Iniciar sesión aportaría poco: `alerts` lista lo que vigila la organización, así que con una cuenta personal saldría probablemente vacía, y `threat_feed` puede no estar contratado.
- **Comprobación añadida:** después de instalar se lanza `pnpm audit`. Busca vulnerabilidades conocidas en esas versiones. No detecta campañas ni paquetes maliciosos nuevos. Si encuentra algo alto o crítico, se para y se enseña a Diego antes de seguir.
