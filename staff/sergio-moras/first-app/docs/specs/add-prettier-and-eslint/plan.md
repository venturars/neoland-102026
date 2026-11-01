# Plan: Prettier y ESLint

Implementa [spec.md](spec.md). Cambia [CONSTITUTIONS.md](../../CONSTITUTIONS.md) con el permiso explícito del usuario, que lo ha pedido en la issue.

## Paquetes
Dependencias de desarrollo, con versión fija e instaladas con pnpm:

| Paquete | Versión | Motivo |
|---|---|---|
| `prettier` | `3.9.10` | Última versión. La misma que el profe |
| `eslint` | `10.14.0` | Última versión. El profe tiene `10.13.0` |
| `@eslint/js` | `10.0.1` | Reglas recomendadas. Última versión |

## Validación con Socket
Hecha el 2026-10-31 con el MCP `socket-mcp`, organización `sergiomoras`, plan free. Dependencias leídas con `npm view`, hasta 3 capas.

| Capa | Paquetes |
|---|---|
| 0 | 3: `prettier`, `eslint`, `@eslint/js` |
| 1 | 30, todas de `eslint`. `prettier` y `@eslint/js` no tienen dependencias |
| 2 | 28 |
| 3 | 8 |

**Puntuaciones** (`depscore`, los 69 paquetes): ninguna baja de 50.
- `prettier@3.9.10`: license 100, maintenance 97, quality 96, supplyChain 98, vulnerability 100.
- `eslint@10.14.0`: license 100, maintenance 96, quality 100, supplyChain 97, vulnerability 100.
- `@eslint/js@10.0.1`: license 100, maintenance 86, quality 100, supplyChain 100, vulnerability 100.
- La puntuación más baja de todo el árbol es `quality 68` de `shebang-command@2.0.0` (capa 2). Le siguen `shebang-regex@3.0.0` (quality 69), `@humanfs/types@0.15.0` (quality 70) y `escape-string-regexp@4.0.0` (quality 71). Ninguna de vulnerability, supplyChain ni license baja de 97.

**Alertas** (`alerts`, `npm`, abiertas): la lista de la organización está vacía. Es la lista de la organización: no dice que estas versiones no tengan alertas.

**Campañas** (`threat_feed`): `403 threat_feed_not_entitled`. La cuenta tiene el plan free, que no incluye esa fuente. No se ha podido comprobar si alguna versión está en una campaña.

Quien acepta el plan decide con esto escrito.

## Prueba previa
En una copia del código, fuera del repositorio:
- ESLint con las reglas recomendadas da 6 errores:
  - `db/connection.js`: `'URL' is not defined`.
  - `logic/classifyGender.js`: `'fetch' is not defined`, `'AbortSignal' is not defined`, dos `preserve-caught-error` (un `throw new Error` dentro de un `catch` sin `cause`) y un `'error' is defined but never used`.
- Prettier cambiaría los 8 `.js` de `logic/`, `queries/` y `db/`.
- Con los arreglos de abajo, ESLint da 0 errores, también después de Prettier.

## Arreglos de los errores de ESLint
| Error | Arreglo | Comportamiento |
|---|---|---|
| `URL`, `fetch` y `AbortSignal` no definidos | Se declaran en `eslint.config.js` como globales de solo lectura. Son de Node. Así lo hacen maria-osipuk, meghan-martin y sergio-cortes | No cambia |
| `preserve-caught-error` (2) | `throw new Error(<mismo mensaje>, { cause: error })` | Mismo mensaje. El error original queda guardado en `cause` |
| `'error' is defined but never used` | `catch {` sin variable | No cambia |

## Archivos
```
package.json            devDependencies y los scripts format y lint
pnpm-lock.yaml          lo actualiza pnpm
eslint.config.js        NUEVO
logic/*.js, queries/users.js, db/connection.js   formato de Prettier
logic/classifyGender.js  además, los 3 arreglos
docs/CONSTITUTIONS.md   principio 7, versión y fecha
AGENTS.md               «Stack», «Comandos» y «Cómo verificar un cambio»
```

## `package.json`
```json
"scripts": {
  "format": "prettier --write \"logic/**/*.js\" \"queries/**/*.js\" \"db/**/*.js\" eslint.config.js",
  "lint": "eslint ."
}
```

## `eslint.config.js`
```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        URL: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
      },
    },
  },
]);
```
ESLint ignora `node_modules/` por defecto.

## `docs/CONSTITUTIONS.md`
En el principio 7 se añade:

> - Al terminar una tarea se lanzan `pnpm format` y `pnpm lint`. `pnpm lint` no da errores.

La versión pasa de 1.4.0 a 1.5.0.

## `AGENTS.md`
- «Stack»: `sin dependencias externas` pasa a `dependencias en package.json, con versión fija e instaladas con pnpm`.
- «Comandos»: se añaden `pnpm format` (Prettier sobre los `.js` de la app) y `pnpm lint` (ESLint).
- «Cómo verificar un cambio»: se añade el paso `Lanzar pnpm format y pnpm lint. pnpm lint no da errores.`

## Cómo se prueba
- `pnpm lint` antes de los arreglos da los 6 errores. Después, 0.
- `pnpm format` cambia los 8 `.js`. Una segunda vez no cambia nada.
- Se pegan `listUsers.txt`, `findUserByEmail.txt` y `classifyGender.txt` y se crea, actualiza y borra un usuario temporal con los demás `.txt`. La salida es la misma que antes. `classifyGender` también con Ollama apagado: el mismo `Error: Users could not be classified: ...`.
