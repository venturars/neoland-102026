# Tasks — find users by name

1. [x] Create `logic/validate-name.js` with the name check of `logic/validate-user.js`. In `validate-user.js`, call `validateName`.
       Paste `clients/terminal/create-user.txt`: the same output, `Name is empty` included.
2. [x] Create `queries/queries/find-users-by-name.sql`. In `queries/users.js`, add `findByName(name)`.
3. [x] Create `logic/find-user-by-name.js`: `validateName`, `findByName`, return plain objects.
4. [x] Write `clients/terminal/find-user-by-name.txt` and paste it in Git Bash.
       Two practice users with the same name print, lowest id first; the name in lowercase prints `[]`; spaces only print `Name is empty`. Both practice users are deleted.
5. [x] Create `clients/jupyter/find-user-by-name.ipynb` with the steps of the terminal client, and run it.
       The same results, as tables.
6. [x] Add the new files to `docs/TREE.md` and `docs/ARCHITECTURE.md`, and `findByName` to `docs/DATABASE.md`.
7. [x] Run `pnpm format:check` and `pnpm lint`. In `docs/specs/README.md`, add `find-user-by-name` as `done`.
       Both pass.
