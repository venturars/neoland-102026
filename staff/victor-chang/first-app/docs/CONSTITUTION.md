# Constitution — first-app

The non-negotiable structure of this app: **what** exists and **where** it lives. Rules on _how_ to write code are in [AGENTS.md](../AGENTS.md). If a change breaks a rule here, the architecture changes — update this file first.

## 1. Purpose and scope

User management CRUD. A user is `{ id, name, email }`, with `email` unique. The business logic must be consumable by any client: practice `.txt` blocks for the terminal today, a JS frontend and Jupyter later.

## 2. Runtime and libraries

- Node.js 24+, ES modules (`"type": "module"` in `package.json`).
- **Zero npm dependencies.** Only Node built-ins:
  - `node:sqlite` — storage, allowed only in `db/` and `query/`.
  - `node:test` + `node:assert` — tests.
- Tooling: Prettier, run through `npx`, default config. It is not a dependency and has no config file.
- Terminal clients: the `sqlite3` command-line tool, run from Git Bash.
- Database files: `db/users.db` (app data) and `db/practice.db` (rebuilt by every terminal client), both git-ignored.
- Schema: `db/schema.sql` is the only place the tables are defined. `db/sqlite.js` and the terminal clients both load it.

## 3. Folder structure

```
first-app/
  logic/            use-cases, validation, errors — tech-agnostic
  query/            one file per database operation
    index.js        createQueries(db): bundles every query into one object
    safe.js         wraps queries, translates driver errors
  db/               database connection (openDatabase) and schema (schema.sql)
  client/<name>/    one folder per consumer
    terminal/       one .txt practice block per feature
  specs/<use-case>/ spec.md, plan.md, tasks.md for each feature (section 10)
  test/             mirrors the code folders: test/logic, test/query, test/client
  docs/             project-level documents (this constitution)
  AGENTS.md         how to write code; stays at the root so agents find it
```

| Folder    | Owns                                             | Must never                                      |
| --------- | ------------------------------------------------ | ----------------------------------------------- |
| `logic/`  | business rules, validation, error classes        | import `node:*`, `db/` or `query/`; perform I/O |
| `query/`  | SQL and row → plain object mapping               | contain business rules                          |
| `db/`     | opening the database, the schema in `schema.sql` | contain queries                                 |
| `client/` | how a consumer reaches the app                   | contain business rules                          |
| `specs/`  | what each feature does, how and in which steps   | disagree with this constitution or the code     |
| `test/`   | one test per spec scenario                       | be imported by app code                         |

## 4. Dependency direction

```
JS client (future) ──► logic
   │                     ▲ (receives `queries` by injection)
   ├──► query ──► db handle
   └──► db
```

- `logic/` only knows the `queries` object it is given.
- `query/` may import **only `logic/errors.js`** from `logic/`.
- Wiring `db → queries → logic` happens **only** in a JS client (`client/<name>/`) or in tests.
- Terminal clients import nothing: they run SQL with `sqlite3` against `db/schema.sql`.

## 5. Boilerplate for a new feature

0. `specs/<use-case>/` (spec.md → plan.md → tasks.md, section 10), then `test/<layer>/<use-case>.test.js`.
1. `query/<verb>-<entity>.js` — the database operation, then register it in `query/index.js`.
2. `logic/<verb>-<entity>.js` — the use-case, using `queries.<operation>`.
3. `client/terminal/<use-case>.txt` — once `npm test` passes, the feature's first client (see section 8).
4. Schema changes go in `db/schema.sql`.

## 6. Data contract

- SQL in `query/` uses named parameters (`:id`, `:name`, `:email`), bound from an object: `.get({ id })`.
- `query/` returns plain objects, arrays of plain objects, or `null` when a row is not found.
- `logic/` returns plain objects, or nothing (`undefined`) for deletes.

## 7. Error contract

Single source: `logic/errors.js`. Every app error extends `AppError`, which carries `code` (stable string), `details` (plain object) and the native `cause`.

| Class             | `code`       | `details`                               | Raised when                                                        |
| ----------------- | ------------ | --------------------------------------- | ------------------------------------------------------------------ |
| `ValidationError` | `VALIDATION` | `{ field }`                             | input is missing or malformed                                      |
| `NotFoundError`   | `NOT_FOUND`  | `{ resource, <key> }` (`id` or `email`) | the entity does not exist; `<key>` is the field used to look it up |
| `DuplicateError`  | `DUPLICATE`  | `{ field, value }`                      | a uniqueness rule would break                                      |
| `SystemError`     | `SYSTEM`     | `{}`                                    | database, driver or unexpected failure; original error in `cause`  |

Layer responsibilities:

