# AGENTS.md — first-app

How to write code in this app. [CONSTITUTION.md](docs/CONSTITUTION.md) defines the structure, libraries and error contract, and wins on any of those topics. This file does not repeat them.

## Rules

- Read [CONSTITUTION.md](docs/CONSTITUTION.md) and this file before any code change.

## Commands

Run from `staff/victor-chang/first-app`:

```
node --no-warnings client/terminal/index.js create <name> <email>
node --no-warnings client/terminal/index.js list
node --no-warnings client/terminal/index.js get <id>
node --no-warnings client/terminal/index.js update <id> <name> <email>
node --no-warnings client/terminal/index.js delete <id>
DEBUG=1 node --no-warnings client/terminal/index.js <command> ...   # print stack and cause on error
DB_PATH=/tmp/other.db node --no-warnings client/terminal/index.js list # use another database file
npx prettier --write .                                                # format every file
npx prettier --check .                                                # check formatting without changing files
npm test                                                              # run every test
node --no-warnings --test --test-name-pattern="CU-7" "test/**/*.test.js" # run one scenario's test
```

`--no-warnings` only hides Node's experimental notice for `node:sqlite`. Delete `db/users.db` to start from an empty database. Run tests through `npm test` (or the explicit glob), not a bare `node --test`: Node treats every `.js` file under `test/` as a test, including helpers.

## Naming

- Files and folders are kebab-case. A file exports a single function and is named after it: `create-user.js` exports `createUser`. Only exceptions: `index.js` (aggregators), `errors.js` (all error classes) and the uppercase docs (`AGENTS.md`, `CONSTITUTION.md`, `README.md`).
- Functions, variables and parameters are camelCase; fixed module-level configuration (paths, patterns, code maps) is `UPPER_SNAKE_CASE`.
- Use-cases in `logic/` are named for the business action: `create`, `get`, `list`, `update`, `delete` + entity (`createUser`).
- Database operations in `query/` are named for the data action: `find`, `insert`, `modify`, `remove` + entity (`findUserById`, `findAllUsers`). Never reuse a `logic/` name in `query/`.
- Error classes end in `Error`; error codes are `UPPER_SNAKE_CASE`.

## How code is written

- Curried factories: the dependency first, then the arguments — `export const getUser = (queries) => (id) => { ... }`.
- Named exports only, no default exports.
- No classes except errors. Plain objects in, plain objects out.
- Formatting is Prettier's default config, with no config file and no overrides. Run `npx prettier --write .` before committing; never format by hand against it.
- One responsibility per function; keep functions short enough to read at a glance.
- Comments only when the _why_ is not obvious from the code.

## Error handling

The error classes, codes and exit codes are defined in the constitution. When writing code:

- **Throw only `AppError` subclasses.** Never throw strings or plain `Error`. Never signal failure from `logic/` by returning `null`, `false` or an error object.
- **Always fill `details`** with the shape given for that error in the constitution, e.g. `new NotFoundError('user not found', { resource: 'user', id })`.
- **Order of checks in a use-case:** validate input → check existence (`NotFoundError`) → check uniqueness (`DuplicateError`) → write. Validate before any `queries.*` call.
- **Validation stops at the first failing field** and names it in `details.field`.
- **Messages** are lowercase, no trailing period, safe to show to a user, and never include SQL, file paths or stack traces.
- **Wrapping:** when turning one error into another, always pass `{ cause: originalError }` as the third argument.
- **Never swallow** errors (`catch {}`) and never log-and-rethrow. Catch only to translate (in `query/safe.js`) or to output (once, at the client's top level).
- **Wrap every query** with `safe(...)` from `query/safe.js`.
- **Clients validate their own input** before calling `logic/`: argument count, numeric ids. Bad input throws `ValidationError` whose message is the usage line, e.g. `usage: update <id> <name> <email>`.
- **Tests** assert on `error.code` and `error.details`, never on `message` text, unless the spec fixes the message (e.g. usage lines). Every row of the constitution's error table needs at least one test.

## Tests

- One test per spec scenario. The test name starts with the scenario ID, followed by what it proves: `test('CU-7: rejects a duplicate email and adds nothing', ...)`.
- Use `node:test` (`test`) and `node:assert/strict`. No `describe`, no mocks library.
- Logic and query tests use `createTestQueries(...users)` from `test/create-test-queries.js`: a fresh in-memory database per test, seeded with the given users. Never share state between tests.
- Client tests run the real CLI in a child process with `DB_PATH` pointing to a fresh temp file.
- Errors: `assert.throws(fn, { code, details })`.

## Workflow

1. Write or update the spec in `specs/` (format in [specs/README.md](specs/README.md)) before any code.
2. Add or update one test per changed scenario; run them and see them fail.
3. Implement following the constitution's boilerplate until `npm test` passes.
4. Only touch files inside `staff/victor-chang/first-app/`.
5. Commit on the personal branch and open the PR against `staging`.
