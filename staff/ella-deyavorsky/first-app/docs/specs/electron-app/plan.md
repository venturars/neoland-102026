# Plan — Electron desktop app

A new client next to `clients/web/`, `clients/terminal/` and `clients/jupyter/`. It does not reuse the web files by copying them: the window loads the page that the database program already serves. No rule of `logic/` changes, there is no new SQL and no new error sentence.

## How it works

1. `pnpm electron` starts Electron, which runs `src/clients/electron/main.js` (its own Node, so the person does not need Node to run the app window; they need it for `pnpm`).
2. `main.js` starts the database program `src/db/server.js` as a child of the app, with the port and the database path in environment variables.
3. When the program says it is listening, `main.js` opens a `BrowserWindow` on `http://127.0.0.1:<port>`.
4. When the last window closes, `main.js` stops the child and quits, on every system (also on macOS, where apps usually stay open).

## Files to add

In `src/clients/electron/`:

- `main.js`: starts the program, creates the window, handles the close. Shows a simple error page if the program does not start.
- `error.html`: the text "The app could not start", shown only in that case.

## Files to change

- `src/db/server.js`: the port comes from `process.env.PORT` and falls back to 3000. Nothing else changes, so `pnpm start` is the same.
- `src/db/connection.js`: the database path comes from `process.env.DATABASE_PATH` and falls back to `users.sqlite` next to the file. Same behavior for `pnpm start`. The only reason to touch `db/` is that an installed app cannot write next to its code.
- `package.json`: script `"electron": "electron src/clients/electron/main.js"` and `electron` in `devDependencies`, with an exact version.
- `docs/TREE.md` and `docs/ARCHITECTURE.md`: add `clients/electron/`, the two environment variables, and say that this client starts the database program itself.
- `AGENTS.md`: the "Commands" section says not to add another way to run the whole app unless a spec asks for it. This spec asks for it, so add `pnpm electron` there.

## Where the database lives

`main.js` passes `app.getPath("userData")` to the program as `DATABASE_PATH`. That is `~/Library/Application Support/<app>` on macOS, `%APPDATA%\<app>` on Windows and `~/.config/<app>` on Linux. The desktop database is separate from `src/db/users.sqlite` used by `pnpm start`.

## Port

The program listens on `127.0.0.1` only, as today. `main.js` asks the system for a free port and passes it as `PORT`, so the app does not clash with `pnpm start` on 3000.

## Per operating system

- **macOS, Windows, Linux:** the same command and the same files. Requirements: Node 22.5 or newer for `pnpm` and `node:sqlite` on the side of the repo; `pnpm install` downloads the Electron binary of the system.
- `node:sqlite` is built into Node and into Electron's Node (to confirm in task 3 with the pinned version). No native package has to be rebuilt, which is the usual pain with Electron and SQLite.
- Linux may need system libraries for Electron windows (GTK, NSS). Written in the docs as a requirement.
- Only macOS can be run here. Windows and Linux are checked by a person with those systems, or left written as "not verified".

## Packages

One package: `electron@45.2.2`, in `devDependencies`.

Socket (`depscore`, no session) for `electron@45.2.2`: license 100, maintenance 97, quality 99, supply chain 99, vulnerability 100. No score is below 50. `alerts` and `threat_feed` need an organization session, which is not available here, so alerts and campaigns are not checked. The person who accepts the plan decides. Its dependencies, down to 3 layers, are still to check before the install.

## What stays as it is

`src/logic/`, `src/queries/`, the SQL files, `clients/web/`, `clients/terminal/`, `clients/jupyter/`, and the behavior of `pnpm start`, `pnpm browser` and `pnpm jupyter`.

## How it is checked

With `pnpm start` stopped, run `pnpm electron`: a window opens with the users. Edit and save, close, open again, and the change is there. Empty name, bad email and repeated email show the app's message. Delete asks for confirmation. Closing the window leaves no program on the port. With `pnpm start` running at the same time, both work. `pnpm lint` has no errors.

## Open questions (for the person who reviews)

1. Does the desktop app use its own database in the user data folder, as written, or the same `src/db/users.sqlite` as the other clients while running from the repo?
2. Is it fine to touch `src/db/server.js` and `src/db/connection.js` only to read the port and the path from the environment? The issue says not to change the logic, and this is not the logic, but it is `db/`.
3. Is `pnpm electron` the right name for the command, and is it fine that it needs Node and pnpm installed?

`tasks.md` is not written until these are answered.
