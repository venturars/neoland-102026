Issue: #1009

# Plan del cliente de escritorio

## Enfoque

No hay funcionalidad nueva en `src/logic/`, ni consultas nuevas, ni cambios en `src/db/server.js` ni en los demás clientes. Hay una carpeta nueva, `src/clients/electron/`, con dos procesos separados:

- **El proceso principal**, `main.js`: abre la ventana, muestra el diálogo de borrado y atiende las peticiones de la página. Es el único que llama a `src/logic/`, a través de `user-actions.js`.
- **La página**, `index.html`, `app.js` y `styles.css`: pinta la lista y el panel, y traduce los errores. No importa `src/logic/` ni otro cliente, y no puede hacer peticiones de red.

Entre los dos está `preload.cjs`, que publica en la página solo cinco funciones, en `window.users`.

El recorrido es página → preload → proceso principal → lógica → consultas → servidor de datos → SQLite.

## Por qué la lógica va en el proceso principal

La página podría importar `src/logic/` directamente, como el cliente web. No se hace así por tres motivos:

- **El servidor de datos ejecuta cualquier SQL que recibe.** Si la página no puede llegar a él, tampoco puede hacerlo un contenido inesperado que se pinte en ella. La política de seguridad de la página lo bloquea todo menos sus propios archivos.
- **El diálogo del sistema solo existe en el proceso principal**, así que la página ya necesita un canal hacia él.
- **Aprender la separación propia de Electron**, que es lo que este cliente aporta frente al cliente web. Tampoco depende de las cabeceras CORS del servidor de datos, porque la petición sale de Node.

El coste son dos archivos más (`preload.cjs` y `user-actions.js`) y un formato de respuesta entre procesos.

## Entradas y salidas de la lógica

| Acción en la ventana | `window.users`        | Canal          | Llamada                   | Respuesta correcta         |
| -------------------- | --------------------- | -------------- | ------------------------- | -------------------------- |
| Cargar la lista      | `list()`              | `users:list`   | `listUsers()`             | `{ data: lista }`          |
| Elegir un usuario    | `find(id)`            | `users:find`   | `findUserById(id)`        | `{ data: usuario }`        |
| Crear                | `create(name, email)` | `users:create` | `createUser(name, email)` | `{ data: usuario }`        |
| Guardar              | `update(id, changes)` | `users:update` | `updateUser(id, changes)` | `{ data: usuario }`        |
| Borrar               | `remove(id)`          | `users:delete` | `deleteUser(id)`          | `{ data: null }` o cancela |

No se importan `find-user-by-email.js` ni `count-users-by-gender.js`.

- Si la lógica lanza un error, la respuesta es `{ error: mensaje }`, con el mensaje en inglés de `src/logic/`.
- `users:delete` pide primero la confirmación en `main.js`. Si se cancela, responde `{ cancelled: true }` y no llama a la lógica. Así la página no puede borrar sin pasar por el diálogo.
- El id viaja como número entre procesos, porque sale de la lista. No hace falta convertirlo.
- Guardar envía `name` y `email`: el formulario llega relleno, y `src/logic/` admite que un usuario conserve su propio email.

## Detalles que hay que resolver

Comprobado con `electron@45.2.2` en una carpeta temporal, fuera de la app, en macOS, importando `src/logic/list-users.js` sin servidor de datos:

- **El preload tiene que ser `.cjs`.** Con `sandbox`, activo por defecto, y `"type": "module"` en `package.json`, un `preload.js` con `import` falla con `Cannot use import statement outside a module` y `window.users` no existe.
- **Un error lanzado en un manejador llega deformado.** Si `ipcMain.handle` lanza `User name is required`, la página recibe `Error invoking remote method 'fail': Error: User name is required`, y la tabla de traducción no lo reconocería. Por eso se responde `{ error: mensaje }` en vez de relanzarlo.
- **La lógica funciona en el proceso principal.** `main.js` es un módulo ES y tiene `fetch`. Sin servidor de datos, `listUsers()` lanza `Unable to list users`.
- **La página está aislada.** Con los valores por defecto, `require` y `process` no existen en ella.
- **La política de seguridad funciona con `file://`.** Con `default-src 'none'; script-src 'self'; style-src 'self'` en una etiqueta `meta`, `app.js` carga como `type="module"` y un `fetch` al puerto `3000` queda bloqueado.
- **`electron` no tiene scripts de instalación.** `pnpm install` no descarga el binario y no hay que autorizar nada en pnpm. Lo descarga el primer arranque, con `install.js`, y comprueba su suma con el `checksums.json` del paquete.
- **`main.js` no puede esperar con `await` a nivel de módulo.** Con `await app.whenReady()` la ventana no se abre nunca: Electron carga el módulo antes de estar listo, y el módulo se queda esperando. Se usa `app.whenReady().then(createWindow)`. Descubierto al implementar.
- **`ELECTRON_RUN_AS_NODE=1` rompe el arranque.** Con esa variable, Electron actúa como Node y falla con `does not provide an export named 'BrowserWindow'`. Está definida en procesos lanzados desde extensiones de editores como VS Code o Cursor. Si aparece ese error, se arranca con `unset ELECTRON_RUN_AS_NODE`. No se cambia el script por esto.

