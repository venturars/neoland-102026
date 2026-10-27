# 003 — Update a user

> Historical implementation record: Miguel removed .gitignore, .nvmrc, README.md, and automated tests on 2026-10-19. References below to those files and npm test describe the earlier verified stage. Current verification uses clients/terminal/ in a disposable copy with Node 24.12.0.

Status: **approved by Miguel on 2026-10-19**. Specifications 001–002 are implemented.
Implementation plan recorded below. Miguel authorized execution on 2026-10-19.
Scope: updating users only. Implemented and verified; results follow below.

## Goal and prerequisites

Update one existing contact using synchronous `updateUser(id, changes)` from
`logic/update-user.js`. Reuse the fixed connection, schema, and existing email
lookup. Node 24.12.0 and explicit initialization are prerequisites. Do not create
users or tables, migrate schemas, or reopen a closed connection automatically.

## Inputs and validation order

Follow this exact order before any query execution:

1. **ID:** require a number satisfying `Number.isSafeInteger(id)` and `id > 0`.
   Reject strings, null, undefined, booleans, BigInt, NaN, infinities, fractions,
   zero/negative values, and unsafe integers with `Id is invalid`.
2. **Patch shape:** require a plain object with `Object.prototype` or null as
   its prototype. It must have at least one own property and only `name` and/or
   `email` as own keys. Arrays, class instances, unknown/symbol keys, empty
   objects, and attempts to change IDs/timestamps throw `Changes are invalid`.
   Inspect all own keys, not only enumerable string keys. Inherited values do
   not count as supplied fields. Accessor properties and malicious Proxies are
   outside this ordinary-data contract; no defensive object framework is needed.
3. **Supplied name:** use the same rules as specification 002: primitive string,
   reject unmatched UTF-16 surrogates, trim outer whitespace, preserve internal
   spacing/case, require 1–100 Unicode
   code points and no U+0000. Blank trimmed names throw `Name is empty`; other
   invalid values throw `Name is invalid`.
4. **Supplied email:** use specification 002's exact rules: primitive string,
   reject unmatched UTF-16 surrogates, trim/lowercase before checking at most
   64 Unicode code points, exactly one
   `@`, nonempty local part, at least two nonempty dot-separated domain labels,
   no whitespace or U+0000. Fail with `Email is invalid`.

A supplied null/undefined value fails its field validation; it is not omission.
Only a missing own property preserves a field. Do not change the approved
create-user function or introduce a shared validation framework for this feature.
If several inputs fail, the order above decides which message is returned.
Invalid input takes precedence over missing-user and database-query errors.
The connection still opens on import as specified in 001.

## Business behavior and success

After validation:

1. Find the current user by ID. If absent, throw `User not found`.
2. Combine current values with only the validated supplied fields. Preserve
   omitted fields' existing values without renormalizing or revalidating them;
   the UPDATE may assign those same values back to the columns. Existing records
   are assumed to have been created through the approved application.
3. Check ownership of the final email using the existing concrete query.
   An owner with the same ID is allowed. A different owner throws
   `Email is already used`.
4. Write the final name and email in one UPDATE, refresh `updatedAt` using
   SQLite `datetime('now')` (UTC), and leave `id` and `createdAt` untouched.
   If no row is returned because it disappeared before the write, throw
   `User not found`; do not report success with undefined data.
5. Return a new ordinary object with exactly
   `{ id, name, email, createdAt, updatedAt }`, matching the stored updated row.

Name-only, email-only, and combined updates are supported. Supplying the same
values is a successful update and still refreshes `updatedAt`. Second precision
means its displayed value may stay the same; strict timestamp increase is not
promised. No output, process exit, SQL, or connection lifecycle code belongs in
`logic/update-user.js`. No result wrappers or custom error classes.

Failed validation, duplicate ownership, and ordinary failed UPDATE statements
must leave contact records unchanged, including timestamps. Concurrent editing,
lost-update prevention, and externally customized schemas are outside scope.

## Exact ordinary Error messages

