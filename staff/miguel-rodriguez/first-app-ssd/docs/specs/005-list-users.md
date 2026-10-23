# 005 — List users

> Historical implementation record: Miguel removed .gitignore, .nvmrc, README.md, and automated tests on 2026-10-19. References below to those files and npm test describe the earlier verified stage. Current verification uses clients/terminal/ in a disposable copy with Node 24.12.0.

Status: **approved by Miguel on 2026-10-19**. Specifications 001–004 are implemented.
Miguel authorized implementation on 2026-10-19. Scope: listing only.
Implemented and verified; acceptance results are recorded below.

## Goal and prerequisites

Provide synchronous `listUsers()` in `logic/list-users.js` using the fixed
connection and initialized schema. Node 24.12.0 and explicit initialization are
required. This is a read-only operation; it does not initialize, create, update,
delete, migrate, or reopen connections. Opening the shared connection on import
still follows specification 001 and may create an empty file if missing.

## Public contract

No arguments are required. Return an ordinary JavaScript array containing every
stored user, ordered by ascending numeric ID. Empty table returns `[]`; it is
not an error. No filtering, pagination, configurable sorting, or count wrapper.

Every element is a new ordinary object with exactly these own fields:
`{ id, name, email, createdAt, updatedAt }`. Explicitly select these fields from
query rows. Do not expose SQLite-specific row prototypes, extra metadata, or
result wrappers. Preserve stored values verbatim; do not renormalize names or
emails, reformat UTC timestamps, or change IDs. Existing application writes are
responsible for validation. Do not validate or repair externally altered rows.

Calls do not alter records, timestamps, or schema. Each successful call returns
a fresh array and fresh user objects. Mutating returned objects or array must
not affect stored data or later results. Business logic never prints, exits the
process, or opens/closes the connection.

## Errors

Any database preparation/read failure inside this operation throws an ordinary
`Error("Could not list the users")`. This includes a missing users table or
closed shared connection. Do not return [] for these failures: an unavailable
table is different from an empty table. Do not attach raw SQLite text, cause,
custom error classes, or error-code properties.

Connection-opening failure occurs before the business call and remains the
existing `Could not open the database` error, handled by the client. Listing
never initializes a missing table automatically.

## Proposed concrete query

Extend `queries/users.js` with `findAllUsers()` returning the array of database
rows. Add `queries/sql/list-users.js`, exporting one SQL string. Select all five
columns with explicit canonical aliases (including createdAt and updatedAt),
then `ORDER BY id ASC`. No user input is accepted, so no bound parameters are
needed. Prepare inside the query call, reuse db, and do not add business rules,
output, lifecycle management, or error translation to the query function.

The business function catches the query failure and explicitly maps each row
to the approved plain object. Preserve all previous functions and SQL contracts.

## Terminal client and examples

Proposed file: `clients/terminal/list-users.txt`, one copyable Node heredoc.
Instructions must specify project root `staff/miguel-rodriguez/first-app-ssd`, Node 24.12.0, and
prior execution of the separate initialization example. Creating contacts is
optional; an initialized empty database is a valid demonstration. The client
does not initialize or seed anything.

Acquire db through a dynamic import inside try; import and call exactly
`listUsers()`, print the return value with `console.log(users)`, then close an
acquired connection in finally. Success exits 0. The empty result prints `[]`.
A populated result prints the array in ascending ID order, with all five fields
per contact. Do not promise exact whitespace layout for Node's object display.

Catch errors using `console.error(error.message)` and set exit status 1. Missing
table/closed-connection failures print `Could not list the users`; an opening
failure prints `Could not open the database`. Failures print no successful array
or stack trace. Node's normal experimental SQLite warning may additionally appear.

Examples:

- Initialized empty table: `listUsers()` returns `[]`.
- Contacts inserted with IDs 12, 3, 8: returns IDs `[3, 8, 12]`.
- Missing table: throws `Could not list the users`, not an empty result.

## Numbered acceptance checks

Use Node's built-in runner and disposable project copies with fixed database
paths. Explicitly initialize copies. Test fixtures may use SQL to insert chosen
IDs and inspect snapshots, not introduce extra public operations. Execute the
actual terminal snippet, not duplicated client logic. Remove temporary copies
and preserve the original working database state.

1. **Empty table and output silence.** After initialization, verify an ordinary
   empty array with Array.prototype, no wrapper, and no business stdout/stderr
   except Node's normal warning. Repeated calls return distinct arrays.
2. **Ordering, exact data, and schema casing.** Insert fixtures with nonsequential
   IDs in a different order (12, 3, 8). Verify `[3,8,12]`, exactly five own keys
   per element, Object.prototype, and values matching the stored records,
   including Unicode and UTC timestamps. Repeat on an accepted lowercase schema;
   aliases must preserve canonical keys. Reopen in a new process and compare.
