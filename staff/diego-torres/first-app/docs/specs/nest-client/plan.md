# Plan — cliente de usuarios con una API Nest

Issue: #1040

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

Node no entiende los decoradores `@` de Nest. Por eso `pnpm nest` lanza `bootstrap.mjs`, que traduce los ficheros con `@swc/core` a `src/clients/nest/.run/` y arranca el resultado. No hay TypeScript. Quien prueba la app lanza `pnpm start` en una terminal y `pnpm nest` en otra.

## Ficheros

Se crean en `src/clients/nest/`:

- `bootstrap.mjs` — traduce los ficheros a `.run/`. Como esa carpeta está un nivel más abajo, cambia `../../logic/` por `../../../logic/` en lo traducido. Después importa `.run/main.js`.
- `main.js` — crea la app de Nest sin sus avisos de consola (`logger: false`), añade la comprobación de `Host` y `Origin` y escucha solo en `127.0.0.1:3003`. Avisa si el puerto está ocupado, igual que `chrome/server.js`.
- `app.module.js` — une el controlador, el servicio y el filtro.
- `users.controller.js` — las rutas. Lee el id y el cuerpo, y llama al servicio. No valida.
- `users.service.js` — llama a `src/logic/`. Importa fichero a fichero, no desde `logic/index.js`, para no cargar `openai`.
- `logic-exception.filter.js` — traduce cada fallo a su estado y su mensaje.

Se tocan:

- `package.json` — los paquetes de abajo, el script `"nest": "node src/clients/nest/bootstrap.mjs"` y `src/clients/nest/*.{js,mjs}` en `format`. El glob no es recursivo para no formatear `.run/`.
- `pnpm-lock.yaml` — lo actualiza `pnpm install`.
- `eslint.config.js` — ignora `.run/` y los cuatro ficheros con `@` (`app.module.js`, `users.controller.js`, `users.service.js` y `logic-exception.filter.js`), porque el lector por defecto de ESLint no entiende los decoradores. Añade las reglas recomendadas a `bootstrap.mjs`. **Límite:** esos cuatro ficheros no pasan lint. Revisarlos exigiría otro paquete y más comprobaciones de Socket.
- `.gitignore` — fichero nuevo en `first-app/`, con `src/clients/nest/.run/`.
- `AGENTS.md` — dependencias, comando `pnpm nest`, alcance de `pnpm format` y clientes que necesitan el servidor.
- `docs/ARCHITECTURE.md` — filas en «Quién sabe qué» y la capa de clientes.
- `docs/TREE.md` — `clients/nest/`.
- `docs/STYLE.md` — aviso: `src/clients/nest/` usa clases y decoradores porque Nest los exige. El resto del proyecto sigue igual.

`pnpm-workspace.yaml` no existe y no se crea. `@swc/core` trae un `postinstall`, pero su binario llega como dependencia opcional. Si la instalación falla sin ese fichero, se para y se enseña a Diego.

El código lleva líneas cortas y comentarios por bloques en castellano, también encima de cada import y de cada decorador que no se entienda solo. Cada comentario es una frase sencilla, fácil de leer y sin jerga de Nest sin explicar. Por ejemplo: `// Si no conocemos el error, respondemos que la acción ha fallado.`

## Paquetes

- `dependencies`: `@nestjs/common@12.3.3`, `@nestjs/core@12.3.3`, `@nestjs/platform-express@12.3.3`, `reflect-metadata@0.2.2` y `rxjs@7.8.2`.
- `devDependencies`: `@swc/core@1.16.21`.

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

`@Bind` e `@Inject` funcionan traducidos con swc. El JSON mal formado llega al filtro y responde 400 sin cuerpo.

swc no admite `export` entre un decorador y su clase, así que las clases se exportan aparte, al final de cada fichero.

La base caída se simuló haciendo fallar `fetch` en una copia de la API, porque `pnpm start` ya estaba en marcha y no se paró. No se probó apagando el servidor de verdad.

`pnpm format` cambia los saltos de línea de CRLF a LF en todos los ficheros de su alcance, con `core.autocrlf` activo. Esos cambios no son de esta tarea y se restauraron.

`pnpm audit` da un aviso moderado en `minimatch`, que llega por `eslint`. No es de Nest. No hay ninguno alto ni crítico.

## Pruebas

No hay tests en el proyecto. Se prueba por HTTP contra el 3003, con `pnpm start` y `pnpm nest` en marcha:

1. El ejemplo de Ada de la spec.
2. Cada error de la tabla, con su estado y su mensaje. Con `pnpm start` parado, las cinco rutas dan 500 con su `Could not …`.
3. `GET /no-existe` da 404 sin cuerpo. JSON mal formado da 400 sin cuerpo. `Host` ajeno u `Origin` presente dan 403.
4. `pnpm chrome` sigue respondiendo igual en el 3002.
5. `pnpm format` y `pnpm lint` pasan.

## Socket

Consulta propia del 2026-11-05 a `https://mcp.socket.dev/`, sin iniciar sesión, porque `SOCKET_API_TOKEN` no está definido. Las versiones salen de `pnpm install --lockfile-only --ignore-scripts` en una copia temporal de `package.json` y `pnpm-lock.yaml`. No se ha instalado nada en el proyecto.

