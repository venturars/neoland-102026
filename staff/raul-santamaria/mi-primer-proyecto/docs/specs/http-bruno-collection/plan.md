# Plan — colección Bruno en el cliente HTTP

Issue: #1080.

Añade `@usebruno/cli@4.3.0` en `devDependencies`, un script pnpm que
ejecuta la colección y los ficheros Bruno bajo `src/clients/http/bruno/`.
No es un cliente aparte: `app.js` no
cambia de comportamiento ni de puerto. No cambia `src/logic/` ni
`src/queries/`.

Script propuesto en `package.json`: `http-bruno` →
`bru run src/clients/http/bruno` (binario de `@usebruno/cli`). Quien
prueba arranca `pnpm server` y `pnpm http`, luego `pnpm http-bruno` desde
`mi-primer-proyecto`.

Variable de colección `baseUrl` con valor `http://127.0.0.1:3001`. Todas
las peticiones usan `{{baseUrl}}`. Cuerpos JSON con `Content-Type:
application/json` donde aplique.

Orden de carpetas y peticiones (nombres en inglés, kebab-case en
ficheros):

- `bruno/bruno.json` — metadatos (`name`: `mi-primer-proyecto-http`,
  `type`: `collection`).
- `bruno/collection.bru` — vars: `baseUrl`.
- `bruno/01-happy-path/` — flujo Ada alineado con
  `express-rest-client/tasks.md` (tareas 9–10 y borrado final):
  - ruta desconocida → 404 vacío;
  - crear Ada → 201;
  - listar → 200 con Ada;
  - ver por id → 200;
  - patch solo nombre Ada Lovelace → 200;
  - borrar Ada → 204;
  - listar → Ada ausente.
- `bruno/02-validation/` — errores de tarea 11:
  - crear nombre vacío → 400 `Name is empty`;
  - crear email inválido → 400 `Email is invalid`;
  - crear Ada de nuevo (email duplicado) → 409 `Email is already used`;
  - `GET`, `PATCH` y `DELETE` con id inexistente → 404
    `No user exists with that id`.

Los `.bru` no pasan por `pnpm format` ni `pnpm lint` (el glob de
`format` sigue en `src/clients/http/**/*.js`).

Tras `pnpm install`, quien prueba usa `pnpm server`, `pnpm http` y
`pnpm http-bruno`. Las peticiones modifican la SQLite real. La app de
escritorio o la extensión de VS Code de Bruno son opcionales para editar
`.bru`; la ejecución oficial del proyecto es el script pnpm.

## Ficheros

Crean:

- `src/clients/http/bruno/bruno.json`
- `src/clients/http/bruno/collection.bru`
- `src/clients/http/bruno/01-happy-path/folder.bru` y un `.bru` por
  petición del flujo.
- `src/clients/http/bruno/02-validation/folder.bru` y un `.bru` por caso
  de error listado arriba.

Tocan:

- `package.json` — `devDependencies` con `@usebruno/cli@4.3.0` y script
  `http-bruno`.
- `pnpm-lock.yaml`.
- `docs/TREE.md` — `clients/http/app.js` y `bruno/` (sin tratar Bruno
  como cliente nuevo).
- `docs/ARCHITECTURE.md` — ampliar el bullet de `src/clients/http/`:
  Express en 3001 y colección Bruno en `bruno/` ejecutable con
  `pnpm http-bruno`.

No tocan: `src/clients/http/app.js`, `docs/ERRORS.md`, `docs/STYLE.md`,
`docs/CONSTITUTIONS.md`, `README.md`, otros clientes.

## Errores

Misma tabla HTTP ↔ mensaje que `express-rest-client/plan.md`. La
colección no comprueba los 500 por SQLite caída (tarea 12 del cliente
REST); queda fuera de esta entrega.

| Fallo | Mensaje | HTTP |
| --- | --- | --- |
| Nombre vacío | `Name is empty` | 400 |
| Email inválido | `Email is invalid` | 400 |
| Id inválido | `User id is not valid` | 400 |
| Email en uso | `Email is already used` | 409 |
| Usuario ausente | `No user exists with that id` | 404 |
| Ruta desconocida | (cuerpo vacío) | 404 |

## Paquetes y Socket

Raíz (dev): `@usebruno/cli@4.3.0`.

`depscore`: license 100, maintenance 96, quality 100, supplyChain 88,
vulnerability 100; ninguna stat por debajo de 50 en el paquete raíz.

Capa 2 (muestra del árbol de `@usebruno/cli`; el lockfile fija el resto
hasta 3 capas): `@usebruno/js@0.55.0`, `@usebruno/requests@0.22.0`,
`axios@1.18.0`, `lodash@4.18.1`, `js-yaml@4.3.1`,
`@aws-sdk/credential-providers@3.1019.0`.

`depscore` capa 2 — stats por debajo de 50: `axios@1.18.0` vulnerability
**30** (maintenance 94, quality 100, supplyChain 97, license 100). El
resto de la muestra queda en 50 o más (`@usebruno/js` quality 76;
`@usebruno/requests` quality 75).

`alerts` (`org_slug` `ai-engineering`): la API respondió 404
«Organization not found»; no se pudo listar alertas de la organización.

`threat_feed` (`org_slug` `ai-engineering`, `@usebruno/cli@4.3.0`):
404 «Organization not found»; no hay campaña en el resumen.

Tras `pnpm install`, el árbol hasta 3 capas se compara con este plan;
cualquier alerta que aparezca en aceptación del plan. Comentar en
aceptación la stat de vulnerabilidad de `axios` en la cadena de Bruno.

Verificación: `pnpm install`, `pnpm server`, `pnpm http`, `pnpm
http-bruno` termina con las peticiones en verde; flujo Ada y validaciones
como arriba; `docs/TREE.md` y `docs/ARCHITECTURE.md` alineados con este
plan.
