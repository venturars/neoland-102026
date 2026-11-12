# Plan — formato y lint

Issue: #465.

No es funcionalidad de `logic/`. Sin firma nueva ni SQL nuevo.

`format` y Prettier `3.9.10` ya están. Falta `lint`, ESLint y el cierre
de tarea con los dos comandos. Los `.js` de `db/`, `queries/` y `logic/`
ya cumplen el formato estándar. El script no formatea `.` ni `clients/`.
El código usa globals de Node (`process`, `URL`); ESLint los declara.

## Ficheros

Se crea `eslint.config.js`. Se tocan `package.json`, `pnpm-lock.yaml`,
`AGENTS.md`, `docs/TREE.md` y `docs/ARCHITECTURE.md`. No hay
`.prettierrc`. No se tocan `logic/`, `queries/`, `db/` ni `clients/`.

## Paquetes y Socket

`prettier` `3.9.10` ya está. Se añaden `eslint` `10.13.0`,
`@eslint/js` `10.0.1` y `globals` `17.13.0` (exactas). `@eslint/js` y
`globals` sin deps; `eslint` hasta 3 capas; `jiti` peer opcional, no se
instala. Árbol/stats de eslint como first-app: ninguna stat bajo 50.
`globals` `17.13.0`: campaña y alerta no constan; sin deps. Se aceptan.

## Scripts y ESLint

`format` ya existe. `lint` es `eslint .`. Reglas recomendadas, globals
de Node, ignora `.venv/**` y `node_modules/**`:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  { ignores: [".venv/**", "node_modules/**"] },
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.node },
    plugins: { js },
    extends: ["js/recommended"],
  },
]);
```

## Docs

`TREE.md` añade `eslint.config.js` en la raíz. `ARCHITECTURE.md` dice
que aplica las reglas recomendadas, declara globals de Node e ignora
`.venv` y `node_modules`. `AGENTS.md`: `pnpm format` y `pnpm lint`; al
terminar se lanzan los dos, además del cliente `.txt`.

Sin contrato nuevo de `logic/` ni mensajes de «Errores».
