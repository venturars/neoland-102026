# Plan — cliente HTTP

Cumple `docs/specs/http-client/spec.md`.

No hay operación nueva ni SQL nuevo. Crear, actualizar, eliminar, listar y buscar siguen en la lógica que ya existe. Contar el género no entra. Crear la tabla no se pide aparte.

## Ficheros

Se crea un solo fichero: `src/clients/http/app.js`. Las siete peticiones viven ahí. No hay un fichero por consulta.

Se toca `package.json`. El script `http` queda `node src/clients/http/app.js`. Se lanza con `pnpm http` desde `first-app`. El script `format` también escribe `src/clients/http/**/*.js`.

pnpm añade `express` `5.3.0`. `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano. No se usa npm ni yarn.

No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter` ni `src/clients/browser`.

En el mismo cambio que el código se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/DATABASE.md` no cambia: la base sigue igual.

## Validación Socket

El MCP `socket-mcp` no está disponible en esta sesión. No se ha podido mirar campaña, alerta ni stats.

Eso no es ausencia de avisos. Queda sin comprobar, en la capa 0:

- `express` `5.3.0`

Pide Node `>= 18`. Sus dependencias, hasta 3 capas, tampoco se han comprobado. Entre las directas están `body-parser`, `router`, `send`, `serve-static`, `qs`, `cookie` y `debug`. No hay alertas que comentar, porque la comprobación no se ha podido hacer. Quien acepta el plan decide si sigue sin esa comprobación.

## Firma

No hay función de negocio nueva. `app.js` registra las siete rutas y llama a la función que ya existe:

| Petición | Llamada |
| --- | --- |
| `POST /users` | `createUser({ name, email })` |
| `PATCH /users/:id` | `updateUser(id, changes)` |
| `DELETE /users/:id` | `deleteUser(id)` |
| `GET /users` | `listUsers()` |
| `GET /users/:id` | `findUserById(id)` |
| `GET /users/email/:email` | `findUserByEmail(email)` |
| `GET /users/name/:name` | `findUserByName(name)` |

`GET /users/email/:email` y `GET /users/name/:name` se registran antes de `GET /users/:id`. Si no, `email` y `name` se leerían como un id.

El cuerpo de crear es JSON con `name` y `email`. El de actualizar es JSON con `name`, con `email` o con los dos. Si un campo no llega, no entra en `changes`. El id, el email y el nombre de la ruta llegan como texto. La lógica ya acepta un id en texto. Postman codifica el email y el nombre en la ruta.

## SQL

No hay SQL nuevo. Cada ruta usa la operación que ya está escrita.

## Cliente

`app.js` crea la aplicación con Express, lee JSON y registra las siete rutas. La constante `ORIGIN` vale `http://127.0.0.1:3001`. Escucha en el puerto y el host de `ORIGIN`. Al escuchar, hace `console.log` de `ORIGIN`.

No valida, no escribe SQL y no abre la base. No llama a `/execute`. No importa `usersGender`.

Si la ruta no existe, responde 404 sin cuerpo.

Si el cuerpo no es JSON, responde 400 con `{ "message": texto }`. El texto es el de ese error.

Si la función termina, la respuesta es JSON, salvo al eliminar:

- Crear responde 201 con `{ id, name, email }`.
- Listar responde 200 con la lista. Si no hay ninguno, `[]`.
- Buscar por id o por email responde 200 con `{ id, name, email }`.
- Buscar por nombre responde 200 con ese usuario si hay uno, o con la lista si hay varios.
- Actualizar responde 200 con lo que devuelve `updateUser`: el `id` y solo los campos enviados.
- Eliminar responde 204 sin cuerpo. `deleteUser` no devuelve el usuario. Esa respuesta vacía es la señal de que ya no está.

Si la función lanza un `Error`, el cuerpo es `{ "message": texto }` y el texto no se cambia:

- `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `User id must be a positive integer` y `Provide a name or an email to update` responden 400.
- Un mensaje que termina en `was not found` responde 404.
- Un mensaje que contiene `UNIQUE constraint` responde 409. El email repetido sigue saliendo con el texto de SQLite.
- Cualquier otro `Error` responde 500 con ese texto. Si el programa de consultas no está en marcha, se ve el fallo de esa llamada.

## Documentación

`docs/ARCHITECTURE.md` gana el cliente HTTP: otra forma de pedir crear, actualizar, eliminar, listar y buscar, desde Postman. Responde en `127.0.0.1:3001`. Importa la lógica. No cuenta el género. Con `pnpm server` y `pnpm http` en marcha, Postman llama a esas peticiones. Terminal, Jupyter y las pantallas siguen igual.

`docs/TREE.md` añade `clients/http/app.js`.

`docs/STYLE.md` dice que el cliente HTTP es un solo fichero, `src/clients/http/app.js`, y que solo llama a `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. No valida, no escribe SQL y no abre la base. Esta es la excepción a un archivo por acción.

`docs/ERRORS.md` añade que, si este cliente no está en marcha, Postman no completa la petición.

`docs/CONSTITUTIONS.MD` cuenta el cliente HTTP y `pnpm http`. El desarrollo abierto pasa a ser `docs/specs/http-client/`.

`AGENTS.MD` deja la regla: el cliente vive en un solo fichero, `src/clients/http/app.js`. Ese fichero importa `createUser`, `updateUser`, `deleteUser`, `listUsers`, `findUserById`, `findUserByEmail` y `findUserByName`. Se arranca con `pnpm http` desde `first-app` y escucha en `127.0.0.1:3001`. Express queda en `5.3.0`.

## Pregunta

La constitución y `AGENTS.MD` dicen que no se añade otro framework, que el servidor es `src/db/server.js` y que los clientes son la terminal, Jupyter y el navegador.

La spec pide un cliente en `127.0.0.1:3001`, una petición por consulta de usuarios, sin cambiar la lógica ni la base. No nombra Express. El encargo sí: Express es un framework y un paquete nuevo. La spec se puede cumplir con `node:http`, que ya usa el programa de consultas, y entonces no entra Socket.

Además, la spec dice que actualizar muestra el usuario guardado con `id`, `name` y `email`. El código de `updateUser` devuelve el `id` y solo los campos enviados. Este plan no cambia esa función: la respuesta de `PATCH` es ese resultado.

¿Se actualizan la constitución y las guías para permitir este cliente con Express `5.3.0`, y la respuesta de actualizar se queda en lo que ya devuelve la función? Hasta esa respuesta no hay `tasks.md`.
