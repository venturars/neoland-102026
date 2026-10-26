# Tasks — Jupyter client

1. [x] Run `pnpm add cli-table3@0.6.5 @colors/colors@1.6.1 openai@7.42.0 --save-exact`.
       `package.json` lists the three with exact versions; `pnpm-lock.yaml` has them.
2. [x] In `package.json`, add the `jupyter` script from the plan.
3. [x] Run `pnpm jupyter`. The first run creates `.venv` and installs `notebook` `7.6.3`.
       The browser shows the notebook interface on an empty `clients/jupyter/`. `git status` does not show `.venv/`.
4. [x] Create `clients/jupyter/list-users.ipynb` with the two cells of the plan.
       Run it: a table with one row per user, ordered by id.
5. [x] Create `clients/jupyter/get-user.ipynb`, with the steps of `clients/terminal/get-user.txt`.
       Run it: the practice user as a table, then `User not found`.
6. [x] Create `clients/jupyter/get-user-by-email.ipynb`, with the steps of its terminal client.
       Run it: the practice user as a table, then `User not found` and `Email is invalid`.
7. [x] Create `clients/jupyter/create-user.ipynb`, with the steps of its terminal client.
       Run it: the new user as a table, then `Email is already used`, `Name is empty` and `Email is invalid`.
8. [x] Create `clients/jupyter/update-user.ipynb`, with the steps of its terminal client.
       Run it: the user with the new name as a table, then `User not found` and `Name is empty`.
9. [x] Create `clients/jupyter/delete-user.ipynb`, with the steps of its terminal client.
       Run it: the `Returns no data.` table, then `User not found`.
10. [x] Create `clients/jupyter/count-users-by-gender.ipynb`, with the steps of its terminal client.
        Run it with Ollama running: a table with `women`, `men` and `genderUndefined`.
11. [x] Run `list-users.ipynb` again: the same rows as in step 4, so no practice user was left behind.
12. [x] Copy `list-users.ipynb` to a folder outside the repo and run it there: it prints `Cannot find first-app.`
        Delete the copy.
13. [x] Run `npx prettier --check .`. In `docs/specs/README.md`, set `jupyter-client` to `done`.
14. [x] Create `.prettierignore` with `.venv/` and `pnpm-lock.yaml`.
        Run `npx prettier --check .`: every file passes.
15. [x] In `.gitignore`, add `.ipynb_checkpoints/`.
        Open a notebook with `pnpm jupyter`: `git status` does not show `clients/jupyter/.ipynb_checkpoints/`.
