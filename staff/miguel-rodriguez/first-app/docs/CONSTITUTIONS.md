# Constitution — first-app

## Scope and source of truth

A small contact-management app matching Ventura's actual PR #139 at commit
e50b7cd850c2a98ea0c477f6e7348ddbfa353531. No authentication. This is the original
classroom app, separate from the later exercises/crud-ssd project.

## Responsibilities

- db/connection.js exports one db connection to module-relative db/users.sqlite.
- queries/users.js contains SQL and concrete query functions.
- logic/ has one public operation per file and imports those query functions.
- clients/terminal/ has copyable .txt examples that call logic, print, and close db.
- test/ verifies behavior using temporary project copies.

Ventura's constitution describes separate SQL files, but his actual query module
still embeds SQL. This project deliberately follows the actual module layout.
It does not copy that contradictory future rule into its own documentation.

## Actual public contracts

- createUser({ name, email }) returns a plain user.
- updateUser(id, changes) returns a plain updated user; omitted/undefined fields
  preserve their current values. Empty patches are allowed by the reference.
- deleteUser(id) returns undefined on success.
- listUsers() returns plain users ordered by ID; empty table returns [].
- findUserByEmail(email) returns a plain user or throws when absent.

A user contains id, name, email, createdAt, updatedAt. No result wrappers or
custom error classes. Names are trimmed and cannot be blank. Emails are trimmed,
lowercased, limited to 64 JavaScript string units, and require exactly one @ with
nonempty parts. This is the reference's basic check, not full email validation.
Existing operations assume correctly typed input. Stronger validation belongs
to a separately agreed change; the SDD exercise already has stricter contracts.

Expected ordinary errors: Name is empty, Email is invalid, Email is already used,
User not found. Query failures become Could not create/update/delete/list/find
(the user/the users as appropriate), matching each function's actual message.

## Database and lifetime

Use SQLite with id INTEGER PRIMARY KEY, name TEXT NOT NULL, email VARCHAR(64)
NOT NULL UNIQUE, and createdAt/updatedAt TEXT defaults from datetime('now',
'localtime'). The query updates updatedAt on update. VARCHAR(64) itself does not
enforce length in SQLite; the business function does. IDs can be reused.

Initialize explicitly using createUsersTable(), separately from CRUD clients.
The connection opens on import; top-level clients close db in finally. Restart
Node to obtain a new session after closing it. Generated SQLite files are ignored
by Git, unlike the reference's committed database. Historical user timestamps
from the old app are preserved as stored; future writes follow reference localtime.
