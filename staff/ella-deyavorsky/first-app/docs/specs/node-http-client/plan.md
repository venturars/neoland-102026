# Plan — An HTTP client for the users written with node:http

A new client in `src/clients/node-http/`. It is a thin layer, as `src/clients/api/server.js` is: each route calls one existing function of `src/logic/` and turns its result or its error into an HTTP answer. Nothing in `logic/`, `queries/` or `db/` changes, there is no new SQL, there is no new error sentence and there is no new package.

## Files to add or change

- Add `src/clients/node-http/app.js`: the server. It uses `createServer` from `node:http`, defines the five routes and listens on `127.0.0.1:3004`. `HOST` and `PORT` are constants at the top, with a short comment (`docs/STYLE.md`). It is a script, like `src/db/server.js` and `src/clients/api/server.js`.
- Add five notebooks in `src/clients/node-http/`, in this order and with these names: `create-user.ipynb`, `list-users.ipynb`, `find-user-by-id.ipynb`, `update-user.ipynb`, `delete-user.ipynb` (the same names and the same order as the Jupyter client). See "The notebooks".
- Change `package.json`: add the scripts `"node-http": "node src/clients/node-http/app.js"` and `"jupyter-node-http": "sh scripts/jupyter-node-http.sh"`, and add `src/clients/node-http` to `format`. No dependency is added.
- Add `scripts/jupyter-node-http.sh`: a separate script, written like `scripts/jupyter.sh` (go to the root of the project, create `.venv` and install `notebook` 7.6.3 only if missing, so it reuses the same `.venv`) and ending with `.venv/bin/jupyter notebook --ip=127.0.0.1 --port=8888 src/clients/node-http`. `scripts/jupyter.sh` and `pnpm jupyter` do not change.
- Change the docs listed below.

## The server

There is no router, so `app.js` has one request handler that reads `request.method` and `request.url` and chooses the route with `if`. The path is split by `/`. A path `/users` is the collection and `/users/<id>` is one user. Each route has its own inline code (no helper, `docs/STYLE.md`), written as in `api/server.js`.

| Route | Calls | Success |
|---|---|---|
| `POST /users` | `createUser({ name, email })` | 201, the user |
| `GET /users` | `listUsers()` | 200, the array |
| `GET /users/:id` | `findUserById({ id })` | 200, the user |
| `PATCH /users/:id` | `updateUser({ id, name, email })` | 200, the user |
| `DELETE /users/:id` | `deleteUser({ id })` | 204, no body |

- Every answer sets `Content-Type: application/json` (not the 204), and the body is `JSON.stringify(...)`.
- `id` comes from the path and is turned into a number with `Number(...)` before the call, as in Express. `abc` gives 404 "No user was found.".
- The body of `POST` and `PATCH` is read by hand: the chunks of `request` are joined and the text goes through `JSON.parse`. A body that is empty, is not valid JSON, is `null` or is not an object answers 400 "The request is not valid.". `name` and `email` follow the same checks as `api/server.js`: both strings for `POST`; strings or `undefined` for `PATCH`. Other fields are ignored.
- The errors table is the one in `docs/specs/express-api/plan.md`. The `catch` of each route turns `error.message` into the status, and anything else is 500 "The database failed." after `console.error(error)`.
- A query string is ignored (the path is taken before `?`).

### Differences with Express that the code must not repeat

Express answers some things on its own. The plan lists them so `app.js` does them on purpose, with the same result:

- Express ignores a trailing slash (`/users/`). `app.js` does the same, by removing one final `/` from the path. To check when running.
- A body over a size limit: Express answers 413 over 100 kb. `app.js` has no limit in this plan (Decision 2).
- Express answers `OPTIONS`/`HEAD` automatically for some routes. `app.js` does not (Decision 3).

## The notebooks

Each notebook is a Jupyter document with Python as kernel, as the current ones. They live in `src/clients/node-http/`, they have no helper files and they share nothing, as in `src/clients/jupyter/`. Each has two cells, in Spanish like the other notebooks:

1. **Text cell** with, in this order: title; what the action does; what happens in the database (⚠️ the real one, whether it adds, changes or deletes); which route it uses (`POST http://127.0.0.1:3004/users`, …); notes (the values to change with ✏️, how to tell it worked, the errors that can appear and how to fix them, and how to try it with the database stopped: stop `pnpm start` and run again); a link back to the index (Decision 4).
2. **Code cell** (Python) with the values to change at the top. It sends the request with `urllib.request` from the standard library. It then prints the result:
   - the answer has data (create, list, find, update): a table made by `cli-table3` through `node`; the `id`, `name`, `email`, `createdAt` and `updatedAt` columns, with a colored header (`FORCE_COLOR=1`), as in the Jupyter client;
   - the answer is a failure (400, 404, 409, 500): only the sentence of the `error`, and no table;
   - delete shows "The user was deleted." (the status is 204 and there is no data) or the sentence of the failure;
   - the client is not running: the connection error is caught and the cell prints "The HTTP client is not running. Start it with pnpm node-http."

