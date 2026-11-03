Issue: #785

# Web client, basic and isolated

A very simple web page to try the idea of "choose who I am, then edit my user". It is plain HTML, CSS and JavaScript. It opens with a double click on `index.html`, with no server.

The page does not use `src/logic/`, `src/queries/`, `src/db/` or any API. It has a fixed example list of 3 users, each with `id`, `name` and `email`. The list is saved in the browser `localStorage`. The first time the page opens, the 3 example users are saved. After that, the saved list is the one that is used, so changes stay after a reload.

There is one `index.html` with three screens. Only one is visible at a time.

## Screen 1: choose who I am

Shows the list of users, one per id, with the id and the name. There is no password. Choosing a user opens the menu for that user. If the list is empty (all users deleted), the screen says there are no users.

## Screen 2: menu

Shows the name of the chosen user and three buttons:

- Back: returns to the list.
- Edit user: opens the edit screen.
- Go to notes: shows only the notice "Notes are coming soon". It does not change screen.

## Screen 3: edit

A form with name and email, filled with the current values of the user, and three buttons:

- Save: checks that the name is not empty (after trimming) and that the email has an `@`. If a check fails, the screen shows an error message and saves nothing. If both pass, it saves the user in `localStorage` and returns to the menu.
- Delete: asks with `confirm()`. If the person accepts, the user is removed from `localStorage` and the page returns to the list. If not, nothing changes.
- Cancel: returns to the menu without saving.

## Example

The person opens `index.html` and sees 3 users. Chooses one, presses Edit user, changes the name, presses Save and sees the menu with the new name. Reloads the page, chooses the same user and sees the new name. Deletes the user, reloads, and the user is not in the list.

## What goes wrong

- Empty name or an email without `@`: an error message is shown and nothing is saved.
- `localStorage` has text that is not valid JSON: the page falls back to the 3 example users.

## Out of scope

Calling `src/logic/`, a server, SQLite, real notes, creating users, passwords, and any change to `package.json` or to `pnpm format`.
