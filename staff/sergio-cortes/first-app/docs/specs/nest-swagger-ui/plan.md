# Plan — página Swagger UI para consumir la API de usuarios

Issue: #1082.

No es una funcionalidad nueva de `logic/`. No se crea ni se cambia
ninguna función de `src/logic/`. No hay firma nueva, ni SQL nuevo, ni
mensaje nuevo. Los mensajes de error son los de `docs/ERRORS.md`.

Referencia: `staff/ventura-rodriguez/first-app/docs/specs/nest-swagger-ui`
(issue #1070, PR #1073). Usa el mismo paquete y publica la página de la
misma forma. No se copia su lógica de modificar: allí `PATCH` acepta un
dato solo. Aquí no, porque `updateUser` de este proyecto exige nombre y
email, y la spec `nest-users-client` dice «no se cambia uno solo».

## Paquetes

Entra en `dependencies`, con versión exacta:

- `@nestjs/swagger@12.1.0`

Comprobado en el manifest publicado del registro:

- Peers `@nestjs/common` y `@nestjs/core` `^12.0.0` (aquí `12.3.3`), y
  `reflect-metadata` `^0.2.0` (aquí `0.2.2`). Se cumplen con lo que ya hay.
- Peers opcionales, no se instalan: `typescript`, `@fastify/static`,
  `class-validator` y `class-transformer`. `@nestjs/mapped-types` también
  los marca como opcionales.
- Ya están en `pnpm-lock.yaml` con la misma versión y no cambian:
  `path-to-regexp@8.4.2`, `@standard-schema/spec@1.1.0`, `reflect-metadata@0.2.2`,
  `@nestjs/common@12.3.3` y `@nestjs/core@12.3.3`. No entran en Socket.

Árbol nuevo, por capas (capa 0 = directo):

- Capa 0: `@nestjs/swagger@12.1.0`.
- Capa 1: `js-yaml@5.5.0`, `es-toolkit@1.52.0`, `swagger-ui-dist@5.34.0`,
  `@microsoft/tsdoc@0.17.1`, `@nestjs/mapped-types@12.0.1`.
- Capa 2: `argparse@3.0.4` (la dependencia `^3.0.3` de `js-yaml@5.5.0`
  resuelve a `3.0.4`) y `@scarf/scarf@1.4.0` (dependencia exacta de
  `swagger-ui-dist@5.34.0`).
- Capa 3: ninguna. `argparse` y `@scarf/scarf` no tienen dependencias.

### Validación Socket

Organización `sergio-cortes`, plan free. El threat feed no está habilitado
en esa organización (respuesta 403 `threat_feed_not_entitled`), así que la
columna de campaña queda `n/d (plan free)`.

| capa | paquete@versión | campaña | alertas | license | maintenance | quality | supplyChain | vulnerability | stats < 50 |
|------|-----------------|---------|---------|---------|-------------|---------|-------------|---------------|------------|
| 0 | `@nestjs/swagger@12.1.0` | n/d (plan free) | no | 100 | 96 | 86 | 98 | 100 | ninguna |
| 1 | `js-yaml@5.5.0` | n/d (plan free) | no (ver nota) | 100 | 92 | 86 | 100 | 100 | ninguna |
| 1 | `es-toolkit@1.52.0` | n/d (plan free) | no | 100 | 98 | 93 | 99 | 100 | ninguna |
| 1 | `swagger-ui-dist@5.34.0` | n/d (plan free) | no | 80 | 97 | 83 | 99 | 100 | ninguna |
| 1 | `@microsoft/tsdoc@0.17.1` | n/d (plan free) | no | 100 | 87 | 89 | 100 | 100 | ninguna |
| 1 | `@nestjs/mapped-types@12.0.1` | n/d (plan free) | no | 100 | 89 | 89 | 99 | 100 | ninguna |
| 2 | `argparse@3.0.4` | n/d (plan free) | no | 100 | 89 | 97 | 100 | 100 | ninguna |
| 2 | `@scarf/scarf@1.4.0` | n/d (plan free) | no | 100 | 80 | 100 | 82 | 100 | ninguna |

Ninguna puntuación baja de 50.

Nota de alertas. La organización tiene cuatro alertas abiertas sobre
`js-yaml`: `SOCKET-SERGIO-CORTES-39` (high), `-175` (high), `-204` (high) y
`-210` (medium). Todas son de `js-yaml` 4.1.1 en el repositorio
`personal/el-patron-code-ai-assistant`, y sus versiones corregidas son
4.2.0 a 4.3.2. Ninguna corresponde a `js-yaml@5.5.0`, que es la versión que
entra aquí. El agente no las acepta por su cuenta: la confirmación queda
en la pregunta 2 de abajo.

## Ficheros

No se crea ningún fichero de código. Se crea la carpeta de la spec, con
`spec.md` y este `plan.md`.

Se tocan:

- `package.json`: añade `"@nestjs/swagger": "12.1.0"` en `dependencies`, en
  orden alfabético.
- `pnpm-lock.yaml`: lo escribe pnpm al añadir la dependencia. No se edita a mano.
- `src/clients/nest/main.js`: publica la página Swagger UI.
- `src/clients/nest/users.controller.js`: añade la documentación de cada ruta.
- `docs/ARCHITECTURE.md`: la línea de `src/clients/nest/` y la de `main.js`.

No cambian: `docs/TREE.md` (no entra ni sale ningún fichero),
`docs/ERRORS.md`, `docs/STYLE.md`, `docs/CONSTITUTIONS.md`, `src/logic/`,
`src/queries/`, `src/db/`, `src/clients/nest/app.module.js`,
`src/clients/nest/http-exception.filter.js`, `src/clients/nest/users.service.js`,
los scripts de `package.json` y `babel.config.json`.

## Publicación de la página

En `src/clients/nest/main.js`, se añade el import y, entre la creación de
la app y `listen`, la construcción del documento:

```js
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
```

```js
const config = new DocumentBuilder()
  .setTitle("Users")
  .setVersion("0.0.0")
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup("docs", app, document);
```

La página sale en `/docs` y el documento JSON en `/docs-json`. Esto se
comprobó en el código publicado de `@nestjs/swagger@12.1.0`
(`dist/swagger-module.js`): el camino pasa por `validatePath`, que antepone
`/`, y el JSON es ese camino con `-json`.

La página usa el host desde el que se abre, así que `servers` queda vacío y
no hace falta configurar otra dirección. La terminal sigue escribiendo
`http://127.0.0.1:3003`.

## Documentación de las rutas

En `src/clients/nest/users.controller.js` se añade `@ApiTags("users")` a la
clase. Las rutas, los parámetros, `@Bind` y los códigos de éxito no cambian.
Para cada ruta se añaden los decoradores de `@nestjs/swagger`:

| Ruta | Entrada documentada | Respuestas documentadas |
|------|---------------------|-------------------------|
| `GET /users` | ninguna | 200 lista; 500 `Could not list the users` |
| `GET /users/:id` | `@ApiParam` `id`, ejemplo `1` | 200; 400 `Id is invalid`; 404 `User not found`; 500 `Could not find the user` |
| `POST /users` | `@ApiBody` con `name` y `email` obligatorios, ejemplos `Ada` y `ada@example.com` | 201; 400 `Body is invalid`, `Name is empty`, `Email is invalid`; 409 `Email is already used`; 500 `Could not create the user` |
| `PATCH /users/:id` | `@ApiParam` `id` y `@ApiBody` con `name` y `email` obligatorios, ejemplos `Ada Lovelace` y `ada@example.com` | 200; 400 `Id is invalid`, `Body is invalid`, `Name is empty`, `Email is invalid`; 404 `User not found`; 409 `Email is already used`; 500 `Could not update the user` |
| `DELETE /users/:id` | `@ApiParam` `id` | 204 sin cuerpo; 400 `Id is invalid`; 404 `User not found`; 500 `Could not delete the user` |

Sin `@ApiParam`, el documento de la versión 12.1.0 sale sin parámetros de
ruta: lo mostró la referencia. Por eso el `id` se declara en cada ruta que
lo recibe.

Cada respuesta de error usa un mismo esquema: un objeto con `message` de
tipo texto. El texto del ejemplo es el mensaje de la tabla. Las respuestas
de éxito usan el esquema de usuario: `id` entero, `name` y `email` texto,
`createdAt` y `updatedAt` fecha-hora. Las constantes de esos dos esquemas
viven al principio de `users.controller.js`.

El filtro `src/clients/nest/http-exception.filter.js` no cambia. Su
comportamiento es el que ya documenta la tabla.

Ejemplo del decorador de `POST /users`, para mostrar la forma:

```js
@Post("users")
@HttpCode(201)
@ApiBody({ schema: createUserBodySchema, examples: { ada: { value: { name: "Ada", email: "ada@example.com" } } } })
@ApiResponse({ status: 201, description: "Usuario creado", schema: userSchema })
@ApiResponse({ status: 400, description: "Dato no válido", schema: messageSchema })
@ApiResponse({ status: 409, description: "Email is already used", schema: messageSchema })
@ApiResponse({ status: 500, description: "Could not create the user", schema: messageSchema })
@Bind(Body())
async create(body) {
```

## Documentación del proyecto

En `docs/ARCHITECTURE.md`, la línea de `src/clients/nest/` añade que la
página Swagger UI sale en `/docs` y el documento en `/docs-json`. La línea
de `main.js` añade que publica esa página. No cambia nada más del texto.

## Comprobación

La verificación de la fase de implementación, que irá en `tasks.md` cuando
se apruebe este plan:

- `pnpm run lint` y `pnpm run format` sobre los ficheros tocados.
- `pnpm nest` arranca y escribe `HTTP server listening on http://127.0.0.1:3003`.
- `GET /docs` responde 200 con la página de Swagger UI, y `GET /docs-json`
  trae las cinco rutas con sus respuestas.
- `GET /users` sigue respondiendo 200 con el mismo JSON, y las respuestas de
  error de las rutas no cambian respecto a antes de la tarea.
- Un clic real en el navegador, que la referencia no hizo: crear, listar,
  ver, modificar y borrar desde la página.

## Decisiones de la persona

1. `@scarf/scarf@1.4.0` tiene un script de instalación (`postinstall`:
   `node ./report.js`). No se autoriza en `allowBuilds` de
   `pnpm-workspace.yaml`. pnpm lo deja sin ejecutar y ese fichero no cambia.
2. Las cuatro alertas abiertas de `js-yaml` (sobre 4.1.1, en otro
   repositorio) no aplican a `js-yaml@5.5.0`. La persona lo confirma. No se
   acepta ninguna alerta como aceptada: ninguna corresponde a la versión que entra.
