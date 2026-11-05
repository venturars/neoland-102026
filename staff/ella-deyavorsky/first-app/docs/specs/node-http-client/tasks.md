# Tasks — An HTTP client for the users written with node:http

Do the tasks in order. Inside a task, do the steps in order. There is no query, no change in `logic/` and no new package, so those tasks do not exist. `docs/CONSTITUTIONS.md` and `docs/STYLE.md` do not change. The work is on the branch `1109-feat-node-http-users-client`.

The six decisions of `plan.md` are accepted as recommended: the table drawn with `cli-table3` through `node` (already installed, no package added), no body limit, JSON 404 for unknown routes and methods, no index notebook, no file in `terminal/`, and `app.js` as one script with one handler.

## Task 1 — Update the docs

- [x] In `AGENTS.md`, add to "Commands": "`pnpm node-http` starts the `node:http` client on `http://127.0.0.1:3004` (the database program must be running). `pnpm jupyter-node-http` opens the notebooks of that client." Result: both scripts are described.
- [x] In `AGENTS.md`, add `src/clients/node-http/` to the list of `pnpm format`. Result: the list matches `package.json`.
- [x] In `docs/ARCHITECTURE.md`, add `node-http/` under `src/clients/`: `app.js` started with `pnpm node-http`, on `http://127.0.0.1:3004`, calling `logic/`, with the five routes of `api/`; the five notebooks live there and open with `pnpm jupyter-node-http`; the database program must be running. Result: the clients list has `node-http/`.
- [x] In `docs/ARCHITECTURE.md`, add `jupyter-node-http.sh` to `scripts/`: it starts the notebooks of `src/clients/node-http/`. Result: the line matches the script.
- [x] In `docs/TREE.md`, add `node-http/` under `clients/` with `app.js`, `create-user.ipynb`, `list-users.ipynb`, `find-user-by-id.ipynb`, `update-user.ipynb` and `delete-user.ipynb`, and add `jupyter-node-http.sh` under `scripts/`. Result: the tree lists the seven files.

## Task 2 — Scripts

- [x] In `package.json`, add `"node-http": "node src/clients/node-http/app.js"` and `"jupyter-node-http": "sh scripts/jupyter-node-http.sh"` to `scripts`. Result: both scripts exist.
- [x] In `package.json`, add `"src/clients/node-http/**/*.js"` to `format`. Result: Prettier covers the new client.
- [x] Create `scripts/jupyter-node-http.sh` as a copy of `scripts/jupyter.sh` with the comment and the last line pointing to `src/clients/node-http`. It keeps the `.venv` check, so it reuses the same `.venv` and `notebook` 7.6.3. Make it executable like the other. Result: `pnpm jupyter-node-http` opens `src/clients/node-http/`; `scripts/jupyter.sh` is untouched.

## Task 3 — The server

- [x] Create `src/clients/node-http/app.js` with the `/* global console */` line, the imports of the six functions of `logic/` by name, and the constants `HOST` (`127.0.0.1`) and `PORT` (`3004`), each with a short comment. Result: the file has the header.
- [x] Add `createServer` with one `async` handler. Take the path before `?`, remove one final `/`, and split it by `/`. Result: the handler knows the method, the collection or the id.
- [x] Add a step that reads the body of `POST` and `PATCH` from the chunks of `request`, parses it with `JSON.parse` and answers 400 `{ "error": "The request is not valid." }` if it is empty, not valid JSON, `null` or not an object. Result: a bad body never reaches `logic/`.
- [x] Add `POST /users` with the checks of `api/server.js` (`name` and `email` strings), `createUser`, 201 and the error table. Result: the route works.
- [x] Add `GET /users` with `listUsers`, 200 and the 500 `catch`. Result: the route works.
- [x] Add `GET /users/:id` with `Number(id)`, `findUserById`, 200, 404 and 500. Result: the route works.
- [x] Add `PATCH /users/:id` with `Number(id)`, `name` and `email` as strings or `undefined`, `updateUser`, 200 and the error table. Result: the route works.
- [x] Add `DELETE /users/:id` with `Number(id)`, `deleteUser`, 204 with no body, 404 and 500. Result: the route works.
- [x] Every answer but the 204 sets `Content-Type: application/json`. Any other error is logged with `console.error` and answers 500 "The database failed.". Result: nothing else leaks.
- [x] Any other path or method answers 404 `{ "error": "The request is not valid." }`. Result: unknown routes answer JSON.
- [x] Listen on `HOST` and `PORT` and print `HTTP client on http://127.0.0.1:3004`. Result: the server starts.
- [x] Check with `curl` on 3004 every case of "How it is checked" in `plan.md`, and send each one to 3001 too. Compare status and body. Result: they are the same, except for unknown routes (JSON here) and the body size.
- [x] Stop `pnpm start` and check the 500. Result: "The database failed.".

## Task 4 — The notebooks

For each notebook: a text cell in Spanish (title, what it does, what happens in the database, the route, the notes with the errors and how to try the stopped database, a link to the next notebook) and a Python cell with the values to change on top, using `urllib.request`. Data gives a table drawn by `cli-table3`: Python runs `node` from `first-app` (`cwd="../../.."`, `FORCE_COLOR=1`) and passes the rows as JSON in an argument, as the Jupyter notebooks do (Decision 1); a failure gives only the sentence; "The HTTP client is not running. Start it with pnpm node-http." if it cannot connect.

- [x] Create `src/clients/node-http/create-user.ipynb` with the example values of the Jupyter one. Result: it shows the new user in a table, and the failures as a sentence.
- [x] Create `src/clients/node-http/list-users.ipynb`. Result: it shows the users in a table, or an empty table message.
- [x] Create `src/clients/node-http/find-user-by-id.ipynb` with `id = 0`. Result: it shows "No user was found." and no table.
- [x] Create `src/clients/node-http/update-user.ipynb` with `id = 0`. Result: Run changes no one.
- [x] Create `src/clients/node-http/delete-user.ipynb` with `id = 0`. Result: Run deletes no one; with a real id it shows "The user was deleted.".
- [x] Run each notebook with the database running, with an error input, with the database stopped and with the client stopped. Result: the four cases show what the text says.

## Task 5 — Check the whole

- [x] Run `pnpm jupyter` and check it opens `src/clients/jupyter/`; run `pnpm jupyter-node-http` and check it opens `src/clients/node-http/`. Result: both folders open.
- [x] Open `http://127.0.0.1:3000` and `pnpm api` on 3001. Result: both still work.
- [x] Run `pnpm format` and `pnpm lint`. Result: no errors.
- [x] Show the result and stop.