El diálogo del sistema no se puede pulsar por script: en la comprobación automática de la ventana se sustituye su respuesta, así que verlo y pulsarlo queda como comprobación manual.

## Detalles de la ventana

- **`main.js`** crea la ventana con `preload`, `contextIsolation: true`, `nodeIntegration: false` y `sandbox: true`, escritos aunque sean los valores por defecto, para que se lean. Carga el `index.html` que está junto al archivo, no el del directorio de trabajo.
- **Cerrar:** `window-all-closed` llama a `app.quit()` en todos los sistemas. Con una sola ventana, no hace falta el manejador `activate`.
- **Diálogo de borrado:** `dialog.showMessageBox` con los botones Cancelar y Eliminar, y Cancelar como opción por defecto.
- **Lo que se escribe en la página usa `textContent`**, porque un nombre guardado puede tener caracteres HTML.
- **La selección se guarda en memoria**, en `app.js`. Al cerrar la ventana se pierde.
- **Tamaño:** se fija un mínimo en `BrowserWindow`, para que las dos zonas quepan sin diseño adaptable.

## Errores

`app.js` tiene su propia tabla `MESSAGES`, con las frases de la spec, según «Traducción en cada cliente» de [ERRORS.md](../../ERRORS.md). Un mensaje desconocido muestra la frase genérica. No hay mensajes nuevos en `src/logic/`.

Borrar sin servidor de datos muestra la frase de `Unable to find user`, no la de `Unable to delete user`, porque `deleteUser` busca primero al usuario. Es el comportamiento vigente de `src/logic/`, igual que en el cliente REST. `Unable to delete user` sigue en la tabla para un fallo durante el propio borrado.

`User id must be a positive integer` y `User changes must be an object` no pueden salir desde esta ventana, así que no entran en la tabla y caerían en la frase genérica.

## Archivos

Se crean:

- `src/clients/electron/main.js`
- `src/clients/electron/preload.cjs`
- `src/clients/electron/user-actions.js`: cinco funciones que llaman a `src/logic/` y devuelven `{ data }` o `{ error }`. Va aparte de `main.js` porque no importa `electron` y se puede probar con `node --test`.
- `src/clients/electron/index.html`
- `src/clients/electron/app.js`
- `src/clients/electron/styles.css`
- `tests/electron-client.test.js`: arranca el servidor de datos con una base temporal y comprueba las cinco funciones de `user-actions.js`, los errores de negocio y el `{ error }` de cada operación con el servidor parado.

Se modifican:

- `package.json`: `electron` fijado en `45.2.2` en `devDependencies` y el script `electron` (`electron src/clients/electron/main.js`).
- `pnpm-lock.yaml`
- `eslint.config.js`: un bloque para `src/clients/electron/app.js` con `document` y `window`, y otro para `preload.cjs` en CommonJS, con `require` y las mismas reglas.
- `README.md`: fila del cliente, primer arranque, código y qué muestra la ventana.
- `docs/ARCHITECTURE.md`: apartado del cliente, frase de los clientes, comando en `package.json` y descripción de `eslint.config.js`.
- `docs/TREE.md`: `src/clients/electron/`, la prueba y esta spec.
- `docs/ERRORS.md`: apartado del cliente de escritorio.
- `docs/STYLE.md`: dos excepciones. `app.js` y `user-actions.js` reúnen varias funciones en un archivo, y `user-actions.js` usa `{ data }` y `{ error }`, solo entre procesos de este cliente.
- `docs/CONSTITUTION.md`: apartados 1 y 3, con el texto de «Respuestas de la revisión».

