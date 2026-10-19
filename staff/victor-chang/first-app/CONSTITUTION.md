# Constitution — first-app

The non-negotiable structure of this app: **what** exists and **where** it lives. Rules on *how* to write code are in [AGENTS.md](AGENTS.md). If a change breaks a rule here, the architecture changes — update this file first.

## 1. Purpose and scope

User management CRUD. A user is `{ id, name, email }`, with `email` unique. The business logic must be consumable by any client: the terminal today, a JS frontend and Jupyter later.

## 2. Runtime and libraries

- Node.js 24+, ES modules (`"type": "module"` in `package.json`).
- **Zero npm dependencies.** Only Node built-ins:
  - `node:sqlite` — storage, allowed only in `db/` and `query/`.
  - `node:test` + `node:assert` — tests.
- Database file: `db/users.db`, git-ignored, created on first run.

## 3. Folder structure

```
first-app/
  logic/            use-cases, validation, errors — tech-agnostic
  query/            one file per database operation
    index.js        createQueries(db): bundles every query into one object
    safe.js         wraps queries, translates driver errors
  db/               database connection and schema (openDatabase)
  client/<name>/    one folder per consumer; composition root
    terminal/       argv CLI
```

| Folder | Owns | Must never |
|---|---|---|
| `logic/` | business rules, validation, error classes | import `node:*`, `db/` or `query/`; perform I/O |
| `query/` | SQL and row → plain object mapping | contain business rules |
| `db/` | opening the database, creating the schema | contain queries |
| `client/` | input parsing, wiring, output formatting | contain business rules or SQL |

## 4. Dependency direction

```
client ──► logic
   │         ▲ (receives `queries` by injection)
   ├──► query ──► db handle
   └──► db
```

- `logic/` only knows the `queries` object it is given.
- `query/` may import **only `logic/errors.js`** from `logic/`.
- Wiring `db → queries → logic` happens **only** in `client/<name>/`.

## 5. Boilerplate for a new feature

1. `query/<verb><Entity>.js` — the database operation, then register it in `query/index.js`.
2. `logic/<verb><Entity>.js` — the use-case, using `queries.<operation>`.
3. `client/<name>/` — expose it (e.g. a new terminal command).
4. Schema changes go in `db/sqlite.js`.

## 6. Data contract

- `query/` returns plain objects, arrays of plain objects, or `null` when a row is not found.
- `logic/` returns plain objects, or nothing (`undefined`) for deletes.

## 7. Error contract

Single source: `logic/errors.js`. Every app error extends `AppError`, which carries `code` (stable string), `details` (plain object) and the native `cause`.

| Class | `code` | `details` | Raised when |
|---|---|---|---|
| `ValidationError` | `VALIDATION` | `{ field }` | input is missing or malformed, including client arguments |
| `NotFoundError` | `NOT_FOUND` | `{ resource, id }` | the entity does not exist |
| `DuplicateError` | `DUPLICATE` | `{ field, value }` | a uniqueness rule would break |
| `SystemError` | `SYSTEM` | `{}` | database, driver or unexpected failure; original error in `cause` |

Layer responsibilities:

- `logic/` throws `ValidationError`, `NotFoundError`, `DuplicateError`.
- `query/` (through `safe.js`) turns SQLite UNIQUE violations into `DuplicateError` and any other driver error into `SystemError`. `AppError`s pass through untouched.
- `db/` lets connection and schema failures throw; clients treat them as `SYSTEM`.
- `client/` is the only layer that catches errors for output, at one top-level boundary.

Client mapping — every client must follow it:

| `code` | Terminal exit code | HTTP status (future) |
|---|---|---|
| `VALIDATION` | 2 | 400 |
| `NOT_FOUND` | 3 | 404 |
| `DUPLICATE` | 4 | 409 |
| `SYSTEM`, or any non-`AppError` | 1 | 500 |

Error output shape (terminal stderr, future HTTP body):

```json
{ "error": { "code": "NOT_FOUND", "message": "user not found", "details": { "resource": "user", "id": 9 } } }
```

A non-`AppError` is reported as `SYSTEM` with the message `unexpected error`. The stack and `cause` are shown only when `DEBUG=1`.
