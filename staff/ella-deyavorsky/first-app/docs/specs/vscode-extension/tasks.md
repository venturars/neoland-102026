# Tasks — A VS Code extension for the users

Do the tasks in order. Inside a task, do the steps in order. There is no query and no change in `logic/`, so those tasks do not exist. `docs/CONSTITUTIONS.md`, `docs/DATABASE.md`, `docs/ERRORS.md` and `docs/STYLE.md` do not change. There is no new package, so there is no Socket review.

## Task 1 — Update the docs

- [x] In `AGENTS.md`, add `pnpm vscode` to "Commands": it opens the Extension Development Host, with the database program running. Result: the command is described.
- [x] In `AGENTS.md`, add `src/clients/vscode/` to the paths of `pnpm format`. Result: it matches `package.json` after this feature.
- [x] In `docs/ARCHITECTURE.md`, add `vscode/` under `src/clients/`, with its five files and the job of each one. Result: the clients list has `vscode/`.
- [x] In `docs/ARCHITECTURE.md`, adjust the line about `clients/`. Result: it says the extension host imports `logic/`, and its webview only talks to the extension host.
- [x] In `docs/TREE.md`, add `vscode/` under `clients/` with `package.json`, `extension.js`, `webview.js`, `webview.css` and `icon.svg`. Result: the tree lists the five files.

## Task 2 — Get VS Code ready

- [x] Run `code --version`. Result: it prints 1.100 or newer, so the `code` command is on the `PATH`.
- [x] Add the `vscode` script to the `package.json` of `first-app`: `code --extensionDevelopmentPath="$PWD/src/clients/vscode"`. Result: `pnpm vscode` exists.
- [x] Add `src/clients/vscode/**/*.js` to the `format` script of the `package.json` of `first-app`. Result: `pnpm format` covers the extension.

## Task 3 — Write the client

- [x] Create `src/clients/vscode/package.json` with `name`, `version`, `publisher`, `private: true`, `engines.vscode` `^1.100.0`, `"type": "module"` and `main: "./extension.js"`. Result: the manifest exists, with no dependencies and no scripts.
- [x] Create `src/clients/vscode/icon.svg`, 24x24 in one color. Result: the sidebar has an icon to use.
- [x] In the manifest, add `contributes.viewsContainers.activitybar` with the title `Usuarios` and that icon. Result: the sidebar has a place for the view.
- [x] In the manifest, add `contributes.views` with one view of `"type": "webview"`. Result: the container has one view.
- [x] Create `src/clients/vscode/extension.js` with `/* global console */`, the imports from `vscode` and `node:crypto`, and the five imports of `logic/` with the `.js` extension. Result: the five names are imported.
- [x] Add the exported `activate`, which only registers the view with `{ resolveWebviewView: resolveView }`. Result: `activate` returns at once.
- [x] Add `resolveView`: set `enableScripts: true`. Result: the screen can run its script.
- [x] In `resolveView`, set `localResourceRoots` to the folder of the extension. Result: the screen can only load files of that folder.
- [x] In `resolveView`, write the HTML with the policy `default-src 'none'; style-src <cspSource>; script-src 'nonce-<nonce>'`, a new nonce, and the Spanish labels of `plan.md`. Result: the view shows the list, the four forms, the result and the error, with nothing working yet.
- [x] Add the function that answers the messages, with one `try`/`catch`. Result: each message gets exactly one reply.
- [x] In the `catch`, choose the sentence with the plain `Error` test of `plan.md`. Result: a plain `Error` shows its message, and anything else is logged and shows "The database failed.".
- [x] Add `list`: call `listUsers` and reply `{ users }`. Result: the list arrives.
- [x] Add `view`: call `findUserById({ id })` and reply `{ user }`. Result: the user arrives.
- [x] Add `create`: call `createUser({ name, email })`. Result: the user is saved.
- [x] Add `update`: turn each empty text into `undefined`. Result: an empty box is "not entered".
- [x] In `update`, call `updateUser({ id, name, email })`. Result: only what was entered changes.
- [x] Add `delete`: open the modal dialog `¿Borrar el usuario con id <id>?` with the button `Borrar`. Result: the call waits for the person.
- [x] In `delete`, reply `{}` if the answer is not `Borrar`. Result: nothing is deleted, and the screen does not stay waiting.
- [x] In `delete`, call `deleteUser({ id })` if the answer is `Borrar`. Result: the user is gone.
- [x] After a create, update or delete that works, call `listUsers` in its own `try`/`catch`. Result: the reply is the one of the table in `plan.md`, also when only the list fails.
- [x] Create `src/clients/vscode/webview.js` with `/* global acquireVsCodeApi, document */`, keeping the VS Code API in a local name. Result: the screen can send messages.
- [x] Add the function that sends a message and turns the buttons off. Result: nothing can be sent twice while waiting.
- [x] Clear the last error and the last result when an action starts. Result: the screen only shows the current answer.
- [x] Add the handler of the four buttons of the actions and `Recargar`, sending the text as it was typed. Result: each button sends its message.
- [x] Send `list` when the script loads. Result: the list appears on opening, and on coming back to the view.
- [x] Add the handler of the reply, which turns the buttons on first. Result: every reply, even `{}`, frees the screen.
- [x] In that handler, draw `users` with `textContent`: id, name and email in each row, or `No hay usuarios`. Result: a name with HTML is shown as text.
- [x] In that handler, draw `user` with `textContent`. Result: the result shows the five fields.
- [x] In that handler, draw `error` with `textContent`. Result: the sentence is shown as it is.
- [x] Create `src/clients/vscode/webview.css` with the colors of the VS Code theme. Result: the view can be read in a light and a dark theme.

