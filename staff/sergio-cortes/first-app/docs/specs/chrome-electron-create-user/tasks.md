# Tareas — alta de usuario en Chrome y Electron

Issue: #1005.

1. Copiar en `src/clients/chrome/index.html` y `src/clients/electron/index.html` los dos recuadros `panel` de la pantalla de selección del web (lista y crear usuario).

2. Copiar en `src/clients/chrome/styles.css` y `src/clients/electron/styles.css` las reglas `.panel` del web.

3. En `src/clients/chrome/popup.js`, añadir `createUser` con `fetch` POST a `/users`, `createNewUser` y el listener en `initializeClient`.

4. En `src/clients/electron/app.js`, importar `createUser`, añadir `createNewUser` y el listener en `initializeClient`.

5. Actualizar `docs/ARCHITECTURE.md` para Chrome y Electron (selección con alta; popup POST vs `createUser` en escritorio).

6. `pnpm run format` y `pnpm run lint` en `first-app`.

7. Probar con `pnpm chrome` y `pnpm electron`: dos recuadros, alta válida, errores de validación, menú/edición/borrado sin cambios.
