# Database and queries

## Connection and SQL files

`db/connection.js` opens one module-relative `db/users.sqlite` file using
`dirname(fileURLToPath(import.meta.url))` and `join(directory, 'users.sqlite')`
and exports one connection as `db`. SQLite creates the database file when needed;
opening the connection does not initialize the users table.

`queries/queries/*.sql` contain only SQL statements. `queries/users.js` reads each
SQL file once at module load with `readFileSync`, UTF-8 encoding, and paths built
with `dirname(fileURLToPath(import.meta.url))` and `join()`. It executes concrete
queries, using named parameters where values are supplied.

## Schema and query results

Initialization is explicit: `createUsersTable()` executes `CREATE TABLE IF NOT EXISTS users` and returns `undefined`. Repeating it preserves existing records.

| Column | Definition |
| --- | --- |
| `id` | `INTEGER PRIMARY KEY` |
| `name` | `TEXT NOT NULL` |
| `email` | `VARCHAR(64) NOT NULL UNIQUE` |
| `createdAt` | `TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))` |
| `updatedAt` | `TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))` |

Timestamps are SQLite local-time text, formatted `YYYY-MM-DD HH:MM:SS`, with second precision. Insertion uses both defaults. The update query preserves `createdAt` and sets `updatedAt` with `datetime('now', 'localtime')`, including for empty changes. Two operations in the same second can have equal timestamps. SQLite does not enforce the declared `VARCHAR(64)` length; business logic applies the JavaScript length check.

The concrete query functions are:

| Function | Execution and return |
| --- | --- |
| `createUsersTable()` | `db.exec()`; returns `undefined` |
| `findByName(name)` | `.all({ name })`; exact case-sensitive matches in ascending ID order |
| `findByEmail(email)` | `.get({ email })`; matching SQLite row or `undefined` |
| `insert({ name, email })` | `INSERT ... RETURNING *` with `.get()`; inserted row |
| `findAll()` | `SELECT * FROM users ORDER BY id` with `.all()`; rows in ascending ID order |
| `findById(id)` | `.get({ id })`; matching row or `undefined` |
| `update({ id, name, email })` | `UPDATE ... RETURNING *` with `.get()`; updated row when matched |
| `remove(id)` | `.run({ id })`; returns SQLite execution metadata (`changes` and `lastInsertRowid`) |

Queries perform no business validation or printing. The ID query is reused by public ID lookup, update, and delete.


## SQL file for each query

Paths below are relative to `queries/queries/`.

| Query | SQL file | Named parameters |
| --- | --- | --- |
| `createUsersTable()` | `create-users-table.sql` | None |
| `findByName(name)` | `find-by-name.sql` | `:name` |
| `findByEmail(email)` | `find-by-email.sql` | `:email` |
| `insert({ name, email })` | `insert.sql` | `:name`, `:email` |
| `findAll()` | `find-all.sql` | None |
| `findById(id)` | `find-by-id.sql` | `:id` |
| `update({ id, name, email })` | `update.sql` | `:id`, `:name`, `:email` |
| `remove(id)` | `remove.sql` | `:id` |

The [constitution](CONSTITUTIONS.md#public-business-operations) defines business
validation and the public results built from these query results.
