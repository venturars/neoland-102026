# 004 — Delete a user

> Historical implementation record: Miguel removed .gitignore, .nvmrc, README.md, and automated tests on 2026-10-19. References below to those files and npm test describe the earlier verified stage. Current verification uses clients/terminal/ in a disposable copy with Node 24.12.0.

Status: **approved by Miguel on 2026-10-19**. Specifications 001–003 are implemented.
Miguel authorized implementation on 2026-10-19. Scope: deletion only.
Implemented and verified; execution results are recorded below.

## Goal and prerequisites

Provide synchronous `deleteUser(id)` in `logic/delete-user.js`. Permanently
remove one contact from the fixed initialized SQLite database. Node 24.12.0 and
prior explicit initialization are required. No automatic initialization, seeds,
connection reopening, schema changes, soft deletion, or undo feature.

## Public contract and operation order

1. Validate ID before any query is prepared/executed: it must be a number with
   `Number.isSafeInteger(id)` and `id > 0`. Do not coerce strings. Reject null,
   undefined, booleans, BigInt, NaN, infinities, fractions, zero, negative numbers,
   and unsafe integers with ordinary `Error("Id is invalid")`.
2. Use the existing `findById(id)`. If it returns undefined, throw
   `User not found` without executing a deletion.
3. Delete exactly the row matching that ID. If no row is deleted after a
   successful lookup, throw `User not found`; do not claim success.
4. Return `undefined` on success, without a result wrapper or deleted-user data.

The connection still opens on module import according to specification 001.
Invalid input takes precedence over missing-user or database-query errors.
Successful deletion leaves every other contact and its timestamps unchanged.
The deleted email becomes available for a later create-user call. A repeated
delete of the same ID, without another insertion in between, fails as missing.
SQLite may reuse deleted IDs; this feature does not introduce global ID history.

No console output, SQL, process exit, or connection lifecycle code belongs in
business logic. It uses the fixed query module, not a supplied store/database.
Concurrent edit handling, external triggers, and foreign-key relationships are
outside the application scope. Test fixtures can exercise errors without adding
those capabilities to the application.

## Exact errors and data preservation

| Condition | Exact ordinary Error message |
| --- | --- |
| Invalid ID | `Id is invalid` |
| No user found at lookup or no row deleted | `User not found` |
| Lookup/deletion fails for another database reason | `Could not delete the user` |

Catch query calls narrowly; do not mask validation or missing-user errors.
Do not expose raw SQLite text, stack details through the client, cause, custom
error classes, or error-code properties. Valid input against a missing table or
closed connection yields the generic deletion error. Never initialize implicitly.
Opening failure remains `Could not open the database` from spec 001 and is caught
by the client before the business call.

Rejected validation, missing-user cases, and failed DELETE statements leave all
contact rows unchanged. Use an ordinary aborting trigger for failure fixtures;
no test may delete/modify the target from a BEFORE DELETE trigger and depend on
SQLite's undefined subsequent behavior.

## Proposed concrete query

Reuse `findById(id)` and extend `queries/users.js` with `deleteUserById(id)`.
Add `queries/sql/delete-user.js`, exporting one SQL string with the named `:id`
parameter. The statement deletes by ID and returns `id AS id` for the deleted
row. The query returns that raw row or undefined; the business function uses it
only to determine success and returns no data publicly. This follows the
constitution's permitted raw-row query contract and makes no-row handling clear.

Prepare inside the query call; do not validate, print, open/close connections,
or translate business errors in the query layer. Preserve all existing
initialization, create, and update functions and SQL contracts.

## Terminal example

Proposed file: `clients/terminal/delete-user.txt`, one copyable Node heredoc.
Run from `staff/miguel-rodriguez/first-app-ssd` using Node 24.12.0. Explicitly initialize and create
a disposable contact using the separate examples first. The user must replace
a clearly marked `userId = 0` placeholder with the actual generated ID. Zero
is deliberately invalid; no existing ID is assumed. Warn clearly that deletion
changes the working database permanently and the example does not create or
initialize anything automatically.

The exact operation is `deleteUser(userId)`. The client acquires `db` using a
dynamic import inside try, imports the business function, and prints its return
value with `console.log(result)`. Thus successful deletion prints `undefined`
and exits 0; the instructions must explain that this is the expected no-data
result, not an application failure.

On failure print only `error.message` to stderr and set exit status 1. Expected
messages are the table above or the existing opening error. Print no successful
result or raw stack on failure. Close any acquired connection in finally.
Node's normal SQLite warning may additionally appear. Repeating the example
without creating another user gives `User not found` and exit 1.

## Examples

- `deleteUser(existingId)`: removes that contact; returns undefined.
- Repeat the call without intervening insertion: `User not found`.
- `deleteUser("7")` or `deleteUser(0)`: `Id is invalid`, no deletion.
- Valid positive ID with no matching record: `User not found`.

## Numbered acceptance checks

Use Node's built-in runner and temporary project copies with the fixed database
path. Create fixtures explicitly; inspect using test-only SQL. Snapshot all
contact columns around rejected operations. Remove copies afterward and never
change the learner's working database. No later application operation is needed.

1. **Success, persistence, and silence.** Initialize, create at least two contacts,
   delete one, assert return is exactly undefined, and confirm the target is gone
   while other rows/timestamps match snapshots. Reopen in another process to
   prove persistence. Library calls produce no stdout/stderr except Node's
   expected runtime warning. Repeat with a supported all-lowercase table schema
   to check compatibility with prior features.
2. **ID validation and precedence.** Test every invalid ID category listed above,
   including Number.MAX_SAFE_INTEGER + 1. Verify `Id is invalid` on initialized
   and uninitialized databases, before querying, and unchanged rows. A safe
   positive absent ID (including Number.MAX_SAFE_INTEGER) is valid input but
   yields `User not found` when the table exists.
