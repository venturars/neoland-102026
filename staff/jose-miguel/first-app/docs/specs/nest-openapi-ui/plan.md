# Plan · OpenAPI UI en Nest

Issue: #1121.

Ampliación del cliente [`src/clients/nest/`](../../../src/clients/nest/) ya descrito en `docs/specs/nest-http-client/`. Sin ficheros nuevos en `logic/` ni SQL.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/nest-openapi-ui/spec.md`, `plan.md`, `tasks.md` |
| Tocar | `package.json`, `pnpm-lock.yaml` |
| Tocar | `src/clients/nest/main.js`, `users.controller.js` |
| Tocar | `docs/ARCHITECTURE.md`, `docs/STARTUP.md`, `src/clients/nest/README.md` |

No se toca: `docs/TREE.md` (no entra ni sale fichero), `logic/`, `queries/`, `db/`, otros clientes.

## Paquete nuevo

Directo: `@nestjs/swagger@12.1.0`.

Dependencias nuevas (hasta 3 capas, versiones del lock tras `pnpm install`):

| Capa | paquete@versión |
| --- | --- |
| 1 | `@microsoft/tsdoc@0.17.1`, `@nestjs/mapped-types@12.0.1`, `es-toolkit@1.52.0`, `js-yaml@5.5.0`, `swagger-ui-dist@5.34.0` |
| 2 | `argparse@3.0.4` (js-yaml), `@scarf/scarf@1.4.0` (swagger-ui-dist) |
| 3 | — (argparse y scarf sin deps) |

No se instalan peer opcionales: `typescript`, `class-validator`, `class-transformer`, `@fastify/static`.

## Comportamiento técnico

- `main.js`: tras `NestFactory.create`, `DocumentBuilder` con título `Users Neoland`, versión `0.0.0`; `SwaggerModule.createDocument`; `SwaggerModule.setup("", app, document)` **antes** de `listen`. Se mantiene el `try/catch` de `EADDRINUSE` ya presente en este repo.
- `users.controller.js`: constantes `CREATE_USER_SCHEMA`, `UPDATE_USER_SCHEMA`, `ID_PARAM`; `@ApiBody` en POST y PATCH; `@ApiParam` en GET/PATCH/DELETE por id; mismos ejemplos que en la spec (Ada / ada@example.com). Handlers sin cambio.
- Terminal sigue mostrando `http://127.0.0.1:3003`. Script `pnpm nest` sin cambio.

## Validación Socket

Org `miguelturra` (plan free). `threat_feed` por versión: no consultado en esta sesión (equivalente a n/d en cuenta free).

| capa | paquete@versión | campaña | alertas org | license | maint. | quality | supply | vuln | stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | `@nestjs/swagger@12.1.0` | n/d | no | 100 | 96 | 86 | 98 | 100 | ninguna |
| 1 | `@microsoft/tsdoc@0.17.1` | n/d | no | 100 | 87 | 89 | 100 | 100 | ninguna |
| 1 | `@nestjs/mapped-types@12.0.1` | n/d | no | 100 | 89 | 89 | 99 | 100 | ninguna |
| 1 | `es-toolkit@1.52.0` | n/d | no | 100 | 98 | 93 | 99 | 100 | ninguna |
| 1 | `js-yaml@5.5.0` | n/d | no (filtro js-yaml abierto) | 100 | 92 | 86 | 100 | 100 | ninguna |
| 1 | `swagger-ui-dist@5.34.0` | n/d | no | 80 | 97 | 83 | 99 | 100 | ninguna |
| 2 | `argparse@3.0.4` | n/d | no | 100 | 89 | 97 | 100 | 100 | ninguna |
| 2 | `@scarf/scarf@1.4.0` | n/d | no | 100 | 80 | 100 | 82 | 100 | ninguna |

Ninguna stat por debajo de 50. License más baja: 80 (`swagger-ui-dist`). Maintenance más baja: 80 (`@scarf/scarf`). Supply chain más baja: 82 (`@scarf/scarf`).

## Errores

Igual que `docs/specs/nest-http-client/` y `docs/ERRORS.md` (mensajes vía filtro Nest existente).

## Decisión

Sin preguntas abiertas tras aprobación de spec, plan y paquetes.
