# Plan — A Bruno collection for the users HTTP client

Plain text files in a new folder, `src/clients/api/bruno/`. Nothing in `logic/`, `queries/`, `db/` or `src/clients/api/server.js` changes, there is no new SQL and no new error sentence. Bruno stores a collection as `.bru` text files, so the collection is read and reviewed in git like any other file. These files are not JavaScript, so `pnpm format` and `pnpm lint` do not touch them.

## Files to add

Inside `src/clients/api/bruno/`:

- `README.md`: the guide, in Spanish like the files of `terminal/`. It says: install Bruno (outside tool); start `pnpm start` and `pnpm api`; in Bruno, "Open Collection" and choose this folder; pick the environment `local`; run the requests one by one or the whole collection with "Run". It lists the requests in order, says what each one should answer, explains the last step (stop `pnpm start`, send the request, start it again) and how to clean up after a cut run (send "Delete user" or delete the user in `src/db/users.sqlite` via the terminal files).
- `bruno.json`: the collection manifest (`version`, `name`, `type: "collection"`).
- `environments/local.bru`: one variable, `baseUrl: http://127.0.0.1:3001`.
- One `.bru` file per request, with a `seq` that gives the run order. Each has a `docs` block with one line on its purpose and an `assert` block with the status and the body it expects.

## Requests

Folder `01 CRUD` (runs first, in this order):

| Request | Sends | Expects |
|---|---|---|
| Create user | `POST /users` `{ name: "Ady", email: "ady@example.com" }` | 201, a user with `name`, `email`, `id`, `createdAt`, `updatedAt`. A post-response script saves `id` in the variable `userId`. |
| List users | `GET /users` | 200, an array that includes the user |
| Find user | `GET /users/{{userId}}` | 200, the same user |
| Update user | `PATCH /users/{{userId}}` `{ name: "Ada" }` | 200, name "Ada", email unchanged |

Folder `02 Errors` (runs after the CRUD folder, while Ady still exists):

| Request | Sends | Expects |
|---|---|---|
| Create without name | `POST /users` `{ email: "no-name@example.com" }` | 400, "The request is not valid." |
| Create with empty name | `POST /users` `{ name: " ", email: "no-name@example.com" }` | 400, "The name is missing." |
| Create with bad email | `POST /users` `{ name: "Bad", email: "not-an-email" }` | 400, "The email is not valid." |
| Create with repeated email | `POST /users` `{ name: "Other", email: "ady@example.com" }` | 409, "This email is already used." |
| Update with nothing | `PATCH /users/{{userId}}` `{}` | 400, "There is nothing to update." |
| Create with invalid JSON | `POST /users` with the raw text `{ "name": ` and content type JSON | 400, "The request is not valid." |
| Find missing user | `GET /users/999999` | 404, "No user was found." |
| Find with id not a number | `GET /users/abc` | 404, "No user was found." |
| Update missing user | `PATCH /users/999999` `{ name: "Nobody" }` | 404, "No user was found." |
| Delete missing user | `DELETE /users/999999` | 404, "No user was found." |

Folder `03 Delete` (runs after the errors):

| Request | Sends | Expects |
|---|---|---|
| Delete user | `DELETE /users/{{userId}}` | 204, no body |
| Find deleted user | `GET /users/{{userId}}` | 404, "No user was found." |

Folder `04 SQL down` (the guide says to run it by hand, never in the full run, because it needs the database program stopped):

| Request | Sends | Expects |
|---|---|---|
| List users, database stopped | `GET /users` | 500, "The database failed." |

Every error body is `{ "error": "<sentence>" }`, as `src/clients/api/server.js` answers. The sentences are the ones in `docs/ERRORS.md`.

## Edge cases

- `userId` is set only by "Create user". If that request is skipped, the requests that use `{{userId}}` fail on their asserts and the guide says to run the collection in order.
- A second full run works, because "Delete user" removes Ady at the end of the first run.
- A run cut before "Delete user" leaves Ady in the database: the guide says to send "Delete user" by hand (after "Create user" sets `userId`, or with the id written in the URL).
- `GET /users/gmail` is not covered: it is not in the spec of the HTTP client.

## Outside tool

- Bruno, installed by the person from the official site. It is not a Node package: `package.json` and `pnpm-lock.yaml` do not change, so no Socket review applies.
- Must be running: the database program (`pnpm start`) and the HTTP client (`pnpm api`), except for the "SQL down" request, which needs the database program stopped.

## Changes to the docs

- `docs/TREE.md`: add `bruno/` under `src/clients/api/`, with its files and the two folders `environments/` and the request folders.
- `docs/ARCHITECTURE.md`: in the `api/` line, add that `bruno/` holds a Bruno collection to try the five routes by hand, that Bruno is an outside tool and that the collection is not run by `pnpm`.
- `AGENTS.md`: no change. Its "Commands" section lists `pnpm` scripts, and no script is added.
- `docs/ERRORS.md`: no change, no new sentence.

## Terminal file

`AGENTS.md` asks for a file in `src/clients/terminal/` for a new feature that has a `logic/` function. This feature has none: the existing `api.txt` already holds the `curl` examples and stays as it is.

## What stays as it is

`src/clients/api/server.js`, `package.json`, `pnpm-lock.yaml`, `logic/`, `queries/`, `db/`, the other clients and the format of the JavaScript files.

## Decision

The `.bru` files are not part of `pnpm format` or `pnpm lint`. The way to check the collection is to run it in Bruno, as the project has no tests yet and the spec leaves automatic tests out.
