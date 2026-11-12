# Plan — Web client, basic and isolated

This is a new client next to `clients/terminal/` and `clients/jupyter/`. No file in `logic/`, `queries/` or `db/` changes, there is no new SQL and no new error sentence. The client does not import from `logic/` and does not call any API. This is on purpose: it is a mock to try the screens. The rules of the app (valid name and email) are repeated in the page in a simple form and are not the rules of `logic/`.

## Files to add

In `src/clients/web/`:

- `index.html`: three `<section>` blocks, one per screen, with ids `screen-list`, `screen-menu` and `screen-edit`. It loads `style.css` and `app.js` (`<script src="app.js">`, a classic script, no `type="module"`).
- `style.css`: simple styles. The class `hidden` hides a screen.
- `app.js`: classic script, no `import`, no classes, no frameworks, short comments.

## app.js

- A constant `STORAGE_KEY` at the top, with a short comment, and a constant `EXAMPLE_USERS` with the 3 users (`id`, `name`, `email`).
- `show(screenId)` adds `hidden` to the three screens and removes it from the one named.
- Functions: `loadUsers()` (reads `localStorage`, falls back to the examples if it is empty or not valid JSON, and saves them), `saveUsers(users)`, `renderList()`, `chooseUser(id)`, `fillEditForm()`, `saveUser()`, `deleteUser()`.
- The chosen user is kept in one variable with its id. Buttons use `addEventListener` in `app.js`.
- Errors and the notes notice are written in a `<p>` of the page. The only browser dialog is `confirm()` for Delete.
- Code and ids are in English, as `docs/STYLE.md` says. The text the person sees can be in the language of the page.

## Lint

`eslint.config.js` has no browser globals, so `document`, `localStorage` and `confirm` would fail `no-undef`. To keep `eslint.config.js` and `package.json` as they are, `app.js` starts with `/* global document, localStorage, confirm */`. The decision is in "Decisions".

## Docs to change

- `docs/TREE.md`: add `web/` with `index.html`, `style.css` and `app.js` under `clients/`.
- `docs/ARCHITECTURE.md`: in `src/clients/`, add `web/` as an isolated client that does not use `logic/`, with its three files. Adjust the sentence of the "Layers" list for `clients/` ("A client imports a function from `logic/`") so it does not contradict this client.
- Note for the record: the `.txt` per feature of `clients/terminal/` (from "When a task is done" in `AGENTS.md`) does not apply here. This client is tested by opening `index.html`. This is written in the `ARCHITECTURE.md` entry.

## What stays as it is

`package.json`, `pnpm format` (it still formats only `db/`, `queries/` and `logic/`), `eslint.config.js`, `logic/`, `queries/`, `db/`, `clients/terminal/`, `clients/jupyter/`.

## Packages

No Node package is added, so there is no Socket review.

## How it is checked

Open `index.html` with a double click (`file://`) and check, in order: choose a user; edit and save, reload, and the change is still there; empty name and an email without `@` show an error; delete asks for confirmation and the user is still gone after a reload; "Go to notes" shows the notice; Back returns to the list. Then `pnpm lint` has no errors. Before checking again, clear the site data (or `localStorage`) to get the 3 example users back.

## Decisions

1. `app.js` uses `/* global document, localStorage, confirm */` for the lint. `eslint.config.js` does not change.
2. The note that the `.txt` per feature does not apply stays in `ARCHITECTURE.md` only.
