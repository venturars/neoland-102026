# Tareas · Cliente node-http

1. Añade `cli-table3@0.6.5` a `dependencies` y los scripts `node-http` y `jupyter-node-http` en `package.json`. Ejecuta `pnpm install`.

2. Crea `src/clients/node-http/server.js` (puerto 3004, rutas del plan, errores por mensaje).

3. Crea `scripts/start-jupyter-node-http.js` (mismo patrón que `start-jupyter.js`, carpeta `src/clients/node-http/jupyter`).

4. Crea los 6 notebooks en `src/clients/node-http/jupyter/` y `README.md` del cliente.

5. Actualiza `docs/TREE.md`, `ARCHITECTURE.md`, `STARTUP.md` y `AGENTS.md`.

6. `pnpm format` (scripts y server) y `pnpm lint`.

7. Con `pnpm server` y `pnpm node-http`, prueba CRUD con curl. Gender-count: una petición; no depurar Ollama.
