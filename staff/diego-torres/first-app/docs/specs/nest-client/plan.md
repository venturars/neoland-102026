# Plan — cliente de usuarios con una API Nest

Issue: #1040

**Nota:** dos puntos de este documento ya no están en vigor: que no hay página propia y que se rechaza todo `Origin`. Lo vigente está en `docs/specs/nest-swagger-docs/`.

Funcionalidad nueva, solo en `src/clients/nest/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje nuevo. `src/db/server.js`, `src/queries/` y los demás clientes no cambian.

La referencia es la API de la extensión de Chrome de este proyecto, `src/clients/chrome/server.js`: mismas rutas, mismos estados y misma tabla de errores. Por decisión de Diego, no se toma como referencia el cliente Nest de otro alumno.

Hay paquetes nuevos. El resultado de Socket está abajo y Diego lo ha aceptado.

## Cómo funciona

```
petición HTTP
  → src/clients/nest/ (127.0.0.1:3003)
    → src/logic/
      → src/queries/
        → src/db/server.js (127.0.0.1:3000)
```

Node no entiende los decoradores `@` de Nest. Por eso `pnpm nest` lanza `scripts/nest.js`, que traduce `src/logic/`, `src/queries/` y `src/clients/nest/` con Babel a `dist/` y arranca el resultado. Las rutas entre carpetas no cambian, así que no hay que reescribir ningún import. No hay TypeScript. Quien prueba la app lanza `pnpm start` en una terminal y `pnpm nest` en otra.

## Ficheros

Se crean en `src/clients/nest/`:

- `main.js` — crea la app de Nest sin sus avisos de consola (`logger: false`), añade la comprobación de `Host` y `Origin` y escucha solo en `127.0.0.1:3003`. Avisa si el puerto está ocupado, igual que `chrome/server.js`.
- `app.module.js` — une el controlador, el servicio y el filtro.
- `users.controller.js` — las rutas. Lee el id y el cuerpo, y llama al servicio. No valida.
- `users.service.js` — llama a `src/logic/`. Importa fichero a fichero, no desde `logic/index.js`, para no cargar `openai`.
- `logic-exception.filter.js` — traduce cada fallo a su estado y su mensaje.

Se crean en la raíz de `first-app`:

- `scripts/nest.js` — borra `dist/`, traduce con Babel y arranca la API. Borra desde Node porque `rm -rf` no existe en los scripts de pnpm en Windows.
- `babel.config.json` — `@babel/preset-env` con `targets.node` `current` y `modules` `false`, y `@babel/plugin-proposal-decorators` con `version` `legacy`.
- `.gitignore` — `dist/`.

Se tocan:

- `package.json` — los paquetes de abajo, el script `"nest": "node scripts/nest.js"` y `src/clients/nest/**/*.js` en `format`.
- `pnpm-lock.yaml` — lo actualiza `pnpm install`.
- `eslint.config.js` — lee `src/clients/nest/` con `@babel/eslint-parser` e ignora `dist/`. Todo el cliente pasa lint.
- `AGENTS.md` — dependencias, comando `pnpm nest`, alcance de `pnpm format` y clientes que necesitan el servidor.
- `docs/ARCHITECTURE.md` — filas en «Quién sabe qué» y la capa de clientes.
- `docs/TREE.md` — `clients/nest/`, `scripts/nest.js` y `babel.config.json`.
- `docs/STYLE.md` — aviso: `src/clients/nest/` usa clases y decoradores porque Nest los exige. El resto del proyecto sigue igual.

El controlador recibe el servicio con `@Dependencies(UsersService)`, porque el modo `legacy` de Babel no admite decoradores en los parámetros.

El código lleva líneas cortas y comentarios por bloques en castellano, también encima de cada import y de cada decorador que no se entienda solo. Cada comentario es una frase sencilla, fácil de leer y sin jerga de Nest sin explicar. Por ejemplo: `// Si no conocemos el error, respondemos que la acción ha fallado.`

## Paquetes

- `dependencies`: `@nestjs/common@12.3.3`, `@nestjs/core@12.3.3`, `@nestjs/platform-express@12.3.3`, `reflect-metadata@0.2.2` y `rxjs@7.8.2`.
- `devDependencies`: `@babel/cli@8.1.0`, `@babel/core@8.1.0`, `@babel/eslint-parser@8.0.7`, `@babel/plugin-proposal-decorators@8.0.2` y `@babel/preset-env@8.0.7`.

