# AGENTS.md — first-app-ssd

## Purpose and scope

This is a junior-friendly Node.js and SQLite contact-management exercise built
using specification-driven development (SDD). This guide describes how an agent
works. `docs/CONSTITUTIONS.md` defines what the application must do.

Work only inside this project directory unless Miguel explicitly expands scope.
Do not modify the sibling `first-app`; it is a separate project. Do not create branches, commit, push, or
open pull requests unless Miguel explicitly requests that action.

Current stage: specifications 001–006 are implemented. Miguel subsequently
removed .gitignore, .nvmrc, README.md, and automated tests to simplify the
classroom structure. The previous 43-test results are historical evidence;
current verification uses the terminal examples in disposable project copies.
Use Node 24.12.0. No Git publishing actions are authorized.

## Before each task

1. Read this guide, the constitution, the active feature specification when one
   exists, and the relevant existing code. Confirm the current branch and local
   changes.
2. Look for a similar implemented feature and reuse its conventions when they
   agree with the documents. Do not copy known defects from reference code.
3. Identify assumptions and unresolved decisions. Do not silently choose between
   conflicting instructions, specifications, or code. Explain the conflict and
   ask Miguel which path to follow, including whether documentation must change.
4. Keep the scope small. Do not implement later features opportunistically.

## Workflow and review gates

Follow this order:

1. **Constitution:** agree on application architecture and common contracts.
2. **Feature specification:** write `docs/specs/NNN-feature-name.md`. It must
   contain the goal, inputs, outputs, exact errors, examples, exclusions,
   prerequisites, and numbered acceptance checks with expected outcomes. Record
   its status as draft until Miguel reviews and approves it.
3. **Implementation plan:** after specification approval, write a short ordered
   plan with files affected and verification commands, in the same specification.
   Ask about any new material decision; otherwise implement only the approved
   scope. A specification change requires review before dependent code proceeds.
4. **Implementation:** make the smallest readable change that meets the approved
   specification. Do not change other public contracts without updating and
   reviewing their specifications first.
5. **Acceptance verification:** execute the checks, compare actual and expected
   behavior, and map each acceptance check to its evidence. Report failures or
   limitations honestly. A written command is not evidence that it ran.

Do not implement a feature before Miguel reviews its specification. The first
feature specification will cover database initialization, not all CRUD at once.
Record specification approval explicitly and update this stage notice as work
progresses. Foundation approval does not authorize feature implementation.

## Code conventions for later implementation

- Plain JavaScript with Node ES modules; named exports and `.js` import paths.
- English code, documentation, and error messages. Use kebab-case filenames and
  camelCase variables/functions. Explain unfamiliar terms simply to the learner.
- One public business operation per file in `logic/`. No HTTP, SQL, console
  output, process exit, or database lifecycle code inside business operations.
- Business functions use the concrete query module for the single fixed
  database. Do not accept a database/store argument in their public signatures.
- SQL text belongs in `queries/sql/`, one named exported string per file.
  Query execution belongs in `queries/users.js`. Bind inputs using named SQL
  parameters; never build SQL from user-supplied text.
- Prefer direct `if` statements and explicit field selection. Do not add generic
  helpers, wrappers, custom error classes, containers, database-swapping
  interfaces, or plugins. Small duplication is acceptable when easier to read.
- Business functions return ordinary data or throw ordinary `Error` instances,
  as defined by the constitution. No `{ ok, data }` result wrappers.
- Use consistent readable formatting: two spaces, double quotes, semicolons,
  trailing commas where appropriate. Do not install a formatter solely for this.
- Dependencies must solve a concrete approved need; prefer Node built-ins.

## Verification and completion

For each business feature, add a copyable `.txt` example in `clients/terminal/`
that calls its business function, catches failures, prints the result, and closes
the connection in `finally`. State the required working directory and
prerequisites.
Initialization is an explicit exception: its example calls the initialization
query function directly. It is never hidden in CRUD clients. Clients must also
handle connection-opening failures; module imports that open a connection can
fail before a business function runs.

Run verification in a temporary project copy with its own database, never
against the learner's working database. Exercise the actual terminal snippets,
success cases, expected errors, and preservation of existing records. Remove
temporary files. Do not restore automated test files without Miguel's request.

Report what changed, commands actually executed, results, and remaining risks.
Do not claim tests, runtime scripts, or features exist before they do. Stop at
requested review gates. No extra tooling or full specification framework is
needed for this exercise.

## Classroom simplification — 2026-10-19

Miguel requested removal of .gitignore, .nvmrc, README.md, and test/.
This supersedes instructions to maintain or run the automated suite. Earlier
43-test results and feature acceptance records remain historical evidence.
Use Node 24.12.0 explicitly and verify terminal examples in a temporary copy.
No npm test command is provided. Stage source paths explicitly; generated
SQLite data is no longer excluded by a project .gitignore.
