# Plan — Prettier y ESLint

Issue: #462.

No es una funcionalidad nueva. No hay fichero nuevo en `logic/`. No hay firma
ni SQL nuevo.

`docs/STYLE.md` ya dice que el formato es Prettier por defecto, sin fichero de
configuración. `AGENTS.md` dice que no hay script de formato. Este desarrollo
añade los scripts y la configuración mínima de ESLint, y actualiza `AGENTS.md`
para que no contradiga la spec.

## Ficheros

Se crea:

- `eslint.config.js`

Se tocan:

- `package.json` y `pnpm-lock.yaml`
- `AGENTS.md`
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

No se tocan `logic/`, `queries/`, `db/`, `clients/` ni `docs/STYLE.md`.

## Paquetes (devDependencies)

- `prettier` `3.9.10`
- `eslint` `10.13.0`
- `@eslint/js` `10.0.1`

`prettier` y `@eslint/js` no declaran dependencias en npm. `eslint` arrastra
dependencias hasta 3 capas en el lockfile.

## Scripts en `package.json`

```json
"format": "prettier --write \"db/**/*.js\" \"queries/**/*.js\" \"logic/**/*.js\"",
"lint": "eslint ."
```

El script `test` no cambia.

## `eslint.config.js`

Configuración plana (ESLint 10). Reglas recomendadas de `@eslint/js`. Solo
aplica a `**/*.js`. Ignora `.venv/`, `node_modules/` y `clients/jupyter/`.

## `docs/TREE.md`

En la raíz de `first-app/`, junto a `package.json`:

```
  eslint.config.js
```

## `docs/ARCHITECTURE.md`

Una línea que diga que `eslint.config.js` aplica las reglas recomendadas de
ESLint al JavaScript e ignora `.venv`, `node_modules` y los cuadernos Jupyter.

## `AGENTS.md`

En **## Comandos**, sustituir la línea de lint/formato por:

- Formato: `pnpm run format` (Prettier por defecto, sin `.prettierrc`).
- Lint: `pnpm run lint` (ESLint con `eslint.config.js`).

En **## Al terminar una tarea**, después de los pasos del cliente terminal,
añadir:

- Ejecutar `pnpm run format` sobre el código tocado.
- Ejecutar `pnpm run lint` y corregir los errores antes de dar la tarea por
  terminada.

## Parecido

No hay fichero nuevo en `logic/`.

## Firma

No hay firma nueva.

## SQL

No hay SQL.

## Errores

No aplica.

## Validación Socket

- **MCP:** namespace `user-socket-mcp` en Cursor. Servidor local
  `@socketsecurity/mcp` con `SOCKET_API_TOKEN` (config global del IDE; el token
  no va en el repositorio). El remoto `https://mcp.socket.dev/` no completaba
  OAuth; el local sí.
- **`organizations`:** org **`sergio-cortes`**, slug `sergio-cortes`, plan
  **free**.
- **`depscore`:** revisados los 76 `depname@version` del árbol (capas 0–3) con
  `pnpm view` + MCP. La tabla incluye **license**, **maintenance**, **quality**,
  **supplyChain** y **vulnerability** (0–100). Ninguna stat **menor que 50**.
  `brace-expansion@5.0.5` y `brace-expansion@5.0.2` tienen **vulnerability 50**
  (umbral, no &lt; 50).
- **`alerts`:** consultado con `org_slug` `sergio-cortes` para los directos
  `prettier`, `eslint` y `@eslint/js` (npm, `status` open). **Sin alertas
  abiertas** en la org para esos artefactos. El resto del árbol no se consultó
  paquete a paquete; columna «alertas» = **no** salvo indicación contraria.
- **`threat_feed` (campaña):** **no disponible** en plan **free**. La API responde
  `403` (`threat_feed_not_entitled`: *Threat feed is not enabled for this
  organization*). En este desarrollo **no** se usa campaña vía threat feed; la
  columna «campaña» es **n/d (plan free)**.

