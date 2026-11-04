# Plan — base de datos en un servidor

Issue: #779 (fase 1).

No hay paquetes npm nuevos. `fetch` nativo en Node y en el navegador. El servidor usa `node:http` y `node:sqlite`.

## Validación Socket

N/A — no se añaden ni cambian dependencias.

## Decisión

- Crear `src/db/server.js`; eliminar `src/db/connection.js`.
- Migrar SQL de `.sql` a módulos `.js` en `src/queries/queries/`.
- `src/queries/users.js` ejecuta vía `POST http://127.0.0.1:3000/execute`.
- Toda `src/logic/` pasa a `async` con firmas objeto (`createUser({ name, email })`, `updateUser(id, changes)`).
- Eliminar `src/logic/create-users-table.js`; la tabla se crea con `queries/users.js`.
- Actualizar terminal, jupyter, `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/TREE.md`, `docs/CONSTITUTIONS.md`, `docs/ERRORS.md`.
- Script `pnpm server` en `package.json`.
