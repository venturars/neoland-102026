# Plan — cliente node:http para usuarios

Issue: #1105.

## Cambio de alcance pendiente de aprobación

Se añade una sexta ruta, `GET /users/gender-count`, que solo tiene este cliente. Afecta a «Ficheros», «Llamadas», «Ruteo y cuerpo», «Errores», «Jupyter», «Cierre» y a la decisión 7. Hasta que se apruebe, no se implementa y `tasks.md` no cambia.

No es una funcionalidad nueva de negocio. No hay fichero nuevo en `src/logic/`, ni firma nueva, ni SQL nuevo. Es un cliente más: llama a las funciones que ya existen, igual que el cliente HTTP con Express.

## Ficheros

Se crea en la implementación:

- `src/clients/node-http/server.js`: el servidor con las cinco rutas, en un solo fichero.
- `src/clients/node-http/jupyter/`: carpeta con un cuaderno por ruta: `create-user.ipynb`, `list-users.ipynb`, `find-user-by-id.ipynb`, `update-user.ipynb`, `delete-user.ipynb` y `user-gender-count.ipynb`.
- `scripts/jupyter-node-http.sh`: script nuevo, copia de `scripts/jupyter.sh` que abre `src/clients/node-http/jupyter` en vez de `src/clients/jupyter`.

Se tocan en la implementación:

- `eslint.config.js`: declarar `console` como global también en `src/clients/node-http/`.
- `package.json`: scripts `node-http` y `jupyter-node-http` (`sh scripts/jupyter-node-http.sh`).
- `docs/STYLE.md`: añadir `src/clients/node-http/` a las excepciones de «una función por fichero».
- `docs/TREE.md` y `docs/ARCHITECTURE.md`: el cliente nuevo, su carpeta de cuadernos, sus scripts y su arranque.

`scripts/jupyter.sh` y `src/clients/jupyter/` no cambian.

No se tocan `src/logic/`, `src/queries/`, `src/db/` ni los otros clientes. No hay `pnpm-lock.yaml` que cambiar.

No se crea un `.txt` en `src/clients/terminal/`. Es el mismo criterio que el plan del cliente Express: un cliente no es una funcionalidad y la comprobación son las rutas con `curl` y los cuadernos.

## Paquetes

Ninguno nuevo. `node:http` viene con Node (`engines` `>=22`). `cli-table3` y `@colors/colors` ya están en `package.json` por los cuadernos de terminal. No hay validación Socket que hacer.

## Llamadas

No hay función nueva. Firmas reales de `src/logic/`:

| Ruta                | Llamada                           | Éxito |
| ------------------- | --------------------------------- | ----- |
| `GET /users`        | `listUsers()`                     | 200   |
| `GET /users/:id`    | `findUserById(id)`                | 200   |
| `POST /users`       | `createUser({ name, email })`     | 201   |
| `PATCH /users/:id`  | `updateUser({ id, name, email })` | 200   |
| `DELETE /users/:id` | `deleteUser(id)`                  | 204   |

Además, `GET /users/gender-count` llama a `usersGenderCount()` (`src/logic/user-gender-count.js`) y responde 200 con `{ woman, man, genderUndefined }`. Es la única ruta sin equivalente en el cliente Express.

El contrato es el del cliente HTTP actual (`src/clients/http/server.js`) y el de `docs/ERRORS.md`. DELETE correcto responde 204 sin cuerpo, como ahí.

## Puerto y arranque

Puerto 3004 en `127.0.0.1`. Ya están en uso el 3000 (base), el 3001 (Express), el 3002 (Fastify de Chrome) y el 3003 (Nest). Las constantes `HOST`, `ORIGIN` y `PORT` van como en el cliente Express. Al arrancar escribe `node-http server listening on http://127.0.0.1:3004` con `console.log`.

El script `node-http` de `package.json` copia el patrón de `http`: si nada escucha en `127.0.0.1:3000`, arranca `src/db/server.js` en segundo plano y lo para al salir; después arranca el servidor. El servidor no sabe nada de eso. Ni ese script ni `pnpm jupyter-node-http` arrancan Ollama: el conteo necesita que Ollama esté en marcha aparte.

