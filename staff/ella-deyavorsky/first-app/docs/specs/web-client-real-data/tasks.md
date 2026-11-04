# Tasks — The web client uses the real users

Do the tasks in order. Inside a task, do the steps in order.

## Task 1 — Update the docs

- [ ] In `docs/CONSTITUTIONS.md`, change the `.sql` folder of a new query to `src/db/queries/`. Result: the constitution points to the new folder.
- [ ] In `docs/DATABASE.md`, say the database program owns the connection and reads the `.sql` files. Result: no sentence says `queries/` reads a `.sql` file.
- [ ] In `docs/DATABASE.md`, say `queries/` asks the program for each query and the `.sql` files live in `src/db/queries/`. Result: the queries section matches the new design.
- [ ] In `docs/ARCHITECTURE.md`, say `db/` holds the database program and `queries/` is its client. Result: the layers list matches.
- [ ] In `docs/ARCHITECTURE.md`, say `logic/` is async and `web/` uses `logic/` like the other clients. Result: `web/` is no longer an exception.
- [ ] In `docs/TREE.md`, add `db/server.js` and `db/queries/` with the seven `.sql` files, and remove `queries/queries/`. Result: the tree matches the folders.
- [ ] In `docs/ERRORS.md`, note that "The database failed." also covers a program that is not running. Result: the note is there and no sentence is added.
- [ ] In `AGENTS.md`, change the line about `node:sqlite` in `connection.js`. Result: it says the program opens the database.
- [ ] In `AGENTS.md`, change the line about the `pnpm format` paths and the line "no `pnpm start`". Result: both match `package.json` after this feature.

## Task 2 — Get the database program ready

- [ ] Move the seven `.sql` files with `git mv` from `src/queries/queries/` to `src/db/queries/`. Result: `src/queries/queries/` no longer exists.
- [ ] Create `src/db/server.js` that reads the seven `.sql` files and answers `POST /queries/<name>` as in `plan.md`. Result: each query answers with the status in the plan.
- [ ] Make `src/db/server.js` create the `users` table when it starts. Result: a new database file has the table.
- [ ] Make `src/db/server.js` serve the `.html`, `.css` and `.js` files of `src/clients/web/`, `src/logic/` and `src/queries/` on `GET`. Result: `http://localhost:3000` returns the page and `/db/users.sqlite` returns 404.
- [ ] Add the `start` script to `package.json`. Result: `pnpm start` runs `src/db/server.js`.
- [ ] Add `src/clients/web` to the `format` script in `package.json`. Result: `pnpm format` covers the web client.
- [ ] Start the program with `pnpm start` and `curl` one query, an unknown name and a broken body. Result: 200, 404 and 400.

## Task 3 — Write the queries

- [ ] In `src/queries/users.js`, remove the `node:*` imports, the `db` import and the `readFileSync` lines. Result: the file has no `node:*` import and no `.sql` path.
- [ ] Add the program address as a constant at the top of `src/queries/users.js`. Result: one constant with a short comment.
- [ ] Rewrite `createUsersTable` to call the program with `fetch`. Result: it is async and throws if the status is not 200.
- [ ] Rewrite `insert` to call the program with `fetch`. Result: it returns the new row.
- [ ] Rewrite `findById` to call the program with `fetch`. Result: it returns the row or `null`.
- [ ] Rewrite `findByEmail` to call the program with `fetch`. Result: it returns the row or `null`.
- [ ] Rewrite `findAll` to call the program with `fetch`. Result: it returns the array.
- [ ] Rewrite `update` to call the program with `fetch`. Result: it returns the updated row.
- [ ] Rewrite `remove` to call the program with `fetch`. Result: it returns nothing.

## Task 4 — Update the logic

