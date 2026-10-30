# Style

## Names

- Code is written in English.
- Comments in the terminal files (`src/clients/terminal/`) are written in Spanish.
- File and folder names use kebab-case: lowercase words joined by `-`, as in `create-user.js`, `find-by-email.sql`, and `src/clients/terminal`.
- Function names and variable names use camelCase, as in `createUser` and `emailParts`.

## Constants

A constant is written in capital letters with `_`, as in `MAX_EMAIL_LENGTH`. It goes at the top of the file, with a short comment that says what it limits.

## Imports and exports

- Import and export by name. Do not use default exports.
- In ESM, the import path includes the file extension: `import { createUser } from "./create-user.js"`.

## SQL

- Pass values with a name, as in `:email`. Do not use `?`.
- The SQL string stays in the `.sql` file, never in JavaScript.

## Format

- Format code with Prettier, using Prettier's standard settings. Do not add a custom Prettier config.
- Leave short comments that help a junior developer understand what the code does. Write them in simple words, next to the step they explain. Skip comments that only repeat the line.

## Shape of the code

- One function per file. No classes, no `this`, no methods.
- A user is a record with `id`, `name`, `email`, `createdAt` and `updatedAt`.
- Each line leaves one action in one name. An action is a call or a check. So `input.name` and `.trim()` go on different lines, and Prettier does not join them.
- A failure from [ERRORS.md](ERRORS.md) is checked with `if`, and `throw new Error` goes on its own line.
- No wrappers and no generic helpers.
- Write it the way a junior would write it by hand.
