# Plan — mover las capas a src

Cumple `docs/specs/mover-capas-a-src/spec.md`.

## Tocar

- Mover `clients/`, `db/`, `queries/` y `logic/` a `src/`. Los imports de dentro de `src/logic/` y `src/queries/` se quedan: la forma relativa no cambia.
- `src/clients/terminal/*.txt`: las llamadas pasan a `./src/...`, porque se pegan con el directorio actual en `first-app`.
- `package.json`: `format` escribe `src/db`, `src/queries` y `src/logic`. `jupyter` abre `src/clients/jupyter`.
- `docs/TREE.md`, `docs/ARCHITECTURE.md`, `docs/CONSTITUTIONS.md`, `docs/DATABASE.md`, `docs/STYLE.md`, `docs/GIT-WORKFLOW.md` y `AGENTS.md`: las rutas de esas capas llevan `src/`.

## No tocar

- El cuerpo de las acciones. No hay firma nueva ni SQL nuevo.
- Los notebooks. Siguen buscando la carpeta `logic/`, que ahora está dentro de `src/`.
- No hay paquete nuevo. No hace falta Socket.
