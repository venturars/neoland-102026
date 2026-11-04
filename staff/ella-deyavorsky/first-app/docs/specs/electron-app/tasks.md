# Tasks — Electron desktop app

Do the tasks in order. Inside a task, do the steps in order.

## Task 1 — Update the docs

- [x] Add "The request is not valid." to `docs/ERRORS.md`, with its meaning (the window sent a value of the wrong type). Result: the sentence is in the list before any code uses it.
- [x] Add `electron/` with `main.js`, `preload.cjs`, `index.html`, `app.js` and `style.css` under `clients/` in `docs/TREE.md`. Result: the tree lists the new client.
- [x] Add `electron/` to the `src/clients/` section of `docs/ARCHITECTURE.md`: it does not use `clients/web/`, `logic/` runs in the main process, the database program must be running, and the `.txt` per feature does not apply. Result: the entry is there and no layer sentence contradicts it.
- [x] Add `pnpm electron` to "Commands" in `AGENTS.md`, saying it needs `pnpm start` running first. Result: the exception is written.

## Task 2 — Check the packages

- [x] Check the dependencies of `electron@45.2.2`, down to 3 layers, with the Socket MCP (`depscore`, `alerts`, `threat_feed`, as `AGENTS.md` says). Result: a list of packages and any alert, campaign or score below 50, written to the person.
- [x] Stop and wait for the person to accept the packages. Result: no install before that.

## Task 3 — Add Electron

- [x] Run `pnpm add -D electron@45.2.2`. Result: `electron` is in `devDependencies` with the exact version, and `pnpm-lock.yaml` changes.
- [x] In `package.json`, add the script `"electron": "electron src/clients/electron/main.js"` and add `"src/clients/electron/**/*.js"` and `"src/clients/electron/**/*.cjs"` to `format`. Result: the scripts are there.

## Task 4 — Write the client

- [x] Create `src/clients/electron/main.js` (ESM): one handler for `list-users`, `update-user` and `delete-user`, each checking its input, calling the function of `logic/` and returning `{ ok, value }` or `{ ok, error }`. Known sentences pass; anything else returns "The database failed." and `console.error(error)`. Open the `BrowserWindow` with `contextIsolation` on and `nodeIntegration` off, deny new windows, block navigation, and quit when the last window closes. Result: the main process matches the plan.
- [x] Create `src/clients/electron/preload.cjs` with `contextBridge.exposeInMainWorld("api", ...)` and one function per action, no `ipcRenderer`. Result: the page has `window.api`.
- [x] Create `src/clients/electron/index.html` with the three screens (list, menu, edit), a Content-Security-Policy `<meta>`, and a classic `<script src="app.js">`. Result: only its own files load.
- [x] Create `src/clients/electron/style.css` with the `hidden` class and simple styles. Result: one screen is visible at a time.
- [x] Create `src/clients/electron/app.js` starting with `/* global document, window, confirm */`. It calls `window.api`, reads `ok` and shows the error in a `<p>`. No imports, no classes. Result: list, edit and delete work as in `spec.md`.

## Task 5 — Run it

- [x] Run `pnpm start` in one terminal and `pnpm electron` in another. Result: a window opens with the real users.
- [x] Edit a name and save, then list the users in the terminal. Result: the terminal shows the new name.
- [x] Try an empty name, an email that is not valid and an email already used. Result: the message of the app is shown and nothing is saved.
- [x] Delete a user and accept the confirmation. Result: the user is gone from the list.
- [ ] Stop `pnpm start` and press an action. Result: "The database failed." is shown and the window does not crash.
- [x] In the DevTools of the window, run `typeof require` and `typeof process`. Result: both are `"undefined"`.
- [x] Run `pnpm format` and `pnpm lint`. Result: no errors, and `eslint.config.js` did not change.
- [ ] Check that `pnpm start`, `pnpm browser` and the terminal client still work. Result: they behave as before.
- [x] Say which systems were checked. Result: macOS is checked; Windows and Linux are written as "not verified" if nobody ran them.
- [x] Stop. Result: the one-pass cycle is done.
