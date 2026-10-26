# 002 — Create a user

> Historical implementation record: Miguel removed .gitignore, .nvmrc, README.md, and automated tests on 2026-10-19. References below to those files and npm test describe the earlier verified stage. Current verification uses clients/terminal/ in a disposable copy with Node 24.12.0.

Status: **approved by Miguel on 2026-10-19**. Specification 001 is implemented.
Miguel authorized implementation of this specification and its plan on
2026-10-19. Implemented and verified that day. Scope: user creation only;
acceptance results are recorded below. Stop after this feature.

## Goal, prerequisites, and scope

Create one contact using `createUser(name, email)` from `logic/create-user.js`.
Reuse the fixed connection and existing table from specification 001. Node
24.12.0 and prior explicit database initialization are prerequisites. Do not
initialize tables automatically, change the schema, or reopen a closed connection.

This specification applies the approved constitution, not the older sibling
`crud-app` API. It introduces no dependencies or additional architecture layers.

## Inputs, normalization, and precedence

The function is synchronous and accepts two positional JavaScript values.
Validate name first, then email, then check duplicate ownership, then insert.
Invalid inputs must fail before query preparation/execution (the shared connection
still opens on module import as agreed). No validation failure changes records.

Name:
- Require a primitive, well-formed Unicode string (no unmatched UTF-16
  surrogates); otherwise throw `Name is invalid`.
- Trim using JavaScript `trim()` without changing internal spacing or case.
- A blank trimmed string throws `Name is empty`.
- Reject a null character (`U+0000`) or more than 100 Unicode code points with
  `Name is invalid`. A nonblank name containing U+0000 is invalid even if SQLite
  would truncate its display. Length is counted after trimming.

Email:
- Require a primitive, well-formed Unicode string (no unmatched UTF-16
  surrogates); otherwise throw `Email is invalid`.
- Trim and lowercase using JavaScript `trim().toLowerCase()` **before** checking
  length and format. Do not remove internal whitespace or perform Unicode NFC
  normalization, accent removal, or provider-specific rewriting.
- Require at most 64 Unicode code points, exactly one `@`, a nonempty local
  part, and at least two nonempty dot-separated domain labels. Reject whitespace
  anywhere in the normalized value and U+0000. All failures use `Email is invalid`.
- This is only a basic shape check. It does not enforce the full email standard,
  verify a mailbox, or restrict names/emails to ASCII.

Examples: `a@b.c` is valid; `a@b`, `a@.b`, `a@b.`, `a@b..c`, `a@@b.c`, and
`a b@c.d` are invalid. The constitution's format rules imply a minimum valid
length of five code points; the table's shorter storage bound is not the format
validator. Arrays, null, undefined, booleans, numbers, and boxed strings are not
primitive strings and must produce the corresponding controlled error.

## Success and expected errors

On success return a new ordinary object with exactly these own fields:
`{ id, name, email, createdAt, updatedAt }`.

The normalized values are stored; SQLite generates a positive safe integer ID
and UTC timestamp defaults. Both timestamps initially match. The returned values
must match the persisted record, with no SQLite row prototype, metadata, result
wrapper, or extra fields. No console output, process exit, or connection lifecycle
management belongs in this business function.

| Condition | Exact ordinary Error message |
| --- | --- |
| Name not a string, too long, or contains U+0000 | `Name is invalid` |
| Name blank after trimming | `Name is empty` |
| Email type, length, or format invalid | `Email is invalid` |
| Normalized email already belongs to a contact | `Email is already used` |
| Database lookup or insertion fails for another reason | `Could not create the user` |

Preserve this order when multiple inputs fail: name before email; email before
any database access. Duplicate checking follows validation. A write-time email
unique-constraint failure also becomes `Email is already used` even if a prior
lookup found no owner. Other constraint failures are not mislabeled as duplicate
email. Preserve no original database error as a public `cause`, custom error
class, code property, or exposed SQL error message. Catch database calls narrowly
so business errors are not replaced by the generic message.

