# Tasks — A Bruno collection for the users HTTP client

Do the tasks in order. Inside a task, do the steps in order. There is no query, no change in `logic/` and no package, so those tasks do not exist. The `.bru` files are not JavaScript, so `pnpm format` and `pnpm lint` do not apply to them.

## Task 1 — Update the docs

- [x] In `docs/ARCHITECTURE.md`, add to the `api/` line that `bruno/` holds a Bruno collection to try the routes by hand, that Bruno is an outside tool and that `pnpm` does not run it. Result: the line describes `bruno/`.
- [x] In `docs/TREE.md`, add `bruno/` under `src/clients/api/` with `README.md`, `bruno.json`, the folder `environments/` with `local.bru`, and the four request folders with their `.bru` files. Result: the tree lists every file of the collection.

## Task 2 — Get Bruno ready

- [x] Check that Bruno is installed on the machine (open it, or look for the app). Result: Bruno opens; if not, the person installs it from its official site before the next task.
- [x] Check that `package.json` and `pnpm-lock.yaml` have no change in git. Result: no package was added.

## Task 3 — Write the collection

- [x] Create `src/clients/api/bruno/bruno.json` with `version`, `name` and `type: "collection"`. Result: Bruno recognizes the folder as a collection.
- [x] Create `src/clients/api/bruno/environments/local.bru` with the variable `baseUrl` set to `http://127.0.0.1:3001`. Result: the environment `local` exists.
- [x] Create `01 CRUD/create-user.bru`: `POST {{baseUrl}}/users` with Ady, asserts 201 and the user fields, and a post-response script that saves `id` in `userId`. Result: the request exists.
- [x] Create `01 CRUD/list-users.bru`: `GET /users`, asserts 200 and an array. Result: the request exists.
- [x] Create `01 CRUD/find-user.bru`: `GET /users/{{userId}}`, asserts 200 and the same user. Result: the request exists.
- [x] Create `01 CRUD/update-user.bru`: `PATCH /users/{{userId}}` with the name "Ada", asserts 200 and the new name. Result: the request exists.
- [x] Create `02 Errors/create-without-name.bru`: asserts 400 "The request is not valid.". Result: the request exists.
- [x] Create `02 Errors/create-with-empty-name.bru`: asserts 400 "The name is missing.". Result: the request exists.
- [x] Create `02 Errors/create-with-bad-email.bru`: asserts 400 "The email is not valid.". Result: the request exists.
- [x] Create `02 Errors/create-with-repeated-email.bru`: asserts 409 "This email is already used.". Result: the request exists.
- [x] Create `02 Errors/update-with-nothing.bru`: `PATCH` with `{}`, asserts 400 "There is nothing to update.". Result: the request exists.
- [x] Create `02 Errors/create-with-invalid-json.bru`: raw body `{ "name": `, asserts 400 "The request is not valid.". Result: the request exists.
- [x] Create `02 Errors/find-missing-user.bru`: `GET /users/999999`, asserts 404 "No user was found.". Result: the request exists.
- [x] Create `02 Errors/find-id-not-a-number.bru`: `GET /users/abc`, asserts 404 "No user was found.". Result: the request exists.
- [x] Create `02 Errors/update-missing-user.bru`: `PATCH /users/999999`, asserts 404 "No user was found.". Result: the request exists.
- [x] Create `02 Errors/delete-missing-user.bru`: `DELETE /users/999999`, asserts 404 "No user was found.". Result: the request exists.
- [x] Create `03 Delete/delete-user.bru`: `DELETE /users/{{userId}}`, asserts 204. Result: the request exists.
- [x] Create `03 Delete/find-deleted-user.bru`: `GET /users/{{userId}}`, asserts 404 "No user was found.". Result: the request exists.
- [x] Create `04 SQL down/list-users-database-stopped.bru`: `GET /users`, asserts 500 "The database failed.". Result: the request exists.
- [x] Create `src/clients/api/bruno/README.md` in Spanish: what to install, what to start, how to open the collection and pick `local`, the request list with the expected answers, the SQL-down steps and the clean-up after a cut run. Result: the guide exists.

## Task 4 — Run it

- [ ] Start `pnpm start` and `pnpm api`. Result: both programs answer.
- [ ] Open the collection in Bruno, pick `local` and run the folders `01 CRUD`, `02 Errors` and `03 Delete` in order. Result: every request and every assert passes.
- [ ] Run the three folders a second time. Result: they pass again, so the collection leaves no user behind.
- [ ] Stop `pnpm start` and send the request of `04 SQL down`. Result: 500 "The database failed.", and the assert passes.
- [ ] Start `pnpm start` again and check that `git status` shows only the files of this feature. Result: no change in `package.json`, `pnpm-lock.yaml` or `src/clients/api/server.js`.
