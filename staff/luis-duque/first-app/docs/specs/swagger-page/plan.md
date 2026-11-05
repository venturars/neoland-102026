# Plan — página Swagger

Cumple `docs/specs/swagger-page/spec.md`.

No hay operación nueva ni SQL nuevo. Listar, crear, modificar, eliminar y buscar por id siguen en la lógica que ya existe. Buscar por email, por nombre y contar el género no entran. Crear la tabla no se pide aparte.

La página se abre en el cliente NestJS que ya responde en `127.0.0.1:3003`. `@nestjs/swagger` `12.1.0` es el paquete de documentación de ese cliente. No es otro framework ni otro cliente. NestJS se queda en `12.3.3`. Esta app sigue en JavaScript. Babel ya compila los decoradores. No se añade TypeScript.

Los pares opcionales de ese paquete no se instalan: `typescript`, `@fastify/static`, `class-validator` y `class-transformer`. El cliente ya tiene `@nestjs/common` `12.3.3`, `@nestjs/core` `12.3.3` y `reflect-metadata` `0.2.2`. Esas versiones no cambian y no se vuelven a comprobar, ni `@standard-schema/spec` `1.1.0` ni `path-to-regexp` `8.4.2`, que ya están en `pnpm-lock.yaml`.

## Validación Socket

`depscore` respondió el 2026-11-05, con plataforma `win32-x64`. `organizations` respondió `Unauthorized`. Sin `org_slug` no se ha podido llamar a `alerts` ni a `threat_feed`. No hay dato de alerta ni de campaña. Eso no es ausencia de avisos.

El árbol nuevo son 8 paquetes, hasta 3 capas, sin repetir. Las versiones son las que pnpm resuelve para `@nestjs/swagger` `12.1.0`. Ninguna stat está por debajo de 50. La más baja es la licencia de `swagger-ui-dist` `5.34.0`, en 80. La cadena de `@scarf/scarf` `1.4.0` está en 82.

| Paquete | Versión | Capa | Campaña | Alertas | Stats por debajo de 50 |
| --- | --- | --- | --- | --- | --- |
| `@nestjs/swagger` | `12.1.0` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 96, calidad 86, cadena 98, vulnerabilidad 100 |
| `@microsoft/tsdoc` | `0.17.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 87, calidad 89, cadena 100, vulnerabilidad 100 |
| `@nestjs/mapped-types` | `12.0.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 89, cadena 99, vulnerabilidad 100 |
| `es-toolkit` | `1.52.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 98, calidad 93, cadena 99, vulnerabilidad 100 |
| `js-yaml` | `5.5.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 92, calidad 86, cadena 100, vulnerabilidad 100 |
| `swagger-ui-dist` | `5.34.0` | 1 | sin dato | sin dato | ninguna. Licencia 80, mantenimiento 97, calidad 83, cadena 99, vulnerabilidad 100 |
| `argparse` | `3.0.4` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 97, cadena 100, vulnerabilidad 100 |
| `@scarf/scarf` | `1.4.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 80, calidad 100, cadena 82, vulnerabilidad 100 |

`argparse` cuelga de `js-yaml`. `@scarf/scarf` cuelga de `swagger-ui-dist`. Esos dos no tienen otra dependencia dentro de la tercera capa.

## Ficheros

Se toca `src/clients/nest/main.js`. Después de crear la aplicación y antes de escuchar, monta la página en la ruta `swagger`.

Se toca `src/clients/nest/users.controller.js`. Describe las cinco peticiones que ya tiene, para que la página las muestre y deje lanzarlas. No se crea una clase de datos ni una clase de error.

No se tocan `app.module.js`, `users.service.js` ni `http-exception.filter.js`. El filtro sigue traduciendo el `Error` igual.

Se toca `package.json`. En `dependencies` entra `@nestjs/swagger` `12.1.0`. El script `nest` se queda igual. pnpm añade el paquete con esa versión exacta. `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano. No se usa npm ni yarn.

No se toca `babel.config.json`. No se toca `eslint.config.js`: ya ignora `src/clients/nest/**`. No se toca el `.gitignore` de la raíz. No se crea un `README`.

