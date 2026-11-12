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

### Campaigns and alerts

The `alerts` and `threat_feed` tools of the Socket MCP need an
organization, and this account has none. So campaigns and alerts were
checked by hand on the public Alerts page of each package on socket.dev
(tabs "Package Alerts" and "Dependency Alerts"), on 2026-10-27.

| Package | Exact version | Campaign | Alerts |
| ------- | ------------- | -------- | ------ |
| `prettier` | `3.9.10` | none seen | 6, all low (grey): Debug access, Environment variable access, Filesystem access, URL strings, Minified code, AI-detected potential code anomaly |
| `eslint` | `10.13.0` | none seen | 4, all low (grey): Debug access, Environment variable access, Filesystem access, URL strings |
| `@eslint/js` | `10.0.1` | none seen | No alerts |

Comments on the alerts (the person who accepts the plan decides):

- Debug access, Environment variable access, Filesystem access and URL
  strings appear in both `prettier` and `eslint`. They are expected for
  developer tools: they read and write the project files, read their
  config from the environment, load rules and plugins dynamically, and
  contain links to their documentation.
- Minified code (`prettier`): Prettier ships its code bundled. It is
  harder to read, but it is the published package.
- AI-detected potential code anomaly (`prettier`), in
  `internal/experimental-cli-worker.mjs`. Socket's AI analysis, detected
  2026-10-10: confidence 0.6, impact 0.55, risk medium. It found no
  malware, no `eval`, no credential theft and no data sent out. Its
  concern is that Prettier loads formatter plugins named in the config,
  reads and writes the files it is given, and uses temporary JSON files.
  In this app there is no Prettier config and no plugin, and Prettier
  only runs on our own `.js` files, on the developer's machine.

Dependencies of `eslint` `10.13.0` ("Dependency Alerts" tab).
`prettier` and `@eslint/js` have no dependencies. The "Dependency
Alerts" tab of `prettier` `3.9.10` shows none.

| Alert | Level | Where |
| ----- | ----- | ----- |
| Shell access | medium (yellow) | `cross-spawn` `7.0.6`, `index.js` (module `child_process`) |
| Uses eval | medium (yellow) | `ajv` `6.15.0`, `lib/compile/index.js` (`Function`) |
| Debug access | low | 2 packages |
| Environment variable access | low | 8 packages |
| Filesystem access | low | 8 packages |
| URL strings | low | not counted on the page |
| Unmaintained | low | 24 packages |
| AI-detected potential code anomaly | low | 7 instances in 5 packages |
| Minified code | low | 2 packages |
| High entropy strings | low | not counted on the page |

Comments on the dependency alerts (the person who accepts the plan
decides):

- Shell access (medium), `cross-spawn`: its only job is to start other
  programs in the same way on Mac, Linux and Windows. It uses Node's
  `child_process` module. Expected for this package.
- Uses eval (medium), `ajv`: a JSON schema validator. It turns each
  schema into a JavaScript function with `Function`, to validate faster.
  ESLint uses it to check the options of its rules. Expected for this
  package.
- Unmaintained (24 packages): not updated in more than 5 years. Many
  small helper packages are finished and do not change. The risk is that
  a bug found later may not be fixed.
- AI-detected potential code anomaly (7 instances in 5 packages): each
  analysis was read on socket.dev. None shows evidence of malware. The
  concerns are of the same kind as the one in `prettier`.
- The other alerts are the same kinds as in the packages above.

Decision of the person who accepts the plan (2026-10-27): `prettier`
`3.9.10`, `eslint` `10.13.0` and `@eslint/js` `10.0.1` are accepted. All
stats are 68 or above. No campaign was seen. Every alert was read and
commented above: each one matches what the package is meant to do,
including the two medium alerts (`cross-spawn` starts processes, `ajv`
compiles schemas), and no AI analysis shows evidence of malware. Node
`23.7.0` stays, with the `EBADENGINE` warning.

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
