# Plan — cliente de extensión de Chrome

Cumple `docs/specs/chrome-extension-client/spec.md`.

No hay operación nueva ni SQL nuevo. Listar, crear, modificar y eliminar siguen en la lógica que ya existe. Buscar y contar el género no entran. Crear la tabla no se pide aparte.

Se añade `fastify` `5.12.8` para el programa del popup. Es la excepción aceptada, junto a Express `5.3.0` y Electron `45.2.3`. Chrome no es un paquete de esta app. `fastify@5.12.8` salió el 2026-11-02, así que pasa el mínimo de 24 horas de pnpm y no entra en `minimumReleaseAgeExclude`.

## Validación Socket

`depscore` respondió el 2026-11-05. Ninguna stat está por debajo de 50. El árbol es el de `fastify@5.12.8` en `pnpm-lock.yaml`, hasta 3 capas. Son 48 paquetes, sin repetir. `process-warning@5.1.1` y `rfdc@1.4.1` salen en la capa 1 porque `fastify` los declara, aunque también los usa otra dependencia.

`organizations` respondió `Unauthorized`. Sin `org_slug` no se ha podido llamar a `alerts` ni a `threat_feed`. No hay dato de alerta ni de campaña. Eso no es ausencia de avisos.

| Paquete | Versión | Capa | Campaña | Alertas | Stats por debajo de 50 |
| --- | --- | --- | --- | --- | --- |
| `fastify` | `5.12.8` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 99, calidad 100, cadena 98, vulnerabilidad 100 |
| `@fastify/ajv-compiler` | `4.0.7` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 100, cadena 99, vulnerabilidad 100 |
| `@fastify/error` | `4.2.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 84, calidad 100, cadena 100, vulnerabilidad 100 |
| `@fastify/fast-json-stringify-compiler` | `5.1.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 100, cadena 100, vulnerabilidad 100 |
| `@fastify/proxy-addr` | `5.1.2` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 86, calidad 100, cadena 100, vulnerabilidad 100 |
| `abstract-logging` | `2.0.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 77, cadena 100, vulnerabilidad 100 |
| `avvio` | `9.3.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 90, calidad 100, cadena 100, vulnerabilidad 100 |
| `fast-json-stringify` | `7.2.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 97, calidad 100, cadena 99, vulnerabilidad 100 |
| `find-my-way` | `9.10.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 100, cadena 99, vulnerabilidad 100 |
| `light-my-request` | `6.8.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 100, cadena 99, vulnerabilidad 100 |
| `pino` | `10.4.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 100, cadena 98, vulnerabilidad 100 |
| `process-warning` | `5.1.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 100, cadena 100, vulnerabilidad 100 |
| `rfdc` | `1.4.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100 |
| `secure-json-parse` | `4.1.1` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 100, cadena 100, vulnerabilidad 100 |
| `semver` | `7.8.6` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 95, calidad 100, cadena 100, vulnerabilidad 100 |
| `toad-cache` | `3.7.4` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100 |
| `@fastify/deepmerge` | `3.2.4` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 88, calidad 100, cadena 100, vulnerabilidad 100 |
| `@fastify/forwarded` | `3.1.2` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 89, calidad 82, cadena 100, vulnerabilidad 100 |
| `@fastify/merge-json-schemas` | `0.2.2` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 84, calidad 100, cadena 100, vulnerabilidad 100 |
| `@pinojs/redact` | `0.4.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100 |
| `ajv` | `8.20.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 84, calidad 100, cadena 99, vulnerabilidad 100 |
| `ajv-formats` | `3.0.1` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 83, calidad 100, cadena 99, vulnerabilidad 100 |
| `atomic-sleep` | `1.0.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 85, cadena 100, vulnerabilidad 100 |
| `cookie` | `2.0.1` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 85, calidad 100, cadena 100, vulnerabilidad 100 |
| `fast-deep-equal` | `3.1.3` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 99, cadena 100, vulnerabilidad 100 |
| `fast-querystring` | `1.1.2` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 79, calidad 100, cadena 99, vulnerabilidad 100 |
| `fast-uri` | `4.2.3` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 98, calidad 100, cadena 100, vulnerabilidad 100 |
| `fastq` | `1.20.3` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 82, calidad 100, cadena 100, vulnerabilidad 100 |
| `ipaddr.js` | `2.5.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 82, calidad 100, cadena 100, vulnerabilidad 100 |
| `json-schema-ref-resolver` | `3.0.1` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 87, calidad 100, cadena 100, vulnerabilidad 100 |
| `on-exit-leak-free` | `2.1.2` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 79, calidad 85, cadena 100, vulnerabilidad 100 |
| `pino-abstract-transport` | `3.0.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 81, calidad 100, cadena 100, vulnerabilidad 100 |
| `pino-std-serializers` | `7.1.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 82, calidad 100, cadena 100, vulnerabilidad 100 |
| `quick-format-unescaped` | `4.0.4` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 89, cadena 100, vulnerabilidad 100 |
| `real-require` | `1.0.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 83, calidad 75, cadena 99, vulnerabilidad 100 |
| `safe-regex2` | `5.1.2` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 87, calidad 90, cadena 100, vulnerabilidad 100 |
| `safe-stable-stringify` | `2.5.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 84, calidad 100, cadena 100, vulnerabilidad 100 |
| `set-cookie-parser` | `3.2.2` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 93, calidad 100, cadena 100, vulnerabilidad 100 |
| `sonic-boom` | `4.2.1` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 88, calidad 100, cadena 100, vulnerabilidad 100 |
| `thread-stream` | `4.2.1` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 90, calidad 100, cadena 99, vulnerabilidad 100 |
| `dequal` | `2.0.3` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 79, calidad 100, cadena 100, vulnerabilidad 100 |
| `fast-decode-uri-component` | `1.0.1` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 81, cadena 100, vulnerabilidad 100 |
| `fast-uri` | `3.1.9` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 98, calidad 100, cadena 100, vulnerabilidad 100 |
| `json-schema-traverse` | `1.0.0` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 99, cadena 100, vulnerabilidad 100 |
| `require-from-string` | `2.0.2` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 80, cadena 100, vulnerabilidad 100 |
| `ret` | `0.5.1` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 90, calidad 99, cadena 100, vulnerabilidad 100 |
| `reusify` | `1.1.0` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 79, calidad 100, cadena 100, vulnerabilidad 100 |
| `split2` | `4.2.0` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 80, calidad 95, cadena 100, vulnerabilidad 100 |