No cambian `src/logic/`, `src/queries/`, `src/db/` ni los demás clientes.

## Verificación

1. `pnpm exec prettier --write` sobre los archivos de esta tarea, `pnpm lint` y `pnpm test`, con `pnpm start` y `pnpm run http` parados.
2. Comprobar en `pnpm-lock.yaml` que las versiones son las de «Revisión con Socket». Si alguna cambia, se vuelve a revisar.
3. Con `FIRST_APP_DATABASE_FILE` apuntando a una base temporal, `pnpm start` y `pnpm run electron`.
4. Recorrer en la ventana los casos de la spec. Esta parte es manual: `app.js`, `main.js` y `preload.cjs` no tienen prueba automática.
5. Parar el servidor de datos y repetir cada acción.
6. Base compartida: con `pnpm run web` y `pnpm run http`, sobre la misma base temporal.

## Revisión con Socket

- **Paquete:** `electron@45.2.2`, publicado el 3 de noviembre de 2026. Va en `devDependencies`.
- **Alcance:** 13 paquetes en tres niveles de dependencias, los que resuelve pnpm 10.34.7 en un lockfile aparte. Ningún paquete queda por debajo del nivel 3. Si en la app `pnpm` resuelve otra versión, hay que volver a revisarla.

| Nivel | Paquetes                                                                                                                                             | `license` y `vulnerability` | `maintenance` más bajo        | `quality` más bajo | `supplyChain` más bajo               |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------- | ------------------ | ------------------------------------ |
| 0     | `electron@45.2.2`                                                                                                                                    | 100                         | 97                            | 99                 | 99                                   |
| 1     | `@electron-internal/extract-zip@1.0.8`, `@electron/get@5.1.0`, `@types/node@24.19.2`                                                                 | 100                         | 82, `@electron/get`           | 80, `@types/node`  | 95, `@electron-internal/extract-zip` |
| 2     | `debug@4.4.3`, `env-paths@3.0.0`, `graceful-fs@4.2.11`, `progress@2.0.3`, `semver@7.8.6`, `sumchecker@3.0.1`, `undici@7.30.1`, `undici-types@7.24.6` | 100                         | 75, `progress` y `sumchecker` | 74, `undici-types` | 92, `undici`                         |
| 3     | `ms@2.1.3`                                                                                                                                           | 100                         | 84                            | 86                 | 100                                  |

**Puntuaciones (`depscore`):** se pidieron las 13 versiones exactas y respondieron todas. Ninguna está por debajo de 50. La más baja es 74.

**Campaña (`threat_feed`):** no se pudo revisar. La herramienta respondió `403 threat_feed_not_entitled` para la organización `aiai`: «Threat feed is not enabled for this organization». Se llamó solo con `electron@45.2.2`; la respuesta es de la organización, así que los demás paquetes quedan igual de sin revisar.

**Alertas (`alerts`):** la lista de alertas npm abiertas de `aiai` está vacía, también filtrando por `electron`. Es la lista de la organización: no dice que estas versiones no tengan alertas.

**Binario:** Socket revisa el paquete npm, no el binario que se descarga en el primer arranque. Ese binario solo lo protege la suma de `checksums.json`.

**Alertas pendientes:** ninguna conocida. La decisión sobre los datos de campaña está en «Respuestas de la revisión».

## Decisiones

1. **Lógica en el proceso principal**, con la página aislada, por lo explicado en «Por qué la lógica va en el proceso principal».
2. **Errores en español**, según la regla general de [ERRORS.md](../../ERRORS.md).
3. **Una ventana con dos zonas** y diálogo del sistema para borrar, en vez de pantallas que se sustituyen, porque una ventana de escritorio tiene espacio y dispone de diálogos nativos.
4. **Sin prueba automática de la ventana.** Probarla exigiría una dependencia nueva. Se cubre `user-actions.js` y el resto se comprueba a mano.

## Respuestas de la revisión

1. **Constitución:** se aprueba enmendar los apartados 1 y 3. Apartado 1: «El cliente de escritorio permite crear, listar, ver, modificar y borrar usuarios desde una ventana propia». Apartado 3: «El cliente de escritorio usa Electron, con HTML, CSS y JavaScript vanilla; la lógica se ejecuta en su proceso principal».
2. **Socket:** se acepta la revisión sin datos de campaña.
3. **Decisiones:** se aprueban las cuatro de este plan.