## API

| Método y ruta | Operación | Respuesta buena |
| --- | --- | --- |
| `POST /users` | `createUser({ name, email })` | 201, usuario |
| `GET /users` | `listUsers()` | 200, array de usuarios |
| `GET /users/:id` | `findUserById(id)` | 200, usuario |
| `PATCH /users/:id` | `updateUser(id, changes)` | 200, usuario |
| `DELETE /users/:id` | `deleteUser(id)` | 204, sin cuerpo |

- Sin cuerpo, se usa `body ?? {}`, como en Chrome.
- En `PATCH`, un campo que no llega no entra en `changes`, y `updateUser` conserva el valor guardado.
- Otra ruta responde 404 sin cuerpo.
- El id es el texto de la ruta, como en Chrome.

## Firma

No hay función nueva en `src/logic/`. El cliente usa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`.

## SQL

No hay SQL.

## Errores

Un fallo responde `{ "message": "<mensaje>" }`.

| Fallo de la spec | Mensaje de `docs/ERRORS.md` | Estado |
| --- | --- | --- |
| El nombre queda vacío | `Name is empty` | 400 |
| El email no vale | `Email is invalid` | 400 |
| El email es de otro usuario | `Email is already used` | 409 |
| El usuario no está | `User not found` | 404 |
| No se llega al crear | `Could not create the user` | 500 |
| No se llega al listar | `Could not list the users` | 500 |
| No se llega al ver uno | `Could not find the user` | 500 |
| No se llega al modificar | `Could not update the user` | 500 |
| No se llega al borrar | `Could not delete the user` | 500 |

Si lo lanzado no está en la tabla, el filtro responde 500 con el `Could not …` de la acción. La acción se elige por el método y la ruta de la petición.

Los errores propios de la petición no llevan mensaje, porque `docs/ERRORS.md` no tiene uno para ellos. Responden con su estado y sin cuerpo:

- Ruta que no existe: 404.
- JSON mal formado: 400.

Un cuerpo que no es JSON no se lee y se trata como vacío, así que crear responde `Name is empty`. Es una diferencia con Chrome, que responde 415, y no añade ningún mensaje.

## Protección de la API

Un middleware, añadido en `main.js`, comprueba cada petición antes de atenderla, con las mismas ideas que `chrome/server.js`:

- Si la cabecera `Host` no es `127.0.0.1:3003`, responde 403 sin cuerpo. Protege del DNS rebinding.
- Si llega `Origin`, responde 403 sin cuerpo. Esta API no tiene página, así que ningún origen tiene permiso. Sin `Origin` se atiende, que es lo que hace curl.

No da permiso CORS a nadie. Esto no es autenticación: un programa de este ordenador puede falsear estas cabeceras.

## Comprobado al implementar

`@Bind` y `@Dependencies` funcionan traducidos con Babel. El JSON mal formado llega al filtro y responde 400 sin cuerpo.

Con `src/db/server.js` parado de verdad y `pnpm nest` en marcha, las cinco rutas dan 500 con su `Could not …`.

El filtro responde con el mensaje que lanza la lógica. Solo elige el `Could not …` por método y ruta si lo lanzado no viene de la lógica.

La comprobación de `Host` y `Origin` va antes de leer el cuerpo: con `Origin` o un `Host` ajeno y un JSON roto responde 403, no 400, y con un cuerpo que no termina responde 403 sin esperarlo. `app.use` se registra al crear la app, y Nest no añade su lector del cuerpo hasta `init()`, dentro de `listen`.

En marcha, la API ejecuta la copia de `dist/`. Comparada con `src/` sin espacios, comentarios ni comas finales, 18 de 19 ficheros de `logic/` y `queries/` son iguales. `users-gender-count.js` difiere en el formato que Babel reescribe, y la API no lo carga.

`pnpm format` cambia los saltos de línea de CRLF a LF en todos los ficheros de su alcance, con `core.autocrlf` activo. Esos cambios no son de esta tarea y se restauran.

`pnpm audit` da un aviso moderado, que llega por `eslint` y no es de Nest. No hay ninguno alto ni crítico.

Lint revisa los ficheros con decoradores: un error puesto a propósito en `app.module.js` se detectó y se quitó.

## Cambio por la revisión de la PR

La primera versión traducía con `@swc/core` y dejaba cuatro ficheros fuera de lint. La revisión de la PR #1041 pidió incluirlos y propuso Babel, y Diego decidió cambiar. Desaparecen `bootstrap.mjs`, `@swc/core` y el cambio de rutas de los imports.

## Pruebas

No hay tests en el proyecto. Se prueba por HTTP contra el 3003, con `pnpm start` y `pnpm nest` en marcha:

1. El ejemplo de Ada de la spec.
2. Cada error de la tabla, con su estado y su mensaje. Con `pnpm start` parado, las cinco rutas dan 500 con su `Could not …`.
3. `GET /no-existe` da 404 sin cuerpo. JSON mal formado da 400 sin cuerpo. `Host` ajeno u `Origin` presente dan 403.
4. `pnpm chrome` sigue respondiendo igual en el 3002.
5. `pnpm format` y `pnpm lint` pasan.

## Socket

Consultas propias del 2026-11-05 a `https://mcp.socket.dev/`, sin iniciar sesión, porque `SOCKET_API_TOKEN` no está definido. Las versiones salen de `pnpm install --lockfile-only --ignore-scripts` en una copia temporal. Se comprobaron antes de instalar en el proyecto.

