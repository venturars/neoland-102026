# Plan · Cliente HTTP Nest

Issue: #1016.

Puerto **3003**. Carpeta [`src/clients/nest/`](../../../src/clients/nest/). Compilación **Babel** (`src/` → `dist/`) para decoradores; arranque con [`scripts/run-nest.js`](../../../scripts/run-nest.js) y script **`pnpm nest`**. Sin TypeScript.

## Ficheros

| Acción | Fichero |
| --- | --- |
| Crear | `docs/specs/nest-http-client/spec.md`, `plan.md`, `tasks.md` |
| Crear | `src/clients/nest/*.js`, `README.md`, `babel.config.json`, `scripts/run-nest.js` |
| Tocar | `package.json`, `pnpm-lock.yaml`, `.gitignore` (`dist/`) |
| Tocar | `eslint.config.js` (ignorar `dist/`, `src/clients/nest/**`) |
| Tocar | glob `format` → `src/clients/nest/**/*.js` |
| Tocar | `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/STARTUP.md`, `AGENTS.md` |

No se toca: `src/logic/**`, `src/queries/**`, `src/db/**`, `src/clients/http/**`, otros clientes.

## Paquetes (Socket, win32-x64)

| paquete@versión | license | maint. | quality | supply | vuln |
| --- | --- | --- | --- | --- | --- |
| @nestjs/common@12.3.3 | 100 | 96 | 100 | 99 | 100 |
| @nestjs/core@12.3.3 | 100 | 95 | 100 | 99 | 100 |
| @nestjs/platform-express@12.3.3 | 100 | 96 | 100 | 99 | 100 |
| reflect-metadata@0.2.2 | 80 | 80 | 99 | 100 | 100 |
| rxjs@7.8.2 | 100 | 88 | 100 | 99 | 100 |

Dev: `@babel/cli@8.1.0`, `@babel/core@8.1.0`, `@babel/preset-env@8.0.7`, `@babel/plugin-proposal-decorators@8.0.2`.

Instalación: versiones exactas con pnpm en first-app.

## Verificación

Checklist issue; `pnpm http` y `pnpm chrome` sin regresiones; `pnpm format`, `pnpm lint`.
