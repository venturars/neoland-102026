# Plan — cliente de Chrome para usuarios

Issue: #911.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva. No hay SQL nuevo. No hay mensaje nuevo.

Hay un paquete nuevo: `fastify@5.12.8`. Entra Socket. El árbol de
abajo es el que resuelve pnpm 10.33.0 para esa versión y sus rangos,
hasta 3 capas. Son 48 paquetes contando las dos versiones de
`fast-uri`. Aún no está instalado en first-app. Si `pnpm` resuelve
otra versión dentro de un rango, esa versión no es la de este resumen
y hay que volver a pasarla por Socket.

La API importa las funciones que ya existen y devuelve su resultado.
Se parece a `src/clients/http/app.js`: la llamada está en el cliente y
la regla sigue en `logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Modificar usa `updateUser(id, changes)`.
Borrar usa `deleteUser(id)`. El `id` es el texto de la ruta. No se
importa `users-gender-count.js`, `find-user-by-name.js` ni
`find-user-by-email.js`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con el comando que ya existe. Esta API escucha en
`http://127.0.0.1:3002`. La constante es `ORIGIN`. `package.json` tiene
el script `chrome`. Se lanza con `pnpm chrome` desde `first-app`. No
sustituye a `src/clients/http/`, que sigue en el puerto 3001.

Fastify lee el cuerpo JSON. El parser de `application/json` viene con
Fastify. Crear y modificar leen `name` y `email`. Si un campo no viene,
no entra en `changes`, y `updateUser` conserva el valor guardado. La
API no valida. Si lo lanzado no es un `Error` con un mensaje de la
lista, responde 500 con el `Could not` de esa acción. No inventa un
mensaje.

Las rutas son las del cliente HTTP:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta responde 404 y un cuerpo vacío. No hay mensaje nuevo.

Si la función lanza un `Error` de la lista, el cuerpo es JSON con la
clave `message` y ese texto.

La extensión no importa `logic/` ni otro cliente. Su página pide a
`ORIGIN` con `fetch`. Chrome lo permite porque el manifest declara ese
host en `host_permissions`. No hace falta otro paquete para CORS. No
hay content script.

El manifest es Manifest V3. La acción abre `index.html`. El permiso de
host es `http://127.0.0.1:3002/*`.

No hay script para abrirla. Chrome `157.0.8103.38` ignora
`--load-extension`, también con
`--disable-features=DisableLoadExtensionCommandLineSwitch`. Un perfil
nuevo no registró la extensión. Cómo cargarla está en `README.md`.

La extensión es una sola pantalla. El texto que ve la persona está en
español. El código está en inglés. Lo que escribe en la página usa
`textContent`, como `src/clients/browser/app.js`.

- Crear pide el nombre y el email y envía los dos, aunque estén vacíos.
- La lista muestra cada usuario con `id`, `name`, `email`, `createdAt`
  y `updatedAt`. Si no hay usuarios, la lista está vacía.
- Ver pide el id y muestra esos cinco datos.
- Modificar pide el id. Envía `name` solo si ese campo tiene texto.
  Envía `email` solo si ese campo tiene texto. Un campo vacío no entra
  en el cuerpo.
- Borrar pide el id. No muestra un usuario. Después se vuelve a pedir
  la lista.

Si la respuesta trae `message`, se ve ese texto. Un 204 no muestra un
usuario.

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
- `docs/TREE.md`

`package.json` añade `fastify@5.12.8` y el script `chrome`. El script
`format` también incluye `src/clients/chrome/**/*.js`. La dependencia
queda en el `package.json` de la app, como `express` para
`src/clients/http/`. Los ficheros de este cliente quedan solo en
`src/clients/chrome/`.

`server.js` declara los globales `console` y `URL`, como
`src/clients/http/app.js`. `popup.js` declara los globales `document` y
`fetch`. `eslint.config.js` ya cubre `**/*.js` y no se toca.

En el árbol, `clients/` incluye `chrome/` con esos cinco ficheros. En
la arquitectura, la API de ese cliente llama a `src/logic/`, escucha
en el puerto 3002 y no repite sus reglas. La extensión solo llama a
esa API. No sustituye a `src/clients/http/` ni a `src/db/server.js`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                  | Mensaje                     | Estado |
| --------------------------------- | --------------------------- | ------ |
| El nombre queda vacío             | `Name is empty`             | 400    |
| El email no vale                  | `Email is invalid`          | 400    |
| El email es de otro usuario       | `Email is already used`     | 409    |
| El usuario no está                | `User not found`            | 404    |
| No se llega a la base al crear    | `Could not create the user` | 500    |
| No se llega al listar             | `Could not list the users`  | 500    |
| No se llega al ver uno           | `Could not find the user`   | 500    |
| No se llega al modificar          | `Could not update the user` | 500    |
| No se llega al borrar             | `Could not delete the user` | 500    |

## Socket

`threat_feed` para `fastify@5.12.8` respondió 403
`threat_feed_not_entitled`. La cuenta no tiene threat feed. No hay
dato de campaña por versión. En cada paquete, la campaña es esa.

`depscore` dio las cinco stats. Ninguna está por debajo de 50. La más
baja es maintenance 75, en `abstract-logging@2.0.1`,
`atomic-sleep@1.0.0`, `fast-decode-uri-component@1.0.1`,
`fast-deep-equal@3.1.3`, `json-schema-traverse@1.0.0`,
`quick-format-unescaped@4.0.4` y `require-from-string@2.0.2`. 75 no
baja. 50 tampoco sale.

La lista de alertas npm abiertas de `ai-engineering` no está vacía.
Se leyeron las primeras 500 y la lista sigue. En esas 500, de este
árbol salen `ajv` y `fast-uri`, en versiones distintas de las que fija
este plan.

