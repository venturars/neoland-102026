# AGENTS.md — first-app

How to write code in this app. [CONSTITUTION.md](docs/CONSTITUTION.md) defines the structure, the database, the shape of a `logic/` file and the error list, and wins on any of those topics. This file does not repeat them.

## Rules

- Read [CONSTITUTION.md](docs/CONSTITUTION.md) and this file before any code change.

## Commands

Run from `staff/victor-chang/first-app`:

```
npx prettier --write .   # format every file
npx prettier --check .   # check formatting without changing files
```

To try a feature, open its `clients/terminal/<name>.txt`, copy the whole block and paste it into Git Bash from `first-app`.

## Naming

- Files and folders are kebab-case. A `logic/` file exports one function named after it: `create-user.js` exports `createUser`. Exceptions: `errors.js` (all error classes), `queries/users.js` (all user queries) and the uppercase docs (`AGENTS.md`, `CONSTITUTION.md`, `README.md`).
- `.sql` files are named for what they do: `find-user-by-id.sql`, `insert-user.sql`.
- Functions, variables and parameters are camelCase.
- Error classes end in `Error`; error codes are `UPPER_SNAKE_CASE`.

## How code is written

- Plain functions with their parameters in the signature: `export function getUser(id) { ... }`.
- Named exports only, no default exports.
- Always use braces with `if`, even for one line.
- No classes except errors. Plain objects in, plain objects out.
- Formatting is Prettier's default config, with no config file and no overrides. Run `npx prettier --write .` before committing.
- Comments only for the step names of a `logic/` file, or when the _why_ is not obvious.

## Error handling

The messages, classes and codes are listed in the constitution. When writing code:

- **Throw only the classes in `logic/errors.js`.** Never throw strings or plain `Error`. Never signal a failure by returning `null`, `false` or an error object.
- **Always fill `details`** with the shape the constitution gives, e.g. `new NotFoundError("User not found", { resource: "user", id })`.
- **Validation stops at the first failing field** and names it in `details.field`.
- **One `try/catch` per `logic/` function**, around the calls to `queries/users.js` (and the AI). In the `catch`: rethrow an `AppError` as it is; turn anything else into that feature's `SystemError("Could not …", {}, { cause: error })`.
- **Never swallow** errors (`catch {}`) and never log and rethrow.
- `queries/users.js` and `db/` never catch errors.

## Workflow

1. Write `docs/specs/<name>/spec.md`.
2. Write `plan.md`. If it has an open question, stop and ask.
3. Write `tasks.md`, then follow it step by step, ticking each step.
4. Write the code.
5. Write the feature's `clients/terminal/<name>.txt` and paste it in Git Bash: the output matches its comments.
6. Only touch files inside `staff/victor-chang/first-app/`.
7. Commit on the personal branch. Push only when asked.
