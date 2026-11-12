# Plan · Formato y lint

> Estado: **Aprobado** (2026-10-27) · Spec: [spec.md](spec.md) v1.0 · Issue: #507

## 1. Visión

No es una funcionalidad nueva. Se añaden Prettier y ESLint como `devDependencies`, scripts `format` y `lint`, y se actualizan AGENTS, TREE y ARCHITECTURE. No se reescribe el JavaScript de negocio.

Prettier sobre `.` entra en `.venv` y falla: el script `format` solo toca `db/**/*.js`, `queries/**/*.js` y `logic/**/*.js`. En `clients/` no hay `.js`.

## 2. Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `eslint.config.js` (reglas recomendadas; ignora `.venv` y `node_modules`) |
| Tocar | `package.json` (`format`, `lint`, `devDependencies`) |
| Tocar | `pnpm-lock.yaml` (tras `pnpm install`) |
| Tocar | `AGENTS.md` (Comandos + Al terminar) |
| Tocar | `docs/TREE.md` |
| Tocar | `docs/ARCHITECTURE.md` |

No se crea `.prettierrc`. No se toca el `AGENTS.md` de la raíz ni el código de `logic/` / `queries/` / `db/` (salvo el formato que aplique `pnpm format`).

## 3. Paquetes (versiones exactas)

- `prettier` `3.9.10` (sin dependencias)
- `eslint` `10.13.0` (árbol hasta 3 capas)
- `@eslint/js` `10.0.1` (sin dependencias)

`jiti` es peer opcional de ESLint: no se instala.

## 4. Scripts y config

```json
"format": "prettier --write \"db/**/*.js\" \"queries/**/*.js\" \"logic/**/*.js\"",
"lint": "eslint ."
```

`eslint.config.js`: `defineConfig` con `ignores` `.venv/**` y `node_modules/**`, y `js/recommended` sobre `**/*.js`.

## 5. AGENTS.md

- Comandos: `pnpm format` lanza Prettier (estándar, sin config propia); `pnpm lint` lanza ESLint.
- Al terminar: lanzar `pnpm format` y `pnpm lint` antes de dar la tarea por terminada.

## 6. TREE / ARCHITECTURE

Añadir `eslint.config.js` en el árbol y una línea en arquitectura: aplica las reglas recomendadas de ESLint al JavaScript e ignora `.venv` y `node_modules`.

## Validación Socket

Árbol resuelto con `pnpm view` hasta 3 capas: **69** paquetes.

`depscore` dio las cinco stats. No dijo si la versión está en una campaña ni si tiene una alerta. La stat más baja del árbol es quality **68**, en `shebang-command@2.0.0`. Ninguna stat está por debajo de 50.

| Capa | Paquete@versión | Campaña | Alertas | Stats &lt; 50 |
| --- | --- | --- | --- | --- |
| 0 | prettier@3.9.10 | no consta | no consta | ninguna |
| 0 | eslint@10.13.0 | no consta | no consta | ninguna |
| 0 | @eslint/js@10.0.1 | no consta | no consta | ninguna |
| 1–3 | (66 paquetes del árbol) | no consta | no consta | ninguna |

Alertas comentadas en conversación: ninguna (campaña/alerta no se leen).
Decisión humana sobre alertas: no aplica; no hay alertas leídas.

## Decisión

La campaña y la alerta no se leen. Hay algo roto y se solucionará aparte. No bloquea este plan.

Se aceptan Prettier 3.9.10, ESLint 10.13.0 y `@eslint/js` 10.0.1 con el resumen de stats.

## 7. Comprobación

| CA | Cómo |
| --- | --- |
| CA-01 | Existe script `format` y formatea esos globs |
| CA-02 | Existe script `lint` y lanza ESLint |
| CA-03 | AGENTS menciona ambos al terminar |
| CA-04 | `pnpm format` y `pnpm lint` OK |
| CA-05 | Validación Socket + Decisión arriba |
