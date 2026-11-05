# Plan — cliente node:http de usuarios documentado con Jupyter

Issue: #1092.

No es una funcionalidad nueva de `logic/`. No se reemplaza ningún
fichero de `logic/`. No hay firma nueva. No hay SQL nuevo. No hay
mensaje nuevo.

No hay paquete de Node nuevo. `node:http` ya viene con Node.
`notebook` `7.6.3` ya está en el `.venv` de la app. No entra Socket.

El cliente llama a las funciones que ya existen y devuelve su
resultado. Las llamadas son las de `src/clients/http/app.js`. La forma
del servidor es la de `src/db/server.js`: `createServer` de
`node:http`. No entra Express. No entra Fastify. No entra Nest.

Crear llama a `createUser({ name, email })`. Listar llama a
`listUsers()`. Ver uno llama a `findUserById(id)`. Modificar llama a
`updateUser(id, changes)`. Borrar llama a `deleteUser(id)`. El `id` es
el texto de la ruta. No se importa `users-gender-count.js`,
`find-user-by-name.js` ni `find-user-by-email.js`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con `pnpm server`. Este cliente escucha en
`http://127.0.0.1:3004`. La constante es `ORIGIN`. `package.json` tiene
el script `node-http`: `node src/clients/node-http/app.js`.

El cuerpo JSON se lee como en `src/db/server.js`: se junta el texto,
se parsea y, si no es JSON, responde 500 con el `Could not` de esa
acción. Crear y modificar leen `name` y `email`. Si un campo no
viene, no entra en `changes`, y `updateUser` conserva el valor
guardado. El cliente no valida. Si lo lanzado no es un `Error` con un
mensaje de la lista, responde 500 con el `Could not` de esa acción.
No inventa un mensaje.

La ruta se parte con `URL`, como `src/db/server.js`. `/users` y un
id detrás de `/users/` son las cinco acciones. Otra ruta responde 404
y un cuerpo vacío. No hay mensaje nuevo.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Si la función lanza un `Error` de la lista, el cuerpo es JSON con la
clave `message` y ese texto.

Los notebooks viven en `src/clients/node-http/jupyter/`. Llaman a
`http://127.0.0.1:3004`. No importan `src/logic/`. Un documento por
acción, en el orden del cliente Jupyter de esas cinco rutas: título,
qué hace, qué pasa en la base, qué acción usa, anotaciones, el bloque
y el resultado. El texto del documento está en español. El código de
la llamada sigue en inglés.

El bloque no busca `logic/`. Hace `fetch` a `ORIGIN` desde Node, con
`node --input-type=module`, y dibuja con `cli-table3` `0.6.5` y
`@colors/colors` `1.6.1`, que ya están. La tabla usa `head` y
`style.head` `["cyan", "bold"]`. Columnas de un usuario, en este
orden: `id`, `name`, `email`, `createdAt`, `updatedAt`. Una lista es
una fila por elemento. Una lista vacía deja los encabezados y la
línea `No hay filas.` Si la llamada no devuelve nada, la tabla tiene
la columna `Resultado` y la fila `No devuelve datos.` Si falla, se ve
el `message` y no la tabla de datos.

`scripts/jupyter-node-http.sh` copia `scripts/jupyter.sh`. Solo cambia
la carpeta que abre Notebook: `src/clients/node-http/jupyter`.
Reutiliza el mismo `.venv` y `notebook` `7.6.3`. `scripts/jupyter.sh`
no cambia.
`package.json` tiene el script `jupyter-node-http`:
`sh scripts/jupyter-node-http.sh`. `pnpm jupyter` sigue abriendo
`src/clients/jupyter/`.

Para ver la API: `pnpm server`, `pnpm node-http` y
`pnpm jupyter-node-http`.

Documentos, con la lista vacía:

- `create-user`. `POST /users` con Ada y ada@example.com. Inserta una
  fila. Anotaciones: `Name is empty`, `Email is invalid`, `Email is
already used`, `Could not create the user`. Se abre con
  `pnpm jupyter-node-http` desde la app.
- `list-users`. `GET /users`. Solo lee. Anotaciones: sin usuarios, no
  hay filas. `Could not list the users`.
- `find-user-by-id`. `GET /users/:id` con el id de Ada. Solo lee.
  Anotaciones: `User not found`, `Could not find the user`.
- `update-user`. `PATCH /users/:id` solo con el nombre Ada Lovelace.
  Actualiza esa fila y `updatedAt`. Anotaciones: `User not found`,
  `Name is empty`, `Email is invalid`, `Email is already used`,
  `Could not update the user`.
- `delete-user`. `DELETE /users/:id` con el id de Ada. Quita la fila y
  no devuelve datos. Anotación: `User not found`, `Could not delete
the user`. Esto borra a Ada.

Los de la base caída usan el SQL parado y este cliente abierto. El
id que no está es `999999`.

No hay cliente de terminal nuevo: no es una funcionalidad de
`logic/`.

El punto de `src/clients/node-http/` en `docs/ARCHITECTURE.md` queda
así. El de `docs/specs/<nombre>/` no cambia.

```
- `src/clients/node-http/` llama a `src/logic/`, usa `createServer`
  de `node:http` y escucha en el puerto 3004. Los notebooks viven
  en `jupyter/` y se abren con `pnpm jupyter-node-http`. Se lanza
  con `pnpm node-http`. No sustituye a `src/clients/http/`, ni a
  `src/clients/jupyter/`, ni a `src/db/server.js`.
```

En `docs/TREE.md`, `clients/` incluye `node-http/` así. Sale
`node-http-client/` de `specs/`. `scripts/` incluye
`jupyter-node-http.sh`.

```
      node-http/
        app.js
        jupyter/
          create-user.ipynb
          list-users.ipynb
          find-user-by-id.ipynb
          update-user.ipynb
          delete-user.ipynb
```

## Ficheros

Se crean:

- `src/clients/node-http/app.js`
- `src/clients/node-http/jupyter/create-user.ipynb`
- `src/clients/node-http/jupyter/list-users.ipynb`
- `src/clients/node-http/jupyter/find-user-by-id.ipynb`
- `src/clients/node-http/jupyter/update-user.ipynb`
- `src/clients/node-http/jupyter/delete-user.ipynb`
- `scripts/jupyter-node-http.sh`

Se tocan:

- `package.json`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

`package.json` añade los scripts `node-http` y `jupyter-node-http`.
El script `format` también incluye `src/clients/node-http/**/*.js`.
`pnpm-lock.yaml` no cambia.

`docs/STYLE.md` y `docs/ERRORS.md` no cambian.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec               | Mensaje                     | Estado |
| ------------------------------ | --------------------------- | ------ |
| El nombre queda vacío          | `Name is empty`             | 400    |
| El email no vale               | `Email is invalid`          | 400    |
| El email es de otro usuario    | `Email is already used`     | 409    |
| El usuario no está             | `User not found`            | 404    |
| No se llega a la base al crear | `Could not create the user` | 500    |
| No se llega al listar          | `Could not list the users`  | 500    |
| No se llega al ver uno         | `Could not find the user`   | 500    |
| No se llega al modificar       | `Could not update the user` | 500    |
| No se llega al borrar          | `Could not delete the user` | 500    |

## Socket

No hay paquete de Node nuevo ni cambio de versión. No entra Socket.

## Decisión

No queda una pregunta abierta. Las tareas se escriben cuando una
persona haya leído esta spec y este plan.
