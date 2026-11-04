# Tasks — An HTTP client for the users

Do the tasks in order. Inside a task, do the steps in order. There is no query and no change in `logic/`, so those tasks do not exist.

## Task 1 — Update the docs

- [x] In `AGENTS.md`, change "There is no web framework and no TypeScript" to say Express is the only web framework, used only by `src/clients/api/`, and there is no TypeScript. Result: the line allows Express for the HTTP client only.
- [x] In `AGENTS.md`, add the `pnpm api` script and the `src/clients/api` path of `pnpm format` where scripts are described. Result: both match `package.json` after this feature.
- [x] In `docs/CONSTITUTIONS.md`, align any line that repeats the "no framework" rule. Result: no line contradicts `AGENTS.md`.
- [x] In `docs/ERRORS.md`, add the sentence "The request is not valid." and say it is used by the HTTP client for input it checks before calling `logic/`. Result: the sentence is in the list.
- [x] In `docs/ARCHITECTURE.md`, add `api/` under `src/clients/` as a client that imports `logic/` and talks HTTP on 3001. Result: the clients list has `api/`.
- [x] In `docs/ARCHITECTURE.md`, adjust the line "A client imports a function from `logic/` and prints the result". Result: it also covers a client that answers over HTTP.
- [x] In `docs/TREE.md`, add `api/server.js` under `clients/`. Result: the tree lists the file.
- [x] In `docs/TREE.md`, add `api.txt` under `clients/terminal/`. Result: the tree lists the file.

## Task 2 — Get Express ready

- [x] Run Socket `alerts` for `express` 5.2.1. Result: the alerts, or none, are noted in `plan.md`.
- [x] Run Socket `threat_feed` for `express` 5.2.1. Result: the answer is noted in `plan.md`.
- [x] Run Socket `depscore` on the dependencies of `express`, down to 3 layers. Result: any stat below 50 is shown to the person, who decides.
- [x] Wait for the person to accept the Socket result. Result: no install before the answer.
- [x] Run `pnpm add --save-exact express`. Result: `package.json` and `pnpm-lock.yaml` list `express` 5.2.1.
- [x] Add the `api` script to `package.json`. Result: `pnpm api` runs `src/clients/api/server.js`.
- [x] Add `src/clients/api` to the `format` script in `package.json`. Result: `pnpm format` covers the HTTP client.

## Task 3 — Write the HTTP client

- [x] Create `src/clients/api/server.js` with the `express` import, the port constant `3001` with a short comment, and an `express()` app that reads JSON bodies. Result: the file exists and has no route yet.
- [x] Add the imports of the five `logic/` functions, with the `.js` extension. Result: the five names are imported.
- [x] Add `POST /users`: check that `request.body` is an object. Result: `null`, `undefined` or a non-object answers 400 "The request is not valid.".
- [x] In `POST /users`, check that `name` and `email` are strings with `typeof`. Result: anything else answers 400 "The request is not valid.".
- [x] In `POST /users`, call `createUser` and answer 201 with the user. Result: a valid body creates a user.
- [x] In `POST /users`, turn the error sentences into 400, 409 and 500 as in `plan.md`. Result: each sentence answers its status with `{ "error": "<sentence>" }`.
- [x] In `POST /users`, answer any other error with `console.error(error)` and 500 "The database failed.". Result: a real bug shows in the terminal and nothing else leaks.
- [x] Add `GET /users`: call `listUsers` and answer 200 with the array. Result: the list, empty if there are none.
- [x] In `GET /users`, turn the errors into a status as in `plan.md`. Result: "The database failed." answers 500 and any other error is logged and answers 500.
- [x] Add `GET /users/:id`: turn the id into a number with `Number(...)`, call `findUserById` and answer 200 with the user. Result: an existing id answers the user.
- [x] In `GET /users/:id`, turn the errors into a status as in `plan.md`. Result: "No user was found." answers 404, including for `abc`.
- [x] Add `PATCH /users/:id`: check that `request.body` is an object. Result: `null`, `undefined` or a non-object answers 400 "The request is not valid.".
- [x] In `PATCH /users/:id`, check that `name` and `email`, if present, are strings. Result: `{"name": ["x"]}` answers 400 "The request is not valid.".
- [x] In `PATCH /users/:id`, call `updateUser` with the id as a number and answer 200 with the user. Result: a valid body updates the user.
- [x] In `PATCH /users/:id`, turn the errors into a status as in `plan.md`. Result: 400, 404, 409 and 500 answer with their sentence, and `{}` answers 400 "There is nothing to update.".
- [x] Add `DELETE /users/:id`: turn the id into a number, call `deleteUser` and answer 204 with no body. Result: the user is gone.
- [x] In `DELETE /users/:id`, turn the errors into a status as in `plan.md`. Result: "No user was found." answers 404.
- [x] Add one error-handling middleware that answers `{ "error": "The request is not valid." }` with 400 for a body that is not valid JSON. Result: broken JSON does not answer HTML.
- [x] Make the app listen on `127.0.0.1` and the port constant, and log the address. Result: `pnpm api` prints `HTTP client on http://127.0.0.1:3001`.
- [x] Create `src/clients/terminal/api.txt` with Spanish comments, the two first lines about `first-app` and the two programs that must run, and a `curl` for each of the five routes. Result: the file can be pasted into the terminal.

## Task 4 — Run it

- [x] Run `pnpm start` and `pnpm api`. Result: the database program on 3000 and the HTTP client on 3001 are running.
- [x] With `curl`: create (201), create the same email again (409), create with no name (400), create with no body (400). Result: the four statuses.
- [x] With `curl`: `POST` with `{"name": 5, "email": "a@b.com"}` and with `{"name": "Ana"}` and no email. Result: both answer 400.
- [x] With `curl`: list, get by id, get an id that does not exist and `abc`. Result: 200, 200, 404 and 404.
- [x] With `curl`: patch the name, the email, both, `{}` and `{"name": ["x"]}`. Result: 200, 200, 200, 400 and 400.
- [x] With `curl`: delete (204), get it again (404), send broken JSON (400). Result: the three statuses.
- [x] Stop `pnpm start` and call `GET /users`. Result: 500 "The database failed.".
- [x] Open `http://127.0.0.1:3000`. Result: the web page still works.
- [x] Run `pnpm format` and `pnpm lint`. Result: no errors.
- [x] Show the result and stop. Result: the next feature is not started.
