# Database

There is one database and one connection. The database is the file `db/users.sqlite`. Only `db/connection.js` opens it. No other file creates a second connection.

The `users` table has one row per user:

- `id` — `INTEGER PRIMARY KEY`. SQLite assigns it when the user is created.
- `name` — `TEXT`. Required. SQLite does not enforce a `VARCHAR` length, so the name has no length code.
- `email` — `VARCHAR(64)`. Required, and only one user can have it. The logic rejects an email of 64 characters or longer, so the longest saved email is 63 characters.
- `created_at` — the date `YYYY-MM-DD HH:MM:SS`. SQL fills it with `datetime('now', 'localtime')`. Not with a JavaScript date.
- `updated_at` — the same date format. SQL fills it with `datetime('now', 'localtime')` when the row is created. Not with a JavaScript date. The update query sets it again each time the row changes.

Each SQL statement lives in its own `.sql` file under `queries/queries/`. `queries/users.js` reads those files, exports the functions, and contains no SQL. The query functions are `createUsersTable`, `insert`, `findById`, `findByEmail`, `findAll`, `update`, and `remove`. Each function reads the `.sql` file with the same name in kebab-case. The query files rename `created_at` and `updated_at` to `createdAt` and `updatedAt` with `AS` in the SQL.

## Queries

SQL is the language that reads and writes the database. Each statement lives in one `.sql` file under `queries/queries/`. The file that exports the functions is `queries/users.js`. It reads those files and contains no SQL.

The query functions are:

- `createUsersTable` reads `create-users-table.sql`.
- `insert` reads `insert.sql`. It takes an object.
- `findById(id)` reads `find-by-id.sql`. The id is a plain value.
- `findByEmail(email)` reads `find-by-email.sql`. The email is a plain value.
- `findAll` reads `find-all.sql`.
- `update` reads `update.sql`. It takes an object.
- `remove(id)` reads `remove.sql`. The id is a plain value.

A query function does not use the same name as a function in `logic/`.

The SQL text lives only in `queries/queries/`. `queries/users.js` reads a file and runs it. It does not contain a SQL string. Importing `queries/users.js` does not create the table. The table appears only when `createUsersTable()` is called.

`insert`, `findById`, `findByEmail`, and `update` use `.get()`. `findAll` uses `.all()`. `remove` uses `.run()` and returns nothing.

A file in `logic/` calls a function exported by `queries/users.js`. It does not read a `.sql` file. The query functions do not decide if a name or an email is valid. Those decisions stay in `logic/`. They use the one connection from `db/connection.js`.
