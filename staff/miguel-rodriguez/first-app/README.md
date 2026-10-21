# first-app — Miguel Rodriguez

Original classroom app matching Ventura's actual PR #139 structure and code.
Moved from exercises/crud-app to staff/miguel-rodriguez/first-app. The separate
exercises/crud-ssd project is unchanged.

## Run

```sh
cd /Users/miguelangelrodriguez/NEOLAND/neoland-102026/staff/miguel-rodriguez/first-app
nvm use
npm test
bash clients/terminal/create-users-table.txt
bash clients/terminal/create-user.txt
bash clients/terminal/list-users.txt
bash clients/terminal/find-user-by-email.txt
```

No npm install needed. Use Node 24.12.0; SQLite's experimental warning is expected.
Copy/pasting complete .txt contents into the terminal also works. Run initialization
separately; CRUD examples do not create tables. Before running update-user.txt or
delete-user.txt, replace its userId = 0 with the generated ID, then run it with bash.
Creation repeated with Ada's email fails as a duplicate. Missing email/IDs throw
User not found. Successful deletion prints undefined because it returns no data.

## Structure

- db/: fixed connection and generated users.sqlite.
- queries/users.js: SQL and query execution, matching Ventura's actual code.
- logic/: create/update/delete/list/find-by-email; plain results and thrown errors.
- clients/terminal/: six copyable manual examples.
- docs/CONSTITUTIONS.md: actual architecture and contracts.
- AGENTS.md: agent working instructions.
- test/: executable tests in disposable copies; preserves working records.

Existing local users and all their stored fields were preserved during relocation.
The generated database and sidecars are ignored by Git. Source code for the
connection, queries, and five logic files matches the reviewed reference commit.
Our extra README, Node pin, tests, ignore rules, and terminal finally cleanup are
supporting additions. No repository factory, src/app wrapper, argument-based CLI,
custom errors, result wrappers, or SDD scaffolding are used here.

## Limits inherited from the reference

Validation assumes correctly typed inputs. Email format checks are basic; IDs
are not explicitly validated. Duplicate precheck is not a concurrency guarantee.
Full SDD specifications and stricter validation remain in the separate SDD app.
No authentication, server, notebook, or frontend is included.
