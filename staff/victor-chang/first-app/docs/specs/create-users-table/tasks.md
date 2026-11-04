# Tasks — create the users table

1. [x] In `queries/users.js`, add `createUsersTable()`, reading `db/schema.sql` and running it with `db.exec`.
2. [x] Write `clients/terminal/create-users-table.txt` and paste it in Git Bash.
       It prints the saved users, then the same users after running it a second time.
3. [x] In a copy of the app outside the repo, drop the `users` table and run `createUsersTable()`.
       `listUsers()` prints `[]`. Delete the copy.
4. [x] Create `clients/jupyter/create-users-table.ipynb` with the steps of the terminal client, and run it.
       The `Returns no data.` table, then the users table, twice.
5. [x] In `docs/ARCHITECTURE.md`, add the client exception and the two client files; in `docs/DATABASE.md`, add `createUsersTable`.
6. [x] Run `pnpm format:check` and `pnpm lint`. In `docs/specs/README.md`, add `create-users-table` as `done`.
       Both pass.
