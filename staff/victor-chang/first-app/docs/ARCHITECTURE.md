# Architecture

The folders and files are in [TREE.md](TREE.md).

## Layers and files

- `db/` opens the database. No business rules.
  - `db/connection.js` is the only database connection.
  - `db/schema.sql` is the only place the tables are defined.
  - `db/users.sqlite` is the only database file (git-ignored).
- `queries/queries/` holds the SQL in `.sql` files. `queries/users.js` reads and runs them. No business rules.
  - `queries/queries/` has one `.sql` file per query.
  - `queries/users.js` reads those files, prepares the SQL and runs it.
- `logic/` is the core of the app. The business rules live here. One feature per file.
  - `logic/create-user.js` creates a user.
  - `logic/update-user.js` updates a user.
  - `logic/delete-user.js` deletes a user.
  - `logic/list-users.js` lists the users.
  - `logic/get-user.js` gets a user by id.
  - `logic/get-user-by-email.js` gets a user by email.
  - `logic/find-user-by-name.js` finds the users with a name.
  - `logic/search-users.js` finds the users whose name contains a text.
  - `logic/count-users-by-gender.js` counts the users by gender, with the local AI.
  - `logic/errors.js` holds the error classes.
  - `logic/validate-user.js`, `logic/validate-email.js` and `logic/validate-name.js` hold input checks shared by several features.
- `clients/terminal/` calls `logic/` and shows the result. It is the first client and the manual test of each feature.
- `clients/jupyter/` calls `logic/` and shows the result in a table. It is for someone who does not code. One notebook per terminal client.
- `docs/` holds the rules of the app.
  - `docs/CONSTITUTION.md` is what every change follows, and links to the guides.
  - `docs/ARCHITECTURE.md` is this file.
  - `docs/TREE.md` is the tree of folders and files.
  - `docs/DATABASE.md` is the database and the queries.
  - `docs/ERRORS.md` is the error list and how code throws and catches.
  - `docs/STYLE.md` is the naming and the way code is written.
- `docs/specs/<name>/` is one change. `<name>` is in kebab-case; for a feature, it is named like its `logic/` file.
  - `spec.md` is the business of the change, `plan.md` what gets built, and `tasks.md` the steps to build it.
- `scripts/jupyter.sh` prepares and opens the Jupyter client.
- `AGENTS.md` is how to work in the app: rules, commands, the Socket check and the workflow.
- `package.json` holds the npm dependencies, installed with pnpm. `pnpm-lock.yaml` holds the exact installed versions.
- `.venv/` is the Python of the Jupyter client (git-ignored).
- `.prettierignore` is what Prettier does not format.
- `eslint.config.js` is the ESLint rules.

## Clients

A client calls `logic/` and shows the result. It has no business rules.

The one exception is `create-users-table` (`clients/terminal/create-users-table.txt` and `clients/jupyter/create-users-table.ipynb`): it calls `createUsersTable()` from `queries/users.js`, because it is a setup step with no business rules and no `logic/` file.

### Terminal

After a feature is done, its first client is `clients/terminal/<name>.txt`, named like the `logic/` file. It is the manual test of the feature.

- It is one block to paste into Git Bash, with `first-app` as the current folder.
- The block runs `node --no-warnings --input-type=module -e '...'`, imports the `logic/` function and prints the result with `console.log`.
- It also shows each failure of the spec that can be reached, printing `error.message`.
- Each step has a `//` comment saying what it does and what it prints.
- It uses the real `db/users.sqlite`. A practice user it creates is deleted at the end, so the block can be pasted again.

### Jupyter

`clients/jupyter/<name>.ipynb` is one notebook per `clients/terminal/<name>.txt`, with the same name. It is opened with `pnpm jupyter` from `first-app`.

- The first cell is markdown: what it does, what happens in the database, which `logic/` function it uses, and which failures it can show.
- The code cell walks up to the folder that has `logic/`, runs `node --no-warnings --input-type=module -e '...'` there, imports the `logic/` function and prints the result as a `cli-table3` table.
- A failure prints only `error.message`, without the stack trace.
- It uses the real `db/users.sqlite`. A practice user it creates is deleted at the end, so the cell can be run again. It does not use the id of a real user.
- The saved output is what really came out when the cell ran.
