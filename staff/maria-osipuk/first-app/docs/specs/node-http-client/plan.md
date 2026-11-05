Issue: #1116

# Plan del cliente node:http de usuarios documentado con Jupyter

## Enfoque

No hay funcionalidad nueva en `src/logic/`, ni consultas nuevas, ni cambios en `src/db/server.js`. `node:http` viene con Node. Los paquetes nuevos son solo los de las tablas de los cuadernos (ver Revisión con Socket). El patrón de servidor es el de `src/db/server.js` (`createServer`) y el de rutas y errores es el de `src/clients/http/app.js`, que ya resuelve los mismos detalles con Express.

Un único archivo, `src/clients/node-http/app.js`, crea y arranca el servidor. Importa de `src/logic/` y traduce entrada y salida, como pide [ARCHITECTURE.md](../../ARCHITECTURE.md). El SQL sigue pasando por el servidor de datos en `127.0.0.1:3000`. Este cliente escucha en `127.0.0.1:3004`: el 3001 es REST, el 3002 Chrome y el 3003 Nest.

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

Sin Express, todo lo que el framework hacía hay que escribirlo.

- **Rutas.** `new URL(request.url, ...)` separa la ruta. `/users` es crear y listar según el método. Un único segmento detrás de `/users/` es el id. Cualquier otra combinación responde `404` sin cuerpo.
- **Cuerpo.** Se junta el texto de la petición y se parsea al terminar. Un cuerpo vacío se trata como objeto vacío, para que la lógica responda que falta el nombre. Un JSON roto responde `400` con `Request JSON is invalid`; ese mensaje nace aquí porque el fallo ocurre antes de llegar a la lógica. Un cuerpo que es JSON válido pero no un objeto (por ejemplo `null`) también cae en el objeto vacío.
- **`createUser` recibe dos argumentos**, no un objeto.
- **El id llega como texto y la lógica exige un número.** Se convierte con `Number` y solo se usa el número si `String(number) === text`. Si no, pasa el texto y `src/logic/` lo rechaza. Así `1e3` no se convierte en silencio en `1000`.
- **`updateUser` mira si la clave existe** (`"name" in changes`). El cliente añade `name` y `email` a `changes` solo si no son `undefined`.
- **Respuestas.** Cada una fija el estado y `content-type: application/json` con `writeHead`. El `204` y el `404` terminan sin cuerpo.
- **`console`:** `import { error as logError, log } from "node:console"`, como `src/db/server.js`. `eslint.config.js` no cambia.
- **Arranque.** Escucha solo en `127.0.0.1`. Si el puerto está ocupado, el evento `error` del servidor escribe un aviso y deja `process.exitCode = 1`, como el cliente REST.

## Errores

El cliente devuelve el mensaje en inglés de `src/logic/`, sin traducirlo. Cada mensaje es una constante en mayúsculas al principio del archivo.

No hay funciones con nombre, como pide [STYLE.md](../../STYLE.md). El `catch` de cada ruta comprueba con `if` los mensajes que esa operación puede lanzar y responde con su estado. Lo que no reconoce responde `500` con el `Unable to` de esa ruta, así que nunca sale un texto desconocido. El borrado conserva `Unable to find user` cuando la lógica falla al buscar antes al usuario, como el cliente REST.

## Cuadernos

Siguen el cliente `node-http` de Ventura. Viven en `src/clients/node-http/jupyter/`, uno por operación: `create-user`, `list-users`, `find-user-by-id`, `update-user` y `delete-user`.

Cada cuaderno tiene dos celdas. La de texto, en español, lleva el título, qué hace, qué pasa en la base de datos, qué acción usa (método, ruta y cuerpo) y las anotaciones con los errores que puede dar y cómo se abre. La de código llama a `http://127.0.0.1:3004` y dibuja el resultado. Los textos de código van en inglés.

Los cuadernos **no importan `src/logic/`**. La celda de código es Python con el kernel `python3` del `.venv`: lanza `node --input-type=module` con un `fetch` a `ORIGIN` y dibuja con `cli-table3` y `@colors/colors`, que salen de `node_modules` de la app. Fuerza el color (`FORCE_COLOR=1`) porque la salida del proceso hijo no es un terminal. La tabla usa `head` y `style.head` `["cyan", "bold"]`.

- Un usuario es una fila con las columnas `id`, `name`, `email`, `createdAt` y `updatedAt`, en ese orden.
- Una lista es una fila por usuario. Una lista vacía deja los encabezados y la línea `No rows.`
- Si la llamada no devuelve datos (el borrado), la tabla tiene la columna `Result` y la fila `No data returned.`
- Si falla, se ve el `message` y no la tabla de datos.

Los datos de los cuadernos son los de la spec: Ada con `ada@example.com`; se modifica solo el nombre a Ada Lovelace; el id que no existe es `999999`. Los cuadernos se ejecutan con la lista vacía, y el de borrar borra a Ada. Las anotaciones de cada cuaderno son:

