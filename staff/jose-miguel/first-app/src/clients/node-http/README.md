# Cliente node-http

API de usuarios con solo `node:http` en `http://127.0.0.1:3004`. Mismas cinco rutas que Express más `GET /users/gender-count`. Importa `src/logic/`. Requiere `pnpm server` en el puerto 3000.

## Arranque

Ver [`docs/STARTUP.md`](../../../docs/STARTUP.md).

1. `pnpm server`
2. Otra terminal: `pnpm node-http` → debe mostrar `http://127.0.0.1:3004`

## Jupyter

Con la base y este cliente en marcha:

```text
pnpm jupyter-node-http
```

Abre los cuadernos de `jupyter/`. Orden sugerido: create → list → find → update → delete → gender-count. El conteo necesita Ollama `llama3.2` si quieres clasificación real.

## Spec

- `docs/specs/node-http-users-client/` — Issue #1131
