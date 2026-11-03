# Plan — Prettier and ESLint

Tooling only. It changes no feature.

## Files

- Touch: `package.json`, through `pnpm add -D --save-exact prettier@3.9.10 eslint@10.13.0 @eslint/js@10.0.1`, and three scripts:
  - `"format": "prettier --write ."`
  - `"format:check": "prettier --check ."`
  - `"lint": "eslint ."`
- Touch: `pnpm-lock.yaml`, through `pnpm add`.
- Create: `eslint.config.js`, the flat config: it ignores `.venv/**` and `node_modules/**` and applies `js/recommended` to `**/*.js`.
- Touch: `docs/CONSTITUTION.md`
  - **Tree**: `eslint.config.js  The ESLint rules`.
  - **Runtime**, Tooling: Prettier and ESLint are development packages at an exact version, run with `pnpm format`, `pnpm format:check` and `pnpm lint`. Prettier keeps its default config with no config file. ESLint uses its recommended rules only.
- Touch: `AGENTS.md`
  - **Commands**: `pnpm format`, `pnpm format:check` and `pnpm lint` replace the two `npx prettier` lines.
  - **How code is written**: run `pnpm format` and `pnpm lint` before committing.
- Touch: `docs/specs/README.md`, the row `prettier-and-eslint`.
- Not touched: `.prettierignore` (it already lists `.venv/` and `pnpm-lock.yaml`; Prettier also skips `node_modules/` by default), `logic/`, `queries/`, `db/`, `clients/`, unless the answer to the open question says so.

`eslint.config.js`:

```js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  { ignores: [".venv/**", "node_modules/**"] },
  { files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },
]);
```

`eslint@10.13.0` and not `10.14.0`, the latest: `10.14.0` was published on 2026-10-30, four days ago. `10.13.0` (2026-10-16) is the version the reference app uses.

## Looks like

`docs/specs/jupyter-client/plan.md`: a change that adds Node packages and scripts to `package.json`, with no new `logic/` function.

## Signature

None.

## SQL

None.

## Errors

None. This change adds no message to **Errors**.

## Socket check

Layers found with `npm view <name>@<version> dependencies`. None of these packages is in `pnpm-lock.yaml`, so each range takes the highest matching version. A package that shows up in two layers is listed once, at the first layer it shows up in. 61 packages.

