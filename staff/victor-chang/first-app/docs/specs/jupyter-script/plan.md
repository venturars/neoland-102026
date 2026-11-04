# Plan — Jupyter script

Tooling only. It adds no package and changes no notebook.

## Files

- Create: `scripts/jupyter.sh`, a POSIX `sh` script. Its comments are in English.
- Touch: `package.json`, the `jupyter` script becomes `"jupyter": "sh scripts/jupyter.sh"`.
- Touch: `docs/CONSTITUTION.md`
  - **Tree**: `scripts/` with `jupyter.sh  Prepares and opens the Jupyter client`.
  - **Runtime**, Python: `.venv` is created by `scripts/jupyter.sh`, run with `pnpm jupyter`, on macOS, Linux and Windows (Git Bash).
  - **Errors**, the client messages: add `Python 3 is required to start Jupyter.`, printed by `scripts/jupyter.sh` when there is no Python 3.
- Touch: `docs/specs/README.md`, the row `jupyter-script`.
- Not touched: `clients/jupyter/`, `logic/`, `queries/`, `db/`, `.gitignore` (the root one already ignores `.venv/`).

What `scripts/jupyter.sh` does, in order:

1. Moves to the app folder (the parent of `scripts/`), so it works from any current folder.
2. Detects Windows from `uname -s` (`MINGW*`, `MSYS*`, `CYGWIN*`) or `OS=Windows_NT`. The Python of the environment is `.venv/Scripts/python.exe` on Windows and `.venv/bin/python` elsewhere.
3. If that Python is missing, creates `.venv` with the first Python 3 it finds: `python3`, then `python` (on Windows: `python`, then `py -3`, then `python3`). With none, it prints `Python 3 is required to start Jupyter.` to stderr and exits with `1`. If `venv` fails, it exits with its code.
4. If `notebook` `7.6.3` is not installed in `.venv` (checked with `importlib.metadata.version`), installs it with `python -m pip install notebook==7.6.3`, running `ensurepip` first when `pip` is missing. A failure exits with its code.
5. Runs `PYTHONUTF8=1 exec <python> -m notebook clients/jupyter`. The kernels inherit `PYTHONUTF8`, so the Node output is read as UTF-8 on Windows.

An existing `.venv` on macOS already has `notebook` `7.6.3`, so it is reused as it is.

## Looks like

`scripts/jupyter.sh` of the reference app (`staff/ventura-rodriguez/first-app`). The steps are the same. The version and the folder are the ones of this app.

## Signature

None.

## SQL

None.

## Errors

| Failure in the spec        | Message                                  |
| -------------------------- | ---------------------------------------- |
| No Python 3                | `Python 3 is required to start Jupyter.` |
| `venv` or the install fail | The error of `venv` or `pip`, as it is   |

## Open questions

None.
