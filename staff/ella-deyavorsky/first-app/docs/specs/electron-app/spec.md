Issue: #905

# Electron desktop app

The first-app opens as a desktop app on macOS, Windows and Linux. The person runs one command and a window opens with the web page that already exists. There is no terminal to keep open and no need to start the database program by hand.

Electron is not a web platform. It puts a web page inside a desktop window. The page, the rules and the database program are the ones the app already has.

## Who uses it

A student who wants to choose who they are, change their name or email, or delete their user, in a window of their own. The terminal, the notebooks and the web page in the browser keep working as before.

There is no password, as in #807. Anyone who can open the app can see and change every user.

## What is asked

- A command, `pnpm electron`, that opens the window. It works with `pnpm start` stopped.
- When the window opens, the database program starts by itself. When the window closes, the program stops.
- The window shows the web page of `src/clients/web/`. The three screens and their text do not change.
- The page uses the rules of `src/logic/`. The app has no rules of its own.
- The database file of the desktop app is in the data folder of the user of each system, not next to the code. The first time, the file is created there with the table, empty.
- The command works on macOS, Windows and Linux.

## Example

A student runs `pnpm electron`. A window opens with the list of users. They choose one, change the name and save. The menu shows the new name. They close the window and run the command again. The name is still there.

## What goes wrong

- Empty name, email that is not valid or already used: the message of the app is shown and nothing is saved.
- The program of the database cannot start (for example, the port is used by another program): the window says the app could not start and does not stay blank.
- The window is closed while a change is being saved: the database is not left half written.

## Out of scope

Installers (`.dmg`, `.exe`, `.AppImage`), signing the app, automatic updates, passwords and authentication, new rules or changes in `src/logic/`, replacing the SQL server, and removing the other clients.
