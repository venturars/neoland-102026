# Plan — colección Bruno del cliente HTTP

Issue: #1078.

No es una funcionalidad nueva de `logic/`. No se reemplaza ningún
fichero de `logic/`. No hay firma nueva. No hay SQL nuevo. No hay
mensaje nuevo.

Hay un paquete nuevo: `@usebruno/cli@4.3.0`, en `devDependencies`.
Entra Socket. El árbol lo resolvió pnpm 10.33.0 con `--lockfile-only`,
fuera del proyecto, partiendo del lockfile actual. No se instaló en
el proyecto. Son estas versiones exactas. `cli-table3` sigue en
`0.6.5`. `debug` sigue en `4.4.3`. `qs` sigue en `6.17.1`. Si pnpm
resolviera otra versión, esa versión no es la de este resumen y hay
que volver a pasarla por Socket.

`jscodeshift@17.4.0` pide `@babel/preset-env@^7.1.6`. El proyecto
tiene `8.0.7`. No se instala Babel 7.

La colección no llama a `logic/`. Envía HTTP al cliente que ya
escucha en `http://127.0.0.1:3001`. Ese cliente sigue en
`src/clients/http/app.js`. La base sigue en `src/db/server.js`, en
`http://127.0.0.1:3000`. Se arrancan con `pnpm server` y `pnpm http`
desde `first-app`. No se abre otra base. No se cambia el puerto.

La colección vive en `src/clients/http/bruno/`. La guía vive en
`src/clients/http/bruno.md`. No queda en `docs/specs/`.

`package.json` tiene el script `bruno`. Se lanza con `pnpm bruno`
desde `first-app`. Entra en `src/clients/http/bruno` y ejecuta
`bru run 01-sql-online -r`.

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
vacía, `pnpm bruno`; parar solo el SQL; desde `src/clients/http/bruno`,
`../../../../node_modules/.bin/bru run 02-sql-offline -r`.

No se toca `src/clients/http/app.js`. No hay cliente de terminal
nuevo: no es una funcionalidad de `logic/`.

El punto de `src/clients/http/` en `docs/ARCHITECTURE.md` queda así.
El de `docs/specs/<nombre>/` vuelve a spec, plan y tareas. El resto
de los puntos no cambia.

```
- `src/clients/http/` llama a `src/logic/`, escucha en el puerto
  3001. Tiene la guía y la colección Bruno. Se lanza con
  `pnpm bruno`. El paquete es `@usebruno/cli`. No sustituye a
  `src/db/server.js`.
```

```
- `docs/specs/<nombre>/` es un desarrollo. `<nombre>` va en
  kebab-case. Ahí viven su spec, su plan y sus tareas.
```

En `docs/TREE.md`, `http/` queda así. Sale `bruno-http-client/` de
`specs/`.

```
      http/
        app.js
        bruno.md
        bruno/
```

## Ficheros

Se crean:

- `src/clients/http/bruno.md`
- `src/clients/http/bruno/bruno.json`
- `src/clients/http/bruno/collection.bru`
- `src/clients/http/bruno/01-sql-online/folder.bru`
- `src/clients/http/bruno/01-sql-online/01-empty-list.bru`
- `src/clients/http/bruno/01-sql-online/02-create-ada.bru`
- `src/clients/http/bruno/01-sql-online/03-list-users.bru`
- `src/clients/http/bruno/01-sql-online/04-find-ada.bru`
- `src/clients/http/bruno/01-sql-online/05-patch-name.bru`
- `src/clients/http/bruno/01-sql-online/06-create-empty-name.bru`
- `src/clients/http/bruno/01-sql-online/07-create-invalid-email.bru`
- `src/clients/http/bruno/01-sql-online/08-create-used-email.bru`
- `src/clients/http/bruno/01-sql-online/09-get-missing.bru`
- `src/clients/http/bruno/01-sql-online/10-patch-missing.bru`
- `src/clients/http/bruno/01-sql-online/11-delete-missing.bru`
- `src/clients/http/bruno/01-sql-online/12-delete-ada.bru`
- `src/clients/http/bruno/01-sql-online/13-list-after-delete.bru`
- `src/clients/http/bruno/02-sql-offline/folder.bru`
- `src/clients/http/bruno/02-sql-offline/14-create-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/15-list-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/16-find-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/17-update-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/18-delete-sql-offline.bru`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

Se quitan:

- `docs/specs/bruno-http-client/bruno.md`
- `docs/specs/bruno-http-client/bruno/`

`docs/STYLE.md` y `docs/ERRORS.md` no cambian.

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

`threat_feed` para `@usebruno/cli@4.3.0` respondió 403
`threat_feed_not_entitled`. La cuenta no tiene threat feed. No hay
dato de campaña por versión. En cada paquete, la campaña es esa.

El que se declara, en `devDependencies`:

- `@usebruno/cli@4.3.0`

Sus dependencias nuevas, hasta 3 capas, son las del árbol de pnpm.
`cli-table3@0.6.5`, `debug@4.4.3` y `qs@6.17.1` no cambian y no se
vuelven a mirar.

`depscore` dio las cinco stats. Por debajo de 50: `axios@1.18.0`
vulnerability 30. 50 no baja. Esa versión la fija el CLI. El resto
de las stats de esa pasada no baja de 50. `form-data@4.0.4`
vulnerability 84. `js-yaml@4.3.1` vulnerability 84.
`@usebruno/requests@0.22.0` quality 75. `has-tostringtag@1.0.2`
maintenance 53. `es-set-tostringtag@2.1.0` maintenance 53.
`function-bind@1.1.2` maintenance 54. `minimalistic-assert@1.0.1`
quality 54.

`alerts` de `ai-engineering`, abiertas, de npm, filtradas por
`@usebruno/cli`, devolvió lista vacía. Eso no dice que `4.3.0` no
tenga alerta.

`alerts` de `axios` nombran muchas CVE. Los parches van de `1.12.0`
a `1.20.0`. Este plan fija `axios@1.18.0`. Una alerta cuyo parche
es `1.20.0` no cubre esa versión. `depscore` de `1.18.0` da
vulnerability 30.

`alerts` de `js-yaml` nombran `4.3.1` como parche de una alta y
versiones `4.3.0`, `4.2.0`, `4.1.1` y `3.15.2` en las otras. Este
plan fija `js-yaml@4.3.1`. Eso no dice que `4.3.1` no tenga alerta.

`alerts` de `lodash` nombran `4.17.21`. El parche de las tres es
`4.18.0` o `4.17.23`. Este plan fija `lodash@4.18.1`. Eso no dice
que `4.18.1` no tenga alerta.

`alerts` de `form-data` nombran `4.0.2`. Crítica
`GHSA-fjxv-7rqg-78g4`, parche `4.0.4`. Alta `GHSA-hmw2-7cc7-3qxx`,
parche `4.0.6`. Este plan fija `form-data@4.0.4` y `form-data@4.0.6`.
Ninguna nombra esas versiones.

Quien acepta el plan decide si esas alertas, en esas versiones, se
aceptan.

## Decisión

No queda una pregunta abierta. Las tareas se escriben cuando una
persona haya leído esta spec y este plan.
