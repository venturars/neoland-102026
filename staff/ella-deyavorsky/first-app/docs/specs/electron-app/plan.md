# Plan — Electron desktop app

A new client in `src/clients/electron/`, next to `web/`, `terminal/` and `jupyter/`. It has its own page and does not reuse `clients/web/`. Nothing in `logic/`, `queries/` or `db/` changes, there is no new SQL and no new error sentence.

## Why the logic runs in the main process

`queries/users.js` calls the database program with `fetch`. In a window opened from a file, the page has no web address (a relative address fails) and the program does not allow requests from a file page (CORS). So `logic/` cannot run inside the page without changing `queries/` or `db/`.

The plan: the main process of Electron imports the functions of `logic/` and runs them in Node, where `queries/users.js` already works with the full address `http://127.0.0.1:3000`. The page asks the main process through a small bridge (`preload.cjs`). The page does not use `fetch` and has no rule of its own.

## How it works

1. The person runs `pnpm start` (database program, port 3000) and then `pnpm electron`.
2. `main.js` registers one handler per action (`list-users`, `find-user-by-id`, `create-user`, `update-user`, `delete-user`). Each handler calls the function of `logic/` with the same name and returns the result. If the function throws, the handler returns the message of the error.
3. `main.js` opens a `BrowserWindow` with `index.html`, `contextIsolation` on, `nodeIntegration` off and the preload.
4. `preload.cjs` exposes `window.api` with one function per action. The page calls them.
5. When the last window closes, the app quits, also on macOS.

## Files to add

In `src/clients/electron/`:

- `main.js`: handlers, window, close. ESM, as the rest of the app.
- `preload.cjs`: the bridge. It is CommonJS because Electron loads the preload that way.
- `index.html`, `app.js`, `style.css`: the page. Classic script, no frameworks, short comments, code in English as `docs/STYLE.md` says. The screens are the same idea as the browser page (list, menu, edit) but written again here.

## Files to change

- `package.json`: script `"electron": "electron src/clients/electron/main.js"` and `electron` in `devDependencies`, exact version.
- `docs/TREE.md` and `docs/ARCHITECTURE.md`: add `clients/electron/`, say that it does not use `clients/web/`, that `logic/` runs in the main process, and that the database program must be running.
- `AGENTS.md`: "Commands" says not to add another way to run the app unless a spec asks. This spec asks, so add `pnpm electron` and that it needs `pnpm start` first.
- `eslint.config.js`: only if the page needs browser globals (see Decisions).

## Per operating system

- The same command and files on macOS, Windows and Linux. `pnpm install` downloads the Electron binary of the system.
- The database program needs Node with `node:sqlite` (22.5 or newer), as today. Electron does not run it, so no native package is rebuilt.
- Linux may need system libraries for Electron windows (GTK, NSS). Written in the docs as a requirement.
- Only macOS can be run here. Windows and Linux are left as "not verified" until someone with those systems checks them.

## Packages

One package: `electron@45.2.2`, in `devDependencies`.

Socket (`depscore`, no session) for `electron@45.2.2`: license 100, maintenance 97, quality 99, supply chain 99, vulnerability 100. No score is below 50. `alerts` and `threat_feed` need an organization session, which is not available, so alerts and campaigns are not checked. The person who accepts the plan decides. Its dependencies, down to 3 layers, are still to check before the install.

## What stays as it is

`src/logic/`, `src/queries/`, `src/db/`, the SQL files, `clients/web/`, `clients/terminal/`, `clients/jupyter/`, and the behavior of `pnpm start`, `pnpm browser` and `pnpm jupyter`.

## How it is checked

Run `pnpm start`, then `pnpm electron`: a window opens with the real users. Edit and save, and see the change in the terminal list. Empty name, bad email and repeated email show the app's message. Delete asks for confirmation. Stop `pnpm start` and press an action: the message is shown, the window does not crash. `pnpm lint` has no errors.

## Decisions

1. `logic/` runs in the main process and the page uses a bridge, because the page cannot reach the database program on its own. This is the smallest way to keep `queries/` and `db/` untouched.
2. The page uses a classic script, as `clients/web/`.

## Open questions (for the person who reviews)

1. The command for the database program is `pnpm start` in `package.json`; there is no `pnpm server`. Use `pnpm start`, or add a `server` script as an alias?
2. Is it fine that `logic/` runs in the main process (decision 1)? Running it in the page would need a change in `queries/users.js` and a CORS header in `db/server.js`.

`tasks.md` is not written until these are answered.
