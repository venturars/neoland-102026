# 001 — Database initialization

> Historical implementation record: Miguel removed .gitignore, .nvmrc, README.md, and automated tests on 2026-10-19. References below to those files and npm test describe the earlier verified stage. Current verification uses clients/terminal/ in a disposable copy with Node 24.12.0.

Status: **specification approved by Miguel on 2026-10-19**.
Miguel authorized execution of the implementation plan on 2026-10-19.
Scope: database initialization only. Implemented and verified on 2026-10-19;
acceptance results are recorded below. No further feature work is authorized.

## Goal and scope

Establish the Node ES-module setup, open the fixed SQLite database, and provide
an explicit, repeatable table-initialization operation. This feature creates no
contacts. It prepares the storage used by later approved business features.

Prerequisites: the approved constitution and a writable project copy. Node is
installed separately; initialization must not install software or packages.

## Approved choices left open by the constitution

- Pin Node **24.12.0** in `.nvmrc` and `package.json` engines; use
  `"type": "module"` and built-in `node:sqlite`. No external dependencies.
- Initialization API: named export `createUsersTable()` from `queries/users.js`.
  It takes no arguments, runs synchronously, returns `undefined`, and prints
  nothing. SQL text is exported separately from `queries/sql/create-users-table.js`.
- Provide `clients/terminal/create-users-table.txt`, copied into a terminal from
  the project root. Do not add an npm initialization command in this feature;
  the copyable client is the explicit manual entry point used in class.
- Provide `npm test` using Node's built-in runner for acceptance checks. No lint,
  formatter, ORM, migration framework, or installation step is required.
- Use a `STRICT` table: SQLite enforces declared storage types. Support exactly
  the schema created by this specification, allowing formatting and keyword
  capitalization differences as described below.

These choices were approved with specification 001.

## Database and connection

`db/connection.js` exports `db`, a single `DatabaseSync` instance opened at
`db/users.sqlite`, resolved using the module's location. Different terminal
working directories must not create a second database. Importing this module
may create the file but does not create the users table.

If opening fails, throw an ordinary `Error("Could not open the database")`
without attaching the SQLite error. The client must import the connection inside
its `try` block so opening failures are caught. It imports the query module only
after acquiring the connection and closes that connection in `finally`.
Repeated imports during one process reuse the module and its connection.
Starting another invocation starts another process; it does not reuse a closed
connection. Initialization never closes the caller's connection.

Ignore `db/users.sqlite` and its journal/WAL/SHM sidecar files in Git; retain
`db/connection.js`. No generated database belongs in the commit.

## Table contract

The separate SQL string defines this one statement:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 9007199254740991),
  name TEXT NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 100),
  email TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (length(trim(email)) BETWEEN 3 AND 64),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;
