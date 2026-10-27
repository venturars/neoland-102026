# Plan — format and lint

Issue: #478.

This is not a new feature. It does not replace any file in `logic/`.
There is no new signature and no new SQL.

The app has no `format` and no `lint` yet. Check of the current code,
in a scratch copy of `db/`, `queries/` and `logic/` with the three
packages and the config below: `prettier --check` on the `format` globs
says "All matched files use Prettier code style!" and `eslint .` reports
nothing. Both exit with 0. So `format` does not change the current code.

Prettier on `.` walks into `.venv`. The format does not include `.venv`.
`clients/` has no `.js` file. A glob pointing there makes Prettier fail.

## Files

Created:

- `eslint.config.js`

Changed:

- `package.json`
- `pnpm-lock.yaml`
- `AGENTS.md` of first-app
- `docs/TREE.md`
- `docs/ARCHITECTURE.md`

The root `AGENTS.md` does not change.

No `.prettierrc`, no `.prettierignore` and no change to
`docs/STYLE.md`. `logic/`, `queries/`, `db/` and `clients/` do not
change.

## Packages

In `devDependencies`, with the exact version:

- `prettier` `3.9.10`
- `eslint` `10.13.0`
- `@eslint/js` `10.0.1`

There is no `globals` package.

Dependencies down to 3 layers: 66 package versions under the three
above, as npm resolves them (30 in layer 1, 28 in layer 2, 8 in layer
3). `eslint-visitor-keys` appears with two versions. Each of them is
checked.

`eslint` `10.13.0` and `@eslint/js` `10.0.1` ask for Node
`^20.19.0 || ^22.13.0 || >=24`. The local Node is `23.7.0`, which is
outside that range. npm warns `EBADENGINE`. The check above ran on that
Node without errors.

## Socket

Checked on 2026-10-27 with Socket's `depscore` (`https://mcp.socket.dev/`,
without signing in), for the 3 packages and the 66 dependencies, each one
at its exact version.

- The lowest stat is 68 (`quality` of `shebang-command` `2.0.0`). No stat
  is below 50.
- The three packages (license / maintenance / quality / supply chain /
  vulnerability): `prettier` 100/97/96/98/100, `eslint` 100/95/100/97/100,
  `@eslint/js` 100/86/100/100/100.
- Campaigns and alerts: not checked. Without signing in, `depscore`
  returns only scores. The `alerts` and `threat_feed` tools need an
  organization, and this account has none.

Decision of the person who accepts the plan: accepted on 2026-10-27
with `prettier` `3.9.10`, `eslint` `10.13.0` and `@eslint/js` `10.0.1`.
Campaigns and alerts stay unchecked. Node `23.7.0` stays, with the
`EBADENGINE` warning.

## Scripts

In `package.json`, next to `test`:

```json
"format": "prettier --write \"db/**/*.js\" \"queries/**/*.js\" \"logic/**/*.js\"",
"lint": "eslint ."
```

`test` stays as it is.

## ESLint

`eslint.config.js` is this. The rules are the recommended ones. It
ignores `.venv` and `node_modules`.

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

## Tree

`docs/TREE.md` adds `eslint.config.js` at the root of `first-app/`:

```text
first-app/
  AGENTS.md
  eslint.config.js
  package.json
```

The rest of the tree stays the same.

## Architecture

`docs/ARCHITECTURE.md` gets a new first subsection under "Files":

```
### first-app/

- `eslint.config.js` applies ESLint's recommended rules to the JavaScript and ignores `.venv` and `node_modules`.
```

## AGENTS.md

In "Commands", after the install line:

```
- `pnpm format` runs Prettier on the `.js` files of `db/`, `queries/` and `logic/`. The format is the standard one, with no config of its own. `pnpm lint` runs ESLint.
```

In "When a task is done", one step is added after step 2:

```
3. Run `pnpm format` and `pnpm lint` before showing the result.
```

"Show the result" and "Stop" become steps 4 and 5.

## Contract

No `logic/` function, no public signature and no SQL.

No new message in "Errors".
