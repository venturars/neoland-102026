# Plan — A VS Code extension for the users

A new client in `src/clients/vscode/`. The process of the extension (the extension host) imports the five functions of `logic/` and calls them. The screen (a webview) only draws what it receives and sends what the person types. Nothing in `logic/`, `queries/` or `db/` changes, there is no new SQL, no new package and no new error sentence.

The person who reviews answered the questions of this plan; see "Answered".

## What was checked

A throwaway extension, outside the repo, was run in a real Extension Development Host: VS Code 1.143.1 on macOS, with its own profile. It imported the real files of `src/logic/` and called the real database program on port 3000. It only read: the update and delete calls used an id that does not exist, so they stopped before writing.

| What was checked | Result |
|---|---|
| CommonJS entry that loads `logic/` with `await import()` | Works |
| ESM entry (`"type": "module"`) with `import { window, commands, Uri } from "vscode"` and a plain `import` of `logic/` | Works |
| `typeof window` in the extension host | `undefined`, so `queries/users.js` uses `http://127.0.0.1:3000` without a change |
| `fetch` in the extension host | Exists (Node 24.21.0 inside the host) |
| `listUsers()` | Returns the users with `id`, `name`, `email`, `createdAt`, `updatedAt` |
| `listUsers()` with no program on the port (a copy of `logic/` and `queries/`, pointed at an unused port) | "The database failed." |
| `findUserById` with `""`, `"abc"` or an unknown id | "No user was found." |
| `findUserById` with an existing id written as text | Returns the user, with `id` as a number |
| `updateUser({ id })` with no name and no email | "There is nothing to update." |
| `updateUser` and `deleteUser` with an unknown id | "No user was found." |
| Webview in the sidebar, script file with a nonce, message to the extension host | Works |
| `fetch` from that webview with `default-src 'none'` | Blocked by the policy |
| Text with HTML written with `textContent` in the webview | Stays text, no element is created |
| Leaving the view and coming back | The screen loads again from the start |
| `activate` that waits for slow work before returning | The view stays empty until it returns, so `activate` only registers the view |
| `listUsers()` when the program on the port answers with something that is not a list (a stub on an unused port) | Throws a `TypeError`, `users.map is not a function`. The sentences of `logic/` are plain `Error` |
| The plain `Error` test of "Messages", in the extension host | "No user was found.", "There is nothing to update." and "The database failed." pass as they are. The odd answer, a `ReferenceError`, a `RangeError`, a thrown string, `null` and `undefined` are all mapped, with no second failure |
| `window.showWarningMessage(text, { modal: true }, "Borrar")` | Opens the dialog, and the call waits for an answer |
| `code --extensionDevelopmentPath=./folder` (relative) | Fails: VS Code looks for `/folder` |
| `code --extensionDevelopmentPath="$PWD/folder"` (absolute) | Works |

Not run: the real `pnpm vscode` script, `code` from the terminal inside VS Code (the runs used a clean environment), a real stop of `pnpm start`, a write to the database, pressing the buttons of the dialog, VS Code 1.100, Windows and Linux. "How it is checked" covers the ones that can be run here.

## Files to add

All in `src/clients/vscode/`:

- `package.json`: the manifest of the extension. `name`, `version`, `publisher`, `private: true`, `engines.vscode` `^1.100.0`, `"type": "module"`, `main: "./extension.js"`, and `contributes` with one `viewsContainers.activitybar` entry (`Usuarios`) and one view of `"type": "webview"`. No dependencies and no scripts.
- `extension.js`: the extension host. It imports the five functions of `logic/` and exports `activate`. It registers the view, writes the HTML with the policy, and answers the messages of the screen.
- `webview.js`: the screen. It draws with `textContent` only, and sends messages. It imports nothing and has no rules. It starts with `/* global acquireVsCodeApi, document */`, as the other browser files do.
- `webview.css`: the style, with the colors of the VS Code theme.
- `icon.svg`: the icon of the sidebar. VS Code asks for one in a view container.