Son 200 paquetes nuevos hasta 3 capas: 74 por Nest y 126 por Babel. Los que ya estaban en esa versión no se vuelven a mirar. Los pares opcionales `class-validator` y `class-transformer` no se instalan.

- **Stats:** salen de la herramienta `depscore`. Ninguna está por debajo de 50. La más baja es 50.
- **`append-field@1.0.0`: sin datos.** Socket responde con `append-field@2.0.0`, también al preguntar solo por él. El árbol instala la 1.0.0.
- **Alertas: sin comprobar.** La herramienta `alerts` responde 401 sin iniciar sesión. `depscore` no enumera alertas, así que estas stats no dicen que no haya ninguna.
- **Campañas: sin comprobar.** `threat_feed` va por organización, y `organizations` también responde 401, así que no se ha llamado.
- **Fuera de las 3 capas:** otros 29 paquetes nuevos entran en el lock y no se han mirado, como dice `AGENTS.md`: 19 por Nest y 10 por Babel.
- **Versión muy reciente:** `@nestjs/common@12.3.3` se publicó el 2026-11-04, el día antes de esta consulta.

Tras instalar se comparó con todas las entradas nuevas del `pnpm-lock.yaml`: coinciden con estas tablas y con esos 29. `pnpm audit` busca vulnerabilidades conocidas, no campañas ni paquetes maliciosos nuevos.

### Nest

