# Plan — cliente HTTP con Express para usuarios

Issue: #887.

No es una funcionalidad nueva de negocio. No hay fichero nuevo en `src/logic/`,
ni firma nueva ni SQL nuevo. Es un cliente más: llama a las funciones que ya
existen, como la terminal, Jupyter y el cliente web. No hay capa entre
`src/logic/` y `src/queries/`.

El código actual, la constitución y la spec coinciden. Las preguntas de la
primera revisión están resueltas (ver «Decisiones»). `tasks.md` es el
siguiente paso, tras la revisión de esta versión.

## Ficheros

Se crea:

- `src/clients/http/server.js`: un solo fichero con las 5 rutas.

Se tocan en la implementación (`tasks.md`):

- `eslint.config.js` (bloque que declara `console` como global en `src/clients/http/`).
- `package.json` (dependencia `express` y script `http`).
- `pnpm-lock.yaml` (lo cambia `pnpm`).
- `docs/ERRORS.md` (añadir `Body is invalid` e `Internal error`, ver
  «Errores»).
- `docs/TREE.md` y `docs/ARCHITECTURE.md` (añadir `src/clients/http/server.js`,
  el script `http` y que necesita `pnpm server` en marcha).

No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes. No
se crea cliente `.txt` en `src/clients/terminal/`. La carpeta `src/clients/http/` no existe hoy: no hay conflicto
con el servicio retirado en #843.

## Llamadas

No hay función nueva. Firmas reales de `src/logic/`:

| Ruta                | Llamada                           | Éxito |
| ------------------- | --------------------------------- | ----- |
| `GET /users`        | `listUsers()`                     | 200   |
| `GET /users/:id`    | `findUserById(id)`                | 200   |
| `POST /users`       | `createUser({ name, email })`     | 201   |
| `PATCH /users/:id`  | `updateUser({ id, name, email })` | 200   |
| `DELETE /users/:id` | `deleteUser(id)`                  | 200   |

`server.js` lee el cuerpo con el parser JSON de Express y escucha en `127.0.0.1:3001`. Al arrancar escribe `HTTP server listening on http://127.0.0.1:3001` con `console.log`. El host, el origen y el puerto son las constantes `HOST`, `ORIGIN` y `PORT`.
Cada ruta es `async` y deja salir el error. Express 5 lleva a su middleware de
errores las promesas rechazadas, así que las rutas no capturan.

## Id de la URL

`:id` llega como texto. Se convierte a número antes de llamar a logic.
`Number("abc")` da `NaN` y `typeof NaN === "number"`, así que logic lo dejaría
pasar hasta la base. Por eso el servidor comprueba el texto entero antes, con la
misma regla del cliente web (`parseUserId` de `src/clients/web/app.js`: solo
dígitos, sin ceros a la izquierda, entero seguro) y lanza
`ValidationError("Id is invalid")`. `1abc`, `1.5` y `0` no eligen a nadie.

## Errores

Un middleware de errores de Express asigna el estado por la clase del error y
responde `{ error: message }`:

| Clase             | Estado |
| ----------------- | ------ |
| `ValidationError` | 400    |
| `NotFoundError`   | 404    |
| `ConflictError`   | 409    |
| `DatabaseError`   | 500    |

Los mensajes de logic son los de `docs/ERRORS.md`, sin cambios. Se añaden dos
mensajes nuevos a `docs/ERRORS.md`, que la implementación deja escritos allí
(con una nota de que los lanza el cliente HTTP y no `src/logic/`):

- `"Body is invalid"`, `ValidationError`, 400. Sale en tres casos: el JSON está
  mal formado (el parser de Express lanza un error con `type`
  `entity.parse.failed`, que el middleware convierte), el `POST`/`PATCH` no trae
  cuerpo (`req.body` es `undefined`) o el cuerpo no es un objeto. La ruta lo
  comprueba con un `if` antes de llamar a logic y lanza `ValidationError`
  importado de `src/logic/errors.js`, como el cliente web con `Id is invalid`.
- `"Internal error"`, 500. Es el error que no es de ninguna de las cuatro
  clases. El middleware responde `{ error: "Internal error" }` y no filtra el
  mensaje original.

## Arranque

`package.json` añade el script `"http": "node src/clients/http/server.js"`. El
script `format` ya cubre `src/clients/**/*.js`. Necesita `pnpm server` (puerto 3000) en marcha, porque `src/queries/user.js` pide a ese servidor.

```mermaid
flowchart LR
  curl[Cliente HTTP] --> express[server.js puerto 3001]
  express --> logic[src/logic]
  logic --> queries[src/queries/user.js]
  queries --> db[pnpm server puerto 3000]
```

## Paquete

`express@5.3.0`, versión exacta (última publicada, comprobada con
`pnpm view express version`). Se instalará con `pnpm add express@5.3.0 --save-exact`
en la implementación, no antes.

## Validación Socket

