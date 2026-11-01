# Tasks — Jupyter client, one notebook per feature

Do the tasks in order. Inside a task, do the steps in order.

## Task 1 — Update the constitution

- [ ] Add the line `clients/jupyter/` to the tree in `docs/CONSTITUTIONS.md`. Result: the tree lists the new client.

## Task 2 — Get the outside tools ready

- [ ] Run `ollama list`. Result: `llama3.2:latest` is listed.
- [ ] Add `cli-table3` `0.6.5` with pnpm. Result: it is in `package.json` and `pnpm-lock.yaml`.
- [ ] Add `.ipynb_checkpoints/` to the root `.gitignore`. Result: the checkpoint folders are not tracked.
- [ ] Add the script `jupyter` to `package.json`. Result: `pnpm jupyter` creates `.venv`, installs `notebook` when missing, and starts Notebook on `127.0.0.1:8888`.
- [ ] Run `pnpm jupyter` once and stop it. Result: `.venv` has `jupyter-notebook` and the server started.

## Task 3 — Write the client

- [ ] Create `clients/jupyter/README.md`. Result: start, open, kernel, busy port, and stop are explained.
- [ ] Create `clients/jupyter/prepare-database.ipynb`. Result: the technical step is explained and runs.
- [ ] Create `clients/jupyter/create-user.ipynb`. Result: two cells, and they run.
- [ ] Create `clients/jupyter/list-users.ipynb`. Result: two cells, and they run.
- [ ] Create `clients/jupyter/find-user-by-id.ipynb`. Result: two cells, and they run.
- [ ] Create `clients/jupyter/find-user-by-email.ipynb`. Result: two cells, and they run.
- [ ] Create `clients/jupyter/update-user.ipynb`. Result: two cells, and they run.
- [ ] Create `clients/jupyter/delete-user.ipynb`. Result: two cells, and they run.
- [ ] Create `clients/jupyter/count-users-by-gender.ipynb`. Result: two cells, and they run.
- [ ] Create `clients/jupyter/00-welcome-and-index.ipynb`. Result: the app is explained and every notebook is linked.

## Task 4 — Run it

- [ ] Run every notebook top to bottom with `jupyter nbconvert --execute`, on a copy of the app so the real database stays as it is. Result: no cell fails.
- [ ] Check `git status`. Result: `db/users.sqlite` did not change.
- [ ] Stop. Result: the one-pass cycle is done.
