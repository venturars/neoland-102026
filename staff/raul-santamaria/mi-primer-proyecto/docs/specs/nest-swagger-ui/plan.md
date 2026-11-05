# Plan — Swagger UI en Nest

Issue: #1071.

Añade `@nestjs/swagger@12.1.0` y documentación OpenAPI estática en
`src/clients/nest/`. No cambia `src/logic/` ni `src/queries/`.

En `main.js`, tras `NestFactory.create`, se llama a
`SwaggerModule.setup("docs", app, openApiDocument)` con un documento
importado desde `openapi.document.js`. No usa `createDocument` ni DTOs:
el OpenAPI describe las cinco rutas de usuarios, los esquemas `User` y
`ErrorMessage`, y las respuestas 400, 404, 409 y 500 alineadas con
`src/clients/http/app.js` y la spec del cliente Nest.

`bootstrap.mjs` incluye `openapi.document.js` en la lista que copia o
transpila a `.run/` (copia directa, sin decoradores).

## Ficheros

Crean: `src/clients/nest/openapi.document.js`.

Tocan: `src/clients/nest/main.js`, `src/clients/nest/bootstrap.mjs`,
`package.json`, `pnpm-lock.yaml`, `docs/TREE.md`, `docs/ARCHITECTURE.md`,
`README.md`.

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