The notebooks that change data start with `id = 0` (it does not exist, so pressing Run changes no one), and `create-user` has the same example values as the Jupyter one. The notes say that the client and the database program must be running.

The table is drawn with `cli-table3` (Decision 1).

## Changes to the docs

- `AGENTS.md`: add `pnpm node-http` (on `http://127.0.0.1:3004`, the database program must be running) and `pnpm jupyter-node-http` to "Commands", and add `src/clients/node-http/` to the `pnpm format` list. The sentence about frameworks stays: `node:http` is not a framework.
- `docs/ARCHITECTURE.md`: add `node-http/` under `src/clients/`: `app.js` started with `pnpm node-http`, listening on `http://127.0.0.1:3004`, calling `logic/`, with the five routes of `api/`; the notebooks live there and open with `pnpm jupyter-node-http`; the database program must be running. In `scripts/`, add `jupyter-node-http.sh`.
- `docs/TREE.md`: add `node-http/` under `clients/` with `app.js` and the five notebooks, and add `jupyter-node-http.sh` under `scripts/`.
- `docs/CONSTITUTIONS.md` and `docs/ERRORS.md`: no change. The sentences are the ones that already exist, including "The request is not valid.". The line of `docs/ERRORS.md` about that sentence only names `src/clients/api/`; aligning it is left to another task.
- `src/clients/terminal/`: no file. `AGENTS.md` asks for one for a new feature of `logic/`; this feature adds no function to `logic/`. (Decision 5.)

## What stays as it is

`logic/`, `queries/`, `db/`, the ports 3000 to 3003, the Express, Chrome and Nest clients, the notebooks of `src/clients/jupyter/` and `pnpm jupyter`, and every existing error sentence.

## Packages

None. `node:http` is part of Node. There is no Socket review.

## What must be running

The database program (`pnpm start`) first, then `pnpm node-http`. For the notebooks, `pnpm jupyter-node-http` too.

## How it is checked

`pnpm start` and `pnpm node-http`. With `curl` on 3004, the same cases as in `docs/specs/express-api/plan.md`: create (201); the same email again (409); no name (400); no body (400); `{"name": 5, "email": "a@b.com"}` (400); `{"name": "Ana"}` (400); `PATCH` with `{"name": ["x"]}` (400), with each field, with both, and with `{}` (400); list; get by id; get an id that does not exist and `abc` (404); `/users/` with a final slash; delete (204) and get it again (404); broken JSON (400); an unknown path (404). Each case is also sent to 3001 (`pnpm api`) and the status and the body are compared. Stop `pnpm start` and see 500.

Then `pnpm jupyter-node-http`: run each notebook with the database running, with an error input, with the database stopped, and with the client stopped. Check that `pnpm jupyter` still opens `src/clients/jupyter/`, and that the web page on 3000 still works. Then `pnpm format` and `pnpm lint`.

## Decisions to review

1. **How is the table drawn?** Decided: with `cli-table3`, which is already a dependency of the app (with `@colors/colors` for the colored header), as in the Jupyter client. Python sends the request with `urllib.request`. With the answer, it runs `node` from `first-app` (three folders up, as the current notebooks do) and passes the rows as JSON in an argument. The Node code builds the table with `cli-table3` and prints it. No package is added and no helper file is created. When the answer is a failure, Python prints the sentence and does not run Node.
2. **No size limit for the body.** Express limits it to 100 kb; `app.js` as planned reads it whole. It is a local client. Recommended: no limit, and say so in the spec. If you want the 413, it is one more check.
3. **Unknown routes and methods.** The spec says 404 `{"error": "The request is not valid."}` for any unknown path or method. Express answers 404 with an HTML page there. Recommended: the JSON answer, because the client is JSON everywhere. The alternative is to copy Express.
4. **No index notebook.** The issue asks for one document per action and no welcome notebook. Recommended: no `00-welcome-and-index.ipynb`; the "back to the index" link is dropped, and each notebook links to the next one. If you want an index, it is a sixth file.
5. **No `.txt` in `terminal/`.** The `api.txt` file holds `curl` examples. Here the notebooks play that role, so no `node-http.txt` is added. If you want one, it is one more file listed in `docs/TREE.md`.
6. **`app.js` is one script with one handler.** `docs/STYLE.md` says one function per file. Like `api/server.js` and `db/server.js`, this reads that rule as applying to `logic/` and `queries/`. Without a router, the handler is longer than the Express routes.
