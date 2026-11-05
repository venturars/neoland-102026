# Plan — cliente Electron

Cumple `docs/specs/electron-client/spec.md`.

No hay operación nueva ni SQL nuevo. Listar, crear, modificar y eliminar siguen en la lógica que ya existe. Buscar y contar el género no entran. Crear la tabla no se pide aparte.

## Ficheros

Se crea `src/clients/electron/`:

- `main.js` abre la ventana.
- `index.html` es la ventana.
- `app.js` pide listar, crear, modificar y eliminar.
- `styles.css` pinta el libro de registro.

No hay `preload.js`. La página importa la lógica, igual que las pantallas del navegador. El programa de consultas ya responde con `access-control-allow-origin: *`, así que la página puede llamar a `127.0.0.1:3000` sin otra vía.

Se toca `package.json`. El script `electron` queda `electron src/clients/electron/main.js`. Se lanza con `pnpm electron` desde `first-app`, con `pnpm server` en marcha. El campo `main` sigue en `index.js`. El script `format` también escribe `src/clients/electron/**/*.js`.

pnpm añade `electron` `45.2.2` en `dependencies`. `pnpm-lock.yaml` lo escribe pnpm. No se edita a mano. No se usa npm ni yarn. No se genera un instalador. No hay `pnpm-workspace.yaml`: esa versión ya está fuera de las 24 horas de antigüedad mínima de pnpm.

No se tocan `src/logic`, `src/queries`, `src/db`, `src/clients/terminal`, `src/clients/jupyter`, `src/clients/browser` ni `src/clients/http`.

En el mismo cambio que el código se tocan `docs/CONSTITUTIONS.MD`, `AGENTS.MD`, `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STYLE.md` y `docs/ERRORS.md`. `docs/DATABASE.md` no cambia: la base sigue igual.

## Validación Socket

`depscore` respondió el 2026-11-05. Ninguna stat está por debajo de 50. El árbol es el que resolvió `npm view` para `electron@45.2.2` y el `pnpm-lock.yaml`, hasta 3 capas. Son 13 paquetes, sin repetir. `undici@7.30.1` es opcional de `@electron/get@5.1.0` y no trae dependencias, así que no abre una capa 3 nueva. `openai` sigue en `7.39.0`. El lockfile también lo asocia a `undici@7.30.1` porque esa dependencia es opcional para los dos. La versión de `openai` no cambia.

`organizations` respondió `Unauthorized` después de autenticar el MCP. Sin `org_slug` no se ha podido llamar a `alerts` ni a `threat_feed`. No hay dato de alerta ni de campaña. Eso no es ausencia de avisos.

| Paquete | Versión | Capa | Campaña | Alertas | Stats por debajo de 50 |
| --- | --- | --- | --- | --- | --- |
| `electron` | `45.2.2` | 0 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 97, calidad 99, cadena 99, vulnerabilidad 100 |
| `@types/node` | `24.19.2` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 96, calidad 80, cadena 100, vulnerabilidad 100 |
| `@electron/get` | `5.1.0` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 82, calidad 100, cadena 99, vulnerabilidad 100 |
| `@electron-internal/extract-zip` | `1.0.8` | 1 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 94, calidad 98, cadena 95, vulnerabilidad 100 |
| `undici-types` | `7.24.6` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 96, calidad 74, cadena 100, vulnerabilidad 100 |
| `debug` | `4.4.3` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 81, calidad 100, cadena 99, vulnerabilidad 100 |
| `semver` | `7.8.6` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 95, calidad 100, cadena 100, vulnerabilidad 100 |
| `progress` | `2.0.3` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 99, cadena 100, vulnerabilidad 100 |
| `env-paths` | `3.0.0` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 80, calidad 99, cadena 100, vulnerabilidad 100 |
| `sumchecker` | `3.0.1` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 75, calidad 98, cadena 99, vulnerabilidad 100 |
| `graceful-fs` | `4.2.11` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 79, calidad 100, cadena 99, vulnerabilidad 100 |
| `undici` | `7.30.1` | 2 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 97, calidad 99, cadena 92, vulnerabilidad 100. Opcional de `@electron/get` |
| `ms` | `2.1.3` | 3 | sin dato | sin dato | ninguna. Licencia 100, mantenimiento 84, calidad 86, cadena 100, vulnerabilidad 100 |

Quien acepta el plan decide si sigue sin alerta ni campaña.

## Firma

No hay función de negocio nueva. `app.js` importa cuatro funciones que ya existen:

| Acción en la ventana | Llamada |
| --- | --- |
| Listar | `listUsers()` |
| Crear | `createUser({ name, email })` |
| Modificar | `updateUser(id, { name, email })` |
| Eliminar | `deleteUser(id)` |

No importa `usersGender`, `findUserById`, `findUserByEmail` ni `findUserByName`. No llama a `/execute`. No valida, no escribe SQL y no abre la base.

El formulario de modificar muestra el nombre y el email ya guardados y envía los dos. La lógica sigue aceptando solo uno. Esta ventana no usa ese caso.

## SQL

No hay SQL nuevo. Cada acción usa la operación que ya está escrita.

## Cliente

