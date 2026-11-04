Issue: #905

# Electron desktop app

The first-app opens as a desktop app on macOS, Windows and Linux. The person starts the database program in one terminal, runs `pnpm electron` in another, and a window opens with its own page.

Electron is not a web platform. It puts a web page inside a desktop window.

## Who uses it

A student who wants to choose who they are, change their name or email, or delete their user, in a window of their own. The terminal, the notebooks and the web page in the browser keep working as before.

There is no password, as in #807. Anyone who can open the app can see and change every user.

## What is asked

- A command, `pnpm electron`, that opens the window. The database program must already be running (`pnpm start`, in another terminal). The app does not start it and does not stop it.
- The window has its own page, with its own `index.html`, `app.js` and `style.css`. It deliberately does not reuse the page of `src/clients/web/`.
- The page uses the functions of `src/logic/`. The app has no rules of its own.
- The users are the real ones, the same that the terminal, the notebooks and the browser page use. A change made in the window is seen in the others, and the other way round.
- The window offers the same actions as the browser page: choose a user, edit name or email, delete (with confirmation).
- The command works on macOS, Windows and Linux.

## Example

A student runs `pnpm start` in one terminal and `pnpm electron` in another. A window opens with the list of users. They choose one, change the name and save. The menu shows the new name. In the terminal, the list of users shows the same new name.

## What goes wrong

- Empty name, email that is not valid or already used: the message of the app is shown and nothing is saved.
- The database program is not running: the window shows the message of the app for that action ("The database failed.") and does not stay blank or crash.

## Out of scope

Starting the database program from the window, installers (`.dmg`, `.exe`, `.AppImage`), signing the app, automatic updates, passwords and authentication, new rules or changes in `src/logic/`, `src/queries/` or `src/db/`, reusing the browser client, and removing the other clients.
