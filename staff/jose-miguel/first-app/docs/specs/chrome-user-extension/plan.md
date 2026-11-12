# Plan · Extensión Chrome con API local de usuarios

Issue: #971.

Paquete nuevo: **`fastify@5.12.8`** en `dependencies`, versión exacta. API en [`src/clients/chrome/server.js`](../../../src/clients/chrome/server.js) en `http://127.0.0.1:3002`. Extensión MV3 en el mismo directorio (`manifest.json`, popup HTML/JS/CSS). El cliente HTTP Express en `:3001` no se modifica.

## Rutas (igual criterio que HTTP)

| Método | Ruta | Éxito | Errores |
| --- | --- | --- | --- |
| POST | `/users` | 201 + usuario | 400, 409, 500 + `{ message }` |
| GET | `/users` | 200 + lista | 500 |
| GET | `/users/:id` | 200 + usuario | 404, 500 |
| PATCH | `/users/:id` | 200 + usuario | 400, 404, 409, 500 |
| DELETE | `/users/:id` | 204 sin cuerpo | 404, 500 |
| otro | * | 404 | — |

Textos de `message`: los de `docs/ERRORS.md` / spec.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/chrome-user-extension/spec.md`, `plan.md`, `tasks.md` |
| Crear | `src/clients/chrome/server.js`, `manifest.json`, `index.html`, `popup.js`, `styles.css`, `README.md` |
| Tocar | `package.json`, `pnpm-lock.yaml`, `eslint.config.js`, glob `format` |
| Tocar | `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STARTUP.md`, `AGENTS.md` |

Popup: `fetch` a `:3002`; `host_permissions` en manifest. Script **`pnpm chrome`**.

## Árbol npm (resumen 3 capas)

Raíz: `fastify@5.12.8` → dependencias directas (`@fastify/ajv-compiler`, `@fastify/error`, `avvio`, `find-my-way`, `light-my-request`, `pino`, `semver`, …) y subárbol hasta tercera capa vía `pnpm view` al redactar `tasks.md` e instalar.

Instalación prevista: `pnpm add fastify@5.12.8 --save-exact` solo tras aprobar spec y plan.

## Validación Socket

Organización OAuth: `miguelturra` (plan free). `threat_feed`: n/d. `depscore` win32-x64 (muestra):

| capa | paquete@versión | campaña | alertas | license | maint. | quality | supply | vuln | stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | fastify@5.12.8 | n/d | no en pasada | 100 | 97 | 100 | 98 | 100 | ninguna |
| 0 | semver@7.8.6 | n/d | no | 100 | 95 | 100 | 100 | 100 | ninguna |
| 1 | rfdc@1.4.1 | n/d | no | 100 | 81 | 100 | 100 | 100 | ninguna |
| 1 | @fastify/error@4.2.0 | n/d | no | 100 | 84 | 100 | 100 | 100 | ninguna |

El plan completo en `tasks.md` listará el resto de paquetes del árbol antes de instalar.

## Verificación

Checklist de la issue; comprobar HTTP `:3001` intacto; `pnpm format` y `pnpm lint`.