| Condition | Message |
| --- | --- |
| Invalid ID | `Id is invalid` |
| Invalid patch shape/keys or empty patch | `Changes are invalid` |
| Supplied name blank after trimming | `Name is empty` |
| Supplied name type, length, U+0000, or malformed Unicode invalid | `Name is invalid` |
| Supplied email invalid | `Email is invalid` |
| Missing user at lookup or write | `User not found` |
| Email owned by another user, including insertion-time equivalent UPDATE UNIQUE failure | `Email is already used` |
| Other database lookup/UPDATE failure | `Could not update the user` |

Catch database calls narrowly. A write-time email UNIQUE violation must use the
duplicate message even if prechecking found no conflicting owner. Other
constraints/trigger failures use the generic update message, not the duplicate
message. Do not leak SQLite text, attach an original cause, or add error codes.
Connection-opening failure remains `Could not open the database` and is caught
by the client. Valid input against an uninitialized table or closed connection
uses the generic update error. Never initialize automatically.

## Proposed internal queries

Extend `queries/users.js` without replacing initialization or creation:

- `findById(id)`: return the selected database row or undefined.
- `updateUserById(id, name, email)`: update both contact fields plus updatedAt;
  return the selected updated row or undefined when no ID matched.

Add SQL strings in `queries/sql/find-user-by-id.js` and
`queries/sql/update-user.js`. Each file exports one string. Use named bound
parameters and explicit five-field SELECT/RETURNING columns, with canonical
camelCase aliases even when accepted stored column names use different casing. Reuse `findByEmail`
without adding a public email-lookup business operation. Query functions do not
validate, normalize, manage connections, print, or translate business errors.
Prepare statements inside calls. The business function selects plain output
fields explicitly rather than exposing a SQLite row object.

## Terminal example and exact behavior

Proposed file: `clients/terminal/update-user.txt`, one copyable Node heredoc.
Instructions: run from `staff/miguel-rodriguez/first-app-ssd` with the pinned Node version; first
run the separate initialization and create-user examples. Copy the generated
ID from create-user output into the snippet's clearly marked `userId` number.
There is no assumed ID of 1 and no hidden lookup or creation inside this client.
The client calls exactly:

```js
updateUser(userId, { name: "  Ada Byron  " });
```

Acquire the shared connection via dynamic import inside try, import the operation,
print success with `console.log(user)`, catch with `console.error(error.message)`
and exit status 1, and close an acquired connection in finally. Success exits 0.
Warn that this changes the local working database. Repeated runs succeed if the
user still exists; name is Ada Byron, email and createdAt remain unchanged.

A missing user prints `User not found`; a missing table prints
`Could not update the user`; an opening failure prints
`Could not open the database`. Failures print no successful user or raw stack.
Node's normal experimental SQLite warning may additionally appear.

## Examples

- `updateUser(id, { name: "  Ada Byron  " })`: stores Ada Byron; preserves email.
- `updateUser(id, { email: " ADA.BYRON@EXAMPLE.COM " })`: normalizes email;
  preserves name.
- `updateUser(id, { name: "Ada", email: "ada.new@example.com" })`: changes both.
- `updateUser(id, { email: currentEmail.toUpperCase() })`: allowed own email.
- `updateUser(id, {})`: `Changes are invalid`.
- `updateUser(id, { name: undefined })`: `Name is invalid`.
- `updateUser("1", { name: "Ada" })`: `Id is invalid`.

## Numbered acceptance checks

Use Node's built-in runner and disposable project copies. Initialize and create
fixtures explicitly. Test SQL may inspect and prepare fixtures, not introduce
extra application operations. Snapshot all contact columns around rejected
writes, extract the actual terminal snippet, and clean up temporary copies.

