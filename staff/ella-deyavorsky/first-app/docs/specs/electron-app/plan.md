# Plan — Electron desktop app

A new client in `src/clients/electron/`, next to `web/`, `terminal/` and `jupyter/`. It has its own page and does not reuse `clients/web/`. Nothing in `logic/`, `queries/` or `db/` changes, there is no new SQL. There is one new error sentence, "The request is not valid.", for input that is not text or a number (see Files to change).

## Why the logic runs in the main process

`queries/users.js` calls the database program with `fetch`. In a window opened from a file, the page has no web address (a relative address fails) and the program does not allow requests from a file page (CORS). So `logic/` cannot run inside the page without changing `queries/` or `db/`.

The plan: the main process of Electron imports the functions of `logic/` and runs them in Node, where `queries/users.js` already works with the full address `http://127.0.0.1:3000`. The page asks the main process through a small bridge (`preload.cjs`). The page does not use `fetch` and has no rule of its own.

## How it works

1. The person runs `pnpm start` (database program, port 3000) and then `pnpm electron`.
2. `main.js` registers one handler per action: `list-users`, `update-user` and `delete-user`. These are the only actions the page has (list, menu with edit and delete). There is no create form and no search by id, so there is no `create-user` or `find-user-by-id` handler; creating users stays in the other clients. Each handler calls the function of `logic/` with the same name.
3. Every handler returns the same shape: `{ ok: true, value }` on success and `{ ok: false, error: "..." }` on failure. The page reads `ok` to tell one from the other.
4. On failure, `error` is the message of the function only when it is one of the known sentences of `logic/` (the list in `docs/ERRORS.md`, kept as a set in `main.js`). For anything else, such as a `TypeError`, the handler returns `"The database failed."` and calls `console.error(error)` in the main process. The person never sees JavaScript wording.
5. The page is not trusted code, so each handler checks its input before calling `logic/`: `id` is a whole number, and `name` and `email` are text. If not, it returns `{ ok: false, error: "The request is not valid." }` without calling `logic/`.
6. `main.js` opens a `BrowserWindow` with `index.html`, `contextIsolation` on, `nodeIntegration` off and the preload.
7. `preload.cjs` exposes `window.api` with one function per action. The page calls them.
8. When the last window closes, the app quits, also on macOS.

## Window hardening

- `index.html` has a Content-Security-Policy `<meta>` that allows only its own files (`default-src 'self'`).
- `main.js` denies new windows (`setWindowOpenHandler`) and blocks navigation away from the page (`will-navigate`).
- `preload.cjs` exposes one function per action and never `ipcRenderer` itself.

## Files to add

In `src/clients/electron/`:

- `main.js`: handlers, window, close. ESM, as the rest of the app.
- `preload.cjs`: the bridge. It is CommonJS because Electron loads the preload that way.
- `index.html`, `app.js`, `style.css`: the page. Classic script that starts with `/* global document, window, confirm */`, as the rest of the repo does, so `eslint.config.js` does not change. No frameworks, short comments, code in English as `docs/STYLE.md` says. The screens are the same idea as the browser page (list, menu, edit) but written again here.

## Files to change

- `package.json`: script `"electron": "electron src/clients/electron/main.js"` and `electron` in `devDependencies`, exact version. The `format` script gets `"src/clients/electron/**/*.js"`. `.cjs` is not matched by `**/*.js`, so `"src/clients/electron/**/*.cjs"` is added too, to format the preload (it is only a few lines, but it is code of the app).
- `docs/ERRORS.md`: add "The request is not valid." (the window sent a value of the wrong type), before it is used in code. The known sentences of `main.js` are this list, without "The classifier failed.", which no action here can throw.
- `docs/TREE.md` and `docs/ARCHITECTURE.md`: add `clients/electron/`, say that it does not use `clients/web/`, that `logic/` runs in the main process, and that the database program must be running.
- `AGENTS.md`: "Commands" says not to add another way to run the app unless a spec asks. This spec asks, so add `pnpm electron` and that it needs `pnpm start` first.

## Per operating system

- The same command and files on macOS, Windows and Linux. `pnpm install` downloads the Electron binary of the system.
- The database program needs Node with `node:sqlite` (22.5 or newer), as today. Electron does not run it, so no native package is rebuilt.
- Linux may need system libraries for Electron windows (GTK, NSS). Written in the docs as a requirement.
- Only macOS can be run here. Windows and Linux are left as "not verified" until someone with those systems checks them.

## Packages

One package: `electron@45.2.2`, in `devDependencies`.

Socket (`depscore`, no session) for `electron@45.2.2`: license 100, maintenance 97, quality 99, supply chain 99, vulnerability 100. No score is below 50. `alerts` and `threat_feed` need an organization session, which is not available, so alerts and campaigns are not checked. The person who accepts the plan decides. Its dependencies, down to 3 layers, are still to check before `pnpm install`. This does not block the plan, but it must be done first. Expect a tree of about a dozen packages (the same Electron version has 12 in #902).

## What stays as it is

`src/logic/`, `src/queries/`, `src/db/`, the SQL files, `clients/web/`, `clients/terminal/`, `clients/jupyter/`, and the behavior of `pnpm start`, `pnpm browser` and `pnpm jupyter`.

## How it is checked

Run `pnpm start`, then `pnpm electron`: a window opens with the real users. Edit and save, and see the change in the terminal list. Empty name, bad email and repeated email show the app's message. Delete asks for confirmation. In the DevTools of the window, `typeof require` and `typeof process` are both `"undefined"` (isolation check). Stop `pnpm start` and press an action: the message is shown, the window does not crash. `pnpm lint` has no errors.

## Decisions

1. `logic/` runs in the main process and the page uses a bridge, because the page cannot reach the database program on its own. This is the smallest way to keep `queries/` and `db/` untouched.
2. The page uses a classic script, as `clients/web/`, with `/* global document, window, confirm */` and no change in `eslint.config.js`.
3. No create form and no find-by-id handler: the page only needs list, edit and delete. A create form can be a later feature.

## Answers from the review

1. The command for the database program stays `pnpm start`. No `server` alias is added.
2. `logic/` runs in the main process.
