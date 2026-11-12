# Plan — move the code into src

## Files

Move with `git mv`, so the history follows:

- `clients/` becomes `src/clients/`.
- `db/` becomes `src/db/`.
- `queries/` becomes `src/queries/`.
- `logic/` becomes `src/logic/`.

Change the paths that point to them:

- `src/clients/terminal/*.txt` — each import changes from `./logic/...`, `./db/...` or `./queries/...` to `./src/logic/...`, `./src/db/...` or `./src/queries/...`. They are still pasted with `first-app` as the current folder.
- `src/clients/jupyter/*.ipynb` — each import changes the same way. `cwd` changes from `../..` to `../../..`, and the comment that says "two folders up" says three. Text cells that name `db/users.sqlite` name `src/db/users.sqlite`.
- `src/clients/jupyter/README.md` — the paths and the launch command use `src/`.
- `scripts/jupyter.sh` — the comment and the launch folder use `src/clients/jupyter`.
- `package.json` — the `format` script uses `src/db/**/*.js`, `src/queries/**/*.js` and `src/logic/**/*.js`.
- `.gitignore` — `db/users.sqlite` becomes `src/db/users.sqlite`.
- `AGENTS.md`, `docs/DATABASE.md`, `docs/ERRORS.md`, `docs/STYLE.md` — the sentences that name a folder path use `src/`. Layer names used as words (the logic layer) stay.
- `docs/TREE.md` — the four folders appear inside a `src/` folder.
- `docs/ARCHITECTURE.md` — the layer list and the headings of `logic/`, `queries/`, `db/` and `clients/` say they are inside `src/`.

No code line inside `logic/`, `queries/` or `db/` changes. Their imports between each other (`../queries/users.js`, `../db/connection.js`) stay valid because the three folders move together. `connection.js` and `users.js` find their files from their own place, not from the current folder.

## The function

No new function in `logic/`. This feature does not decide a user action. It does not throw an error sentence.

## Edge cases

- `db/users.sqlite` is not tracked by git. It moves as a normal file on disk with its folder, so the data stays. If it is not there, opening the database creates it.
- `node_modules`, `eslint.config.js` and `pnpm-lock.yaml` stay at the top. ESLint still reads the whole folder, so `pnpm lint` covers `src/`.
- Spec folders in `docs/specs/` keep the old paths. They describe past features and are not rewritten.

## Query

No query change. No new `.sql` file. The queries and the database stay as they are.

## Outside tool

None. Node and pnpm are already in use. Jupyter is only needed for the notebooks.

## Order inside the logic file

There is no new logic file. The steps in "One logic file per action" do not apply.

## Constitution changes this feature needs

None to the rules. The path changes in `docs/TREE.md` and `docs/ARCHITECTURE.md` are listed above. `docs/CONSTITUTIONS.md` names `logic/` and `queries/users.js` as folders and files: it is checked, and changed only where it names a path.

## What stays the same

The behavior of every action, the error sentences, the table, the queries and the order of a function in `logic/`. No new package. No `pnpm start` script.