3. **Missing user and repeat behavior.** A missing ID and a second deletion after
   successful removal yield `User not found`; preserve all surviving records.
   At query level, a nonmatching ID returns undefined. Use a test-only BEFORE
   DELETE trigger containing only SELECT RAISE(IGNORE) to cause deletion to
   return no row after a successful lookup. Expect the business missing-user
   error and unchanged records; do not describe this fixture as concurrent
   deletion or modify/delete the target inside the trigger.
4. **Released email and regressions.** Delete a contact, then create a new one
   using the deleted contact's normalized email. Creation succeeds; do not
   assume the new ID differs or equals the deleted ID. Existing initialization
   remains repeatable and other creation/update acceptance checks still pass.
5. **Unexpected database failures.** Test valid ID against a missing table,
   closed connection, query-only DELETE, and a test-only trigger using
   RAISE(ABORT, 'private fixture diagnostic'). Expect exactly the generic delete
   error, ordinary Error, no cause/code/raw SQLite details. Lookup and write
   failures must both be covered. Rejected writes preserve snapshots.
6. **Actual terminal client and isolation.** Extract/run the real heredoc as in
   earlier specifications, replacing only its marked numeric userId placeholder.
   Verify success prints `undefined` with exit 0, repeat/missing ID prints
   `User not found` with exit 1, uninitialized-table failure prints
   `Could not delete the user`, and opening failure prints
   `Could not open the database`. The unchanged zero placeholder must produce
   `Id is invalid` on an initialized copy. Check acquired connection closure on
   success/failure, unchanged original database state, and temporary cleanup.
   Run `npm test` with all existing 27 checks; record results against checks 1–6
   only after implementation is authorized.

## Exclusions and review

No listing/public-email-lookup business operation, schema migration, soft delete,
audit history, UI/notebook/HTTP integration, authentication, dependencies, Git
mutations, or empty future-feature scaffolding. The approved plan has been executed.

Miguel approved this specification, including the query contract, undefined
terminal output, and acceptance checks on 2026-10-19, then separately authorized
implementation. All six checks passed; executed evidence follows.


## Approved implementation plan

1. **Record authorization when execution starts.** Update stage notices in
   `AGENTS.md`, the constitution, and this specification. Confirm branch/local
   changes. Work only in `first-app-ssd`; preserve earlier feature contracts.
2. **Add the concrete deletion query.** Add `queries/sql/delete-user.js` with
   named `:id` and `RETURNING id AS id`. Extend `queries/users.js` with
   `deleteUserById(id)`, preparing inside the call and returning the row or
   undefined. No business validation, error translation, or connection handling.
3. **Implement one business function.** Add `logic/delete-user.js`. Validate the
   safe positive ID, call existing `findById`, report missing users, perform the
   deletion, and check the returned row. Catch database calls narrowly with
   `Could not delete the user`; preserve `User not found` and `Id is invalid`.
   Return undefined without printing or closing the connection.
4. **Add the manual client.** Add `clients/terminal/delete-user.txt` with the
   marked `userId = 0` placeholder, initialization/creation prerequisites, and
   permanent-deletion warning. Use dynamic imports, print the operation's return
   value, handle exact messages/status, and close acquired db in finally.
5. **Add six acceptance checks.** Create `test/delete-user.test.js` using isolated
   temporary project copies. Cover persistence, surviving row snapshots, all ID
   categories, missing/repeated deletion, query no-row and IGNORE fixture,
   released-email creation, sanitized read/write failures, actual client output
   and cleanup, lowercase schema support, and unchanged working database state.
   Fixtures may inspect SQL directly but introduce no later application feature.
6. **Run all tests and record evidence.** Run `npm test` from `staff/miguel-rodriguez/first-app-ssd`,
   retaining all 27 existing tests. Verify temporary cleanup. Record pass/fail
   evidence for acceptance checks 1–6 here, explain changes and executed commands,
   and stop after verified deletion. No listing or public lookup implementation.

Verification command:

```sh
npm test
```

The approved deletion-only plan is complete. Do not install packages, create
branches, commit, push, open pull requests, or implement later operations.


## Acceptance results — 2026-10-19

Executed `npm test` from `staff/miguel-rodriguez/first-app-ssd` on Node 24.12.0.
**33 tests passed, 0 failed**: six deletion checks plus all 27 prior tests.

| Check | Result | Executed evidence |
| --- | --- | --- |
| 1 | PASS | Undefined success, target absence, survivor snapshots, new-process persistence, silent stdout/stderr, lowercase schema |
| 2 | PASS | All invalid ID categories before queries, initialized/uninitialized cases, unchanged rows, valid absent MAX_SAFE_INTEGER |
| 3 | PASS | Missing/repeated deletion, no-row query result, IGNORE fixture, business missing-user error, unchanged survivors |
| 4 | PASS | Deleted normalized email reused by creation; no ID-reuse assumption; initialization preserves records |
| 5 | PASS | Missing-table/closed lookup and query-only/abort-trigger write failures sanitized; rows preserved |
| 6 | PASS | Actual heredoc success prints undefined; repeat/missing/zero/missing-table/opening failures have exact status/messages; connections close; original state preserved; temporary copies removed |

Added `logic/delete-user.js`, the deletion SQL string and concrete query export,
the manual client, and `test/delete-user.test.js`. Prior schema and business
operations remain unchanged. Tests ran only in disposable project copies.
No working database was created, no dependency installed, and no branch, commit,
push, or pull request made. Stop after deletion; no later operations implemented.
