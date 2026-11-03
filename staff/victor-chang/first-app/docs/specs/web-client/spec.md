# Web client

## What

A web page to manage the users, which looks and feels like the Contacts app of an iPhone. It lists, searches, shows, adds, edits and deletes users.

The page works on the app's own database file, the same one the terminal and Jupyter clients use. It opens that file in the browser and saves every change back to it. There is no server with routes and no API call: one app command only hands the page's files to the browser, on this computer.

- **List**: a large `Users` title, a search field, and the users ordered by name in sections A to Z, with a letter index on the side. A name that does not start with a letter goes under `#`. Each row shows a circle with the user's initials and the name.
- **Search**: while typing, the list shows only the users whose name contains the text. An empty field shows them all again.
- **User**: tapping a row opens the user's card: the circle, the name, the email, and when the user was created and last updated. An `Edit` button opens the edit sheet.
- **New user**: a `+` button opens a sheet with `Cancel` and `Done`, and the name and email fields.
- **Edit**: the same sheet, filled in, with a red `Delete User` button at the bottom. Deleting asks first, with `Delete User` and `Cancel`.
- Light and dark mode follow the computer. The texts are in English. The page uses no Apple image, icon or logo.

The first time, the page shows an `Open users.sqlite` button to choose the file. The next times, it remembers the file and only asks the browser for permission.

Before each step the page reads the file again, so a change made from the terminal or Jupyter is not lost; after each change it saves it.

## Who

Whoever manages the user list (an admin), from Chrome or Edge on their computer.

## Input

The database file, chosen once. Then the name and email typed in the sheet, and the text typed in the search field.

## Output

The page and its screens, as described above. Every change is in the database file at once.

Example: `Ada` `ada@x.com` and `María` `maria@x.com` are saved. The list shows `A` with `Ada` and `M` with `María`. Typing `ar` leaves only `María`. Adding `Adam` `adam@x.com` puts the new user under `A`, after `Ada`, and the terminal client that lists the users shows it too.

## Failures

Each message is shown as it is. The name and email messages show in red under their field, inside the sheet; the others show in a box with an `OK` button.

- An empty name → `Name is empty`.
- An email that is not valid → `Email is invalid`.
- An email another user has → `Email is already used`.
- The user was deleted meanwhile, for example from the terminal → `User not found`.
- The database file cannot be read → `Could not read users.sqlite.`
- The database file cannot be saved → `Could not save users.sqlite.`
- SQLite fails while reading or changing the users → the `Could not …` message of that step.
- A browser that cannot open files this way → `This browser cannot open the database. Use Chrome or Edge.`
- Permission to the file is refused → `Access to users.sqlite was denied.`
- No Python 3 to start the page → `Python 3 is required to start the web client.`

## Out of scope

- Counting the users by gender, and finding a user by email.
- Phones, photos, or splitting first and last name.
- Ignoring accents in the search.
- Safari and Firefox, phones and tablets.
- Several people using the page at the same time.
