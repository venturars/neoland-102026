# Plan — A Chrome extension for the users

A new client in `src/clients/chrome/`: a small Fastify program (`server.js`) and the popup files, all in the same folder. Chrome loads the whole folder as the extension, so it also loads `server.js`; Chrome ignores it, because the manifest does not name it. The program is a thin layer, like `src/clients/api/server.js`: each route calls one existing function of `logic/` and turns its result or its error into an HTTP answer. Nothing in `logic/`, `queries/` or `db/` changes, there is no new SQL. The popup imports nothing from `logic/`: it only calls the program with `fetch`.

## Files to add or change

- Add `src/clients/chrome/server.js`: the Fastify app. It defines the five routes and listens on `127.0.0.1:3002`. `HOST` and `PORT` are constants at the top, with a short comment. Like `src/db/server.js` and `src/clients/api/server.js`, it is a script, not an exported function.
- Add `src/clients/chrome/manifest.json`: Manifest V3. Name, version, `action.default_popup` and `host_permissions` for `http://127.0.0.1:3002/*` only. No background script, no content script, no other permission.
- Add `src/clients/chrome/popup.html`: the one screen, with the list, the form, and the buttons. It loads `popup.js` as a module and `popup.css`. No inline script (Chrome forbids it in extensions).
- Add `src/clients/chrome/popup.css`: the style.
- Add `src/clients/chrome/popup.js`: the popup logic (see "The popup").
- Add `src/clients/terminal/chrome.txt`: `curl` examples for the five routes on port 3002, with Spanish comments as the other `.txt` files. The first lines say it is pasted with `first-app` as the current folder and that `pnpm start` and `pnpm chrome` must be running.
- Change `package.json`: add the dependency `fastify` and the script `"chrome": "node src/clients/chrome/server.js"`. Add `src/clients/chrome` to `format`.
- Change `docs/ERRORS.md`, `AGENTS.md`, `docs/TREE.md` and `docs/ARCHITECTURE.md` (see "Changes to the docs").

## Routes

Every handler is `async`. Each calls one function of `logic/`, passing one object, and sends JSON. They are the same five as the HTTP client.

| Route | Calls | Success |
|---|---|---|
| `POST /users` | `createUser({ name, email })` | 201, the user |
| `GET /users` | `listUsers()` | 200, the array |
| `GET /users/:id` | `findUserById({ id })` | 200, the user |
| `PATCH /users/:id` | `updateUser({ id, name, email })` | 200, the user |
| `DELETE /users/:id` | `deleteUser({ id })` | 204, no body |

- `id` comes from the path as text and is turned into a number with `Number(...)`. A value that is not a number matches no user: "No user was found." (404).
- For `PATCH`, a field missing from the body is passed as `undefined`, so `logic/` keeps the old value. `{}` gives "There is nothing to update." (400). Other fields in the body are ignored.
- Each route checks the shape of its input with its own inline checks before calling `logic/`, as the HTTP client does: `POST` needs an object body with `name` and `email` as text; `PATCH` needs an object body, and `name` and `email` may be missing but must be text if present. A failed check answers 400 "The request is not valid." No Fastify schema is used: the checks stay as plain `if`s, as `docs/STYLE.md` asks.
- Fastify answers some failures before a route runs (a body that is empty or not valid JSON, a wrong content type, a body too large), with its own error object. One `setErrorHandler` in `server.js` turns any Fastify error with a 4xx status into 400 `{ "error": "The request is not valid." }`. Any other error that reaches it is written with `console.error` and answered 500 "The database failed."
- One `setNotFoundHandler` in `server.js` answers an unknown route with 404 and an empty body.
- `docs/STYLE.md` has no wrappers or generic helpers, so each route has its own `try`/`catch` and the same short `if` chain as the HTTP client.
- No CORS plugin. Chrome lets an extension page call the hosts in `host_permissions` without CORS headers, and a web page of any other site cannot read the program's answers (the JSON, `PATCH` and `DELETE` requests need a CORS preflight, which the program does not answer).

