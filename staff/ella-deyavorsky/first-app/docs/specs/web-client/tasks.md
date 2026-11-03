# Tasks — Web client, basic and isolated

Do the tasks in order. Inside a task, do the steps in order.

## Task 1 — Update the docs

- [x] Add `web/` with `index.html`, `style.css` and `app.js` under `clients/` in `docs/TREE.md`. Result: the tree lists the new client.
- [x] Add `web/` to the `src/clients/` section of `docs/ARCHITECTURE.md`, as an isolated client that does not use `logic/`, with a note that the `.txt` per feature of `clients/terminal/` does not apply because it is tested by opening `index.html`. Result: the entry is there.
- [x] Change the "Layers" sentence about `clients/` in `docs/ARCHITECTURE.md` so it does not say every client imports from `logic/`. Result: no contradiction with `web/`.

## Task 2 — Write the client

- [x] Create `src/clients/web/index.html` with the three sections `screen-list`, `screen-menu` and `screen-edit`, and a classic `<script src="app.js">`. Result: it opens with a double click.
- [x] Create `src/clients/web/style.css` with the `hidden` class and simple styles. Result: only one screen is visible.
- [x] Create `src/clients/web/app.js` with `/* global document, localStorage, confirm */`, `STORAGE_KEY`, `EXAMPLE_USERS`, `show(screenId)`, `loadUsers`, `saveUsers`, `renderList`, `chooseUser`, `fillEditForm`, `saveUser` and `deleteUser`. No imports, no classes. Result: the three screens work as in `spec.md`.

## Task 3 — Run it

- [x] Open `index.html` and choose a user. Result: the menu shows its name.
- [x] Edit and save, then reload. Result: the change persists.
- [x] Try an empty name and an email without `@`. Result: an error is shown and nothing is saved.
- [x] Delete a user with `confirm()`, then reload. Result: the user is still gone.
- [x] Press "Go to notes" and Back. Result: the notice is shown, and Back returns to the list.
- [x] Run `pnpm lint`. Result: no errors.
- [x] Check `git status`. Result: `package.json` and `eslint.config.js` did not change.
- [x] Stop. Result: the one-pass cycle is done.
