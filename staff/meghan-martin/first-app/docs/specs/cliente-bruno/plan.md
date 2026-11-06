# Plan — personas en Bruno

Cumple `docs/specs/cliente-bruno/spec.md`. No es una acción nueva de `src/logic/`. No se cambia `src/clients/rest/server.js`.

## Tocar

- `src/clients/rest/bruno/`: la colección. Habla con `http://127.0.0.1:3001`.
- `src/clients/rest/bruno.md`: cómo preparar el ensayo y lanzarlo, en el Mac y en Windows.
- `package.json`: `@usebruno/cli` `4.3.0` en `devDependencies`, y el script `bruno`.
- `package-lock.json`: el árbol de ese paquete.
- `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md`: nombran la colección.

El script `bruno` entra en `src/clients/rest/bruno` y lanza `bru run 01-sql-online -r`.

La colección no llama a `logic/`. El ensayo copia el JavaScript a una carpeta temporal, cambia solo esa copia al puerto `43100` y no copia `users.sqlite`. La base real del puerto 3000 no se para. El programa JSON del ensayo escucha en el puerto 3001. Si el 3001 está ocupado, el ensayo no arranca.

`baseUrl` es `http://127.0.0.1:3001`. `missingId` es `999999`. Crear Ada guarda `userId`.

`01-sql-online`, con la lista del ensayo vacía:

- `empty-list` es `GET /users`. 200 y `[]`.
- `create-ada` es `POST /users` con Ada y ada@example.com. 201. Guarda `userId`. El cuerpo tiene `id`, `name`, `email`, `createdAt` y `updatedAt`.
- `list-users` es `GET /users`. 200. La lista tiene a Ada.
- `find-ada` es `GET /users/{{userId}}`. 200 y los mismos datos.
- `patch-name` es `PATCH` solo con el nombre Ada Lovelace. 200. El número y el email no cambian.
- `patch-email` es `PATCH` solo con ada.lovelace@example.com. 200. El número y el nombre no cambian.
- `create-empty-name` es `POST` con el nombre `" "` y empty@example.com. 400 y `{ "error": "Name is empty" }`.
- `create-invalid-email` es `POST` con Invalid e `invalid`. 400 y `{ "error": "Email is invalid" }`.
- `create-used-email` es `POST` con Other y ada.lovelace@example.com. 409 y `{ "error": "Email is already used" }`.
- `get-missing`, `patch-missing` y `delete-missing` usan `missingId`. 404 y `{ "error": "User not found" }`.
- `unknown-route` es `GET /no-such`. 404 y `{ "error": "Not found." }`.
- `delete-ada` es `DELETE /users/{{userId}}`. 200 y `{ "id": userId }`.
- `list-after-delete` es `GET /users`. 200 y `[]`.

`02-sql-offline`, con el SQL del ensayo parado y el programa JSON abierto. Las cinco responden 503 y `{ "error": "Database is not running. Start it with npm run db." }`:

- `create-sql-offline` es `POST /users`.
- `list-sql-offline` es `GET /users`.
- `find-sql-offline` es `GET /users/{{missingId}}`.
- `update-sql-offline` es `PATCH /users/{{missingId}}`.
- `delete-sql-offline` es `DELETE /users/{{missingId}}`.

Las dos carpetas no se lanzan juntas.

`bruno.json` tiene `version` `1`, `name` `first-app REST users` y `type` `collection`.

## Frases

Las que ya están en `docs/ERRORS.md`. El código HTTP es el que ya elige `src/clients/rest/server.js`:

| Fallo | Mensaje | Estado |
| --- | --- | --- |
| El nombre queda vacío | `Name is empty` | 400 |
| El email no vale | `Email is invalid` | 400 |
| El email es de otra persona | `Email is already used` | 409 |
| La persona no está | `User not found` | 404 |
| La dirección no existe | `Not found.` | 404 |
| La base del ensayo no está | `Database is not running. Start it with npm run db.` | 503 |

El cuerpo de un fallo es `{ "error": "frase" }`.

## No tocar

- `src/logic/`, `src/queries/`, `src/db/`
- `src/clients/rest/server.js`
- `src/clients/terminal/`, `src/clients/jupyter/`, `src/clients/browser/`, `src/clients/electron/`
- `docs/STYLE.md`, `docs/ERRORS.md`

## Socket

El paquete nuevo es `@usebruno/cli@4.3.0`, en `devDependencies`. No se ha instalado. El árbol se resolvió con npm y `--package-lock-only`, fuera del proyecto, partiendo del lock actual. Hasta 3 capas son 289 versiones. `cli-table3` sigue en `0.6.5`. `debug` sigue en `4.4.3`. `qs` sigue en `6.17.1`. `@babel/core@7.29.13` entra solo porque lo pide `jscodeshift@17.4.0`. No se añade `@babel/preset-env`.

`threat_feed` para `@usebruno/cli@4.3.0` respondió 403 `threat_feed_not_entitled`. La cuenta no tiene ese feed.

`depscore` se pidió para el paquete, sus 28 dependencias directas y la tercera capa. Por debajo de 50: `axios@1.18.0` vulnerability 30. 50 no baja. `crypto-js@4.2.0` y `uuid@10.0.0` tienen maintenance 50. Varios `@smithy/*` tienen quality 50. `form-data@4.0.4` vulnerability 84. `form-data@4.0.6` vulnerability 100. `js-yaml@4.3.1` vulnerability 84. `lodash@4.18.1` vulnerability 100.

`alerts` de `vibecodingneoland`, abiertas, de npm, filtradas por `@usebruno/cli`, `axios`, `form-data`, `js-yaml` y `lodash`, devolvieron lista vacía. Eso no dice que esas versiones no tengan alerta.

Quien acepta el plan decide si `axios@1.18.0`, con vulnerability 30, se acepta. Hasta esa lectura no se instala el paquete ni se cambia `package.json`.

## Decisión

No queda una duda entre la spec y el programa JSON. La aceptación de `axios@1.18.0` es de quien lee este plan.
