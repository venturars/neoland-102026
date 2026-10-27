# AGENTS.md — first-app

How to write code in this app. [CONSTITUTION.md](docs/CONSTITUTION.md) defines the structure, the database, the shape of a `logic/` file and the error list, and wins on any of those topics. This file does not repeat them.

## Rules

- Read [CONSTITUTION.md](docs/CONSTITUTION.md) and this file before any code change.

## Commands

Run from `staff/victor-chang/first-app`:

```
pnpm install             # install the npm dependencies
pnpm jupyter             # open the Jupyter client (the first run creates .venv)
npx prettier --write .   # format every file
npx prettier --check .   # check formatting without changing files
```

To try a feature, open its `clients/terminal/<name>.txt`, copy the whole block and paste it into Git Bash from `first-app`, or run its notebook in `clients/jupyter/`.

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

## Node packages

A plan that adds a Node package, or changes its version, development packages included, is not approved without a **Socket check** section. Write it while writing the plan:

1. List each package the plan adds or changes, with its exact version.
2. Find layer 2: `npm view <name>@<version> dependencies`. For each range, the exact version is the one in `pnpm-lock.yaml` if it is there; otherwise the highest that matches: `npm view <dep>@"<range>" version`, last line.
3. Find layer 3 the same way from each layer 2 package. Stop there. A package inside the three layers is checked even if the app already has it.
4. For every package of the three layers, run the three checks. No layer and no check is skipped:
   - **Known malware / typosquat**: the `socket-mcp` tool `threat_feed`, filters `mal` and `typ`, by name and version. It needs a Socket organization; without one, it is "Not checked: no Socket organization".
   - **Alerts**: `https://socket.dev/npm/package/<name>/alerts/<version>`. If the agent cannot read the page, the cell is "Not checked by the agent" with that link.
   - **Scores**: the `socket-mcp` tool `depscore`, with the exact version. A score below 50 is a warning: 49 is below, 50 is not.
5. Write one row per package and version:

   | Package               | Layer | Known malware / typosquat | Alerts                                         | Scores below 50 |
   | --------------------- | ----- | ------------------------- | ---------------------------------------------- | --------------- |
   | `example-table@2.0.0` | 1     | Not checked: no access    | None found                                     | None            |
   | `example-width@1.4.0` | 2     | Not checked: no access    | `envVars`, low: it reads environment variables | Quality 49      |

   Each cell is "found: …", "None found" or "Not checked: <why>". A missing tool, a missing sign-in, a missing organization, a blocked page or an empty answer is "Not checked", never "None found". A good score does not replace the other two checks.

6. Explain each alert in plain words, under the table.
7. End with the date, the sources used and a blank `Decision:` line. Stop and ask. The agent never fills the decision and never accepts a warning or a "Not checked" on its own. The person who approves the plan opens the socket.dev links marked "Not checked by the agent", decides, and that decision is written in the plan.

## Workflow

Every change follows these steps, not only a new feature.

1. Write `docs/specs/<name>/spec.md`.
2. Write `plan.md`. If it has an open question, stop and ask.
3. Write `tasks.md`, then follow it step by step, ticking each step.
4. Write the code.
5. For a new feature, write its `clients/terminal/<name>.txt` and paste it in Git Bash: the output matches its comments.
6. Only touch files inside `staff/victor-chang/first-app/`.
7. Commit on the personal branch. Push only when asked.
