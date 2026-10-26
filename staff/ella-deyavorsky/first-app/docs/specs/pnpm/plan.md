# Plan — use pnpm

## Files

- Change `package.json` — add `"packageManager": "pnpm@12.14.0"`. Do not add dependencies. Do not add a start script. The `test` script stays as it is.
- Add `pnpm-lock.yaml` — created by `pnpm install` in `first-app`. The app has no dependencies, so the lockfile lists no packages.
- Change `AGENTS.md` — the command names `npm test` and `npm start` become `pnpm test` and `pnpm start`. One new line says dependencies are installed with `pnpm install`.

## The function

No new function in `logic/`. This feature does not decide a user action. It does not throw an error sentence.

## Edge cases

- Nothing to install: `pnpm install` still writes `pnpm-lock.yaml`.
- `pnpm test` still prints that no test is specified, then stops. That is the current script.

## Query

No query change. No new `.sql` file. The database stays as it is.

## Outside tool

pnpm 12.14.0, provided by Corepack, which is already installed with Node. On this machine `pnpm` is not on the path yet. Corepack must prepare pnpm 12.14.0 before `pnpm install` runs. Node is already installed.

## Order inside the logic file

There is no logic file for this feature. The steps in "One logic file per action" do not apply.

## Constitution changes this feature needs

None. This constitution does not name a package manager.

## What stays the same

`logic/`, `queries/`, `db/`, `clients/`, and this constitution do not change. No new package. No `pnpm start` script.
