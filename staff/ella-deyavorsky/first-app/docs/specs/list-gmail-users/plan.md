# Plan — A list of users with Gmail emails

A new action, `listGmailUsers`, built like `listUsers`: one file in `logic/`, one function in `queries/`, one `.sql` file, and a call from each client. The database program learns one more query. The rule "the email contains `@gmail`" lives only in the `.sql` file.

## Files to add or change

- Add `src/db/queries/find-gmail.sql`: the same columns and `AS` renames as `find-all.sql`, with `WHERE email LIKE '%@gmail%'` and `ORDER BY id`. The text is fixed in the file, so nothing a person types reaches the SQL, and the query takes no named values. SQLite's `LIKE` ignores capitals for ASCII letters, which gives the case rule of the spec.
- Change `src/db/server.js`: add `"find-gmail": "all"` to `QUERIES`. The `.sql` file is read by the existing loop.
- Change `src/queries/users.js`: add `findGmail()`, built like `findAll()`: one `fetch` to `/queries/find-gmail`, an empty JSON body, the parsed array returned, and "The database failed." thrown on any failure.
- Add `src/logic/list-gmail-users.js`.
- Add `src/clients/terminal/list-gmail-users.txt`, built like `list-users.txt`.
- Change `src/clients/api/server.js`: add `GET /users/gmail`, built like `GET /users`. It is declared **before** `GET /users/:id`, or `gmail` would be read as an id.
- Change `src/clients/chrome/server.js`: add `GET /users/gmail`, built like `GET /users`. The popup does not change.
- Change `src/clients/web/index.html` and `app.js`, and `src/clients/electron/index.html` and `app.js`: see "Web page and desktop window".
- Change `src/clients/nest/users.controller.js`: add `listGmail()`, see "The HTTP clients".
- Change `src/clients/vscode/extension.js`, `webview.js`: see "VS Code extension".
- Add `src/clients/jupyter/list-gmail-users.ipynb`, built like `list-users.ipynb`, with `listGmailUsers` and the same table. Change `src/clients/jupyter/00-welcome-and-index.ipynb` (one row in the index) and `src/clients/jupyter/README.md` (one row in the table of notebooks).
- Change `docs/DATABASE.md`, `docs/TREE.md` and `docs/ARCHITECTURE.md`.

## The function in logic

`listGmailUsers()` is async, receives nothing and returns an array of `{ id, name, email, createdAt, updatedAt }`. It throws only "The database failed."

Order inside the file, from "One logic file per action":

1. No input, so no cleaning (steps 1 and 2 are skipped).
2. No input to check (step 3 is skipped).
3. No business rule (step 4 is skipped).
4. Apply the action: `await findGmail()` inside a `try`/`catch` that throws "The database failed."
5. Return only `id`, `name`, `email`, `createdAt` and `updatedAt` of each row, with `map`.

## Edge cases

- No Gmail users: `findGmail()` gives `[]`, so the function returns `[]`.
- No users at all: the same, `[]`.
- The database program is not running: `fetch` fails, `findGmail()` throws "The database failed.", and the function throws the same sentence.
- An email such as `GMAIL@x.com` has no `@` before `gmail`, so it does not match. An email such as `a@GMAIL.com` matches, because capitals do not matter.

## The HTTP clients

- Each route calls `listGmailUsers()`, answers 200 with the array, and on any error answers 500 `{ "error": "The database failed." }`. An error that is not that sentence is written with `console.error` first, as `GET /users` does.
- The route is the same in the three.
- Nest keeps its own conventions (`AGENTS.md`, "Style"). In `users.controller.js`, `listGmail()` is declared **before** `findOne()`, with `@Get("users/gmail")` and no `@Bind`, and it returns `listGmailUsers()`. The error filter answers what it throws, as for `list()`. Nest is built with Babel (`pnpm nest`), so `logic/` is imported as in the other methods.

## Web page and desktop window

Both pages have a list screen that today draws all users in `renderList()`, which calls `listUsers()`. The change is small and the same idea in both:

- The page keeps one value, `onlyGmail`, `false` at the start.
- `renderList()` calls `listGmailUsers()` when `onlyGmail` is `true`, and `listUsers()` when it is `false`. The rest of the function (the buttons per user, the empty message, the error line) is the same.
- Two buttons are added above the list in `index.html`: "Solo Gmail" sets `onlyGmail` to `true`, and "Ver todos" sets it to `false`. Each then calls `renderList()` again.
- The empty message "No hay usuarios." is reused for an empty Gmail list. There is no new screen.

Both pages import `listGmailUsers` straight from `logic/`, as they do with `listUsers`. The desktop window has the same list code in its own `app.js`, so it gets the same change in that file.

## VS Code extension

The extension has no server. `extension.js` imports `logic/` and answers the messages of the screen, and `webview.js` draws the answers.

- `extension.js` imports `listGmailUsers`. `runAction` handles a new action, `"list-gmail"`, which returns `{ users }` from `listGmailUsers()`, as `"list"` does with `listUsers()`. An error is answered by the code that already wraps `runAction`.
- `webview.js` gets a button "Solo Gmail", next to "Recargar", that sends `{ action: "list-gmail" }`. The reply has `users`, so the existing code draws the list, the empty message and any error. "Recargar" and the first load still send `{ action: "list" }`, so they show all users.
- The button is added in the HTML written by `writeHtml` in `extension.js`, with the other buttons.

## Outside tools and packages

None. `pnpm start` must be running for every client, as today.

## Changes to the constitution

- No new sentence in `docs/ERRORS.md`.
- `docs/DATABASE.md`: add `findGmail` to the list of query functions, the line "`findGmail` runs `find-gmail.sql`.", and a short note on the query.
- `docs/TREE.md`: add `find-gmail.sql`, `list-gmail-users.js`, `list-gmail-users.txt` and `list-gmail-users.ipynb`.
- `docs/ARCHITECTURE.md`: add the same four files, and the new route in the entry of each HTTP client (`api/`, `chrome/` and `nest/`) and the new button in the entry of `vscode/`.
- `docs/CONSTITUTIONS.md` stays as it is.

## What stays as it is

`listUsers`, `findAll`, `find-all.sql`, the other six actions, the table, `src/db/connection.js`, `package.json`, the Babel build of Nest, the popup of the Chrome extension, and the other notebooks of `src/clients/jupyter/`.

## Decisions

- **Nest and VS Code clients:** included. Both reached `staging` after the first version of this plan, and `staging` was merged into this branch. The VS Code button is "Solo Gmail"; "Recargar" is the way back to all users.
- **Web page and desktop window:** the two-button shape above. It was explained in more detail and is waiting for the person's yes.
- **Jupyter:** a new notebook is included.
