# Plan — Jupyter client

## Files

- Touch: `package.json` (add the `jupyter` script and the dependencies `cli-table3` `0.6.5` and `@colors/colors` `1.6.1`; pin `openai` to `7.42.0`), `pnpm-lock.yaml` (through `pnpm add`), `docs/specs/README.md` (status `done` at the end).
- Create: `.prettierignore` with `.venv/` and `pnpm-lock.yaml`, so `npx prettier --check .` does not read the installed Python packages or the lockfile pnpm writes.
- Touch: `.gitignore` (add `.ipynb_checkpoints/`, the backups Jupyter writes when a notebook is opened in the browser).
- Create, in `clients/jupyter/`, one notebook per `clients/terminal/<name>.txt`, with the same name: `create-user.ipynb`, `get-user.ipynb`, `get-user-by-email.ipynb`, `list-users.ipynb`, `update-user.ipynb`, `delete-user.ipynb`, `count-users-by-gender.ipynb`.
- Not touched: `logic/`, `queries/`, `db/`. `.venv/` is created on the first run and is already git-ignored by the root `.gitignore`.

The `jupyter` script, run with `pnpm jupyter` from `first-app`:

```
test -x .venv/bin/jupyter-notebook || (test -d .venv || python3 -m venv .venv && .venv/bin/pip install notebook==7.6.3) && .venv/bin/jupyter notebook clients/jupyter
```

If `.venv/bin/jupyter-notebook` is missing, it creates `.venv` (only if missing) and installs `notebook` `7.6.3`. Then it opens the notebook interface on `clients/jupyter`. Not JupyterLab. The kernel is the Python of `.venv`.

## Looks like

Each notebook does the same steps as its `clients/terminal/<name>.txt`, with the same practice user (`practice-<time>@x.com`, deleted at the end) and the same failures. Only the way of showing the result changes.

Each notebook has two cells, nothing else:

1. Markdown: `# <title>`, then `## What it does`, `## What happens to the saved users`, `## Feature it uses`, `## Failures it can show`.
2. Code (Python): walks up from the current folder to the one with `logic/`, and if there is none it stops with `Cannot find first-app.`; runs `node --no-warnings --input-type=module -e <program>` there with `FORCE_COLOR=1`; prints its stdout, and its stderr only if node fails.

The Node program imports the `logic/` functions and `cli-table3` with `await import(...)` inside its outer `try/catch`, so a package or file that does not load also prints only `error.message`, and:

- runs the steps after the practice user is created inside `try { ... } finally { deleteUser(...) }`, so the practice user is deleted even if a step fails unexpectedly;
- prints a user as a table with the columns `id`, `name`, `email`, `createdAt`, `updatedAt`;
- prints a list as one row per user; with no users, only the header;
- prints the count with the columns `women`, `men`, `genderUndefined`;
- prints, for delete, a table with the column `result` and the row `Returns no data.`;
- wraps each failure step in `try/catch` and prints only `error.message`;
- wraps the whole program in one more `try/catch` that prints only `error.message`, so an unexpected failure shows no stack trace;
- the header style is `["cyan", "bold"]`.

## Signature

None. No new `logic/` function.

## SQL

None.

## Errors

The notebooks throw nothing; they print the message `logic/` already throws.

| Notebook                | Messages it shows on purpose                                 |
| ----------------------- | ------------------------------------------------------------ |
| `create-user`           | `Email is already used`, `Name is empty`, `Email is invalid` |
| `get-user`              | `User not found`                                             |
| `get-user-by-email`     | `User not found`, `Email is invalid`                         |
| `update-user`           | `User not found`, `Name is empty`                            |
| `delete-user`           | `User not found`                                             |
| `count-users-by-gender` | `Could not classify the users` (only with Ollama stopped)    |
| `list-users`            | none                                                         |

The `Could not … the user(s)` messages are not shown on purpose; if SQLite fails, the block prints that message.

## Open questions

None. Answered:

1. The app folder is not found → the notebook prints `Cannot find first-app.` The **Errors** section of the constitution now allows this one client message.
2. `openai` is pinned to `7.42.0`, the version already in `pnpm-lock.yaml`.
