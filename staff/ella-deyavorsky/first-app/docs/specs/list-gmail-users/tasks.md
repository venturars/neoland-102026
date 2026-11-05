# Tasks — A list of users with Gmail emails

Do the tasks in order. Inside a task, do the steps in order. No outside tool or package is needed, so that task does not exist. `docs/CONSTITUTIONS.md` and `docs/ERRORS.md` do not change. The Nest client and the VS Code extension are part of this feature; they reached `staging` after the first version of these files, and `staging` is merged into the branch. The work is on the branch `1032-feat-list-gmail-users`.

## Task 1 — Update the docs

- [x] In `docs/DATABASE.md`, add `findGmail` to the list of query functions. Result: the list has eight functions.
- [x] In `docs/DATABASE.md`, add "`findGmail` runs `find-gmail.sql`." to the list of what each function runs. Result: the new query is described.
- [x] In `docs/DATABASE.md`, add a short note that `find-gmail.sql` returns the users whose email contains `@gmail`, oldest id first. Result: the rule is written once, next to the query.
- [x] In `docs/TREE.md`, add `find-gmail.sql` under `db/queries/`. Result: the tree lists the file.
- [x] In `docs/TREE.md`, add `list-gmail-users.js` under `logic/`. Result: the tree lists the file.
- [x] In `docs/TREE.md`, add `list-gmail-users.txt` under `clients/terminal/`. Result: the tree lists the file.
- [x] In `docs/TREE.md`, add `list-gmail-users.ipynb` under `clients/jupyter/`. Result: the tree lists the file.
- [x] In `docs/ARCHITECTURE.md`, add `find-gmail.sql` to the entry of `db/queries/`. Result: the layer entry has the file.
- [x] In `docs/ARCHITECTURE.md`, add "`list-gmail-users.js` returns the users whose email contains `@gmail`." under `logic/`. Result: the entry has the file.
- [x] In `docs/ARCHITECTURE.md`, add `GET /users/gmail` to the entry of the HTTP client. Result: the route is listed.
- [x] In `docs/ARCHITECTURE.md`, add `GET /users/gmail` to the entry of the program of the Chrome extension. Result: the route is listed.
- [x] In `docs/ARCHITECTURE.md`, add `GET /users/gmail` to the entry of the Nest client. Result: the route is listed.
- [x] In `docs/ARCHITECTURE.md`, add the "Solo Gmail" button to the entry of the VS Code extension. Result: the button is listed.
- [x] In `docs/ARCHITECTURE.md`, add `list-gmail-users.txt` and `list-gmail-users.ipynb` to the entries of the terminal and Jupyter clients. Result: both files are listed.

## Task 2 — Write the query

- [x] Create `src/db/queries/find-gmail.sql`: the columns and `AS` renames of `find-all.sql`, `FROM users`, `WHERE email LIKE '%@gmail%'`, `ORDER BY id`. Result: the file exists and takes no named values.
- [x] In `src/db/server.js`, add `"find-gmail": "all"` to `QUERIES`. Result: the database program loads the file and answers `POST /queries/find-gmail` with an array.
- [x] In `src/queries/users.js`, add `findGmail()`: one `fetch` to `/queries/find-gmail` with the body `{}`, as `findAll()` does. Result: the function exists.
- [x] In `findGmail()`, return the parsed JSON when the answer is ok. Result: it returns the array.
- [x] In `findGmail()`, throw "The database failed." on any failure. Result: an unreachable program gives the app's sentence.

## Task 3 — Write the logic

- [x] Create `src/logic/list-gmail-users.js` with the exported async function `listGmailUsers()` and no input. Result: the file exists; there is no input to clean or check, and no business rule.
- [x] Apply the action: `await findGmail()` inside a `try`/`catch` that throws "The database failed." Result: a failure of the query gives the app's sentence.
- [x] Return the result: `map` each row to `id`, `name`, `email`, `createdAt` and `updatedAt`. Result: only those fields leave `logic/`, and no match gives `[]`.

## Task 4 — Write the clients