Consulta completa: el MCP respondió sin pedir autenticación. `org_slug`:
`sergio-cortes` (plan free). Árbol de `express@5.3.0` hasta 3 capas, con
versiones resueltas desde el manifest publicado (`npm view`): 53 paquetes. Un
paquete que ya salió en una capa anterior no se repite.

- **Campañas:** `threat_feed` respondió 403 `threat_feed_not_entitled`: no está
  habilitado en el plan free. Columna `n/d (plan free)`.
- **Alertas:** `alerts` (org, `npm`, `open`) devolvió alertas abiertas de otros
  repositorios de la org. Ninguna es de las versiones de este árbol. Se
  comentan porque coinciden en nombre de paquete, pero en otra versión:
  - `proxy-addr@2.0.7` (critical CVE). Aquí va `2.0.8`.
  - `path-to-regexp@0.1.12` y `8.3.0` (high y medium CVE). Aquí va `8.4.2`.
  - `body-parser@1.20.4` y `2.2.2` (high y low CVE). Aquí va `2.4.0`.
  - `qs@6.14.2` y `6.15.0` (medium CVE). Aquí va `6.17.1`.
- **Puntuaciones bajo 50:** ninguna. Lo más bajo es `supplyChain 66`
  (`side-channel@1.1.1` y `es-define-property@1.0.1`) y `maintenance 53` en los
  mismos dos paquetes.
- **Incidencias:** ninguna alerta abierta para estas versiones, ninguna
  puntuación por debajo de 50. No hay alertas que aceptar. La persona sigue
  decidiendo si lo acepta.

