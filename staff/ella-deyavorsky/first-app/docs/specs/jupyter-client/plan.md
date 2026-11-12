# Plan — Jupyter client, one notebook per feature

This is not a new business feature. No file in `logic/` changes, no function signature changes, and there is no new SQL and no new query. It adds a new client next to `clients/terminal/`. It does not touch `logic/`, `queries/`, or `db/`.

## Files to add or change

Add in `clients/jupyter/`:

- `00-welcome-and-index.ipynb`: what the app is, how to start, links to every notebook. One text cell. Spanish text.
- `prepare-database.ipynb`: the technical step. Calls `createUsersTable()` and lists the table names, like `clients/terminal/create-users-table.txt`.
- `create-user.ipynb`, `list-users.ipynb`, `find-user-by-id.ipynb`, `find-user-by-email.ipynb`, `update-user.ipynb`, `delete-user.ipynb`, `count-users-by-gender.ipynb`: each calls the function of the same name in `logic/`.
- `README.md`: how to start, open, choose the kernel, and stop.

Change:

- `package.json` and `pnpm-lock.yaml`: add the script `jupyter` and the dependency `cli-table3` `0.6.5`.
- `docs/CONSTITUTIONS.md`: add `clients/jupyter/` to the tree.
- The root `.gitignore`: ignore `.ipynb_checkpoints/`, the folder Jupyter creates next to the notebooks.

File names are kebab-case. The notebook text is Spanish. The JavaScript keeps the project conventions (named ESM imports with `.js`, camelCase, simple comments).

## Kernel and how a cell runs

The kernel is the standard Python 3 kernel (`ipykernel`, installed with `notebook`). The app logic is JavaScript, so the code cell is a Python cell that launches Node with `subprocess.run`. It runs with `cwd="../.."` (the notebook lives in `clients/jupyter/`, the app is two folders up) and passes `node --input-type=module -e <code>`. The JavaScript calls the function in `logic/`, as the matching file in `clients/terminal/` does, and the input values travel as JSON in an argument. Python then prints what Node wrote. `FORCE_COLOR=1` is set so the table headers keep their color. `--disable-warning=ExperimentalWarning` hides the SQLite warning. Python holds no business rule and no SQL, and there is no helper file. A JavaScript kernel was not chosen because it would add a heavy tool that has to work with `node:sqlite`, which is experimental.

## Notebook shape

Two cells:

1. Markdown: title, what it does, input table (meaning, required or not, valid examples), what it changes (the real database), how to tell it worked, and which errors can appear and how to fix them. The errors are only described here.
2. Code: the input values at the top in Python, marked `✏️ CAMBIA AQUÍ`, then the `subprocess.run` call. The Node code prints the result as a `cli-table3` table, or prints the error sentence if the logic throws.

`create-user` starts with a name and email that are valid. `update-user` and `delete-user` start with `id = 0`, which does not exist, so pressing Run without changing it changes nothing and shows "No user was found.". The text cell says to take an id from the list.

## Behavior

- Success prints what the logic returns as a table: one row for a user, one row per user for a list, and the three counts for the gender count. `deleteUser` returns nothing, so the cell prints a short confirmation.
- A thrown error prints the app's own sentence from the constitution (for example "This email is already used.") instead of the table.
- `countUsersByGender()` is async. The Node snippet uses `await`. Its text cell tells the reader to start Ollama with `llama3.2`. With Ollama off, the real "The classifier failed." is shown. The counts can change between runs because a model decides.

## Outside tools

- `cli-table3` `0.6.5`, a Node package that draws the tables. It is a dependency of the app, installed with `pnpm install`, and its optional package `@colors/colors` gives the colored headers.
- A Python virtual environment `.venv` in `first-app`, already ignored by the root `.gitignore`. It holds `notebook` (Jupyter Notebook interface, exact version pinned in the script) and its kernel. It is the only new dependency and it is not in `package.json`.
- Ollama with `llama3.2:latest`, already needed by the classifier, for the count notebook only.
- Node 23 with `node:sqlite`, as today.

The `jupyter` script creates `.venv` if it is missing, installs `notebook` if it is missing, and starts `jupyter notebook --ip=127.0.0.1 --port=8888 clients/jupyter`. It starts the Notebook interface, not Lab. If the port is busy, Jupyter picks the next free one and prints the address. The script is run with `pnpm jupyter` from `first-app`. It is not `pnpm start`.

## Changes to the constitution

- Tree: add the line `clients/jupyter/   notebooks, one per feature, run in the browser with pnpm jupyter`.
- No new logic file, no new error sentence.

## What stays as it is

`logic/`, `queries/`, `db/`, `clients/terminal/`, and every error sentence.

## Known disagreements, not part of this feature

The constitution says dates use `datetime('now', 'localtime')` but the SQL and the saved database use `datetime('now')`. The `email` column is `VARCHAR(64)` in the SQL and `TEXT` in the saved database. The `classifier-batch` spec says a wrong label count fails the count, but the code counts that group as undefined. The notebooks show what the code does today. They are not changed here.
