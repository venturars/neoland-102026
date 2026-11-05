Issue: #790

# Plan del cliente REST de usuarios

## Enfoque

No hay funcionalidad nueva en `src/logic/`, ni consultas nuevas, ni cambios en `src/db/server.js`. Hay un archivo nuevo de cliente y un paquete nuevo: `express@5.3.0`.

Un único archivo, `src/clients/http/app.js`, crea y arranca el servidor Express. Importa de `src/logic/` y traduce entrada y salida, como pide [ARCHITECTURE.md](../../ARCHITECTURE.md). El SQL sigue pasando por el servidor de datos en `127.0.0.1:3000`; este cliente escucha en `127.0.0.1:3001`.

## Entradas y salidas de la lógica

| Ruta                | Llamada                   | Éxito           |
| ------------------- | ------------------------- | --------------- |
| `POST /users`       | `createUser(name, email)` | `201` y usuario |
| `GET /users`        | `listUsers()`             | `200` y lista   |
| `GET /users/:id`    | `findUserById(id)`        | `200` y usuario |
| `PATCH /users/:id`  | `updateUser(id, changes)` | `200` y usuario |
| `DELETE /users/:id` | `deleteUser(id)`          | `204` vacío     |

No se importan `find-user-by-email.js` ni `count-users-by-gender.js`.

## Detalles que el cliente tiene que resolver

- **`createUser` recibe dos argumentos**, no un objeto.
- **El id llega como texto y la lógica exige un número.** Cada ruta con id lo convierte con `Number` y solo usa el número si `String(number) === text`. Si no, pasa el texto y `src/logic/` lo rechaza. Así `1e3` no se convierte en silencio en `1000` (apartado 4 de la constitución).
- **`updateUser` mira si la clave existe** (`"name" in changes`). El cliente añade `name` y `email` a `changes` solo si no son `undefined`.
- **Sin cuerpo, Express 5 deja `request.body` en `undefined`.** La ruta usa un objeto vacío en ese caso y la lógica responde que falta el nombre, en vez de un `TypeError` que acabaría en `500`.
- **Un JSON roto no llega a las rutas.** Sin un manejador de errores propio, Express responde con su página HTML y la traza. Un middleware de cuatro argumentos responde `400` con `Request JSON is invalid`.
- **`console`:** se usa `import { log } from "node:console"`, como en `src/db/server.js`. `eslint.config.js` no cambia.

## Errores

El cliente devuelve el mensaje en inglés de `src/logic/`, sin traducirlo. Cada mensaje es una constante en mayúsculas al principio del archivo.

No hay funciones con nombre, como pide [STYLE.md](../../STYLE.md). El `catch` de cada ruta comprueba con `if` los mensajes que esa operación puede lanzar y responde con su estado. Lo que no reconoce responde `500` con el `Unable to` de esa ruta, así que nunca sale un texto desconocido.

`Request JSON is invalid` es el único mensaje que nace en este cliente, porque ese fallo ocurre antes de llegar a la lógica.

## Archivos

Se crean:

- `src/clients/http/app.js`
- `tests/http-client.test.js`: arranca el servidor de datos con una base temporal y lanza `app.js` como proceso hijo. Comprueba las cinco rutas y los errores de la spec.

Se modifican:

- `package.json`: `express` fijado en `5.3.0` y el script `http` (`node src/clients/http/app.js`).
- `pnpm-lock.yaml`
- `README.md`: fila del cliente y uso con Postman.
- `docs/ARCHITECTURE.md`: reescribir la línea de `src/clients/http/`, que aún dice `node:http`; añadir el cliente a la frase de los clientes y el comando a `package.json`.
- `docs/TREE.md`: `src/clients/http/app.js`, `tests/http-client.test.js` y esta spec.
- `docs/ERRORS.md`: excepción a «Traducción en cada cliente» y apartado del cliente REST, que devuelve los mensajes en inglés.
- `docs/CONSTITUTION.md`: apartado 1, añadir el cliente REST al alcance, y apartado 3, añadir Express.

## Verificación

1. `pnpm format`, `pnpm lint` y `pnpm test`.
2. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, `pnpm start` y `pnpm run http`.
3. En Postman, los casos de la spec en orden. Después, parar el servidor de datos y repetir las cinco rutas.
4. Base compartida: un usuario creado en Postman aparece con `pnpm run web`.

## Revisión con Socket

- **Paquete:** `express@5.3.0`.
- **Alcance:** 54 paquetes en tres niveles de dependencias, con las versiones que resuelve un lockfile real para esa versión. Si `pnpm` resuelve otra versión, hay que volver a revisarla.
- **Sin revisar:** los 11 paquetes de los niveles 4 a 6 (`call-bound`, `get-intrinsic`, `call-bind-apply-helpers`, `es-object-atoms`, `function-bind`, `get-proto`, `gopd`, `has-symbols`, `hasown`, `math-intrinsics` y `dunder-proto`). Quedan fuera del alcance que pide `AGENTS.md`, pero se instalan.

| Nivel | Paquetes | `license` y `vulnerability` | `maintenance` más bajo                    | `quality` más bajo     | `supplyChain` más bajo                    |
| ----- | -------- | --------------------------- | ----------------------------------------- | ---------------------- | ----------------------------------------- |
| 0     | 1        | 100                         | 92, `express`                             | 100                    | 97, `express`                             |
| 1     | 28       | 100                         | 75, varios (`depd`, `etag`, `vary`...)    | 69, `cookie-signature` | 99, varios                                |
| 2     | 18       | 100                         | 53, `es-define-property` y `side-channel` | 66, `is-promise`       | 66, `es-define-property` y `side-channel` |
| 3     | 7        | 100                         | 50, `safer-buffer`                        | 78, `unpipe`           | 67, `safer-buffer`                        |

**Puntuaciones (`depscore`):** ninguna está por debajo de 50. La más baja es `maintenance` 50 en `safer-buffer@2.1.2`; 50 no baja.

**Campaña (`threat_feed`):** no se pudo revisar. La herramienta respondió `403 threat_feed_not_entitled` para la organización `aiai`, de plan gratuito: «Threat feed is not enabled for this organization». Se llamó solo con `express@5.3.0`; la respuesta depende de la organización y no del paquete, así que tampoco hay dato de campaña para las dependencias.

**Alertas (`alerts`):** la lista de alertas npm abiertas de `aiai` está vacía, también filtrada por `express`. Es la lista de la organización: no dice que estas versiones no tengan alertas.

**Alertas pendientes:** ninguna conocida. La persona responsable acepta la revisión sin datos de campaña.

## Decisiones

1. **Idioma de los errores:** inglés. El cliente devuelve los mensajes de `src/logic/` y `docs/ERRORS.md` recoge esa excepción a la regla de traducir.
2. **Alcance:** cinco operaciones. Se actualiza la issue #790, que pedía tres.
3. **Spec anterior:** `docs/specs/independent-web-http-clients/` queda corregida: el cliente con `node:http` se sustituye por este.
4. **Constitución:** se aprueba añadir el cliente REST y Express a los apartados 1 y 3.
5. **Socket:** se acepta la revisión sin datos de campaña.
6. **Estilo:** sin funciones con nombre en el cliente. La conversión del id y los errores se escriben dentro de cada ruta, así que `docs/STYLE.md` no necesita una excepción.