No `contributes.commands`: every action is a button of the view, and VS Code opens the view from its icon. No `activationEvents`: since VS Code 1.74 a contributed view activates the extension by itself. No `terminal/` file: the task says the terminal client does not change, and `web/` and `electron/` are also tested by opening them.

## Files to change

- `package.json` of `first-app`: add the script `"vscode": "code --extensionDevelopmentPath=\"$PWD/src/clients/vscode\""` and add `src/clients/vscode/**/*.js` to `format`. The path is absolute because a relative one fails. Nothing else changes. `$PWD` works in the shell of macOS and Linux, not in `cmd` on Windows, as `pnpm browser` already depends on macOS.
- `AGENTS.md`: add `pnpm vscode` and the new `format` path in "Commands".
- `docs/ARCHITECTURE.md`: add `vscode/` under `src/clients/`, and in the line about `clients/` say that the extension host imports `logic/` and that its webview only talks to the extension host.
- `docs/TREE.md`: add `vscode/` with its five files.

`docs/CONSTITUTIONS.md`, `docs/DATABASE.md`, `docs/ERRORS.md` and `docs/STYLE.md` stay as they are. `eslint.config.js` stays: in a test copy of the folder, it passed the `import` from `vscode`, and it only asked `webview.js` to name `acquireVsCodeApi` and `document`, which the `/* global */` line does.

## How it works

1. `pnpm vscode` opens the Extension Development Host with the folder of the extension.
2. The person opens the view. VS Code runs `activate`, which registers the view and returns.
3. VS Code asks for the view. `extension.js` sets `enableScripts: true` and `localResourceRoots` to the folder of the extension, and writes the HTML. The policy is `default-src 'none'; style-src <cspSource>; script-src 'nonce-<nonce>'`, with a new nonce from `randomUUID()` of `node:crypto` each time. So the screen cannot call the network, and only `webview.js` runs.
4. `webview.js` sends `list` when it loads, and one message per button. From the message until its reply, the buttons are off.
5. `extension.js` calls the function of `logic/` and always sends one reply. The reply turns the buttons on again.

## Messages

From the screen to the extension host. Each value is the text as it was typed:

| Message | Calls |
|---|---|
| `{ action: "create", name, email }` | `createUser({ name, email })` |
| `{ action: "list" }` | `listUsers()` |
| `{ action: "view", id }` | `findUserById({ id })` |
| `{ action: "update", id, name, email }` | `updateUser({ id, name, email })` |
| `{ action: "delete", id }` | `deleteUser({ id })` |

From the extension host to the screen, exactly one reply per message, even when nothing happened, so the screen never waits for an answer that does not come:

| Case | Reply |
|---|---|
| List works | `{ users }` |
| View works | `{ user }` |
| Create or update works | `{ user, users }` |
| Delete works | `{ users }`, with no user, so the result area stays empty |
| The action fails | `{ error }` |
| Create, update or delete works, and the list after it fails | The same reply with `error` in place of `users`. The action did happen, so the sentence does not undo it |
| The person cancels the dialog | `{}`. The screen only turns the buttons on again |

One function of `extension.js` answers the messages, with one `try`/`catch` around the action. The sentence of `error` is chosen by asking if it is a plain `Error`, because `logic/` only throws plain `Error`, so that is the only thing that is safe to show:

```js
let sentence = "The database failed.";
let isPlainError = false;
// instanceof comes first: reading .constructor of null or undefined would throw.
if (error instanceof Error) {
  if (error.constructor === Error) {
    isPlainError = true;
  }
}
if (isPlainError) {
  sentence = error.message;
} else {
  console.error(error);
}
```

Any other thing that is thrown (a `TypeError`, a `ReferenceError`, a `RangeError`, a text, `null`) goes to the log and shows "The database failed." The client has no copy of the list of `docs/ERRORS.md`, so it cannot go out of date.

