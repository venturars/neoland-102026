Issue: #1114

# Plan de la página Swagger UI en el cliente Nest

## Enfoque

No hay funcionalidad nueva en `src/logic/`, ni consultas nuevas, ni cambios en `src/db/server.js`, en el servicio ni en el filtro de errores. Hay un paquete nuevo y el cliente Nest gana una página.

`@nestjs/swagger` construye el documento OpenAPI desde los decoradores del controlador y publica Swagger UI sobre la aplicación Nest, que ya usa Express. Sin TypeScript, el plugin de la CLI de Nest no puede leer los tipos, así que el cuerpo y el id se describen a mano con `@ApiBody` y `@ApiParam`. Sin ellos, el documento sale sin cuerpo en crear y modificar, y sin el parámetro `id`.

En `main.js`, antes de `listen`, se construye el documento con `DocumentBuilder` (título `Users`, versión `0.0.0`) y se publica con `SwaggerModule.setup` en el camino vacío, que `@nestjs/swagger` deja en `/`. El camino vacío evita elegir una ruta nueva: la página está en la propia dirección del cliente.

## Entradas y salidas de la lógica

Sin cambios. Las cinco rutas llaman a las mismas funciones de `src/logic/` a través del servicio.

## Detalles que hay que resolver

- **El filtro responde `404` sin cuerpo a cualquier ruta desconocida.** Swagger UI se registra en Express, fuera del enrutador de Nest, así que el filtro no debería tocar `/`, `/swagger-ui.css` ni el JSON del documento. Se comprueba con una prueba: la página responde `200` y `/no-existe` sigue respondiendo `404` sin cuerpo.
- **El id lo convierte el controlador.** `@ApiParam` solo documenta el id como texto con ejemplo `1`; no cambia el `Number` con la comprobación de `String(number) === text`.
- **Los cuerpos:** crear describe `name` y `email` como cadenas obligatorias; modificar, como cadenas opcionales. Los ejemplos son datos ficticios (Ada).
- **`servers` sale vacío.** La página usa el host de la petición. No se añade otro servidor.
- **Los errores no se documentan con `@ApiResponse`.** Quedan como los describe la spec del cliente Nest; documentarlos es una decisión de la persona responsable (ver abajo).
- **Orden de los decoradores.** `@ApiBody` y `@ApiParam` se añaden junto a `@Bind(...)` sin alterar las rutas.

## Archivos

Se modifican:

- `src/clients/nest/main.js`: documento y `SwaggerModule.setup`.
- `src/clients/nest/users.controller.js`: `@ApiBody` en crear y modificar, y `@ApiParam` en ver, modificar y borrar.
- `package.json` y `pnpm-lock.yaml`: la dependencia nueva.
- `tests/nest-client.test.js`: casos de la página y de que `/no-existe` sigue igual.
- `README.md`: cómo abrir la página.
- `docs/ARCHITECTURE.md`: `src/clients/nest/` publica una página Swagger UI en el 3003.
- `docs/TREE.md`: esta spec.

`app.module.js`, `users.service.js`, `users-exception.filter.js`, `docs/ERRORS.md`, `docs/STYLE.md` y `docs/CONSTITUTION.md` no cambian. El cliente sigue siendo uno de los ya previstos; la constitución se revisa al cerrar.

## Paquetes

`dependencies`:

- `@nestjs/swagger@12.1.0`

Dependencias nuevas hasta tres capas, resueltas con pnpm 10.34.7 en una copia temporal del `package.json` y del `pnpm-lock.yaml`, solo como lockfile y sin ejecutar scripts:

- `@microsoft/tsdoc@0.17.1`
- `@nestjs/mapped-types@12.0.1`
- `es-toolkit@1.52.0`
- `js-yaml@5.5.0`, que trae `argparse@3.0.4`
- `swagger-ui-dist@5.34.0`, que trae `@scarf/scarf@1.4.0`

`@nestjs/common`, `@nestjs/core`, `reflect-metadata`, `@standard-schema/spec@1.1.0` y `path-to-regexp@8.4.2` no cambian de versión. No se instalan los pares opcionales `class-validator`, `class-transformer`, `typescript` ni `@fastify/static`.

## Verificación

1. `pnpm format`, `pnpm lint` y `pnpm test`.
2. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, `pnpm start` y `pnpm run nest`.
3. `GET /` responde `200` con el título `Swagger UI`; las cinco rutas y `/no-existe` responden como antes.
4. En el navegador, los casos de la spec en orden. Después, parar el servidor de datos y repetir las cinco operaciones.

## Revisión con Socket

- **Árbol:** resuelto como se indica arriba. Con `@nestjs/swagger@12.1.0` quedan las versiones de la lista.
- **Organización:** `aiai`, plan gratuito.
- **Revisado con `depscore`:** los 8 paquetes nuevos (el declarado y 7 dependencias, hasta la capa 2). Las capas 1 y 2 de las dependencias que no cambian (`@nestjs/*`, `reflect-metadata`, `rxjs`) ya quedaron revisadas en la spec del cliente Nest.

| Paquete                  | Puntuación más baja                 |
| ------------------------ | ----------------------------------- |
| `@nestjs/swagger@12.1.0` | `quality` 86                        |
| `@nestjs/mapped-types`   | `maintenance` 89 y `quality` 89     |
| `@microsoft/tsdoc`       | `maintenance` 87                    |
| `es-toolkit`             | `quality` 93                        |
| `js-yaml@5.5.0`          | `quality` 86                        |
| `argparse@3.0.4`         | `maintenance` 89                    |
| `swagger-ui-dist`        | `license` 80                        |
| `@scarf/scarf@1.4.0`     | `maintenance` 80 y `supplyChain` 82 |

**Puntuaciones:** ninguna está por debajo de 50. `vulnerability` es 100 en todas.

**Alertas (`alerts`):** la lista de alertas abiertas de `aiai` está vacía para los 8 paquetes. Es la lista de la organización: no dice que esas versiones no tengan alertas.

**Campaña (`threat_feed`):** no se pudo revisar. La herramienta respondió `403 threat_feed_not_entitled`: «Threat feed is not enabled for this organization». Depende de la organización y no del paquete, así que no hay dato de campaña para ninguna dependencia.

**Sin revisar:** las capas 1 a 3 de `reflect-metadata` ya estaban en el árbol y no se repiten. Los pares opcionales no se instalan. `@scarf/scarf` tiene un script de instalación que pnpm ignora por defecto; no se autoriza (`pnpm.onlyBuiltDependencies` no se toca).

**Alertas pendientes:** ninguna conocida entre lo revisado.

## Decisiones de la persona responsable

1. **Dependencia nueva. Aprobada.** `@nestjs/swagger@12.1.0`, con la revisión Socket parcial y sin datos de campaña descrita arriba.
2. **Errores en la página. Aprobada.** Sin `@ApiResponse`: la página muestra las respuestas reales al lanzar cada operación.
3. **Camino de la página. Aprobada.** `/`, con `SwaggerModule.setup("")`.