`alerts` filtrado por nombre, con la lista completa vacía, no dice que
esa versión no tenga alerta.

Quien acepta el plan decide si esas alertas, en esas otras versiones,
se aceptan.

- `fast-uri@3.1.0` y `fast-uri@3.0.6`: doce alertas abiertas. Altas:
  `CVE-2026-16221` (primer parche `3.1.4`), `CVE-2026-6322` (`3.1.2`),
  `CVE-2026-76172` (`3.1.6`), `CVE-2026-18446` (`3.1.5`),
  `CVE-2026-13676` (`3.1.3`), `CVE-2026-6321` (`3.1.1`),
  `CVE-2026-84292` (`3.1.7`) y `CVE-2026-75975` (`3.1.6`). Media:
  `CVE-2026-86472` (`3.1.8`). Media y bajas con parche `2.4.8`,
  `3.1.9` o `4.2.3`: `CVE-2026-110306`, `CVE-2026-110725` y
  `CVE-2026-110095`. Ninguna nombra `fast-uri@3.1.9` ni
  `fast-uri@4.2.3`. Este plan fija esas dos.
- `ajv@8.17.1` y `ajv@6.12.6`: alerta media `CVE-2025-69873`. El texto
  dice hasta la `8.17.1`. El primer parche que devuelve la alerta es
  `6.14.0`. Este plan fija `ajv@8.20.0`. La alerta no nombra esa
  versión.
- `cookie@0.6.0`: alerta baja `CVE-2024-47764`. El parche es `0.7.0`.
  Este plan fija `cookie@2.0.1`. La alerta no nombra esa versión.

La llamada filtrada respondió 429, cuota insuficiente, en
`@fastify/deepmerge`, `@fastify/fast-json-stringify-compiler`,
`@fastify/forwarded`, `@fastify/merge-json-schemas`,
`@fastify/proxy-addr`, `@pinojs/redact`, `abstract-logging`,
`fast-deep-equal`, `fast-querystring`, `json-schema-ref-resolver`,
`process-warning`, `safe-regex2`, `set-cookie-parser` y `toad-cache`.
Esos nombres no salieron en las primeras 500. La lista sigue, así que
eso no dice que la versión no tenga alerta.

Estos no salieron en las primeras 500 y la llamada filtrada no se
hizo, porque la cuota ya respondía 429: `atomic-sleep`, `dequal`,
`fast-decode-uri-component`, `json-schema-traverse`,
`on-exit-leak-free`, `pino-abstract-transport`, `pino-std-serializers`,
`quick-format-unescaped`, `real-require`, `require-from-string`,
`ret`, `reusify`, `safe-stable-stringify` y `split2`.

- `@fastify/ajv-compiler@4.0.7`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 92, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@fastify/deepmerge@3.2.4`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@fastify/error@4.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@fastify/fast-json-stringify-compiler@5.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 85, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@fastify/forwarded@3.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 87, quality 82, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@fastify/merge-json-schemas@0.2.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@fastify/proxy-addr@5.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@pinojs/redact@0.4.0`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `abstract-logging@2.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 75, quality 77, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ajv@8.20.0`. Campaña: la cuenta no tiene threat feed. Alerta: la abierta nombra `8.17.1` y `6.12.6`, no esta versión. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ajv-formats@3.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `atomic-sleep@1.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 75, quality 85, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `avvio@9.3.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 91, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `cookie@2.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: la abierta nombra `0.6.0`, no esta versión. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `dequal@2.0.3`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 79, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-decode-uri-component@1.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 75, quality 81, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-deep-equal@3.1.3`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-json-stringify@7.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 96, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-querystring@1.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-uri@3.1.9`. Campaña: la cuenta no tiene threat feed. Alerta: las abiertas nombran `3.1.0` y `3.0.6`, no esta versión. license 100, maintenance 98, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-uri@4.2.3`. Campaña: la cuenta no tiene threat feed. Alerta: las abiertas nombran `3.1.0` y `3.0.6`, no esta versión. license 100, maintenance 98, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fastq@1.20.3`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fastify@5.12.8`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 97, quality 100, supplyChain 98, vulnerability 100. Ninguna stat por debajo de 50.
- `find-my-way@9.10.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 89, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ipaddr.js@2.5.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `json-schema-ref-resolver@3.0.1`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `json-schema-traverse@1.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `light-my-request@6.8.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 89, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `on-exit-leak-free@2.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 79, quality 85, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `pino@10.4.0`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 90, quality 100, supplyChain 98, vulnerability 100. Ninguna stat por debajo de 50.
- `pino-abstract-transport@3.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `pino-std-serializers@7.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 82, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `process-warning@5.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 89, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `quick-format-unescaped@4.0.4`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 75, quality 89, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `real-require@1.0.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 83, quality 75, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `require-from-string@2.0.2`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 75, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ret@0.5.1`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 90, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `reusify@1.1.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 79, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `rfdc@1.4.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `safe-regex2@5.1.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 87, quality 90, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `safe-stable-stringify@2.5.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `secure-json-parse@4.1.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 89, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `semver@7.8.6`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 95, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `set-cookie-parser@3.2.2`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `sonic-boom@4.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `split2@4.2.0`. Campaña: la cuenta no tiene threat feed. Alerta: no salió en las primeras 500 y la llamada filtrada no se hizo. license 100, maintenance 80, quality 95, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `thread-stream@4.2.1`. Campaña: la cuenta no tiene threat feed. Alerta: lista filtrada vacía. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `toad-cache@3.7.4`. Campaña: la cuenta no tiene threat feed. Alerta: la llamada fue rechazada, 429, cuota insuficiente. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