## Ficheros

Se crea `src/clients/chrome/`:

- `manifest.json` es la extensión.
- `index.html` es el popup.
- `app.js` pide listar, crear, modificar y eliminar.
- `styles.css` pinta el libro de registro.
- `server.js` usa Fastify `5.12.8`, llama a la lógica y escucha en `127.0.0.1:3002`.

`src/clients/chrome/manifest.json` es Manifest V3. El nombre visible es Usuarios. `action.default_popup` apunta a `index.html`. La carpeta que se carga es `src/clients/chrome`. `host_permissions` incluye `http://127.0.0.1:3002/*`, porque el popup pide las operaciones a ese origen y sale de `chrome-extension://`. La política de las páginas de la extensión deja los scripts en `'self'` y permite las hojas y las fuentes de `fonts.googleapis.com` y `fonts.gstatic.com`. No hay script remoto.

No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter`, `src/clients/browser`, `src/clients/http` ni `src/clients/electron`.

Se toca `package.json`. El script `chrome` queda `node src/clients/chrome/server.js`. Se lanza con `pnpm chrome` desde `first-app`, con `pnpm server` en marcha. No hay otro script para este cliente. El script `format` también escribe `src/clients/chrome/**/*.js`.

En el mismo cambio que el código se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/DATABASE.md` no cambia: la base sigue igual.

## Firma

No hay función de negocio nueva. `server.js` importa cuatro funciones que ya existen. `app.js` las pide por HTTP.

| Acción en el popup | Petición | Llamada en el servidor |
| --- | --- | --- |
| Listar | `GET /users` | `listUsers()` |
| Crear | `POST /users` | `createUser({ name, email })` |
| Modificar | `PATCH /users/:id` | `updateUser(id, { name, email })` |
| Eliminar | `DELETE /users/:id` | `deleteUser(id)` |

