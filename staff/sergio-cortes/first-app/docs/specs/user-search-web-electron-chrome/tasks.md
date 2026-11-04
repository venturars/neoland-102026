# Tareas: búsqueda en web, Electron y Chrome

Issue: #1029 · PR: #1030. [Spec](spec.md) y [plan](plan.md) aprobados.

Rutas relativas a `staff/sergio-cortes/first-app/`. Marcar cada paso al completarlo.

1. En `src/clients/web/index.html` y `src/clients/electron/index.html`, insertar el panel «Buscar usuario» entre la lista y el alta (mismo markup que VS Code #1018).
2. En `src/clients/chrome/index.html`, el mismo panel de búsqueda.
3. En `src/clients/web/app.js`: importar `findUserByName` y `findUserByEmail`; añadir `fillUserSelect`, `rememberSelectedUser`, `searchUsers`; refactorizar `loadUserSelection` con `fillUserSelect`; registrar `#search-form` en `initializeClient`.
4. Repetir el mismo cambio en `src/clients/electron/app.js`.
5. En `src/clients/chrome/server.js`: rutas `GET /users/by-name` y `GET /users/by-email` (query) antes de `GET /users/:id`; importar la lógica de búsqueda.
6. En `src/clients/chrome/popup.js`: helpers fetch de búsqueda, `fillUserSelect`, `rememberSelectedUser`, `searchUsers`; refactorizar `loadUserSelection`; registrar el formulario de búsqueda.
7. Actualizar `docs/ARCHITECTURE.md` (búsqueda en web, electron, chrome y rutas Fastify).
8. `pnpm run format` y `pnpm run lint`.
9. Comprobar en web, electron y chrome los pasos de la issue #1029.
