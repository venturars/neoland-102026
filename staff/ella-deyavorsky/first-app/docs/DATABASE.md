# Database

There is one database and one connection. The database is the file `src/db/users.sqlite`. Only `src/db/connection.js` opens it, and only the database program `src/db/server.js` imports that connection. No other file creates a second connection. The program also reads the `.sql` files.

The `users` table has one row per user:

- `id` — `INTEGER PRIMARY KEY`. SQLite assigns it when the user is created.
- `name` — `TEXT`. Required. SQLite does not enforce a `VARCHAR` length, so the name has no length code.
- `email` — `VARCHAR(64)`. Required, and only one user can have it. The logic rejects an email of 64 characters or longer, so the longest saved email is 63 characters.
- `created_at` — the date `YYYY-MM-DD HH:MM:SS`. SQL fills it with `datetime('now', 'localtime')`. Not with a JavaScript date.
- `updated_at` — the same date format. SQL fills it with `datetime('now', 'localtime')` when the row is created. Not with a JavaScript date. The update query sets it again each time the row changes.

Each SQL statement lives in its own `.sql` file under `src/db/queries/`. The database program reads those files. `src/queries/users.js` exports the functions, asks the program for each query with `fetch`, and contains no SQL. The query functions are `createUsersTable`, `insert`, `findById`, `findByEmail`, `findAll`, `findGmail`, `update`, and `remove`. Each function asks the program to run the `.sql` file with the same name in kebab-case. The query files rename `created_at` and `updated_at` to `createdAt` and `updatedAt` with `AS` in the SQL.

## Queries

SQL is the language that reads and writes the database. Each statement lives in one `.sql` file under `src/db/queries/`. The file that exports the functions is `src/queries/users.js`. It asks the database program for the query and contains no SQL.

The query functions are:

- `createUsersTable` runs `create-users-table.sql`.
- `insert` runs `insert.sql`. It takes an object.
- `findById(id)` runs `find-by-id.sql`. The id is a plain value.
- `findByEmail(email)` runs `find-by-email.sql`. The email is a plain value.
- `findAll` runs `find-all.sql`.
- `findGmail` runs `find-gmail.sql`. It takes nothing. It returns the users whose email contains `@gmail`, oldest id first. The text `@gmail` is fixed in the SQL, and `LIKE` ignores capitals.
- `update` runs `update.sql`. It takes an object.
- `remove(id)` runs `remove.sql`. The id is a plain value.

A query function does not use the same name as a function in `logic/`.

The SQL text lives only in `src/db/queries/`. `src/queries/users.js` asks the database program to run a query by its name. It does not contain a SQL string. The database program creates the table when it starts, so the table already exists when the first query arrives. `createUsersTable()` is still exported and can be called at any time. It does nothing if the table exists.

The database program, not `users.js`, decides how each query runs and what it returns. `users.js` only sends the request and returns the parsed answer. `remove` and `createUsersTable` return nothing. If the program is not running, or answers with an error, every function throws "The database failed.".

A file in `logic/` calls a function exported by `src/queries/users.js`. It does not read a `.sql` file. The query functions do not decide if a name or an email is valid. Those decisions stay in `logic/`. The one connection from `src/db/connection.js` belongs to the database program, not to the query functions.
