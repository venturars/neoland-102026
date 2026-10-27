# Agent guide

This file tells a coding assistant how to work in this app.

## Project

This is the first app of the AI engineering course for junior students. It is a good app to build with spec-driven development (SDD): write the rules first, then write the code that follows them.

The app is JavaScript, run by Node.js. `package.json` sets `"type": "module"`, so files use ESM: `import` and `export`. There is no web framework and no TypeScript.

The database is SQLite through Node's built-in `node:sqlite`. `db/connection.js` opens `db/users.sqlite` with `DatabaseSync`. No database package is installed.

Read this file together with `docs/CONSTITUTIONS.md`. The constitution explains the order of a `logic/` function and the specs. The other topics have one file each: `docs/ARCHITECTURE.md`, `docs/TREE.md`, `docs/DATABASE.md`, `docs/ERRORS.md`, and `docs/STYLE.md`.

## Rules

- Read `docs/CONSTITUTIONS.md` and the active spec before changing code.
- Stay close to the plan. Do not invent a new behavior.
- Before writing, look at the code to see which file a new function looks like. The form of each line comes from `docs/STYLE.md`, not from the code that already exists. That code is not rewritten by a task that does not ask for it. A later task can align it. Meanwhile, a new spec does not stop because of that difference.
- Do not offer code that has not been run.
- If two sources disagree — the constitution, a spec, or this guide — do not choose. The difference between `docs/STYLE.md` and the current code is not one of these cases. Ask which path to follow before writing code.
- A request for a new behavior is a new feature. The first work is a folder in `docs/specs/`, with a kebab-case name.
- Write `spec.md`, then `plan.md`, then `tasks.md`, in that order. Do not write the next file if the previous one does not exist.
- Do not create or change code until those three files exist. Code includes `logic/`, `queries/`, `db/`, `clients/`, and `package.json`.
- Follow `tasks.md` from the first step. Do not skip a step and do not start the next feature.
- If a task adds or removes a file, its spec also updates `docs/TREE.md` and `docs/ARCHITECTURE.md`.
- A tool change, such as switching the package manager to pnpm, counts as a feature and goes through the same folder.

The active spec is the approved description of the feature you are building now.

## Commands

- Install dependencies with `pnpm install`.
- `pnpm format` runs Prettier on the `.js` files of `db/`, `queries/` and `logic/`. The format is the standard one, with no config of its own. `pnpm lint` runs ESLint.
- There are no execution commands yet. Do not add a `pnpm start` script or another way to run the whole app unless the spec asks for it.
- There are no tests yet. `pnpm test` only prints that no test is specified, then stops.

## Packages

When you add a Node package or change its version, validate it with the Socket MCP before the plan is accepted. `docs/CONSTITUTIONS.md` says this is required; this is how it is done.

1. Check with Socket that the package and that exact version are not affected by a campaign, not affected by an alert, and have no stat below 50 points.
2. Do not decide an alert yourself. Comment it, and the person who accepts the plan decides.
3. Check the dependencies of that package with the same criteria, down to 3 layers.
4. Put a summary of this review in the plan, before the plan is accepted.

## Style

The conventions and the shape of each line are in `docs/STYLE.md`. Follow that file.

Before finishing a change in `logic/`, check it against the inputs in `docs/CONSTITUTIONS.md` and the errors in `docs/ERRORS.md`. The query names and the `.sql` file names are in `docs/DATABASE.md`. Do not invent a second contract, and do not keep a second list of query names in this guide.

## When a task is done

1. A new feature gets a new file in `clients/terminal/`, named like its logic file (`find-user-by-email.txt` for `logic/find-user-by-email.js`). It is pasted in the terminal with `first-app` as the current folder. It imports the function from `logic/` and prints the result with `console.log`.
2. Check the change by pasting the matching file in `clients/terminal/`. There is still no `pnpm start`.
3. Run `pnpm format` and `pnpm lint` before showing the result.
4. Show the result.
5. Stop.

Do not start the next feature. A task is not done if the code has not been run.
