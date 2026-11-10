# Tasks: Cliente API REST

Implementan [plan.md](plan.md), que cumple [spec.md](spec.md). Se ejecutan **en orden** y todas seguidas.

## T1. El paquete
- [x] `pnpm add express@5.3.0 --save-exact`.
- [x] Comprobar que `package.json` tiene `"express": "5.3.0"` y que `pnpm-lock.yaml` cambió.

## T2. La API
- [x] Crear `src/clients/rest/server.js` con las rutas, `getStatus` y el manejador de errores del plan.
- [x] Añadir a `package.json` el script `api` y `src/clients/rest/**/*.js` al script `format`.

## T3. Comprobación
- [x] Guardar la salida de `list-users.txt` antes de empezar.
- [x] Con `curl` y el usuario temporal `tmp-877-1`, cada ruta de la spec con su código.
- [x] Los errores de la spec, cada uno con su mensaje y su código.
- [x] `GET /users/genders` con Ollama en marcha.
- [x] Con la base parada, `GET /users` da 503.
- [x] No queda ningún `tmp-877-*` y `list-users.txt` da lo mismo que al empezar.
- [x] `pnpm format` y `pnpm lint` sin errores.

## T4. Guías
- [x] `ARCHITECTURE.md`: el fichero nuevo, la sección del cliente API REST con sus rutas y sus códigos, y en «Una operación» la ruta de la API.
- [x] `TREE.md`: `src/clients/rest/`.
- [x] `AGENTS.md`: el comando `pnpm api`, con `pnpm db` antes.
