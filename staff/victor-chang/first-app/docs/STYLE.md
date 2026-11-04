# Style

## Naming

- Files and folders are kebab-case. A `logic/` file exports one function named after it: `create-user.js` exports `createUser`. Exceptions: `errors.js` (all error classes), `queries/users.js` (all user queries) and the uppercase docs (`AGENTS.md`, `README.md` and the guides in `docs/`, like `CONSTITUTION.md`).
- `.sql` files are named for what they do: `find-user-by-id.sql`, `insert-user.sql`.
- Functions, variables and parameters are camelCase.
- Error classes end in `Error`; error codes are `UPPER_SNAKE_CASE`.

## How code is written

- Plain functions with their parameters in the signature: `export function getUser(id) { ... }`.
- Named exports only, no default exports.
- Always use braces with `if`, even for one line.
- No classes except errors. Plain objects in, plain objects out.
- Formatting is Prettier's default config, with no config file and no overrides. Run `pnpm format` and `pnpm lint` before committing.
- Comments only for the step names of a `logic/` file, or when the _why_ is not obvious.

## Constants

A fixed value of the app is a constant. Its name is in capitals (`MODEL`, `DB_PATH`). A variable stays in camelCase.