Opening the connection can fail before the operation runs. That remains the
existing `Could not open the database` error from specification 001, handled by
the client. Valid input against a missing table or closed connection produces
`Could not create the user`. Missing tables are not silently created. Incompatible
externally modified schemas are outside this feature; initialization is responsible
for the compatibility check.

## Concrete query responsibilities

Extend the existing `queries/users.js`; do not replace its initialization code.
The following internal query signatures were approved for this feature:

- `findByEmail(email)`: return the matching database row or `undefined`.
- `insertUser(name, email)`: insert the two values and return the inserted row,
  including SQLite-generated ID and timestamps.

Use explicit canonical aliases on all returned columns, including timestamp
columns, so supported schema casing cannot change object keys.

Their SQL strings live in `queries/sql/find-user-by-email.js` and
`queries/sql/insert-user.js`. Use named bound parameters and explicit returned
columns. Prepare statements inside query calls, not at import time. These
functions do not normalize, validate, print, open/close the connection, or invent
business errors. Database exceptions propagate to `logic/create-user.js` for
translation. No selectable database/store parameter, repository factory, custom
error class, or generic SQL helper is introduced.

Only normalized emails enter these public business writes. Lookup and UNIQUE
use the table's NOCASE behavior; full Unicode case folding is not promised.
Uniqueness remains enforced by SQLite even when the lookup and insertion race.
Concurrent edit management is outside scope, but unique-constraint failures must
still be translated correctly.

## Terminal example and user-visible behavior

The terminal client is `clients/terminal/create-user.txt`.
The instructions must say to run from `staff/miguel-rodriguez/first-app-ssd`, select the pinned
Node version, and run the separate initialization example first. It must warn
that the example writes to the working database and repeated creation of the
same email produces a duplicate error.

The client acquires the connection using a dynamic import within `try`, then
imports and calls the business function, prints the successful user with
`console.log(user)`, catches failures with `console.error(error.message)` and
exit status 1, and closes an acquired connection in `finally`. Success exits 0.
Print no stack or raw SQLite details. Node's normal SQLite warning may appear.
Do not add a command-line argument parser or HTTP endpoint.

The terminal example uses this exact call:

```js
createUser("  Ada Lovelace  ", " ADA@EXAMPLE.COM ");
```

Expected data: name `Ada Lovelace`, email `ada@example.com`, generated ID and
matching creation/update timestamps. The ID is not promised to be 1. Repeating
that call throws `Email is already used` and preserves existing records.

## Numbered acceptance checks

Acceptance checks use Node's built-in test runner and disposable project
copies with the fixed database path. Initialize only the copies explicitly.
Direct fixture/inspection SQL in tests is permitted; application operations for
listing/updating/deleting are not. Exercise the actual terminal snippet, not a
separate reimplementation. No check writes to the learner's database.

1. **Normalized successful creation and persistence.** Create Ada with outer
   whitespace and an uppercase email. Assert exact normalized values, exactly
   five own keys, `Object.prototype`, a positive safe ID, matching timestamp
   defaults, and no output from the function. Reopen in a new process and inspect
   the stored row directly; it must match the returned data. Bound timestamps
   between SQLite UTC time captured before/after insertion as in spec 001.
2. **Name validation and precedence.** Reject all non-string examples above,
   empty/whitespace-only names, 101-code-point names, and U+0000. Accept trimmed
   one-code-point and 100-code-point names, including a 100-emoji name. When name
   and email are both invalid, assert the name's exact message. On a database
   with no users table, invalid names still yield validation errors, not the
   generic database failure. Compare all records before/after rejected calls.
3. **Email validation and final-length boundaries.** Reject the invalid examples,
   non-strings, blank strings, internal spaces/tabs/newlines, U+0000, and a
   normalized 65-code-point address. Accept `a@b.c` and a valid 64-code-point
   address. Accept outer whitespace after trimming. Verify a Unicode address
   whose lowercase form grows beyond 64 code points is rejected; a shorter valid
   growing form is stored normalized. Invalid email must precede missing-table
   errors. All rejected calls preserve records.
4. **Duplicates preserve data.** Create once, then try the same email, uppercase
   variants, and surrounding whitespace. Each yields `Email is already used`;
   the original user's complete data, timestamps, and row count stay unchanged.