| capa | paquete@versión | campaña | alertas | license | maintenance | quality | supplyChain | vulnerability | stats < 50 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | @eslint/js@10.0.1 | n/d (plan free) | no | 100 | 86 | 100 | 100 | 100 | ninguna (<50) |
| 0 | eslint@10.13.0 | n/d (plan free) | no | 100 | 95 | 100 | 97 | 100 | ninguna (<50) |
| 0 | prettier@3.9.10 | n/d (plan free) | no | 100 | 97 | 96 | 98 | 100 | ninguna (<50) |
| 1 | @eslint-community/eslint-utils@4.8.0 | n/d (plan free) | no | 100 | 84 | 84 | 99 | 100 | ninguna (<50) |
| 1 | @eslint-community/regexpp@4.12.2 | n/d (plan free) | no | 100 | 81 | 100 | 99 | 100 | ninguna (<50) |
| 1 | @eslint/config-array@0.23.5 | n/d (plan free) | no | 100 | 85 | 100 | 100 | 100 | ninguna (<50) |
| 1 | @eslint/config-helpers@0.7.0 | n/d (plan free) | no | 100 | 86 | 100 | 100 | 100 | ninguna (<50) |
| 1 | @eslint/core@1.2.1 | n/d (plan free) | no | 100 | 85 | 80 | 100 | 100 | ninguna (<50) |
| 1 | @eslint/plugin-kit@0.7.3 | n/d (plan free) | no | 100 | 88 | 100 | 100 | 100 | ninguna (<50) |
| 1 | @humanfs/node@0.16.6 | n/d (plan free) | no | 100 | 83 | 100 | 100 | 99 | ninguna (<50) |
| 1 | @humanwhocodes/module-importer@1.0.1 | n/d (plan free) | no | 100 | 79 | 93 | 99 | 100 | ninguna (<50) |
| 1 | @humanwhocodes/retry@0.4.2 | n/d (plan free) | no | 100 | 79 | 99 | 100 | 100 | ninguna (<50) |
| 1 | @types/estree@1.0.6 | n/d (plan free) | no | 100 | 80 | 74 | 100 | 100 | ninguna (<50) |
| 1 | ajv@6.14.0 | n/d (plan free) | no | 100 | 84 | 100 | 99 | 100 | ninguna (<50) |
| 1 | cross-spawn@7.0.6 | n/d (plan free) | no | 100 | 80 | 97 | 99 | 100 | ninguna (<50) |
| 1 | debug@4.3.2 | n/d (plan free) | no | 100 | 81 | 100 | 99 | 100 | ninguna (<50) |
| 1 | escape-string-regexp@4.0.0 | n/d (plan free) | no | 100 | 75 | 71 | 100 | 100 | ninguna (<50) |
| 1 | eslint-scope@9.1.2 | n/d (plan free) | no | 100 | 84 | 100 | 100 | 100 | ninguna (<50) |
| 1 | eslint-visitor-keys@5.0.1 | n/d (plan free) | no | 100 | 83 | 100 | 100 | 100 | ninguna (<50) |
| 1 | espree@11.2.0 | n/d (plan free) | no | 100 | 84 | 100 | 100 | 100 | ninguna (<50) |
| 1 | esquery@1.7.0 | n/d (plan free) | no | 100 | 82 | 82 | 100 | 100 | ninguna (<50) |
| 1 | esutils@2.0.2 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 1 | fast-deep-equal@3.1.3 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna (<50) |
| 1 | file-entry-cache@11.1.5 | n/d (plan free) | no | 100 | 83 | 100 | 100 | 100 | ninguna (<50) |
| 1 | find-up@5.0.0 | n/d (plan free) | no | 100 | 79 | 99 | 100 | 100 | ninguna (<50) |
| 1 | glob-parent@6.0.2 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna (<50) |
| 1 | ignore@5.2.0 | n/d (plan free) | no | 100 | 93 | 100 | 99 | 100 | ninguna (<50) |
| 1 | imurmurhash@0.1.4 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna (<50) |
| 1 | is-glob@4.0.0 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna (<50) |
| 1 | json-stable-stringify-without-jsonify@1.0.1 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 1 | minimatch@10.2.5 | n/d (plan free) | no | 100 | 87 | 100 | 99 | 100 | ninguna (<50) |
| 1 | natural-compare@1.4.0 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna (<50) |
| 1 | optionator@0.9.3 | n/d (plan free) | no | 100 | 79 | 100 | 99 | 100 | ninguna (<50) |
| 2 | @aashutoshrathi/word-wrap@1.2.6 | n/d (plan free) | no | 100 | 79 | 100 | 100 | 100 | ninguna (<50) |
| 2 | @eslint/object-schema@3.0.5 | n/d (plan free) | no | 100 | 85 | 100 | 100 | 100 | ninguna (<50) |
| 2 | @humanfs/core@0.19.1 | n/d (plan free) | no | 100 | 83 | 100 | 100 | 100 | ninguna (<50) |
| 2 | @humanwhocodes/retry@0.3.0 | n/d (plan free) | no | 100 | 79 | 99 | 100 | 100 | ninguna (<50) |
| 2 | @types/esrecurse@4.3.1 | n/d (plan free) | no | 100 | 79 | 89 | 100 | 100 | ninguna (<50) |
| 2 | @types/estree@1.0.8 | n/d (plan free) | no | 100 | 80 | 74 | 100 | 100 | ninguna (<50) |
| 2 | @types/json-schema@7.0.15 | n/d (plan free) | no | 100 | 79 | 74 | 100 | 100 | ninguna (<50) |
| 2 | acorn@8.16.0 | n/d (plan free) | no | 100 | 89 | 100 | 100 | 100 | ninguna (<50) |
| 2 | acorn-jsx@5.3.2 | n/d (plan free) | no | 100 | 75 | 82 | 100 | 100 | ninguna (<50) |
| 2 | brace-expansion@5.0.5 | n/d (plan free) | no | 100 | 93 | 98 | 100 | 50 | vulnerability 50 (resto ≥50) |
| 2 | debug@4.3.1 | n/d (plan free) | no | 100 | 81 | 100 | 99 | 100 | ninguna (<50) |
| 2 | deep-is@0.1.3 | n/d (plan free) | no | 100 | 75 | 89 | 100 | 100 | ninguna (<50) |
| 2 | eslint-visitor-keys@3.4.3 | n/d (plan free) | no | 100 | 83 | 100 | 100 | 100 | ninguna (<50) |
| 2 | esrecurse@4.3.0 | n/d (plan free) | no | 100 | 75 | 100 | 99 | 100 | ninguna (<50) |
| 2 | estraverse@5.1.0 | n/d (plan free) | no | 100 | 83 | 100 | 100 | 100 | ninguna (<50) |
| 2 | estraverse@5.2.0 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 2 | fast-deep-equal@3.1.1 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna (<50) |
| 2 | fast-json-stable-stringify@2.0.0 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 2 | fast-levenshtein@2.0.6 | n/d (plan free) | no | 100 | 75 | 99 | 100 | 100 | ninguna (<50) |
| 2 | flat-cache@6.1.23 | n/d (plan free) | no | 100 | 83 | 100 | 99 | 100 | ninguna (<50) |
| 2 | is-extglob@2.1.1 | n/d (plan free) | no | 100 | 75 | 97 | 100 | 100 | ninguna (<50) |
| 2 | is-glob@4.0.3 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 2 | json-schema-traverse@0.4.1 | n/d (plan free) | no | 100 | 75 | 94 | 100 | 100 | ninguna (<50) |
| 2 | levn@0.4.1 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 2 | locate-path@6.0.0 | n/d (plan free) | no | 100 | 79 | 99 | 100 | 100 | ninguna (<50) |
| 2 | minimatch@10.2.4 | n/d (plan free) | no | 100 | 87 | 100 | 99 | 100 | ninguna (<50) |
| 2 | ms@2.1.2 | n/d (plan free) | no | 100 | 84 | 86 | 100 | 100 | ninguna (<50) |
| 2 | path-exists@4.0.0 | n/d (plan free) | no | 100 | 75 | 80 | 100 | 100 | ninguna (<50) |
| 2 | path-key@3.1.0 | n/d (plan free) | no | 100 | 75 | 81 | 100 | 100 | ninguna (<50) |
| 2 | prelude-ls@1.2.1 | n/d (plan free) | no | 100 | 75 | 75 | 100 | 100 | ninguna (<50) |
| 2 | shebang-command@2.0.0 | n/d (plan free) | no | 100 | 75 | 68 | 100 | 100 | ninguna (<50) |
| 2 | type-check@0.4.0 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 2 | uri-js@4.2.2 | n/d (plan free) | no | 100 | 75 | 100 | 100 | 100 | ninguna (<50) |
| 2 | which@2.0.1 | n/d (plan free) | no | 100 | 85 | 83 | 99 | 100 | ninguna (<50) |
| 3 | balanced-match@4.0.2 | n/d (plan free) | no | 100 | 86 | 85 | 100 | 100 | ninguna (<50) |
| 3 | brace-expansion@5.0.2 | n/d (plan free) | no | 100 | 93 | 98 | 100 | 50 | vulnerability 50 (resto ≥50) |
| 3 | cacheable@2.5.0 | n/d (plan free) | no | 100 | 84 | 100 | 99 | 100 | ninguna (<50) |
| 3 | flatted@3.4.2 | n/d (plan free) | no | 100 | 83 | 100 | 100 | 100 | ninguna (<50) |
| 3 | hookified@1.15.0 | n/d (plan free) | no | 100 | 92 | 100 | 100 | 100 | ninguna (<50) |
| 3 | isexe@2.0.0 | n/d (plan free) | no | 100 | 83 | 85 | 99 | 100 | ninguna (<50) |
| 3 | p-locate@5.0.0 | n/d (plan free) | no | 100 | 80 | 97 | 100 | 100 | ninguna (<50) |
| 3 | punycode@2.1.0 | n/d (plan free) | no | 100 | 81 | 100 | 100 | 100 | ninguna (<50) |
| 3 | shebang-regex@3.0.0 | n/d (plan free) | no | 100 | 75 | 69 | 100 | 100 | ninguna (<50) |

## Aprobación

- **Spec:** aprobada por la persona (2026-10-27).
- **Plan:** aprobado (2026-10-27; `tasks.md` creado).
- **Socket:** completa dentro de lo posible en org **free**: `depscore` (76
  paquetes), `organizations`, `alerts` en directos sin incidencias. **`threat_feed`
  no aplica** en plan free (documentado arriba). La persona acepta seguir con
  esas versiones sin campaña por threat feed.

Tras **aprobación explícita del plan** se escribe `tasks.md` y solo entonces
implementación.
