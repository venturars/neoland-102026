# Plan — página Swagger del cliente Nest

Issue: #1083.

No es una acción nueva de personas. No se toca `src/logic/`, `src/queries/` ni `src/db/`. No hay firma nueva ni SQL nuevo.

El cliente Nest sigue llamando a las mismas funciones y devolviendo lo mismo. Este cambio monta Swagger UI con `@nestjs/swagger` al arrancar `src/clients/nest/main.js`. El documento sale de las rutas que ya tiene `users.controller.js`. No cambian paths, métodos, cuerpos ni códigos.

La página está en la raíz. La URL es `http://127.0.0.1:3003`. El puerto y el host siguen saliendo de `ORIGIN` en `main.js`. Al arrancar, la consola sigue escribiendo esa misma URL.

`npm run nest` sigue compilando con Babel a `dist/` y arrancando `dist/clients/nest/main.js`. El script no cambia.

En `main.js`, después de `NestFactory.create`, `DocumentBuilder` pone el título `Users Neoland` y la versión `0.0.0`. `SwaggerModule.createDocument` genera el JSON. `SwaggerModule.setup` sirve la página en la raíz.

En `users.controller.js`, crear lleva `@ApiBody` con `name` y `email` obligatorios y los ejemplos `Ada` y `ada@example.com`. Cambiar lleva `@ApiBody` con esos dos campos y los ejemplos `Ada Lovelace` y `ada@example.com`. Ver, cambiar y borrar llevan `@ApiParam` para el id, con el ejemplo `1`. El controlador no tiene una ruta comodín, así que no hace falta excluir ninguna.

Las respuestas no cambian:

- `POST /users` crea. Responde 201 y la persona.
- `GET /users` lista. Responde 200 y la lista.
- `GET /users/:id` ve uno. Responde 200 y la persona.
- `PATCH /users/:id` cambia. Lo que no entra se conserva. Responde 200 y la persona.
- `DELETE /users/:id` borra. Responde 204, sin cuerpo.
- Otra ruta responde 404, sin cuerpo.

Un fallo conocido responde JSON con la clave `message`.

| Fallo | Frase | Estado |
| --- | --- | --- |
| El nombre queda vacío | `Name is empty` | 400 |
| El email no vale | `Email is invalid` | 400 |
| El email es el de otra persona | `Email is already used` | 409 |
| Ese id no está | `User not found` | 404 |
| No se llega a la base, o el id no es un entero mayor o igual que 1 | el `Could not` de esa acción | 500 |

La lista vacía no es un fallo.

## Ficheros

Se crea:

- `docs/specs/swagger-nest/spec.md`
- `docs/specs/swagger-nest/plan.md`
- `docs/specs/swagger-nest/tasks.md`

Se tocan, cuando se pida el código:

- `package.json`
- `package-lock.json`
- `src/clients/nest/main.js`
- `src/clients/nest/users.controller.js`
- `docs/ARCHITECTURE.md`
- `docs/CONSTITUTIONS.md`
- `docs/TREE.md`
- `README.md`
- `AGENTS.md`

`package.json` añade `@nestjs/swagger` en `12.1.0`, al lado de `@nestjs/common@12.3.3` y `@nestjs/core@12.3.3`. La versión queda exacta, sin rango. No se añaden `class-validator`, `class-transformer`, `typescript` ni `@fastify/static`.

`docs/ARCHITECTURE.md`, `docs/CONSTITUTIONS.md`, `README.md` y `AGENTS.md` dicen que el cliente Nest también tiene la página en `http://127.0.0.1:3003`. `docs/TREE.md` nombra esta spec. `docs/STYLE.md` y `docs/ERRORS.md` no cambian.

No se tocan el resto de clientes ni la base.

## Socket

Hay un paquete nuevo: `@nestjs/swagger@12.1.0`. Aún no está instalado. El árbol es el que publicó npm para esa versión el 2026-11-05, más las dependencias hasta tres capas. `path-to-regexp@8.4.2` ya está en `package-lock.json` por Express y no cambia de versión. `js-yaml@5.5.0` pide `argparse` con rango `^3.0.3`. El registro, hoy, resuelve ese rango a `3.0.4`. Si el lock resuelve otra versión, se para y esa versión vuelve a Socket.

Las puntuaciones salen de `depscore`, con la versión exacta. Ninguna baja de 50. La más baja es license 80, en `swagger-ui-dist@5.34.0`.

La alerta sale de `alerts`, con `org_slug` `vibecodingneoland`, el que devolvió `organizations`. Se pidió la lista abierta, sin filtrar por paquete, y también la de `@nestjs/swagger`. `items` llegó vacío y `endCursor` llegó nulo. Una lista vacía es la lista que devolvió la organización.

La campaña sale de `threat_feed` para `@nestjs/swagger@12.1.0`, con ese mismo `org_slug`. Respondió 403 `threat_feed_not_entitled`: la organización no tiene threat feed. No hay dato de campaña.

- `@nestjs/swagger@12.1.0`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 96, quality 86, supplyChain 98, vulnerability 100.
- `@nestjs/mapped-types@12.0.1`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 89, quality 89, supplyChain 99, vulnerability 100.
- `swagger-ui-dist@5.34.0`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 80, maintenance 97, quality 83, supplyChain 99, vulnerability 100.
- `js-yaml@5.5.0`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 92, quality 86, supplyChain 100, vulnerability 100.
- `es-toolkit@1.52.0`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 98, quality 93, supplyChain 99, vulnerability 100.
- `@microsoft/tsdoc@0.17.1`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 87, quality 89, supplyChain 100, vulnerability 100.
- `@standard-schema/spec@1.1.0`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 82, quality 99, supplyChain 100, vulnerability 100.
- `path-to-regexp@8.4.2`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 91, quality 100, supplyChain 100, vulnerability 100.
- `argparse@3.0.4`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 89, quality 97, supplyChain 100, vulnerability 100.
- `@scarf/scarf@1.4.0`. Campaña: no hay dato. Alerta: la lista abierta salió vacía. license 100, maintenance 80, quality 100, supplyChain 82, vulnerability 100.

No se instala el paquete hasta que se lean esta spec y este plan.