5. **Insertion-time unique failure.** In an isolated fixture, force the real
   insertion query to violate the email UNIQUE constraint after a lookup reports
   no owner. Use a test-only SQLite trigger, not a new application injection API:
   on an outer insertion, it inserts the same email first. Expect the business
   duplicate error, and no surviving trigger-inserted row after statement rollback.
   Disable recursive triggers explicitly for this fixture. Keep trigger creation
   outside the implementation; do not call this full concurrency testing.
6. **Unexpected database failures.** Test missing table, closed connection,
   query-only insertion, and a fixture trigger that aborts for a non-unique reason.
   Assert the exact generic create error and absence of exposed SQLite details
   or cause. Query-only/aborted inserts leave the record snapshot unchanged.
   These tests must distinguish duplicate constraints from other write failures.
7. **Actual terminal client.** Extract and run its JavaScript heredoc in a child
   Node process as in spec 001, using the exact call specified above. Verify:
   - Initialized database, first run: exit 0 and a printed plain user with name
     `Ada Lovelace`, email `ada@example.com`, generated ID, and UTC timestamps.
   - Second run with the same database: exit 1 and exactly
     `Email is already used` as the application error message; no extra row.
   - Connection opens but the users table is missing: exit 1 and exactly
     `Could not create the user`; do not create the table automatically.
   - Database cannot open: exit 1 and exactly `Could not open the database`.

   Success prints no application error; failures print no successful user,
   SQLite details, or stack trace. Observe connection closure after
   success and failure by attempting a query after the client completes. Opening
   failure has no acquired connection. Do not suppress the normal Node warning.
8. **Regression, isolation, and completion.** `npm test` must run both specs'
   checks successfully. Confirm spec 001 initialization remains repeatable after
   user creation, temporary copies are removed, and working database files are
   not created or modified by testing. Map each numbered check to test evidence
   in this document when implementation is later authorized.

## Exclusions and review

No update/delete/list business operations, public email-lookup operation, schema
changes, migrations, seeded contacts, notebook/frontend/HTTP integration,
authentication, dependencies, or commits/pushes. Internal email lookup is only
used by creation here. No helpers or empty future-feature files are scaffolded.

The public contract comes from the approved constitution. Miguel approved the
internal query signatures, filenames, manual-client presentation, and acceptance
checks with this specification on 2026-10-19. No acceptance checks have been
executed at plan approval. Implementation was subsequently authorized; see the
acceptance results below for executed evidence.


## Approved implementation plan

1. **Record the authorized execution stage.** When Miguel requests implementation,
   update the stage notices in `AGENTS.md`, `docs/CONSTITUTIONS.md`, and this
   specification. Preserve the approved contracts and specification 001 behavior.
   Check the branch and local changes; work only inside `first-app-ssd`.
2. **Add the concrete queries.** Create
   `queries/sql/find-user-by-email.js` and `queries/sql/insert-user.js`, each
   exporting one SQL string with named parameters and explicit columns.
   Extend `queries/users.js` with `findByEmail(email)` and
   `insertUser(name, email)`. Prepare statements inside calls and reuse `db`.
   Keep initialization unchanged; add no validation, output, or lifecycle code
   to the queries. Verify real lookup/insert behavior through temporary fixtures.
3. **Implement one business operation.** Add `logic/create-user.js` exporting
   `createUser(name, email)`. Validate in the approved order, normalize before
   length checks, check duplicate ownership, insert, and construct the exact
   plain user response. Catch database calls narrowly. Translate insertion-time
   email uniqueness failures using SQLite's specific constraint classification,
   not broad message matching or every constraint failure. Expose only the
   approved ordinary Error messages. No shared validation framework or new
   database abstraction is needed.
4. **Add the actual terminal example.** Create
   `clients/terminal/create-user.txt` with the exact Ada call, initialization
   prerequisite, working-directory instructions, and warning about real writes.
   Use dynamic imports inside `try`, print the plain successful user, print only
   error messages on failure, set exit status, and close an acquired connection
   in `finally`. Do not initialize tables inside this client.
