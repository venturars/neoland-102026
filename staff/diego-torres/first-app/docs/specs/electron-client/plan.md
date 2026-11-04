# Plan — cliente de escritorio de usuarios

Issue: #935

Funcionalidad nueva, solo en `src/clients/`. No hay firma nueva en `src/logic/`, ni SQL nuevo, ni mensaje nuevo. `src/db/server.js` no cambia.

Hay un paquete nuevo: `electron@45.2.2`, en `devDependencies`. **No se ha comprobado con Socket**: Diego decidió seguir sin esa comprobación. Ver abajo.

## Cómo funciona

- `main.js` es el proceso principal de Electron. Abre la ventana y carga con `loadFile` el `index.html` que tiene al lado.
- La página es un fichero local, como la web. Llama a `src/logic/` y esta llega a la base con `fetch` a `http://127.0.0.1:3000/execute`, la dirección que ya usa `src/queries/users.js`.
- El servidor ya da permiso CORS a los orígenes `file://` y `null`. Se comprueba al probar.
- Se dejan los valores por defecto de seguridad de Electron: `contextIsolation` activo y `nodeIntegration` apagado. No hay preload, porque la página no usa Node.
- Las operaciones se importan fichero a fichero, no desde `logic/index.js`. Ese índice arrastra `users-gender-count.js`, que importa `openai`, y la página no resuelve paquetes de `node_modules`. La web ya lo hace así.
- No se importa nada de `src/clients/web/`.

## Ficheros

Se crean, en `src/clients/electron/`, con una función exportada por fichero:

- `main.js` — abre la ventana. Al cerrar todas sale, salvo en macOS. Al activar en macOS sin ventanas, abre una. Importa `process` de `node:process`, como `scripts/browser.js`.
- `index.html` — dos `<section data-screen>`, `list` y `detail`, y un `<p id="message" role="status">`. Carga `app.js` como `type="module"`.
- `styles.css` — el aspecto de las dos pantallas. El mensaje de error se distingue del resto.
- `app.js` — conecta formularios y botones con su función y abre la lista.
- `state.js` — `STATE`, con `currentUser` e `isBusy`.
- `show-screen.js` — `showScreen(name)`.
- `show-message.js` — `showMessage(text, isError)`.
- `load-users.js` — `loadUsers()`: abre la lista y la pinta con `listUsers()`.
- `create-user-from-form.js` — `createUserFromForm(event)`: llama a `createUser({ name, email })`.
- `show-user.js` — `showUser(user)`: pinta la ficha. La usan ver y guardar.
- `open-user.js` — `openUser(id)`: llama a `findUserById(id)` y abre la ficha.
- `save-user.js` — `saveUser(event)`: llama a `updateUser(id, { name, email })`.
- `delete-current-user.js` — `deleteCurrentUser()`: pide `confirm`, llama a `deleteUser(id)` y vuelve a la lista.

Los campos no llevan `required` y son `type="text"`. Así el navegador no se adelanta y los mensajes son los de `logic`.

Los textos de la base se ponen con `textContent`. Lo que ve la persona está en castellano. El código lleva comentarios por bloques en castellano, también encima de cada import.

Se tocan:

- `package.json` — `electron` `45.2.2` en `devDependencies`, script `"electron": "electron src/clients/electron/main.js"` y `src/clients/electron/**/*.{js,html,css}` en `format`.
- `pnpm-lock.yaml` — lo actualiza `pnpm install`.
- `eslint.config.js` — `document` y `confirm` también para `src/clients/electron/**/*.js`.
- `AGENTS.md` — lista de dependencias, comando `pnpm electron`, alcance de `pnpm format` y clientes que necesitan el servidor.
- `docs/ARCHITECTURE.md` — fila en «Quién sabe qué» y sitios donde se ejecuta `logic`.
- `docs/TREE.md` — `clients/electron/`.

## Firma

No hay función nueva en `src/logic/`. El cliente usa `createUser`, `listUsers`, `findUserById`, `updateUser` y `deleteUser`.

## SQL

No hay SQL.

## Errores

El cliente muestra `error.message` tal como llega.

| Fallo de la spec | Mensaje de `docs/ERRORS.md` |
| --- | --- |
| El nombre queda vacío | `Name is empty` |
| El email no vale | `Email is invalid` |
| El email es de otro usuario | `Email is already used` |
| El usuario no está | `User not found` |
| No se llega a la base al crear | `Could not create the user` |
| No se llega al listar | `Could not list the users` |
| No se llega al ver uno | `Could not find the user` |
| No se llega al modificar | `Could not update the user` |
| No se llega al borrar | `Could not delete the user` |

`No hay usuarios todavía` y `Datos guardados` son textos de pantalla, no errores. Ya los usa la web.

## Socket

**No se ha comprobado.** Fecha del intento: 2026-11-04. Motivo: en la sesión que escribió este plan no había herramientas de Socket cargadas y `SOCKET_API_TOKEN` no estaba definida, ni en el entorno de la sesión ni en las variables de usuario de Windows.

La tabla queda sin datos: las columnas dicen `sin comprobar` porque nadie ha consultado estos paquetes con Socket para este plan. Eso no dice que estén limpios.

Las versiones salen de `npm view`, resolviendo cada rango a su versión más alta, desde `electron@45.2.2` y hasta 3 capas. Son 13 paquetes.

Corrección tras instalar: la primera versión de este plan decía 12. Faltaba `undici@7.30.1`, una dependencia opcional de `@electron/get` que salió en el `pnpm-lock.yaml`. Como `openai` lo admite como dependencia opcional, el lockfile también asocia `openai@7.39.0` a esa versión de `undici`. La versión de `openai` no cambia.

| Capa | Paquete | Campaña | Alerta | Stats por debajo de 50 |
| --- | --- | --- | --- | --- |
| 0 | `electron@45.2.2` | sin comprobar | sin comprobar | sin comprobar |
| 1 | `@electron/get@5.1.0` | sin comprobar | sin comprobar | sin comprobar |
| 1 | `@electron-internal/extract-zip@1.0.8` | sin comprobar | sin comprobar | sin comprobar |
| 1 | `@types/node@24.19.2` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `debug@4.4.3` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `env-paths@3.0.0` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `graceful-fs@4.2.11` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `progress@2.0.3` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `semver@7.8.6` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `sumchecker@3.0.1` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `undici-types@7.24.6` | sin comprobar | sin comprobar | sin comprobar |
| 2 | `undici@7.30.1` (opcional) | sin comprobar | sin comprobar | sin comprobar |
| 3 | `ms@2.1.3` | sin comprobar | sin comprobar | sin comprobar |

Tras instalar, el `pnpm-lock.yaml` se compara con esta tabla. Si una versión no coincide, se para y esa versión vuelve a Socket.

`electron@45.2.2` no declara script de instalación (`npm view`), así que pnpm 10 no debería bloquearlo y no se crea `.npmrc`. Si `pnpm electron` falla porque falta el binario, se para y se pregunta antes de tocar la configuración de pnpm.

## Decisión

El 2026-11-04, con la comprobación sin hacer y sabiendo que `AGENTS.md` la pide antes de aceptar el plan, Diego aceptó la spec y el plan y decidió seguir sin Socket.
