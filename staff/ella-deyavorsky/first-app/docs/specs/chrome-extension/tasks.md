# Tasks — A Chrome extension for the users

Do the tasks in order. Inside a task, do the steps in order. There is no query and no change in `logic/`, so those tasks do not exist. `docs/CONSTITUTIONS.md` does not change.

## Task 1 — Update the docs

- [x] In `docs/ERRORS.md`, add the sentence "The extension server is not running." and say it is raised by the popup of `src/clients/chrome/` when it cannot reach its own program, and that `logic/` never throws it. Result: the sentence is in the list before any code uses it.
- [x] In `AGENTS.md`, change the line about Express to: "The only web frameworks are Express, used only by the HTTP client in `src/clients/api/`, and Fastify, used only by the program of the extension in `src/clients/chrome/`. There is no TypeScript." Result: the line allows Fastify for the extension only.
- [x] In `AGENTS.md`, add `pnpm chrome` (the program of the extension on `http://127.0.0.1:3002`, with the database program running) to "Commands". Result: the script is described.
- [x] In `AGENTS.md`, add `src/clients/chrome/` to the paths of `pnpm format`. Result: it matches `package.json` after this feature.
- [x] In `docs/ARCHITECTURE.md`, add `chrome/` under `src/clients/`: the Fastify program on `127.0.0.1:3002` and the popup that Chrome loads, in one folder. Result: the clients list has `chrome/`.
- [x] In `docs/ARCHITECTURE.md`, adjust the line about clients. Result: it also says the popup talks only to its own program and not to `logic/`.
- [x] In `docs/TREE.md`, add `chrome/` under `clients/` with `manifest.json`, `popup.css`, `popup.html`, `popup.js` and `server.js`. Result: the tree lists the five files.
- [x] In `docs/TREE.md`, add `chrome.txt` under `clients/terminal/`. Result: the tree lists the file.

## Task 2 — Get Fastify ready

The Socket review of `fastify` 5.12.8 and its dependencies is in `plan.md` and was accepted with the plan.

Note: `pnpm add --save-exact fastify` failed on 2026-11-04 because the pnpm minimum release age (24h) rejected `electron@45.2.2`, already in the lockfile from staging. It was installed with `--config.minimumReleaseAgeExclude=electron`, which exempts only `electron` for that one command.

- [x] Run `pnpm add --save-exact fastify`. Result: `package.json` and `pnpm-lock.yaml` list `fastify` 5.12.8.
- [x] Add the `chrome` script to `package.json`: `node src/clients/chrome/server.js`. Result: `pnpm chrome` runs the program of the extension.
- [x] Add `src/clients/chrome` to the `format` script in `package.json`. Result: `pnpm format` covers the extension.

## Task 3 — Write the program of the extension

- [x] Create `src/clients/chrome/server.js` with the `fastify` import, the constants `HOST` (`127.0.0.1`) and `PORT` (`3002`) with short comments, and a Fastify app. Result: the file exists and has no route yet.
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
- [x] Add one `setErrorHandler` that answers 400 `{ "error": "The request is not valid." }` for a Fastify error with a 4xx status. Result: broken JSON, an empty body, a wrong content type or a body too large answer 400 in JSON.
- [x] In the same `setErrorHandler`, answer any other error with `console.error(error)` and 500 "The database failed.". Result: nothing else leaks.
- [x] Add one `setNotFoundHandler` that answers 404 with an empty body. Result: an unknown route answers 404 with no body.
- [x] Make the app listen on `HOST` and `PORT`, and log the address. Result: `pnpm chrome` prints `Extension server on http://127.0.0.1:3002`.
- [x] Create `src/clients/terminal/chrome.txt` with Spanish comments, the first lines about `first-app` and the two programs that must run, and a `curl` for each of the five routes on port 3002. Result: the file can be pasted into the terminal.

## Task 4 — Write the popup

