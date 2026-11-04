# Plan — cliente REST de usuarios

Issue: #849.

No es una funcionalidad nueva. No se reemplaza ningún fichero de
`logic/`. No hay firma nueva. No hay SQL nuevo. No hay mensaje nuevo.

Hay un paquete nuevo: `express@5.3.0`. Entra Socket. El árbol de abajo
es el que resuelve npm para esa versión y sus rangos, hasta 3 capas.
Son 54 paquetes, sin repetir versión. Instalado tras la aceptación explícita del riesgo residual. Si `pnpm`
resuelve otra versión dentro de un rango, esa versión no es la de este
resumen y hay que volver a pasarla por Socket.

El cliente importa las funciones que ya existen y devuelve su
resultado. Se parece a los clientes de `src/clients/terminal/`: la
llamada está en el cliente y la regla sigue en `logic/`.

Crear usa `createUser({ name, email })`. Listar usa `listUsers()`.
Ver uno usa `findUserById(id)`. Modificar usa `updateUser(id, changes)`.
Borrar usa `deleteUser(id)`. El `id` es el texto de la ruta. No se
importa `users-gender-count.js`, `find-user-by-name.js` ni
`find-user-by-email.js`.

El SQL sigue en `src/db/server.js`, en `http://127.0.0.1:3000`. Se
arranca con el comando que ya existe. Este cliente escucha en
`http://127.0.0.1:3001`. La constante es `ORIGIN`. `package.json` tiene
el script `http`. Se lanza con `pnpm http` desde `first-app`.

Express lee el cuerpo JSON. Crear y modificar leen `name` y `email`.
Si un campo no viene, no entra en `changes`, y `updateUser` conserva
el valor guardado. El cliente no valida. Si lo lanzado no es un
`Error` con un mensaje de la lista, responde 500 con el `Could not`
de esa acción. No inventa un mensaje.

Las rutas:

- `POST /users` crea. Responde 201 y el usuario.
- `GET /users` lista. Responde 200 y la lista.
- `GET /users/:id` ve uno. Responde 200 y el usuario.
- `PATCH /users/:id` modifica. Responde 200 y el usuario.
- `DELETE /users/:id` borra. Responde 204 y un cuerpo vacío.

Otra ruta responde 404 y un cuerpo vacío. No hay mensaje nuevo.

Si la función lanza un `Error` de la lista, el cuerpo es JSON con la
clave `message` y ese texto.

## Ficheros

Se crean:

- `src/clients/http/app.js`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `docs/ARCHITECTURE.md`
- `docs/TREE.md`

`package.json` añade `express@5.3.0` y el script `http`. El script
`format` también incluye `src/clients/http/**/*.js`.

En el árbol, `clients/` incluye `http/app.js`. En la arquitectura, ese
cliente llama a `src/logic/`, escucha en el puerto 3001 y no repite
sus reglas. No sustituye a `src/db/server.js`.

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

## Autorización y referencia fijada

Esta tarea autoriza spec, plan, tareas e implementación sin pausas SDD.
El commit revisado es `02c6fa08bef40a0add29e99e8955eee9ce8f1ae5`.
Se han leído completos el código HTTP, manifiesto, lockfile, spec, plan,
tareas, árbol y arquitectura de ese commit. El cliente HTTP conserva su
contenido exacto. Los scripts locales de navegador y los demás paquetes se
conservan: no se añaden paquetes de terminal ausentes en esta copia.

Las peticiones Bruno y la evidencia viven en esta carpeta de spec, no en
la lógica ni en el cliente HTTP. No hay funcionalidad nueva de negocio,
por lo que se conservan los clientes de terminal existentes.

## Socket: revisión del 3 de noviembre de 2026

Se revisan Express y tres capas obtenidas del lockfile fijado: 54 pares
nombre/versión. MCP organizations y depscore completados tras errores
transitorios HTTP 429. PURL autenticado por versión: 54 registros completos,
54 alertas. Ninguna de las cinco puntuaciones está por debajo de 50.
El mínimo es maintenance 50 en safer-buffer; 50 no es inferior a 50.

MCP threat_feed devuelve HTTP 403, threat_feed_not_entitled: las campañas
no se pueden comprobar con este acceso. No significa ausencia de campañas.
Todas las alertas recibidas llevan action ignore de la política de la
organización; eso no es aceptación humana del riesgo.

Hay alertas altas socketUpgradeAvailable en safer-buffer@2.1.2,
es-define-property@1.0.1 y side-channel@1.1.1; también medias usesEval en
depd y networkAccess en router y Express. No se aceptaron automáticamente. El 4 de noviembre de 2026 se aceptaron
explícitamente, para esta entrega local, las alertas reportadas y el límite
de campañas no verificadas. Se autorizó instalar las versiones exactas sin
sustituciones. Se instaló con frozen-lockfile e ignore-scripts: el hash del
lockfile se conserva y los 54 pares hasta tres capas coinciden con lo revisado.

