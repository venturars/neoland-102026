# Plan — Swagger UI en el cliente Nest

Issue: #1074.

No es una funcionalidad nueva de usuarios. No se reemplaza ningún
fichero de `src/logic/`, `src/queries/` ni `src/db/`. No hay firma
nueva ni SQL nuevo. No se añade un `.txt` en `src/clients/terminal/`.

El cliente Nest sigue llamando a las mismas funciones y devolviendo lo
mismo. Este cambio monta Swagger UI con `@nestjs/swagger` en el arranque
de `src/clients/nest/main.js`. El documento OpenAPI sale de las rutas
que ya tiene `users.controller.js`. No se cambian paths, métodos, cuerpos
ni códigos de estado de la API de usuarios.

La ruta de la interfaz es `api`. La URL completa es
`http://127.0.0.1:3003/api`. El puerto y el host siguen siendo los de
`ORIGIN` en `main.js`. Al arrancar, la consola sigue escribiendo
`http://127.0.0.1:3003`. La documentación dice también la URL de Swagger.

El adaptador sigue siendo Express (`@nestjs/platform-express@12.3.3`).
`pnpm nest` sigue compilando `src/clients/nest` con Babel a
`src/clients/nest-run` y arrancando ese `main.js`.

En `main.js`, después de `NestFactory.create`, se usa `DocumentBuilder`
para el título «Users API», una descripción breve y la versión `1.0`.
`SwaggerModule.createDocument` genera el JSON. `SwaggerModule.setup`
sirve Swagger UI en `api`.

En `users.controller.js`, el manejador `@All("*path")` lleva
`@ApiExcludeEndpoint()` para que la ruta comodín no salga en Swagger.
Opcionalmente la clase lleva `@ApiTags("users")`. Si el documento no
muestra bien los cuerpos JSON al usar `@Req()` y `@Res()`, se añaden
`@ApiBody` en crear y cambiar con un esquema mínimo (`name` y `email`
como texto). No se convierte el controlador al estilo de DTOs ni
TypeScript.

Las rutas de la API no cambian:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` cambia. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta de la API responde 404 y un cuerpo vacío.

Si la función lanza un `Error` con un mensaje de la tabla de abajo,
el cuerpo es JSON con la clave `message` y ese texto.

## Ficheros

Se crea:

- `docs/specs/nest-swagger-ui/spec.md`
- `docs/specs/nest-swagger-ui/plan.md`
- `docs/specs/nest-swagger-ui/tasks.md`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `src/clients/nest/main.js`
- `src/clients/nest/users.controller.js`
- `docs/ARCHITECTURE.md`
- `docs/style.md`
- `docs/CONSTITUTIONS.md`

`package.json` añade en `dependencies` `@nestjs/swagger@12.1.0`, alineado
con `@nestjs/common@12.3.3` y `@nestjs/core@12.3.3`. El script `nest` no
cambia.

`docs/ARCHITECTURE.md` dice que el cliente Nest también expone Swagger UI
en `/api` del mismo puerto 3003.

`docs/style.md`, en Comandos, indica que con `pnpm nest` la Swagger UI
está en `http://127.0.0.1:3003/api`.

`docs/CONSTITUTIONS.md`, en la sección 1, añade que quien prueba el
cliente Nest también puede usar Swagger UI en esa misma dirección, ruta
`api`. En la sección 7 dice que este cambio no añade un `.txt`.

`docs/errors.md`, `docs/tree.md` y `AGENTS.md` no cambian. No hay fichero
nuevo bajo `src/clients/nest/` salvo lo que ya existía; la config va en
`main.js` y los decoradores opcionales en el controlador.

No se tocan `src/logic/`, `src/queries/`, `src/db/`, la terminal,
Jupyter, `src/clients/web/`, `src/clients/http/`,
`src/clients/chrome/`, `src/clients/electron/` ni
`src/clients/vscode/`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                          | Mensaje                     | Estado |
| ----------------------------------------- | --------------------------- | ------ |
| El nombre queda vacío                     | `Name is empty`             | 400    |
| El email no vale                          | `Email is invalid`          | 400    |
| El email es el de otro usuario            | `Email is already used`     | 409    |
| El id no es un entero mayor o igual que 1 | `Invalid id`                | 400    |
| Ese usuario no está                       | `User not found`            | 404    |
| No se llega a la base al crear            | `Could not create the user` | 500    |
| No se llega al listar                     | `Could not list the users`  | 500    |
| No se llega al ver uno                    | `Could not find the user`   | 500    |
| No se llega al cambiar                    | `Could not update the user` | 500    |
| No se llega al borrar                     | `Could not delete the user` | 500    |

La lista vacía no es un fallo.

## Socket

Hay un paquete nuevo: `@nestjs/swagger@12.1.0`. Aún no está instalado.
El árbol es el que resolvió npm para esa versión y sus dependencias
directas, hasta 3 capas donde aplica. Si `pnpm` resuelve otra versión
dentro de un rango, hay que volver a pasarla por Socket.

`@nestjs/common@12.3.3`, `@nestjs/core@12.3.3`,
`@nestjs/platform-express@12.3.3` y `express@5.3.0` no cambian de
versión. `path-to-regexp@8.4.2` ya está en el lock por Express y no
cambia de versión en este resumen.

Tres datos. Cada uno dice de dónde sale.

Las stats salen de `depscore`, con la versión exacta. Ninguna está por
debajo de 50. La más baja es license 80, en `swagger-ui-dist@5.34.0`.
50 no baja.

La alerta sale de `alerts`, con `org_slug` `socket-dev-neoland`, que es
el que devolvió `organizations`. Se pidió la lista abierta de alertas
abiertas y también filtro por `@nestjs/swagger`. `items` llegó vacío y
`endCursor` llegó nulo. Una lista vacía es la lista de la organización.
No dice que esta versión no tenga alerta.

La campaña sale de `threat_feed` para `@nestjs/swagger@12.1.0`, con ese
mismo `org_slug`. Respondió 403 `threat_feed_not_entitled`: la
organización no tiene threat feed. No hay dato de campaña.

- `@nestjs/swagger@12.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 96, quality 86, supplyChain 98, vulnerability 100.
- `@nestjs/mapped-types@12.0.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 89, quality 89, supplyChain 99, vulnerability 100.
- `swagger-ui-dist@5.34.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 80, maintenance 97, quality 83, supplyChain 99, vulnerability 100.
- `js-yaml@5.5.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 92, quality 86, supplyChain 100, vulnerability 100.
- `es-toolkit@1.52.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 98, quality 93, supplyChain 99, vulnerability 100.
- `@microsoft/tsdoc@0.17.1`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 87, quality 89, supplyChain 100, vulnerability 100.
- `@standard-schema/spec@1.1.0`. Campaña: la organización no tiene threat feed. Alerta: la lista abierta de la organización salió vacía. license 100, maintenance 82, quality 99, supplyChain 100, vulnerability 100.

## Respuesta

Este plan no deja preguntas abiertas. La constitución, el código del
cliente Nest y la spec dicen lo mismo sobre las cinco acciones y los
mensajes de error. Hay `tasks.md`. No hay código hasta que una persona
lea estos ficheros y pida las tareas.
