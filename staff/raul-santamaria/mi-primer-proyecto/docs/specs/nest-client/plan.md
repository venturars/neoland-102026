# Plan — cliente HTTP Nest

Issue: #984.

Añade Nest en `src/clients/nest/` y el script `nest` en `package.json`.
No cambia `src/logic/` ni `src/queries/`.

El servicio importa `createUser`, `listUsers`, `findUserById`,
`updateUser` y `deleteUser`. El controlador delega en el servicio. No
valida: un filtro de excepciones (o equivalente Nest) traduce
`Error.message` al mismo HTTP que `src/clients/http/app.js`. Si el
mensaje no está en la tabla, responde 500 con el `Could not …` de la
acción. `updateUser({ id, name?, email? })`. `deleteUser({ id })`. Id de
ruta como texto. `ORIGIN` `http://127.0.0.1:3003`. La base sigue en
SQLite; no hay servidor SQL en el puerto 3000.

Rutas: `POST /users` (201), `GET /users` (200), `GET /users/:id` (200),
`PATCH /users/:id` (200), `DELETE /users/:id` (204 vacío). Otra ruta →
404 vacío. Éxito en JSON; error en `{ message }`.

Estructura Nest en JavaScript: `main.js` (`NestFactory`), `app.module.js`,
`users.controller.js`, `users.service.js`, filtro de errores de lógica.
Convenciones Nest (clases, decoradores, `this`). Sin TypeScript. Sin
`ValidationPipe` ni `class-validator`: la lógica ya valida.

## Ficheros

Crean: `src/clients/nest/bootstrap.mjs`, `main.js`, `app.module.js`,
`users.controller.js`, `users.service.js`, `logic-exception.filter.js`,
`logic-error.constants.js`. `bootstrap.mjs` transpila con `@swc/core` a
`.run/` (generado) y arranca Nest en JavaScript con decoradores.

Tocan: `package.json`, `pnpm-lock.yaml`, `eslint.config.js`,
`docs/ARCHITECTURE.md`, `docs/TREE.md`, `README.md`. `format` incluye
`src/clients/nest/**/*.js`. En `README.md` (o doc equivalente): aviso
de que este cliente no sigue `docs/STYLE.md` ni `docs/ERRORS.md` en su
código interno.

## Errores

Igual que el plan de `express-rest-client` (misma tabla HTTP ↔ mensaje).

## Paquetes y Socket

Raíz (dependencias): `@nestjs/common@12.3.3`, `@nestjs/core@12.3.3`,
`@nestjs/platform-express@12.3.3`, `reflect-metadata@0.2.2`,
`rxjs@7.8.2`. Desarrollo: `@swc/core@1.16.21` (transpilación del
cliente Nest).

`depscore` (Socket): `@nestjs/common` license 100, maintenance 96,
quality 100, supplyChain 99, vulnerability 100. `@nestjs/core` license
100, maintenance 95, quality 100, supplyChain 99, vulnerability 100.
`@nestjs/platform-express` license 100, maintenance 96, quality 100,
supplyChain 99, vulnerability 100. `reflect-metadata` license 80,
maintenance 80, quality 99, supplyChain 100, vulnerability 100.
`rxjs` license 100, maintenance 88, quality 100, supplyChain 99,
vulnerability 100. Ninguna stat bajo 50.

`alerts` (`org_slug` `ai-engineering`): la API respondió 404
«Organization not found»; no se pudo listar alertas de la organización.

`threat_feed` (`org_slug` `ai-engineering`, `@nestjs/common@12.3.3`):
404 «Organization not found»; no hay campaña en el resumen.

Tras `pnpm install`, el árbol de dependencias (3 capas) se compara con
este plan; cualquier alerta que aparezca en aceptación del plan.

Verificación: prueba manual HTTP en 3003; Express y Electron sin
cambios; `pnpm format` y `pnpm lint`.