```

SQLite generates IDs when the ID is omitted or explicitly NULL; both are valid.
NULL is rejected for `name`, `email`, `createdAt`, and `updatedAt`. Timestamp
omission uses the default; explicit NULL does not. There is no `AUTOINCREMENT`.
The ID bound matches positive
JavaScript safe integers. Name/email lengths count Unicode code points. SQLite
checks are storage safeguards, not full normalization or email validation; later
business features trim names, normalize/validate emails, and reject null
characters before writes.

Both timestamp defaults use UTC and second precision. Initialization supplies
only insertion defaults; it does not add an update trigger. Refreshing
`updatedAt` belongs to the later update feature. It never modifies `createdAt`.

## First run, repeat run, and compatibility

`createUsersTable()` looks up tables/views named `users` in `sqlite_schema`
using case-insensitive ASCII name matching (`name = :name COLLATE NOCASE`, with
`:name` bound to `users`) before making changes. An existing `USERS` or `Users`
object must therefore be inspected rather than treated as missing. Only tables
and views participate in this lookup. The inspection SQL also lives in its own
file under `queries/sql/`.

- No `users` object: execute the approved CREATE statement and return undefined.
- Existing matching table: return undefined without altering schema or records.
- Existing view or different table named `users`: throw the incompatibility
  error; do not alter or drop anything.

Compatibility is deliberately bounded; this is not a general schema-equivalence
checker. Require object type `table`, then compare its stored CREATE SQL with the
approved statement using this small normalization on each string:

1. Ignore whitespace outside single-quoted string literals.
2. Ignore capitalization outside string literals, including SQL keywords and
   unquoted column/table names. Preserve literal contents exactly.
3. Remove the optional `IF NOT EXISTS` after `CREATE TABLE` and one final
   semicolon. Handle doubled single quotes inside a literal without treating
   them as the end of the literal.

Consequently indentation, line breaks, spacing, and keyword capitalization do
not cause a rejection. A change to a column, constraint, collation, or timestamp
literal does. Compare the entire definition, not only the presence of selected
substrings. Do not strip whitespace or lowercase inside quoted values.

This feature supports only definitions that match after the listed normalization.
Quoted identifiers, SQL comments, reordered constraints, and alternate expressions
are unsupported and must produce the incompatibility error, even if semantically
equivalent. This is a literal-definition compatibility contract, not a SQL
semantics check. That limitation is intentional
and must be stated in the manual client's instructions. No full SQL parser or
migration framework is required. Additional unrelated tables are left alone.
This feature does not scan existing row contents or detect separately installed
indexes/triggers; it supports the defined table, not externally customized
schemas. Acceptance checks verify the actual constraints of the generated table.

No alteration, deletion, table replacement, seed insertion, or data migration is
performed. Concurrent initialization/schema changes are outside this exercise.

## Exact errors and terminal presentation

| Condition | Ordinary Error message |
| --- | --- |
| Connection cannot open | `Could not open the database` |
| Existing users object has an incompatible definition | `Users table schema is incompatible` |
| Inspection or creation fails for another database reason | `Could not initialize the database` |

Do not accidentally catch and replace the incompatibility error with the generic
one. No raw SQL errors, database `cause`, or stack traces are printed by the
client. Library functions do not write to either output stream.

The manual client prints `Users table is ready` to standard output on success
and exits with status 0. On failure it prints only the relevant message to
standard error and sets exit status 1. Node's own experimental SQLite warning
may additionally appear; do not suppress it or confuse it with an application
failure. The client always closes an acquired connection in `finally`.

## Manual examples

From `staff/miguel-rodriguez/first-app-ssd`, select Node with `nvm use` if nvm is installed;
otherwise select Node 24.12.0 using the user's existing installation method.
Check with `node --version`. Copy the complete initialization client into the
terminal. It imports `db`, calls `createUsersTable()`, and prints:

```text
Users table is ready
```

Copying the client again produces the same message and preserves existing rows.
An incompatible pre-existing users table instead prints:

```text
Users table schema is incompatible
```

Successful completion means the table is available, not that any contacts exist.

## Numbered acceptance checks

The checks below are acceptance requirements. Execution evidence is recorded
in the results section; the requirements alone do not imply a pass. Automated database checks use disposable project copies, each
with its own fixed `db/users.sqlite`. Run client examples in child Node processes
and remove temporary copies afterward. Test fixtures may use SQL directly; that
does not authorize application CRUD query functions or seed commands.

1. **Runtime/module setup.** From the project run `node --version` and
   `node --input-type=module -e "import { DatabaseSync } from 'node:sqlite'; console.log(typeof DatabaseSync)"`.
   Expect `v24.12.0` and `function`; a normal `.js` ESM import must also work
   under the project's `package.json`, without an experimental CLI flag.
2. **Connection alone.** In a fresh temporary copy, import the connection and
   inspect `sqlite_schema`; expect the database file at the fixed path, no users
   table, no application output, and identical connection objects on repeated
   imports. Close the connection afterward.
3. **Fresh initialization.** Execute the complete manual client in a fresh copy.
   Expect status 0, the success message, exactly the defined users schema, and
   zero rows. A direct call returns `undefined` and emits no application output.
4. **Repeat with data.** After initialization, insert a valid fixture via test SQL
   (explicit ID 7, name Ada, email ada@example.com). Snapshot every column and the
   stored schema, then run the client twice in new processes. Expect success and
   identical snapshots, including IDs and timestamps.
5. **Storage safeguards/defaults.** In an isolated initialized database, insert
   valid rows with omitted IDs/timestamps. Expect generated positive safe IDs,
   timestamps in `YYYY-MM-DD HH:MM:SS` matching SQLite's UTC date/time. Capture
   `datetime('now')` immediately before and after insertion on the same connection;
   each default timestamp must fall inclusively between those values. Creation
   and update timestamps must match on insertion. No timing tolerance or sleep
   is needed. Verify omitted and explicitly NULL IDs both generate valid IDs.
   Reject explicit NULL separately for name, email, createdAt, and updatedAt;
   reject name/email length overflow, blank names, zero/negative/unsafe IDs, and
   an ASCII case-variant duplicate email. Each
   rejected insert must leave the prior records unchanged. Verify valid boundary
   lengths (100 name, 64 email) and Unicode code-point counting.
6. **Incompatible object.** In separate copies create (a) a three-column users
   table containing a fixture, (b) a view named users, and (c) an otherwise
   matching table with a different constraint/default. Run the client. Expect
   status 1 and the exact incompatibility message; all pre-existing schema and
   records remain unchanged. Separately create the approved table with altered
   indentation, line breaks, spacing, and keyword capitalization; expect success
   with unchanged schema/rows. Repeat with tables named `USERS` and `Users`:
   equivalent supported definitions must succeed, while an incompatible table
   or view under either case variant must fail without changing it. Change the timestamp literal from `'now'` to
   `'NOW'` to verify literal contents remain significant; expect incompatibility.
   Separately test quoted identifiers, an internal SQL comment retained in the
   stored definition, reordered constraints, and an alternate CHECK expression.
   Each must produce the incompatibility error without changing schema/records;
   do not accept them by guessing semantic equivalence.
7. **Other database failures.** Use an isolated fixture with the connection set
   query-only and no users table; calling initialization must throw the generic
   initialization error with no raw SQLite details. Use an isolated copy where
   `db/users.sqlite` is a directory to force an opening failure; the client must
   exit 1 with the exact opening-error message, not an uncaught import stack.
8. **Paths, actual client, and cleanup.** The `.txt` client contains a comment
   and exactly one `node --input-type=module <<'EOF'` block. The test extracts
   the JavaScript between that block's delimiter lines and runs the exact text
   with `process.execPath --input-type=module`, setting `cwd` to the temporary
   project root. It must not duplicate or rewrite the client's error handling.
   To observe cleanup, append test-only JavaScript after that text which imports
   the same `db` and verifies that preparing/executing `SELECT 1` throws a
   closed-database error instead of returning a row. Do this after success and
   incompatibility. For initialization failure, prepend test-only JavaScript
   that imports the same `db` and executes `PRAGMA query_only = ON` before the
   client; after its failure, assert the connection is closed. Opening failure
   has no acquired connection to close. The process must retain the client's
   expected exit status and output in each scenario.

   Separately run a short test script from an unrelated temporary working
   directory, using absolute file URLs to import the temporary project's actual
   connection and query modules. Call initialization and close `db` in `finally`.
   Verify the expected database exists only at the project-relative path and no
   SQLite file appears in that unrelated directory. This checks module path
   resolution; the copyable manual snippet itself still requires the project
   root as documented. No writes reach the original project's database.
9. **Runnable checks and Git hygiene.** `npm test` must execute these checks and
   succeed. Verify Git ignores the generated SQLite file and its sidecars while
   keeping the connection source visible. Do not initialize a Git repository or
   stage files just to test ignore patterns; use `git check-ignore --no-index`
   against the project patterns in the existing repository when appropriate.

## Exclusions and review

No application CRUD operations, seed data, migrations, notebooks, frontend,
HTTP API, authentication, alternate databases, or extra dependencies. No empty
feature scaffolding. Implementation is limited to the approved plan below.

Miguel approved the runtime, initialization API, strict schema, bounded
compatibility policy, and client presentation with specification 001 on 2026-10-19. The bounded comparison
accepts formatting/capitalization differences, not every semantically equivalent
SQL definition. It introduces no migrations or extra application connections.

Documentation self-review after revision: formatting-compatible matching,
case-insensitive table/view lookup, explicit NULL behavior, deterministic rejection
of unsupported definitions, execution of the actual terminal snippet, observable
connection cleanup, and precise timestamp expectations are now specified. These are requirements only;
their execution results are recorded separately below.


## Approved implementation plan

1. **Record the execution stage when implementation is authorized.** Update the
   stale draft/stage notices in `AGENTS.md` and `docs/CONSTITUTIONS.md` to reflect
   specification 001 approval and the newly authorized scope. Do not amend their
   application contracts. Check the branch and local changes before editing.
2. **Establish the runtime.** Add `.nvmrc`, `package.json` with ES modules and
   `test: node --test`, and `.gitignore` with exact database/sidecar exclusions.
   No dependencies, installation, or unrelated scripts. Verify acceptance 1 and
   the ignore rules in acceptance 9.
3. **Add the connection.** Create `db/connection.js` with the one module-relative
   database path, exported connection, and sanitized opening error. Verify
   acceptance 2 and the opening-failure portion of 7 in disposable copies.
4. **Add initialization.** Create `queries/sql/create-users-table.js` and
   `queries/sql/find-users-schema.js`, each exporting one SQL string. Create
   `queries/users.js` with `createUsersTable()`. Keep the small definition
   normalization local to that module; no generic SQL library. Prepare queries
   only inside calls, preserve literal contents, distinguish incompatible schema
   from database failures, and never migrate data. Verify acceptance 3–7.
5. **Add the actual terminal client.** Create
   `clients/terminal/create-users-table.txt` with the approved working-directory
   instructions, compatibility limitation, and one copyable heredoc. Use dynamic
   imports inside `try`, print the exact success/error message, set exit status,
   and close any acquired connection in `finally`. Verify the actual snippet,
   path independence, and cleanup as defined in acceptance 8.
6. **Complete acceptance tests.** Add `test/database-initialization.test.js`
   using Node built-ins and isolated temporary project copies. Cover acceptance
   1–9, including supported/rejected definitions, NULL semantics, boundaries,
   data preservation, exact client output/status, and connection closure. Do not
   copy any working database into fixtures. Remove temporary files in cleanup.
7. **Verify and report.** Run the commands below, execute the real terminal
   snippet in a disposable copy, and record a pass/fail result for each numbered
   acceptance check here. Report what ran and any remaining limitations. Stop
   after initialization; do not scaffold or implement user operations.

Verification commands, run from `staff/miguel-rodriguez/first-app-ssd`:

```sh
node --version
node --input-type=module -e "import { DatabaseSync } from 'node:sqlite'; console.log(typeof DatabaseSync)"
npm test
git check-ignore --no-index db/users.sqlite db/users.sqlite-journal db/users.sqlite-wal db/users.sqlite-shm
```

Expected: Node `v24.12.0`, output `function`, all acceptance tests pass, and all
four generated database paths are ignored. Separately confirm
`db/connection.js` is not ignored (that single-path check should exit 1).
Do not initialize the learner's working database during automated verification.


## Acceptance results — 2026-10-19

Executed using Node v24.12.0. `npm test` ran all nine named acceptance tests:
**9 passed, 0 failed**. Database operations and actual terminal-client execution
used disposable project copies; cleanup removed them. The working
`db/users.sqlite` does not exist. No dependencies were installed.

| Check | Result | Evidence |
| --- | --- | --- |
| 1 | PASS | Exact Node version, pinned files, built-in SQLite, ordinary `.js` ESM execution |
| 2 | PASS | Connection-only import creates fixed file but no table; repeated imports reuse connection |
| 3 | PASS | Actual client prints success, returns exit 0, creates empty STRICT table; API returns undefined silently |
| 4 | PASS | Two new-process client runs preserve full row and schema snapshots |
| 5 | PASS | Generated/NULL IDs, required NULL rejection, safe bounds, case-variant duplicates, UTC defaults, Unicode boundaries; rejected inserts preserve rows |
| 6 | PASS | 18 definition fixtures: supported spacing/case variants accepted; incompatible/unsupported forms rejected; schema, rows, and unrelated table preserved |
| 7 | PASS | Opening, query-only creation, and closed-connection inspection failures have sanitized messages |
| 8 | PASS | Actual snippet closes on success/incompatibility/initialization failure; module-relative imports work from another directory; original database untouched |
| 9 | PASS | `npm test` succeeds; four generated database paths ignored; connection source not ignored |

Commands actually executed from the project root:

```sh
node --version
node --input-type=module -e "import { DatabaseSync } from 'node:sqlite'; console.log(typeof DatabaseSync)"
npm test
git check-ignore --no-index db/users.sqlite db/users.sqlite-journal db/users.sqlite-wal db/users.sqlite-shm
```

Also verified `git check-ignore --no-index db/connection.js` exits 1 (source is
not ignored), and directly checked that the working database file is absent.
The first test run passed 8/9: a fixture with deliberately invalid timestamp
defaults failed while inserting its test row. Giving that fixture explicit
historical timestamps fixed test setup; the complete rerun passed 9/9.

Known limits remain as approved: definition matching is intentionally bounded,
not a general SQL-equivalence check; concurrent schema changes and migrations
are not supported. Node prints its normal experimental SQLite warning. Stop
at this completed initialization feature; no CRUD operations were created.


Cross-feature review amendment — 2026-10-19: accepted column capitalization
variants must also work with business queries. Query SELECT/RETURNING expressions
use explicit canonical aliases. The regression test in `test/create-user.test.js`
creates an all-lowercase accepted schema and checks both inserted and looked-up
timestamp values and keys. Silent-library checks now inspect stderr as well as
stdout, excluding only Node's expected SQLite warning.
