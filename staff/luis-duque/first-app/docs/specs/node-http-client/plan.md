# Plan — cliente HTTP de Node documentado con Jupyter

Cumple `docs/specs/node-http-client/spec.md`.

No hay operación nueva ni SQL nuevo. Listar, crear, modificar, eliminar y buscar por id siguen en la lógica que ya existe. Buscar por email, por nombre y contar el género no entran. Crear la tabla no se pide aparte. No hay mensaje nuevo.

No hay paquete de Node nuevo ni cambio de versión. `node:http` ya viene con Node y ya lo usa `src/db/server.js`. `cli-table3` `0.6.5` y `@colors/colors` `1.6.1` ya están. `notebook` `7.6.3` ya está en el `.venv` de la app. No entra Socket.

Este cliente no es un framework. Express `5.3.0`, Electron `45.2.3`, Fastify `5.12.8` y NestJS `12.3.3` se quedan como las excepciones ya aceptadas.

## Ficheros

Se crea `src/clients/node-http/app.js`. Las cinco peticiones viven ahí. No hay un fichero por consulta.

Se crea `src/clients/node-http/jupyter/` con un documento por operación, el mismo nombre que el Jupyter de ahora para esas cinco:

- `create-user.ipynb`
- `list-users.ipynb`
- `find-user-by-id.ipynb`
- `update-user.ipynb`
- `delete-user.ipynb`

Esos documentos piden este cliente por HTTP. No importan `src/logic`. No se toca `src/clients/jupyter`.

Se crea `scripts/jupyter-node-http.sh`. Copia `scripts/jupyter.sh`. Solo cambia la carpeta que abre: `src/clients/node-http/jupyter`. Reutiliza el mismo `.venv` y `notebook` `7.6.3`. `scripts/jupyter.sh` no cambia.

Se toca `package.json`. El script `node-http` queda `node src/clients/node-http/app.js`. El script `jupyter-node-http` queda `sh scripts/jupyter-node-http.sh`. Se lanzan con `pnpm node-http` y `pnpm jupyter-node-http` desde `first-app`. El script `jupyter` se queda. El script `format` también escribe `src/clients/node-http/**/*.js`. Las peticiones `.ipynb` no las formatea Prettier. No se tocan `dependencies` ni `devDependencies`. `pnpm-lock.yaml` no cambia. No se usa npm ni yarn.

No se toca `eslint.config.js`: ya analiza `**/*.js` y este `app.js` no lleva decoradores.

No se toca el `.gitignore` de la raíz. No se crea un `README`. No se crea `scripts/run-node-http.js`.

No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter`, `src/clients/browser`, `src/clients/http`, `src/clients/electron`, `src/clients/chrome`, `src/clients/vscode` ni `src/clients/nest`.

En el mismo cambio se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/DATABASE.md` no cambia: la base sigue igual.

## Firma

No hay función de negocio nueva. `app.js` importa cinco funciones que ya existen:

| Petición | Llamada |
| --- | --- |
| `POST /users` | `createUser({ name, email })` |
| `GET /users` | `listUsers()` |
| `GET /users/:id` | `findUserById(id)` |
| `PATCH /users/:id` | `updateUser(id, changes)` |
| `DELETE /users/:id` | `deleteUser(id)` |

No hay búsqueda por email ni por nombre. No se importa `usersGender`.

El cuerpo de crear es JSON con `name` y `email`. El de modificar es JSON con `name`, con `email` o con los dos. Si un campo no llega, no entra en `changes`. El id de la ruta llega como texto. La lógica ya acepta un id en texto.

## SQL

No hay SQL nuevo. Cada petición usa la operación que ya está escrita.

## Cliente

`app.js` crea el servidor con `createServer` de `node:http`, como `src/db/server.js`. La constante `ORIGIN` vale `http://127.0.0.1:3004`. Escucha en el puerto y el host de `ORIGIN`. Al escuchar, hace `console.log` de `ORIGIN`.

Parte la ruta con `URL`, como `src/db/server.js`. Lee el cuerpo de `POST` y `PATCH` juntando el texto y haciendo `JSON.parse`, como ese programa. No usa Express. No usa Fastify. No usa Nest.

No valida, no escribe SQL y no abre la base. No llama a `/execute`.

Si la función termina, la respuesta es JSON, salvo al eliminar:

- Crear responde 201 con `{ id, name, email }`.
- Listar responde 200 con la lista. Si no hay ninguno, `[]`.
- Buscar por id responde 200 con `{ id, name, email }`.
- Modificar responde 200 con lo que devuelve `updateUser`: el `id` y solo los campos enviados.
- Eliminar responde 204 sin cuerpo. `deleteUser` no devuelve el usuario. Esa respuesta vacía es la señal de que ya no está.

