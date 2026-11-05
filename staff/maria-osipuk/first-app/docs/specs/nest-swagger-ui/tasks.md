Issue: #1114

# Tareas de la página Swagger UI en el cliente Nest

1. Abre `package.json`.
   Añade `@nestjs/swagger` en `12.1.0` en `dependencies`.
   Ninguna otra versión ni script cambia.

2. Instala con `pnpm install`.
   `pnpm-lock.yaml` fija la versión.
   No se instalan `typescript`, `class-validator`, `class-transformer` ni `@fastify/static`.

3. Abre `pnpm-lock.yaml`.
   Las versiones son las del plan; `path-to-regexp` sigue en `8.4.2` y `@standard-schema/spec` en `1.1.0`.
   Si una no coincide, para y repite la revisión con Socket.

4. Abre `src/clients/nest/main.js`.
   Antes de `listen`, crea el documento con `DocumentBuilder`: título `Users`, versión `0.0.0`.
   Publícalo con `SwaggerModule.setup("", app, document)`. El resto no cambia.

5. Abre `src/clients/nest/users.controller.js`, en crear y modificar.
   Crear lleva `@ApiBody` con `name` y `email` obligatorios y el ejemplo Ada.
   Modificar lleva `@ApiBody` con `name` y `email` opcionales. Rutas y lectura del cuerpo no cambian.

6. En el mismo archivo, en ver, modificar y borrar, añade `@ApiParam`.
   `name` es `id`, obligatorio, cadena, con ejemplo `1`.
   La conversión del id con `Number` no cambia.

7. Abre `tests/nest-client.test.js`.
   Añade: `GET /` responde `200` con `Swagger UI` en el HTML, y `/no-existe` sigue en `404` sin cuerpo.
   Usa datos ficticios y la base temporal que ya usa la prueba.

8. Desde esta carpeta, lanza `pnpm format` y `pnpm lint` sobre los archivos del pedido.
   Después `pnpm test`, con `pnpm start`, `pnpm run http` y `pnpm run nest` parados.
   Todo termina bien.

9. Con `FIRST_APP_DATABASE_FILE` en una base temporal, arranca `pnpm start` y `pnpm run nest`.
   Abre `http://127.0.0.1:3003`: se ve Swagger UI con las cinco operaciones.
   Crea, lista, abre, modifica y borra a Ada: `201`, datos, `204` y después `404`.

10. Comprueba un id `abc` (`400`), un email repetido (`409`) y la página con el servidor de datos parado (`500`).
    Comprueba que un usuario creado en la página sale en `pnpm run web`.
    La base real no se toca.

11. Actualiza `README.md` con cómo abrir la página.
    Actualiza `docs/ARCHITECTURE.md` en `src/clients/nest/` y `docs/TREE.md` con esta spec.
    `docs/ERRORS.md`, `docs/STYLE.md` y `docs/CONSTITUTION.md` no cambian salvo que la revisión final diga otra cosa.

12. Cierra con el informe: archivos cambiados, comprobaciones, guías revisadas y por qué la constitución no cambió.
    Distingue lo local de lo publicado.