| Capa | Paquete | license | maintenance | quality | supplyChain | vulnerability |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `@nestjs/common@12.3.3` | 100 | 96 | 100 | 99 | 100 |
| 0 | `@nestjs/core@12.3.3` | 100 | 95 | 100 | 99 | 100 |
| 0 | `@nestjs/platform-express@12.3.3` | 100 | 96 | 100 | 99 | 100 |
| 0 | `reflect-metadata@0.2.2` | 80 | 80 | 99 | 100 | 100 |
| 0 | `rxjs@7.8.2` | 100 | 88 | 100 | 99 | 100 |
| 1 | `@standard-schema/spec@1.1.0` | 100 | 82 | 99 | 100 | 100 |
| 1 | `cors@2.8.6` | 100 | 83 | 100 | 99 | 100 |
| 1 | `express@5.3.0` | 100 | 92 | 100 | 97 | 100 |
| 1 | `fast-safe-stringify@2.1.1` | 100 | 75 | 100 | 100 | 100 |
| 1 | `file-type@22.3.0` | 100 | 93 | 100 | 99 | 100 |
| 1 | `iterare@1.2.1` | 100 | 75 | 100 | 100 | 100 |
| 1 | `load-esm@1.0.3` | 100 | 79 | 95 | 100 | 100 |
| 1 | `multer@2.5.0` | 100 | 92 | 100 | 99 | 100 |
| 1 | `path-to-regexp@8.4.2` | 100 | 91 | 100 | 100 | 100 |
| 1 | `tslib@2.9.1` | 100 | 91 | 100 | 92 | 100 |
| 1 | `uid@2.0.2` | 100 | 79 | 99 | 100 | 100 |
| 2 | `@lukeed/csprng@1.1.0` | 100 | 79 | 87 | 100 | 100 |
| 2 | `@tokenizer/inflate@0.6.0` | 100 | 90 | 99 | 99 | 100 |
| 2 | `accepts@2.0.0` | 100 | 84 | 100 | 99 | 100 |
| 2 | `append-field@1.0.0` | sin datos | sin datos | sin datos | sin datos | sin datos |
| 2 | `body-parser@2.4.0` | 100 | 93 | 100 | 99 | 100 |
| 2 | `busboy@1.6.0` | 100 | 80 | 100 | 100 | 100 |
| 2 | `content-disposition@2.0.1` | 100 | 86 | 100 | 100 | 100 |
| 2 | `content-type@2.1.0` | 100 | 88 | 90 | 100 | 100 |
| 2 | `cookie-signature@1.2.2` | 100 | 82 | 69 | 100 | 100 |
| 2 | `cookie@0.7.2` | 100 | 85 | 99 | 100 | 100 |
| 2 | `depd@2.0.0` | 100 | 75 | 100 | 99 | 100 |
| 2 | `encodeurl@2.0.1` | 100 | 90 | 99 | 100 | 100 |
| 2 | `escape-html@1.0.3` | 100 | 75 | 78 | 100 | 100 |
| 2 | `etag@1.8.1` | 100 | 75 | 99 | 100 | 100 |
| 2 | `finalhandler@2.1.1` | 100 | 84 | 100 | 99 | 100 |
| 2 | `fresh@2.0.0` | 100 | 83 | 99 | 100 | 100 |
| 2 | `http-errors@2.0.1` | 100 | 84 | 100 | 99 | 100 |
| 2 | `merge-descriptors@2.0.0` | 100 | 79 | 80 | 100 | 100 |
| 2 | `mime-types@3.0.2` | 100 | 85 | 100 | 100 | 100 |
| 2 | `object-assign@4.1.1` | 100 | 50 | 85 | 67 | 100 |
| 2 | `on-finished@2.4.2` | 100 | 86 | 100 | 100 | 100 |
| 2 | `once@1.4.0` | 100 | 75 | 91 | 100 | 100 |
| 2 | `parseurl@1.3.3` | 100 | 75 | 99 | 100 | 100 |
| 2 | `proxy-addr@2.0.8` | 100 | 84 | 100 | 99 | 100 |
| 2 | `qs@6.17.1` | 100 | 97 | 100 | 99 | 100 |
| 2 | `range-parser@1.3.0` | 100 | 85 | 95 | 100 | 100 |
| 2 | `router@2.2.0` | 100 | 83 | 100 | 99 | 100 |
| 2 | `send@1.2.1` | 100 | 85 | 100 | 99 | 100 |
| 2 | `serve-static@2.2.1` | 100 | 84 | 99 | 99 | 100 |
| 2 | `statuses@2.0.2` | 100 | 83 | 99 | 100 | 100 |
| 2 | `strtok3@10.7.0` | 100 | 93 | 100 | 100 | 100 |
| 2 | `token-types@6.2.0` | 100 | 87 | 100 | 99 | 100 |
| 2 | `type-is@1.6.18` | 100 | 87 | 100 | 100 | 100 |
| 2 | `type-is@2.1.0` | 100 | 87 | 100 | 99 | 100 |
| 2 | `uint8array-extras@1.6.0` | 100 | 82 | 100 | 100 | 100 |
| 2 | `vary@1.1.2` | 100 | 75 | 99 | 100 | 100 |
| 3 | `@borewit/text-codec@0.2.3` | 100 | 87 | 95 | 100 | 100 |
| 3 | `@tokenizer/token@0.3.0` | 100 | 75 | 64 | 100 | 100 |
| 3 | `bytes@3.1.2` | 100 | 81 | 99 | 100 | 100 |
| 3 | `ee-first@1.1.1` | 100 | 75 | 92 | 100 | 100 |
| 3 | `es-define-property@1.0.1` | 100 | 53 | 81 | 66 | 100 |
| 3 | `forwarded@0.2.0` | 100 | 75 | 83 | 100 | 100 |
| 3 | `iconv-lite@0.7.3` | 100 | 93 | 100 | 100 | 100 |
| 3 | `ieee754@1.2.1` | 100 | 75 | 82 | 100 | 100 |
| 3 | `inherits@2.0.4` | 100 | 75 | 76 | 100 | 100 |
| 3 | `ipaddr.js@1.9.1` | 100 | 82 | 100 | 100 | 100 |
| 3 | `is-promise@4.0.0` | 100 | 75 | 66 | 100 | 100 |
| 3 | `media-typer@0.3.0` | 100 | 84 | 93 | 100 | 100 |
| 3 | `media-typer@1.1.1` | 100 | 84 | 98 | 100 | 100 |
| 3 | `mime-db@1.54.0` | 100 | 84 | 100 | 100 | 100 |
| 3 | `mime-types@2.1.35` | 100 | 85 | 99 | 100 | 100 |
| 3 | `negotiator@1.1.0` | 100 | 85 | 100 | 100 | 100 |
| 3 | `raw-body@3.0.2` | 100 | 86 | 100 | 99 | 100 |
| 3 | `setprototypeof@1.2.0` | 100 | 75 | 73 | 100 | 100 |
| 3 | `side-channel@1.1.1` | 100 | 53 | 87 | 66 | 100 |
| 3 | `streamsearch@1.1.0` | 100 | 79 | 98 | 100 | 100 |
| 3 | `toidentifier@1.0.1` | 100 | 83 | 82 | 100 | 100 |
| 3 | `wrappy@1.0.2` | 100 | 75 | 73 | 100 | 100 |