## Errors

The program answers `{ "error": "<sentence>" }` with the same statuses as the HTTP client:

| Error | Status |
|---|---|
| "The name is missing.", "The email is not valid.", "There is nothing to update.", "The request is not valid." | 400 |
| "No user was found." | 404 |
| "This email is already used." | 409 |
| "The database failed." | 500 |
| A Fastify error with a 4xx status (wrong content type, body too large, bad JSON) | 400, "The request is not valid." |
| An unknown route | 404, empty body |
| Anything else | 500, "The database failed.", after `console.error(error)` |

"The extension server is not running." is never sent by the program (it is not running when it applies). The popup raises it.

## The popup

`popup.js` is a browser module for the popup, one script with small functions per action, like `src/clients/web/app.js`. It calls only `http://127.0.0.1:3002`. It needs `/* global document, fetch */` for ESLint, like the web client.

- On open, and after every create, save and delete, it calls `GET /users` and draws the list.
- A click on a user calls `GET /users/:id`, loads the user in the form and shows Save and Delete (`Guardar`, `Borrar`). The "create" button is hidden while a user is loaded.
- The form has a name and an email. With no user loaded, it shows `Crear`. A button `Nuevo usuario` clears the form and goes back to create.
- Save calls `PATCH /users/:id` with the name and the email of the form. Create calls `POST /users`. Delete calls `DELETE /users/:id`, but only after the confirmation below.
- **Delete asks for confirmation.** A click on `Borrar` shows a text field (`Escribe el nombre del usuario para confirmar`) and the buttons `Confirmar borrado` and `Cancelar`. `Confirmar borrado` only calls the program if the text is exactly the name of the loaded user, comparing letters as they are (case sensitive, no trimming). The name used is the one saved in the list, not what is being edited in the form. If it does not match, the popup shows `El nombre no coincide` and deletes nothing. `Cancelar` closes the field. This is a check of the popup before it calls the program, not a rule of the app: the program and `logic/` delete with no confirmation. The mismatch text is Spanish, as a label, and is not a sentence of `docs/ERRORS.md`.
- A call that cannot connect makes `fetch` throw a `TypeError`. The popup turns that into the new error sentence "The extension server is not running." and shows it. A call that gets an answer with `{ "error" }` shows that sentence. The popup has no rules of its own: it never checks the name or the email.
- Text on screen (labels, buttons, empty list) is in Spanish. The sentences of `docs/ERRORS.md` are shown as they are written there, as the web client does.

## Packages

- `fastify` 5.12.8 (the latest, `npm view`), pinned exact like the other dependencies, added with `pnpm add --save-exact fastify`.
- Socket `depscore`: license 100, maintenance 97, quality 100, supply chain 98, vulnerability 100. Nothing below 50.
- Socket `alerts` (org `neoland1`, filtered by name): the list for `fastify` is empty. Written as "no alert on a watched package", not as "no alerts".
- Socket `threat_feed`: not available. The free plan of `neoland1` answers 403 `threat_feed_not_entitled`: "Threat feed is not enabled for this organization". The campaign is not checked.
- Dependencies: `fastify` 5.12.8 resolves to 48 packages in total, itself included (`npm install --package-lock-only`; `fast-uri` appears twice, at 3.1.9 and 4.2.3). That covers more than 3 layers. `depscore` was run on all 48, with the exact versions: license 100 and vulnerability 100 on every one, supply chain 98-100, quality 75-100. The lowest is 75: maintenance 75 on `fast-deep-equal`, `fast-decode-uri-component`, `abstract-logging`, `atomic-sleep`, `quick-format-unescaped` and `require-from-string`, and quality 75 on `real-require`. No stat is below 50. `npm audit` reports 0 vulnerabilities.
- `alerts` was run for the 47 dependencies by name. One open alert shows up, on `ajv` 6.12.6: a medium CVE (CVE-2025-69873, ReDoS with the `$data` option), in the repository `crochet4ever` of the organization. The plan uses `ajv` 8.20.0, so it is not the same version and does not count. For the other 46 the list is empty ("no alert on a watched package"). Whoever accepts the plan decides on it anyway.

