# Plan — API de Express con colección de Bruno

Issue: #1153

Cliente nuevo en `src/clients/http/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje de error nuevo. `src/db/`, `src/queries/`, `src/logic/` y los demás clientes no cambian.

Hay dos paquetes nuevos. El resumen de Socket está abajo. Quien acepta el plan decide sobre lo que recoge.

Esta rama sale de `staging`. No hay que fusionar otras ramas ni seguir un orden de fusión.

## Cómo funciona

```
Bruno → /users... → src/clients/http/server.js → src/logic/ → src/queries/ → src/db/server.js
```

`pnpm http` arranca la API. `pnpm bruno` lanza la colección contra ella con el CLI de Bruno.

## Ficheros

Se crean:

- `src/clients/http/server.js` — la API.
- `src/clients/http/bruno/` — la colección.
- `scripts/bruno.js` — el lanzador de la colección.

Se tocan:

- `package.json`:
  - Los scripts `http` (`node src/clients/http/server.js`) y `bruno` (`node scripts/bruno.js`).
  - `src/clients/http/**/*.js` en `format`.
  - `express@5.3.0` en `dependencies`.
  - `@usebruno/cli@4.3.0` en `devDependencies`.
- `pnpm-lock.yaml` — lo actualiza `pnpm install`.
- `AGENTS.md` — los paquetes, los comandos `pnpm http` y `pnpm bruno`, y la API de Express en la lista de clientes que necesitan `pnpm start`.
- `docs/ARCHITECTURE.md` — filas de `src/clients/http/*` y `scripts/bruno.js`, y la API de Express allí donde se nombran los clientes de `src/logic/`.
- `docs/TREE.md` — `scripts/bruno.js` y `clients/http/`.

`eslint.config.js` no cambia. Los `.js` nuevos importan `console` y `process`, como `src/clients/chrome/server.js`, y los `.bru` no pasan por ESLint ni por Prettier.

## `src/clients/http/server.js`

Sigue la forma de `src/clients/chrome/server.js`, con Express en lugar de Fastify:

- Constantes `HOST` (`127.0.0.1`) y `PORT` (`3001`), y el mapa `ESTADOS`.
- `responderError(response, error, mensajeDeFallo)` responde con el estado de `ESTADOS` y el mensaje. Si el error no es de las reglas, responde 500 con `mensajeDeFallo`. Cuerpo `{ message }`.
- `comprobarPeticion(request, response, next)` va antes que todo:
  - 403 sin cuerpo si `Host` no es `127.0.0.1:3001`.
  - 403 sin cuerpo si llega `Origin`. Esta API no tiene página propia, así que no hay `Origin` que aceptar.
- `express.json()` lee el cuerpo, y las rutas usan `request.body ?? {}`. En Express 5, una petición sin cuerpo JSON deja `request.body` en `undefined`.
- Un manejador de errores de cuatro argumentos, al final, responde 400 sin cuerpo a un JSON mal formado (`error.type === "entity.parse.failed"`) y 500 sin cuerpo a cualquier otro error. No hay página de error de Express ni un mensaje fuera de `docs/ERRORS.md`.
- Un último `app.use` responde 404 sin cuerpo a cualquier otra ruta.
- Al arrancar se escucha el evento `error` del servidor y se da el mismo aviso de `EADDRINUSE` que en la API de Chrome.
- Lee las operaciones de `src/logic/` y no tiene reglas.

| Ruta | Función de `src/logic/` | Respuesta buena | Fallos | Mensaje del 500 |
| --- | --- | --- | --- | --- |
| `POST /users` | `createUser` | 201, usuario | 400, 409, 500 | `Could not create the user` |
| `GET /users` | `listUsers` | 200, lista | 500 | `Could not list the users` |
| `GET /users/by-email` | `findUserByEmail` | 200, usuario | 400, 404, 500 | `Could not find the user` |
| `GET /users/by-name` | `findUserByName` | 200, lista | 400, 500 | `Could not find the user` |
| `GET /users/gender-count` | `usersGenderCount` | 200, recuentos | 500 | `Could not classify the users` |
| `GET /users/:id` | `findUserById` | 200, usuario | 404, 500 | `Could not find the user` |
| `PATCH /users/:id` | `updateUser` | 200, usuario | 400, 404, 409, 500 | `Could not update the user` |
| `DELETE /users/:id` | `deleteUser` | 204, sin cuerpo | 404, 500 | `Could not delete the user` |

Las tres rutas fijas van antes que `/users/:id`. `PATCH` solo pasa a `changes` lo que llega, como la API de Chrome.

## `src/clients/http/bruno/`

Sigue la disposición de `staff/ventura-rodriguez/first-app/src/clients/http/bruno/`: `NN-nombre.bru`, un `folder.bru` por carpeta y `seq` correlativo.

- `bruno.json` — `version: "1"`, nombre `first-app HTTP users` y `type: "collection"`.
- `collection.bru` — `baseUrl` (`http://127.0.0.1:3001`) y `missingId` (`999999`) en `vars:pre-request`. Hay un solo destino, así que no hace falta carpeta `environments/`.

Todas las peticiones llevan `auth: none` y un bloque `tests` que comprueba el estado y el contenido.

### `01-sql-online/`

Con la base en marcha. Corre en este orden, porque unas peticiones usan lo que guardan las anteriores:

1. `create-ada`: 201. Su `script:pre-request` guarda `adaEmail` con `Date.now()`. Su `script:post-response` guarda `userId`.
2. `create-empty-name`: 400 `Name is empty`.
3. `create-invalid-email`: 400 `Email is invalid`.
4. `create-duplicate-email`: 409 `Email is already used`.
5. `list-users`: 200. La lista contiene `userId`.
6. `find-by-id`: 200, y `find-by-id-missing`: 404 `User not found`.
7. `find-by-email`: 200, y `find-by-email-missing`: 404 `User not found`.
8. `find-by-name`: 200. La lista contiene `userId`.
9. `find-by-name-none`: 200 con `[]`, con un nombre único hecho con la misma marca de tiempo.
10. `update-name`: 200. El nombre cambia y el email se conserva.
11. `update-empty-name`: 400, y `update-missing`: 404.
12. `create-grace`: 201 con su propio email único. Guarda `graceId`.
13. `update-email-used`: 409, al poner a Ada el email de Grace.
14. `delete-grace`: 204.
15. `delete-ada`: 204, y `delete-missing`: 404.
16. `find-deleted`: 404.
17. `unknown-route`: 404 sin cuerpo.

La base es la de desarrollo y puede tener datos, así que ningún test supone que la lista esté vacía ni que un nombre sea único: buscan su propio `userId`.

### `02-sql-offline/`

Con `pnpm start` parado y `pnpm http` en marcha. Una petición por operación, cada una con 500 y el mensaje de la tabla de arriba: crear, listar, buscar por email, buscar por nombre, contar por género, ver, modificar y borrar. Contar por género falla en `findAll` antes de llegar a la IA, así que aquí no hace falta Ollama.

### `03-ai/`

Una petición, `gender-count`: 200 con `women`, `men` y `genderUndefined` numéricos. Necesita Ollama con `llama3.2` si hay usuarios.

## `scripts/bruno.js`

Sigue la forma de `scripts/nest.js`, porque en Windows no sirven `sh -c` ni `.bin/bru`:

- Calcula las rutas absolutas de la colección y de `node_modules/@usebruno/cli/bin/bru.js`.
- Elige la carpeta con el primer argumento: ninguno es `01-sql-online`, `offline` es `02-sql-offline` y `ai` es `03-ai`. Con otro argumento, avisa y termina con error.
- Lanza `bru.js run <carpeta> -r` con `spawnSync`, con `process.execPath`, `cwd` en la colección y `stdio: "inherit"`.
- Termina con el código de salida del CLI.

## Comentarios

Todo el código nuevo lleva comentarios fáciles de leer, en castellano y sin jerga sin explicar: uno encima de cada import, una frase encima de cada función y uno por bloque. Las líneas de código son cortas. Antes de cada commit se releen los comentarios nuevos.

## Paquetes

- `dependencies`: `express@5.3.0`, con versión fija. Ya está instalado como dependencia de `@nestjs/platform-express`, y la misma versión evita una segunda copia.
- `devDependencies`: `@usebruno/cli@4.3.0`, con versión fija.

### Resumen de Socket

Las stats salen de la herramienta `depscore` de `https://mcp.socket.dev/`, consultada sin token el 2026-11-06. Las versiones y las capas salen de un `pnpm install --lockfile-only --ignore-scripts` en una carpeta temporal, sin instalar nada. La capa 0 es el paquete. Entran 331 paquetes.

- **Stats por debajo de 50:** una, `axios@1.18.0`, con 30 en vulnerabilidades. Es dependencia directa de `@usebruno/cli`, que la fija a esa versión exacta. Ningún paquete de Express baja de 50.
- **Campañas: sin dato.** Hoy no se ha podido consultar `threat_feed`: el servidor respondió 429, por el límite de peticiones. El plan de `nest-swagger-docs` recoge que esa herramienta pide una cuenta y una organización. Que no haya dato no significa que el paquete sea seguro.
- **Alertas: sin dato.** Le pasa lo mismo a la herramienta `alerts`, y `depscore` da puntos pero no lista alertas.
- **Para tener esos dos datos:** Diego puede mirar los paquetes en socket.dev desde el navegador, o definir `SOCKET_API_TOKEN` si su cuenta da acceso a esas herramientas.

### Avisos de seguridad, aunque no vengan de Socket

Como Socket no lista alertas, se ha consultado el servicio de avisos del registro de npm (`/-/npm/v1/security/advisories/bulk`) para los mismos 331 paquetes. Hay 18 avisos en 7 paquetes. Todos vienen de `@usebruno/cli`; ninguno de `express`.

| Paquete | Avisos | Se corrige en | Aviso más grave |
| --- | --- | --- | --- |
| `axios@1.18.0` | 12: 7 altos y 5 moderados | `1.20.0` | Contaminación de prototipos y bloqueos por expresiones regulares, entre otros |
| `form-data@4.0.4` | 1 alto | `4.0.6` | Inyección de saltos de línea en campos multipart |
| `js-yaml@4.3.1` | 1 alto | `4.3.2` | Consumo de CPU con claves de mezcla vacías |
| `@faker-js/faker@9.9.0` | 1 alto | Posterior a `10.4.0` | `helpers.fake` permite ejecutar código |
| `csv-parse@5.6.0` | 1 moderado | `7.0.2` | Contaminación de prototipos por `columns` |
| `uuid@10.0.0` | 1 moderado | `11.1.1` | Falta comprobar límites del buffer |
| `yaml@2.3.4` | 1 moderado | `2.8.3` | Desbordamiento de pila con YAML muy anidado |

`4.3.0` es la última versión de `@usebruno/cli` y sigue fijando `axios@1.18.0`, así que subir el CLI no lo arregla.

**Qué significa aquí, sin haberlo probado:** el CLI es de desarrollo, no llega a la API y solo lanza contra `127.0.0.1` una colección escrita en este repo. Eso reduce la exposición, porque no procesa redirecciones, YAML ni datos de terceros. No demuestra que ningún aviso sea inalcanzable.

**Otros datos del registro de npm:**

- `protobufjs@7.6.6` tiene un `postinstall` (`node scripts/postinstall`). pnpm `10.20.0` por defecto no ejecuta esos scripts, y no hay configuración que lo permita. Se comprueba después de instalar. No hay que permitirlo.
- `crypto-js@4.2.0` y `uuid@10.0.0` están marcados como retirados por sus autores.

### Stats por paquete

| Capa | Paquete | Viene de | Cadena de suministro | Calidad | Mantenimiento | Vulnerabilidades | Licencia |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | `@usebruno/cli@4.3.0` | Bruno | 88 | 100 | 96 | 100 | 100 |
| 0 | `express@5.3.0` | Express | 97 | 100 | 92 | 100 | 100 |
| 1 | `@aws-sdk/credential-providers@3.1019.0` | Bruno | 98 | 100 | 97 | 100 | 100 |
| 1 | `@usebruno/common@0.27.0` | Bruno | 86 | 76 | 94 | 100 | 100 |
| 1 | `@usebruno/converters@0.25.0` | Bruno | 93 | 98 | 94 | 100 | 100 |
| 1 | `@usebruno/filestore@0.14.0` | Bruno | 93 | 86 | 93 | 100 | 100 |
| 1 | `@usebruno/js@0.55.0` | Bruno | 85 | 76 | 95 | 100 | 100 |
| 1 | `@usebruno/lang@0.41.0` | Bruno | 93 | 76 | 94 | 100 | 100 |
| 1 | `@usebruno/requests@0.22.0` | Bruno | 87 | 75 | 94 | 100 | 100 |
| 1 | `accepts@2.0.0` | Express | 99 | 100 | 84 | 100 | 100 |
| 1 | `aws4-axios@3.4.0` | Bruno | 99 | 100 | 80 | 100 | 100 |
| 1 | `axios-ntlm@1.4.6` | Bruno | 99 | 92 | 80 | 100 | 100 |
| 1 | `axios@1.18.0` | Bruno | 97 | 100 | 94 | 30 | 100 |
| 1 | `body-parser@2.4.0` | Express | 99 | 100 | 93 | 100 | 100 |
| 1 | `chai@4.5.0` | Bruno | 99 | 100 | 84 | 100 | 100 |
| 1 | `chalk@3.0.0` | Bruno | 100 | 100 | 83 | 100 | 100 |
| 1 | `cli-table3@0.6.5` | Bruno | 100 | 100 | 81 | 100 | 100 |
| 1 | `content-disposition@2.0.1` | Express | 100 | 100 | 86 | 100 | 100 |
| 1 | `content-type@2.1.0` | Express | 100 | 90 | 88 | 100 | 100 |
| 1 | `cookie-signature@1.2.2` | Express | 100 | 69 | 82 | 100 | 100 |
| 1 | `cookie@0.7.2` | Express | 100 | 99 | 90 | 100 | 100 |
| 1 | `csv-parse@5.6.0` | Bruno | 100 | 96 | 85 | 99 | 100 |
| 1 | `debug@4.4.3` | Los dos | 99 | 100 | 81 | 100 | 100 |
| 1 | `decomment@0.9.5` | Bruno | 100 | 100 | 80 | 100 | 100 |
| 1 | `depd@2.0.0` | Express | 99 | 100 | 75 | 100 | 100 |
| 1 | `encodeurl@2.0.1` | Express | 100 | 99 | 89 | 100 | 100 |
| 1 | `escape-html@1.0.3` | Express | 100 | 78 | 75 | 100 | 100 |
| 1 | `etag@1.8.1` | Express | 100 | 99 | 75 | 100 | 100 |
| 1 | `finalhandler@2.1.1` | Express | 99 | 100 | 84 | 100 | 100 |
| 1 | `form-data@4.0.4` | Bruno | 99 | 100 | 87 | 84 | 100 |
| 1 | `fresh@2.0.0` | Express | 100 | 99 | 83 | 100 | 100 |
| 1 | `fs-extra@10.1.0` | Bruno | 99 | 100 | 88 | 100 | 100 |
| 1 | `http-errors@2.0.1` | Express | 99 | 100 | 84 | 100 | 100 |
| 1 | `http-proxy-agent@7.0.2` | Bruno | 99 | 82 | 82 | 100 | 100 |
| 1 | `https-proxy-agent@7.0.6` | Bruno | 99 | 91 | 82 | 100 | 100 |
| 1 | `iconv-lite@0.6.3` | Bruno | 100 | 100 | 93 | 100 | 100 |
| 1 | `js-yaml@4.3.1` | Bruno | 100 | 100 | 92 | 84 | 100 |
| 1 | `jsesc@3.1.0` | Bruno | 100 | 100 | 79 | 100 | 100 |
| 1 | `lodash@4.18.1` | Bruno | 100 | 86 | 82 | 100 | 100 |
| 1 | `merge-descriptors@2.0.0` | Express | 100 | 80 | 79 | 100 | 100 |
| 1 | `mime-types@3.0.2` | Los dos | 100 | 100 | 85 | 100 | 100 |
| 1 | `on-finished@2.4.2` | Express | 100 | 100 | 86 | 100 | 100 |
| 1 | `once@1.4.0` | Express | 100 | 91 | 75 | 100 | 100 |
| 1 | `parseurl@1.3.3` | Express | 100 | 99 | 75 | 100 | 100 |
| 1 | `proxy-addr@2.0.8` | Express | 99 | 100 | 84 | 100 | 100 |
| 1 | `qs@6.17.1` | Los dos | 99 | 100 | 96 | 100 | 100 |
| 1 | `range-parser@1.3.0` | Express | 100 | 95 | 85 | 100 | 100 |
| 1 | `router@2.2.0` | Express | 99 | 100 | 83 | 100 | 100 |
| 1 | `send@1.2.1` | Express | 99 | 100 | 85 | 100 | 100 |
| 1 | `serve-static@2.2.1` | Express | 99 | 99 | 84 | 100 | 100 |
| 1 | `socks-proxy-agent@8.0.5` | Bruno | 99 | 84 | 83 | 100 | 100 |
| 1 | `statuses@2.0.2` | Express | 100 | 99 | 83 | 100 | 100 |
| 1 | `type-is@2.1.0` | Express | 99 | 100 | 87 | 100 | 100 |
| 1 | `vary@1.1.2` | Express | 100 | 99 | 75 | 100 | 100 |
| 1 | `xmlbuilder@15.1.1` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 1 | `yargs@17.7.3` | Bruno | 98 | 100 | 87 | 100 | 100 |
| 2 | `@aws-sdk/client-cognito-identity@3.1019.0` | Bruno | 98 | 99 | 97 | 100 | 100 |
| 2 | `@aws-sdk/client-secrets-manager@3.1014.0` | Bruno | 98 | 99 | 97 | 100 | 100 |
| 2 | `@aws-sdk/client-sts@3.1163.0` | Bruno | 99 | 100 | 97 | 100 | 100 |
| 2 | `@aws-sdk/core@3.980.0` | Bruno | 99 | 85 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-cognito-identity@3.972.80` | Bruno | 99 | 76 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-env@3.972.81` | Bruno | 98 | 72 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-http@3.972.83` | Bruno | 98 | 72 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-ini@3.973.26` | Bruno | 99 | 76 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-login@3.972.88` | Bruno | 99 | 75 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-node@3.972.93` | Bruno | 98 | 100 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-process@3.972.81` | Bruno | 99 | 74 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-sso@3.973.25` | Bruno | 99 | 76 | 97 | 100 | 100 |
| 2 | `@aws-sdk/credential-provider-web-identity@3.972.87` | Bruno | 98 | 75 | 97 | 100 | 100 |
| 2 | `@aws-sdk/nested-clients@3.998.0` | Bruno | 99 | 78 | 97 | 100 | 100 |
| 2 | `@aws-sdk/types@3.975.0` | Bruno | 100 | 72 | 93 | 100 | 100 |
| 2 | `@azure/core-rest-pipeline@1.25.0` | Bruno | 99 | 100 | 90 | 100 | 100 |
| 2 | `@azure/identity@4.14.1` | Bruno | 93 | 100 | 96 | 100 | 100 |
| 2 | `@azure/keyvault-secrets@4.12.0` | Bruno | 99 | 100 | 90 | 100 | 100 |
| 2 | `@colors/colors@1.5.0` | Bruno | 100 | 100 | 82 | 100 | 100 |
| 2 | `@faker-js/faker@9.9.0` | Bruno | 99 | 88 | 85 | 84 | 80 |
| 2 | `@google-cloud/secret-manager@6.3.0` | Bruno | 99 | 100 | 91 | 100 | 100 |
| 2 | `@grpc/grpc-js@1.14.7` | Bruno | 97 | 97 | 96 | 100 | 100 |
| 2 | `@grpc/proto-loader@0.7.15` | Bruno | 99 | 100 | 83 | 100 | 100 |
| 2 | `@smithy/config-resolver@4.7.2` | Bruno | 100 | 58 | 89 | 100 | 100 |
| 2 | `@smithy/core@3.39.0` | Bruno | 100 | 90 | 97 | 100 | 100 |
| 2 | `@smithy/credential-provider-imds@4.5.2` | Bruno | 98 | 77 | 89 | 100 | 100 |
| 2 | `@smithy/node-config-provider@4.6.2` | Bruno | 99 | 51 | 89 | 100 | 100 |
| 2 | `@smithy/node-http-handler@4.5.3` | Bruno | 99 | 74 | 95 | 100 | 100 |
| 2 | `@smithy/property-provider@4.5.2` | Bruno | 100 | 53 | 89 | 100 | 100 |
| 2 | `@smithy/types@4.20.0` | Bruno | 100 | 100 | 94 | 100 | 100 |
| 2 | `@types/nanoid@2.1.0` | Bruno | 100 | 69 | 75 | 100 | 100 |
| 2 | `@types/qs@6.15.1` | Bruno | 100 | 69 | 81 | 100 | 100 |
| 2 | `@usebruno/query@0.3.0` | Bruno | 90 | 76 | 89 | 100 | 100 |
| 2 | `@usebruno/schema@0.31.0` | Bruno | 92 | 80 | 93 | 100 | 100 |
| 2 | `agent-base@7.1.4` | Bruno | 99 | 90 | 81 | 100 | 100 |
| 2 | `ajv-formats@2.1.1` | Bruno | 99 | 100 | 83 | 100 | 100 |
| 2 | `ajv@8.20.0` | Bruno | 99 | 100 | 84 | 100 | 100 |
| 2 | `ansi-styles@4.3.0` | Bruno | 100 | 100 | 80 | 100 | 100 |
| 2 | `arcsecond@5.0.0` | Bruno | 100 | 100 | 80 | 100 | 100 |
| 2 | `argparse@2.0.1` | Bruno | 100 | 96 | 89 | 100 | 100 |
| 2 | `assertion-error@1.1.0` | Bruno | 100 | 79 | 79 | 100 | 100 |
| 2 | `asynckit@0.4.0` | Bruno | 100 | 100 | 80 | 100 | 100 |
| 2 | `atob@2.1.2` | Bruno | 100 | 81 | 75 | 100 | 100 |
| 2 | `aws4@1.13.2` | Bruno | 100 | 100 | 80 | 100 | 100 |
| 2 | `btoa@1.2.1` | Bruno | 100 | 74 | 75 | 100 | 100 |
| 2 | `bytes@3.1.2` | Express | 100 | 99 | 81 | 100 | 100 |
| 2 | `chai-string@1.6.0` | Bruno | 100 | 100 | 79 | 100 | 100 |
| 2 | `check-error@1.0.3` | Bruno | 99 | 99 | 80 | 100 | 100 |
| 2 | `cheerio@1.2.0` | Bruno | 99 | 100 | 82 | 100 | 100 |
| 2 | `cliui@8.0.1` | Bruno | 99 | 100 | 81 | 100 | 100 |
| 2 | `combined-stream@1.0.8` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 2 | `crypto-js@4.2.0` | Bruno | 100 | 100 | 50 | 100 | 100 |
| 2 | `deep-eql@4.1.4` | Bruno | 99 | 98 | 79 | 100 | 100 |
| 2 | `des.js@1.1.0` | Bruno | 100 | 78 | 79 | 100 | 100 |
| 2 | `dev-null@0.1.1` | Bruno | 100 | 77 | 75 | 100 | 100 |
| 2 | `dotenv@16.6.1` | Bruno | 99 | 100 | 95 | 100 | 100 |
| 2 | `ee-first@1.1.1` | Express | 100 | 92 | 75 | 100 | 100 |
| 2 | `es-define-property@1.0.1` | Los dos | 66 | 81 | 53 | 100 | 100 |
| 2 | `es-set-tostringtag@2.1.0` | Bruno | 66 | 84 | 53 | 100 | 100 |
| 2 | `escalade@3.2.0` | Bruno | 99 | 99 | 79 | 100 | 100 |
| 2 | `esprima@4.0.1` | Bruno | 99 | 86 | 75 | 100 | 100 |
| 2 | `follow-redirects@1.16.2` | Bruno | 100 | 100 | 88 | 100 | 100 |
| 2 | `form-data@4.0.6` | Bruno | 99 | 100 | 87 | 100 | 100 |
| 2 | `forwarded@0.2.0` | Express | 100 | 83 | 75 | 100 | 100 |
| 2 | `get-caller-file@2.0.5` | Bruno | 100 | 74 | 75 | 100 | 100 |
| 2 | `get-func-name@2.0.2` | Bruno | 99 | 99 | 79 | 100 | 100 |
| 2 | `google-auth-library@10.5.0` | Bruno | 93 | 100 | 94 | 100 | 100 |
| 2 | `google-protobuf@4.0.3` | Bruno | 99 | 99 | 84 | 100 | 100 |
| 2 | `graceful-fs@4.2.11` | Bruno | 99 | 100 | 79 | 100 | 100 |
| 2 | `grpc-js-reflection-client@1.4.3` | Bruno | 99 | 100 | 92 | 100 | 100 |
| 2 | `handlebars@4.7.10` | Bruno | 99 | 100 | 89 | 100 | 100 |
| 2 | `hasown@2.0.4` | Bruno | 66 | 73 | 54 | 100 | 100 |
| 2 | `https-proxy-agent@5.0.1` | Bruno | 99 | 100 | 82 | 100 | 100 |
| 2 | `iconv-lite@0.7.3` | Express | 100 | 100 | 93 | 100 | 100 |
| 2 | `inherits@2.0.4` | Los dos | 100 | 76 | 75 | 100 | 100 |
| 2 | `ipaddr.js@1.9.1` | Express | 100 | 100 | 82 | 100 | 100 |
| 2 | `is-ip@5.0.1` | Bruno | 100 | 86 | 79 | 100 | 100 |
| 2 | `is-promise@4.0.0` | Express | 100 | 66 | 75 | 100 | 100 |
| 2 | `js-md4@0.3.2` | Bruno | 100 | 93 | 75 | 100 | 100 |
| 2 | `jscodeshift@17.4.0` | Bruno | 98 | 100 | 83 | 100 | 100 |
| 2 | `json-query@2.2.2` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 2 | `jsonfile@6.2.1` | Bruno | 100 | 99 | 82 | 100 | 100 |
| 2 | `jsonwebtoken@9.0.3` | Bruno | 99 | 100 | 80 | 100 | 100 |
| 2 | `loupe@2.3.7` | Bruno | 99 | 90 | 80 | 100 | 100 |
| 2 | `media-typer@1.1.1` | Express | 100 | 98 | 84 | 100 | 100 |
| 2 | `mime-db@1.54.0` | Los dos | 100 | 100 | 84 | 100 | 100 |
| 2 | `mime-types@2.1.35` | Bruno | 100 | 99 | 85 | 100 | 100 |
| 2 | `moment@2.31.0` | Bruno | 100 | 97 | 87 | 100 | 100 |
| 2 | `ms@2.1.3` | Los dos | 100 | 86 | 84 | 100 | 100 |
| 2 | `nanoid@3.3.18` | Bruno | 100 | 81 | 90 | 100 | 100 |
| 2 | `negotiator@1.1.0` | Express | 100 | 100 | 85 | 100 | 100 |
| 2 | `node-fetch@2.7.0` | Bruno | 95 | 100 | 84 | 100 | 100 |
| 2 | `ohm-js@16.6.0` | Bruno | 93 | 99 | 88 | 100 | 100 |
| 2 | `pac-resolver@7.0.1` | Bruno | 99 | 88 | 82 | 100 | 100 |
| 2 | `path-to-regexp@8.4.2` | Express | 100 | 100 | 91 | 100 | 100 |
| 2 | `path@0.12.7` | Bruno | 100 | 73 | 75 | 100 | 100 |
| 2 | `pathval@1.1.1` | Bruno | 99 | 100 | 79 | 100 | 100 |
| 2 | `proxy-from-env@2.1.0` | Bruno | 99 | 100 | 81 | 100 | 100 |
| 2 | `quickjs-emscripten@0.32.0` | Bruno | 100 | 99 | 80 | 100 | 100 |
| 2 | `raw-body@3.0.2` | Express | 99 | 100 | 86 | 100 | 100 |
| 2 | `require-directory@2.1.1` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 2 | `safer-buffer@2.1.2` | Los dos | 67 | 100 | 50 | 100 | 100 |
| 2 | `setprototypeof@1.2.0` | Express | 100 | 73 | 75 | 100 | 100 |
| 2 | `shell-env@4.0.3` | Bruno | 99 | 86 | 81 | 100 | 100 |
| 2 | `side-channel@1.1.1` | Los dos | 66 | 87 | 53 | 100 | 100 |
| 2 | `socks@2.8.10` | Bruno | 99 | 100 | 82 | 100 | 100 |
| 2 | `string-width@4.2.3` | Bruno | 100 | 81 | 85 | 100 | 100 |
| 2 | `supports-color@7.2.0` | Bruno | 100 | 91 | 80 | 100 | 100 |
| 2 | `toidentifier@1.0.1` | Express | 100 | 82 | 83 | 100 | 100 |
| 2 | `tough-cookie@6.0.2` | Bruno | 99 | 100 | 83 | 100 | 100 |
| 2 | `tslib@2.9.1` | Bruno | 92 | 100 | 91 | 100 | 100 |
| 2 | `tv4@1.3.0` | Bruno | 100 | 100 | 75 | 100 | 80 |
| 2 | `type-detect@4.1.0` | Bruno | 99 | 100 | 79 | 100 | 100 |
| 2 | `universalify@2.0.1` | Bruno | 100 | 88 | 79 | 100 | 100 |
| 2 | `uuid@10.0.0` | Bruno | 99 | 100 | 50 | 99 | 100 |
| 2 | `wrappy@1.0.2` | Express | 100 | 73 | 75 | 100 | 100 |
| 2 | `ws@8.21.3` | Bruno | 99 | 100 | 92 | 100 | 100 |
| 2 | `xml-formatter@3.7.0` | Bruno | 99 | 100 | 81 | 100 | 100 |
| 2 | `xml2js@0.6.2` | Bruno | 100 | 100 | 80 | 100 | 100 |
| 2 | `y18n@5.0.8` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 2 | `yaml@2.3.4` | Bruno | 99 | 100 | 87 | 99 | 100 |
| 2 | `yargs-parser@21.1.1` | Bruno | 98 | 100 | 83 | 100 | 100 |
| 3 | `@aws-crypto/sha256-browser@5.2.0` | Bruno | 99 | 79 | 81 | 100 | 100 |
| 3 | `@aws-crypto/sha256-js@5.2.0` | Bruno | 100 | 80 | 81 | 100 | 100 |
| 3 | `@aws-sdk/middleware-host-header@3.972.56` | Bruno | 99 | 53 | 97 | 100 | 100 |
| 3 | `@aws-sdk/middleware-logger@3.972.55` | Bruno | 99 | 51 | 97 | 100 | 100 |
| 3 | `@aws-sdk/middleware-recursion-detection@3.972.57` | Bruno | 99 | 57 | 97 | 100 | 100 |
| 3 | `@aws-sdk/middleware-user-agent@3.972.85` | Bruno | 99 | 54 | 97 | 100 | 100 |
| 3 | `@aws-sdk/region-config-resolver@3.972.59` | Bruno | 99 | 62 | 97 | 100 | 100 |
| 3 | `@aws-sdk/signature-v4-multi-region@3.996.51` | Bruno | 99 | 79 | 97 | 100 | 100 |
| 3 | `@aws-sdk/token-providers@3.1162.0` | Bruno | 99 | 89 | 97 | 100 | 100 |
| 3 | `@aws-sdk/util-endpoints@3.996.54` | Bruno | 99 | 59 | 97 | 100 | 100 |
| 3 | `@aws-sdk/util-user-agent-browser@3.972.56` | Bruno | 99 | 63 | 97 | 100 | 100 |
| 3 | `@aws-sdk/util-user-agent-node@3.973.71` | Bruno | 99 | 60 | 97 | 100 | 100 |
| 3 | `@aws-sdk/xml-builder@3.972.42` | Bruno | 100 | 76 | 93 | 100 | 100 |
| 3 | `@aws/lambda-invoke-store@0.3.0` | Bruno | 99 | 100 | 88 | 100 | 100 |
| 3 | `@azure-rest/core-client@2.9.0` | Bruno | 99 | 83 | 89 | 100 | 100 |
| 3 | `@azure/abort-controller@2.2.0` | Bruno | 100 | 95 | 90 | 100 | 100 |
| 3 | `@azure/core-auth@1.11.0` | Bruno | 99 | 94 | 90 | 100 | 100 |
| 3 | `@azure/core-client@1.11.1` | Bruno | 99 | 88 | 90 | 100 | 100 |
| 3 | `@azure/core-lro@2.7.2` | Bruno | 99 | 99 | 90 | 100 | 100 |
| 3 | `@azure/core-paging@1.7.0` | Bruno | 100 | 89 | 90 | 100 | 100 |
| 3 | `@azure/core-process@1.0.0` | Bruno | 99 | 91 | 83 | 100 | 100 |
| 3 | `@azure/core-tracing@1.4.0` | Bruno | 100 | 82 | 90 | 100 | 100 |
| 3 | `@azure/core-util@1.14.0` | Bruno | 99 | 83 | 90 | 100 | 100 |
| 3 | `@azure/keyvault-common@2.1.1` | Bruno | 99 | 86 | 95 | 100 | 100 |
| 3 | `@azure/logger@1.4.0` | Bruno | 99 | 100 | 90 | 100 | 100 |
| 3 | `@azure/msal-browser@5.28.0` | Bruno | 99 | 100 | 96 | 100 | 100 |
| 3 | `@azure/msal-node@7.2.0` | Bruno | 97 | 100 | 96 | 100 | 100 |
| 3 | `@babel/core@7.29.13` | Bruno | 97 | 79 | 97 | 100 | 100 |
| 3 | `@babel/parser@7.29.13` | Bruno | 100 | 80 | 98 | 100 | 100 |
| 3 | `@babel/plugin-transform-class-properties@7.29.7` | Bruno | 100 | 64 | 88 | 100 | 100 |
| 3 | `@babel/plugin-transform-modules-commonjs@7.29.7` | Bruno | 100 | 73 | 88 | 100 | 100 |
| 3 | `@babel/plugin-transform-nullish-coalescing-operator@7.29.7` | Bruno | 100 | 69 | 88 | 100 | 100 |
| 3 | `@babel/plugin-transform-optional-chaining@7.29.7` | Bruno | 100 | 73 | 90 | 100 | 100 |
| 3 | `@babel/plugin-transform-private-methods@7.29.7` | Bruno | 100 | 64 | 88 | 100 | 100 |
| 3 | `@babel/preset-flow@7.29.7` | Bruno | 99 | 70 | 88 | 100 | 100 |
| 3 | `@babel/preset-typescript@7.29.7` | Bruno | 99 | 72 | 92 | 100 | 100 |
| 3 | `@babel/register@7.29.13` | Bruno | 98 | 75 | 91 | 100 | 100 |
| 3 | `@grpc/proto-loader@0.8.1` | Bruno | 99 | 100 | 83 | 100 | 100 |
| 3 | `@jitl/quickjs-wasmfile-debug-asyncify@0.32.0` | Bruno | 100 | 96 | 80 | 100 | 100 |
| 3 | `@jitl/quickjs-wasmfile-debug-sync@0.32.0` | Bruno | 100 | 96 | 80 | 100 | 100 |
| 3 | `@jitl/quickjs-wasmfile-release-asyncify@0.32.0` | Bruno | 100 | 95 | 80 | 100 | 100 |
| 3 | `@jitl/quickjs-wasmfile-release-sync@0.32.0` | Bruno | 100 | 92 | 80 | 100 | 100 |
| 3 | `@js-sdsl/ordered-map@4.4.2` | Bruno | 99 | 99 | 81 | 100 | 100 |
| 3 | `@smithy/fetch-http-handler@5.8.1` | Bruno | 99 | 72 | 94 | 100 | 100 |
| 3 | `@smithy/hash-node@4.5.2` | Bruno | 99 | 50 | 89 | 100 | 100 |
| 3 | `@smithy/invalid-dependency@4.5.2` | Bruno | 99 | 51 | 89 | 100 | 100 |
| 3 | `@smithy/middleware-content-length@4.5.2` | Bruno | 99 | 51 | 89 | 100 | 100 |
| 3 | `@smithy/middleware-endpoint@4.7.2` | Bruno | 100 | 54 | 89 | 100 | 100 |
| 3 | `@smithy/middleware-retry@4.8.2` | Bruno | 100 | 58 | 89 | 100 | 100 |
| 3 | `@smithy/middleware-serde@4.5.2` | Bruno | 100 | 52 | 89 | 100 | 100 |
| 3 | `@smithy/middleware-stack@4.5.2` | Bruno | 99 | 50 | 89 | 100 | 100 |
| 3 | `@smithy/node-http-handler@4.14.2` | Bruno | 99 | 75 | 96 | 100 | 100 |
| 3 | `@smithy/protocol-http@5.6.2` | Bruno | 100 | 54 | 89 | 100 | 100 |
| 3 | `@smithy/querystring-builder@4.5.2` | Bruno | 99 | 50 | 97 | 100 | 100 |
| 3 | `@smithy/signature-v4@5.7.5` | Bruno | 100 | 75 | 93 | 100 | 100 |
| 3 | `@smithy/smithy-client@4.15.2` | Bruno | 100 | 63 | 89 | 100 | 100 |
| 3 | `@smithy/url-parser@4.5.2` | Bruno | 99 | 50 | 89 | 100 | 100 |
| 3 | `@smithy/util-base64@4.6.2` | Bruno | 99 | 51 | 89 | 100 | 100 |
| 3 | `@smithy/util-body-length-browser@4.5.2` | Bruno | 99 | 50 | 89 | 100 | 100 |
| 3 | `@smithy/util-body-length-node@4.5.2` | Bruno | 99 | 50 | 89 | 100 | 100 |
| 3 | `@smithy/util-defaults-mode-browser@4.6.2` | Bruno | 99 | 51 | 89 | 100 | 100 |
| 3 | `@smithy/util-defaults-mode-node@4.5.2` | Bruno | 99 | 51 | 89 | 100 | 100 |
| 3 | `@smithy/util-endpoints@3.7.2` | Bruno | 100 | 54 | 89 | 100 | 100 |
| 3 | `@smithy/util-middleware@4.5.2` | Bruno | 99 | 51 | 89 | 100 | 100 |
| 3 | `@smithy/util-retry@4.6.2` | Bruno | 100 | 57 | 89 | 100 | 100 |
| 3 | `@smithy/util-utf8@4.5.2` | Bruno | 100 | 52 | 89 | 100 | 100 |
| 3 | `@types/node@26.6.6` | Bruno | 100 | 80 | 94 | 100 | 100 |
| 3 | `@typespec/ts-http-runtime@0.3.9` | Bruno | 99 | 100 | 89 | 100 | 100 |
| 3 | `agent-base@6.0.2` | Bruno | 99 | 100 | 81 | 100 | 100 |
| 3 | `base64-js@1.5.1` | Bruno | 100 | 77 | 75 | 100 | 100 |
| 3 | `bowser@2.15.0` | Bruno | 99 | 100 | 87 | 100 | 100 |
| 3 | `cheerio-select@2.1.0` | Bruno | 99 | 75 | 79 | 100 | 100 |
| 3 | `color-convert@2.0.1` | Bruno | 100 | 90 | 80 | 100 | 100 |
| 3 | `default-shell@2.2.0` | Bruno | 100 | 74 | 79 | 100 | 100 |
| 3 | `degenerator@5.0.1` | Bruno | 99 | 100 | 82 | 100 | 100 |
| 3 | `delayed-stream@1.0.0` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 3 | `dom-serializer@2.0.0` | Bruno | 99 | 100 | 81 | 100 | 100 |
| 3 | `domhandler@5.0.3` | Bruno | 100 | 98 | 81 | 100 | 100 |
| 3 | `domutils@3.2.2` | Bruno | 98 | 81 | 82 | 100 | 100 |
| 3 | `ecdsa-sig-formatter@1.0.11` | Bruno | 100 | 88 | 75 | 100 | 100 |
| 3 | `emoji-regex@8.0.0` | Bruno | 100 | 91 | 84 | 100 | 100 |
| 3 | `encoding-sniffer@0.2.1` | Bruno | 99 | 91 | 81 | 100 | 100 |
| 3 | `es-errors@1.3.0` | Los dos | 100 | 84 | 79 | 100 | 100 |
| 3 | `execa@5.1.1` | Bruno | 99 | 100 | 92 | 100 | 100 |
| 3 | `fast-deep-equal@3.1.3` | Bruno | 100 | 99 | 75 | 100 | 100 |
| 3 | `fast-uri@3.1.9` | Bruno | 100 | 100 | 98 | 100 | 100 |
| 3 | `flow-parser@0.338.0` | Bruno | 100 | 92 | 99 | 100 | 100 |
| 3 | `function-bind@1.1.2` | Bruno | 66 | 83 | 54 | 100 | 100 |
| 3 | `gaxios@7.3.1` | Bruno | 98 | 100 | 92 | 100 | 100 |
| 3 | `gcp-metadata@8.1.4` | Bruno | 98 | 100 | 94 | 100 | 100 |
| 3 | `get-intrinsic@1.3.0` | Bruno | 98 | 91 | 80 | 100 | 100 |
| 3 | `google-gax@5.0.8` | Bruno | 98 | 74 | 97 | 100 | 100 |
| 3 | `google-logging-utils@1.2.0` | Bruno | 99 | 92 | 87 | 100 | 100 |
| 3 | `gtoken@8.0.0` | Bruno | 99 | 100 | 84 | 100 | 100 |
| 3 | `has-flag@4.0.0` | Bruno | 100 | 94 | 75 | 100 | 100 |
| 3 | `has-tostringtag@1.0.2` | Bruno | 66 | 82 | 53 | 100 | 100 |
| 3 | `htmlparser2@10.1.0` | Bruno | 99 | 100 | 82 | 100 | 100 |
| 3 | `ip-address@10.7.6` | Bruno | 100 | 100 | 94 | 100 | 100 |
| 3 | `ip-regex@5.0.0` | Bruno | 100 | 91 | 79 | 100 | 100 |
| 3 | `is-fullwidth-code-point@3.0.0` | Bruno | 100 | 77 | 79 | 100 | 100 |
| 3 | `json-schema-traverse@1.0.0` | Bruno | 100 | 99 | 75 | 100 | 100 |
| 3 | `jws@4.0.1` | Bruno | 100 | 100 | 81 | 100 | 100 |
| 3 | `lodash.camelcase@4.3.0` | Bruno | 100 | 75 | 75 | 100 | 100 |
| 3 | `lodash.includes@4.3.0` | Bruno | 100 | 75 | 75 | 100 | 100 |
| 3 | `lodash.isboolean@3.0.3` | Bruno | 100 | 70 | 75 | 100 | 100 |
| 3 | `lodash.isinteger@4.0.4` | Bruno | 100 | 73 | 75 | 100 | 100 |
| 3 | `lodash.isnumber@3.0.3` | Bruno | 100 | 70 | 75 | 100 | 100 |
| 3 | `lodash.isplainobject@4.0.6` | Bruno | 100 | 72 | 75 | 100 | 100 |
| 3 | `lodash.isstring@4.0.1` | Bruno | 100 | 71 | 75 | 100 | 100 |
| 3 | `lodash.once@4.1.1` | Bruno | 100 | 73 | 75 | 100 | 100 |
| 3 | `long@5.3.2` | Bruno | 100 | 100 | 80 | 100 | 100 |
| 3 | `mime-db@1.52.0` | Bruno | 100 | 100 | 84 | 100 | 100 |
| 3 | `minimalistic-assert@1.0.1` | Bruno | 100 | 54 | 75 | 100 | 100 |
| 3 | `minimist@1.2.8` | Bruno | 100 | 100 | 83 | 100 | 100 |
| 3 | `neo-async@2.6.2` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 3 | `netmask@2.1.1` | Bruno | 100 | 100 | 81 | 100 | 100 |
| 3 | `object-inspect@1.13.4` | Los dos | 99 | 96 | 80 | 100 | 100 |
| 3 | `open@11.0.4` | Bruno | 99 | 100 | 86 | 100 | 100 |
| 3 | `parse5-htmlparser2-tree-adapter@7.1.0` | Bruno | 100 | 79 | 84 | 100 | 100 |
| 3 | `parse5-parser-stream@7.1.2` | Bruno | 100 | 79 | 90 | 100 | 100 |
| 3 | `parse5@7.3.0` | Bruno | 100 | 85 | 90 | 100 | 100 |
| 3 | `picocolors@1.1.1` | Bruno | 100 | 72 | 79 | 100 | 100 |
| 3 | `picomatch@4.0.7` | Bruno | 100 | 100 | 87 | 100 | 100 |
| 3 | `process@0.11.10` | Bruno | 100 | 76 | 75 | 100 | 100 |
| 3 | `protobufjs@7.6.6` | Bruno | 93 | 100 | 93 | 100 | 100 |
| 3 | `protobufjs@8.8.1` | Bruno | 99 | 100 | 95 | 100 | 100 |
| 3 | `quickjs-emscripten-core@0.32.0` | Bruno | 100 | 98 | 80 | 100 | 100 |
| 3 | `recast@0.23.21` | Bruno | 99 | 100 | 86 | 100 | 100 |
| 3 | `require-from-string@2.0.2` | Bruno | 100 | 80 | 75 | 100 | 100 |
| 3 | `sax@1.6.1` | Bruno | 100 | 100 | 82 | 100 | 100 |
| 3 | `semver@7.8.6` | Bruno | 100 | 100 | 95 | 100 | 100 |
| 3 | `side-channel-list@1.0.1` | Los dos | 99 | 88 | 80 | 100 | 100 |
| 3 | `side-channel-map@1.0.1` | Los dos | 99 | 87 | 79 | 100 | 100 |
| 3 | `side-channel-weakmap@1.0.2` | Los dos | 99 | 87 | 79 | 100 | 100 |
| 3 | `smart-buffer@4.2.0` | Bruno | 100 | 100 | 75 | 100 | 100 |
| 3 | `source-map@0.6.1` | Bruno | 100 | 100 | 86 | 100 | 100 |
| 3 | `strip-ansi@6.0.1` | Bruno | 100 | 74 | 80 | 100 | 100 |
| 3 | `strip-ansi@7.2.0` | Bruno | 100 | 72 | 80 | 100 | 100 |
| 3 | `super-regex@0.2.0` | Bruno | 100 | 93 | 79 | 100 | 100 |
| 3 | `tldts@7.4.19` | Bruno | 100 | 100 | 94 | 100 | 100 |
| 3 | `tmp@0.2.7` | Bruno | 100 | 100 | 81 | 100 | 100 |
| 3 | `uglify-js@3.19.3` | Bruno | 99 | 100 | 83 | 100 | 100 |
| 3 | `undici@7.30.2` | Bruno | 92 | 99 | 97 | 100 | 100 |
| 3 | `unpipe@1.0.0` | Express | 100 | 78 | 75 | 100 | 100 |
| 3 | `util@0.10.4` | Bruno | 100 | 73 | 84 | 100 | 100 |
| 3 | `whatwg-mimetype@4.0.0` | Bruno | 100 | 100 | 85 | 100 | 100 |
| 3 | `whatwg-url@5.0.0` | Bruno | 100 | 90 | 94 | 100 | 100 |
| 3 | `wordwrap@1.0.0` | Bruno | 100 | 89 | 75 | 100 | 100 |
| 3 | `wrap-ansi@7.0.0` | Bruno | 100 | 97 | 84 | 100 | 100 |
| 3 | `write-file-atomic@5.0.1` | Bruno | 99 | 97 | 85 | 100 | 100 |
| 3 | `xml-parser-xo@4.1.6` | Bruno | 100 | 100 | 83 | 100 | 100 |
| 3 | `xmlbuilder@11.0.1` | Bruno | 100 | 97 | 75 | 100 | 100 |
| 3 | `yup@0.32.11` | Bruno | 99 | 100 | 80 | 100 | 100 |

## Comprobación

Con `pnpm install` hecho, `pnpm start` en una terminal y `pnpm http` en otra:

1. `pnpm bruno` pasa en verde y termina con código 0.
2. `curl http://127.0.0.1:3001/users` da la misma lista antes y después de `pnpm bruno`, y un segundo `pnpm bruno` sigue en verde.
3. Se para solo `pnpm start`. `pnpm bruno offline` da todos los 500 con su mensaje.
4. Con la base en marcha y Ollama con `llama3.2`, `pnpm bruno ai` da 200 con los tres recuentos.
5. `curl -H "Host: localhost:3001" http://127.0.0.1:3001/users` da 403.
6. `curl -H "Origin: https://ejemplo.com" http://127.0.0.1:3001/users` da 403.
7. `POST /users` con un JSON mal formado da 400 sin cuerpo.
8. Con otro proceso en el puerto 3001, `pnpm http` da el aviso de puerto ocupado.
9. Se rompe un test a propósito y `pnpm bruno` termina con un código distinto de 0. Se deshace el cambio.
10. Se abre la colección en la app de Bruno y se lanza una petición.
11. `pnpm format` y `pnpm lint` pasan.

## Riesgo

- Los paquetes aún no se han instalado y nada de esto se ha lanzado.
- No se ha comprobado si la app de escritorio de Bruno envía `Origin`. Si lo envía, recibiría 403 y el paso 10 lo descubriría. En ese caso se para, se avisa a Diego y se corrige este plan.
- Si `bru run` o algún script de la colección no se comporta como en los proyectos de los compañeros en esta versión, se para, se avisa a Diego y se corrige este plan.

## Decisión ya tomada

Diego ha aceptado `@usebruno/cli@4.3.0` con `axios@1.18.0` y los avisos del resumen, sin `pnpm.overrides`. El CLI es de desarrollo y solo lanza contra `127.0.0.1` una colección de este repo. Las campañas y las alertas de Socket siguen sin dato. Se revisa al salir una versión del CLI con `axios` corregido.

## Sin preguntas abiertas

La constitución, el código actual y esta spec dicen lo mismo. «No se añaden paquetes para el servidor ni para la web» no aplica, porque este cliente no es ninguno de los dos, igual que Fastify en la API de Chrome.
