# Database and queries

## Service and query modules

`src/db/server.js` owns the SQLite connection and opens the module-relative
`src/db/users.sqlite`. Run it with `pnpm server` before using clients. Opening
this connection does not create the users table.

`src/queries/queries/*.js` export SQL text. `src/queries/users.js` imports it and
sends `{ method, sql, params }` to `POST http://127.0.0.1:3000/execute` using native
fetch. The server executes exec/get/all/run with bound parameters. It accepts the CORS
preflight needed by the file-based web client; HTML, CSS and JavaScript load from
disk through `pnpm web`. This unauthenticated service is for local use only.

Query functions are async; callers await their results. A missing single row
travels as null and is returned by queries as undefined. Lists remain arrays.
The preparation query `listTables()` returns the existing sqlite_master listing.

## Schema and query results

Initialization is explicit: `createUsersTable()` executes `CREATE TABLE IF NOT EXISTS users` and resolves to `undefined`. Repeating it preserves existing records.

| Column | Definition |
| --- | --- |
| `id` | `INTEGER PRIMARY KEY` |
| `name` | `TEXT NOT NULL` |
| `email` | `VARCHAR(64) NOT NULL UNIQUE` |
| `createdAt` | `TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))` |
| `updatedAt` | `TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))` |

Timestamps are SQLite local-time text, formatted `YYYY-MM-DD HH:MM:SS`, with second precision. Insertion uses both defaults. The update query preserves `createdAt` and sets `updatedAt` with `datetime('now', 'localtime')`, including for empty changes. Two operations in the same second can have equal timestamps. SQLite does not enforce the declared `VARCHAR(64)` length; business logic applies the JavaScript length check.

The concrete query functions resolve to the following values:

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

`listTables()` resolves to table-name rows for explicit preparation.

Queries perform no business validation or printing. The ID query is reused by public ID lookup, update, and delete.


## SQL module for each query

Paths below are relative to `src/queries/queries/`.

| Query | SQL module | Named parameters |
| --- | --- | --- |
| `createUsersTable()` | `create-users-table.js` | None |
| `findByName(name)` | `find-by-name.js` | `:name` |
| `findByEmail(email)` | `find-by-email.js` | `:email` |
| `insert({ name, email })` | `insert.js` | `:name`, `:email` |
| `findAll()` | `find-all.js` | None |
| `findById(id)` | `find-by-id.js` | `:id` |
| `update({ id, name, email })` | `update.js` | `:id`, `:name`, `:email` |
| `remove(id)` | `remove.js` | `:id` |
| `listTables()` | `list-tables.js` | None |

The [constitution](CONSTITUTIONS.md#public-business-operations) defines business
validation and the public results built from these query results.