| Capa | Paquete@versión              | Campaña         | Alertas | license | maintenance | quality | supplyChain | vulnerability | Stats < 50 |
| ---- | ---------------------------- | --------------- | ------- | ------- | ----------- | ------- | ----------- | ------------- | ---------- |
| 0    | `express@5.3.0`              | n/d (plan free) | no      | 100     | 92          | 100     | 97          | 100           | ninguna    |
| 1    | `qs@6.17.1`                  | n/d (plan free) | no      | 100     | 97          | 100     | 99          | 100           | ninguna    |
| 2    | `side-channel@1.1.1`         | n/d (plan free) | no      | 100     | 53          | 87      | 66          | 100           | ninguna    |
| 3    | `es-errors@1.3.0`            | n/d (plan free) | no      | 100     | 79          | 84      | 100         | 100           | ninguna    |
| 3    | `object-inspect@1.13.4`      | n/d (plan free) | no      | 100     | 80          | 96      | 99          | 100           | ninguna    |
| 3    | `side-channel-list@1.0.1`    | n/d (plan free) | no      | 100     | 80          | 88      | 99          | 100           | ninguna    |
| 3    | `side-channel-map@1.0.1`     | n/d (plan free) | no      | 100     | 79          | 87      | 99          | 100           | ninguna    |
| 3    | `side-channel-weakmap@1.0.2` | n/d (plan free) | no      | 100     | 79          | 87      | 99          | 100           | ninguna    |
| 2    | `es-define-property@1.0.1`   | n/d (plan free) | no      | 100     | 53          | 81      | 66          | 100           | ninguna    |
| 1    | `depd@2.0.0`                 | n/d (plan free) | no      | 100     | 75          | 100     | 99          | 100           | ninguna    |
| 1    | `etag@1.8.1`                 | n/d (plan free) | no      | 100     | 75          | 99      | 100         | 100           | ninguna    |
| 1    | `once@1.4.0`                 | n/d (plan free) | no      | 100     | 75          | 91      | 100         | 100           | ninguna    |
| 2    | `wrappy@1.0.2`               | n/d (plan free) | no      | 100     | 75          | 73      | 100         | 100           | ninguna    |
| 1    | `send@1.2.1`                 | n/d (plan free) | no      | 100     | 85          | 100     | 99          | 100           | ninguna    |
| 2    | `debug@4.4.3`                | n/d (plan free) | no      | 100     | 81          | 100     | 99          | 100           | ninguna    |
| 3    | `ms@2.1.3`                   | n/d (plan free) | no      | 100     | 84          | 86      | 100         | 100           | ninguna    |
| 2    | `encodeurl@2.0.1`            | n/d (plan free) | no      | 100     | 90          | 99      | 100         | 100           | ninguna    |
| 2    | `escape-html@1.0.3`          | n/d (plan free) | no      | 100     | 75          | 78      | 100         | 100           | ninguna    |
| 2    | `fresh@2.0.0`                | n/d (plan free) | no      | 100     | 83          | 99      | 100         | 100           | ninguna    |
| 2    | `http-errors@2.0.1`          | n/d (plan free) | no      | 100     | 84          | 100     | 99          | 100           | ninguna    |
| 3    | `inherits@2.0.4`             | n/d (plan free) | no      | 100     | 75          | 76      | 100         | 100           | ninguna    |
| 3    | `setprototypeof@1.2.0`       | n/d (plan free) | no      | 100     | 75          | 73      | 100         | 100           | ninguna    |
| 3    | `statuses@2.0.2`             | n/d (plan free) | no      | 100     | 83          | 99      | 100         | 100           | ninguna    |
| 3    | `toidentifier@1.0.1`         | n/d (plan free) | no      | 100     | 83          | 82      | 100         | 100           | ninguna    |
| 2    | `mime-types@3.0.2`           | n/d (plan free) | no      | 100     | 85          | 100     | 100         | 100           | ninguna    |
| 3    | `mime-db@1.54.0`             | n/d (plan free) | no      | 100     | 84          | 100     | 100         | 100           | ninguna    |
| 2    | `on-finished@2.4.2`          | n/d (plan free) | no      | 100     | 86          | 100     | 100         | 100           | ninguna    |
| 3    | `ee-first@1.1.1`             | n/d (plan free) | no      | 100     | 75          | 92      | 100         | 100           | ninguna    |
| 2    | `range-parser@1.3.0`         | n/d (plan free) | no      | 100     | 85          | 95      | 100         | 100           | ninguna    |
| 1    | `vary@1.1.2`                 | n/d (plan free) | no      | 100     | 75          | 99      | 100         | 100           | ninguna    |
| 1    | `cookie@0.7.2`               | n/d (plan free) | no      | 100     | 85          | 99      | 100         | 100           | ninguna    |
| 1    | `router@2.2.0`               | n/d (plan free) | no      | 100     | 83          | 100     | 99          | 100           | ninguna    |
| 2    | `is-promise@4.0.0`           | n/d (plan free) | no      | 100     | 75          | 66      | 100         | 100           | ninguna    |
| 2    | `parseurl@1.3.3`             | n/d (plan free) | no      | 100     | 75          | 99      | 100         | 100           | ninguna    |
| 2    | `path-to-regexp@8.4.2`       | n/d (plan free) | no      | 100     | 91          | 100     | 100         | 100           | ninguna    |
| 1    | `accepts@2.0.0`              | n/d (plan free) | no      | 100     | 84          | 100     | 99          | 100           | ninguna    |
| 2    | `negotiator@1.1.0`           | n/d (plan free) | no      | 100     | 85          | 100     | 100         | 100           | ninguna    |
| 3    | `content-type@2.1.0`         | n/d (plan free) | no      | 100     | 88          | 90      | 100         | 100           | ninguna    |
| 1    | `type-is@2.1.0`              | n/d (plan free) | no      | 100     | 87          | 100     | 99          | 100           | ninguna    |
| 2    | `media-typer@1.1.1`          | n/d (plan free) | no      | 100     | 84          | 98      | 100         | 100           | ninguna    |
| 1    | `proxy-addr@2.0.8`           | n/d (plan free) | no      | 100     | 84          | 100     | 99          | 100           | ninguna    |
| 2    | `forwarded@0.2.0`            | n/d (plan free) | no      | 100     | 75          | 83      | 100         | 100           | ninguna    |
| 2    | `ipaddr.js@1.9.1`            | n/d (plan free) | no      | 100     | 82          | 100     | 100         | 100           | ninguna    |
| 1    | `body-parser@2.4.0`          | n/d (plan free) | no      | 100     | 93          | 100     | 99          | 100           | ninguna    |
| 2    | `bytes@3.1.2`                | n/d (plan free) | no      | 100     | 81          | 99      | 100         | 100           | ninguna    |
| 2    | `raw-body@3.0.2`             | n/d (plan free) | no      | 100     | 86          | 100     | 99          | 100           | ninguna    |
| 3    | `unpipe@1.0.0`               | n/d (plan free) | no      | 100     | 75          | 78      | 100         | 100           | ninguna    |
| 3    | `iconv-lite@0.7.3`           | n/d (plan free) | no      | 100     | 93          | 100     | 100         | 100           | ninguna    |
| 1    | `finalhandler@2.1.1`         | n/d (plan free) | no      | 100     | 84          | 100     | 99          | 100           | ninguna    |
| 1    | `serve-static@2.2.1`         | n/d (plan free) | no      | 100     | 84          | 99      | 99          | 100           | ninguna    |
| 1    | `cookie-signature@1.2.2`     | n/d (plan free) | no      | 100     | 82          | 69      | 100         | 100           | ninguna    |
| 1    | `merge-descriptors@2.0.0`    | n/d (plan free) | no      | 100     | 79          | 80      | 100         | 100           | ninguna    |
| 1    | `content-disposition@2.0.1`  | n/d (plan free) | no      | 100     | 86          | 100     | 100         | 100           | ninguna    |

## Decisiones

1. Sin cliente `.txt` de terminal. La comprobación son las 5 rutas con `curl`.
   Esto es una excepción a `AGENTS.md` («Al terminar una tarea») que la persona
   aprobó.
2. Cuerpo mal formado o ausente: mensaje nuevo `Body is invalid` en
   `docs/ERRORS.md`, 400.
3. Error desconocido: mensaje nuevo `Internal error` en `docs/ERRORS.md`, 500.
4. Cierre: `pnpm run format`, `pnpm run lint` y llamar a las 5 rutas con `curl`
   con `pnpm server` y `pnpm http` en marcha.
