# Plan — colección Bruno del cliente HTTP

Cumple `docs/specs/bruno-http-client/spec.md`.

No hay operación nueva ni SQL nuevo. Crear, actualizar, eliminar, listar y buscar siguen en la lógica que ya existe. Contar el género no entra. Crear la tabla no se pide aparte. No hay mensaje nuevo.

El cliente HTTP sigue en `src/clients/http/app.js`, en `http://127.0.0.1:3001`. El programa de consultas sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se arrancan con `pnpm server` y `pnpm http` desde `first-app`. La colección no llama a la lógica: envía HTTP a ese cliente. No se abre otra base. No se cambia el puerto. No se tocan las rutas de `app.js`.

Bruno no es otro framework ni otro cliente. `@usebruno/cli` `4.3.0` es la herramienta que lanza y comprueba esas peticiones.

## Validación Socket

`depscore` respondió el 2026-11-06, con plataforma `win32-x64`, para `@usebruno/cli` `4.3.0` y parte de la capa 1. `organizations` respondió `Unauthorized`. Sin `org_slug` no se ha podido llamar a `alerts` ni a `threat_feed`. No hay dato de alerta ni de campaña. Eso no es ausencia de avisos.

Una segunda tanda de `depscore` respondió 429. Quedan sin puntuación las demás dependencias de las capas 1 a 3. Eso tampoco es ausencia de avisos.

Ya están en `pnpm-lock.yaml` con la misma versión y no se vuelven a comprobar: `cli-table3` `0.6.5`, `debug` `4.4.3`, `jsesc` `3.1.0` y `qs` `6.17.1`.

`axios` `1.18.0` lo fija el CLI. Su vulnerabilidad está en 30, por debajo de 50. El agente no acepta esa stat.

| Paquete | Versión | Capa | Campaña | Alertas | Stats por debajo de 50 |
| --- | --- | --- | --- | --- | --- |
| `@usebruno/cli` | `4.3.0` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 96, calidad 100, cadena 88, vulnerabilidad 100 |
| `chai` | `4.5.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 84, calidad 100, cadena 99, vulnerabilidad 100 |
| `axios` | `1.18.0` | 1 | sin dato | sin dato | vulnerabilidad 30. Licencia 100, mantenimiento 94, calidad 100, cadena 97 |
| `chalk` | `3.0.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 83, calidad 100, cadena 100, vulnerabilidad 100 |
| `yargs` | `17.7.3` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 87, calidad 100, cadena 98, vulnerabilidad 100 |
| `lodash` | `4.18.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 82, calidad 86, cadena 100, vulnerabilidad 100 |
| `js-yaml` | `4.3.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 92, calidad 100, cadena 100, vulnerabilidad 84 |
| `fs-extra` | `10.1.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 88, calidad 100, cadena 99, vulnerabilidad 100 |
| `csv-parse` | `5.6.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 85, calidad 96, cadena 100, vulnerabilidad 99 |
| `decomment` | `0.9.5` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 80, calidad 100, cadena 100, vulnerabilidad 100 |
| `form-data` | `4.0.4` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 87, calidad 100, cadena 99, vulnerabilidad 84 |
| `aws4-axios` | `3.4.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 80, calidad 100, cadena 99, vulnerabilidad 100 |
| `axios-ntlm` | `1.4.6` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 80, calidad 92, cadena 99, vulnerabilidad 100 |
| `iconv-lite` | `0.6.3` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 93, calidad 100, cadena 100, vulnerabilidad 100 |
| `xmlbuilder` | `15.1.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 100, cadena 100, vulnerabilidad 100 |
| `@usebruno/js` | `0.55.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 95, calidad 76, cadena 85, vulnerabilidad 100 |
| `@usebruno/lang` | `0.41.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 94, calidad 76, cadena 93, vulnerabilidad 100 |
| `@usebruno/filestore` | `0.14.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 93, calidad 86, cadena 93, vulnerabilidad 100 |
| `@usebruno/converters` | `0.25.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 94, calidad 98, cadena 93, vulnerabilidad 100 |
| `@usebruno/requests` | `0.22.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 94, calidad 75, cadena 87, vulnerabilidad 100 |

Sin puntuación, por 429: `@usebruno/common` `0.27.0`, `http-proxy-agent` `7.0.2`, `https-proxy-agent` `7.0.6`, `socks-proxy-agent` `8.0.5`, `@aws-sdk/credential-providers` `3.1019.0`, y el resto de las capas 2 y 3.

## Ficheros

Cada petición es un fichero `.bru` propio. No hay un fichero con varias peticiones.

Se crean:

- `src/clients/http/bruno/bruno.json`
- `src/clients/http/bruno/collection.bru`
- `src/clients/http/bruno/01-sql-online/folder.bru`
- `src/clients/http/bruno/01-sql-online/01-empty-list.bru`
- `src/clients/http/bruno/01-sql-online/02-create-ada.bru`
- `src/clients/http/bruno/01-sql-online/03-list-users.bru`
- `src/clients/http/bruno/01-sql-online/04-find-ada-by-id.bru`
- `src/clients/http/bruno/01-sql-online/05-find-ada-by-email.bru`
- `src/clients/http/bruno/01-sql-online/06-find-ada-by-name.bru`
- `src/clients/http/bruno/01-sql-online/07-patch-name.bru`
- `src/clients/http/bruno/01-sql-online/08-create-empty-name.bru`
- `src/clients/http/bruno/01-sql-online/09-create-invalid-email.bru`
- `src/clients/http/bruno/01-sql-online/10-create-used-email.bru`
- `src/clients/http/bruno/01-sql-online/11-get-missing.bru`
- `src/clients/http/bruno/01-sql-online/12-get-missing-email.bru`
- `src/clients/http/bruno/01-sql-online/13-get-missing-name.bru`
- `src/clients/http/bruno/01-sql-online/14-patch-missing.bru`
- `src/clients/http/bruno/01-sql-online/15-delete-missing.bru`
- `src/clients/http/bruno/01-sql-online/16-delete-ada.bru`
- `src/clients/http/bruno/01-sql-online/17-list-after-delete.bru`
- `src/clients/http/bruno/02-sql-offline/folder.bru`
- `src/clients/http/bruno/02-sql-offline/18-create-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/19-list-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/20-find-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/21-find-email-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/22-find-name-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/23-update-sql-offline.bru`
- `src/clients/http/bruno/02-sql-offline/24-delete-sql-offline.bru`

No se toca `src/clients/http/app.js`. No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter`, `src/clients/browser`, `src/clients/electron`, `src/clients/chrome`, `src/clients/vscode` ni `src/clients/nest`.

