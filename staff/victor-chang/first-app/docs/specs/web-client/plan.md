# Plan — web client

## Files

- Create: `clients/web/index.html`, the page: the screens of the spec and an import map (see **How `logic/` runs in the browser**).
- Create: `clients/web/styles.css`, the iOS look: system fonts, grouped lists, sheets, the action sheet, the alert box, light and dark with `prefers-color-scheme`.
- Create: `clients/web/app.js`, the screens: it reads the file, calls `logic/`, shows the result and saves the file. No business rules.
- Create: `clients/web/queries.js`, the browser twin of `queries/users.js`, on sql.js.
- Create: `scripts/web.sh`, which starts the page.
- Create: `GLOSSARY.md`, with the term **User**.
- Create: `docs/adr/0001-browser-sqlite-connection.md`, why the browser opens a second connection to `db/users.sqlite`.
- Touch: `package.json`, the dependency `sql.js` at `1.14.2` and the script `"web": "sh scripts/web.sh"`. `pnpm-lock.yaml` changes with it.
- Touch: `eslint.config.js`, a block for `clients/web/**/*.js` with the browser globals the page uses, listed by hand (`window`, `document`, `navigator`, `indexedDB`, `fetch`, `initSqlJs`, …). No `globals` package.
- Touch: `docs/ERRORS.md`, the five client messages of the spec, printed by `clients/web/` and `scripts/web.sh`.
- Touch: `docs/CONSTITUTION.md`, **Runtime**: `sql.js`, why it is there, Python 3 also for `pnpm web`, and the browsers (Chrome or Edge).
- Touch: `docs/DATABASE.md`, the one exception to "No other database or connection is opened", with a link to the ADR.
- Touch: `docs/ARCHITECTURE.md`, the new files and a **Web** section under **Clients**. `docs/TREE.md`, the new files. `AGENTS.md`, **Commands**: `pnpm web`. `docs/specs/README.md`.
- Not touched: `logic/`, `queries/`, `db/`.

## Looks like

- `clients/web/queries.js` looks like `queries/users.js`: the same exported functions, each running its `.sql` file from `queries/queries/`.
- `scripts/web.sh` looks like `scripts/jupyter.sh`, steps 1 to 3 (move to the app folder, find a Python 3), without `.venv`.
- `app.js` is a client like `clients/terminal/`: it imports `logic/`, catches and shows `error.message`.

## How `logic/` runs in the browser

1. `pnpm web` runs `python3 -m http.server 8000 --bind 127.0.0.1` from `first-app/` and prints `http://127.0.0.1:8000/clients/web/`. It only hands out files: no routes, no API. Only this computer can reach it.
2. `index.html` loads `node_modules/sql.js/dist/sql-wasm-browser.js` with a `<script>` tag (it defines `initSqlJs`), then `app.js` as a module.
3. An import map in `index.html` sends `/queries/users.js` to `/clients/web/queries.js`. Every `logic/` file imports `../queries/users.js`, so they all get the browser twin without a change. `app.js` imports `/logic/list-users.js`, `/logic/search-users.js`, `/logic/get-user.js`, `/logic/create-user.js`, `/logic/update-user.js` and `/logic/delete-user.js`. `count-users-by-gender` is not imported, so `openai` never loads.
4. When `queries.js` is imported, it starts sql.js and downloads the eight `.sql` files and `db/schema.sql` once, from the same server.
5. Before each step, `app.js` reads the chosen file (File System Access API) and gives its bytes to `load`. `logic/` runs as it is: sql.js is synchronous, like `node:sqlite`. After a create, update or delete, `app.js` writes `dump()` back to the file.
6. The chosen file handle is kept in IndexedDB, only as a pointer to the file. The next visit asks for permission with `requestPermission({ mode: "readwrite" })` from a button click, as the browser requires.

## Signature

`clients/web/queries.js` exports what `queries/users.js` exports, with the same parameters and outputs: `findAll()`, `findById(id)`, `findByEmail(email)`, `findByName(name)`, `search(text)`, `insert(name, email)`, `update(id, name, email)`, `remove(id)`, `createUsersTable()`. And two of its own:

- `load(bytes)` → nothing. Opens a sql.js database from the file bytes and runs `db/schema.sql`, like `db/connection.js`.
- `dump()` → the database as `Uint8Array`, to write to the file.

`app.js` and `scripts/web.sh` export nothing.

## SQL

None new. `queries.js` runs the `.sql` files of `queries/queries/` and `db/schema.sql`. sql.js binds named parameters with the prefix in the key (`{ ":id": id }`), so `queries.js` adds it.

## Errors

| Spec failure             | Message                                                      | Shown by                           |
| ------------------------ | ------------------------------------------------------------ | ---------------------------------- |
| empty name               | `Name is empty`                                              | under the field                    |
| invalid email            | `Email is invalid`                                           | under the field                    |
| email used               | `Email is already used`                                      | under the field                    |
| user deleted meanwhile   | `User not found`                                             | box with `OK`                      |
| SQLite fails in `logic/` | the `Could not …` of that feature, as `logic/` throws it     | box with `OK`                      |
| file cannot be read      | `Could not read users.sqlite.`                               | box with `OK`                      |
| file cannot be saved     | `Could not save users.sqlite.`                               | box with `OK`                      |
| browser without the API  | `This browser cannot open the database. Use Chrome or Edge.` | instead of the page                |
| permission refused       | `Access to users.sqlite was denied.`                         | box with `OK`                      |
| no Python 3              | `Python 3 is required to start the web client.`              | `scripts/web.sh`, stderr, exit `1` |

## Socket check

| Package         | Layer | Alerts                                                                                                   | Scores below 50 |
| --------------- | ----- | -------------------------------------------------------------------------------------------------------- | --------------- |
| `sql.js@1.14.2` | 1     | Not checked by the agent: the page answers HTTP 403. https://socket.dev/npm/package/sql.js/alerts/1.14.2 | None            |

- Layer 2 and 3: none. `npm view sql.js@1.14.2 dependencies` is empty.
- Scores: license 100, maintenance 92, quality 100, supplyChain 100, vulnerability 100.
- `1.14.2` was published on 2026-08-14. The newer `1.15.0`, `1.15.1` and `1.15.2` came out in the last three weeks (2026-10-14 to 2026-10-26) and are not used: they have had little time to be reviewed by others (`1.15.2` was also checked: no dependencies, scores 90 to 100). The package is 24 MB unpacked, mostly zip archives the page never loads; the page uses `dist/sql-wasm-browser.js` and `dist/sql-wasm-browser.wasm`.

Checked on 2026-11-03. Sources: `npm view`, the `socket-mcp` tool `depscore`, `curl` to socket.dev (403).

Decision: use `1.14.2`, not the newer `1.15.2`. Decided on 2026-11-03.

## Decisions

Answers to the open questions, 2026-11-03:

1. **The file cannot be read or saved.** Reading and saving the file happen in `app.js`, outside `logic/`, and a client only prints the messages `logic/` threw. So these are two new client messages, `Could not read users.sqlite.` and `Could not save users.sqlite.`, added to [ERRORS.md](../../ERRORS.md) and to the spec. Every `logic/` message keeps coming only from `logic/`, and the message says what failed: the file, not the user.

## Open questions

None.
