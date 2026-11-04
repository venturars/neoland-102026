# Plan — alta de usuario en Chrome y Electron

Issue: #1005.

No es una funcionalidad nueva de negocio. Electron llama a `createUser` en `src/logic/`, igual que el navegador. Chrome llama a `POST /users` de la API local en `127.0.0.1:3002`, que ya usa `createUser` en el servidor.

Se copia la estructura de la pantalla de selección del web: `index.html` y estilos `.panel` en Chrome y Electron. No se toca `src/clients/web/`.

En Chrome, `popup.js` añade `createUser` por `fetch` (como `updateUser`) y el manejador `createNewUser` enlazado al formulario.

En Electron, `app.js` importa `createUser` desde `src/logic/` y repite el mismo flujo que el web.

## Ficheros

Se crean:

- `docs/specs/chrome-electron-create-user/` (`spec.md`, `plan.md`, `tasks.md`)

Se tocan:

- `src/clients/chrome/index.html`
- `src/clients/chrome/styles.css`
- `src/clients/chrome/popup.js`
- `src/clients/electron/index.html`
- `src/clients/electron/styles.css`
- `src/clients/electron/app.js`
- `docs/ARCHITECTURE.md`

No se tocan `src/logic/`, `src/clients/web/`, `src/clients/chrome/server.js` (la ruta POST ya existe), ni `package.json`.

## Llamadas

| Cliente   | Recuadro crear | Llamada                                      |
| --------- | -------------- | -------------------------------------------- |
| Electron  | Crear usuario  | `createUser({ name, email })` en `app.js`    |
| Chrome    | Crear usuario  | `POST http://127.0.0.1:3002/users` en popup |

Tras un alta correcta, se vacían los campos y se vuelve a pedir la lista para el desplegable.
