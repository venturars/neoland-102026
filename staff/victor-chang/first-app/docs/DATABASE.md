# Database

There is one database, `db/users.sqlite`, and one connection, the `db` exported by `db/connection.js`. No other database or connection is opened.

Table `users`, defined in `db/schema.sql`:

- `id` is `INTEGER PRIMARY KEY`. SQLite assigns it: 1, 2, 3…
- `name` is `TEXT NOT NULL`.
- `email` is `VARCHAR(64) NOT NULL UNIQUE`, saved trimmed and in lowercase.
- `createdAt` and `updatedAt` are `TEXT NOT NULL` with the date as `YYYY-MM-DD HH:MM:SS`, which is what `datetime('now', 'localtime')` returns. Both default to that value; an update sets `updatedAt` again.

## Queries

The SQL does not live inside the function that runs it.

- `queries/queries/` has one `.sql` file per query. It holds only the SQL text, with named parameters (`:id`, `:name`, `:email`).
- `queries/users.js` reads those files, prepares them with `db` and runs them. Its functions (`findAll`, `findById`, `findByEmail`, `findByName`, `insert`, `update`, `remove`) are reused from `logic/`. They do not catch errors.
