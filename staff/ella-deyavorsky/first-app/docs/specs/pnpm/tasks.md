# Tasks — use pnpm

Do the tasks in order. Inside a task, do the steps in order.

The constitution does not change. There is no query, no logic file, and no client file.

## Task 1 — Get pnpm ready

- [ ] From `first-app`, run `corepack prepare pnpm@12.14.0 --activate`. Result: Corepack provides pnpm 12.14.0.
- [ ] Run `pnpm --version`. Result: the printed version is 12.14.0.

## Task 2 — Name the package manager

- [ ] Add `"packageManager": "pnpm@12.14.0"` to `package.json`. Result: the project names pnpm 12.14.0.

## Task 3 — Write the lockfile

- [ ] Run `pnpm install` in `first-app`. Result: `pnpm-lock.yaml` exists.

## Task 4 — Update the guide

- [ ] In `AGENTS.md`, replace `npm test` with `pnpm test`. Result: the test command names pnpm.
- [ ] In `AGENTS.md`, replace each `npm start` with `pnpm start`. Result: the guide does not tell anyone to add an npm start script.
- [ ] In the Commands section of `AGENTS.md`, add one line that dependencies are installed with `pnpm install`. Result: the install command is written down.

## Task 5 — Run it

- [ ] Run `pnpm test` in `first-app`. Result: the script prints that no test is specified, then stops.
- [ ] Stop. Do not change the three spec files again. Result: the one-pass cycle is done.
