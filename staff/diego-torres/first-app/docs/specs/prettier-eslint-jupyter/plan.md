# Plan — formato, lint y Jupyter en Linux y Windows

Issue: #641

No es una funcionalidad nueva. No toca `src/`. No hay firma nueva, SQL nuevo ni mensajes nuevos en «Errores».

Este plan se escribe después de la implementación, a petición de la revisión de la PR #642. Recoge lo que ya está en la rama y las comprobaciones hechas.

## Ficheros

Se crean:

- `eslint.config.js`
- `scripts/jupyter.js`
- `docs/specs/prettier-eslint-jupyter/spec.md`, `plan.md` y `tasks.md`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `AGENTS.md`

No hay `.prettierrc` ni `.prettierignore`. `src/` y `docs/CONSTITUCION.md` no cambian.

## Paquetes

En `devDependencies`, con la versión exacta:

- `prettier` `3.9.10`
- `eslint` `10.13.0`
- `@eslint/js` `10.0.1`

Son las mismas versiones que `ventura-rodriguez/first-app`. No hay paquete `globals`.

Dependencias hasta 3 capas, según `pnpm list --dev --depth 3`: 66 versiones de paquete bajo los tres de arriba (30 en la capa 1, 28 en la 2 y 8 en la 3). `prettier` y `@eslint/js` no tienen dependencias. `eslint-visitor-keys` sale con dos versiones, `3.4.3` y `5.0.1`; se comprueban las dos.

`eslint` y `@eslint/js` piden Node `^20.19.0 || ^22.13.0 || >=24`. `prettier` pide `>=14`. El Node local es `22.23.4`, dentro del rango.

`notebook==7.6.3` es un paquete de Python y su versión no cambia. Queda fuera de la comprobación con Socket, como dice `AGENTS.md`.

## Socket

`depscore` dio las cinco stats. No dijo si la versión está en una
campaña ni si tiene una alerta. La stat más baja del árbol es quality
68, en `shebang-command@2.0.0`. Ninguna stat está por debajo de 50.

Fuente: herramienta `depscore` del MCP de Socket
(`https://mcp.socket.dev/`), el 2026-10-30, con cada paquete en la
versión exacta de `pnpm-lock.yaml`. Las herramientas `alerts` y
`threat_feed` piden iniciar sesión y responden `Authentication required
for this tool`. La página pública de alertas de socket.dev responde
`403`.

- `@eslint-community/eslint-utils@4.10.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 84, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint-community/regexpp@4.12.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/config-array@0.23.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/config-helpers@0.7.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/core@1.2.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/js@10.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/object-schema@3.0.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@eslint/plugin-kit@0.7.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 88, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanfs/core@0.19.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanfs/node@0.16.8`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanfs/types@0.15.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 82, quality 70, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanwhocodes/module-importer@1.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 93, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `@humanwhocodes/retry@0.4.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@types/esrecurse@4.3.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 89, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@types/estree@1.0.10`. Campaña: no consta. Alerta: no consta. license 100, maintenance 87, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `@types/json-schema@7.0.15`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `acorn-jsx@5.3.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 82, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `acorn@8.19.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 89, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ajv@6.15.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `balanced-match@4.0.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 86, quality 85, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `brace-expansion@5.0.12`. Campaña: no consta. Alerta: no consta. license 100, maintenance 93, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `cacheable@2.5.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `cross-spawn@7.0.6`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 97, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `debug@4.4.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `deep-is@0.1.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 89, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `escape-string-regexp@4.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 71, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint-scope@9.1.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint-visitor-keys@3.4.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint-visitor-keys@5.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `eslint@10.13.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 95, quality 100, supplyChain 97, vulnerability 100. Ninguna stat por debajo de 50.
- `espree@11.2.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `esquery@1.7.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 82, quality 82, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `esrecurse@4.3.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `estraverse@5.3.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `esutils@2.0.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-deep-equal@3.1.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-json-stable-stringify@2.1.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `fast-levenshtein@2.0.6`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `file-entry-cache@11.1.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `find-up@5.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `flat-cache@6.1.23`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `flatted@3.4.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `glob-parent@6.0.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `hookified@1.15.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 90, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ignore@5.3.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 93, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `imurmurhash@0.1.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `is-extglob@2.1.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 97, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `is-glob@4.0.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `isexe@2.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 85, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `json-schema-traverse@0.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 94, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `json-stable-stringify-without-jsonify@1.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `levn@0.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `locate-path@6.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `minimatch@10.2.6`. Campaña: no consta. Alerta: no consta. license 100, maintenance 95, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ms@2.1.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 86, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `natural-compare@1.4.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `optionator@0.9.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `p-locate@5.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 97, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `path-exists@4.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `path-key@3.1.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 84, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `prelude-ls@1.2.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 76, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `prettier@3.9.10`. Campaña: no consta. Alerta: no consta. license 100, maintenance 97, quality 96, supplyChain 98, vulnerability 100. Ninguna stat por debajo de 50.
- `punycode@2.3.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `shebang-command@2.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 68, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `shebang-regex@3.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 69, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `type-check@0.4.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `uri-js@4.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `which@2.0.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 83, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `word-wrap@1.2.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.

## Scripts

En `package.json`, junto a `test`:

```json
"jupyter": "node scripts/jupyter.js",
"format": "prettier --write \"src/db/**/*.js\" \"src/queries/**/*.js\" \"src/logic/**/*.js\"",
"lint": "eslint ."
```

`test` sigue igual.

El `jupyter` anterior usaba sintaxis de `cmd` (`if not exist`, `\\Scripts\\`) y solo funcionaba en Windows.

## ESLint

`eslint.config.js` aplica las reglas recomendadas a los `.js` e ignora `.venv` y `node_modules`:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    ignores: [".venv/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
]);
```