| Package                                       | Layer | Alerts                                                                                                                    | Scores below 50 |
| --------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `prettier@3.9.10`                             | 1     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/prettier/alerts/3.9.10)                             | None            |
| `eslint@10.13.0`                              | 1     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/eslint/alerts/10.13.0)                              | None            |
| `@eslint/js@10.0.1`                           | 1     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint/js/alerts/10.0.1)                           | None            |
| `ajv@6.15.0`                                  | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/ajv/alerts/6.15.0)                                  | None            |
| `debug@4.4.3`                                 | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/debug/alerts/4.4.3)                                 | None            |
| `espree@11.2.0`                               | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/espree/alerts/11.2.0)                               | None            |
| `ignore@5.3.2`                                | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/ignore/alerts/5.3.2)                                | None            |
| `esquery@1.7.0`                               | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/esquery/alerts/1.7.0)                               | None            |
| `esutils@2.0.3`                               | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/esutils/alerts/2.0.3)                               | None            |
| `find-up@5.0.0`                               | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/find-up/alerts/5.0.0)                               | None            |
| `is-glob@4.0.3`                               | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/is-glob/alerts/4.0.3)                               | None            |
| `minimatch@10.2.6`                            | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/minimatch/alerts/10.2.6)                            | None            |
| `optionator@0.9.4`                            | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/optionator/alerts/0.9.4)                            | None            |
| `cross-spawn@7.0.6`                           | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/cross-spawn/alerts/7.0.6)                           | None            |
| `glob-parent@6.0.2`                           | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/glob-parent/alerts/6.0.2)                           | None            |
| `imurmurhash@0.1.4`                           | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/imurmurhash/alerts/0.1.4)                           | None            |
| `@eslint/core@1.2.1`                          | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint/core/alerts/1.2.1)                          | None            |
| `eslint-scope@9.1.2`                          | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/eslint-scope/alerts/9.1.2)                          | None            |
| `@humanfs/node@0.16.8`                        | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@humanfs/node/alerts/0.16.8)                        | None            |
| `@types/estree@1.0.10`                        | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@types/estree/alerts/1.0.10)                        | None            |
| `fast-deep-equal@3.1.3`                       | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/fast-deep-equal/alerts/3.1.3)                       | None            |
| `natural-compare@1.4.0`                       | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/natural-compare/alerts/1.4.0)                       | None            |
| `file-entry-cache@11.1.5`                     | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/file-entry-cache/alerts/11.1.5)                     | None            |
| `@eslint/plugin-kit@0.7.3`                    | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint/plugin-kit/alerts/0.7.3)                    | None            |
| `eslint-visitor-keys@5.0.1`                   | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/eslint-visitor-keys/alerts/5.0.1)                   | None            |
| `@eslint/config-array@0.23.5`                 | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint/config-array/alerts/0.23.5)                 | None            |
| `@humanwhocodes/retry@0.4.3`                  | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@humanwhocodes/retry/alerts/0.4.3)                  | None            |
| `escape-string-regexp@4.0.0`                  | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/escape-string-regexp/alerts/4.0.0)                  | None            |
| `@eslint/config-helpers@0.7.0`                | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint/config-helpers/alerts/0.7.0)                | None            |
| `@eslint-community/regexpp@4.12.2`            | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint-community/regexpp/alerts/4.12.2)            | None            |
| `@eslint-community/eslint-utils@4.10.1`       | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint-community/eslint-utils/alerts/4.10.1)       | None            |
| `@humanwhocodes/module-importer@1.0.1`        | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@humanwhocodes/module-importer/alerts/1.0.1)        | None            |
| `json-stable-stringify-without-jsonify@1.0.1` | 2     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/json-stable-stringify-without-jsonify/alerts/1.0.1) | None            |
| `uri-js@4.4.1`                                | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/uri-js/alerts/4.4.1)                                | None            |
| `json-schema-traverse@0.4.1`                  | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/json-schema-traverse/alerts/0.4.1)                  | None            |
| `fast-json-stable-stringify@2.1.0`            | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/fast-json-stable-stringify/alerts/2.1.0)            | None            |
| `ms@2.1.3`                                    | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/ms/alerts/2.1.3)                                    | None            |
| `acorn@8.19.0`                                | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/acorn/alerts/8.19.0)                                | None            |
| `acorn-jsx@5.3.2`                             | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/acorn-jsx/alerts/5.3.2)                             | None            |
| `estraverse@5.3.0`                            | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/estraverse/alerts/5.3.0)                            | None            |
| `locate-path@6.0.0`                           | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/locate-path/alerts/6.0.0)                           | None            |
| `path-exists@4.0.0`                           | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/path-exists/alerts/4.0.0)                           | None            |
| `is-extglob@2.1.1`                            | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/is-extglob/alerts/2.1.1)                            | None            |
| `brace-expansion@5.0.12`                      | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/brace-expansion/alerts/5.0.12)                      | None            |
| `prelude-ls@1.2.1`                            | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/prelude-ls/alerts/1.2.1)                            | None            |
| `deep-is@0.1.4`                               | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/deep-is/alerts/0.1.4)                               | None            |
| `word-wrap@1.2.5`                             | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/word-wrap/alerts/1.2.5)                             | None            |
| `type-check@0.4.0`                            | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/type-check/alerts/0.4.0)                            | None            |
| `levn@0.4.1`                                  | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/levn/alerts/0.4.1)                                  | None            |
| `fast-levenshtein@2.0.6`                      | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/fast-levenshtein/alerts/2.0.6)                      | None            |
| `which@2.0.2`                                 | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/which/alerts/2.0.2)                                 | None            |
| `path-key@3.1.1`                              | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/path-key/alerts/3.1.1)                              | None            |
| `shebang-command@2.0.0`                       | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/shebang-command/alerts/2.0.0)                       | None            |
| `@types/json-schema@7.0.15`                   | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@types/json-schema/alerts/7.0.15)                   | None            |
| `@types/esrecurse@4.3.1`                      | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@types/esrecurse/alerts/4.3.1)                      | None            |
| `esrecurse@4.3.0`                             | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/esrecurse/alerts/4.3.0)                             | None            |
| `@humanfs/core@0.19.2`                        | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@humanfs/core/alerts/0.19.2)                        | None            |
| `@humanfs/types@0.15.0`                       | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@humanfs/types/alerts/0.15.0)                       | None            |
| `flat-cache@6.1.23`                           | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/flat-cache/alerts/6.1.23)                           | None            |
| `@eslint/object-schema@3.0.5`                 | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/@eslint/object-schema/alerts/3.0.5)                 | None            |
| `eslint-visitor-keys@3.4.3`                   | 3     | Not checked by the agent: [socket.dev](https://socket.dev/npm/package/eslint-visitor-keys/alerts/3.4.3)                   | None            |

No alert was read, so there is none to explain. Every package was scored. The lowest scores are `shebang-command@2.0.0` with quality 68, `@humanfs/types@0.15.0` with quality 70 and `escape-string-regexp@4.0.0` with quality 71. All three are above 50.

Checked on 2026-11-03. Sources:

- **Scores**: `depscore` from the `socket-mcp` server of this session, with exact versions, for all 61 packages.
- **Alerts**: `https://socket.dev/npm/package/<name>/alerts/<version>` returns HTTP 403 to the agent (curl), so each one is "Not checked by the agent" and carries its link.

Decision:

## Open questions

1. ESLint's recommended rules include `no-undef`, and with no Node globals declared, the `URL` in `db/connection.js` and `queries/users.js` fails as `'URL' is not defined`. Which fix?
   - **a.** `import { URL } from "node:url"` in those two files. No new package. `node:url` is already a listed built-in. (Recommended.)
   - **b.** Declare `URL` as a global in `eslint.config.js` (`languageOptions: { globals: { URL: "readonly" } }`).
   - **c.** Add the `globals` package and use `globals.node`. One more package, with its own Socket check.