- [ ] Make `listUsers` async. Result: `src/logic/list-users.js` has `async`.
- [ ] Await `findAll` inside the `try` of `listUsers`. Result: a failure still throws "The database failed.".
- [ ] Make `findUserById` async. Result: `src/logic/find-user-by-id.js` has `async`.
- [ ] Await `findById` inside the `try` of `findUserById`. Result: same errors as before.
- [ ] Make `findUserByEmail` async. Result: `src/logic/find-user-by-email.js` has `async`.
- [ ] Await `findByEmail` inside the `try` of `findUserByEmail`. Result: same errors as before.
- [ ] Make `createUser` async. Result: `src/logic/create-user.js` has `async`.
- [ ] Await `findByEmail` in the business rules of `createUser`. Result: "This email is already used." still works.
- [ ] Await `insert` in the apply step of `createUser`. Result: it returns the new user and a failure still throws "The database failed.".
- [ ] Make `updateUser` async. Result: `src/logic/update-user.js` has `async`.
- [ ] Await `findById` in the business rules of `updateUser`. Result: "No user was found." still works.
- [ ] Await `findByEmail` in the business rules of `updateUser`. Result: "This email is already used." still works.
- [ ] Await `update` in the apply step of `updateUser`. Result: it returns the updated user.
- [ ] Make `deleteUser` async. Result: `src/logic/delete-user.js` has `async`.
- [ ] Await `findById` in the business rules of `deleteUser`. Result: "No user was found." still works.
- [ ] Await `remove` in the apply step of `deleteUser`. Result: it returns nothing.
- [ ] Await `findAll` in `countUsersByGender`. Result: it returns the same count object.

## Task 5 — Update the clients

- [ ] Add `await` to the logic call in each `.txt` of `src/clients/terminal/`, one file per step (`create-user.txt`, `delete-user.txt`, `find-user-by-email.txt`, `find-user-by-id.txt`, `list-users.txt`, `update-user.txt`, `count-users-by-gender.txt`, `create-users-table.txt`). Result: each file runs with the program running.
- [ ] Add `await` to the logic call in each notebook of `src/clients/jupyter/`, one notebook per step (the six feature notebooks, `count-users-by-gender.ipynb` and `prepare-database.ipynb`). Result: each notebook runs with the program running.
- [ ] In `src/clients/web/index.html`, load `app.js` with `type="module"`. Result: the page loads `app.js` as a module.
- [ ] In `src/clients/web/app.js`, import `listUsers`, `updateUser` and `deleteUser` from `../../logic/`. Result: the file has three imports.
- [ ] In `src/clients/web/app.js`, remove `STORAGE_KEY`, `EXAMPLE_USERS`, `loadUsers` and `saveUsers`. Result: no `localStorage` in the file.
- [ ] In `src/clients/web/app.js`, make `renderList` and `chooseUser` async and use `listUsers`. Result: the list shows the users of the database.
- [ ] In `src/clients/web/app.js`, make `saveUser` async, use `updateUser` and remove the check of the page. Result: the screen shows the message of the thrown error.
- [ ] In `src/clients/web/app.js`, make `deleteUser` async and use the logic `deleteUser`. Result: a deleted user leaves the database.
- [ ] In `src/clients/web/app.js`, change the `/* global */` line to `document, confirm`. Result: `pnpm lint` does not complain about globals.

## Task 6 — Run it

- [ ] Start the program and paste `create-user.txt`, `list-users.txt`, `update-user.txt` and `delete-user.txt`. Result: each works with `await`.
- [ ] Open `http://localhost:3000`, edit a user, save and reload. Result: the change persists and the terminal list shows it.
- [ ] Try an empty name, an email without `@` and a used email. Result: the message of the app is shown.
- [ ] Delete a user and reload. Result: the user is gone from the page and the database.
- [ ] Stop the program and press Save. Result: "The database failed." is shown.
- [ ] Open `/db/users.sqlite` and a `.sql` path in the browser. Result: both answer 404.
- [ ] Run `pnpm format` and `pnpm lint`. Result: no errors and no changes.
- [ ] Stop. Result: the one-pass cycle is done.
