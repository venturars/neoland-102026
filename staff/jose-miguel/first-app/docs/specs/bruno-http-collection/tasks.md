# Tareas · Colección Bruno del cliente HTTP

Este fichero se ejecuta solo tras aprobación del spec, del plan y de `axios@1.18.0`.

1. En `package.json`, añade `@usebruno/cli` en `4.3.0` a `devDependencies` y el script `bruno` que lanza `node scripts/run-bruno.js`. No cambies el script `test`.

2. Crea `scripts/run-bruno.js`: entra en `src/clients/http/bruno` y ejecuta `bru run 01-sql-online -r` (binario de `node_modules`).

3. Instala en first-app con `pnpm install`. `pnpm-lock.yaml` cambia. Comprueba que `@usebruno/cli` queda en `4.3.0` y que `axios` queda en `1.18.0`. Si otra versión no coincide con el plan, se para y vuelve a Socket.

4. Crea `src/clients/http/bruno/bruno.json` y `collection.bru` (`baseUrl` `http://127.0.0.1:3001`, `missingId` `999999`).

5. Crea `01-sql-online/` con `folder.bru` y las 13 peticiones del plan (empty-list hasta list-after-delete), mismos nombres, `seq` y `tests { }` que la colección de referencia.

6. Crea `02-sql-offline/` con `folder.bru` y las 5 peticiones 500 del plan.

7. Actualiza `docs/TREE.md` (`bruno/` bajo `http/`), el punto de `src/clients/http/` en `docs/ARCHITECTURE.md`, `docs/STARTUP.md`, `AGENTS.md` y `src/clients/http/README.md`. No toques `app.js`.

8. `pnpm format` y `pnpm lint` en first-app.

9. Con lista vacía, `pnpm server` y `pnpm http`, lanza `pnpm bruno`. Pasan los tests de `01-sql-online`.

10. Para solo el SQL. Desde la carpeta Bruno, lanza `02-sql-offline`. Cada petición es 500 con el `Could not …` de esa acción. El script `test` de npm sigue siendo el placeholder.
