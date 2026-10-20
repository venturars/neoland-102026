# Plan — align with the new constitution

Not a new feature. Every existing feature is moved to the new structure; no feature is added or removed.

## Files

- Create: `db/connection.js`, `queries/users.js`, `queries/queries/*.sql` (6), `docs/specs/align-constitution/`.
- Touch: `docs/CONSTITUTION.md` (rewritten), `AGENTS.md`, `db/schema.sql`, every `logic/*.js`, `.gitignore`, `package.json`, every spec folder.
- Move: `client/` → `clients/`, `specs/` → `docs/specs/`.
- Delete: `db/sqlite.js`, `query/` (incl. `safe.js`), `test/`, `docs/specs/database-errors/`.

## Looks like

Every `logic/` file keeps its rules; only its signature, imports and messages change.

## Signature

`createUser(name, email)`, `getUser(id)`, `getUserByEmail(email)`, `listUsers()`, `updateUser(id, name, email)`, `deleteUser(id)`.

## SQL

`users` gains `createdAt` and `updatedAt` (`TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))`); `email` becomes `VARCHAR(64)`. Update also sets `updatedAt`. The local data moves from `db/users.db` to `db/users.sqlite`.

## Errors

| Old message            | New message                      |
| ---------------------- | -------------------------------- |
| `name is required`     | `Name is empty`                  |
| `email is invalid`     | `Email is invalid`               |
| `email already exists` | `Email is already used`          |
| `user not found`       | `User not found`                 |
| `database error`       | `Could not <action> the user(s)` |

## Open questions

None.
