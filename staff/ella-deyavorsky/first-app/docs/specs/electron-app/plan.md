# Plan — Electron desktop app

A new client in `src/clients/electron/`, next to `web/`, `terminal/` and `jupyter/`. It has its own page and does not reuse `clients/web/`. Nothing in `logic/` or `queries/` changes, there is no new SQL and no new error sentence. The previous version of this plan ran `logic/` in the main process with a preload and IPC; that is removed.

## Why the page comes from the database program

The page has to call `logic/` itself, and `queries/users.js` calls the database program with `fetch` using a relative address when it runs in a page. A page opened from a file (`loadFile`) has no web address, so that address leads nowhere, and the program would not accept the request from a file page either (CORS). This was tested with a throwaway window: the page loads `logic/` as a module, but `listUsers()` fails with "The database failed." even with the program running.

If the page itself comes from `http://127.0.0.1:3000`, the relative address works and there is no CORS. So `main.js` opens that address, and the database program serves the folder of this client. This needs one change in `src/db/server.js` (below). `queries/` does not change.

## How it works

1. The person runs `pnpm start` (database program, port 3000) and then `pnpm electron`.
2. `main.js` opens a `BrowserWindow` of 800x600 with no `webPreferences`, and loads `http://127.0.0.1:3000/electron/index.html`.
3. `index.html` loads `app.js` with `<script type="module" src="./app.js">`. `app.js` imports `createUser`, `deleteUser`, `findUserById`, `listUsers` and `updateUser` from `../../logic/`. In the browser, the program serves them at `/logic/`. The address `../../logic/` from `/electron/app.js` resolves to `/logic/`, so the same import line works in the file and in the page.
4. `main.js` listens to `activate` (macOS) to open a window again when there is none, and to `window-all-closed` to quit unless the system is macOS.

## Files in `src/clients/electron/`

Only these four:

- `main.js`: the window, `activate` and `window-all-closed`. No IPC, no `success`/`failure`, no list of known messages, no checking of types, no blocking of windows or navigation. It starts with `/* global process */`.
- `index.html`: the two screens (list and detail), no Content-Security-Policy. Links `styles.css`.
- `app.js`: module, starts with `/* global document */`. Calls the five `logic/` functions. When a call fails, it writes `error.message` unchanged in the error area of the screen where it happened.
- `styles.css`: the styles. It is `style.css` renamed (`git mv`), with the same content.

`preload.cjs` is deleted.

## Signatures of `logic/` (read from the code)

- `createUser({ name, email })`
- `deleteUser({ id })`
- `findUserById({ id })`
- `listUsers()`
- `updateUser({ id, name, email })`

All five exist. Each throws an `Error` with a sentence of `docs/ERRORS.md` and the page shows it as it is.

## Files to change

- `src/db/server.js`: add `"/electron/"` to `PUBLIC_FOLDERS` (pointing to `src/clients/electron`) and to the list of prefixes that is checked first, so `/electron/index.html`, `/electron/app.js` and `/electron/styles.css` are served. The `.html`, `.css` and `.js` types are already allowed. Nothing else changes, so `pnpm start` behaves the same for the other clients. It also serves `main.js` of that folder, which is source code and not a secret.
- `package.json`: keep `"electron": "electron src/clients/electron/main.js"` and `electron@45.2.2`. The `format` script keeps `src/clients/electron/**/*.js` and loses `src/clients/electron/**/*.cjs`.
- `docs/TREE.md`: the electron folder lists `main.js`, `index.html`, `app.js` and `styles.css`.
- `docs/ARCHITECTURE.md`: the `electron/` entry loses the preload, the IPC and the result shape. It says the page imports `logic/` as a module, comes from the database program at `/electron/`, and that the database program must be running. The `db/` entry says it also serves `clients/electron/`.
- `docs/ERRORS.md`: remove "The request is not valid.". Nothing checks types now, so nothing throws it.
- `AGENTS.md`: the line about `pnpm electron` stays (it still needs `pnpm start`). Check that no other line mentions the preload, the IPC, the policy or that the window cannot create users.

## Per operating system

The same command and files on macOS, Windows and Linux. The database program needs Node with `node:sqlite` (22.5 or newer), as today. Linux may need system libraries for Electron windows (GTK, NSS). Only macOS can be run here; Windows and Linux stay "not verified" unless someone checks them.

## Packages

No new package. `electron@45.2.2` is already installed and accepted, with its 12 dependencies reviewed in task 2 of the first version.

## What stays as it is

`src/logic/`, `src/queries/`, the SQL files, `clients/web/`, `clients/terminal/`, `clients/jupyter/`, and `pnpm browser`, `pnpm jupyter`. `pnpm start` serves the same files as before plus the new folder.

## How it is checked

Run `pnpm start`, then `pnpm electron`: an 800x600 window opens with the users. Create a user, see it in the list, look it up by id, edit name and email, and delete it with no confirmation. Empty name, bad email and repeated email show the message of the app in the list or in the detail. Close the window on macOS: the app stays, and clicking its icon opens a window. `http://127.0.0.1:3000` in the browser still shows the web client. `pnpm lint` and `pnpm format` have no errors.

## Decisions

1. The page comes from the database program (`/electron/`) because it is the only way to call `logic/` from the page without changing `queries/`. The cost is one change in `db/server.js`.
2. `app.js` is a module. The rest of the repo's browser code is a module too.
3. The error messages are shown as `logic/` throws them, with no list of known sentences and no check of types, as asked.

## Open questions

None. The change in `db/server.js` was chosen over a change in `queries/` and `db/` for CORS, and over keeping the main process.
