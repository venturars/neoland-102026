Issue: #905

# Electron desktop app

The first-app opens as a desktop app on macOS, Windows and Linux. The person starts the database program in one terminal, runs `pnpm electron` in another, and a window opens with its own page.

Electron is not a web platform. It puts a web page inside a desktop window.

## Who uses it

A student who wants to list, create, look up, edit and delete users in a window of their own. The terminal, the notebooks and the web page in the browser keep working as before.

There is no password, as in #807. Anyone who can open the app can see and change every user.

The window trusts whatever answers on `127.0.0.1:3000`. If another program took that port before the database program, the window would load its page. `main.js` opens only the address `127.0.0.1` (never `localhost` or another host) and the window has no Node (Electron's defaults), so the risk is low, but the app does not check who is behind the port.

## What is asked

- A command, `pnpm electron`, that opens a window of 800x600. The database program must already be running (`pnpm start`, in another terminal). The app does not start it and does not stop it.
- The window loads its own page from the database program, at `http://127.0.0.1:3000/electron/index.html` (the program serves a file by its full name; `/electron/` alone gives 404). The page is `src/clients/electron/index.html`, with its own `app.js` and `styles.css`. It deliberately does not reuse the page of `src/clients/web/`.
- The page uses the functions of `src/logic/` directly, as a browser module. There is no layer between the page and `logic/`, and the main process of Electron does nothing but open the window.
- The users are the real ones, the same that the terminal, the notebooks and the browser page use.
- On macOS, clicking the app icon with no window open opens a window again. When all windows close, the app quits, except on macOS.

## The two screens

**List**

- A form to create a user, with name and email.
- A form to look up a user by id.
- The list of users. Choosing one opens its detail.
- A message area for errors.

**Detail**

- The id, name, email, creation date and update date of the user.
- A form to edit name and email, with a Save button.
- A Delete button. It deletes at once, with no confirmation.
- A Back button that returns to the list.
- A message area for errors.

## Example

A student runs `pnpm start` in one terminal and `pnpm electron` in another. A window opens with the list. They create Ada with ada@example.com and she appears in the list. They choose her, change the name to Ada Lovelace and press Save. The detail shows the new name and a new update date. They press Back, look up her id in the form and see the same detail. They press Delete and she is gone from the list.

## What goes wrong

- Any failure of `logic/` (empty name, email that is not valid or already used, no user found, nothing to update, database failed): the page shows the message of the error exactly as `logic/` gives it, in the list or in the detail, depending on where it happened. Nothing is saved.
- The database program is not running: the window cannot load the page and shows the error page of Chromium. That is the only case the app does not handle.

## Out of scope

Starting the database program from the window, a confirmation before deleting, a Content-Security-Policy, blocking new windows or navigation, installers (`.dmg`, `.exe`, `.AppImage`), signing the app, automatic updates, passwords and authentication, new rules or changes in `src/logic/` and `src/queries/`, reusing the browser client, and removing the other clients.

The only change in `src/db/` is the one `plan.md` explains: the program also serves the folder of this client. This is an exception to "do not change the database program".