No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter`, `src/clients/browser`, `src/clients/http`, `src/clients/electron`, `src/clients/chrome` ni `src/clients/vscode`.

En el mismo cambio que el código se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/TREE.md` no gana ficheros. `docs/DATABASE.md` no cambia: la base sigue igual.

## Firma

No hay función de negocio nueva. `users.service.js` sigue importando las cinco funciones que ya existen. El controlador no importa la lógica.

| Petición | Llamada | En la página |
| --- | --- | --- |
| `POST /users` | `createUser({ name, email })` | Cuerpo JSON con `name` y `email`, los dos obligatorios |
| `GET /users` | `listUsers()` | Sin cuerpo y sin parámetros |
| `GET /users/:id` | `findUserById(id)` | El `id` en la ruta |
| `PATCH /users/:id` | `updateUser(id, changes)` | El `id` en la ruta. Cuerpo JSON con `name`, con `email` o con los dos |
| `DELETE /users/:id` | `deleteUser(id)` | El `id` en la ruta |

La descripción vive en el controlador, con los decoradores de `@nestjs/swagger`. El esquema del cuerpo se escribe ahí. No se añade `class-validator`.

## SQL

No hay SQL nuevo. Cada petición usa la operación que ya está escrita.

## Cliente

`main.js` sigue importando primero `reflect-metadata`. Crea la aplicación con `NestFactory` y `AppModule`. Con `DocumentBuilder` y `SwaggerModule`, de `@nestjs/swagger`, publica el documento de las cinco peticiones y monta la página en `swagger`. La dirección queda `http://127.0.0.1:3003/swagger`. El documento que lee esa página queda en `http://127.0.0.1:3003/swagger-json`. El título de la página es `Usuarios`.

`ORIGIN` sigue valiendo `http://127.0.0.1:3003`. Escucha en el puerto y el host de `ORIGIN`. Al escuchar, hace `console.log` de `ORIGIN`.

No valida, no escribe SQL y no abre la base. No llama a `/execute`.

La página deja lanzar las cinco peticiones contra este mismo cliente. La respuesta sigue siendo la que ya devuelve el controlador:

- Crear responde 201 con `{ id, name, email }`.
- Listar responde 200 con la lista. Si no hay ninguno, `[]`.
- Buscar por id responde 200 con `{ id, name, email }`.
- Modificar responde 200 con lo que devuelve `updateUser`: el `id` y solo los campos enviados.
- Eliminar responde 204 sin cuerpo.

Si la función lanza un `Error`, el cuerpo sigue siendo `{ "message": texto }` y el texto no se cambia. La página muestra esos fallos:

- 400 para `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `User id must be a positive integer` y `Provide a name or an email to update`.
- 404 para un mensaje que termina en `was not found`.
- 409 para un mensaje que contiene `UNIQUE constraint`.
- 500 para cualquier otro `Error`. Si el programa de consultas no está en marcha, se ve el fallo de esa llamada.

## Documentación

`docs/ARCHITECTURE.md` añade la página del cliente NestJS: en el navegador, en `http://127.0.0.1:3003/swagger`, se ven y se pueden lanzar listar, crear, modificar, eliminar y buscar por id. Sigue llamando a la lógica. Sigue sin buscar por email ni por nombre y sin contar el género. Se arranca con `pnpm nest`. Postman puede seguir pidiendo esas mismas peticiones.

`docs/STYLE.md` deja que `main.js` monta esa página con `@nestjs/swagger` `12.1.0` y que `users.controller.js` describe las cinco peticiones. `users.service.js` sigue igual.

`docs/ERRORS.md` añade que, si el cliente NestJS no está en marcha, la página `http://127.0.0.1:3003/swagger` no se abre.

`docs/CONSTITUTIONS.MD` cuenta la página en `127.0.0.1:3003/swagger`. El desarrollo abierto pasa a ser `docs/specs/swagger-page/`.

`AGENTS.MD` deja la regla: `main.js` monta la página en `swagger` con `@nestjs/swagger` `12.1.0`. `users.controller.js` describe listar, crear, modificar, eliminar y buscar por id. El servicio, el filtro, el script `nest`, el puerto `3003` y NestJS `12.3.3` se quedan como están.
