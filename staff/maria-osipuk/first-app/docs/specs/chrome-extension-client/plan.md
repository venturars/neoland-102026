Issue: #1001

# Plan del cliente de extensión de Chrome

## Enfoque

No hay funcionalidad nueva en `src/logic/`, ni consultas nuevas, ni cambios en `src/db/server.js`, `src/clients/web/` o `src/clients/http/`. Hay una carpeta nueva de cliente, `src/clients/chrome/`, con dos partes:

- **La API**, `api.js`: un proceso Node con Fastify que escucha en `127.0.0.1:3002`, importa de `src/logic/` y traduce entrada y salida. Se arranca con `pnpm run chrome`.
- **La extensión**, Manifest V3: `manifest.json`, `popup.html`, `popup.js` y `styles.css`. Solo habla con esa API, con `fetch`. No importa `src/logic/` ni otro cliente.

El recorrido es extensión → API → lógica → consultas → servidor de datos → SQLite.

## Por qué hace falta una API

El cliente web importa `src/logic/` directamente. La extensión no puede hacerlo, por dos motivos:

- Chrome solo sirve los archivos que están dentro de la carpeta cargada como extensión, así que `../../logic/` no existe para ella.
- Cargar `src/` como extensión lo resolvería, pero mezclaría todos los clientes en ella. Además, Chrome rechaza los nombres que empiezan por `_`, y `src/clients/jupyter/__pycache__/` existe en local. Un cambio en otro cliente podría romper este.

Tampoco se usa el cliente REST del puerto 3001: la extensión dependería de otro cliente, y eso va contra el apartado 1 de la constitución. Por eso el cliente tiene su propia API, que también se quita al quitar la carpeta.

## Entradas y salidas de la lógica

| Acción de la extensión | Ruta                | Llamada                   | Éxito           |
| ---------------------- | ------------------- | ------------------------- | --------------- |
| Crear                  | `POST /users`       | `createUser(name, email)` | `201` y usuario |
| Abrir la lista         | `GET /users`        | `listUsers()`             | `200` y lista   |
| Elegir un usuario      | `GET /users/:id`    | `findUserById(id)`        | `200` y usuario |
| Guardar                | `PATCH /users/:id`  | `updateUser(id, changes)` | `200` y usuario |
| Confirmar el borrado   | `DELETE /users/:id` | `deleteUser(id)`          | `204` vacío     |

No se importan `find-user-by-email.js` ni `count-users-by-gender.js`. Una ruta desconocida responde `404` vacío.

## Detalles que la API tiene que resolver

Los comportamientos de Fastify de este apartado se comprobaron con `fastify@5.12.8` en una carpeta temporal, fuera de la app.

- **`createUser` recibe dos argumentos**, no un objeto.
- **El id llega como texto y la lógica exige un número.** Cada ruta lo convierte con `Number` y solo usa el número si `String(number) === text`. Si no, pasa el texto y `src/logic/` lo rechaza. Así `1e3` no se convierte en silencio en `1000`.
- **`updateUser` mira si la clave existe.** La API añade `name` y `email` a `changes` solo si no son `undefined`.
- **Un cuerpo `null` llega a la ruta.** Fastify acepta el JSON `null` y deja `request.body` en `null`, y sin cuerpo lo deja en `undefined`. En los dos casos la ruta usa un objeto vacío, para que `src/logic/` responda en vez de un `TypeError`.
- **Un JSON roto o vacío no llega a la ruta.** Fastify responde `400` con su propio texto técnico. `setErrorHandler` lo sustituye por `400` y `Request JSON is invalid`. Las rutas capturan sus errores, así que a ese manejador solo llegan los fallos de lectura de la petición.
- **Una ruta desconocida** responde JSON con su propio texto. `setNotFoundHandler` la deja en `404` vacío.
- **`text/plain` sí llega a la ruta.** Fastify lo acepta como texto, así que `request.body` es una cadena y `body.name` es `undefined`: `src/logic/` lo rechaza y no se crea nadie. La prueba lo comprueba.
- **Sin CORS.** La API no envía cabeceras CORS y `OPTIONS` responde `404`, así que Chrome bloquea a cualquier página web. La extensión pasa porque `host_permissions` declara esa dirección. No hace falta `@fastify/cors`.
- **`console`:** se usa `import { log } from "node:console"`, como en los otros servidores.