El servidor no importa `usersGender`, `findUserById`, `findUserByEmail` ni `findUserByName`. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Si la lógica lanza un `Error`, responde con `{ "message": error.message }`. El popup muestra ese texto.

El formulario de modificar muestra el nombre y el email ya guardados y envía los dos. La lógica sigue aceptando solo uno. Este popup no usa ese caso.

Para elegir, el id se busca en la lista ya cargada. Si no es un entero positivo, se ve `User id must be a positive integer`. Si no está en la lista, se ve `User ${id} was not found`. Esa elección no llama a buscar.

## SQL

No hay SQL nuevo. Cada acción usa la operación que ya está escrita.

## Dirección

El popup usa la dirección que ya está en `docs/STYLE.md`, la del libro de registro. Es la misma de las pantallas y de la ventana. Chapa `#E4E8EA`, tinta `#1B2830`, latón `#A6843D`, óxido `#8F3D36`, niebla `#F7F8F8` y grafito `#5C6B73`. Literata para el título de la vista y el nombre elegido. Familjen Grotesk para la lista, las etiquetas, los campos, los botones y los fallos. Texto a la izquierda, una columna, una línea por persona y botones al ancho de la columna. El latón solo marca el id y el foco. El óxido solo marca el fallo y Eliminar. No hay animación. El popup mide 360 píxeles de ancho.

La lista se llama Usuarios. Cada línea lleva el id, el nombre y el email. Si no hay nadie, la lista se queda vacía y no se muestra un fallo. Debajo están el id, Elegir y Crear.

```
Usuarios
12  Ana García
    ana@example.com
————————
4   Luis Martín
    luis@example.com

Id [        ]
Elegir
Crear
```

Elegir abre el menú de esa persona. El nombre va grande. Las acciones son Volver y Modificar usuario. No hay Notas.

```
Ana García
id 12

Volver
Modificar usuario
```

Crear usuario pide el nombre y el email. Guardar y Volver van debajo. Modificar deja el id, el nombre y el email. Guardar, Eliminar y Volver van debajo. Guardar y Eliminar vuelven a la lista. Volver vuelve al menú.

Si la función lanza un `Error`, se muestra `error.message` y no se cambia de vista. El texto no se reescribe. Ahí entran `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `User id must be a positive integer`, `Provide a name or an email to update`, un mensaje que termina en `was not found` y un mensaje que contiene `UNIQUE constraint`. Si el programa de consultas no está en marcha, se muestra el fallo de esa llamada y la operación no se completa.

## Documentación

`docs/ARCHITECTURE.md` gana el popup de Chrome: otra forma de listar, crear, modificar y eliminar. Su programa escucha en `127.0.0.1:3002` y se arranca con `pnpm chrome`. El programa llama a la lógica. No busca y no cuenta el género. No incluye notas. El aspecto es el del libro de registro. La terminal, Jupyter, las pantallas, la ventana y el cliente HTTP siguen igual.

`docs/TREE.md` añade `clients/chrome/` con `manifest.json`, `index.html`, `app.js`, `styles.css` y `server.js`.

`docs/STYLE.md` deja el popup en la misma dirección que las pantallas y la ventana: el libro de registro.

`docs/ERRORS.md` añade que, si el popup no se abre, no se puede pedir la operación desde ahí. Si su programa no está en marcha, el popup muestra el fallo de esa llamada. Si el programa de consultas no está en marcha, el popup muestra el fallo que devuelve su programa.

`docs/CONSTITUTIONS.MD` cuenta el popup y `pnpm chrome`. El desarrollo abierto pasa a ser `docs/specs/chrome-extension-client/`.

`AGENTS.MD` deja la regla: el cliente vive en `src/clients/chrome`. El manifiesto vive en `src/clients/chrome/manifest.json`. `server.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm chrome` y escucha en `127.0.0.1:3002`. `app.js` pide esas operaciones a ese origen. Fastify queda en `5.12.8`.
