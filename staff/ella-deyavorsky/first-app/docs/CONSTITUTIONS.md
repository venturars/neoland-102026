# Constitution

## Project

This app is for learning two things:

- Application logic: the rules that decide what is allowed.
- Spec-driven development (SDD): write the rules first, then write the code that follows them.

The app manages users. You can create a user, list users, update a user, and delete a user.

## Tree

Each folder has one job.

```text
first-app/
  logic/              the rules
  queries/            the SQL
  db/                 the database file and the code that opens it
  clients/terminal/   paste files you run by hand
  docs/               this explanation
```

- `logic/` decides if an action is allowed. It does not contain SQL.
- `queries/` talks to the database. It does not decide if a name or an email is valid.
- `db/` contains `connection.js`, which opens the database, and `users.sqlite`, which stores the users.
- `clients/terminal/` holds one `.txt` file per feature. You paste that file into the terminal while `first-app` is the current folder. The files are `create-users-table.txt`, `create-user.txt`, `list-users.txt`, `update-user.txt`, and `delete-user.txt`.
- `docs/` holds this file.

## Database

The database is SQLite. SQLite keeps the data in one file: `db/users.sqlite`. You do not write that file by hand. `db/connection.js` opens it.

The `users` table has one row per user:

- `id` — a number. SQLite assigns it when the user is created.
- `name` — the user's name. Required.
- `email` — the user's email. Required, and only one user can have it.
- `created_at` — when the row was created. SQLite sets it.
- `updated_at` — when the row was last changed. SQLite sets it.

In the logic files these last two names are `createdAt` and `updatedAt`.

## Logic is not replaceable

The rules in `logic/` stay even if the database changes, or if a notebook or a web page is added later. The queries and the clients can be replaced. The logic cannot.

## One logic file per action

Each action has its own file:

- `logic/create-user.js`
- `logic/list-users.js`
- `logic/update-user.js`
- `logic/delete-user.js`

Each file exports one function. The function is built in this order:

1. It receives one input object, such as `{ name, email }` or `{ id }`.
2. It checks the rules.
3. It calls a function in `queries/user.js`.
4. It returns a result.

A success looks like `{ ok: true, user }`. A failure looks like `{ ok: false, error: "EMPTY_NAME" }`. List returns the users.

## Errors

A failure uses a short code, not a long sentence.

- `EMPTY_NAME` — the name is missing or only spaces.
- `INVALID_EMAIL` — the email is not two parts around `@`, or it is 64 characters or longer.
- `EMAIL_ALREADY_USED` — another user already has this email.
- `USER_NOT_FOUND` — no user has this id.
- `NOTHING_TO_UPDATE` — an update was sent with no name and no email.

A new failure is added to this list before it is used in code.

## Queries

`queries/user.js` is the only file with SQL. SQL is the language that reads and writes the database.

That file can save, find, list, update, and remove rows. It does not decide if a name or an email is valid. Those decisions stay in `logic/`.