- [x] Create `src/clients/terminal/list-gmail-users.txt`, built like `list-users.txt`, with `listGmailUsers`. Result: pasting it prints the Gmail users.
- [x] In `src/clients/api/server.js`, import `listGmailUsers`. Result: the function is available.
- [x] In `src/clients/api/server.js`, add `GET /users/gmail` before `GET /users/:id`, answering 200 with the array and 500 `{ "error": "The database failed." }` on error. Result: the route answers as `GET /users` does.
- [x] In `src/clients/chrome/server.js`, import `listGmailUsers`. Result: the function is available.
- [x] In `src/clients/chrome/server.js`, add `GET /users/gmail` before any route with an id, answering as `GET /users` does. Result: the route answers 200 with the array.
- [x] In `src/clients/nest/users.controller.js`, import `listGmailUsers`. Result: the function is available.
- [x] In `src/clients/nest/users.controller.js`, add `listGmail()` with `@Get("users/gmail")` before `findOne()`, returning `listGmailUsers()`. Result: the route answers like `list()`.
- [x] In `src/clients/vscode/extension.js`, import `listGmailUsers`. Result: the function is available.
- [x] In `src/clients/vscode/extension.js`, add the action `"list-gmail"` to `runAction`, returning `{ users }` from `listGmailUsers()`. Result: the extension answers it like `"list"`.
- [x] In `src/clients/vscode/extension.js`, add the button "Solo Gmail" to the HTML, next to "Recargar". Result: the view shows the button.
- [x] In `src/clients/vscode/webview.js`, make the button send `{ action: "list-gmail" }`. Result: a click draws the Gmail users in the list.
- [x] Create `src/clients/jupyter/list-gmail-users.ipynb`, built like `list-users.ipynb`, with `listGmailUsers` and the same table. Result: running the cell shows the Gmail users in a table.
- [x] In `src/clients/jupyter/00-welcome-and-index.ipynb`, add a row for the new notebook. Result: the index links it.
- [x] In `src/clients/jupyter/README.md`, add `list-gmail-users.ipynb` and `listGmailUsers` to the table. Result: the table lists it.
- [x] In `src/clients/web/index.html`, add the buttons "Solo Gmail" and "Ver todos" above the list. Result: the list screen shows both buttons.
- [x] In `src/clients/web/app.js`, import `listGmailUsers` and add `onlyGmail`, `false` at the start. Result: the page holds the value.
- [x] In `src/clients/web/app.js`, make `renderList()` call `listGmailUsers()` when `onlyGmail` is `true` and `listUsers()` when it is `false`. Result: the list follows the value.
- [x] In `src/clients/web/app.js`, make "Solo Gmail" set `onlyGmail` to `true` and call `renderList()`, and "Ver todos" set it to `false` and call `renderList()`. Result: the buttons switch the list.
- [x] In `src/clients/electron/index.html`, add the buttons "Solo Gmail" and "Ver todos" above the list. Result: the list screen shows both buttons.
- [x] In `src/clients/electron/app.js`, import `listGmailUsers` and add `onlyGmail`, `false` at the start. Result: the window holds the value.
- [x] In `src/clients/electron/app.js`, make `renderList()` call `listGmailUsers()` when `onlyGmail` is `true` and `listUsers()` when it is `false`. Result: the list follows the value.
- [x] In `src/clients/electron/app.js`, make "Solo Gmail" set `onlyGmail` to `true` and call `renderList()`, and "Ver todos" set it to `false` and call `renderList()`. Result: the buttons switch the list.

## Task 5 — Run it

- [x] Start `pnpm start`, then create `ada@gmail.com`, `bob@example.com` and `eve@gmailer.com`. Result: three users exist.
- [x] Paste `src/clients/terminal/list-gmail-users.txt`. Result: Ada and Eve print, Bob does not.
- [x] Start `pnpm api` and `pnpm chrome`, and `curl` `GET /users/gmail` on ports 3001 and 3002. Result: both answer 200 with Ada and Eve.
- [x] Start `pnpm nest` and `curl` `GET /users/gmail` on port 3003. Result: it answers 200 with Ada and Eve, and `GET /users/1` still works.
- [x] Run the cell of `list-gmail-users.ipynb`. Result: the table shows Ada and Eve.
- [x] Open the web page with `pnpm browser`, click "Solo Gmail", then "Ver todos". Result: the list shows Ada and Eve, then all three.
- [x] Open the desktop window with `pnpm electron` and repeat the clicks. Result: the same.
- [x] Open the VS Code extension with `pnpm vscode`, click "Solo Gmail", then "Recargar". Result: the list shows Ada and Eve, then all three.
- [x] Delete Ada and Eve and ask for the Gmail users in the terminal. Result: `[]`.
- [x] Run `pnpm format` and `pnpm lint`. Result: both pass.