Son 91 paquetes hasta 3 capas y se comprueban los 89 nuevos. `debug@4.4.3` y `ms@2.1.3` ya estaban en esa versión y no se vuelven a mirar. Los pares opcionales `class-validator` y `class-transformer` no se instalan.

- **Stats:** salen de la herramienta `depscore`. Responde por 88 de los 89. **Cinco tienen una stat por debajo de 50**, todas en `quality`:
  - `@swc/counter@0.1.3`: 41. Es dependencia obligatoria de `@swc/core`, así que se instala siempre.
  - `@swc/core-linux-arm-gnueabihf`, `@swc/core-linux-ppc64-gnu`, `@swc/core-linux-s390x-gnu` y `@swc/core-win32-ia32-msvc`, todos en `1.16.21`: 40. Son binarios opcionales de otras plataformas.
- **`append-field@1.0.0`: sin datos.** Socket responde con `append-field@2.0.0`, también al preguntar solo por él. El árbol instala la 1.0.0. Los números de la 2.0.0 no valen para esa versión.
- **Alertas: sin comprobar.** La herramienta `alerts` responde 401 sin iniciar sesión. `depscore` no enumera alertas, así que estas stats no dicen que no haya ninguna.
- **Campañas: sin comprobar.** `threat_feed` va por organización, y `organizations` también responde 401, así que no se ha llamado.
- **Fuera de las 3 capas:** otros 19 paquetes nuevos entran en el lock y no se han mirado, como dice `AGENTS.md`.
- **Versión muy reciente:** `@nestjs/common@12.3.3` se publicó el 2026-11-04, el día antes de esta consulta.

Tras instalar se compara con **todas** las entradas nuevas del `pnpm-lock.yaml` y se lanza `pnpm audit`. Si algo no coincide o sale algo alto o crítico, se para y se enseña a Diego. `pnpm audit` busca vulnerabilidades conocidas, no campañas ni paquetes maliciosos nuevos.

| Capa | Paquete | license | maintenance | quality | supplyChain | vulnerability |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | `@nestjs/common@12.3.3` | 100 | 96 | 100 | 99 | 100 |
| 0 | `@nestjs/core@12.3.3` | 100 | 95 | 100 | 99 | 100 |
| 0 | `@nestjs/platform-express@12.3.3` | 100 | 96 | 100 | 99 | 100 |
| 0 | `@swc/core@1.16.21` | 100 | 96 | 100 | 91 | 100 |
| 0 | `reflect-metadata@0.2.2` | 80 | 80 | 99 | 100 | 100 |
| 0 | `rxjs@7.8.2` | 100 | 88 | 100 | 99 | 100 |
| 1 | `@standard-schema/spec@1.1.0` | 100 | 82 | 99 | 100 | 100 |
| 1 | `@swc/core-darwin-arm64@1.16.21` (opcional) | 100 | 96 | 53 | 99 | 100 |
| 1 | `@swc/core-darwin-x64@1.16.21` (opcional) | 100 | 95 | 53 | 99 | 100 |
| 1 | `@swc/core-linux-arm-gnueabihf@1.16.21` (opcional) | 100 | 96 | 40 | 100 | 100 |
| 1 | `@swc/core-linux-arm64-gnu@1.16.21` (opcional) | 100 | 96 | 53 | 99 | 100 |
| 1 | `@swc/core-linux-arm64-musl@1.16.21` (opcional) | 100 | 96 | 53 | 99 | 100 |
| 1 | `@swc/core-linux-ppc64-gnu@1.16.21` (opcional) | 100 | 96 | 40 | 99 | 100 |
| 1 | `@swc/core-linux-s390x-gnu@1.16.21` (opcional) | 100 | 96 | 40 | 99 | 100 |
| 1 | `@swc/core-linux-x64-gnu@1.16.21` (opcional) | 100 | 96 | 53 | 99 | 100 |
| 1 | `@swc/core-linux-x64-musl@1.16.21` (opcional) | 100 | 96 | 53 | 99 | 100 |
| 1 | `@swc/core-win32-arm64-msvc@1.16.21` (opcional) | 100 | 96 | 53 | 99 | 100 |
| 1 | `@swc/core-win32-ia32-msvc@1.16.21` (opcional) | 100 | 96 | 40 | 99 | 100 |
| 1 | `@swc/core-win32-x64-msvc@1.16.21` (opcional) | 100 | 96 | 53 | 99 | 100 |
| 1 | `@swc/counter@0.1.3` | 100 | 79 | 41 | 100 | 100 |
| 1 | `@swc/types@0.1.28` | 100 | 82 | 72 | 100 | 100 |
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

## Decisiones de Diego

Respondidas el 2026-11-05:

- **Socket:** acepta los 89 paquetes, con las cinco stats bajo 50, `append-field@1.0.0` sin datos y las alertas y campañas sin comprobar.
- **Constitución:** «No se añaden paquetes para el servidor ni para la web» habla de `src/db/` y de `src/clients/web/`. Nest es un cliente nuevo y no choca.
- **`docs/STYLE.md`:** vale un aviso limitado a `src/clients/nest/`, porque Nest exige clases y decoradores.
- **`Host` y `Origin`:** se mantiene la protección, como en la API de Chrome.
- **Lint:** acepta que los cuatro ficheros con `@` no pasen `pnpm lint`.
