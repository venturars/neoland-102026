# Plan — página de documentación de la API de Nest

Issue: #1138

Funcionalidad nueva, solo en `src/clients/nest/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje de error nuevo. `src/db/server.js`, `src/queries/`, `scripts/nest.js` y los demás clientes no cambian.

Hay un paquete nuevo. El resumen de Socket está abajo. Quien acepta el plan decide si le basta, porque Socket no ha podido contestar sobre campañas ni alertas.

Esta rama sale de `staging`, que ya tiene las rutas de buscar por email, buscar por nombre y contar por género. No hay que fusionar otras ramas ni seguir un orden de fusión.

## Cómo funciona

```
navegador → GET /docs → página de Swagger
navegador → «Try it out» → /users... → src/logic/ → src/queries/ → src/db/server.js
```

Swagger lee las rutas del controlador y crea la página. No hay TypeScript, así que no puede deducir los tipos: cada ruta los declara a mano con decoradores.

## Ficheros

Se crea en `src/clients/nest/`:

- `users.swagger.js` — los esquemas como constantes con objetos sencillos: `USUARIO`, `LISTA_USUARIOS`, `CREAR_USUARIO`, `MODIFICAR_USUARIO`, `RECUENTO` y `ERROR`. No son clases DTO, porque `docs/STYLE.md` solo admite clases donde Nest las exige.

Se tocan:

- `src/clients/nest/main.js` — monta la página y cambia la comprobación de `Origin`. Ver abajo.
- `src/clients/nest/users.controller.js` — añade los decoradores de cada ruta. Las funciones no cambian.
- `package.json` — `@nestjs/swagger` en `dependencies`.
- `pnpm-lock.yaml` — lo actualiza `pnpm install`.
- `AGENTS.md` — el paquete en la lista de dependencias y `/docs` en la línea de `pnpm nest`.
- `docs/ARCHITECTURE.md` — la fila de `src/clients/nest/*`: la página y la nueva regla de `Origin`.
- `docs/TREE.md` — `users.swagger.js` en `clients/nest/`.
- `docs/specs/nest-client/spec.md` y `plan.md` — una nota que remite a esta spec. Ahora dicen que no hay página propia y que se rechaza todo `Origin`.

## `main.js`

- Nueva constante `ORIGEN_API`, con el valor `http://127.0.0.1:3003`, sacado de `HOST` y `PORT`.
- `comprobarPeticion` responde 403 si llega un `Origin` distinto de `ORIGEN_API`. Sin `Origin` se atiende, como ahora. Hace falta porque el navegador envía `Origin` en POST, PATCH y DELETE, incluso desde la propia página.
- La comprobación de `Host` no cambia. Sigue protegiendo de una web que se haga pasar por esta dirección.
- La página se monta en `/docs` con `DocumentBuilder`, `SwaggerModule.createDocument` y `SwaggerModule.setup`. Va después de `app.use(comprobarPeticion)` y antes de `app.listen`, para que `/docs` y `/docs-json` también pasen la comprobación.
- El aviso de arranque añade la dirección de la documentación.

## Decoradores por ruta

`@ApiTags("users")` va en la clase. Cada ruta lleva `@ApiOperation` y estos datos:

| Ruta | Entrada | Respuesta buena | Fallos |
| --- | --- | --- | --- |
| `POST /users` | `@ApiBody` `CREAR_USUARIO` | 201, `USUARIO` | 400, 409, 500 |
| `GET /users` | — | 200, `LISTA_USUARIOS` | 500 |
| `GET /users/by-email` | `@ApiQuery` `email` | 200, `USUARIO` | 400, 404, 500 |
| `GET /users/by-name` | `@ApiQuery` `name` | 200, `LISTA_USUARIOS` | 400, 500 |
| `GET /users/gender-count` | — | 200, `RECUENTO` | 500 |
| `GET /users/:id` | `@ApiParam` `id` | 200, `USUARIO` | 404, 500 |
| `PATCH /users/:id` | `@ApiParam` `id`, `@ApiBody` `MODIFICAR_USUARIO` | 200, `USUARIO` | 400, 404, 409, 500 |
| `DELETE /users/:id` | `@ApiParam` `id` | 204, sin cuerpo | 404, 500 |

Los estados salen de `src/logic/`, `docs/ERRORS.md` y `ESTADOS` en `logic-exception.filter.js`. Los fallos usan `ERROR`, que es `{ message }`.

`USUARIO` es `{ id, name, email, createdAt, updatedAt }`, con `id` numérico. `RECUENTO` es `{ women, men, genderUndefined }`.

## Comentarios

Todo el código nuevo lleva comentarios fáciles de leer, en castellano y sin jerga sin explicar: uno encima de cada import, una frase encima de cada función y uno por bloque. Las líneas de código son cortas. Antes de cada commit se releen los comentarios nuevos.

## Paquetes

- `dependencies`: `@nestjs/swagger@12.1.0`, con versión fija. Sus `peerDependencies` piden Nest `^12.0.0` y `reflect-metadata` `^0.2.0`, que ya están. `typescript`, `class-validator`, `class-transformer` y `@fastify/static` son opcionales y no se instalan.

### Resumen de Socket

Las stats salen de la herramienta `depscore` de `https://mcp.socket.dev/`, consultada sin token el 2026-11-05. Las versiones y las capas salen de `npm view`.

| Capa | Paquete | Cadena de suministro | Calidad | Mantenimiento | Vulnerabilidades | Licencia |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `@nestjs/swagger@12.1.0` | 98 | 86 | 96 | 100 | 100 |
| 2 | `swagger-ui-dist@5.34.0` | 99 | 83 | 97 | 100 | 80 |
| 2 | `js-yaml@5.5.0` | 100 | 86 | 92 | 100 | 100 |
| 2 | `es-toolkit@1.52.0` | 99 | 93 | 98 | 100 | 100 |
| 2 | `path-to-regexp@8.4.2` | 100 | 100 | 91 | 100 | 100 |
| 2 | `@microsoft/tsdoc@0.17.1` | 100 | 89 | 87 | 100 | 100 |
| 2 | `@nestjs/mapped-types@12.0.1` | 99 | 89 | 89 | 100 | 100 |
| 2 | `@standard-schema/spec@1.1.0` | 100 | 99 | 82 | 100 | 100 |
| 3 | `@scarf/scarf@1.4.0` | 82 | 100 | 80 | 100 | 100 |
| 3 | `argparse@3.0.4` | 100 | 97 | 89 | 100 | 100 |

- **Stats por debajo de 50:** ninguna, en ningún paquete.
- **Campañas: sin dato.** La herramienta `threat_feed` de Socket pide una cuenta y una organización, y esta consulta se hizo sin token. Que no haya dato no significa que el paquete sea seguro.
- **Alertas: sin dato.** La herramienta `alerts` pide lo mismo, y `depscore` da puntos pero no lista alertas. Tampoco se pudo abrir la página pública de Socket, que respondió 403 a la consulta automática.
- **Para tener esos dos datos:** Diego puede mirar los paquetes en socket.dev desde el navegador, o definir `SOCKET_API_TOKEN` si su cuenta da acceso a esas herramientas.

**A tener en cuenta, aunque no venga de Socket:** `@scarf/scarf` tiene un `postinstall` (`node ./report.js`) que envía estadísticas de instalación. El proyecto usa pnpm `10.20.0`, que por defecto no ejecuta esos scripts, y no hay configuración que lo permita. Se comprueba después de instalar. No hay que permitirlo.

## Comprobación

Con `pnpm start` en una terminal y `pnpm nest` en otra:

1. `http://127.0.0.1:3003/docs` abre la página y muestra las 8 rutas con sus esquemas.
2. Desde «Try it out»: crear (201), ver, buscar por email, buscar por nombre, modificar (200) y borrar (204).
3. Crear dos veces con el mismo email da 409 con `{ message }`. Un id que no existe da 404.
4. `gender-count` responde con Ollama en marcha.
5. `curl -H "Origin: https://ejemplo.com" http://127.0.0.1:3003/users` da 403.
6. `curl -H "Host: otro" http://127.0.0.1:3003/users` da 403.
7. `curl http://127.0.0.1:3003/users` sigue funcionando y `GET /no-existe` da 404 sin cuerpo.
8. `curl http://127.0.0.1:3003/docs-json` devuelve el documento OpenAPI.
9. Cada parámetro sale una sola vez en la página, aunque se use `@Bind` junto a `@ApiParam` o `@ApiQuery`.
10. `pnpm format` y `pnpm lint` pasan.

## Riesgo

El paquete aún no se ha instalado. No se ha probado con Babel en modo `legacy` y sin TypeScript. Si no arranca o no lee bien las rutas, se para, se avisa a Diego y se corrige este plan.

## Decisión ya tomada

La spec `nest-client` dice que no hay página propia y que se rechaza todo `Origin`. Diego ha decidido permitir el `Origin` de la propia API y actualizar esa spec con una nota.