| Cuaderno          | Errores en las anotaciones                                                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create-user`     | `User name is required`, `User email is invalid`, `User email is already registered`, `Unable to create user`                                                              |
| `list-users`      | sin usuarios no hay filas; `Unable to list users`                                                                                                                          |
| `find-user-by-id` | `User id must be a positive integer`, `User does not exist`, `Unable to find user`                                                                                         |
| `update-user`     | `User id must be a positive integer`, `User name is required`, `User email is invalid`, `User email is already registered`, `User does not exist`, `Unable to update user` |
| `delete-user`     | `User id must be a positive integer`, `User does not exist`, `Unable to find user`, `Unable to delete user`                                                                |

Con el servidor de datos parado y este cliente abierto, cada cuaderno muestra el mensaje `Unable to` de su operación y no la tabla.

`scripts/jupyter-node-http.sh` copia `scripts/jupyter.sh` y solo cambia la carpeta que abre: `src/clients/node-http/jupyter`. Usa el mismo `.venv`, y `scripts/jupyter.sh` no cambia. `package.json` tiene el script `jupyter-node-http`: `sh scripts/jupyter-node-http.sh`.

Para ver la API: `pnpm start`, `pnpm run node-http` y `pnpm run jupyter-node-http`.

## Archivos

Se crean:

- `src/clients/node-http/app.js`
- `src/clients/node-http/jupyter/create-user.ipynb`
- `src/clients/node-http/jupyter/list-users.ipynb`
- `src/clients/node-http/jupyter/find-user-by-id.ipynb`
- `src/clients/node-http/jupyter/update-user.ipynb`
- `src/clients/node-http/jupyter/delete-user.ipynb`
- `scripts/jupyter-node-http.sh`
- `tests/node-http-client.test.js`: arranca el servidor de datos con una base temporal y lanza `app.js` como proceso hijo. Comprueba las cinco rutas y los errores de la spec, siguiendo `tests/http-client.test.js`.

Se modifican:

- `package.json`: scripts `node-http` (`node src/clients/node-http/app.js`) y `jupyter-node-http`; dependencias `cli-table3` `0.6.5` y `@colors/colors` `1.6.1`, ambas fijadas. `pnpm-lock.yaml` cambia con ellas.
- `README.md`: fila del cliente en la tabla, uso de los cuadernos y el puerto 3004 en el párrafo de `pnpm test`.
- `docs/ARCHITECTURE.md`: descripción de `src/clients/node-http/`: llama a `src/logic/`, usa `createServer` de `node:http`, escucha en el 3004, sus cuadernos se abren con `pnpm run jupyter-node-http` y no sustituye a `src/clients/http/`, a `src/clients/jupyter/` ni a `src/db/server.js`; más los archivos nuevos y los comandos de `package.json`.
- `docs/TREE.md`: los archivos nuevos y esta spec.
- `docs/ERRORS.md`: añadir este cliente a las excepciones de «Traducción en cada cliente» y un apartado propio.
- `docs/CONSTITUTION.md`: apartado 1, añadir el cliente `node:http` al alcance, y apartado 3, mencionar `node:http` y las dos tablas. Requiere la autorización de la enmienda (ver Decisiones).

`docs/STYLE.md`, `docs/DATABASE.md` y `.gitignore` no cambian. No se toca `src/clients/jupyter/` ni `scripts/jupyter.sh`.

## Verificación

1. `pnpm format`, `pnpm lint` y `pnpm test`.
2. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, `pnpm start` y `pnpm run node-http`. Recorrer las cinco rutas y los errores de la spec con `curl`.
3. Abrir `pnpm run jupyter-node-http` y ejecutar los cinco cuadernos con la base temporal y la lista vacía; después, con el servidor de datos parado, repetirlos y ver el mensaje sin tabla. Limpiar las salidas de los cuadernos antes de guardarlos.
4. Base compartida: un usuario creado por este cliente aparece en `pnpm run web`.
5. Comprobar que `./scripts/jupyter.sh` y los cuadernos de las acciones siguen igual.

## Revisión con Socket

- **Paquetes:** `cli-table3@0.6.5` y `@colors/colors@1.6.1`, con las versiones que ya usa el cliente de Ventura.
- **Alcance:** 8 paquetes en tres niveles de dependencias. Las dependencias salen del lockfile de ese cliente. Si `pnpm` resuelve otras versiones, hay que volver a revisarlas.

| Nivel | Paquetes                                                                            |
| ----- | ----------------------------------------------------------------------------------- |
| 0     | `cli-table3@0.6.5`, `@colors/colors@1.6.1`                                          |
| 1     | `string-width@4.2.3`, `@colors/colors@1.5.0` (dependencia opcional de `cli-table3`) |
| 2     | `emoji-regex@8.0.0`, `is-fullwidth-code-point@3.0.0`, `strip-ansi@6.0.1`            |
| 3     | `ansi-regex@5.0.1`                                                                  |

**Puntuaciones (`depscore`):** `license`, `vulnerability` y `supplyChain` valen 100 en los 8 paquetes. Ninguna puntuación está por debajo de 50. La más baja es `maintenance` 79 en `is-fullwidth-code-point@3.0.0`, y la más baja de `quality` es 74 en `strip-ansi@6.0.1`.

**Alertas (`alerts`):** la lista de alertas abiertas de la organización `aiai` está vacía, filtrada por `cli-table3` y por `@colors/colors`. Es la lista de la organización: no dice que esas versiones no tengan alertas. Las otras 6 dependencias no se filtraron por nombre.

**Campaña (`threat_feed`):** no se pudo revisar. La herramienta respondió `403 threat_feed_not_entitled` para `aiai`, de plan gratuito: «Threat feed is not enabled for this organization». Se llamó con `cli-table3@0.6.5`. La respuesta depende de la organización, así que tampoco hay dato de campaña para las demás.

**Alertas pendientes:** ninguna conocida. La persona responsable acepta la revisión sin datos de campaña.

## Decisiones

1. **Constitución:** se autoriza la enmienda de los apartados 1 y 3 para añadir el cliente `node:http` y las dos tablas.
2. **Socket:** se acepta la revisión sin datos de campaña, como en el cliente REST.
3. **Estilo de los cuadernos:** siguen el cliente de Ventura (Node con `fetch` y `cli-table3`, nombres en inglés), con los mensajes y estados de este proyecto.

No queda una pregunta abierta. Las tareas están en `tasks.md`.