## Jupyter

`scripts/jupyter.js` hace, en orden:

1. Si no existe el Python de `.venv`, busca Python 3. En Windows prueba `python`, `py -3` y `python3`. En Linux, `python3` y `python`. Si no hay, sale con `Python 3 is required to start Jupyter.` Si hay, crea `.venv`.
2. Si en `.venv` no está `notebook` `7.6.3`, lo instala con `pip`.
3. Abre `src/clients/jupyter` con `python -m notebook`, con `PYTHONUTF8=1`.

El Python de `.venv` está en `Scripts/python.exe` en Windows y en `bin/python` en Linux. Si un paso falla, el script sale con el código de ese paso.

## AGENTS.md

En «Proyecto», la frase de dependencias dice también que `prettier`, `eslint` y `@eslint/js` son de desarrollo.

En «Comandos», la línea de Jupyter dice que funciona en Linux y Windows con `scripts/jupyter.js`. La frase «No hay script de lint ni de formato» se sustituye por la de `pnpm format` y `pnpm lint`.

## Comprobaciones

Hechas el 2026-10-30 en Windows 11, Node `22.23.4`, pnpm `10.20.0`, Python `3.14.10`:

- `pnpm install --frozen-lockfile`: «Already up to date». El lockfile coincide con `package.json`.
- `pnpm lint`: termina con 0 y sin errores.
- `prettier --check --end-of-line auto` sobre los globs de `format`: solo marca `src/logic/index.js`. Prettier junta en una línea el primer `export { … } from "./shared.js"`. Ese fichero ya existía, así que `pnpm format` lo cambiaría. Esta PR no lo formatea.
- Sin `--end-of-line auto`, Prettier marca todos los ficheros. Es por `core.autocrlf=true`: la copia de Windows tiene CRLF y el repo guarda LF. `pnpm format` los dejaría en LF y git no vería cambio.
- `pnpm jupyter` sin `.venv`: crea `.venv`, instala `notebook` `7.6.3` y arranca Jupyter Server `2.21.1`. La API sirve los 9 notebooks de `src/clients/jupyter`. Al cerrar el servidor, el script termina con 0.
- `pnpm jupyter` por segunda vez: no hay líneas de `pip`, arranca y termina con 0 al cerrar.
- En los dos arranques sale `Fail to get yarn configuration` y `Dynamic require of "util" is not supported`, desde `.venv/Lib/site-packages/jupyter_builder/yarn.js`. Jupyter sigue arrancando. Pasa porque `first-app/package.json` tiene `"type": "module"` y Node carga ese fichero como ESM. El script anterior también se lanzaba desde `first-app`.

## Pendiente

- **Linux**: `pnpm jupyter` no se ha probado en una máquina Linux real. Falta comprobar los pasos 3 y 4 de «Cómo probarlo» de la issue: primera ejecución que crea `.venv` en `.venv/bin/python` y segunda que lo reutiliza.

## Decisión

La campaña y la alerta no se leen. Hay algo roto y se solucionará
aparte. No bloquea este plan.

Se aceptan Prettier 3.9.10, ESLint 10.13.0 y `@eslint/js` 10.0.1 con
el resumen de stats.