- `logic/` throws `ValidationError`, `NotFoundError`, `DuplicateError`.
- `query/` (through `safe.js`) turns SQLite UNIQUE violations into `DuplicateError` and any other driver error into `SystemError`. `AppError`s pass through untouched.
- `db/` lets connection and schema failures throw; JS clients treat them as `SYSTEM`.
- A JS client is the only layer that catches errors for output, at one top-level boundary.

JS client mapping — every future JS client must follow it:

| `code`                          | HTTP status |
| ------------------------------- | ----------- |
| `VALIDATION`                    | 400         |
| `NOT_FOUND`                     | 404         |
| `DUPLICATE`                     | 409         |
| `SYSTEM`, or any non-`AppError` | 500         |

Error output shape (HTTP body):

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "user not found",
    "details": { "resource": "user", "id": 9 }
  }
}
```

A non-`AppError` is reported as `SYSTEM` with the message `unexpected error`; the stack and `cause` are never sent to the consumer.

## 8. Terminal clients (`.txt` practice blocks)

After a feature is complete (spec written, `npm test` passing), its **first client** is a `.txt` file in `client/terminal/`. Its job is to practice the feature's query by hand. It is not JavaScript and is never wrapped in JS.

- **Name:** `client/terminal/<use-case>.txt`, matching the `logic/` file (`get-user-by-email.txt` for `logic/get-user-by-email.js`).
- **Where it runs:** pasted as one block into Git Bash, with `first-app` as the current folder.
- **Content, in this order:**
  1. A comment naming the feature and the `query/` file it practices.
  2. A fresh practice database: `DB=db/practice.db`, `rm -f $DB`, `sqlite3 $DB < db/schema.sql`.
  3. Seed rows, only if the query needs existing data.
  4. The query itself: the same SQL as the `query/` file, with literal values in place of `?`.
  5. A `SELECT` showing the result when the query changes data, and at least one failing or empty case when there is one (missing id, duplicate email...).
- **Every step has a `#` comment** saying what it does and what to expect, written for a junior.
- **Never touches `db/users.db`.**
- No tests: the block is checked by running it.

## 9. Errors

The only messages a user can see. Specs and plans name failures with these exact messages. A new message is added here first.

| Message                         | Code         | Details                                                     | When                                |
| ------------------------------- | ------------ | ----------------------------------------------------------- | ----------------------------------- |
| `name is required`              | `VALIDATION` | `{ field: "name" }`                                         | name missing or blank               |
| `email is invalid`              | `VALIDATION` | `{ field: "email" }`                                        | email missing or without `@`        |
| `user not found`                | `NOT_FOUND`  | `{ resource: "user", id }` or `{ resource: "user", email }` | no user with that id or email       |
| `email already exists`          | `DUPLICATE`  | `{ field: "email", value }`                                 | another user already has that email |
| `database error`                | `SYSTEM`     | `{}`                                                        | the database failed                 |
| `unexpected error`              | `SYSTEM`     | `{}`                                                        | any other failure (JS clients only) |
| `users could not be classified` | `SYSTEM`     | `{}`                                                        | the gender AI did not respond       |

## 10. Specs

Every feature has a folder `specs/<use-case>/`, named like its `logic/` file, with three files. Write them in this order. Keep them short, concrete and deterministic: one fact per line, no explanations that the reader does not need.

**spec.md — the business.** Read by whoever decides if the feature is what they want, without opening the code. It never names files, functions or SQL.

```
# <Feature name>
## What        what is asked, in one or two lines
## Who         who uses it
## Input       what goes in
## Output      what comes out, with one example
## Failures    each failure, named with a message from section 9
## Examples    table: ID | Given | When | Then
## Out of scope
```

- Example IDs are a prefix plus a number (`CU-1`). Each ID has exactly one test whose name starts with it. IDs are never reused.

**plan.md — the technique.** Read by whoever checks that the work fits this constitution.

```
# Plan — <feature name>
## Files           files created / files touched
## Looks like      the logic/ file it resembles (name it, do not paste it)
## Signature       name, parameters, output
## SQL             new SQL with named parameters, or "none"
## Errors          spec failure → message (section 9) → code
## Tests           test file and example IDs
## Open questions  empty means go ahead
```

- A new feature is a new file.
- If this constitution, the current code and the spec do not say the same thing, write the question under **Open questions** and stop. No tasks and no code until it is answered.

**tasks.md — the steps**, in the order a person would do them.

```
# Tasks — <feature name>
1. [ ] <one place, one action, one result you can check>
```

- Each step opens one place, does one thing and leaves a result you can look at.
- A step is at most four lines.
- Work that is not a new feature keeps the same grain: look at what exists, change one place, check.
- Tick `[x]` when a step is done.
