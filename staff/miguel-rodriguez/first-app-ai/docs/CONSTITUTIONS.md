# Application constitution

Foundation approved by Miguel on 2026-10-20.

## Purpose

This is a small local user/contact application for learning Node.js. Authentication is not implemented. It uses ES modules and requires a Node version that supports `node:sqlite` and `DatabaseSync`.

## Guides

- [Architecture](ARCHITECTURE.md): responsibilities of layers and files.
- [Tree](TREE.md): project folders and files.
- [Database](DATABASE.md): connection, schema, initialization, and queries.
- [Errors](ERRORS.md): exact messages and failure conditions.
- [Style](STYLE.md): conventions for writing new code.

## Business-operation steps

Business operations follow four responsibilities:

1. Validate the supplied input.
2. Check business rules.
3. Apply the operation through the existing queries or services.
4. Structure the returned data, or return no data when the contract requires it.

The contracts below preserve each operation's existing validation and query order.
For example, update first retrieves the ID and reports a missing user before
validating changed fields. This description does not reorder existing operations.
The form of individual code lines belongs in [STYLE.md](STYLE.md).

## Public business operations

For contact-returning operations, a returned user is a new ordinary object containing exactly `id`, `name`, `email`, `createdAt`, and `updatedAt`. Business functions do not return SQLite row objects or result wrappers.

| Signature | Behavior and return |
| --- | --- |
| `createUser(input)` | Creates a contact from `input.name` and `input.email`; returns the created user. |
| `listUsers()` | Returns an array of users in ascending numeric ID order, or `[]` for an empty table. |
| `updateUser(id, changes)` | Updates an existing contact; returns the updated user. |
| `deleteUser(id)` | Permanently deletes an existing contact; returns `undefined`. |
| `findUserByName(name)` | Trims the name and returns all exact, case-sensitive matches in ascending ID order, or `[]`. |
| `findUserByEmail(email)` | Looks up a normalized email; returns the matching stored user. |
| `findUserById(id)` | Looks up a numeric ID; returns the matching stored user. |
| `usersGenderCount()` | Async, without parameters; resolves to exactly `{ women, men, genderUndefined }` for all saved contacts, or three zeroes when empty. |

Callers supply correctly typed inputs: creation receives an object with string `name` and `email`; email and name lookup receive strings; ID lookup, update, and delete receive numeric IDs. ID lookup adds no validation or conversion. Update receives a changes object whose supplied fields are strings. Additional type validation is not implemented.

Creation trims the name and rejects an empty result. It then trims and lowercases email. An email must contain exactly one `@`, with nonempty parts on both sides, and have at most 64 JavaScript string units (`.length`). These are the current checks; no additional email-format checks apply. Creation checks for an existing email before inserting.

Updating first looks up the ID. A missing contact fails before field validation. Undefined `changes.name` or `changes.email` preserves that stored value; supplied values are normalized as in creation. The chosen email, whether supplied or stored, always undergoes the existing email checks before ownership lookup. A malformed stored email therefore makes a name-only update fail with `Email is invalid` without changing the contact. An empty changes object is allowed and still undergoes these checks. Updating checks email ownership and allows reuse of the same contact's email, but rejects another contact's email. The update query receives the retrieved contact's ID.

Email lookup normalizes and validates its argument before querying. It returns stored fields without changing them. ID lookup retrieves a contact by its supplied numeric ID without normalization or validation. Email lookup, ID lookup, name lookup, and listing preserve every record and timestamp, including when a lookup fails. Deletion checks existence before removing the contact; deleting it again reports a missing user. The business deletion operation returns `undefined` even though its query returns execution metadata. A deleted email can be used for a new contact.

Name lookup trims only the supplied name, rejects an empty result, and preserves stored values. It returns a list of new ordinary user objects; a missing name or empty table returns `[]`, not `User not found`.

The classifier displays name-based category guesses, not verified gender identities. It preserves all records and timestamps, including on failure. It returns only aggregate counts totaling the saved-contact count, uses undefined for uncertain or unusable classifications, and returns no partial count on retrieval or request failure. Its local AI connection and request details are defined in the classifier feature documents.

See [ERRORS.md](ERRORS.md) for the complete error messages, conditions, and query
failure handling. See [DATABASE.md](DATABASE.md) for the storage and query details.

## Terminal examples

Run examples from the project directory using a Node version supporting `node:sqlite`. Run the initialization snippet separately before business operations; creation must precede examples that need an existing contact. ID-lookup, update, and delete examples use a sample ID that the learner must replace with an existing ID. Use a disposable contact for permanent deletion.

Each example starts a separate Node process. Clients import and call the relevant operation and use `console.log`; initialization prints the table listing from `SELECT name FROM sqlite_master WHERE type = 'table'` using `db.prepare(...).all()`, including `users`, deletion prints `undefined`, and other examples print returned data. The classifier client awaits its async result and requires the local AI prerequisites documented in its example for nonempty data. No interactive application or general-purpose CLI is implemented.

## Dependencies and package management

The application uses Node built-ins and the exact external dependency `openai@7.39.0`. The Jupyter client additionally uses the exact development dependency `cli-table3@0.6.5` for colored table headers. Its project-local Python environment uses `notebook==7.6.3` and the directly invoked `ipykernel==7.1.0` from `requirements-jupyter.txt`. These client dependencies do not change the business operations or classifier. pnpm generates `pnpm-lock.yaml`; it is maintained with `package.json`.

- Use pnpm. Do not mix package managers or introduce `package-lock.json` or `yarn.lock`.
- Add dependencies only when required by an approved implementation plan.
- A new Node package, or a change to its version, must be checked with Socket before the implementation plan is approved. Follow the procedure in [AGENTS.md](../AGENTS.md).
- Pin direct dependencies to exact versions: no `^`, `~`, `*`, or `latest`.
- When installation is authorized, use `pnpm add --save-exact <package>@<approved-version>`.
- Let pnpm generate and maintain `pnpm-lock.yaml`; do not edit it manually. Keep it consistent with `package.json`.
- Review dependency upgrades deliberately; do not upgrade packages opportunistically.
- Exact versions and the lockfile control dependency resolution. They do not guarantee package security.

## Workflow for new SDD development

Approved transition decision by Miguel on 2026-10-20: public ID lookup has been completed from its reviewed chat plan, before the three-document SDD workflow begins with the classifier. Its separate specification and plan files were removed as authorized. The classifier specification, plan, and tasks are approved. Its implementation is present; actual verification outcomes and any remaining blockers are recorded in `docs/specs/classifier/tasks.md`.

Subsequent SDD developments, starting with the classifier, require separately reviewed and approved `spec.md` → `plan.md` → `tasks.md` before implementation. For each such feature, keep these separate documents under `docs/specs/<feature-name>/`:

1. `spec.md` describes the business request: purpose, user, inputs, outputs, examples, visible failures, and exclusions. It does not prescribe files, functions, SQL, libraries, or implementation steps.
2. After human review and approval of the spec, `plan.md` references it and defines the technical approach: affected files, relevant existing patterns, function signatures, required queries or dependencies, and error mapping.
3. After human review and approval of the plan, `tasks.md` references both the spec and plan and gives small ordered steps with observable results.
4. After human review and approval of the tasks, implement only that scope and verify it.

Keep the documents easy to review without an arbitrary total line limit. Record unresolved conflicts in the plan and stop before tasks or implementation until those conflicts are resolved. General application rules belong here; feature-specific requirements belong in that feature's documents.

The existing operations predate this workflow. This foundation does not create retrospective specifications or claim prior SDD approvals. No feature documents are created as part of this foundation.
