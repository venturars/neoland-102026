# AGENTS.md — first-app

How to write code in this app. Read [CONSTITUTION.md](CONSTITUTION.md) first: it defines the structure, libraries and error contract, and wins on any of those topics. This file does not repeat them.

## Commands

Run from `staff/victor-chang/first-app`:

```
node --no-warnings client/terminal/index.js create <name> <email>
node --no-warnings client/terminal/index.js list
node --no-warnings client/terminal/index.js get <id>
node --no-warnings client/terminal/index.js update <id> <name> <email>
node --no-warnings client/terminal/index.js delete <id>
DEBUG=1 node --no-warnings client/terminal/index.js <command> ...   # print stack and cause on error
node --test                                                           # run tests
```

`--no-warnings` only hides Node's experimental notice for `node:sqlite`. Delete `db/users.db` to start from an empty database.

## Naming

- File name = the single function it exports, camelCase: `createUser.js` exports `createUser`. Only exceptions: `index.js` (aggregators) and `errors.js` (all error classes).
- Use-cases in `logic/` are named for the business action: `create`, `get`, `list`, `update`, `delete` + entity (`createUser`).
- Database operations in `query/` are named for the data action: `find`, `insert`, `modify`, `remove` + entity (`findUserById`, `findAllUsers`). Never reuse a `logic/` name in `query/`.
- Error classes end in `Error`; error codes are `UPPER_SNAKE_CASE`.
- Variables and parameters are camelCase; fixed module-level configuration (paths, patterns, code maps) is `UPPER_SNAKE_CASE`.

## How code is written

- Curried factories: the dependency first, then the arguments — `export const getUser = (queries) => (id) => { ... }`.
- Named exports only, no default exports.
- No classes except errors. Plain objects in, plain objects out.
- No semicolons, single quotes, 2-space indent.
- One responsibility per function; keep functions short enough to read at a glance.
- Comments only when the *why* is not obvious from the code.

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
- **Tests** assert on `error.code` and `error.details`, never on `message` text. Every row of the constitution's error table needs at least one test.

## Workflow

1. Describe the change (spec) before writing code.
2. Write or update tests from that spec.
3. Implement following the constitution's boilerplate, then make the tests pass.
4. Only touch files inside `staff/victor-chang/first-app/`.
5. Commit on the personal branch and open the PR against `staging`.
