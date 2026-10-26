# 006 — Find a user by email

> Historical implementation record: Miguel removed .gitignore, .nvmrc, README.md, and automated tests on 2026-10-19. References below to those files and npm test describe the earlier verified stage. Current verification uses clients/terminal/ in a disposable copy with Node 24.12.0.

Status: **approved by Miguel on 2026-10-19**. Specifications 001–005 are implemented.
Miguel authorized implementation on 2026-10-19. Scope: email lookup only.
Implemented and verified; acceptance results are recorded below.

## Goal and prerequisites

Provide synchronous `findUserByEmail(email)` in `logic/find-user-by-email.js`.
Find one contact in the fixed initialized SQLite database using the existing
concrete `findByEmail(email)` query. Node 24.12.0 and prior explicit initialization
are required. This is a read-only exact normalized-email lookup, not partial
search. It never creates tables, contacts, or a new connection itself. Importing
the shared connection retains spec 001's file-opening behavior.

## Input and validation order

Apply the same approved email rules as creation/update, before preparing or
executing any query:

1. Require a primitive string and well-formed Unicode (no unmatched UTF-16
   surrogates); otherwise throw `Email is invalid`.
2. Trim outer whitespace and lowercase using JavaScript trim/toLowerCase before
   length or format checks. Do not remove internal whitespace, normalize Unicode
   to NFC, strip accents, or apply provider-specific email rewriting.
3. Require at most 64 Unicode code points, exactly one @, a nonempty local part,
   and at least two nonempty dot-separated domain labels. Reject any remaining
   whitespace or U+0000. All failures throw `Email is invalid`.

Examples: a@b.c is valid; a@b, a@.b, a@b., a@b..c, a@@b.c, and a b@c.d are
invalid. This basic shape rule is not full email-standard or mailbox verification.
Arrays, boxed strings, null/undefined, booleans, and numbers are invalid inputs.
A valid surrogate pair such as emoji is supported. Count code points after
lowercasing, including any expansion. Invalid input takes precedence over a
missing user/table or closed-connection query error. Opening the connection on
module import still occurs before a business function can run.

## Result, read-only behavior, and errors

Call the existing query with the normalized email. If it returns undefined,
throw ordinary `Error("User not found")`; do not return undefined, null, or [].
On success explicitly construct a new ordinary object with exactly these fields:
`{ id, name, email, createdAt, updatedAt }`.

Return stored values verbatim. Only the lookup input is normalized; do not repair
or renormalize the stored record. Matching uses the existing table's NOCASE
collation after JavaScript normalization. Do not promise full Unicode case
folding or canonical-equivalence matching. Contacts created through application
writes already have normalized emails.

Each successful call returns a fresh detached object. Mutating it cannot affect
stored data or another lookup result. No row, timestamp, or schema changes;
no console output, process exit, connection management, result wrappers, or
custom error classes inside business logic.

| Condition | Exact ordinary Error message |
| --- | --- |
| Invalid input type, Unicode, length, or format | `Email is invalid` |
| Valid normalized email has no matching user | `User not found` |
| Database query/preparation fails | `Could not find the user` |

Catch only the query call for database-error translation. Do not mask validation
or missing-user errors, expose SQLite text, attach the original cause, or add
error codes. A missing table or closed connection with valid input produces
the generic lookup error, never User not found. Opening failure remains
`Could not open the database`, caught by the client before the business call.

## Query reuse and separation

Reuse `findByEmail(email)` in `queries/users.js` and its existing parameterized
SQL in `queries/sql/find-user-by-email.js`. No additional query or SQL file is
needed. These already select explicit canonical aliases and work with accepted
schema capitalization variants. Do not change their behavior or any existing
operation. No shared validation framework or database abstraction is introduced;
keep the one operation's steps readable and consistent with creation/update.

## Terminal client and examples

Proposed file: `clients/terminal/find-user-by-email.txt`, one copyable Node
heredoc. Document project root staff/miguel-rodriguez/first-app-ssd, pinned Node version, and the
separate initialization/create-user examples. Creating a contact is required
only for the successful demonstration, not an implicit action of the client.
The exact lookup call is:

```js
findUserByEmail(" ADA@EXAMPLE.COM ");
```

Acquire db using dynamic import inside try, import/call the business function,
print the plain user with console.log(user), and close an acquired connection
in finally. Success exits 0. Catch failures with console.error(error.message)
and exit status 1. Failures print no successful data or raw stack. Node's normal
SQLite warning may additionally appear. The client does not initialize or seed.

After the existing creation example succeeds, lookup returns Ada's stored
record. If Ada was deleted or her email changed, User not found is expected;
edit the sample email to a known current address or explicitly create the
sample contact separately. Repeated successful lookup is allowed without writes.

## Numbered acceptance checks

Use Node's built-in runner with disposable project copies and the fixed database
path. Initialize/create fixtures explicitly; inspect records using test SQL.
Run the actual terminal snippet, not reimplemented client logic. Remove all
copies afterward and preserve the original working database state.

1. **Successful normalization, exact shape, and casing.** Create a contact using
   approved creation; look up its email with exact, uppercase, and outer-whitespace
   variants. Verify exact five own keys, Object.prototype, stored values, Unicode,
   and UTC timestamps. Repeat using the accepted lowercase schema. Reopen in a
   new process and confirm lookup of persisted data. Ensure lookup of a different
   contact selects only that contact rather than the first record.
2. **Validation boundaries and precedence.** Cover the invalid types/formats
   above, U+0000, internal spaces/tabs/newlines, unmatched high/low surrogates,
   65 normalized code points, and lowercase expansion beyond 64. Valid a@b.c,
   a 64-code-point address, a shorter expanding Unicode address, and emoji pairs
   must pass validation and find their explicitly created fixtures. Invalid input
   with missing table/closed connection still yields Email is invalid. Snapshot
   initialized data around rejected calls to confirm no changes.
