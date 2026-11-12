# Plan — formato y lint

Issue: #410.

No es una funcionalidad nueva. No reemplaza ningún fichero de `logic/`.
No hay firma nueva ni SQL nuevo.

El código actual no tiene `format` ni `lint`. Los `.js` de `db/`,
`queries/` y `logic/` ya cumplen el formato estándar de Prettier.
ESLint, con las reglas recomendadas, no marca ese JavaScript.
Comprobado con Prettier 3.9.10 y ESLint 10.13.0.

Prettier sobre `.` entra en `.venv` y falla. El formato no incluye
`.venv`. En `clients/` no hay `.js`. Un glob hacia ahí hace fallar
Prettier.

## Ficheros

Se crea:

- `eslint.config.js`

Se tocan:

- `package.json`
- `pnpm-lock.yaml`
- `AGENTS.md` de first-app
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

No se toca el `AGENTS.md` de la raíz.

No se crean `.prettierrc` ni `docs/STYLE.md`. No se tocan `logic/`,
`queries/`, `db/` ni `clients/`.

## Paquetes

En `devDependencies`, con la versión exacta:

- `prettier` `3.9.10`
- `eslint` `10.13.0`
- `@eslint/js` `10.0.1`

`prettier` no tiene dependencias. `@eslint/js` no tiene dependencias.
`eslint` arrastra dependencias hasta 3 capas. `jiti` es un peer
opcional y no se instala: no entra.

El árbol es el que resuelve npm para esas versiones. `pnpm` 10.33.0
resuelve las mismas versiones en esas 3 capas.

## Socket

`depscore` dio las cinco stats. No dijo si la versión está en una
campaña ni si tiene una alerta. La stat más baja del árbol es quality
68, en `shebang-command@2.0.0`. Ninguna stat está por debajo de 50.

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
- `@types/estree@1.0.9`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 74, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
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
- `hookified@1.15.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 92, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `ignore@5.3.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 93, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `imurmurhash@0.1.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `is-extglob@2.1.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 97, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `is-glob@4.0.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `isexe@2.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 83, quality 85, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `json-schema-traverse@0.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 94, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `json-stable-stringify-without-jsonify@1.0.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `levn@0.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `locate-path@6.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `minimatch@10.2.6`. Campaña: no consta. Alerta: no consta. license 100, maintenance 87, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `ms@2.1.3`. Campaña: no consta. Alerta: no consta. license 100, maintenance 84, quality 86, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `natural-compare@1.4.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 99, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `optionator@0.9.4`. Campaña: no consta. Alerta: no consta. license 100, maintenance 79, quality 100, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `p-locate@5.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 80, quality 97, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `path-exists@4.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 80, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `path-key@3.1.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 84, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `prelude-ls@1.2.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 75, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `prettier@3.9.10`. Campaña: no consta. Alerta: no consta. license 100, maintenance 97, quality 96, supplyChain 98, vulnerability 100. Ninguna stat por debajo de 50.
- `punycode@2.3.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `shebang-command@2.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 68, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `shebang-regex@3.0.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 69, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `type-check@0.4.0`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `uri-js@4.4.1`. Campaña: no consta. Alerta: no consta. license 100, maintenance 75, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.
- `which@2.0.2`. Campaña: no consta. Alerta: no consta. license 100, maintenance 85, quality 83, supplyChain 99, vulnerability 100. Ninguna stat por debajo de 50.
- `word-wrap@1.2.5`. Campaña: no consta. Alerta: no consta. license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. Ninguna stat por debajo de 50.

## Scripts

En `package.json`:

```json
"format": "prettier --write \"db/**/*.js\" \"queries/**/*.js\" \"logic/**/*.js\"",
"lint": "eslint ."
```

## ESLint

`eslint.config.js` queda así. Las reglas son las recomendadas. Ignora
`.venv` y `node_modules`.

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

## Árbol

`docs/TREE.md` añade `eslint.config.js` en la raíz de `first-app/`:

```
first-app/
  eslint.config.js
  db/
```

El resto del árbol sigue igual.

## Arquitectura

Se añade este punto:

```
- `eslint.config.js` aplica las reglas recomendadas de ESLint al JavaScript e ignora `.venv` y `node_modules`.
```

## AGENTS.md

En «Comandos», la línea de lint queda así:

```
- Lint/formato: `pnpm format` lanza Prettier. El formato es el estándar, sin configuración propia. `pnpm lint` lanza ESLint.
```

En «Al terminar una tarea» se conservan los dos puntos de ahora y se
añaden estos dos:

```
- Lanza el formato antes de dar la tarea por terminada. El comando es `pnpm format`.
- Lanza el lint antes de dar la tarea por terminada. El comando es `pnpm lint`.
```

## Contrato

No hay función de `logic/`, firma pública ni SQL.

No hay un mensaje nuevo de «Errores».

## Decisión

La campaña y la alerta no se leen. Hay algo roto y se solucionará
aparte. No bloquea este plan.

Se aceptan Prettier 3.9.10, ESLint 10.13.0 y `@eslint/js` 10.0.1 con
el resumen de stats.