Se toca `package.json`. En `devDependencies` entra `@usebruno/cli` `4.3.0`. El script `bruno` entra en `src/clients/http/bruno` y lanza `bru run 01-sql-online -r`, con el `bru` de `node_modules/.bin`. Se lanza con `pnpm bruno` desde `first-app`. El script `test` no se toca. El script `format` se queda en `src/clients/http/**/*.js`: las peticiones no son JavaScript. `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano. No se usa npm ni yarn.

No se crea `bruno.md`. No hay `package.json` anidado. No se toca `eslint.config.js`: ya solo analiza `**/*.js`. No se toca el `.gitignore` de la raíz. No se crea un `README`.

En el mismo cambio se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/DATABASE.md` no cambia: la base sigue igual.

## Firma

No hay función de negocio nueva. La colección pide las siete rutas que ya tiene `app.js`:

| Petición | Ruta |
| --- | --- |
| Crear | `POST /users` |
| Listar | `GET /users` |
| Buscar por id | `GET /users/:id` |
| Buscar por email | `GET /users/email/:email` |
| Buscar por nombre | `GET /users/name/:name` |
| Actualizar | `PATCH /users/:id` |
| Eliminar | `DELETE /users/:id` |

El cuerpo de crear es JSON con `name` y `email`. El de actualizar es JSON con `name`, con `email` o con los dos. El email y el nombre de la ruta van codificados.

## SQL

No hay SQL nuevo. Cada petición usa la operación que ya está escrita.

## Colección

`bruno.json` tiene `version` `0.0.0`, `name` `first-app HTTP users` y `type` `collection`. `collection.bru` guarda `baseUrl` `http://127.0.0.1:3001` y `missingId` `999999`. Crear Ada guarda `userId`. Las peticiones de ese usuario usan esa variable. No se exige el id 1: la lista vacía no reinicia el incremento.

Cada petición es un `.bru`. Tiene `meta`, el método, el cuerpo si lo hay y `tests { }`. Los tests comprueban el estado y, si hay fallo, `{ message }`. Hay dos carpetas. No se ejecutan juntas.

Carpeta `01-sql-online`, con la lista vacía, el programa de consultas en marcha y el cliente HTTP abierto:

- `empty-list` es `GET /users`. 200 y `[]`.
- `create-ada` es `POST /users` con Ada y ada@example.com. 201. El cuerpo tiene `id`, `name` y `email`. Nombre Ada y email ada@example.com.
- `list-users` es `GET /users`. 200. La lista tiene a Ada.
- `find-ada-by-id` es `GET /users/:id` con `userId`. 200 y los mismos datos.
- `find-ada-by-email` es `GET /users/email/:email` con ada@example.com. 200 y los mismos datos.
- `find-ada-by-name` es `GET /users/name/:name` con Ada. 200 y los mismos datos.
- `patch-name` es `PATCH /users/:id` solo con el nombre Ada Lovelace. 200. El cuerpo es el `id` y el nombre enviado. No lleva el email.
- `create-empty-name` es `POST /users` con el nombre `" "` y empty@example.com. 400 y `Name is required`.
- `create-invalid-email` es `POST /users` con Invalid e `invalid`. 400 y `Email is not valid`.
- `create-used-email` es `POST /users` con Other y ada@example.com. 409. El mensaje contiene `UNIQUE constraint`.
- `get-missing` es `GET /users/:id` con `missingId`. 404 y un mensaje que termina en `was not found`.
- `get-missing-email` es `GET /users/email/:email` con missing@example.com. 404 y un mensaje que termina en `was not found`.
- `get-missing-name` es `GET /users/name/:name` con Nobody. 404 y `User Nobody was not found`.
- `patch-missing` es `PATCH /users/:id` con `missingId` y solo el nombre Nobody. 404 y un mensaje que termina en `was not found`.
- `delete-missing` es `DELETE /users/:id` con `missingId`. 404 y un mensaje que termina en `was not found`.
- `delete-ada` es `DELETE /users/:id` con `userId`. 204 y cuerpo vacío.
- `list-after-delete` es `GET /users`. 200 y `[]`.

Carpeta `02-sql-offline`, con el programa de consultas parado y el cliente HTTP abierto. Cada una responde 500. El cuerpo es `{ "message": texto }`. El texto es el de ese `Error`, sin cambiarlo:

- `create-sql-offline` es `POST /users`.
- `list-sql-offline` es `GET /users`.
- `find-sql-offline` es `GET /users/:id` con `missingId`.
- `find-email-sql-offline` es `GET /users/email/:email` con offline@example.com.
- `find-name-sql-offline` es `GET /users/name/:name` con Offline.
- `update-sql-offline` es `PATCH /users/:id` con `missingId` y solo el nombre Offline.
- `delete-sql-offline` es `DELETE /users/:id` con `missingId`.

`pnpm bruno` lanza solo `01-sql-online`. El caso parado se lanza aparte, después de parar `pnpm server`.

## Documentación

`docs/ARCHITECTURE.md` añade que el cliente HTTP también se comprueba con Bruno y `pnpm bruno`. Sigue respondiendo en `127.0.0.1:3001`. Postman puede seguir pidiendo esas mismas peticiones. No cuenta el género.

`docs/TREE.md` añade `clients/http/bruno/` junto a `app.js`.

`docs/STYLE.md` deja que el cliente HTTP sigue siendo un solo fichero JavaScript, `src/clients/http/app.js`, y que la colección Bruno vive en `src/clients/http/bruno`.

`docs/ERRORS.md` añade que, si este cliente no está en marcha, `pnpm bruno` no completa la petición. Si el programa de consultas no está en marcha, las peticiones de Bruno ven el fallo de esa llamada.

`docs/CONSTITUTIONS.MD` cuenta `pnpm bruno` y la colección junto al cliente HTTP. El desarrollo abierto pasa a ser `docs/specs/bruno-http-client/`.

`AGENTS.MD` deja la regla: la colección vive en `src/clients/http/bruno`. Se lanza con `pnpm bruno` desde `first-app`. `@usebruno/cli` queda en `4.3.0`. `app.js`, Express `5.3.0` y el puerto `3001` se quedan.

## Pregunta

La constitución pide un resumen Socket completo antes de aceptar el plan. Esta consulta no lo está: `organizations` dio `Unauthorized`, no hay alertas ni campaña, y parte del árbol no tiene `depscore` por 429.

`axios` `1.18.0` tiene vulnerabilidad 30. Esa versión la fija el CLI.

¿Se acepta el plan con esa stat y con esas comprobaciones incompletas? Hasta esa respuesta no hay `tasks.md`.
