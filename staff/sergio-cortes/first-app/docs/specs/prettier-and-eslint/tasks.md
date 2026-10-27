# Tareas — Prettier y ESLint

Issue: #462.

Los pasos que tocan `package.json`, `pnpm-lock.yaml` o instalan paquetes solo se
ejecutan con `spec.md` y `plan.md` aprobados (validación Socket ya en el plan).

1. Abre [package.json](../../../package.json). Añade en `devDependencies`:
   `prettier` `3.9.10`, `eslint` `10.13.0`, `@eslint/js` `10.0.1`.

2. En `scripts`, añade `format` y `lint` tal como en el plan. No cambies `test`.

3. Crea [eslint.config.js](../../../eslint.config.js) en la raíz de `first-app`.
   Configuración plana ESLint 10, reglas recomendadas de `@eslint/js`, solo
   `**/*.js`. Ignora `.venv/`, `node_modules/` y `clients/jupyter/`.

4. Desde `first-app`, ejecuta `pnpm install`.

5. Abre [docs/TREE.md](../../TREE.md). En la raíz de `first-app`, junto a
   `package.json`, lista `eslint.config.js`.

6. Abre [docs/ARCHITECTURE.md](../../ARCHITECTURE.md). Añade una línea: `eslint.config.js`
   aplica las reglas recomendadas de ESLint al JavaScript e ignora `.venv`,
   `node_modules` y los cuadernos Jupyter.

7. Abre [AGENTS.MD](../../../AGENTS.MD). En **## Comandos**, sustituye la línea de
   lint/formato por formato (`pnpm run format`) y lint (`pnpm run lint`) como en
   el plan. En **## Al terminar una tarea**, después del cliente terminal, añade
   ejecutar `pnpm run format` sobre el código tocado y `pnpm run lint` corrigiendo
   errores antes de dar la tarea por terminada.

8. Desde `first-app`, ejecuta `pnpm run format` y `pnpm run lint`. Corrige lo que
   falle hasta que lint termine sin errores.
