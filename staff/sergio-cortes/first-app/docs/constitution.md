# Constitution — AI-USER-DB

Normative reference for **how this codebase is structured and extended**. It is not a catalog of every function.

There are no separate spec files. Update this document when **cross-cutting** rules change (layers, modules, errors, process), when the **project tree** changes, or when **database setup** (path, connection, core table shape) changes.

## Purpose of the project

Node.js application with SQLite (`node:sqlite`). Separate **persistence**, **business behavior**, and **delivery** (terminal scripts today). The codebase should stay easy to search: one intent per module, predictable layer flow.

## Project tree

Runtime data (not in git): `data/users.sqlite` (see `.gitignore`).

Update this tree when adding or removing folders or modules at any layer.

```
AI-USER-DB/
├── package.json
├── AGENTS.MD
├── docs/
│   └── constitution.md
├── db/
│   └── connection.js
├── queries/
│   ├── _shared/
│   │   ├── normalize-email.js
│   │   └── rethrow-unique-email-conflict.js
│   ├── user-create-table.js
│   ├── user-insert.js
│   ├── user-update-by-id.js
│   ├── user-delete-by-id.js
│   ├── user-find-by-id.js
│   ├── user-find-by-email.js
│   └── user-list.js
├── logic/
│   ├── index.js
│   ├── create-user.js
│   ├── update-user.js
│   ├── delete-user.js
│   ├── list-users.js
│   ├── validation.js
│   ├── errors.js
│   └── user-dto.js
└── clients/
    └── terminal/
        ├── comandos.txt
        ├── _shared/
        │   ├── print.js
        │   └── handle-client-error.js
        ├── create-table/
        │   ├── create-table.js
        │   └── create-table.txt
        ├── create-user/
        │   ├── create-user.js
        │   └── create-user.txt
        ├── list-users/
        │   ├── list-users.js
        │   └── list-users.txt
        ├── update-user/
        │   ├── update-user.js
        │   └── update-user.txt
        └── delete-user/
            ├── delete-user.js
            └── delete-user.txt
```

## Architecture

Dependencies flow **inward**: clients → logic → queries → db. Lower layers must not import upper layers.

| Layer       | Role                   | May                                                                                                          | Must not                                                               |
| ----------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **db**      | Database connection(s) | Expose shared connection                                                                                     | Contain SQL for features, business rules                               |
| **queries** | Persistence            | SQL, parameters, read/write rows, storage normalization, map DB/driver failures to **technical** error codes | Validate user input, throw domain error classes, orchestrate use cases |
| **logic**   | Application behavior   | Validation, use-case orchestration, DTOs, domain errors, translate technical errors from queries             | SQL, terminal I/O                                                      |
| **clients** | Entry points           | Parse/run script input, call logic or DDL queries, format output/errors                                      | Business rules, SQL                                                    |

Terminal layout: one folder per runnable action under `clients/terminal/`, plus `_shared/` for client-only helpers (e.g. printing).

## Module conventions (every layer)

- **One file per intent**, **one exported function per file**, **one coherent step per function**.
- **Each capability is its own file.** Do not repurpose an existing module to implement a different feature (for example, do not reshape an existing `logic/` use-case file to “fit” a new task). A new capability → a **new file**, then update the project tree.
- **Kebab-case file and folder names** (logic, queries, `clients/terminal/`, etc.) must state the **action** in plain, intuitive terms—grep-friendly, no abbreviations that hide intent (e.g. `create-user.js`, `user-find-by-id.js`, `create-user/`).
- **Exported function names** are camelCase, verb-led, and match the same action as the file (the name is what it does).
- Do not add unrelated behavior to an existing module. If that would mix concerns, add a new module instead.
- Helpers used only inside one layer go in that layer’s `_shared/`, with the same one-export-per-file rule.
- If unsure where code belongs, agree on placement **before** editing.

When adding a feature, split work by layer: new persistence → new query module; new rules or workflow → logic (validation and/or use case); new way to run it → new client script.

When changing behavior, touch only the layer that owns that concern; keep diffs minimal. Extending an **existing** capability may edit its file; introducing a **new** capability always adds a file.