## Detalles de la extensión

- **Manifest V3.** La acción abre `popup.html`. `host_permissions` es solo `http://127.0.0.1:3002/*`. Sin `permissions`, sin content scripts y sin service worker.
- **Sin scripts en línea.** La política de seguridad de Manifest V3 los bloquea, así que el código solo está en `popup.js`.
- **`DELETE` y las lecturas no envían `content-type`.** Con `application/json` y sin cuerpo, Fastify responde `400`. Solo `POST` y `PATCH` lo envían.
- **Guardar envía `name` y `email`.** El formulario llega relleno, y `src/logic/` admite que un usuario conserve su propio email.
- **El borrado se confirma con botones de la página**, no con `window.confirm`: un diálogo nativo puede quitar el foco a la ventana y Chrome la cierra al perderlo.
- **Lo que se escribe en la página usa `textContent`**, porque un nombre guardado puede tener caracteres HTML.
- **La selección se guarda en memoria.** Al cerrarse la ventana se pierde y se vuelve a la lista.

## Errores

La API responde el mensaje en inglés de `src/logic/` en la clave `message`, sin traducirlo. No hay funciones con nombre en `api.js`: el `catch` de cada ruta comprueba con `if` los mensajes que esa operación puede lanzar. Lo que no reconoce responde `500` con el `Unable to` de esa ruta.

| Mensaje                              | Estado |
| ------------------------------------ | ------ |
| `User id must be a positive integer` | `400`  |
| `User name is required`              | `400`  |
| `User email is invalid`              | `400`  |
| `Request JSON is invalid`            | `400`  |
| `User does not exist`                | `404`  |
| `User email is already registered`   | `409`  |
| `Unable to ...` de cada ruta         | `500`  |

`popup.js` muestra ese `message` tal cual, sin tabla de traducción. Es una excepción a «Traducción en cada cliente» de [ERRORS.md](../../ERRORS.md), como la del cliente REST. Nacen en `popup.js` dos mensajes, porque esos fallos no llegan a `src/logic/`: `Unable to reach the API` si `fetch` falla porque la API está parada, y `Unable to complete the operation` si una respuesta de error no trae `message`.

## Archivos

Se crean:

- `src/clients/chrome/api.js`
- `src/clients/chrome/manifest.json`
- `src/clients/chrome/popup.html`
- `src/clients/chrome/popup.js`
- `src/clients/chrome/styles.css`
- `tests/chrome-client.test.js`: arranca el servidor de datos con una base temporal y lanza `api.js` como proceso hijo, como `tests/http-client.test.js`. Comprueba las cinco rutas, los errores, el JSON roto, el cuerpo `null`, `text/plain`, la ruta desconocida, la ausencia de CORS, los `500` con el servidor de datos parado y que `host_permissions` solo tenga la dirección de la API.

Se modifican:

- `package.json`: `fastify` fijado en `5.12.8` y el script `chrome` (`node src/clients/chrome/api.js`).
- `pnpm-lock.yaml`
- `eslint.config.js`: un bloque para `src/clients/chrome/popup.js` con `document` y `fetch`.
- `README.md`: fila del cliente, cómo cargar la extensión y que las pruebas usan también el puerto `3002`.
- `docs/ARCHITECTURE.md`: apartado del cliente, frase de los clientes, comando en `package.json` y descripción de `eslint.config.js`.
- `docs/TREE.md`: `src/clients/chrome/`, la prueba y esta spec.
- `docs/ERRORS.md`: excepción a «Traducción en cada cliente» y apartado del cliente de Chrome, que muestra los mensajes en inglés.
- `docs/STYLE.md`: dos excepciones. `popup.js` reúne las funciones de su cliente en un archivo, como `src/clients/web/app.js`, y tiene un único envoltorio de `fetch` hacia su API.