En la tabla, las puntuaciones son licencia / mantenimiento / calidad /
cadena de suministro / vulnerabilidades (0–100). Campañas no disponibles
aplica a cada versión, no solo a Express.

| Paquete y versión | Capa | Campañas | Alertas de esta versión | Puntuaciones | Alguna <50 |
| --- | --- | --- | --- | --- | --- |
| accepts@2.0.0 | 1 | No disponible | newAuthor (low) | 100 / 84 / 100 / 99 / 100 | No |
| body-parser@2.4.0 | 1 | No disponible | Sin alertas en esta consulta | 100 / 93 / 100 / 99 / 100 | No |
| bytes@3.1.2 | 2 | No disponible | Sin alertas en esta consulta | 100 / 81 / 99 / 100 / 100 | No |
| content-disposition@2.0.1 | 1 | No disponible | Sin alertas en esta consulta | 100 / 86 / 100 / 100 / 100 | No |
| content-type@2.1.0 | 1 | No disponible | Sin alertas en esta consulta | 100 / 88 / 90 / 100 / 100 | No |
| cookie-signature@1.2.2 | 1 | No disponible | Sin alertas en esta consulta | 100 / 82 / 69 / 100 / 100 | No |
| cookie@0.7.2 | 1 | No disponible | Sin alertas en esta consulta | 100 / 85 / 99 / 100 / 100 | No |
| debug@4.4.3 | 1 | No disponible | envVars (low) | 100 / 81 / 100 / 99 / 100 | No |
| depd@2.0.0 | 1 | No disponible | envVars (low), unmaintained (low), usesEval (middle) | 100 / 75 / 100 / 99 / 100 | No |
| ee-first@1.1.1 | 2 | No disponible | unmaintained (low) | 100 / 75 / 92 / 100 / 100 | No |
| encodeurl@2.0.1 | 1 | No disponible | Sin alertas en esta consulta | 100 / 90 / 99 / 100 / 100 | No |
| es-define-property@1.0.1 | 2 | No disponible | socketUpgradeAvailable (high) | 100 / 53 / 81 / 66 / 100 | No |
| es-errors@1.3.0 | 3 | No disponible | Sin alertas en esta consulta | 100 / 79 / 84 / 100 / 100 | No |
| escape-html@1.0.3 | 1 | No disponible | unmaintained (low) | 100 / 75 / 78 / 100 / 100 | No |
| etag@1.8.1 | 1 | No disponible | filesystemAccess (low), unmaintained (low) | 100 / 75 / 99 / 100 / 100 | No |
| express@5.3.0 | 0 | No disponible | dynamicRequire (low), envVars (low), filesystemAccess (low), networkAccess (middle) | 100 / 92 / 100 / 97 / 100 | No |
| finalhandler@2.1.1 | 1 | No disponible | envVars (low) | 100 / 84 / 100 / 99 / 100 | No |
| forwarded@0.2.0 | 2 | No disponible | unmaintained (low) | 100 / 75 / 83 / 100 / 100 | No |
| fresh@2.0.0 | 1 | No disponible | Sin alertas en esta consulta | 100 / 83 / 99 / 100 / 100 | No |
| http-errors@2.0.1 | 1 | No disponible | newAuthor (low) | 100 / 84 / 100 / 99 / 100 | No |
| iconv-lite@0.7.3 | 2 | No disponible | urlStrings (low) | 100 / 93 / 100 / 100 / 100 | No |
| inherits@2.0.4 | 2 | No disponible | unmaintained (low) | 100 / 75 / 76 / 100 / 100 | No |
| ipaddr.js@1.9.1 | 2 | No disponible | gptAnomaly (low) | 100 / 82 / 100 / 100 / 100 | No |
| is-promise@4.0.0 | 2 | No disponible | unmaintained (low) | 100 / 75 / 66 / 100 / 100 | No |
| media-typer@1.1.1 | 2 | No disponible | Sin alertas en esta consulta | 100 / 84 / 98 / 100 / 100 | No |
| merge-descriptors@2.0.0 | 1 | No disponible | Sin alertas en esta consulta | 100 / 79 / 80 / 100 / 100 | No |
| mime-db@1.54.0 | 2 | No disponible | Sin alertas en esta consulta | 100 / 84 / 100 / 100 / 100 | No |
| mime-types@3.0.2 | 1 | No disponible | Sin alertas en esta consulta | 100 / 85 / 100 / 100 / 100 | No |
| ms@2.1.3 | 2 | No disponible | Sin alertas en esta consulta | 100 / 84 / 86 / 100 / 100 | No |
| negotiator@1.1.0 | 2 | No disponible | Sin alertas en esta consulta | 100 / 85 / 100 / 100 / 100 | No |
| object-inspect@1.13.4 | 3 | No disponible | urlStrings (low) | 100 / 81 / 96 / 99 / 100 | No |
| on-finished@2.4.2 | 1 | No disponible | debugAccess (low) | 100 / 86 / 100 / 100 / 100 | No |
| once@1.4.0 | 1 | No disponible | unmaintained (low) | 100 / 75 / 91 / 100 / 100 | No |
| parseurl@1.3.3 | 1 | No disponible | unmaintained (low) | 100 / 75 / 99 / 100 / 100 | No |
| path-to-regexp@8.4.2 | 2 | No disponible | urlStrings (low) | 100 / 91 / 100 / 100 / 100 | No |
| proxy-addr@2.0.8 | 1 | No disponible | Sin alertas en esta consulta | 100 / 84 / 100 / 99 / 100 | No |
| qs@6.17.1 | 1 | No disponible | Sin alertas en esta consulta | 100 / 97 / 100 / 99 / 100 | No |
| range-parser@1.3.0 | 1 | No disponible | newAuthor (low) | 100 / 85 / 95 / 100 / 100 | No |
| raw-body@3.0.2 | 2 | No disponible | debugAccess (low) | 100 / 86 / 100 / 99 / 100 | No |
| router@2.2.0 | 1 | No disponible | networkAccess (middle), newAuthor (low) | 100 / 83 / 100 / 99 / 100 | No |
| safer-buffer@2.1.2 | 3 | No disponible | unmaintained (low), socketUpgradeAvailable (high) | 100 / 50 / 100 / 67 / 100 | No |
| send@1.2.1 | 1 | No disponible | gptAnomaly (low), filesystemAccess (low) | 100 / 85 / 100 / 99 / 100 | No |
| serve-static@2.2.1 | 1 | No disponible | Sin alertas en esta consulta | 100 / 84 / 99 / 99 / 100 | No |
| setprototypeof@1.2.0 | 2 | No disponible | unmaintained (low) | 100 / 75 / 73 / 100 / 100 | No |
| side-channel-list@1.0.1 | 3 | No disponible | Sin alertas en esta consulta | 100 / 80 / 88 / 99 / 100 | No |
| side-channel-map@1.0.1 | 3 | No disponible | Sin alertas en esta consulta | 100 / 79 / 87 / 99 / 100 | No |
| side-channel-weakmap@1.0.2 | 3 | No disponible | gptAnomaly (low) | 100 / 79 / 87 / 99 / 100 | No |
| side-channel@1.1.1 | 2 | No disponible | socketUpgradeAvailable (high) | 100 / 53 / 87 / 66 / 100 | No |
| statuses@2.0.2 | 1 | No disponible | newAuthor (low) | 100 / 83 / 99 / 100 / 100 | No |
| toidentifier@1.0.1 | 2 | No disponible | Sin alertas en esta consulta | 100 / 83 / 82 / 100 / 100 | No |
| type-is@2.1.0 | 1 | No disponible | newAuthor (low) | 100 / 87 / 100 / 99 / 100 | No |
| unpipe@1.0.0 | 3 | No disponible | unmaintained (low) | 100 / 75 / 78 / 100 / 100 | No |
| vary@1.1.2 | 1 | No disponible | unmaintained (low) | 100 / 75 / 99 / 100 / 100 | No |
| wrappy@1.0.2 | 2 | No disponible | newAuthor (low), unmaintained (low) | 100 / 75 / 73 / 100 / 100 | No |

## Comprobación y aceptación

Preparar el cliente exacto, scripts, lockfile propuesto, árbol, arquitectura
y colección Bruno. Comprobar sintaxis, formato, lint, igualdad con el commit
fijado, integridad de las capas y conservación de componentes y datos.
Las comprobaciones independientes de lógica se ejecutan una vez sobre una
copia temporal con SQLite ficticio; no validan las rutas Express.

Tras la aceptación explícita se completaron la instalación y las pruebas:
31 peticiones HTTP con Node (39 comprobaciones) y las 30 peticiones reales
del runner de Bruno en VS Code (25 online y 5 offline, todas pasadas).
La cobertura y evidencia están en verification.md. No se repitió Socket,
no se cambiaron versiones y el límite de campañas sigue vigente.
La autorización final permite publicar esta entrega mediante commit selectivo
y push en la rama existente. Se excluyen archivos temporales, dependencias
instaladas, datos y configuración. La PR permanece en draft, sin revisores
ni merge.
