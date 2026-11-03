# Tasks — search users

1. [x] Create `queries/queries/search-users.sql`. In `queries/users.js`, add `search(text)`.
2. [x] Create `logic/search-users.js`: `validateName`, `search`, return plain objects.
3. [x] Write `clients/terminal/search-users.txt` and paste it in Git Bash.
       Three practice users; a piece in another case prints the two that contain it, ordered by name; `%` prints `[]`; spaces only print `Name is empty`. The practice users are deleted.
4. [x] Create `clients/jupyter/search-users.ipynb` with the steps of the terminal client, and run it.
       The same results, as tables.
5. [x] Add the new files to `docs/TREE.md` and `docs/ARCHITECTURE.md`, and `search` to `docs/DATABASE.md`.
6. [x] Run `pnpm format:check` and `pnpm lint`. In `docs/specs/README.md`, set `search-users` to `done`.
       Both pass.