3. **Not found versus database failure.** Valid absent email yields exactly
   User not found on initialized tables, both empty and populated. Missing table
   or closed connection yields Could not find the user. Verify ordinary Error,
   no cause/code/raw SQL details, no error-to-empty-result fallback, and no hidden
   table creation. Use the SQL-looking but shape-valid address
   `x'OR'1'='1@x.com` and verify it is treated as a bound value: it must return
   User not found rather than another contact. Then explicitly create that
   address through the application and verify lookup returns only that contact.
4. **Read-only, detached output, and silence.** Snapshot all rows and schema;
   repeat lookup with PRAGMA query_only = ON. Mutate the returned object's
   fields; subsequent lookup and snapshots stay unchanged, and distinct calls
   return distinct objects. For a test-SQL fixture, store name ` Ada ` and email
   `ADA@EXAMPLE.COM` without surrounding email whitespace. Lookup using
   ` ada@example.com ` must return those exact stored values, preserving name
   spacing and email case through NOCASE matching. Do not use an email with
   stored outer whitespace as a successful-lookup fixture: input trimming does
   not trim stored database values. Library stdout/stderr must be silent except the normal
   Node warning. Restore test-only query mode afterward.
5. **Actual client, regressions, and isolation.** Extract/execute the real
   heredoc. Verify normalized successful user output and exit 0; empty/populated
   missing-user cases print exactly User not found with exit 1; missing table
   prints Could not find the user; opening failure prints Could not open the
   database. Failures print no successful user or stack. Check acquired
   connections close after success/failure. Run npm test with all existing 38
   tests, verify temporary cleanup/unchanged working database state, and record
   evidence for checks 1–5 only after implementation authorization.

## Exclusions and review

No schema/query migration, arbitrary/partial search, filtering, pagination,
new CRUD behavior, authentication, notebook/frontend/HTTP integration, extra
dependencies, Git mutations, or empty future-feature scaffolding. The plan below
has been executed.

Miguel approved this specification, query reuse, exact manual example, and
acceptance checks on 2026-10-19, then separately authorized implementation.
All five lookup checks passed; executed evidence follows.


## Approved implementation plan

1. **Record authorization when execution starts.** Update stage notices in
   `AGENTS.md`, the constitution, and this specification. Confirm the local branch
   and changes. Restrict edits to `first-app-ssd`; preserve all existing contracts.
2. **Implement one business function.** Add `logic/find-user-by-email.js` with
   synchronous `findUserByEmail(email)`. Validate primitive string type and
   well-formed Unicode, normalize, and check the approved format/code-point
   length before querying. Reuse existing `findByEmail` and its named-parameter
   SQL unchanged. Catch only database query errors with the agreed generic
   message; handle missing users separately. Construct the five-field plain
   result explicitly. No writes, extra SQL, shared validation framework,
   connection lifecycle code, or output.
3. **Add the actual terminal example.** Create
   `clients/terminal/find-user-by-email.txt` with the exact Ada lookup, working
   directory/runtime/initialization prerequisites, and explanation of absent
   or changed sample contacts. Use dynamic imports in try, print the successful
   user, handle exact errors and exit status, and close acquired db in finally.
   Do not initialize or create contacts inside the lookup client.
4. **Add five acceptance checks.** Create `test/find-user-by-email.test.js` with
   temporary project copies. Cover normalization, exact plain result and
   persistence, accepted lowercase schema, validation/Unicode boundaries and
   precedence, missing-user versus database failures, bound SQL-looking values,
   read-only query mode, detached objects, stored-value preservation, silent
   library stdout/stderr, and actual client output/status/cleanup. Reuse existing
   application creation for ordinary fixtures; use test SQL only when needed.
5. **Verify and record results.** Run `npm test` from `staff/miguel-rodriguez/first-app-ssd`, retaining
   all existing 38 tests. Confirm temporary cleanup and unchanged working database
   state. Record pass/fail evidence for acceptance checks 1–5 here and explain
   changes and commands actually executed. Stop after verified email lookup.

Verification command:

```sh
npm test
```

The approved lookup-only plan is complete. Do not install dependencies, change
database/query contracts, create branches, commit, push, open pull requests,
or add notebook/frontend/HTTP integration. Stop after verified lookup.


## Acceptance results — 2026-10-19

Executed `npm test` from `staff/miguel-rodriguez/first-app-ssd` on Node 24.12.0.
**43 tests passed, 0 failed**: five lookup checks plus all 38 prior tests.

| Check | Result | Executed evidence |
| --- | --- | --- |
| 1 | PASS | Exact/uppercase/trimmed lookup, five-field plain object, correct contact, Unicode, canonical aliases with lowercase schema, persisted new-process lookup |
| 2 | PASS | Invalid types/formats, null characters, malformed Unicode, normalized length/expansion boundaries, valid Unicode fixtures, validation before missing/closed queries, unchanged records |
| 3 | PASS | Empty/populated missing-user errors distinct from missing/closed database errors, no implicit setup, exact SQL-looking bound-value absent/matching behavior |
| 4 | PASS | Query-only reading, detached mutation, stored name spacing/email case preserved, snapshots unchanged, library stdout/stderr silent except runtime warning |
| 5 | PASS | Actual terminal success/repeat success and empty/populated/missing-table/opening failures, exact messages/status, connection cleanup, original state preserved, temporary copies removed, all regressions pass |

Added `logic/find-user-by-email.js`, its actual terminal example, and
`test/find-user-by-email.test.js`. Reused existing queries and SQL unchanged.
No working database was created. No dependency, branch, commit, push, pull
request, or integration was added. Stop here after verified lookup.
