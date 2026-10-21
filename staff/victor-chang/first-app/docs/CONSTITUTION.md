# Constitution — first-app

first-app is a small app to manage users (create, read, update, delete). It is built with AI following SDD. New features or functionalities do not start in the code: they go through `spec.md`, `plan.md` and `tasks.md`, and a human reads each one before going on.

How to write the code (naming, style, commands) is in [AGENTS.md](../AGENTS.md).

## Tree

```
first-app/
  db/
    connection.js       The only database connection
    schema.sql          The only place the tables are defined
    users.sqlite        The only database file (git-ignored)
  queries/
    queries/            SQL text, one .sql file per query
    users.js            Reads those files, prepares the SQL and runs it
  logic/
    create-user.js      One feature per file
    update-user.js
    delete-user.js
    list-users.js
    get-user.js
    get-user-by-email.js
    count-users-by-gender.js
    errors.js           The error classes
    validate-user.js    Input checks shared by several features
    validate-email.js
  clients/
    terminal/           First client. It is the manual test of each feature
  docs/
    CONSTITUTION.md     This file
    specs/
      <name>/
        spec.md         The business of the feature
        plan.md         What gets built
        tasks.md        The steps to build it
  AGENTS.md             How to write the code
```

- `db/` opens the database. No business rules.
- `queries/queries/` holds the SQL in `.sql` files. `queries/users.js` reads and runs them. No business rules.
- `logic/` is the core of the app. The business rules live here.
- `clients/terminal/` calls `logic/` and shows the result. It is the first client and the manual test of each feature.
- `docs/specs/<name>/` is one feature. `<name>` is the feature, in kebab-case, named like its `logic/` file.

## Runtime

- Node.js 24+, ES modules (`"type": "module"` in `package.json`).
- Zero npm dependencies. Only Node built-ins: `node:sqlite`, `node:fs`, `node:url`, and the global `fetch` for the local AI (Ollama).
- Tooling: Prettier, run through `npx`, default config, no config file.

## Specs

**spec.md is the business.** Read by whoever decides if the feature is what they want, without opening the code. It says what is asked, who uses it, what goes in, what comes out with an example, and which failure is seen. A failure names a message from **Errors**. It also says what is out of scope. It never names files, functions or SQL.

```
# <Feature name>
## What
## Who
## Input
## Output        with one example
## Failures      each one names a message from Errors
## Out of scope
```

**plan.md is the technique.** Read by whoever checks that the work fits this constitution. It says:

- which files are created and which are touched
- which `logic/` file it resembles, without pasting its code
- the signature: name, parameters and output
- the new SQL, with named parameters (`:id`, `:name`, `:email`)
- which message from **Errors** matches each failure in the spec

```
# Plan — <feature name>
## Files
## Looks like
## Signature
## SQL
## Errors
## Open questions
```

A new feature is a new file. If this constitution, the current code and the spec do not say the same thing, the question is written under **Open questions** and work stops there. No tasks and no code until it is answered.

**tasks.md is the steps**, in the order a person would do them. Each step opens one place, does one thing and leaves a result you can look at. A step is at most four lines. Tick `[x]` when it is done.

If the work changes an existing feature, its tasks keep the same grain: look at what exists, change one place, check.

The three files are short, concrete and deterministic. They add no complexity to reading them.

## Database

There is one database, `db/users.sqlite`, and one connection, the `db` exported by `db/connection.js`. No other database or connection is opened.

Table `users`, defined in `db/schema.sql`:

- `id` is `INTEGER PRIMARY KEY`. SQLite assigns it: 1, 2, 3…
- `name` is `TEXT NOT NULL`.
- `email` is `VARCHAR(64) NOT NULL UNIQUE`, saved trimmed and in lowercase.
- `createdAt` and `updatedAt` are `TEXT NOT NULL` with the date as `YYYY-MM-DD HH:MM:SS`, which is what `datetime('now', 'localtime')` returns. Both default to that value; an update sets `updatedAt` again.

## Logic is not replaced

`logic/` is not an adapter or a swappable layer. It is not replaced by another implementation, it is not turned into plugins, and its rules do not move to `queries/` or `clients/`.

Each feature is one file. A `logic/` file that already exists is not replaced to fit another task. A new feature is a new file.

## A logic file

One file, one exported function. The signature defines the name, the input and the output. There is no contract comment above the function.

The name is the action (`createUser`, `updateUser`, `deleteUser`, `listUsers`). Parameters go in the signature with their own name (`id`, `name`, `email`). The input is not grouped into one object when the values are already known.

The body follows this order and the steps are not mixed:

1. Validate the input parameters.
2. Check the other business rules.
3. Apply the business logic.
4. Shape the output and return a plain object.

A step with nothing to do is skipped. Each step starts with a short comment naming it.

`logic/` imports `queries/users.js` directly. It may call the local AI with `fetch`.

## Constants

A fixed value of the app is a constant. Its name is in capitals (`MODEL`, `DB_PATH`). A variable stays in camelCase.

## Errors

A failure is thrown with one of the classes in `logic/errors.js`. Each class has a `code`, the message is always one from this list, in English, and `details` says what failed.

Steps 1 and 2, when the input or a business rule fails:

| Message                 | Class             | `code`       | `details`                                                   |
| ----------------------- | ----------------- | ------------ | ----------------------------------------------------------- |
| `Name is empty`         | `ValidationError` | `VALIDATION` | `{ field: "name" }`                                         |
| `Email is invalid`      | `ValidationError` | `VALIDATION` | `{ field: "email" }`                                        |
| `Email is already used` | `DuplicateError`  | `DUPLICATE`  | `{ field: "email", value }`                                 |
| `User not found`        | `NotFoundError`   | `NOT_FOUND`  | `{ resource: "user", id }` or `{ resource: "user", email }` |

If SQLite or the AI fails, in any step, that error does not leave `logic/`. One of these is thrown instead, as a `SystemError` (`code` `SYSTEM`, `details` `{}`), with the original error as `cause`:

- `Could not create the user`
- `Could not update the user`
- `Could not delete the user`
- `Could not list the users`
- `Could not find the user`
- `Could not classify the users`

An error thrown in steps 1 and 2 passes through unchanged.

Step 4: if everything works, the function returns the shaped data. If the operation has no data, it returns nothing.

A new message is added to this list before any spec uses it.

## Queries

The SQL does not live inside the function that runs it.

- `queries/queries/` has one `.sql` file per query. It holds only the SQL text, with named parameters (`:id`, `:name`, `:email`).
- `queries/users.js` reads those files, prepares them with `db` and runs them. Its functions (`findAll`, `findById`, `findByEmail`, `insert`, `update`, `remove`) are reused from `logic/`. They do not catch errors.

## Clients

After a feature is done, its first client is `clients/terminal/<name>.txt`, named like the `logic/` file. It is the manual test of the feature.

- It is one block to paste into Git Bash, with `first-app` as the current folder.
- The block runs `node --no-warnings --input-type=module -e '...'`, imports the `logic/` function and prints the result with `console.log`.
- It also shows each failure of the spec that can be reached, printing `error.message`.
- Each step has a `//` comment saying what it does and what it prints.
- It uses the real `db/users.sqlite`. A practice user it creates is deleted at the end, so the block can be pasted again.
