# Tareas — cliente NestJS

Plan aceptado. Se añade NestJS `12.3.3`. Cada paso hace una cosa.

1. Abre `package.json` en `first-app`.
   El script `nest` queda `node scripts/run-nest.js`. `format` también escribe `src/clients/nest/**/*.js`.
   En `dependencies` entran `@nestjs/common`, `@nestjs/core` y `@nestjs/platform-express` `12.3.3`, `reflect-metadata` `0.2.2` y `rxjs` `7.8.2`. En `devDependencies` entran `@babel/cli` y `@babel/core` `8.1.0`, `@babel/plugin-proposal-decorators` `8.0.2` y `@babel/preset-env` `8.0.7`.
   `pnpm-lock.yaml` lo escribe pnpm. `express` se queda en `5.3.0`.

2. Crea `babel.config.json` en `first-app`.
   El preset es `@babel/preset-env` con `modules: false` y el objetivo `node: current`.
   El plugin es `@babel/plugin-proposal-decorators` con `version: legacy`.
   El fichero se puede leer.

3. Crea `scripts/run-nest.js`.
   Borra `dist`, compila `src` a `dist` con Babel y arranca `dist/clients/nest/main.js`.
   Compila todo `src` porque el cliente importa `../../logic`.
   El fichero se puede leer.

4. Crea `src/clients/nest/users.service.js` y `src/clients/nest/users.controller.js`.
   El servicio importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`.
   El controlador recibe `POST /users`, `GET /users`, `PATCH /users/:id` y `DELETE /users/:id`. No importa la lógica.
   Crear responde 201. Listar y modificar responden 200. Eliminar responde 204 sin cuerpo. Los dos se pueden leer.

5. Crea `src/clients/nest/main.js`, `src/clients/nest/app.module.js` y `src/clients/nest/http-exception.filter.js`.
   `main.js` importa primero `reflect-metadata`, crea NestJS con `AppModule` y escucha en `http://127.0.0.1:3003`. Al escuchar, escribe esa dirección.
   El filtro traduce el `Error` a `{ "message": texto }` sin cambiar el texto: validación 400, `was not found` 404, `UNIQUE constraint` 409 y otro `Error` 500. Ruta desconocida: 404 sin cuerpo. Cuerpo que no es JSON: 400.
   No valida, no escribe SQL y no abre la base. Los tres se pueden leer.

6. Abre `eslint.config.js`.
   Ignora `dist/**` y `src/clients/nest/**`.
   Prettier sí formatea ese JavaScript. `pnpm lint` no analiza esa carpeta.
   El fichero se puede leer.

7. Abre el `.gitignore` de la raíz del repositorio.
   Entra `staff/luis-duque/first-app/dist/`.
   `dist` es salida de Babel y no se sube.
   El fichero se puede leer.

8. Abre `docs/ARCHITECTURE.md`.
   El cliente NestJS lista, crea, modifica y elimina desde Postman, sin pantallas, en `127.0.0.1:3003`.
   Usa NestJS `12.3.3`, llama a la lógica, no busca y no cuenta el género. Se arranca con `pnpm nest`.
   La terminal, Jupyter, las pantallas, la ventana, el popup, la vista y el cliente HTTP siguen igual. El fichero se puede leer.

9. Abre `docs/TREE.md`.
   Añade `clients/nest/` con `main.js`, `app.module.js`, `users.controller.js`, `users.service.js` y `http-exception.filter.js`.
   Añade `scripts/run-nest.js` y `babel.config.json`.
   El fichero se puede leer.

10. Abre `docs/STYLE.md`.
    El cliente vive en `src/clients/nest`. `users.service.js` llama a `listUsers`, `createUser`, `updateUser` y `deleteUser`.
    No llama a las búsquedas ni a `usersGender`. No valida, no escribe SQL y no abre la base.
    Se arranca con `pnpm nest`. NestJS queda en `12.3.3`. El fichero se puede leer.

11. Abre `docs/ERRORS.md`.
    Si este cliente no está en marcha, Postman no completa la petición.
    Los mensajes que ya estaban se quedan.
    El fichero se puede leer.

12. Abre `docs/CONSTITUTIONS.MD` y `AGENTS.MD`.
    Cuentan el cliente NestJS, `pnpm nest`, `127.0.0.1:3003` y `src/clients/nest`. El desarrollo abierto pasa a ser `docs/specs/nestjs-client/`.
    `users.service.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. Babel compila `src` a `dist` antes de arrancar. `dist` no se sube.
    NestJS queda en `12.3.3`. Los dos se pueden leer.

13. Lee `src/logic`, `src/queries`, `src/db` y el resto de `src/clients`.
    Siguen igual. `docs/DATABASE.md` no se toca.
    `express` se queda en `5.3.0`.
    `package.json` no gana ningún otro paquete.

14. Desde `first-app`, lanza `pnpm format` y `pnpm lint`.
    Formatean el JavaScript de `src/clients/nest` y no dejan avisos.
    No se tocan la terminal, Jupyter, las pantallas, el cliente HTTP, la ventana, el popup ni la vista.
    Los dos comandos terminan.

15. Desde `first-app`, lanza `pnpm nest`, con `pnpm server` en marcha.
    La consola muestra `http://127.0.0.1:3003`.
    Postman puede listar, crear, modificar y eliminar. Modificar devuelve el `id` y los campos enviados. Listar vacía no es un fallo.
    Buscar y contar el género no tienen petición.