Si la ruta no existe, o el método no es el de esa ruta, responde 404 sin cuerpo.

Si el cuerpo no es JSON, responde 400 con `{ "message": texto }`. El texto es el de ese error.

Si la función lanza un `Error`, el cuerpo es `{ "message": texto }` y el texto no se cambia:

- `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `User id must be a positive integer` y `Provide a name or an email to update` responden 400.
- Un mensaje que termina en `was not found` responde 404.
- Un mensaje que contiene `UNIQUE constraint` responde 409. El email repetido sigue saliendo con el texto de SQLite.
- Cualquier otro `Error` responde 500 con ese texto. Si el programa de consultas no está en marcha, se ve el fallo de esa llamada.

## Documentos Jupyter

Cada documento tiene un título, dice qué hace esa operación y deja un bloque preparado. Quien lo abre ejecuta el bloque. No escribe el bloque.

El bloque no importa la lógica. Llama a `ORIGIN` con `fetch`, desde `node --input-type=module -e`, y dibuja con `cli-table3`. La tabla usa `head` `["id", "name", "email"]` y `style.head` `["cyan", "bold"]`. Si hay un usuario, una fila. Si hay una lista, una fila por usuario. Si la lista está vacía, la tabla sale sin filas. Si falla, se ve el `message` y no la tabla. Al eliminar, si responde 204, la tabla sale sin filas.

Busca la aplicación subiendo de carpeta hasta encontrar `src/logic`. Si no aparece, se ve `No encuentro la app.` En Windows la salida de Node se lee en UTF-8. `FORCE_COLOR` queda en `1`.

Si este cliente no está en marcha, la llamada no se completa y se ve el fallo de esa llamada.

Con la lista vacía, el recorrido de la spec:

- `create-user` es `POST /users` con Ada y ada@example.com.
- `list-users` es `GET /users`.
- `find-user-by-id` es `GET /users/:id` con el id de Ada.
- `update-user` es `PATCH /users/:id` solo con el nombre Ada Lovelace.
- `delete-user` es `DELETE /users/:id` con el id de Ada.

El id de Ada se deja escrito en el bloque de buscar, modificar y eliminar, como el Jupyter de ahora deja el id en el bloque.

## Documentación

`docs/ARCHITECTURE.md` gana este cliente: otra forma de listar, crear, modificar, eliminar y buscar por id, con el HTTP de Node, documentada con Jupyter. Responde en `127.0.0.1:3004`. Llama a la lógica. No busca por email ni por nombre. No cuenta el género. Se arranca con `pnpm node-http` desde `first-app`, con el programa de consultas en marcha. Los documentos se abren con `pnpm jupyter-node-http`. `pnpm jupyter` sigue abriendo `src/clients/jupyter`. La terminal, Jupyter, las pantallas, la ventana, el popup de Chrome, la vista de Visual Studio Code, el cliente HTTP, Bruno y NestJS siguen igual.

`docs/TREE.md` añade `clients/node-http/` con `app.js` y `jupyter/`. Añade `scripts/jupyter-node-http.sh`.

`docs/STYLE.md` deja este cliente en un solo fichero, `src/clients/node-http/app.js`. Llama a `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`. No llama a `findUserByEmail`, `findUserByName` ni a `usersGender`. No valida, no escribe SQL y no abre la base. Los documentos viven en `src/clients/node-http/jupyter`. Se arranca con `pnpm node-http`. Los documentos se abren con `pnpm jupyter-node-http`.

`docs/ERRORS.md` añade que, si este cliente no está en marcha, los documentos de `pnpm jupyter-node-http` no completan la petición. Si el programa de consultas no está en marcha, se ve el fallo de esa llamada.

`docs/CONSTITUTIONS.MD` cuenta este cliente, `pnpm node-http`, `pnpm jupyter-node-http` y `127.0.0.1:3004`. El desarrollo abierto pasa a ser `docs/specs/node-http-client/`.

`AGENTS.MD` deja la regla: el cliente vive en un solo fichero, `src/clients/node-http/app.js`. Ese fichero importa `listUsers`, `createUser`, `updateUser`, `deleteUser` y `findUserById`. No importa `usersGender`, `findUserByEmail` ni `findUserByName`. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm node-http` desde `first-app` y escucha en `127.0.0.1:3004`. Los documentos viven en `src/clients/node-http/jupyter`. Se abren con `pnpm jupyter-node-http` desde `first-app`, que llama a `scripts/jupyter-node-http.sh`. Crea el `.venv` de la app si falta, instala `notebook` `7.6.3` si falta el ejecutable y abre esa carpeta en `127.0.0.1`. `pnpm jupyter` y `src/clients/jupyter` se quedan.