5. **Implement the eight acceptance checks.** Add `test/create-user.test.js`
   using Node's built-in runner and disposable project copies. Cover exact
   output shape, persistence, normalization, validation precedence/boundaries,
   unchanged data after rejection, duplicate failures, sanitized database
   failures, and the actual terminal snippet's output/status/cleanup.
   Verify the test-only trigger fixture actually reaches an email UNIQUE error
   after a successful no-owner lookup; do not weaken the test to accept generic
   failures. Keep fixture triggers out of application code.
6. **Run regressions and record evidence.** Run `npm test` from the project root,
   executing initialization and create-user checks together. Include repeated
   initialization after creation. Tests must preserve any existing working
   database and remove temporary copies. If the earlier isolation assertion
   assumes no working database exists, change only that test assertion to
   compare before/after state instead; preserve its original isolation intent.
   Record pass/fail evidence for acceptance checks 1–8 in this specification,
   explain changes and commands, then stop. No later business operations.

Verification command, from `staff/miguel-rodriguez/first-app-ssd`:

```sh
npm test
```

The test runner will execute the real terminal snippets inside temporary copies;
manual writes to the working database are not necessary for verification.
Expected: all existing initialization checks and all new create-user checks
pass, with no changes to the working database. Executed results follow. Do not install dependencies, create branches, commit, push, or open
pull requests as part of implementation.


## Acceptance results — 2026-10-19

Command executed from `staff/miguel-rodriguez/first-app-ssd`: `npm test`.
Result: **17 tests passed, 0 failed** (8 for this feature, 9 spec 001 regressions).

| Check | Result | Executed evidence |
| --- | --- | --- |
| 1 | PASS | Exact plain object fields, normalized values, safe ID, UTC bounds/defaults, silent business call, new-process persistence, bound SQL with quoted name |
| 2 | PASS | Invalid primitive/object types, blank and null-character names, code-point boundaries, precedence before missing-table queries, unchanged rows |
| 3 | PASS | Email shape/types, 64/65 boundaries, Unicode lowercase expansion, outer whitespace normalization, unchanged data, validation before missing-table errors |
| 4 | PASS | Same/uppercase/outer-whitespace duplicate attempts preserve full original row snapshots |
| 5 | PASS | Fixture's direct real insertion confirmed ERR_SQLITE_ERROR/2067; business call translated it to the duplicate message; statement rollback left zero rows |
| 6 | PASS | Missing table, closed connection, query-only insertion, and non-unique trigger failure produced sanitized create errors; rejected writes preserved snapshots |
| 7 | PASS | Actual terminal heredoc succeeded then rejected duplicate; missing-table and opening failures had exact messages/status; acquired connections closed |
| 8 | PASS | Initialization remained repeatable after creation; temporary copies were deleted; original working database state was preserved; all 001 tests passed |

Implementation adds the two concrete SQL files, query exports, one create-user
business operation, the actual terminal example, and acceptance tests. Existing
initialization behavior and schema were not changed. The previous initialization
isolation assertion was changed from requiring no original database to comparing
its before/after state, so manual use of the app does not invalidate tests.

No working database was created during this run. No dependencies were installed.
No update, delete, list, or public email-lookup operation was implemented. All
work remains local; no branch creation, commit, push, or pull request was made.


## Cross-feature review corrections — 2026-10-19

Miguel authorized fixing the full-project review findings. Queries now explicitly
alias all five result columns, including camelCase timestamps. Creation rejects
malformed Unicode using the pinned runtime's `String.isWellFormed()` before
normalization. The constitution and draft 003 record this input-contract amendment.
Library-call checks now assert silent stderr as well as stdout, allowing only
Node's expected SQLite warning.

Executed `npm test`: **19 passed, 0 failed**. The two added regressions verify
creation and lookup on an accepted all-lowercase schema, and rejected unmatched
UTF-16 surrogates with unchanged records while valid emoji remain accepted.
All earlier acceptance checks still pass. No update operation was implemented;
003 remains draft. Verification used temporary copies and preserved the working
database state. No Git mutations or dependencies were introduced.
