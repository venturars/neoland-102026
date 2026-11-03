# Tasks — web client

1. [x] In `docs/ERRORS.md`, add the five client messages of the spec, printed by `clients/web/` and `scripts/web.sh`.
2. [x] Create `GLOSSARY.md` with the term **User**, and `docs/adr/0001-browser-sqlite-connection.md`. In `docs/DATABASE.md`, add the exception with a link to the ADR.
3. [x] In `docs/CONSTITUTION.md`, **Runtime**, add `sql.js`, Python 3 for `pnpm web`, and Chrome or Edge.
4. [x] Run `pnpm add sql.js@1.14.2 --save-exact`.
       `package.json` has `"sql.js": "1.14.2"` and `pnpm-lock.yaml` has only `sql.js` as new.
5. [x] Create `scripts/web.sh` and the `web` script in `package.json`. Run `pnpm web`.
       It prints the URL, and the URL of `logic/list-users.js` answers 200. With no Python on the `PATH`, it prints `Python 3 is required to start the web client.` and `echo $?` prints `1`.
6. [x] Create `clients/web/queries.js`.
       In the page's console, `load` an empty file, `insert` a user, `findAll` and `search` show it, and `dump` returns bytes.
7. [x] Create `clients/web/index.html` and `clients/web/styles.css`: the open button, the list, the card, the sheet, the action sheet and the alert box.
       The page opens with no error in the console, in light and dark mode.
8. [x] In `clients/web/app.js`, open and remember the file, then show the list and the search.
       The users of `db/users.sqlite` show by sections; typing filters them.
9. [x] In `clients/web/app.js`, add the card, the new user sheet, editing and deleting, each reading the file first and saving after.
       Each one changes `db/users.sqlite`.
10. [x] In `eslint.config.js`, add the block for `clients/web/**/*.js` with its browser globals. Run `pnpm format:check` and `pnpm lint`.
        Both pass.
11. [x] Add the new files to `docs/TREE.md` and `docs/ARCHITECTURE.md`, with a **Web** section under **Clients**, and `pnpm web` to `AGENTS.md`.
12. [ ] Check in Chrome: open the file, list, search, open a user, add, add with a used email, edit, delete.
        Each screen does what the spec says, and each failure shows its message.
13. [ ] Check in Chrome: reload the page (the file is remembered), and switch to dark mode.
        Then paste `clients/terminal/list-users.txt`: it shows the changes made in the page.
14. [ ] In `docs/specs/README.md`, set `web-client` to `done`.