3. **Read-only behavior and detached output.** Snapshot every contact column and
   table schema. List repeatedly, then mutate a returned user's fields and the
   returned array. Subsequent results and snapshots remain unchanged. Listing
   must succeed with PRAGMA query_only = ON; disable it afterward in test cleanup.
4. **Database failures.** Test missing table and closed connection. Expect the
   exact ordinary error without cause/code/SQLite details and no implicit table
   creation. An initialization-only empty table must still return [] so the test
   distinguishes legitimate emptiness from error swallowing.
5. **Actual client, regressions, and isolation.** Extract and execute the real
   heredoc as in earlier specifications. Cover empty success (stdout [] plus
   newline, exit 0), populated success with the five fields/ordered fixtures,
   missing-table failure (exact listing message, exit 1), and opening failure
   (exact opening message, exit 1). Failures print no successful result. Verify
   connection cleanup after success/failure, unchanged working database state,
   and temporary removal. Run `npm test` retaining all existing 33 tests. Record
   evidence for checks 1–5 here only after implementation is authorized.

## Exclusions and review

No public email-lookup operation, filtering, search, pagination, arbitrary SQL,
schema change/migration, seeding, HTTP/frontend/notebook integration, dependencies,
Git mutations, or empty future-feature scaffolding. The approved plan has been executed.

Miguel approved this specification, query contract, terminal behavior, and
acceptance checks on 2026-10-19, then separately authorized implementation.
All five listing checks passed; see executed evidence below.


## Approved implementation plan

1. **Record implementation authorization when received.** Update stage notices
   in this specification, `AGENTS.md`, and the constitution. Confirm local branch
   and changes; work only inside `first-app-ssd` and preserve existing contracts.
2. **Add the concrete read query.** Create `queries/sql/list-users.js` with an
   explicit five-column SELECT, canonical aliases, and `ORDER BY id ASC`.
   Extend `queries/users.js` with `findAllUsers()`, preparing inside the call and
   returning all rows. No input parameters, business rules, output, or lifecycle
   management. Preserve all existing query functions.
3. **Implement one business operation.** Add `logic/list-users.js` exporting
   synchronous `listUsers()`. Catch database query failures with the exact
   generic listing error. Explicitly map rows to new ordinary five-field user
   objects and return the fresh array, including [] for an empty table. Never
   repair/normalize stored data, initialize, print, or close the connection.
4. **Add the terminal example.** Create `clients/terminal/list-users.txt` with
   working-directory, runtime, and initialization prerequisites. Use dynamic
   imports in try, print the returned array, report error messages with exit 1,
   and close an acquired connection in finally. No implicit seeds or setup.
5. **Add five acceptance checks.** Create `test/list-users.test.js` using temporary
   project copies. Cover empty/fresh arrays, numeric ordering, exact plain user
   fields, lowercase schema, persistence, snapshots, detached mutation, query-only
   reading, missing/closed database failures, and the actual terminal snippet's
   output/status/cleanup. Preserve the working database state and remove fixtures.
6. **Verify and record.** Run `npm test` from `staff/miguel-rodriguez/first-app-ssd` retaining all
   33 existing checks. Record pass/fail evidence for checks 1–5 here, explain
   changes and commands actually executed, and stop after verified listing.

Verification command:

```sh
npm test
```

The approved listing-only plan is complete. No dependencies, public email-lookup
operation, branches, commits, pushes, or pull requests. Stop after verified listing.


## Acceptance results — 2026-10-19

Executed `npm test` from `staff/miguel-rodriguez/first-app-ssd` on Node 24.12.0.
**38 tests passed, 0 failed**: five listing checks plus all 33 previous tests.

| Check | Result | Executed evidence |
| --- | --- | --- |
| 1 | PASS | Empty ordinary arrays, distinct results, library stdout/stderr silent except the expected Node warning |
| 2 | PASS | Numeric IDs 3/8/12, exact canonical plain-object fields, Unicode/timestamps, accepted lowercase schema, new-process persistence |
| 3 | PASS | Full schema/row snapshots preserved, detached object/array mutations, unchanged stored spacing/case, successful query-only reads |
| 4 | PASS | Missing-table and closed-connection failures sanitized, no implicit initialization, legitimate empty table distinguished |
| 5 | PASS | Actual terminal empty/populated success and exact failure output/status, connection cleanup, original state preserved, temporary copies removed; all prior tests pass |

Added `logic/list-users.js`, one SQL string, the concrete `findAllUsers()` query,
the terminal example, and `test/list-users.test.js`. Existing feature behavior
and schema remain unchanged. Listing tests used only disposable project copies.
No working database was created. No dependencies, branch, commit, push, or pull
request was made. Public email lookup remains unimplemented; stop here.
