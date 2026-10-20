# Agent guide

This file tells a coding assistant how to work in this app.

## Project

This is the first app of the AI engineering course for junior students. It is a good app to build with spec-driven development (SDD): write the rules first, then write the code that follows them.

The app is JavaScript, run by Node.js. `package.json` sets `"type": "module"`, so files use ESM: `import` and `export`. There is no web framework and no TypeScript.

The database is SQLite through Node's built-in `node:sqlite`. `db/connection.js` opens `db/users.sqlite` with `DatabaseSync`. No database package is installed.

Read this file together with `docs/CONSTITUTIONS.md`. The constitution explains the folders, the database, the logic, the errors, and the queries.

## Rules

- Read `docs/CONSTITUTIONS.md` and the active spec before changing code.
- Stay close to the plan. Do not invent a new behavior.
- Before writing, look at the code. If a similar task already exists, follow that style.
- Do not offer code that has not been run.
- If two sources disagree — the constitution, the current code, a spec, or this guide — do not choose. Ask which path to follow before writing code.

The active spec is the approved description of the feature you are building now.

## Commands

- There are no execution commands yet. Do not add an `npm start` script or another way to run the whole app unless the spec asks for it.
- There are no tests yet. `npm test` only prints that no test is specified, then stops.
- Format code with Prettier, using Prettier's standard settings. Do not add a custom Prettier config.

## Style and conventions

- File and folder names use kebab-case: lowercase words joined by `-`, as in `create-user.js`, `find-by-email.sql`, and `clients/terminal`.
- Function names and variable names use camelCase, as in `createUser` and `emailParts`.
- Import and export by name. In ESM, the import path includes the file extension: `import { createUser } from "./create-user.js"`.
- In SQL, pass values with a name, as in `:email`. Do not use `?`.
- A new query is a new `.sql` file in `queries/queries/` plus a function in `queries/users.js`. The names follow `docs/CONSTITUTIONS.md`. The SQL string stays in the `.sql` file.
- Leave short comments that help a junior developer understand what the code does. Write them in simple words, next to the step they explain. Skip comments that only repeat the line.
- Before finishing a change in `logic/`, check it against the inputs and errors in `docs/CONSTITUTIONS.md`.

Code must read from top to bottom. Use `if` checks, and names that say what they do.

Write code a programmer could write without AI. Do not hide the steps. Avoid result wrappers, error classes, generic helpers, and abstractions.

What a function in `logic/` must accept, what it returns, and how errors work is written in `docs/CONSTITUTIONS.md`. The query function names and the `.sql` file names are written there too. The file that exports them is `queries/users.js`. Follow that file. Do not invent a second contract, and do not keep a second list of query names in this guide.

## When a task is done

1. A new feature gets a new file in `clients/terminal/`, named like its logic file (`find-user-by-email.txt` for `logic/find-user-by-email.js`). It is pasted in the terminal with `first-app` as the current folder. It imports the function from `logic/` and prints the result with `console.log`.
2. Check the change by pasting the matching file in `clients/terminal/`. There is still no `npm start`.
3. Show the result.
4. Stop.

Do not start the next feature. A task is not done if the code has not been run.
