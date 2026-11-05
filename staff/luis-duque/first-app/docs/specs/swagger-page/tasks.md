# Tareas — página Swagger

Plan aceptado. Se añade `@nestjs/swagger` `12.1.0`. Cada paso hace una cosa.

1. Abre `package.json` en `first-app`.
   En `dependencies` entra `@nestjs/swagger` `12.1.0`. El script `nest` se queda igual.
   pnpm escribe `pnpm-lock.yaml`. No se usa npm ni yarn.
   No entran `typescript`, `@fastify/static`, `class-validator` ni `class-transformer`.

2. Abre `src/clients/nest/users.controller.js`.
   Describe `POST /users`, `GET /users`, `GET /users/:id`, `PATCH /users/:id` y `DELETE /users/:id` con los decoradores de `@nestjs/swagger`.
   Crear exige `name` y `email`. Modificar lleva el `id` y `name`, `email` o los dos. Buscar, modificar y eliminar llevan el `id` en la ruta.
   No importa la lógica. No se crea una clase de datos. El fichero se puede leer.

3. Abre `src/clients/nest/main.js`.
   Después de crear la aplicación y antes de escuchar, `DocumentBuilder` y `SwaggerModule` montan la página en `swagger`. El título es `Usuarios`.
   La página queda en `http://127.0.0.1:3003/swagger` y el documento en `http://127.0.0.1:3003/swagger-json`.
   Sigue escuchando en `http://127.0.0.1:3003` y escribiendo esa dirección. El fichero se puede leer.

4. Abre `docs/ARCHITECTURE.md`.
   El cliente NestJS también abre `http://127.0.0.1:3003/swagger`, donde se ven y se pueden lanzar listar, crear, modificar, eliminar y buscar por id.
   Sigue llamando a la lógica, sin buscar por email ni por nombre y sin contar el género. Se arranca con `pnpm nest`.
   Postman puede seguir pidiendo esas mismas peticiones. El fichero se puede leer.

5. Abre `docs/STYLE.md`.
   `main.js` monta la página con `@nestjs/swagger` `12.1.0`. `users.controller.js` describe las cinco peticiones.
   `users.service.js` sigue llamando a `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`.
   NestJS queda en `12.3.3`. El fichero se puede leer.

6. Abre `docs/ERRORS.md`.
   Si el cliente NestJS no está en marcha, `http://127.0.0.1:3003/swagger` no se abre.
   Los mensajes que ya estaban se quedan.
   El fichero se puede leer.

7. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
   Cuentan la página en `127.0.0.1:3003/swagger`. El desarrollo abierto pasa a ser `docs/specs/swagger-page/`.
   `main.js` monta la página con `@nestjs/swagger` `12.1.0`. `users.controller.js` describe las cinco peticiones.
   El servicio, el filtro, el script `nest`, el puerto `3003` y NestJS `12.3.3` se quedan. Los dos se pueden leer.

8. Lee `app.module.js`, `users.service.js`, `http-exception.filter.js`, `src/logic`, `src/queries`, `src/db` y el resto de `src/clients`.
   Siguen igual. `docs/TREE.md` no gana ficheros. `docs/DATABASE.md` no se toca.
   `babel.config.json`, `eslint.config.js` y el `.gitignore` de la raíz no se tocan. No se crea un `README`.
   `package.json` no gana ningún otro paquete.

9. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
   Formatean el JavaScript de `src/clients/nest` y no dejan avisos.
   No se tocan la terminal, Jupyter, las pantallas, el cliente HTTP, la ventana, el popup ni la vista.
   Los dos comandos terminan.

10. Desde `first-app`, lanza `pnpm nest`, con `pnpm server` en marcha.
    La consola muestra `http://127.0.0.1:3003`.
    `http://127.0.0.1:3003/swagger` muestra listar, crear, modificar, eliminar y buscar por id, y deja lanzarlas con la misma respuesta de siempre.
    Buscar por email, por nombre y contar el género no tienen petición.