- [x] Create `src/clients/chrome/manifest.json`: Manifest V3, name, version, `action.default_popup` set to `popup.html`, and `host_permissions` for `http://127.0.0.1:3002/*` only. Result: Chrome can load the folder, with no other permission.
- [x] Create `src/clients/chrome/popup.html` with the list, the form (name, email), the buttons `Crear`, `Guardar`, `Borrar` and `Nuevo usuario`, the delete confirmation (a text field, `Confirmar borrado` and `Cancelar`), and a place for errors. It loads `popup.css` and `popup.js` as a module, with no inline script. Result: the one screen exists, with all texts in Spanish.
- [x] Create `src/clients/chrome/popup.css` with a simple style for the list, the form and the buttons. Result: the popup is readable at a small size.
- [x] Create `src/clients/chrome/popup.js` with `/* global document, fetch */`, the address `http://127.0.0.1:3002` as a constant with a short comment, and the references to the elements of `popup.html`. Result: the file exists and does nothing yet.
- [x] In `popup.js`, add the step that calls `GET /users` and draws the list, or a text that says there are none. Result: the list shows the real users when the popup opens.
- [x] In `popup.js`, turn a `fetch` that cannot connect (`TypeError`) into the sentence "The extension server is not running." and show it. Result: with the program stopped, the popup shows that sentence.
- [x] In `popup.js`, show the `error` sentence of any answer that is not successful. Result: each sentence of `docs/ERRORS.md` appears as written, in English.
- [x] In `popup.js`, add the step for `Crear`: call `POST /users` with the name and the email of the form, clear the form and draw the list again. Result: a new user appears in the list.
- [x] In `popup.js`, add the click on a user: call `GET /users/:id`, load the user in the form, show `Guardar` and `Borrar` and hide `Crear`. Result: the form shows the chosen user.
- [x] In `popup.js`, add the step for `Guardar`: call `PATCH /users/:id` with the name and the email of the form and draw the list again. Result: the list shows the changes.
- [x] In `popup.js`, add the step for `Nuevo usuario`: clear the form, show `Crear` and hide `Guardar`, `Borrar` and the delete confirmation. Result: the form is ready to create again.
- [x] In `popup.js`, add the click on `Borrar`: show the text field and the buttons `Confirmar borrado` and `Cancelar`. Result: nothing is deleted yet.
- [x] In `popup.js`, add the step for `Confirmar borrado`: compare the text with the name saved for the loaded user, exactly and without trimming, and show `El nombre no coincide` if it is different. Result: a wrong text deletes nothing.
- [x] In `popup.js`, when the text matches, call `DELETE /users/:id`, go back to the empty form and draw the list again. Result: the user is gone from the list.
- [x] In `popup.js`, add the step for `Cancelar`: close and clear the field. Result: the user stays loaded and nothing is deleted.

## Task 5 — Run it

- [x] Run `pnpm start` and `pnpm chrome`. Result: the database program on 3000 and the program of the extension on 3002 are running, and the second listens on `127.0.0.1` only.
- [x] With `curl` on 3002: create (201), create the same email again (409), create with no name (400), create with no body (400). Result: the four statuses.
- [x] With `curl`: `POST` with `{"name": 5, "email": "a@b.com"}` and with `{"name": "Ana"}` and no email. Result: both answer 400.
- [x] With `curl`: list, get by id, get an id that does not exist and `abc`. Result: 200, 200, 404 and 404.
- [x] With `curl`: patch the name, the email, both, `{}` and `{"name": ["x"]}`. Result: 200, 200, 200, 400 and 400.
- [x] With `curl`: delete (204), get it again (404), send broken JSON (400), send a wrong content type (400), call an unknown route (404 with no body). Result: the five statuses.
- [x] Stop `pnpm start` and call `GET /users` on 3002. Result: 500 "The database failed.".
- [x] Start `pnpm start` again. Load `src/clients/chrome/` in `chrome://extensions` with the developer mode on. Result: the extension loads with no error, even with `server.js` in the folder.
- [x] In the popup: create a user, click it, change the name and save. Result: the list shows the new name.
- [x] In the popup: try an empty name, an email that is not valid, and an email already used. Result: each sentence shows and nothing is saved.
- [x] In the popup: click `Borrar`, type the name with the wrong capital letters, then type it exactly. Result: the first shows `El nombre no coincide` and deletes nothing, the second deletes the user.
- [x] In the popup: use `Cancelar` in the delete confirmation and `Nuevo usuario`. Result: nothing is deleted and the form is empty again.
- [x] Stop `pnpm chrome` and open the popup. Result: it shows "The extension server is not running.".
- [x] Run `pnpm api` and open `http://127.0.0.1:3000`. Result: the HTTP client on 3001 and the web page still work.
- [x] Run `pnpm format` and `pnpm lint`. Result: no errors.
- [x] Show the result and stop. Result: the next feature is not started.
