# Plan — colección Bruno del cliente HTTP

Issue: #1086.

No es una funcionalidad nueva de `logic/`. No se reemplaza ningún
fichero de `logic/`. No hay firma nueva. No hay SQL nuevo. No hay
mensaje nuevo.

Hay un paquete nuevo: `@usebruno/cli@4.3.0`, en `devDependencies`.
Entra Socket. La instalación en el proyecto fija las versiones en
`pnpm-lock.yaml`. Si pnpm resolviera otra versión, esa versión no es
la de este resumen y hay que volver a pasarla por Socket.

La colección no llama a `logic/`. Envía HTTP al cliente que ya
escucha en `http://127.0.0.1:3001`. Ese cliente sigue en
`src/clients/http/app.js`. La base sigue en `src/db/server.js`, en
`http://127.0.0.1:3000`. Se arrancan con `pnpm server` y `pnpm http`
desde `first-app`. No se abre otra base. No se cambia el puerto.

La colección vive en `src/clients/http/bruno/`. La guía vive en
`src/clients/http/bruno.md`.

`package.json` tiene el script `bruno`. Se lanza con `pnpm bruno`
desde `first-app`. Ejecuta la carpeta `01-sql-online` de la colección
con recursión. En Windows el script usa `node` y la ruta al binario
del CLI, sin depender de `sh`.

La forma de cada petición es `.bru`: `meta`, método, cuerpo y
`tests`. Hay dos carpetas. No se ejecutan juntas.

`baseUrl` es `http://127.0.0.1:3001`. `missingId` es `999999`. Crear
Ada guarda `userId`. Las peticiones de ese usuario usan esa
variable. No se exige el id 1: la lista vacía no reinicia el
incremento.

Carpeta `01-sql-online`, con la lista vacía:

- `empty-list` es `GET /users`. 200 y `[]`.
- `create-ada` es `POST /users` con Ada y ada@example.com. 201. El
  cuerpo tiene `id`, `name`, `email`, `createdAt` y `updatedAt`.
  Nombre Ada y email ada@example.com.
- `list-users` es `GET /users`. 200. La lista tiene a Ada.
- `find-ada` es `GET /users/:id` con `userId`. 200 y los mismos
  datos.
- `patch-name` es `PATCH /users/:id` solo con el nombre Ada
  Lovelace. 200. El id y el email no cambian.
- `create-empty-name` es `POST /users` con el nombre `" "` y
  empty@example.com. 400 y `Name is empty`.
- `create-invalid-email` es `POST /users` con Invalid e `invalid`.
  400 y `Email is invalid`.
- `create-used-email` es `POST /users` con Other y ada@example.com.
  409 y `Email is already used`.
- `get-missing`, `patch-missing` y `delete-missing` usan
  `missingId`. 404 y `User not found`.
- `delete-ada` es `DELETE /users/:id` con `userId`. 204 y cuerpo
  vacío.
- `list-after-delete` es `GET /users`. 200 y `[]`.

Carpeta `02-sql-offline`, con el SQL parado y el cliente HTTP
abierto:

- `create-sql-offline` es `POST /users`. 500 y `Could not create the
  user`.
- `list-sql-offline` es `GET /users`. 500 y `Could not list the
  users`.
- `find-sql-offline` es `GET /users/:id` con `missingId`. 500 y
  `Could not find the user`.
- `update-sql-offline` es `PATCH /users/:id` con `missingId`. 500 y
  `Could not update the user`.
- `delete-sql-offline` es `DELETE /users/:id` con `missingId`. 500 y
  `Could not delete the user`.

Un fallo de la lista sale en JSON con la clave `message` y ese
texto.

`bruno.md` dice: arrancar `pnpm server` y `pnpm http`; con la lista
vacía, `pnpm bruno`; parar solo el SQL; desde `first-app`, lanzar el
comando del plan para la carpeta `02-sql-offline`.

No se toca `src/clients/http/app.js`. No hay cliente de terminal
nuevo: no es una funcionalidad de `logic/`.

El punto de `src/clients/http/` en `docs/ARCHITECTURE.md` menciona la
guía y la colección Bruno y el script `pnpm bruno`. En `docs/tree.md`,
`http/` incluye `bruno.md` y `bruno/`. `docs/specs/bruno-http-client/`
sigue con spec, plan y tareas.

`docs/style.md` añade el comando `pnpm bruno`.

## Ficheros

Se crean:

- `docs/specs/bruno-http-client/spec.md`
- `docs/specs/bruno-http-client/plan.md`
- `docs/specs/bruno-http-client/tasks.md`
- `src/clients/http/bruno.md`
- `src/clients/http/bruno/bruno.json`
- `src/clients/http/bruno/collection.bru`
- peticiones `.bru` en `01-sql-online/` y `02-sql-offline/` según la
  spec

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/tree.md`
- `docs/style.md`

`bruno.json` tiene `version` `1`, `name` `first-app HTTP users` y
`type` `collection`.

## Firma

No hay función nueva.

## SQL

No hay SQL.

## Errores

| Fallo de la spec                  | Mensaje                     | Estado |
| --------------------------------- | --------------------------- | ------ |
| El nombre queda vacío             | `Name is empty`             | 400    |
| El email no vale                  | `Email is invalid`          | 400    |
| El email es de otro usuario       | `Email is already used`     | 409    |
| El usuario no está                | `User not found`            | 404    |
| No se llega a la base al crear    | `Could not create the user` | 500    |
| No se llega al listar             | `Could not list the users`  | 500    |
| No se llega al ver uno            | `Could not find the user`   | 500    |
| No se llega al modificar          | `Could not update the user` | 500    |
| No se llega al borrar             | `Could not delete the user` | 500    |

## Socket

`depscore` de `@usebruno/cli@4.3.0`: license 100, maintenance 96,
quality 100, supplyChain 88, vulnerability 100. Ninguna stat por
debajo de 50.

`alerts` de `socket-dev-neoland`, abiertas, npm, filtradas por
`@usebruno/cli`, devolvió lista vacía. Eso no dice que `4.3.0` no
tenga alerta.

Las dependencias transitivas nuevas, hasta 3 capas, se confirman al
instalar y se vuelven a mirar con Socket si el lockfile no coincide
con este plan.

Quien acepta el plan decide si acepta el paquete y las alertas que
aparezcan en esas capas.

## Decisión

No queda una pregunta abierta. Las tareas se escriben cuando una
persona haya leído esta spec y este plan.
