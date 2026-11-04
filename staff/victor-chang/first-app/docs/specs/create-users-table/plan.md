# Plan — create the users table

## Files

- Touch: `queries/users.js`, adds `createUsersTable()`. It reads `db/schema.sql`, still the only place the tables are defined, and runs it with `db.exec`.
- Not touched: `db/connection.js`, which keeps running the schema when it opens the database. `db/schema.sql` already has `CREATE TABLE IF NOT EXISTS`, so running it twice changes nothing.
- Create: `clients/terminal/create-users-table.txt` and `clients/jupyter/create-users-table.ipynb`.
- Touch: `docs/ARCHITECTURE.md`: under **Clients**, the one exception: the `create-users-table` clients call `createUsersTable()` from `queries/users.js`, because it is a setup step with no business rules and no `logic/` file. `docs/DATABASE.md`: `createUsersTable` in the list of query functions. `docs/specs/README.md`.

## Looks like

The other functions of `queries/users.js`, with `db.exec` instead of `db.prepare`, because the schema is not a single statement with parameters. The clients look like the `delete-user` ones: the step returns no data.

## Signature

`createUsersTable()` → nothing.

## SQL

None new. Reuses `db/schema.sql`.

## Errors

| Spec failure            | Message                                                 |
| ----------------------- | ------------------------------------------------------- |
| table cannot be created | SQLite's own message. `queries/` does not catch errors. |

No message is added to `docs/ERRORS.md`, which is for `logic/`. The clients print `error.message`, as for any failure.

## Open questions

None. Answered on 2026-11-03: `createUsersTable()` lives in `queries/users.js` and runs `db/schema.sql`; `db/connection.js` keeps creating the table.
