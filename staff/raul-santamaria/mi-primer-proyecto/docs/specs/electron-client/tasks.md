# Tareas — cliente Electron

Issue: #899.

- [x] 1. Crear `src/clients/electron/main.js` con arranque y parada de `src/db/server.js`. Al ejecutar `pnpm electron` se abre una ventana.
- [x] 2. Crear `index.html`, `app.js` y `styles.css` en `src/clients/electron/`. Listar, elegir, modificar y borrar usuarios con los mismos mensajes que el browser.
- [x] 3. Añadir `electron` y `electron-builder` en `package.json`, scripts `electron` y `electron:dist`, y bloque `build` para Windows.
- [x] 4. Actualizar `docs/ARCHITECTURE.md`, `docs/TREE.md` y `eslint.config.js`. Ejecutar `pnpm format` y `pnpm lint`.
- [x] 5. Comprobar `pnpm electron:dist` y abrir el instalador generado en `dist-electron/` en Windows.
