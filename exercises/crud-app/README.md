# User-management exercise

Local contact records, without authentication. Requires Node.js 24.12.0.
No package installation is needed: all dependencies are built into Node.

## Terminal

Run commands from this directory:

```sh
nvm use
npm run check
npm run db:init
npm run users -- create --name "Ana" --email ana@example.com
npm run users -- list
npm run users -- update 1 --name "Ana Lopez"
npm run users -- delete 1
npm test
```

`nvm use` selects the version in `.nvmrc` if you use nvm. `check` confirms
module and SQLite support. `db:init` creates the database/table and is safe
to repeat. `users` runs the terminal interface; `--` forwards arguments to it.
Replace `1` with the ID returned by create. `npm test` runs all tests against
temporary databases, which are removed afterward. SQLite may print an
experimental-feature warning on this Node version.

Successes are printed as JSON on standard output. Expected failures are JSON
on standard error and set exit status 1; unexpected failures print a generic
message. `node src/cli.js --help` shows usage without npm's extra output.

## Direct JavaScript use

After initialization, run `node --input-type=module` from this directory and enter:

```js
import { openApp } from './src/app.js';
const app = openApp();
try {
  const result = app.listUsers();
  console.log(result); // Output belongs to the caller, not the business logic.
} finally {
  app.close();
}
```

The returned app also provides `createUser(input)`, `updateUser(id, changes)`,
and `deleteUser(id)`. These return ordinary JavaScript result objects.
A JavaScript Jupyter kernel can use the same module with its absolute path.
A Python notebook needs a process bridge or a later HTTP API; a browser will
need a Node HTTP API. Neither interface is implemented yet.

## Responsibilities

- `src/logic/`: one file per business operation; shared input validation.
- `src/db/`: connection, table definition, and concrete SQL repository.
- `src/errors.js`: shared duplicate-email error, without database details.
- `src/app.js`: opens the fixed database, connects logic to repository, and exposes close.
- `src/cli.js`: parses terminal arguments and presents results.
- `scripts/init-db.js`: initializes the database and closes its connection.
- `test/`: repository, logic, terminal, and direct-use checks.
- `data/app.sqlite`: local database, ignored by Git.

Names are trimmed and must contain 1–100 characters. Emails are trimmed,
lowercased, checked for basic format, limited to 254 characters, and unique.
Unknown fields, null values, and empty updates are rejected. IDs must be positive
safe integers. Missing users return `NOT_FOUND`; duplicate emails return
`EMAIL_IN_USE`; invalid inputs return `VALIDATION_ERROR`. Updates preserve
omitted fields. Deletion permanently removes a record.

The repository accepts both name and email for updates. The logic merges partial
updates first. The repository translates SQLite's duplicate constraint error
into `EmailInUseError`; unexpected errors propagate to the client.

## Comparison with Ventura's reference

Compared with PR #139 at commit `a421946a2c10747ee2d86927ee9f6e6cb2980393`:
create, list, partial update, delete, missing-user errors, duplicate-email checks,
name/email normalization, persistence, ID/email lookup, and creation/update
timestamps are supported. Timestamps are returned with every user.

`createdAt` and `updatedAt` use UTC, with second precision. Ventura uses local
time. Run `npm run db:init` again to upgrade the original three-column table.
The upgrade is transactional (all changes succeed together or are rolled back),
preserves IDs and contact data, and assigns existing rows the upgrade time because
their original creation time was not recorded.

Our agreed validation differs: names are limited to 100 characters, emails to
254 rather than 64, and email domains must contain a dot. Unknown fields and
empty updates are rejected. Results use `data` and structured error objects,
where Ventura uses `user`/`users` and error strings. These are intentional API
differences; the code is not a drop-in replacement for his imports.

## Behavior and verification

Run `npm test` to verify these rules without changing `data/app.sqlite`.
Tests use disposable files, disposable project copies, or in-memory SQLite.

| Rule | Test file |
| --- | --- |
| CRUD, ordered lists, persistence, duplicate constraints | `test/users-repository.test.js` |
| Input validation, partial updates, missing IDs, structured results | `test/users-logic.test.js` |
| Exact limits, Unicode normalization, null characters, unchanged records after rejection, own-email updates | `test/validation-boundaries.test.js` |
| Failed database upgrade restores the original schema and records | `test/validation-boundaries.test.js` |
| Timestamps, email lookup, repeatable upgrade preserving records | `test/timestamps.test.js` |
| Terminal CRUD, failure exit codes, direct JavaScript calls without output | `test/clients.test.js` |

Email length is checked after trimming and lowercasing. Character limits count
Unicode code points (an emoji counts as one; combined characters may count as
more than one). Email format validation is deliberately basic and does not
verify mailbox existence.
