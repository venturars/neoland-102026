# Tasks — Electron desktop app (simplified)

Do the tasks in order. Inside a task, do the steps in order. Tasks 1 to 5 of the first version are done; this version replaces the client.

## Task 1 — Serve the client

- [ ] In `src/db/server.js`, add `"/electron/"` to `PUBLIC_FOLDERS` and to the prefixes checked before `"/"`. Result: `http://127.0.0.1:3000/electron/index.html` is served by the program, and `/` still serves the web client.

## Task 2 — Rewrite the client

- [ ] Delete `src/clients/electron/preload.cjs`. Result: the folder has no preload.
- [ ] Rename `style.css` to `styles.css` with `git mv`. Result: the file is `styles.css`.
- [ ] Rewrite `main.js` with `/* global process */`: a window of 800x600 with no `webPreferences`, `loadURL("http://127.0.0.1:3000/electron/index.html")`, `activate` and `window-all-closed` (quit unless macOS). No IPC, no `success`/`failure`, no known messages, no type checks, no blocking. Result: the file is short and does only that.
- [ ] Rewrite `index.html` with the list screen (create form, look-up form, list, error area) and the detail screen (id, name, email, created, updated, edit form with Save, Delete, Back, error area). No Content-Security-Policy. `<link>` to `styles.css` and `<script type="module" src="./app.js">`. Result: two screens, one visible at a time.
- [ ] Rewrite `app.js` with `/* global document */`: import `createUser`, `deleteUser`, `findUserById`, `listUsers` and `updateUser` from `../../logic/`, call them with the real signatures, and write `error.message` unchanged in the error area of the screen. No `window.api`, no confirmation on Delete. Result: list, create, look up, edit and delete work.
- [ ] In `package.json`, remove `"src/clients/electron/**/*.cjs"` from `format`. Keep the `electron` script and `electron@45.2.2`. Result: `format` has no `.cjs`.

## Task 3 — Update the docs

- [ ] `docs/TREE.md`: electron has `main.js`, `index.html`, `app.js` and `styles.css`. Result: no `preload.cjs`.
- [ ] `docs/ARCHITECTURE.md`: rewrite the `electron/` entry and add `/electron/` to the `db/` entry as described in `plan.md`. Result: no mention of the preload, the IPC or the result shape.
- [ ] `docs/ERRORS.md`: remove "The request is not valid.". Result: the list is as before this feature.
- [ ] `AGENTS.md`: check it and fix any mention of the preload, the IPC, a policy, or a window that cannot create users. Result: it matches the new client.

## Task 4 — Run it

- [ ] Run `pnpm start` and `pnpm electron`. Result: an 800x600 window opens with the users.
- [ ] Create a user, look it up by id, edit it and delete it. Result: each action works and the delete has no confirmation.
- [ ] Try an empty name, an email that is not valid and an email already used. Result: the message of the app is shown in the list or in the detail.
- [ ] On macOS, close the window and click the icon. Result: a window opens again.
- [ ] Open `http://127.0.0.1:3000` in the browser. Result: the web client still works.
- [ ] Run `pnpm lint` and `pnpm format`. Result: no errors, and `src/logic/` and `src/queries/` did not change.
- [ ] Fix the description of PR #907 so it describes the app as it is now, not "no changes yet". Result: the description matches the change.
- [ ] Say which systems were checked. Result: macOS is checked; Windows and Linux are "not verified" if nobody ran them.
- [ ] Stop. Result: the cycle is done.
