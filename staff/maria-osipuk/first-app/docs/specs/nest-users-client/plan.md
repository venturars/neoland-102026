Issue: #1076

# Plan del cliente Nest de usuarios

## Enfoque

No hay funcionalidad nueva en `src/logic/`, ni consultas nuevas, ni cambios en `src/db/server.js`. Hay un cliente nuevo y paquetes nuevos.

Nest usa decoradores (`@Module`, `@Controller`, `@Injectable`...) y Node no los entiende. Sin TypeScript, la vía documentada por Nest es compilar con Babel (`sample/09-babel-example`). Por eso el cliente se compila a `dist/` y es `node` quien arranca la copia compilada. La inyección se escribe con `@Dependencies(...)` y los argumentos con `@Bind(Body())` y `@Bind(Param("id"))`, porque sin TypeScript no hay metadatos de tipos.

El SQL sigue pasando por el servidor de datos en `127.0.0.1:3000`. Este cliente escucha en `127.0.0.1:3003`; el 3001 es el cliente REST y el 3002 la API de Chrome.

## Entradas y salidas de la lógica

| Ruta                | Llamada                   | Éxito           |
| ------------------- | ------------------------- | --------------- |
| `POST /users`       | `createUser(name, email)` | `201` y usuario |
| `GET /users`        | `listUsers()`             | `200` y lista   |
| `GET /users/:id`    | `findUserById(id)`        | `200` y usuario |
| `PATCH /users/:id`  | `updateUser(id, changes)` | `200` y usuario |
| `DELETE /users/:id` | `deleteUser(id)`          | `204` vacío     |

No se importan `find-user-by-email.js` ni `count-users-by-gender.js`.

## Estructura del cliente

Un módulo, un controlador, un servicio y un filtro de excepciones:

- **Servicio:** llama a `src/logic/` y devuelve su resultado. No valida.
- **Controlador:** declara las cinco rutas, convierte el cuerpo y el id y llama al servicio.
- **Filtro:** traduce el mensaje lanzado por la lógica al estado de la tabla de la spec y responde `{ message }`.
- **`main.js`:** crea la aplicación Nest sobre Express y escucha en `127.0.0.1:3003`.

## Detalles que el cliente tiene que resolver

- **`createUser` recibe dos argumentos**, no un objeto: el servicio recibe `name` y `email` por separado.
- **El id llega como texto y la lógica exige un número.** Se convierte con `Number` y solo se usa el número si `String(number) === text`. Si no, se pasa el texto y `src/logic/` lo rechaza. Así `1e3` no se convierte en silencio en `1000` (apartado 4 de la constitución).
- **`updateUser` mira si la clave existe.** `name` y `email` se añaden a `changes` solo si no son `undefined`.
- **Sin cuerpo, `request.body` puede ser `undefined`.** Se usa un objeto vacío para que la lógica responda que falta el nombre en vez de un `TypeError` que acabaría en `500`.
- **Un JSON roto no llega a las rutas.** Nest responde con su propio error. El filtro lo reconoce y responde `400` con `Request JSON is invalid`, que es el único mensaje que nace en este cliente.
- **Otra ruta responde `404` con cuerpo vacío**, no el JSON por defecto de Nest. El filtro distingue ese caso del `404` de `User does not exist`.
- **Un mensaje desconocido** responde `500` con el `Unable to` de la operación. Nunca sale un texto que el cliente no conoce.
- **`console`:** si hace falta registrar el arranque, se usa `import { log } from "node:console"`, como en `src/db/server.js`.

## Archivos

Se crean:

- `babel.config.json`: `@babel/preset-env` con `targets.node` en `current` y `modules` en `false`, y `@babel/plugin-proposal-decorators` con `version` `legacy`.
- `src/clients/nest/main.js`
- `src/clients/nest/app.module.js`
- `src/clients/nest/users.controller.js`
- `src/clients/nest/users.service.js`
- `src/clients/nest/users-exception.filter.js`
- `tests/nest-client.test.js`: compila el cliente, arranca el servidor de datos con una base temporal y lanza el cliente como proceso hijo. Comprueba las cinco rutas y los errores de la spec, también con el servidor de datos parado.

Se modifican:

- `package.json`: paquetes nuevos y script `nest`. El script `format` ya es `prettier --write .` y cubre la carpeta nueva, así que no cambia.
- `pnpm-lock.yaml`
- `eslint.config.js`: `@babel/eslint-parser` para `src/clients/nest/**/*.js`, con `babel.config.json`. Sin él, ESLint se para en el primer `@`. `dist/` queda fuera.
- `.gitignore` y `.prettierignore`: `dist/`.
- `README.md`: fila del cliente y uso con Postman.
- `docs/ARCHITECTURE.md`: descripción de `src/clients/nest/`, que se compila con Babel, escucha en el 3003 y no repite reglas; y la lista de clientes y comandos.
- `docs/TREE.md`: los archivos nuevos y esta spec.
- `docs/STYLE.md`: aviso de que `src/clients/nest/` se aparta de la guía, porque usa clases, `this`, decoradores y nombres de archivo con punto. El resto de la app no.
- `docs/ERRORS.md`: apartado del cliente Nest y excepción en «Traducción en cada cliente», porque devuelve los mensajes en inglés.
- `docs/CONSTITUTION.md`: apartado 1, añadir el cliente Nest al alcance, y apartado 3, añadir Nest y Babel. Requiere autorización de la enmienda.

