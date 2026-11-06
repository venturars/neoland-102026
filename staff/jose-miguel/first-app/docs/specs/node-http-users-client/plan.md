# Plan · Cliente node-http

Issue: #1131.

Cliente nuevo. No hay firma nueva en `logic/`. Puerto **3004**.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `src/clients/node-http/server.js`, `README.md`, `jupyter/*.ipynb` (6) |
| Crear | `scripts/start-jupyter-node-http.js` |
| Crear | `docs/specs/node-http-users-client/spec.md`, `plan.md`, `tasks.md` |
| Tocar | `package.json` (scripts `node-http`, `jupyter-node-http`; `cli-table3@0.6.5` para tablas en notebooks) |
| Tocar | `docs/TREE.md`, `ARCHITECTURE.md`, `STARTUP.md`, `AGENTS.md` |

No se toca: `logic/`, `queries/`, `db/`, Express, Nest, Chrome, Bruno.

## Técnica

- `server.js` con `node:http`; mismas rutas que el plan; errores por `Error.message` (como Express).
- `updateUser(id, changes)`; `usersGenderCount()` desde `users-gender-count.js`.
- `pnpm node-http` → `node src/clients/node-http/server.js`.
- `pnpm jupyter-node-http` → `node scripts/start-jupyter-node-http.js` (carpeta `src/clients/node-http/jupyter/`).

## Validación Socket

Paquete nuevo para notebooks: `cli-table3@0.6.5`.

| capa | paquete@versión | campaña | alertas | license | maint. | quality | supply | vuln | stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | `cli-table3@0.6.5` | n/d | n/d | 100 | 81 | 100 | 100 | 100 | ninguna |

Sin otras dependencias npm nuevas del servidor (`node:http` nativo).
