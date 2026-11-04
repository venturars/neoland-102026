# Plan — An HTTP client for the users

A new client in `src/clients/api/`. It is a thin layer: each route calls one existing function of `logic/` and turns its result or its error into an HTTP answer. Nothing in `logic/`, `queries/` or `db/` changes, there is no new SQL. The only new error sentence is "The request is not valid.", used by this client alone.

## Files to add or change

- Add `src/clients/api/server.js`: the Express app. It reads JSON bodies, defines the five routes and listens on `127.0.0.1:3001`. The port is a constant at the top, with a short comment, as `docs/STYLE.md` asks. Like `src/db/server.js`, it is a script, not an exported function.
- Add `src/clients/terminal/api.txt`: `curl` examples for the five routes, with Spanish comments as the other `.txt` files. The first lines say it is pasted with `first-app` as the current folder and that `pnpm start` and `pnpm api` must be running.
- Change `package.json`: add the dependency `express` and the script `"api": "node src/clients/api/server.js"`. Add `src/clients/api` to `format`.
- Change the docs listed below.

## Routes

Every route is `async`. Each calls one function of `logic/`, passing one object, and sends JSON.

| Route | Calls | Success |
|---|---|---|
| `POST /users` | `createUser({ name, email })` | 201, the user |
| `GET /users` | `listUsers()` | 200, the array |
| `GET /users/:id` | `findUserById({ id })` | 200, the user |
| `PATCH /users/:id` | `updateUser({ id, name, email })` | 200, the user |
| `DELETE /users/:id` | `deleteUser({ id })` | 204, no body |

- `id` comes from the path and is turned into a number with `Number(...)` before the call. A value that is not a number matches no user, so the answer is "No user was found." (404). To check when running: that `Number("abc")` gives that result and not a 500.
- For `PATCH`, a field missing from the body is passed as `undefined`, so `logic/` keeps the old value. `{}` gives "There is nothing to update." (400).
- Fields other than `name` and `email` in the body are ignored.

## Errors

Each route has its own `try`/`catch` and turns `error.message` into a status. There is no shared helper (`docs/STYLE.md`: "No wrappers and no generic helpers"), so the same short `if` chain is written in each route. The body is `{ "error": "<sentence>" }`.

| Error | Status |
|---|---|
| "The name is missing.", "The email is not valid.", "There is nothing to update." | 400 |
| "No user was found." | 404 |
| "This email is already used." | 409 |
| "The database failed." | 500 |
| Anything else | 500, "The database failed." (nothing else leaks). The route calls `console.error(error)` before answering, so a real bug, including a `TypeError` from a typo, is visible in the terminal. |

Each route checks its input before calling `logic/`, with its own inline checks (no shared helper, `docs/STYLE.md`). A failed check answers 400 `{ "error": "The request is not valid." }`. This sentence is new and needs adding to `docs/ERRORS.md` (see Decisions).

- `POST /users` and `PATCH /users/:id`: if `request.body` is `undefined`, `null` or not an object, answer 400.
- `POST /users`: `name` and `email` must both be strings (`typeof`), else 400.
- `PATCH /users/:id`: `name` and `email` may be `undefined` (`logic/` keeps the old value), but if present must be strings, else 400. An empty `{}` still reaches `logic/`, which answers "There is nothing to update." (400).
- `logic/` stays unchanged and still has no type checks.

A body that is not valid JSON is answered by Express with 400. Its default answer is HTML, so one error-handling middleware in `server.js` answers `{ "error": "The request is not valid." }` instead.

## Packages

- `express` 5.2.1, pinned exact like the other dependencies, added with `pnpm add --save-exact express`.
- Socket (`depscore`): license 100, maintenance 92, quality 100, supply chain 97, vulnerability 100. All stats are above 50.
- Socket `alerts` (org `neoland1`): the tool lists the open alerts of the whole organization, not of one package. The first page of 100 has none for `express`. Treated as no alerts.
- Socket `threat_feed`: not available. The free plan of `neoland1` answers 403 "Threat feed is not enabled for this organization". Not checked.
- Dependencies: `express` 5.2.1 resolves to 66 packages in total (`npm install --package-lock-only`). `depscore` was run on all of them: vulnerability 100 and license 100 everywhere, and no stat below 50. The lowest are `safer-buffer` maintenance 50, and `function-bind`, `has-symbols`, `gopd`, `es-define-property`, `side-channel` and `hasown` with maintenance 53-54 and supply chain 66. `npm` reports 0 vulnerabilities.

## Changes to the docs

- `AGENTS.md`: "There is no web framework and no TypeScript" becomes "The only web framework is Express, used only by the HTTP client in `src/clients/api/`. There is no TypeScript." Add the `pnpm api` script and the new `format` path where scripts are described.
- `docs/ARCHITECTURE.md`: in `src/clients/`, add `api/` as a client that imports `logic/` and talks HTTP on 3001; adjust the line "A client imports a function from `logic/` and prints the result".
- `docs/TREE.md`: add `api/server.js` under `clients/` and `api.txt` under `terminal/`.
- `docs/ERRORS.md`: see Decisions.
- `docs/CONSTITUTIONS.md`: if it repeats the "no framework" rule, align it.

## What stays as it is

`logic/`, `queries/`, `db/`, the port 3000 and the database program, the web, terminal and Jupyter clients, and every existing error sentence.

## What must be running

The database program (`pnpm start`) first, then `pnpm api`.

## How it is checked

`pnpm start` and `pnpm api`. With `curl`: create (201); create again with the same email (409); create with no name (400) and with no body (400); `POST` with `{"name": 5, "email": "a@b.com"}` (400), with `{"name": "Ana"}` and no email (400) and with no body (400); `PATCH` with `{"name": ["x"]}` (400); list; get by id; patch the name, the email, both, and `{}` (400); get an id that does not exist and `abc` (404); delete (204) and get it again (404); send broken JSON (400). Stop `pnpm start` and see 500. Open `http://127.0.0.1:3000` and check the web page still works. Then `pnpm format` and `pnpm lint`.

## Decisions to review

1. **A new sentence for bad input.** `docs/ERRORS.md` says no failure may use a sentence that is not in the list. "The request is not valid." is still new, and is only used by this client. It is now used for input that the route checks before calling `logic/`, not for a `TypeError`. Recommended: add the sentence.
2. **Express in `AGENTS.md`.** Express contradicts today's "no web framework". The plan changes that line, limited to this client. You chose this; it needs your review before `tasks.md`.
3. **Status codes** (201, 204, 400, 404, 409, 500) are chosen here. `ERRORS.md` only has sentences.
4. **`server.js` is a script** with route handlers, so "one function per file" is read as applying to `logic/` and `queries/`, as in `src/db/server.js`.
5. **Port 3001, fixed**, and listening on `127.0.0.1` only.