## Ruteo y cuerpo

`node:http` no trae router ni lector de JSON. El servidor hace esto a mano:

- Compara primero la ruta literal `GET /users/gender-count`, antes que la de `:id`. Si no, `gender-count` se tomaría como id y respondería `Id is invalid`.
- Compara método y ruta. Una ruta que no existe, o un método que esa ruta no admite, responde 404 sin cuerpo.
- Lee el cuerpo de la petición acumulando sus trozos y lo convierte con `JSON.parse`. Si el JSON está mal formado, si `POST` o `PATCH` llegan sin cuerpo, o si el cuerpo no es un objeto, lanza `ValidationError("Body is invalid")` antes de llamar a la lógica.
- Convierte `:id` con la misma regla del cliente Express: solo dígitos, sin ceros a la izquierda, entero seguro. Si no vale, `ValidationError("Id is invalid")`.
- Responde siempre con `Content-Type: application/json` salvo el 204.

## Errores

Una sola captura alrededor del despacho de la ruta. Asigna el estado por la clase del error:

| Clase             | Estado | Cuerpo                                            |
| ----------------- | ------ | ------------------------------------------------- |
| `ValidationError` | 400    | `{ message }`                                     |
| `NotFoundError`   | 404    | `{ message }`                                     |
| `ConflictError`   | 409    | `{ message }`                                     |
| `DatabaseError`   | 500    | `{ message }`                                     |
| Cualquier otro    | 500    | `{ message: "Could not ..." }` según método y ruta |

El cuerpo usa la clave `message`, como `docs/ERRORS.md` y el cliente HTTP actual. El plan del cliente Express escribe `error` y proponía `Internal error`; el código actual y `docs/ERRORS.md` no lo hacen, así que este plan sigue el código y la guía. Ver «Decisiones».

`usersGenderCount()` lanza `DatabaseError` si Ollama no responde (error de conexión). Entonces el servidor responde 500 con `Could not classify the users`. Si Ollama responde pero el modelo `llama3.2` no está descargado, no hay error: cada lote se descarta y todos los usuarios cuentan como `genderUndefined`. Por eso el cierre comprueba el conteo con el modelo descargado.

Los mensajes `Could not ...` salen del mismo mapeo método y ruta que usa el cliente Express: listar, ver, crear, actualizar y borrar.

## Jupyter

Un cuaderno por ruta, en `src/clients/node-http/jupyter/`. Cada uno tiene dos celdas, como los cuadernos de `src/clients/jupyter/`:

1. Celda de texto con: título, «Qué hace», «Qué pasa en la base de datos», «Qué acción usa» (método y ruta) y «Anotaciones» (los fallos).
2. Celda de código Python que lanza `node --input-type=module -e` con el programa de Node. Pone `FORCE_COLOR=1` en el entorno para que la tabla salga con colores, y quita `NO_COLOR`. Si Node falla, imprime también la salida de error.

El programa de Node hace `fetch` a `http://127.0.0.1:3004`. Pinta la respuesta con `cli-table3`, con las columnas `id`, `name`, `email`, `createdAt` y `updatedAt`, y el encabezado `["cyan", "bold"]`. Si la respuesta es un error, imprime `message`. Si no hay cuerpo (borrado, 204), imprime solo el estado.

Los cuadernos de buscar, modificar y borrar necesitan el id de Ada. La celda lo busca en `GET /users` por `ada@example.com`. Si Ada no está, no hay id: la petición va a `/users/undefined` y se ve `Id is invalid`.

