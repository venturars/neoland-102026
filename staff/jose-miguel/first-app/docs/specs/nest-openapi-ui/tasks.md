# Tareas · OpenAPI UI en Nest

1. Añade `@nestjs/swagger` en `12.1.0` a `dependencies` de `package.json` y ejecuta `pnpm install` en first-app. No instales peers opcionales de Nest para validación ni TypeScript.

2. Comprueba en `pnpm-lock.yaml` que las versiones del árbol coinciden con `plan.md` hasta 3 capas.

3. En `src/clients/nest/main.js`, importa `DocumentBuilder` y `SwaggerModule`. Antes de `listen`, construye el documento (título `Users Neoland`, versión `0.0.0`) y `SwaggerModule.setup("", app, document)`. Conserva `ORIGIN`, el `try/catch` de `EADDRINUSE` y `console.log(ORIGIN)`.

4. En `src/clients/nest/users.controller.js`, añade `CREATE_USER_SCHEMA`, `UPDATE_USER_SCHEMA`, `ID_PARAM` y los decoradores `@ApiBody` / `@ApiParam` indicados en `plan.md`. No cambies el cuerpo de los métodos.

5. Actualiza el punto de `src/clients/nest/` en `docs/ARCHITECTURE.md`, la fila Nest en `docs/STARTUP.md` y `src/clients/nest/README.md` (Swagger UI en la raíz de `:3003`).

6. Ejecuta `pnpm format` y `pnpm lint` en first-app.

7. Con `pnpm server` y `pnpm nest`, abre `http://127.0.0.1:3003`, prueba crear/listar/ver/modificar/borrar desde Swagger UI y `curl GET /users`.
