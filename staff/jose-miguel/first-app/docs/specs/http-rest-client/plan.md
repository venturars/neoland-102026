# Plan · Cliente HTTP REST con Express

Issue: #880.

No es una funcionalidad nueva en `logic/`. No hay SQL nuevo ni mensajes nuevos.

Hay un paquete nuevo: `express@5.3.0`. Entra validación Socket.

El cliente importa `createUser`, `listUsers`, `findUserById`, `updateUser`, `deleteUser`. El SQL sigue en `src/db/server.js` (`pnpm server`, puerto 3000). Este cliente escucha en `http://127.0.0.1:3001` (`ORIGIN`). Script `pnpm http`.

Rutas:

- `POST /users` → 201 + usuario
- `GET /users` → 200 + lista
- `GET /users/:id` → 200 + usuario
- `PATCH /users/:id` → 200 + usuario
- `DELETE /users/:id` → 204 sin cuerpo
- Otra ruta → 404 vacío

Errores: JSON `{ message }` con textos de `docs/ERRORS.md`.

| Fallo | Mensaje | HTTP |
| --- | --- | --- |
| Nombre vacío | `Name is empty` | 400 |
| Email inválido | `Email is invalid` | 400 |
| Email duplicado | `Email is already used` | 409 |
| Usuario inexistente | `User not found` | 404 |
| Fallo al crear | `Could not create the user` | 500 |
| Fallo al listar | `Could not list the users` | 500 |
| Fallo al buscar | `Could not find the user` | 500 |
| Fallo al actualizar | `Could not update the user` | 500 |
| Fallo al borrar | `Could not delete the user` | 500 |

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `src/clients/http/app.js`, `src/clients/http/README.md` |
| Crear | `docs/specs/http-rest-client/spec.md`, `plan.md`, `tasks.md` |
| Tocar | `package.json`, `pnpm-lock.yaml` |
| Tocar | `docs/ARCHITECTURE.md`, `docs/TREE.md`, `AGENTS.md` |

## Validación Socket

Cuenta sin threat feed (`threat_feed` → n/d). `depscore` vía MCP Socket (npm), nov 2026. Ninguna stat por debajo de 50 en el paquete principal ni dependencias directas revisadas.

| Capa | Paquete@versión | Campaña | Alertas (MCP) | license | maintenance | quality | supplyChain | vulnerability | stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | express@5.3.0 | n/d | sin filtrar en esta pasada | 100 | 92 | 100 | 97 | 100 | ninguna |
| 1 | body-parser@2.4.0 | n/d | — | 100 | 93 | 100 | 99 | 100 | ninguna |
| 1 | qs@6.17.1 | n/d | — | 100 | 97 | 100 | 99 | 100 | ninguna |
| 1 | router@2.2.0 | n/d | — | 100 | 83 | 100 | 99 | 100 | ninguna |
| 1 | send@1.2.1 | n/d | — | 100 | 85 | 100 | 99 | 100 | ninguna |
| 1 | debug@4.4.3 | n/d | — | 100 | 81 | 100 | 99 | 100 | ninguna |
| 1 | accepts@1.3.8 | n/d | — | 100 | 84 | 100 | 100 | 100 | ninguna |
| 1 | mime-types@3.0.2 | n/d | — | 100 | 85 | 100 | 100 | 100 | ninguna |
| 1 | serve-static@2.2.1 | n/d | — | 100 | 84 | 99 | 99 | 100 | ninguna |
| 1 | cookie@2.0.1 | n/d | — | 100 | 85 | 100 | 100 | 100 | ninguna |
| 1 | content-type@3.1.1 | n/d | — | 100 | 88 | 94 | 100 | 100 | ninguna |
| 1 | fresh@0.5.2 | n/d | — | 100 | 83 | 99 | 100 | 100 | ninguna |

Tras `pnpm install`, el árbol lockfile debe coincidir con `express@5.3.0`. Alertas abiertas del org en otras versiones de transitivas se revisan al pedir revisión de la PR si aplica.
