# Tareas — base de datos en un servidor (#779 fase 1)

1. Crear `src/db/server.js` y borrar `src/db/connection.js`.
2. Migrar queries `.sql` → `.js`; añadir `list-tables.js`.
3. Reescribir `src/queries/users.js` con `fetch`.
4. Pasar `src/logic/` a `async` con firmas objeto; borrar `logic/create-users-table.js`.
5. Actualizar `src/clients/terminal/*.txt` y jupyter.
6. Actualizar `docs/CONSTITUTIONS.md`, `ERRORS.md`, `ARCHITECTURE.md`, `DATABASE.md`, `TREE.md`.
7. Añadir `"server": "node src/db/server.js"` en `package.json`.
8. Con `pnpm server` en marcha, probar terminal `list-users.txt` y `create-users-table.txt`.
9. `pnpm format` y `pnpm lint`.
