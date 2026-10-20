# Tasks — align with the new constitution

1. [x] Rewrite `docs/CONSTITUTION.md` with the new sections.
2. [x] Add `createdAt`, `updatedAt` to `db/schema.sql`; replace `db/sqlite.js` with `db/connection.js`.
3. [x] Create the six `.sql` files and `queries/users.js`. Delete `query/`.
4. [x] Rewrite each `logic/*.js`: plain parameters, direct import of `queries/users.js`, 4 steps, new messages.
5. [x] Copy the 21 local users from `db/users.db` into `db/users.sqlite`; delete `users.db`.
6. [x] Move `client/` to `clients/`; rewrite each `.txt` as a `node` block. Paste each one: outputs match their comments.
7. [x] Delete `test/` and the `test` script.
8. [x] Move `specs/` to `docs/specs/`; rewrite each feature's spec, plan and tasks; delete `database-errors/`.
9. [x] Update `AGENTS.md`. Run `npx prettier --check .`: clean.