`main.js` importa `app` y `BrowserWindow` desde `electron`. `package.json` ya tiene `"type": "module"`. Cuando la app está lista, abre una ventana y carga `index.html` de la misma carpeta, no el del directorio de trabajo. `nodeIntegration` sigue inactivo y `contextIsolation` sigue activo. No hay `preload`. Al cerrar la ventana, la app sale. No escucha en un puerto.

La dirección visual es la que ya está en `docs/STYLE.md`, sección «Dirección del cliente web». El encargo ya fijó ese libro de registro, así que la ventana no trae otra paleta ni otra tipografía. Chapa `#E4E8EA`, tinta `#1B2830`, latón `#A6843D`, óxido `#8F3D36`, niebla `#F7F8F8` y grafito `#5C6B73`. Literata para el título de la vista y el nombre elegido. Familjen Grotesk para la lista, las etiquetas, los campos, los botones y los fallos. Texto a la izquierda, una columna de menos de 80 caracteres, una línea por persona y botones al ancho de la columna. El latón solo marca el id y el foco. El óxido solo marca el fallo y Eliminar. No hay animación. En una ventana estrecha el email baja bajo el nombre.

La lista se llama Usuarios. Cada línea lleva el id, el nombre y el email. Si no hay nadie, la lista se queda vacía y no se muestra un fallo. Debajo están el id, Elegir y Crear.

```
Usuarios
12  Ana García
    ana@example.com
————————
4   Luis Martín
    luis@example.com

Id [        ]  Elegir
Crear
```

Elegir abre el menú de esa persona. El nombre va grande. Las acciones son Volver y Modificar usuario. No hay Notas.

```
Ana García
id 12

Volver
Modificar usuario
```

Crear se pide desde la lista. La vista se llama Crear usuario. Entra el nombre y el email. Guardar vuelve a la lista y esa persona aparece, con el id que asigna la base. Volver vuelve a la lista sin guardar.

```
Crear usuario

Nombre [        ]
Email  [        ]

Guardar
Volver
```

Modificar deja el id, el nombre y el email. Guardar, Eliminar y Volver van debajo. Guardar y Eliminar vuelven a la lista. Volver vuelve al menú.

Si la función lanza un `Error`, se muestra `error.message` y no se cambia de vista. El texto no se reescribe. Ahí entran `Name is required`, `Name must be at most 100 characters`, `Email is required`, `Email is not valid`, `User id must be a positive integer`, `Provide a name or an email to update`, un mensaje que termina en `was not found` y un mensaje que contiene `UNIQUE constraint`. Si el programa de consultas no está en marcha, se muestra el fallo de esa llamada y la operación no se completa.

Para elegir, el id se busca en la lista ya cargada. Si no es un entero positivo, se ve `User id must be a positive integer`. Si no está en la lista, se ve `User ${id} was not found`. Esa elección no llama a buscar.

## Documentación

`docs/ARCHITECTURE.md` gana el cliente Electron: otra forma de listar, crear, modificar y eliminar, en una ventana de escritorio. Se abre con `pnpm electron` desde `first-app`, con el programa local en marcha. Importa la lógica. No busca y no cuenta el género. No incluye notas. La terminal, Jupyter, las pantallas y el cliente HTTP siguen igual.

`docs/TREE.md` añade `clients/electron/` con `main.js`, `index.html`, `app.js` y `styles.css`.

`docs/STYLE.md` dice que la ventana Electron usa la misma dirección del libro de registro. Añade la vista Crear usuario y deja el menú de esta ventana en Volver y Modificar usuario. Las pantallas del navegador conservan Notas.

`docs/ERRORS.md` añade que, si Electron no abre la ventana, no se puede pedir la operación desde ahí. Si el programa local no está en marcha, la ventana muestra el fallo de esa llamada.

`docs/CONSTITUTIONS.MD` cuenta la ventana Electron y `pnpm electron`. El desarrollo abierto pasa a ser `docs/specs/electron-client/`.

`AGENTS.MD` deja la regla: el cliente vive en `src/clients/electron`. `app.js` importa `listUsers`, `createUser`, `updateUser` y `deleteUser`. No importa `usersGender` ni las búsquedas. No llama a `/execute`. No valida, no escribe SQL y no abre la base. Se arranca con `pnpm electron` desde `first-app`. Electron queda en `45.2.2`.

## Pregunta

La constitución y `AGENTS.MD` dicen que no se añade otro framework. Express `5.3.0` es la excepción ya aceptada. Los clientes que ya están son la terminal, Jupyter, el navegador y el HTTP.

La spec pide una ventana Electron. Electron `45.2.2` es un framework y un paquete nuevo. El código no lo tiene.

¿Se actualizan la constitución y las guías para permitir este cliente con Electron `45.2.2`? Hasta esa respuesta no hay `tasks.md`.

## Corrección tras la revisión

La primera instalación usó `electron@45.2.3`, publicado el 2026-11-04 a las 21:39 UTC. pnpm rechaza lo publicado dentro de las últimas 24 horas y escribió `pnpm-workspace.yaml` para excluir esa versión. El plan no lo decía.

`electron@45.2.2` se publicó el 2026-11-03 a las 21:43 UTC y ya pasa esa comprobación. El 2026-11-05, `pnpm install` termina sin exclusión y sin `pnpm-workspace.yaml`. `depscore` de `electron@45.2.2` y de `undici@7.30.1` está en la tabla de arriba. `organizations` sigue respondiendo `Unauthorized`, así que alerta y campaña siguen sin dato.