## Paquetes

`dependencies`:

- `@nestjs/common@12.3.3`
- `@nestjs/core@12.3.3`
- `@nestjs/platform-express@12.3.3`
- `reflect-metadata@0.2.2`
- `rxjs@7.8.2`

`devDependencies`:

- `@babel/cli@8.1.0`
- `@babel/core@8.1.0`
- `@babel/eslint-parser@8.0.7`
- `@babel/plugin-proposal-decorators@8.0.2`
- `@babel/preset-env@8.0.7`

`express@5.3.0` ya está declarado y no cambia. No se instalan los pares opcionales `class-transformer`, `class-validator`, `@nestjs/microservices` ni `@nestjs/websockets`: el cliente no valida. No se usa `@babel/node`.

## Verificación

1. `pnpm format`, `pnpm lint` y `pnpm test`.
2. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, `pnpm start` y `pnpm run nest`.
3. En Postman, los casos de la spec en orden. Después, parar el servidor de datos y repetir las cinco rutas.
4. Base compartida: un usuario creado en Postman aparece con `pnpm run web` y con `pnpm run http`.

## Revisión con Socket

- **Árbol:** resuelto con pnpm 10.34.7 solo como lockfile, en una carpeta vacía y sin instalar ni ejecutar scripts. Con estas versiones resuelve 306 paquetes. Si `pnpm` resuelve otras en el proyecto, hay que repetir la revisión.
- **Organización:** `aiai`, plan gratuito.
- **Revisado con `depscore`:** los 10 paquetes declarados y 10 de primer nivel propios de Nest: `tslib`, `@standard-schema/spec`, `iterare`, `load-esm`, `uid`, `file-type`, `fast-safe-stringify`, `path-to-regexp`, `cors` y `multer`. Veinte paquetes en total.
- **Sin revisar:** el resto del árbol. Quedan fuera los otros 112 paquetes del nivel 1 (los de Express, ya revisados en la spec del cliente REST con otra resolución, y la cadena de Babel), todo el nivel 2 y todo el nivel 3. El árbol hasta el nivel 3 tiene 266 paquetes en total. **La revisión de tres niveles que pide `AGENTS.md` no está completa.**

| Paquete                                                                                                                   | Puntuación más baja                                                              |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`                                                              | `maintenance` 95 (`@nestjs/core`)                                                |
| `reflect-metadata`                                                                                                        | `license` 80 y `maintenance` 80                                                  |
| `rxjs`                                                                                                                    | `maintenance` 88                                                                 |
| `@babel/cli`, `@babel/core`, `@babel/eslint-parser`, `@babel/plugin-proposal-decorators`, `@babel/preset-env`             | `quality` 73 (`@babel/plugin-proposal-decorators`); el resto entre 75 y 78       |
| Nivel 1 de Nest (`tslib`, `@standard-schema/spec`, `iterare`, `load-esm`, `uid`, `file-type`, `fast-safe-stringify`, ...) | `maintenance` 75 (`iterare` y `fast-safe-stringify`); `supplyChain` 92 (`tslib`) |

**Puntuaciones:** ninguna de las veinte está por debajo de 50. `vulnerability` es 100 en todas.

**Alertas (`alerts`):** la lista de alertas abiertas de `aiai` para `@nestjs/core` está vacía. Es la lista de la organización: no dice que esa versión no tenga alertas. Solo se consultó `@nestjs/core`.

**Campaña (`threat_feed`):** no se pudo revisar. La herramienta respondió `403 threat_feed_not_entitled` para la organización `aiai`: «Threat feed is not enabled for this organization». La respuesta depende de la organización y no del paquete, así que tampoco hay dato de campaña para ninguna dependencia.

**Alertas pendientes:** ninguna conocida entre lo revisado.

## Decisiones de la persona responsable

1. **Babel en lugar de TypeScript. Aprobada.** El cliente sigue la forma del cliente Nest de referencia: JavaScript con decoradores, compilado con Babel a `dist/`. La alternativa, TypeScript, queda fuera del pedido.
2. **Estilo. Aprobada.** `docs/STYLE.md` pide funciones sin clases. Nest exige clases y decoradores, así que el cliente se aparta de la guía y la guía lo avisa.
3. **Constitución. Aprobada.** Enmienda de los apartados 1 y 3.
4. **Socket. Aprobada.** Se acepta la revisión parcial y sin datos de campaña descrita arriba. Los niveles 2 y 3 y la cadena de Babel quedan sin revisar.
5. **Idioma de los errores.** Inglés, con los mismos mensajes que el cliente REST, y `docs/ERRORS.md` recoge esa excepción a la regla de traducir.
6. **Puerto.** 3003.
7. **Lógica.** `src/logic/` no cambia: `createUser` sigue recibiendo `name` y `email` por separado.