| Cuaderno                | Petición                                                                                  | Fallos en «Anotaciones»                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `create-user.ipynb`     | `POST /users` con `{ name: "Ada", email: "ada@example.com" }`                              | `Name is empty`, `Email is invalid`, `Email is already used` (si se ejecuta dos veces), `Could not create the user`                                                      |
| `list-users.ipynb`      | `GET /users`                                                                              | `Could not list the users`. Sin usuarios, la tabla deja los encabezados y la línea `No hay filas.`.                                                                                                      |
| `find-user-by-id.ipynb` | `GET /users/:id` con el id de Ada                                                         | `User not found`, `Could not find the user`                                                                                                                             |
| `update-user.ipynb`     | `PATCH /users/:id` con el id de Ada y `{ name: "Ada Lovelace", email: "ada@example.com" }` | `Id is invalid`, `Name is empty`, `Email is invalid`, `User not found`, `Email is already used`, `Could not update the user`                                             |
| `delete-user.ipynb`     | `DELETE /users/:id` con el id de Ada                                                      | `User not found`, `Could not delete the user`. Responde 204 sin cuerpo.                                                                                                |

El cuaderno `user-gender-count.ipynb` hace `GET /users/gender-count`. Su fallo es `Could not classify the users` si Ollama no responde. Sin usuarios, muestra 0, 0 y 0 sin llamar a Ollama. Necesita Ollama en marcha.

Los cuadernos se abren con `pnpm jupyter-node-http` desde `first-app`. Ese script abre la carpeta con `scripts/jupyter-node-http.sh`, que es la misma lógica de `scripts/jupyter.sh` con otra carpeta. Crea `.venv` y instala `notebook==7.6.3` si hace falta. `pnpm jupyter` abre `src/clients/jupyter/` y no muestra estos cuadernos.

Si la lista está vacía, la tabla deja los encabezados y la línea `No hay filas.`. Si la operación no devuelve cuerpo, se ve solo el estado.

## Cierre de la implementación

- Formatear `src/clients/node-http/server.js` con Prettier. No se ejecuta `pnpm run format` completo, porque reformatea otros clientes.
- `pnpm run lint`.
- Con `pnpm server` y `pnpm node-http` en marcha, las cinco rutas con `curl` responden como en la tabla, y `GET /users/gender-count` responde 200 con Ollama en marcha y el modelo `llama3.2` descargado.
- Con `pnpm jupyter-node-http` abierto, los seis cuadernos se ejecutan en orden (crear, listar, ver, modificar, borrar, contar) sin errores, con Ollama en marcha.
- Con Ollama parado, `GET /users/gender-count` responde 500 con `Could not classify the users`.

## Decisiones

1. Mismo contrato que el cliente HTTP actual: rutas, estados, `{ message }`, DELETE 204 y 404 sin cuerpo. Es la única forma de que la comparación de la spec tenga sentido.
2. Puerto 3004, el siguiente libre del proyecto.
3. Sin `Internal error`: se sigue `docs/ERRORS.md`.
4. Los cuadernos viven en `src/clients/node-http/jupyter/`, uno por operación. El script `jupyter-node-http` es nuevo y copia la lógica de `scripts/jupyter.sh`, que no se modifica (corrección de la revisión).
5. Un solo `server.js` con varias funciones, y `docs/STYLE.md` lo añade a las excepciones.
6. Las celdas de código son Python que lanzan `node --input-type=module`, con tabla de `cli-table3` como los cuadernos de terminal. No se añade ningún paquete.
7. La sexta ruta, `GET /users/gender-count`, es solo de `node-http`. Por eso la frase de la spec «Quien llame a los dos clientes no nota diferencia» vale solo para las cinco rutas comunes. Añadirla al cliente Express queda fuera de alcance y se decide aparte. El cuaderno se llama `user-gender-count.ipynb`, como en `src/clients/jupyter/`.

## Preguntas

Las tres preguntas están respondidas. Con eso, `tasks.md` está escrito y la implementación empieza cuando lo pidas.

**1. ¿Dónde va el cuaderno?** Respondida: en una carpeta `jupyter/` dentro de `src/clients/node-http/`, con un cuaderno por operación y un script nuevo `jupyter-node-http`.

**2. ¿En qué lenguaje están las celdas que llaman a la API?** Respondida: variante d, celdas de Python que lanzan `node --input-type=module`, como los cuadernos existentes.

**3. ¿Cuántos ficheros lleva el servidor?** Respondida: un solo `server.js`, y se añade a las excepciones de `docs/STYLE.md`.