In `update`, the extension host turns an empty text (`""`) into `undefined` before calling `updateUser`. The spec says a value not entered keeps the saved one, and in a form with no loaded user an empty box means "not entered". This is how "not sent" is written in `logic/`, not a rule of the extension: it does not trim and does not check. So emptying the name in Update does not give "The name is missing."; only writing spaces does. The web and Electron clients always send both boxes, so an empty name there does give it.

In `delete`, the extension host first opens a native dialog of VS Code, `window.showWarningMessage("¿Borrar el usuario con id <id>?", { modal: true }, "Borrar")`. If the answer is `Borrar`, it calls `deleteUser({ id })`. If the person closes or cancels, the answer is `undefined`, so it calls nothing and replies `{}`. The dialog does not look up the user: an id that does not exist asks first and then gives "No user was found." This is a check of the client, not a rule of the app, as in the Chrome popup: `logic/` still deletes with no confirmation. The screen has no part in it.

`id` goes to `logic/` as text, as it was typed. The checks above show this finds the right user and that any other text gives "No user was found."

## Functions of `logic/`

No new function. All five exist, are async, and receive what the constitution says. They return a user, an array of users (`listUsers`), or nothing (`deleteUser`). Each failure is one of these sentences: "The name is missing.", "The email is not valid.", "This email is already used.", "No user was found.", "There is nothing to update.", "The database failed."

No query, no `.sql` file and no change to the database.

## Edge cases

| Case | What the person sees |
|---|---|
| No users | The list says `No hay usuarios` |
| Create with an empty name or email | "The name is missing." or "The email is not valid." |
| Update with the name and the email empty | "There is nothing to update.", even if the id is wrong, because `logic/` checks that first |
| Update with a name of only spaces | "The name is missing." if the id exists; "No user was found." if not, because of the order in `logic/` |
| View with an empty id | "No user was found." |
| Delete with an empty id | The dialog, then "No user was found." |
| Delete, and the person cancels the dialog | Nothing is deleted, no sentence appears, and the buttons work again |
| Anything thrown that is not a plain `Error`, such as another program on port 3000 answering with something that is not a list | "The database failed.", and the error goes to the log |
| Create, update or delete works, and the list after it fails | The result (if any) and "The database failed."; the list stays as it was |
| A name with HTML in it | Shown as text |
| `pnpm start` is off when the view opens | "The database failed."; `Recargar` tries again after it starts |
| A failed action | The sentence appears, the result stays cleared, and the list stays as it was |
| A new action | Turns the buttons off until the reply |
| A new action | Clears the last error and the last result first |

## Texts of the screen

`Usuarios`, `Recargar`, `No hay usuarios`, `Crear`, `Ver`, `Actualizar`, `Borrar`, `Nombre`, `Email`, `Id`, `Resultado`, `Creado`, `Actualizado`. The dialog says `¿Borrar el usuario con id <id>?`, with the button `Borrar`. VS Code adds the cancel button itself, in the language of VS Code, so it may not be in Spanish. Delete shows no text when it works: the user leaves the list.

## New sentence: none

- The database program cannot be reached: "The database failed." already covers it. This was run.
- "The extension server is not running." and "The request is not valid." do not apply: this client has no server of its own and no HTTP request of its own.
- A file of `logic/` cannot be loaded: this is a broken repo, not something the person did. `activate` does not run and VS Code shows its own notice. It is written here so nobody adds a sentence for it.
- Anything thrown that is not a plain `Error`: it is turned into "The database failed.", which is not a new sentence. `docs/ERRORS.md` does not change.

## What must be running

The database program (`pnpm start`). VS Code 1.100 or newer, because ESM extensions arrived in that version, and its `code` command on the `PATH`.

## Packages

