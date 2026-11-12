# Tareas — Swagger UI en el cliente Nest

1. Abre `package.json`.
   Añade en `dependencies` `@nestjs/swagger@12.1.0`.
   El script `nest` no cambia.

2. Instala en `first-app` con `pnpm install`.
   `pnpm-lock.yaml` cambia.
   `@nestjs/swagger` queda en `12.1.0`.

3. Abre `pnpm-lock.yaml`.
   Las versiones de `@nestjs/swagger` y de sus dependencias directas son
   las del plan.
   Si una no coincide, se para y esa versión vuelve a Socket.

4. Abre `src/clients/nest/main.js`.
   Importa `DocumentBuilder` y `SwaggerModule` de `@nestjs/swagger`.
   Tras crear la app, configura el documento y monta Swagger UI en la
   ruta `api`.
   `ORIGIN` y el `console.log` al arrancar siguen igual.

5. Abre `src/clients/nest/users.controller.js`.
   Importa `ApiExcludeEndpoint` de `@nestjs/swagger`.
   Pon `@ApiExcludeEndpoint()` en el método `@All("*path")`.
   Si hace falta, añade `@ApiTags("users")` y `@ApiBody` en crear y
   cambiar para que Swagger muestre `name` y `email`.

6. Abre `docs/ARCHITECTURE.md`, junto al cliente Nest.
   Dice que también hay Swagger UI en `/api` del puerto 3003.

7. Abre `docs/style.md`, en Comandos.
   Con `pnpm nest`, la Swagger UI está en `http://127.0.0.1:3003/api`.

8. Abre `docs/CONSTITUTIONS.md`, secciones 1 y 7.
   En la 1, se puede probar el cliente Nest con Swagger UI en la ruta
   `api` del mismo host.
   En la 7, este cambio no añade un `.txt`.

9. Arranca `pnpm server` y `pnpm nest` desde `first-app`.
   Abre `http://127.0.0.1:3003/api` en el navegador.
   Comprueba las cinco operaciones y un fallo conocido, como en la issue.

10. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    Ambos terminan sin error.

11. Haz commit de los ficheros de esta spec y de los cambios de código
    en la rama `1074-feat-swagger-ui-nest-client`.
    Sube con push.