### Babel

| Capa | Paquete | license | maintenance | quality | supplyChain | vulnerability |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `@babel/cli@8.1.0` | 100 | 95 | 75 | 99 | 100 |
| 0 | `@babel/core@8.1.0` | 100 | 97 | 78 | 98 | 100 |
| 0 | `@babel/eslint-parser@8.0.7` | 100 | 96 | 75 | 99 | 100 |
| 0 | `@babel/plugin-proposal-decorators@8.0.2` | 100 | 89 | 73 | 99 | 100 |
| 0 | `@babel/preset-env@8.0.7` | 100 | 94 | 75 | 96 | 100 |
| 1 | `@babel/code-frame@8.0.6` | 100 | 90 | 73 | 100 | 100 |
| 1 | `@babel/compat-data@8.0.5` | 100 | 90 | 75 | 100 | 100 |
| 1 | `@babel/generator@8.1.0` | 100 | 97 | 78 | 99 | 100 |
| 1 | `@babel/helper-compilation-targets@8.0.7` | 100 | 96 | 74 | 99 | 100 |
| 1 | `@babel/helper-create-class-features-plugin@8.0.10` | 100 | 97 | 77 | 99 | 100 |
| 1 | `@babel/helper-plugin-utils@8.0.1` | 100 | 88 | 70 | 100 | 100 |
| 1 | `@babel/helper-validator-option@8.0.0` | 100 | 88 | 71 | 100 | 100 |
| 1 | `@babel/helpers@8.1.0` | 100 | 97 | 76 | 99 | 100 |
| 1 | `@babel/parser@8.1.0` | 100 | 98 | 80 | 100 | 100 |
| 1 | `@babel/plugin-bugfix-firefox-class-in-computed-class-key@8.0.1` | 100 | 88 | 70 | 100 | 100 |
| 1 | `@babel/plugin-bugfix-safari-class-field-initializer-scope@8.0.1` | 100 | 88 | 70 | 100 | 100 |
| 1 | `@babel/plugin-bugfix-safari-id-destructuring-collision-in-function-expression@8.0.1` | 100 | 88 | 68 | 100 | 100 |
| 1 | `@babel/plugin-bugfix-safari-rest-destructuring-rhs-array@8.0.6` | 100 | 94 | 68 | 100 | 100 |
| 1 | `@babel/plugin-bugfix-v8-spread-parameters-in-optional-chaining@8.0.1` | 100 | 88 | 70 | 99 | 100 |
| 1 | `@babel/plugin-bugfix-v8-static-class-fields-redefine-readonly@8.0.1` | 100 | 88 | 72 | 100 | 100 |
| 1 | `@babel/plugin-syntax-decorators@8.0.1` | 100 | 88 | 67 | 100 | 100 |
| 1 | `@babel/plugin-transform-arrow-functions@8.0.1` | 100 | 88 | 66 | 99 | 100 |
| 1 | `@babel/plugin-transform-async-generator-functions@8.0.6` | 100 | 90 | 72 | 99 | 100 |
| 1 | `@babel/plugin-transform-async-to-generator@8.0.1` | 100 | 88 | 69 | 99 | 100 |
| 1 | `@babel/plugin-transform-block-scoped-functions@8.0.1` | 100 | 88 | 70 | 100 | 100 |
| 1 | `@babel/plugin-transform-block-scoping@8.0.10` | 100 | 97 | 75 | 99 | 100 |
| 1 | `@babel/plugin-transform-class-properties@8.0.1` | 100 | 88 | 64 | 100 | 100 |
| 1 | `@babel/plugin-transform-class-static-block@8.0.5` | 100 | 90 | 72 | 100 | 100 |
| 1 | `@babel/plugin-transform-classes@8.1.0` | 100 | 97 | 75 | 99 | 100 |
| 1 | `@babel/plugin-transform-computed-properties@8.0.1` | 100 | 88 | 72 | 100 | 100 |
| 1 | `@babel/plugin-transform-destructuring@8.0.5` | 100 | 94 | 75 | 100 | 100 |
| 1 | `@babel/plugin-transform-dotall-regex@8.0.1` | 100 | 88 | 62 | 99 | 100 |
| 1 | `@babel/plugin-transform-duplicate-keys@8.0.1` | 100 | 88 | 69 | 100 | 100 |
| 1 | `@babel/plugin-transform-duplicate-named-capturing-groups-regex@8.0.1` | 100 | 88 | 65 | 99 | 100 |
| 1 | `@babel/plugin-transform-dynamic-import@8.0.1` | 100 | 88 | 67 | 100 | 100 |
| 1 | `@babel/plugin-transform-explicit-resource-management@8.0.5` | 100 | 90 | 72 | 99 | 100 |
| 1 | `@babel/plugin-transform-exponentiation-operator@8.0.1` | 100 | 88 | 70 | 100 | 100 |
| 1 | `@babel/plugin-transform-export-namespace-from@8.1.0` | 100 | 93 | 69 | 100 | 100 |
| 1 | `@babel/plugin-transform-for-of@8.0.7` | 100 | 95 | 72 | 100 | 100 |
| 1 | `@babel/plugin-transform-function-name@8.0.1` | 100 | 88 | 66 | 100 | 100 |
| 1 | `@babel/plugin-transform-json-strings@8.0.1` | 100 | 88 | 66 | 100 | 100 |
| 1 | `@babel/plugin-transform-literals@8.0.1` | 100 | 88 | 66 | 100 | 100 |
| 1 | `@babel/plugin-transform-logical-assignment-operators@8.0.1` | 100 | 88 | 69 | 100 | 100 |
| 1 | `@babel/plugin-transform-member-expression-literals@8.0.1` | 100 | 88 | 65 | 100 | 100 |
| 1 | `@babel/plugin-transform-modules-amd@8.0.1` | 100 | 88 | 72 | 99 | 100 |
| 1 | `@babel/plugin-transform-modules-commonjs@8.0.1` | 100 | 88 | 73 | 100 | 100 |
| 1 | `@babel/plugin-transform-modules-systemjs@8.1.0` | 100 | 93 | 74 | 99 | 100 |
| 1 | `@babel/plugin-transform-modules-umd@8.0.1` | 100 | 88 | 72 | 99 | 100 |
| 1 | `@babel/plugin-transform-named-capturing-groups-regex@8.0.1` | 100 | 88 | 65 | 99 | 100 |
| 1 | `@babel/plugin-transform-new-target@8.0.1` | 100 | 88 | 70 | 100 | 100 |
| 1 | `@babel/plugin-transform-nullish-coalescing-operator@8.0.1` | 100 | 88 | 69 | 100 | 100 |
| 1 | `@babel/plugin-transform-numeric-separator@8.0.1` | 100 | 88 | 66 | 100 | 100 |
| 1 | `@babel/plugin-transform-object-rest-spread@8.0.1` | 100 | 88 | 75 | 99 | 100 |
| 1 | `@babel/plugin-transform-object-super@8.0.1` | 100 | 88 | 70 | 100 | 100 |
| 1 | `@babel/plugin-transform-optional-catch-binding@8.0.1` | 100 | 88 | 65 | 100 | 100 |
| 1 | `@babel/plugin-transform-optional-chaining@8.0.5` | 100 | 90 | 73 | 99 | 100 |
| 1 | `@babel/plugin-transform-parameters@8.0.5` | 100 | 90 | 75 | 99 | 100 |
| 1 | `@babel/plugin-transform-private-methods@8.0.1` | 100 | 88 | 65 | 99 | 100 |
| 1 | `@babel/plugin-transform-private-property-in-object@8.0.5` | 100 | 90 | 72 | 99 | 100 |
| 1 | `@babel/plugin-transform-property-literals@8.0.1` | 100 | 88 | 65 | 100 | 100 |
| 1 | `@babel/plugin-transform-regenerator@8.0.6` | 100 | 92 | 76 | 99 | 100 |
| 1 | `@babel/plugin-transform-regexp-modifiers@8.0.1` | 100 | 88 | 62 | 99 | 100 |
| 1 | `@babel/plugin-transform-reserved-words@8.0.1` | 100 | 88 | 64 | 100 | 100 |
| 1 | `@babel/plugin-transform-shorthand-properties@8.0.1` | 100 | 88 | 69 | 100 | 100 |
| 1 | `@babel/plugin-transform-spread@8.0.8` | 100 | 94 | 72 | 100 | 100 |
| 1 | `@babel/plugin-transform-sticky-regex@8.0.1` | 100 | 88 | 65 | 100 | 100 |
| 1 | `@babel/plugin-transform-template-literals@8.0.1` | 100 | 88 | 71 | 100 | 100 |
| 1 | `@babel/plugin-transform-typeof-symbol@8.0.1` | 100 | 88 | 69 | 100 | 100 |
| 1 | `@babel/plugin-transform-unicode-escapes@8.0.1` | 100 | 88 | 71 | 100 | 100 |
| 1 | `@babel/plugin-transform-unicode-property-regex@8.0.1` | 100 | 88 | 65 | 100 | 100 |
| 1 | `@babel/plugin-transform-unicode-regex@8.0.1` | 100 | 88 | 62 | 99 | 100 |
| 1 | `@babel/plugin-transform-unicode-sets-regex@8.0.1` | 100 | 88 | 62 | 99 | 100 |
| 1 | `@babel/preset-modules@0.2.0` | 100 | 84 | 99 | 99 | 100 |
| 1 | `@babel/template@8.0.0` | 100 | 88 | 75 | 100 | 100 |
| 1 | `@babel/traverse@8.1.0` | 100 | 97 | 79 | 99 | 100 |
| 1 | `@babel/types@8.1.0` | 100 | 97 | 80 | 100 | 100 |
| 1 | `@jridgewell/trace-mapping@0.3.31` | 100 | 80 | 100 | 100 | 100 |
| 1 | `@types/gensync@1.0.5` | 100 | 80 | 70 | 100 | 100 |
| 1 | `babel-plugin-polyfill-corejs3@1.0.0` | 100 | 83 | 93 | 99 | 100 |
| 1 | `chokidar@5.0.0` | 100 | 85 | 100 | 99 | 100 |
| 1 | `commander@14.0.3` | 100 | 83 | 100 | 99 | 100 |
| 1 | `convert-source-map@2.0.0` | 100 | 81 | 100 | 100 | 100 |
| 1 | `core-js-compat@3.51.0` | 100 | 87 | 100 | 100 | 100 |
| 1 | `empathic@2.1.0` | 100 | 83 | 93 | 100 | 100 |
| 1 | `gensync@1.0.0-beta.2` | 100 | 75 | 100 | 100 | 100 |
| 1 | `glob@14.0.3` | 100 | 92 | 99 | 98 | 100 |
| 1 | `import-meta-resolve@4.2.0` | 100 | 79 | 100 | 99 | 100 |
| 1 | `json5@2.2.3` | 100 | 81 | 100 | 100 | 100 |
| 1 | `obug@3.0.0` | 100 | 90 | 100 | 100 | 100 |
| 1 | `slash@5.1.0` | 100 | 79 | 72 | 100 | 100 |
| 1 | `verkit@0.5.0` | 100 | 88 | 100 | 100 | 100 |
| 2 | `@babel/helper-annotate-as-pure@8.0.0` | 100 | 88 | 64 | 100 | 100 |
| 2 | `@babel/helper-create-regexp-features-plugin@8.0.7` | 100 | 94 | 72 | 100 | 100 |
| 2 | `@babel/helper-define-polyfill-provider@1.0.0` | 100 | 87 | 76 | 99 | 100 |
| 2 | `@babel/helper-globals@8.0.6` | 100 | 89 | 75 | 100 | 100 |
| 2 | `@babel/helper-member-expression-to-functions@8.0.5` | 100 | 90 | 74 | 100 | 100 |
| 2 | `@babel/helper-module-imports@8.0.0` | 100 | 88 | 75 | 99 | 100 |
| 2 | `@babel/helper-module-transforms@8.1.0` | 100 | 96 | 76 | 100 | 100 |
| 2 | `@babel/helper-optimise-call-expression@8.0.0` | 100 | 88 | 68 | 100 | 100 |
| 2 | `@babel/helper-remap-async-to-generator@8.0.1` | 100 | 88 | 70 | 99 | 100 |
| 2 | `@babel/helper-replace-supers@8.0.1` | 100 | 88 | 73 | 100 | 100 |
| 2 | `@babel/helper-skip-transparent-expression-wrappers@8.1.0` | 100 | 94 | 66 | 100 | 100 |
| 2 | `@babel/helper-string-parser@8.0.8` | 100 | 96 | 74 | 100 | 100 |
| 2 | `@babel/helper-validator-identifier@8.0.6` | 100 | 90 | 72 | 100 | 100 |
| 2 | `@jridgewell/gen-mapping@0.4.0-beta.0` | 100 | 80 | 100 | 100 | 100 |
| 2 | `@jridgewell/resolve-uri@3.1.2` | 100 | 79 | 81 | 100 | 100 |
| 2 | `@jridgewell/sourcemap-codec@1.6.0` | 100 | 81 | 100 | 100 | 100 |
| 2 | `@types/jsesc@2.5.1` | 100 | 79 | 69 | 100 | 100 |
| 2 | `browserslist@4.29.5` | 100 | 92 | 90 | 98 | 100 |
| 2 | `flru@1.0.2` | 100 | 75 | 99 | 100 | 100 |
| 2 | `js-tokens@10.0.0` | 100 | 80 | 72 | 100 | 100 |
| 2 | `jsesc@3.1.0` | 100 | 79 | 100 | 100 | 100 |
| 2 | `minimatch@11.0.4` | 100 | 95 | 100 | 100 | 100 |
| 2 | `minipass@7.1.3` | 100 | 80 | 100 | 100 | 100 |
| 2 | `path-scurry@3.0.0` | 100 | 86 | 100 | 99 | 100 |
| 2 | `readdirp@5.1.1` | 100 | 83 | 100 | 100 | 100 |
| 3 | `@babel/helper-wrap-function@8.0.0` | 100 | 88 | 72 | 100 | 100 |
| 3 | `@isaacs/nonrecursive-glob-match@1.0.3` | 100 | 91 | 100 | 100 | 100 |
| 3 | `baseline-browser-mapping@2.11.35` | 100 | 96 | 99 | 99 | 100 |
| 3 | `caniuse-lite@1.0.30001820` | 100 | 96 | 74 | 100 | 100 |
| 3 | `electron-to-chromium@1.5.477` | 100 | 96 | 100 | 100 | 100 |
| 3 | `lodash.debounce@4.0.8` | 100 | 75 | 74 | 100 | 100 |
| 3 | `lru-cache@11.5.3` | 100 | 88 | 99 | 99 | 100 |
| 3 | `node-releases@2.0.63` | 100 | 95 | 81 | 100 | 100 |
| 3 | `regexpu-core@6.5.4` | 100 | 93 | 100 | 99 | 100 |
| 3 | `update-browserslist-db@1.3.4` | 100 | 89 | 82 | 99 | 100 |

## Decisiones de Diego

Respondidas el 2026-11-05:

- **Socket:** acepta los paquetes de las dos tablas, con `append-field@1.0.0` sin datos y las alertas y campañas sin comprobar.
- **Constitución:** «No se añaden paquetes para el servidor ni para la web» habla de `src/db/` y de `src/clients/web/`. Nest es un cliente nuevo y no choca.
- **`docs/STYLE.md`:** vale un aviso limitado a `src/clients/nest/`, porque Nest exige clases y decoradores.
- **`Host` y `Origin`:** se mantiene la protección, como en la API de Chrome.
- **Babel:** sustituye a swc tras la revisión de la PR, con `scripts/nest.js` en vez de `rm -rf` para que funcione en Windows.
