# Tasks — move the code into src

Do the tasks in order. Inside a task, do the steps in order.

There is no query change, no logic change and no new file.

## Task 1 — Update the guides

- [ ] In `docs/TREE.md`, put `clients/`, `db/`, `queries/` and `logic/` inside a `src/` folder. Result: the tree shows `src/`.
- [ ] In `docs/ARCHITECTURE.md`, say in the layers that the four folders are inside `src/`. Result: the layer list names `src/`.
- [ ] In `docs/ARCHITECTURE.md`, change the headings of the four file lists to `src/logic/`, `src/queries/`, `src/db/` and `src/clients/`. Result: the headings match the tree.
- [ ] In `docs/DATABASE.md`, change each path to `src/db/` or `src/queries/`. Result: no path points to the old place.
- [ ] In `docs/ERRORS.md`, change the path in the database sentence to `src/queries/`. Result: no path points to the old place.
- [ ] In `docs/STYLE.md`, change `clients/terminal` to `src/clients/terminal`. Result: no path points to the old place.
- [ ] In `AGENTS.md`, change each folder path to `src/`. Result: the guide names the new place.

## Task 2 — Move the folders

- [ ] Run `git mv` to move `logic` to `src/logic`. Result: the logic is inside `src/`.
- [ ] Run `git mv` to move `queries` to `src/queries`. Result: the queries are inside `src/`.
- [ ] Run `git mv` to move `clients` to `src/clients`. Result: the clients are inside `src/`.
- [ ] Move `db` to `src/db` and keep `db/users.sqlite` with it. Result: the database file is in `src/db/`.

## Task 3 — Update the project files

- [ ] In `package.json`, change the three paths of `format` to `src/`. Result: `pnpm format` reads the moved files.
- [ ] In `.gitignore`, change `db/users.sqlite` to `src/db/users.sqlite`. Result: the database stays untracked.
- [ ] In `scripts/jupyter.sh`, change the folder it launches to `src/clients/jupyter`. Result: the notebooks open from the new place.

## Task 4 — Update the clients

- [ ] In each file in `src/clients/terminal/`, change the import path to start with `./src/`. Result: the eight files point to the new place.
- [ ] In each notebook in `src/clients/jupyter/`, change the import path to start with `./src/`. Result: the nine notebooks point to the new place.
- [ ] In each notebook that has `cwd="../.."`, change it to `cwd="../../.."` and fix the comment. Result: Node starts in `first-app`.
- [ ] In each notebook cell that names `db/users.sqlite`, write `src/db/users.sqlite`. Result: the text matches the tree.
- [ ] In `src/clients/jupyter/README.md`, change each path to `src/`. Result: the README matches the tree.

## Task 5 — Run it

- [ ] From `first-app`, paste `src/clients/terminal/list-users.txt` in the terminal. Result: it prints the users, or the empty message.
- [ ] Run `pnpm format`. Result: it finishes without errors.
- [ ] Run `pnpm lint`. Result: it finishes without errors.
- [ ] Run `git status` and check that `clients`, `db`, `queries` and `logic` are not at the top. Result: they are only inside `src/`.
- [ ] Stop. Do not change the three spec files again. Result: the one-pass cycle is done.
