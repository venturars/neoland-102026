# Plan — The web client uses the real users

The database moves to a program that stays running. `queries/` stops opening SQLite and asks that program for each query. `logic/` and the clients keep their rules. The web page imports `logic/` like the terminal does. There is no API layer between them.

## Files to add or change

- Add `src/db/server.js`: the database program (`node:http`). It is the only file that opens `users.sqlite`, through `connection.js`, and the only one that reads the `.sql` files. It listens on `http://localhost:3000`.
- Move the seven `.sql` files from `src/queries/queries/` to `src/db/queries/`, with the same names.
- Change `src/queries/users.js`: no `node:*` import, no `readFileSync`, no `db`, no `.sql`. Each function keeps its name and arguments and sends one `POST` to the program with `fetch`.
- Change the seven files of `src/logic/`.
- Change `src/clients/web/index.html` and `app.js`.
- Change every file of `src/clients/terminal/` and every notebook of `src/clients/jupyter/`.
- Change `package.json`: add the `start` script that runs `src/db/server.js`. Add `src/clients/web` to `format`.

## The database program

One endpoint per query: `POST /queries/<name>`, a JSON body with the named values, a JSON answer. The names are the file names without `.sql`.

- A query that returns one row answers 200 with the row, or `null` if there is none (`insert`, `find-by-id`, `find-by-email`, `update`).
- `find-all` answers 200 with an array.
- `create-users-table` and `remove` answer 200 with `null`.
- Unknown name: 404. Body that is not JSON: 400. SQLite failure: 500. The body is `{ "error": "..." }` and never carries the SQLite message.
- It runs `create-users-table` when it starts.
- For `GET` it serves, read only, `.html`, `.css` and `.js` files of `src/clients/web/`, `src/logic/` and `src/queries/`. `/` is `web/index.html`. It never serves `src/db/`. This gives the page and the program the same origin, so there is no CORS, and lets the page load modules.

## queries

Same functions: `createUsersTable`, `insert(input)`, `findById(id)`, `findByEmail(email)`, `findAll()`, `update(input)`, `remove(id)`. Each is async, builds its body, calls `fetch` and returns the parsed JSON (`undefined` for `remove` and `createUsersTable`). If the status is not 200, or the program cannot be reached, it throws. The program address is one constant at the top of the file. Each function has its own `fetch`; there is no shared helper, as `docs/STYLE.md` asks.

SQL query files: the same seven, now in `src/db/queries/`. No query is added or changed.

## logic

All seven functions become `async`. What each receives and returns does not change: the same one object as input, and `id`, `name`, `email`, `createdAt`, `updatedAt` (or the array, nothing, or the count) as output.

- Order inside each function: unchanged. Only `await` is added before each call to `queries/` and before each call to another `logic/` function.
- Errors: unchanged. The `try`/`catch` that turns a failure of `queries/` into "The database failed." now wraps the `await`, so an unreachable program gives the same sentence.
- Edge cases: unchanged (no users returns an empty array, nothing to update throws, and so on).
- `countUsersByGender` is already async; it only adds `await` to its `findAll`.

## Clients

- Web: `index.html` loads `app.js` with `type="module"`. `app.js` imports `listUsers`, `updateUser` and `deleteUser` from `../../logic/`, drops `localStorage` and the example users, and shows the message of the error it catches. Its functions become async. The `/* global */` line becomes `document, confirm`.
- Terminal and Jupyter: add `await` to the logic call. The program must be running.

## What must be running

The database program (`pnpm start`) before any client, including the terminal. Ollama is still needed only for the count by gender.

## Changes to the docs

- `docs/CONSTITUTIONS.md`: the new `.sql` file goes in `src/db/queries/`, not `src/queries/queries/`.
- `docs/DATABASE.md`: the program owns the connection and reads the `.sql` files; `queries/` calls it.
- `docs/ARCHITECTURE.md`: `db/` holds the program; `queries/` is its client; `logic/` is async; `web/` uses `logic/` and is no longer an exception.
- `docs/TREE.md`: `db/server.js` and `db/queries/*.sql`; `queries/queries/` is gone.
- `docs/ERRORS.md`: no new sentence. A note: "The database failed." also covers a program that is not running.
- `AGENTS.md`: the lines about `node:sqlite` in `connection.js`, about `pnpm format` paths and "no `pnpm start`".

## Packages

No Node package is added, so there is no Socket review.

## What stays as it is

The rules and the error sentences of `logic/`, the SQL of the seven queries, the `users` table, the screens and texts of the page, and `connection.js`.

## How it is checked

Start the program. Paste the terminal files for create, list, update and delete. Open the page, edit, save, reload and delete. `curl` each endpoint, an unknown name and a broken body. Check that `/db/users.sqlite` and a `.sql` path answer 404. Stop the program and see "The database failed.". Then `pnpm lint` and `pnpm format`.

## Decisions to review

1. Named endpoints, not a raw SQL endpoint, so SQL never leaves the program.
2. `server.js` is a script with a request handler, not an exported function, so the "one function per file" rule is read as applying to `logic/` and `queries/`. Say if you want it split.
3. The `.sql` files move to `src/db/queries/`, which changes a line of the constitution.
4. Port 3000, fixed.
