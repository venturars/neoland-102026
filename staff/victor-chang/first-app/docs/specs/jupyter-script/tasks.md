# Tasks — Jupyter script

1. [x] In `docs/CONSTITUTION.md`, **Errors**, add the client message `Python 3 is required to start Jupyter.`, printed by `scripts/jupyter.sh`.
       The paragraph names two client messages.
2. [x] Create `scripts/jupyter.sh` with the five steps of the plan.
       `sh -n scripts/jupyter.sh` prints nothing.
3. [x] In `package.json`, set `"jupyter": "sh scripts/jupyter.sh"`.
4. [x] Run `pnpm jupyter` with the current `.venv`.
       It installs nothing and the browser shows the notebooks of `clients/jupyter/`.
5. [x] Run `list-users.ipynb`: the same table as before.
6. [x] Move `.venv` to `.venv-old` and run `pnpm jupyter`.
       It creates `.venv`, installs `notebook` `7.6.3` and opens the browser. Delete `.venv-old`.
7. [x] Move `.venv` aside. Make a temporary folder with links to `dirname` and `uname` only, and run `PATH=<folder> /bin/sh scripts/jupyter.sh` (no Python on the path).
       It prints `Python 3 is required to start Jupyter.` and `echo $?` prints `1`. Put `.venv` back.
8. [x] In `docs/CONSTITUTION.md`, **Tree**, add `scripts/jupyter.sh`; in **Runtime**, say `.venv` is created by `scripts/jupyter.sh` on macOS, Linux and Windows (Git Bash).
9. [x] Run `pnpm format:check` and `pnpm lint`: both pass. In `docs/specs/README.md`, set `jupyter-script` to `done`.
10. [ ] On Windows, in Git Bash, a person runs `pnpm jupyter` and `list-users.ipynb`.
        The table shows with its borders and accents.