## Task 4 — Run it

Each step is run by hand with `pnpm start` running, unless it says otherwise. These writes change the real `src/db/users.sqlite`, so use a new user with a new email, and delete it at the end.

Note: on 2026-11-04 most steps ran in a throwaway copy of `src/` outside the repo, with its own empty database on another port, and a small script clicked the real buttons of `webview.js`. `pnpm vscode`, `pnpm format`, `pnpm lint` and the web client ran in the real folder. A person ran the rest in the real folder, with the real users: `pnpm vscode` from the terminal inside VS Code, opening the view, and the four steps of the real dialog. Notes on the run:

- `pnpm install --frozen-lockfile` failed with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`: `electron@45.2.2` (already in the lockfile from staging) was published at 2026-11-03T21:43Z, inside the 24h minimum. It has nothing to do with this feature. At the request of the person who reviews, it was run with `--config.minimumReleaseAgeExclude=electron`, which exempts only `electron` for that one command, and it passed. `pnpm-lock.yaml` did not change.
- `pnpm format` and `pnpm lint` print the same warning from the install that runs before scripts, and still run. `eslint .` exits 0.

Note: the person found that "No user was found." did not show after a delete. The sentence was set, but above the visible area, because the forms are at the bottom of the view. The script had missed it because it read the text and not its place on screen. Now any reply with something to show scrolls the view to the top, and `Resultado` is above the list. This was not in `plan.md`. The person ran the step again and saw the sentence.

Note: `pnpm -r` does list `src/clients/vscode/package.json` as a member (`first-app-users`, private), which `plan.md` does not say. Nothing in the app uses `pnpm -r`, and the manifest has no dependencies.

Note: `webview.js` also names `window` in its `/* global */` line, because it listens for the replies with `window.addEventListener`.

- [x] Run `pnpm install --frozen-lockfile`. Result: it passes, and `pnpm-lock.yaml` does not change.
- [x] Run `pnpm vscode` from a terminal outside VS Code. Result: the new window has the view in the sidebar.
- [x] Run `pnpm vscode` from the terminal inside VS Code. Result: the same.
- [x] Open the view. Result: the list shows the users.
- [x] Create a user. Result: the result shows the five fields, and the user is in the list.
- [x] Create a user with the same email. Result: "This email is already used."
- [x] Create a user with no name. Result: "The name is missing."
- [x] Create a user with a bad email. Result: "The email is not valid."
- [x] Create a user with the name `<b>x</b>`. Result: it is shown as text.
- [x] View by id. Result: the result shows the user.
- [x] View by an unknown id. Result: "No user was found."
- [x] View with an empty id. Result: "No user was found."
- [x] Update only the name. Result: the email stays.
- [x] Update only the email. Result: the name stays.
- [x] Update both. Result: both change.
- [x] Update with both boxes empty. Result: "There is nothing to update."
- [x] Delete and press cancel. Result: the user stays, and the buttons work again.
- [x] Delete and press `Esc`. Result: the same.
- [x] Delete and press `Borrar`. Result: no user in the result, and one less in the list.
- [x] Delete the same id and press `Borrar`. Result: "No user was found."
- [x] Leave the view and come back. Result: the list loads again.
- [x] Stop `pnpm start` and press `Recargar`. Result: "The database failed."
- [x] Start `pnpm start` and press `Recargar`. Result: the list is back.
- [x] Open the web client at `http://127.0.0.1:3000`. Result: it still works.
- [x] Run `pnpm format`. Result: no errors.
- [x] Run `pnpm lint`. Result: no errors.
