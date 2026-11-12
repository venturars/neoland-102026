# Plan · Colección Bruno del cliente HTTP

Issue: #1129.

No hay función nueva en `logic/`. No hay SQL nuevo. El cliente Express sigue en [`src/clients/http/app.js`](../../../src/clients/http/app.js) (`http://127.0.0.1:3001`). Bruno solo envía HTTP.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/bruno-http-collection/spec.md`, `plan.md`, `tasks.md` (tasks después del OK) |
| Crear | `src/clients/http/bruno/` (colección `.bru`) |
| Crear | `scripts/run-bruno.js` (Windows: `bru run 01-sql-online -r` desde esa carpeta) |
| Tocar | `package.json` (`@usebruno/cli@4.3.0` en devDependencies, script `bruno`) |
| Tocar | `pnpm-lock.yaml` |
| Tocar | `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STARTUP.md`, `AGENTS.md`, `src/clients/http/README.md` |

No se toca: `app.js`, `logic/`, `queries/`, `db/`, Nest, Chrome, script `test`.

## Colección

`baseUrl` `http://127.0.0.1:3001`. `missingId` `999999`. Crear Ada guarda `userId`.

`01-sql-online` (lista vacía): empty-list, create-ada, list-users, find-ada, patch-name, create-empty-name, create-invalid-email, create-used-email, get/patch/delete-missing, delete-ada, list-after-delete. Mismos `seq`, nombres y `tests { }` que la colección de referencia del curso.

`02-sql-offline` (SQL parado, HTTP abierto): create/list/find/update/delete con 500 y `{ message: "Could not …" }`.

`pnpm bruno` solo corre `01-sql-online`. Offline se lanza a mano contra `02-sql-offline`.

## Validación Socket

Org `miguelturra` (plan free). `threat_feed` n/d. Directo: `@usebruno/cli@4.3.0` (devDependencies). Árbol npm hasta 3 capas (capa 1, versiones fijadas por el manifiesto del CLI). `cli-table3@0.6.5`, `debug@4.4.3` y `qs@6.17.1` ya están en el ecosistema del proyecto; se anotan por si el lock las reutiliza.

| capa | paquete@versión | campaña | alertas org | license | maint. | quality | supply | vuln | stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | `@usebruno/cli@4.3.0` | n/d | no | 100 | 96 | 100 | 88 | 100 | ninguna |
| 1 | `axios@1.18.0` | n/d | no (filtro axios abierto vacío) | 100 | 94 | 100 | 97 | **30** | **vulnerability** |
| 1 | `lodash@4.18.1` | n/d | no | 100 | 82 | 86 | 100 | 100 | ninguna |
| 1 | `js-yaml@4.3.1` | n/d | no | 100 | 92 | 100 | 100 | 84 | ninguna |
| 1 | `form-data@4.0.4` | n/d | no | 100 | 87 | 100 | 99 | 84 | ninguna |
| 1 | `@usebruno/js@0.55.0` | n/d | no | 100 | 95 | 76 | 85 | 100 | ninguna |
| 1 | `@usebruno/lang@0.41.0` | n/d | no | 100 | 94 | 76 | 93 | 100 | ninguna |
| 1 | `@usebruno/common@0.27.0` | n/d | no | 100 | 94 | 76 | 86 | 100 | ninguna |
| 1 | `@usebruno/requests@0.22.0` | n/d | no | 100 | 94 | 75 | 87 | 100 | ninguna |
| 1 | `@usebruno/filestore@0.14.0` | n/d | no | 100 | 93 | 86 | 93 | 100 | ninguna |
| 1 | `@usebruno/converters@0.25.0` | n/d | no | 100 | 94 | 98 | 93 | 100 | ninguna |
| 1 | `chai@4.5.0` | n/d | no | 100 | 84 | 100 | 99 | 100 | ninguna |
| 1 | `debug@4.4.3` | n/d | no | 100 | 81 | 100 | 99 | 100 | ninguna |
| 1 | `cli-table3@0.6.5` | n/d | no | 100 | 81 | 100 | 100 | 100 | ninguna |
| 1 | `qs@6.17.1` | n/d | no | 100 | 96 | 100 | 99 | 100 | ninguna |

**Alerta para decidir:** `axios@1.18.0` trae **vulnerability 30** (por debajo de 50). El CLI de Bruno fija esa versión. `alerts` de org para axios abiertas: lista vacía (eso no prueba que 1.18.0 no tenga CVE). Hay que **aceptar o rechazar** ese paquete antes de `tasks.md` y de `pnpm add`.

El resto de stats revisadas no baja de 50. Quality más baja: 75 (`@usebruno/requests`).

Capa 1 también declara rangos (`chalk`, `yargs`, `fs-extra`, agentes proxy, `@aws-sdk/credential-providers@3.1019.0`, etc.). Si `pnpm install` resuelve otra versión que la de este resumen, esa versión vuelve a Socket.

## Errores

Los mismos del cliente HTTP: 400 / 409 / 404 / 500 con `message` JSON.

## Decisión

Queda abierta la aceptación de `axios@1.18.0` (vuln 30). No hay `tasks.md` hasta el OK de spec, plan y esa alerta.
