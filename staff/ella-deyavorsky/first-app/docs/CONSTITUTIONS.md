# Constitution

## Project

This app is for learning two things:

- Application logic: the rules that decide what is allowed.
- Spec-driven development (SDD): write the rules first, then write the code that follows them.

The app manages users. You can create a user, list users, find a user by email, find a user by id, update a user, and delete a user.

## Tree

Each folder has one job.

```text
first-app/
  logic/              the rules
  queries/
    users.js          reads each .sql file and exports the functions
    queries/          one .sql file per statement
  db/                 the database file and the code that opens it
  clients/terminal/   paste files you run by hand
  docs/               this explanation
```

- `logic/` decides if an action is allowed. It does not contain SQL.
- `queries/users.js` talks to the database. It does not decide if a name or an email is valid. The SQL text lives in `queries/queries/`.
- `db/` contains `connection.js`, which opens the database, and `users.sqlite`, which stores the users.
- `clients/terminal/` holds one `.txt` file per feature. You paste that file into the terminal while `first-app` is the current folder. The files are `create-users-table.txt`, `create-user.txt`, `list-users.txt`, `find-user-by-email.txt`, `find-user-by-id.txt`, `update-user.txt`, and `delete-user.txt`.
- `docs/` holds this file.

## Database

There is one database and one connection. The database is the file `db/users.sqlite`. Only `db/connection.js` opens it. No other file creates a second connection.

The `users` table has one row per user:

- `id` — `INTEGER PRIMARY KEY`. SQLite assigns it when the user is created.
- `name` — `TEXT`. Required. SQLite does not enforce a `VARCHAR` length, so the name has no length code.
- `email` — `VARCHAR(64)`. Required, and only one user can have it. The logic rejects an email of 64 characters or longer, so the longest saved email is 63 characters.
- `created_at` — the date `YYYY-MM-DD HH:MM:SS`. SQL fills it with `datetime('now', 'localtime')`. Not with a JavaScript date.
- `updated_at` — the same date format. SQL fills it with `datetime('now', 'localtime')` when the row is created. Not with a JavaScript date. The update query sets it again each time the row changes.

Each SQL statement lives in its own `.sql` file under `queries/queries/`. `queries/users.js` reads those files, exports the functions, and contains no SQL. The query functions are `createUsersTable`, `insert`, `findById`, `findByEmail`, `findAll`, `update`, and `remove`. Each function reads the `.sql` file with the same name in kebab-case. The query files rename `created_at` and `updated_at` to `createdAt` and `updatedAt` with `AS` in the SQL.

## Logic is not replaceable

The rules in `logic/` stay even if the database changes, or if a notebook or a web page is added later. The queries and the clients can be replaced. The logic cannot.

## One logic file per action

A new feature is a new file in `logic/`. Do not add a second feature to a file in `logic/` that already exists. A new query is a new function in `queries/users.js` and a new `.sql` file in `queries/queries/`. The file name is the function name in kebab-case.

Each action has its own file:

- `logic/create-user.js`
- `logic/list-users.js`
- `logic/find-user-by-email.js`
- `logic/find-user-by-id.js`
- `logic/update-user.js`
- `logic/delete-user.js`

Each file exports one function. The function is built in this order:

1. A function that takes input receives one object: `createUser({ name, email })`, `findUserByEmail({ email })`, `findUserById({ id })`, `updateUser({ id, name, email })`, or `deleteUser({ id })`. `listUsers()` takes nothing.
2. It cleans the input by calling `.trim()` on the string directly: `name.trim()`, `email.trim().toLowerCase()`. It does not test the type first. If `name` or `email` is missing, the `TypeError` is expected. Do not catch it. In `updateUser`, a field that is `undefined` is not cleaned, because it keeps its current value.
3. It checks the input, without the database: "The name is missing.", "The email is not valid.", "There is nothing to update."
4. It checks the business rules, with the queries it needs: "This email is already used.", "No user was found."
5. It applies the action with a function exported by `queries/users.js`.
6. It returns the result: only `id`, `name`, `email`, `createdAt`, `updatedAt`. No SQLite object leaves `logic/`.

`updateUser({ id, name, email })` can change the name, the email, or both. A field passed as `undefined` keeps its current value. If both are `undefined`, it throws "There is nothing to update."

A success returns the user directly, with `id`, `name`, `email`, `createdAt`, and `updatedAt`. List returns the array of users. Delete returns nothing. There is no `{ ok: true, user }` wrapper. A failure throws:

```js
throw new Error("The name is missing.");
```

## Errors

A failure throws an English sentence with `throw new Error(...)`. It is not returned inside an object. These are the only sentences:

- "The name is missing." — the name is empty or only spaces.
- "The email is not valid." — the email is not two parts around `@`, or it is 64 characters or longer.
- "This email is already used." — another user already has this email.
- "No user was found." — no user has this id, or no user has this email.
- "There is nothing to update." — an update was sent with no name and no email.
- "The database failed." — SQLite failed. Every call to `queries/` is wrapped in try/catch and throws this sentence instead. The original SQLite message stays hidden.

A new failure is added to this list before it is used in code.

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

## Specs

A new feature is a new folder in `docs/specs/`. The folder name is kebab-case, like `docs/specs/classifier/`. Each folder has three files, written in this order.

### spec.md

The person who decides the feature writes this file. They say what they want. They do not need to know how the code works.

It says what is asked, who will use it, who has access, examples of use, and what goes wrong. It does not name files, functions, or SQL.

### plan.md

This file says how the code will follow the spec. It does not list the work steps. Those belong in `tasks.md`.

Keep it short. It names:

- The files to add or change.
- The function in `logic/`, what it receives, what it returns, and which error sentences it throws.
- The query function and the `.sql` file, if the feature touches the database.
- The order inside the logic file: clean the input, check the input, check the business rules, apply the action, return the result.
- What stays as it is.

### tasks.md

The steps, in the order a person would do them. Each step does one thing and says its result. Each step is one line.

This environment is one pass: spec, plan, tasks, code. Do not rewrite the three files once the code works, and do not run the cycle again, unless a person asks. The work stops when the last step is done.
