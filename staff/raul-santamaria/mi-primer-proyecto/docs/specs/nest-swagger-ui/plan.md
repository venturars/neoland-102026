# Plan — Swagger UI en Nest

Issue: #1071.

Añade `@nestjs/swagger@12.1.0` en `package.json`. No cambia
`src/logic/` ni `src/queries/`. No se crean ficheros de código.

En `main.js`, tras `NestFactory.create` y antes de `listen`: un
`DocumentBuilder` con título y descripción mínimos;
`SwaggerModule.createDocument(app, config)` lee la metadata del
controlador; `SwaggerModule.setup("docs", app, document)`.

En `users.controller.js`, decoradores de `@nestjs/swagger` sin DTOs ni
ficheros nuevos: `@ApiTags("users")`; por ruta, `@ApiOperation`,
`@ApiParam` (id), `@ApiBody` con `schema` objeto (name, email) en POST y
PATCH; `@ApiResponse` para 200, 201, 204, 400, 404, 409 y 500 con
`{ message: string }` donde aplique, alineado con
`src/clients/http/app.js`. Runtime igual: servicio y filtro de errores
sin cambios.

`bootstrap.mjs` no se toca. `docs/TREE.md`, `docs/STYLE.md`,
`docs/ERRORS.md` y `README.md` no se tocan.

## Ficheros

No se crean ficheros de código.

Tocan: `package.json`, `pnpm-lock.yaml`, `src/clients/nest/main.js`,
`src/clients/nest/users.controller.js`, `docs/ARCHITECTURE.md` (bullet
de `src/clients/nest/`: API en 3003 y Swagger UI en `/docs`).

## Errores

Misma tabla HTTP ↔ mensaje que `express-rest-client/plan.md` y
`nest-client/plan.md`.

## Paquetes y Socket

Raíz: `@nestjs/swagger@12.1.0`.

Capa 2: `js-yaml@5.5.0`, `es-toolkit@1.52.0`, `path-to-regexp@8.4.2`,
`swagger-ui-dist@5.34.0`, `@microsoft/tsdoc@0.17.1`,
`@nestjs/mapped-types@12.0.1`, `@standard-schema/spec@1.1.0`.

Capa 3: `argparse@3.0.3` (de `js-yaml`), `@scarf/scarf@1.4.0` (de
`swagger-ui-dist`). El resto de dependencias de capa 2 no declaran más
paquetes npm.

`depscore` (Socket): ninguna stat por debajo de 50 en el árbol listado.
Mínimos: `swagger-ui-dist` license 80; `@scarf/scarf` supplyChain 82.

`alerts` (`org_slug` `ai-engineering`): la API respondió 404
«Organization not found»; no se pudo listar alertas de la organización.

`threat_feed` (`org_slug` `ai-engineering`, `@nestjs/swagger@12.1.0`):
404 «Organization not found»; no hay campaña en el resumen.

Tras `pnpm install`, el árbol hasta 3 capas se compara con este plan;
cualquier alerta que aparezca en aceptación del plan.

Verificación: base en marcha, `pnpm nest`, abrir `/docs`, flujo Ada y
un error conocido; `GET /no-existe` sigue en 404 vacío; `pnpm format` y
`pnpm lint`.