None. `vscode` is not a Node package here: the extension host provides it. `@types/vscode` is not added because there is no TypeScript. So there is no Socket review.

## What stays as it is

`src/logic/`, `src/queries/`, `src/db/`, port 3000, every existing sentence, and the terminal, Jupyter, web, HTTP, Electron and Chrome clients. `pnpm install` has nothing to do with the new manifest, because there is no `pnpm-workspace.yaml`; the check below confirms it.

## How it is checked

1. `pnpm install --frozen-lockfile` passes, and `pnpm-lock.yaml` does not change.
2. `pnpm start`, then `pnpm vscode` from the terminal inside VS Code and from a terminal outside it. The new window has the view in the sidebar.
3. Create a user, and see the result and the list.
4. Create with the same email, with no name and with a bad email, and see each exact sentence.
5. View by id, by an unknown id and with an empty id.
6. Update only the name, and see that the email stays. Then only the email, then both, then neither.
7. Create a user with the name `<b>x</b>`, and see it as text.
8. Delete and cancel the dialog: the user stays and the buttons work again. Delete and close the dialog with `Esc`: the same. Delete and press `Borrar`: no user in the result and one less in the list. Delete again, press `Borrar`, and see "No user was found."
9. Leave the view and come back. The list loads again.
10. Stop `pnpm start`, press `Recargar`, and see "The database failed." Start it, press `Recargar`, and see the list.
11. `pnpm format` and `pnpm lint` have no errors.

## Decisions to review

1. **One function per file.** `extension.js` and `webview.js` have several functions, as `server.js` of the Chrome client and `app.js` of the web client do. The rule is read as applying to `logic/` and `queries/`, as the Chrome plan did.
2. **No methods.** VS Code asks for an object with `resolveWebviewView`. It is written as a property that points to a named function, `{ resolveWebviewView: resolveView }`, with no class and no `this`. This form was run.
3. **Four small forms.** Each action has its own boxes, as the input in the issue says. Clicking a user in the list does nothing. It was not asked for.
4. **No `retainContextWhenHidden`.** The VS Code docs warn about its memory use, and loading again keeps the list real. The cost is that typed text is lost.
5. **One row of the list.** It shows the id, the name and the email, so the id to write in View, Update or Delete is next to the name. `createdAt` and `updatedAt` show in the result. The list is narrow, and they would not fit.

## Answered

1. **`logic/` is ESM.** ESM entry: `"type": "module"` in the manifest and `engines.vscode` `^1.100.0`, with `import { createUser } from "../../logic/create-user.js"` and `import { window } from "vscode"`. VS Code [supports ESM extensions since 1.100](https://code.visualstudio.com/updates/v1_100), on the Node extension host, the only one this extension runs on. A CommonJS entry with `import()` also worked, but it goes against "files use ESM". A bundler would be a new package.
2. **The manifest.** It lives in `src/clients/vscode/package.json`. VS Code asks for [a file named `package.json` at the root of the extension folder](https://code.visualstudio.com/api/references/extension-manifest). `first-app/package.json` only gets one script and one `format` path. The second file is not a pnpm workspace package and has no dependencies. `pnpm install` was not run with it yet; step 1 of "How it is checked" does that.
3. **An empty box in Update.** It keeps the saved value. See "Messages".
4. **A failure that is not in `docs/ERRORS.md`.** The test is "is it a plain `Error`?", not "is it a `TypeError`?" Only a plain `Error` is shown. Everything else goes to the log and shows "The database failed." See "Messages". Comparing with the sentences of `docs/ERRORS.md` is not used: it would keep a second copy of that list.
5. **Delete.** It asks first, with a modal dialog of VS Code that shows the id: `¿Borrar el usuario con id 5?`, with the button `Borrar`. The name is not shown: the person just typed the id, the list shows it next to the name, and a lookup would add a call and one more failure path. A wrong id asks first and then gives "No user was found." See "Messages".

## Open questions

None.