`docs/CONSTITUTION.md` ya incluye este cliente en los apartados 1 y 3: se modificó a petición de la persona responsable, antes de implementar.

No cambian `src/logic/`, `src/queries/`, `src/db/` ni los demás clientes.

## Verificación

1. `pnpm exec prettier --write` sobre los archivos de esta tarea, `pnpm lint` y `pnpm test`, con `pnpm start`, `pnpm run http` y `pnpm run chrome` parados.
2. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, `pnpm start` y `pnpm run chrome`.
3. Cargar `src/clients/chrome/` en `chrome://extensions` y recorrer en Chrome los casos de la spec. Esta parte es manual: `popup.js` no tiene prueba automática.
4. Parar el servidor de datos y repetir las acciones. Después parar la API y abrir la extensión.
5. Base compartida: con `pnpm run web` y `pnpm run http`, sobre la misma base temporal.

## Revisión con Socket

- **Paquete:** `fastify@5.12.8`, publicado el 2 de noviembre de 2026.
- **Alcance:** 48 paquetes en tres niveles de dependencias, los que resuelve pnpm 10.34.7 en un lockfile aparte. Ningún paquete queda por debajo del nivel 3. Si en la app `pnpm` resuelve otra versión, hay que volver a revisarla.

| Nivel | Paquetes | `license` y `vulnerability` | `maintenance` más bajo                                                          | `quality` más bajo        | `supplyChain` más bajo                                                         |
| ----- | -------- | --------------------------- | ------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------ |
| 0     | 1        | 100                         | 97, `fastify`                                                                   | 100                       | 98, `fastify`                                                                  |
| 1     | 15       | 100                         | 75, `abstract-logging`                                                          | 77, `abstract-logging`    | 98, `pino`                                                                     |
| 2     | 24       | 100                         | 75, `atomic-sleep`, `fast-deep-equal` y `quick-format-unescaped`                | 75, `real-require`        | 99, `ajv`, `ajv-formats`, `fast-querystring`, `real-require` y `thread-stream` |
| 3     | 8        | 100                         | 75, `fast-decode-uri-component`, `json-schema-traverse` y `require-from-string` | 80, `require-from-string` | 100                                                                            |

**Puntuaciones (`depscore`):** se pidieron las 48 versiones exactas y respondieron todas. Ninguna está por debajo de 50. La más baja es 75.

**Campaña (`threat_feed`):** no se pudo revisar. La herramienta respondió `403 threat_feed_not_entitled` para la organización `aiai`: «Threat feed is not enabled for this organization». Se llamó solo con `fastify@5.12.8`; la respuesta es de la organización, así que los demás paquetes quedan igual de sin revisar.

**Alertas (`alerts`):** la lista de alertas npm abiertas de `aiai` está vacía. Es la lista de la organización: no dice que estas versiones no tengan alertas.

**Alertas pendientes:** ninguna conocida. La persona responsable acepta la revisión sin datos de campaña.

## Decisiones

1. **Framework:** Fastify, aunque Express ya está instalado y evitaría 48 paquetes. Aporta aprender un segundo framework, y quitar el cliente REST no afecta a la dependencia de este cliente.
2. **Idioma de los errores:** inglés, siempre. La extensión muestra los mensajes de `src/logic/` sin traducirlos. Los textos de la pantalla siguen en español.
3. **Constitución:** se aprueba y ya está aplicado añadir el cliente a los apartados 1 y 3.
4. **Socket:** se acepta la revisión sin datos de campaña, porque la cuenta no tiene `threat_feed`.