## Changes to the docs

- `docs/ERRORS.md`: add "The extension server is not running." — the popup of `src/clients/chrome/` could not reach its own program. It is not thrown by `logic/`. This is added before the code uses it, as the file asks.
- `AGENTS.md`: "The only web framework is Express, used only by the HTTP client in `src/clients/api/`" becomes: "The only web frameworks are Express, used only by the HTTP client in `src/clients/api/`, and Fastify, used only by the program of the extension in `src/clients/chrome/`. There is no TypeScript." (the folder is `chrome/`, not `extension/`). Add `pnpm chrome` and the new `format` path in "Commands". The line "Every client needs [the database program] running" stays true.
- `docs/ARCHITECTURE.md`: add `chrome/` under `src/clients/` (the Fastify program on `127.0.0.1:3002` and the popup, in one folder that Chrome loads), add its five files, and adjust the line about clients so it also says that the popup talks only to its own program and not to `logic/`.
- `docs/TREE.md`: add `chrome/` with its five files (`server.js`, `manifest.json`, `popup.html`, `popup.css`, `popup.js`), and `terminal/chrome.txt`.
- `docs/CONSTITUTIONS.md`: it does not mention a framework, so it stays.

## What stays as it is

`logic/`, `queries/`, `db/`, the port 3000 and the database program, the HTTP client on 3001 (and Express), the web, terminal and Jupyter clients, and every existing error sentence.

## What must be running

The database program (`pnpm start`), then `pnpm chrome`. The extension is loaded once in Chrome from `chrome://extensions`, with the developer mode on and "Load unpacked" pointing at `src/clients/chrome/`.

## How it is checked

`pnpm start` and `pnpm chrome`. With `curl` on 3002 (`src/clients/terminal/chrome.txt`): create (201); the same email again (409); no name (400); no body (400); `{"name": 5, "email": "a@b.com"}` (400); `PATCH` with `{"name": ["x"]}` (400); list; get by id; patch the name, the email, both, and `{}` (400); get an id that does not exist and `abc` (404); delete (204) and get it again (404); broken JSON (400). Check the server listens on `127.0.0.1` only. Stop `pnpm start` and see 500. In Chrome: create, click, save, delete, and each error of the list. Stop `pnpm chrome` and open the popup: "The extension server is not running." Check the HTTP client on 3001 and the web page on 3000 still work. Then `pnpm format` and `pnpm lint`.

## Decisions to review

1. **Fastify in `AGENTS.md`.** It contradicts "the only web framework is Express". The plan limits it to this client, as the Express plan did. Approved, with the folder `chrome/`.
2. **Status codes** are the same as the HTTP client, and are chosen there. A Fastify error with a 4xx status (wrong content type, body too large) also answers 400 "The request is not valid." An unknown route answers 404 with an empty body. `ERRORS.md` only has sentences.
3. **`server.js` and `popup.js` are scripts** with several handlers, so "one function per file" is read as applying to `logic/` and `queries/`, as in `src/db/server.js` and `src/clients/web/app.js`.
4. **`Nuevo usuario` button and Delete confirmation (answered).** The `Nuevo usuario` button stays. Delete asks the person to type the name of the user, case sensitive, before it deletes.
5. **Port 3002, fixed**, listening on `127.0.0.1` only.
6. **Same error sentences (answered).** The extension uses the sentences already in `docs/ERRORS.md`, and adds only "The extension server is not running."
7. **Errors in English (answered).** The popup shows the error sentences as written in `docs/ERRORS.md`, without translating them. Only labels, buttons and other texts of the popup are in Spanish.