1. **Partial/combined updates and persistence.** Create at least two contacts;
   update one by name only, email only, then both. Verify normalization, omitted
   fields, exactly five own keys, Object.prototype, unchanged ID/createdAt, and
   no business stdout/stderr output (apart from Node's expected warning). Other contacts stay unchanged. Reopen in a new process
   and compare persisted data with the returned row. Repeat using an accepted
   all-lowercase schema; all five keys and timestamp values remain canonical.
2. **ID and patch validation.** Cover every invalid ID category above, including
   Number.MAX_SAFE_INTEGER + 1. Accept a safe positive ID for lookup even if
   missing. Reject null/undefined, arrays, class instances, primitive patches,
   empty objects, inherited-only values, symbol keys, and timestamp/ID fields.
   Reject unknown own keys regardless of whether they are enumerable. Accept
   ordinary and null-prototype patches containing permitted own name/email data
   properties, including nonenumerable permitted properties. Verify
   ID precedence over invalid patches and patch shape over invalid values.
3. **Field rules and boundaries.** Cover creation's primitive-type, name blank,
   U+0000, name 1/100/101 code-point and emoji boundaries, email 64/65 boundaries,
   malformed domain/whitespace cases, Unicode lowercase expansion, and unmatched
   high/low UTF-16 surrogates. Valid emoji pairs remain accepted. Reject
   explicit undefined/null. Verify name precedes email and omitted fields stay
   unchanged. Rejected calls preserve full row snapshots.
4. **Missing user and query precedence.** A valid but absent safe ID gives
   `User not found`. Invalid ID/patch/fields still give validation errors with
   an absent ID or missing users table. Valid input with a missing table gives
   the generic database error. Verify an UPDATE matching no row returns undefined
   at query level. To exercise the business branch handling an UPDATE returning
   no row, use a test-only BEFORE UPDATE trigger containing only
   SELECT RAISE(IGNORE). Expect `User not found` and unchanged records. This
   fixture tests no-row handling; it does not simulate deletion or prove
   concurrent-deletion behavior. Do not modify or delete the target row inside
   a BEFORE UPDATE trigger, because SQLite defines the subsequent behavior as
   undefined.
5. **Ownership and write-time duplicates.** Own normalized email succeeds;
   another contact's email (case/whitespace variants) fails without changing
   either contact. Use a test-only BEFORE UPDATE trigger that inserts a contact
   with the desired previously unused email before the outer UPDATE. Confirm
   the real query raises SQLite's email UNIQUE classification, then verify the
   business duplicate error. Failed statement rollback must remove that fixture
   insertion and preserve original contacts. Disable recursive triggers explicitly.
6. **Timestamp semantics.** In an isolated fixture set updatedAt to an old valid
   timestamp, then update, including a same-value update. Bound the refreshed UTC
   value between SQLite datetime('now') captured before/after the operation;
   confirm createdAt never changes. Do not sleep or require every rapid update
   to have a strictly larger timestamp. Failed writes preserve timestamps.
7. **Unexpected database errors.** Cover closed connection, query-only UPDATE,
   and a non-unique aborting trigger. Expect only `Could not update the user`,
   ordinary Error, no cause/code/SQLite details. Capture lookup failures and
   write failures separately. Rejected UPDATEs preserve all rows.
8. **Actual client, regressions, and isolation.** Tests change only the documented
   numeric userId placeholder to the fixture's created ID; otherwise execute the
   actual heredoc unchanged. Verify normalized name-only success and preserved
   email, repeat success, missing-user/missing-table/opening failures with exact
   messages and exit statuses. Verify acquired connections close on success and
   failure. Run `npm test` with all initialization/creation regressions; preserve
   the original working database state and remove temporary copies. Record
   evidence for checks 1–8 here only after implementation is authorized.

## Exclusions and review

No delete/list/public-email-lookup operation, schema change, migration, seed
command, generic helper framework, CLI parser, HTTP/frontend/notebook setup,
authentication, dependencies, or Git mutations. Existing create-user behavior
must remain unchanged. The approved plan below has been executed.

Miguel approved this specification, its internal query signatures, manual example,
and acceptance checks on 2026-10-19, then separately authorized implementation.
Executed acceptance results are recorded below. No later feature is authorized.


## Approved implementation plan

1. **Record authorization when execution begins.** Update stage notices in this
   specification, `AGENTS.md`, and the constitution without changing contracts.
   Check the branch and local changes; restrict work to `first-app-ssd`.
2. **Add concrete queries.** Add `queries/sql/find-user-by-id.js` and
   `queries/sql/update-user.js`; extend `queries/users.js` with `findById(id)` and
   `updateUserById(id, name, email)`. Use named parameters, canonical result
   aliases, explicit columns, and UTC updatedAt. Preserve initialization and
   creation. Verify a missing ID returns undefined at query level.
3. **Implement update logic.** Add only `logic/update-user.js`. Validate ID,
   patch shape, supplied name, and supplied email in order. Use all own keys
   and own-property checks so permitted nonenumerable fields are handled.
   Retain creation's Unicode and normalization policy without changing creation
   or adding a validation framework. Find the user, preserve omitted values,
   reject another owner's email, execute the UPDATE, and return the exact plain
   object. Catch database calls narrowly; distinguish no-row, email UNIQUE, and
   other database failures using the approved messages.
4. **Add terminal example.** Add `clients/terminal/update-user.txt` with a clearly
   marked numeric userId replacement, the exact Ada Byron call, prerequisites,
   write warning, dynamic imports, error presentation, exit status, and finally
   cleanup. Never initialize or create a user inside this client.
5. **Add acceptance tests.** Create `test/update-user.test.js` using temporary
   project copies. Implement checks 1–8: partial/combined changes, exact result
   keys and persistence, patch edge cases, Unicode and length boundaries,
   precedence, ownership, no-row handling, write failures, and timestamps.
   Verify the actual client, accepted lowercase schema, and silent library
   stdout/stderr except Node's normal warning. Confirm the IGNORE and UNIQUE
   fixtures actually reach their intended conditions; keep triggers test-only.
6. **Verify and record results.** Run `npm test` from `staff/miguel-rodriguez/first-app-ssd`, retaining
   all 19 existing tests. Verify temporary cleanup and unchanged working database
   state. Record evidence for each of this specification's eight acceptance
   checks, explain changes and commands, and stop after verified updating.

Verification command:

```sh
npm test
```

Execution results follow. Do not install dependencies, implement later operations,
mutate branches, commit, push, or open pull requests.


## Acceptance results — 2026-10-19

Executed `npm test` from `staff/miguel-rodriguez/first-app-ssd` on Node 24.12.0:
**27 passed, 0 failed**. All eight checks below passed along with the 19 existing
initialization/creation/regression tests. Database operations used disposable
project copies, removed after testing; the working database remained unchanged.

| Check | Result | Executed evidence |
| --- | --- | --- |
| 1 | PASS | Name-only, email-only, combined changes; plain canonical response; omitted values and other contacts preserved; new-process persistence; accepted lowercase schema |
| 2 | PASS | Invalid ID categories, all-own-key patch validation, unknown/symbol/forbidden keys, null-prototype and nonenumerable valid patches, validation precedence |
| 3 | PASS | Primitive types, null/undefined, blanks, null characters, Unicode validity and expansion, name/email boundaries, normalization, unchanged rejected-write snapshots |
| 4 | PASS | Missing users, pre-query validation, no-row query result, and actual IGNORE fixture leading to business missing-user error with unchanged records |
| 5 | PASS | Own email allowed; other-owner duplicates rejected; fixture confirmed real UNIQUE/2067 write failure and rollback before business-error verification |
| 6 | PASS | Old updatedAt refreshed on changed and same-value writes within UTC bounds; immutable createdAt; rejected write preserved timestamps |
| 7 | PASS | Closed lookup, query-only write, non-unique abort trigger; generic ordinary errors without cause/code; row snapshots preserved |
| 8 | PASS | Actual terminal snippet with only numeric placeholder replaced; success/repeat success and exact failures; acquired connections closed; initialization regression and test cleanup/isolation |

Added `logic/update-user.js`, two SQL strings, the two concrete query exports,
the terminal example, and `test/update-user.test.js`. Existing creation and
initialization behavior/schema remain unchanged. The manual example uses
`userId = 0` as an intentionally invalid placeholder: replace it with the ID
printed by the separate creation example before running it.

No delete/list/public-email-lookup operation, extra dependencies, working
database, branch, commit, push, or pull request was created. Stop here.