## Validation and business rules (general)

- Input and domain rules live in **logic** (dedicated validation modules and/or use-case modules).
- Use cases compose validation, queries, and DTO mapping; they decide outcomes (success shape, which error to throw).
- Do not duplicate business rules in queries or clients.
- Persistence-only normalization (e.g. format stored for indexing) belongs in **queries**, not validation.

## Data and schema (general)

- Table/index DDL lives in **query** modules (one intent per module, same as other queries).
- Schema changes are implemented in query/DDL modules and reflected in the persistence code that uses them; do not embed business meaning in column defaults beyond storage needs.
- Shapes exposed to clients are mapped in **logic** (DTOs), not raw DB rows leaked from queries through use cases without an explicit mapping step when the project already uses DTOs.

## Database

There is a single database file: `data/users.sqlite` (gitignored). There is a single connection: the `db` export from `db/connection.js`. Do not open another database file or create additional connections.

Table `users` (DDL in `queries/user-create-table.js`):

- `id` is `INTEGER PRIMARY KEY AUTOINCREMENT`. SQLite assigns 1, 2, 3, …
- `email` is `VARCHAR(64) NOT NULL UNIQUE`.
- `name` is `TEXT NOT NULL`.
- `createdAt` and `updatedAt` store timestamps as `TEXT` in `YYYY-MM-DD HH:MM:SS` form. SQLite has no dedicated `DATE` type; defaults use `datetime('now', 'localtime')`, which produces that format.

## Errors

Two layers of errors:

1. **Domain errors (logic)** — Expected failure modes for callers. Defined in `logic/errors.js` as a **small set of global types** (not one class per scenario). Each subclasses `Error` with stable `name`, string **`code`**, and English **`message`**. Use **`message`** for the specific reason; do not add new error classes for individual fields or resources.
2. **Technical errors (queries)** — Infrastructure or constraint failures close to the DB. Use plain `Error` (or similar) with a stable string **`code`** that logic recognizes. Logic **translates** these into domain errors; clients do not interpret DB codes.

### Global domain error types (`logic/errors.js`)

| Type                | `code`       | When to use                                                                                       |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| **ValidationError** | `VALIDATION` | Input or parameters are missing, malformed, or out of allowed bounds (including invalid ids).     |
| **NotFoundError**   | `NOT_FOUND`  | A requested entity or record does not exist.                                                      |
| **ConflictError**   | `CONFLICT`   | An operation conflicts with current state, uniqueness, or a business rule (e.g. duplicate email). |

Examples: empty name → `ValidationError("Name is empty")`; missing user → `NotFoundError("User not found")`; duplicate email → `ConflictError("Email is already used")`.

Logic may expose helpers (e.g. `translateQueryError`) that map **technical** query codes to the appropriate global domain type.

Rules:

- Queries do not import or throw domain error classes.
- Logic does not swallow unknown errors; unexpected errors propagate.
- Do **not** add domain error types beyond the global set above unless there is a clear, reusable category for it, otherwise reuse the matching type and a clear `message`.

### Global error handling (clients)

Clients are the **edge**: they do not implement business rules. On success, print the result (e.g. JSON). On failure, route **any** thrown value through a **single shared client helper** that:

- Emits a consistent JSON shape (`error` / `name`, `message`, `code` when present),
- Sets a non-zero exit code,

so every script behaves the same at the boundary. Logic and queries **throw**; clients **catch and print**—no duplicate formatting in each script.

New terminal scripts must use the shared client error helper, not ad hoc `console.error` formats.

## Documentation and change process (SDD)

1. Read this constitution before implementing.
2. Implement patterns here plus explicit task/user instructions. Do not invent requirements or layers not covered by either.
3. Update this file when **patterns** change, the **project tree** changes, or **database setup** changes. Do not list every new function here.
4. Propose constitution changes before large structural shifts when possible.

## Current project constraints

- No automated test suite unless explicitly requested.
- No npm run scripts for the app unless added deliberately; manual `node` entry points under `clients/terminal/` are the default way to run actions.
- Runtime DB files under `data/` are local and gitignored.
