Issue: #934

# A Chrome extension for the users

A person can use the users of the app from a small window in Chrome, without the terminal, the notebooks, the web page or a tool such as `curl`. It is one more way in, independent from the others. It adds no rule of its own: what is valid, what is repeated and what is missing are decided by the same rules as every other client.

It lets a person create, list, view, update and delete a user.

## How it is connected

The extension has its own program, started by hand, on its own port: `3002`. It listens only on this computer. The chain is:

popup → the extension's own program (3002) → the rules of the app → the database program (3000)

- The extension only talks to its own program. It never talks to the database program directly.
- The database program keeps `3000` and keeps working as before. The port `3001` is not used or changed.
- The database program must be running, and so must the extension's program.

## What a person sees

The popup is one screen. It does not change screens.

- **The list.** It is always visible. It shows every user, or says there are none.
- **The form.** It has a name and an email. At the start it is empty and creates a user.
- **Choosing a user.** The person clicks a user in the list. The form loads that user, and shows Save and Delete. Save changes the user. Delete removes the user, but first asks the person to type the name of the user to confirm. The name must be written exactly, with the same capital and small letters. If it is not the same, nothing is deleted.
- **Going back to a new user.** The person can leave the loaded user and get the empty form again.

After each action the list shows the real users again.

All texts of the popup are in Spanish, except the error sentences of the app, which are shown in English as the app writes them. The code is in English.

## What the program of the extension offers

Five operations, over JSON: create a user with a name and an email, list the users, view one user by its id, change the name, the email or both of one user by its id, and delete one user by its id. A user has `id`, `name`, `email`, `createdAt` and `updatedAt`, as everywhere else in the app.

## Example

The person starts the database program and the program of the extension, and loads the extension in Chrome. They open the popup and see the list. They write "Ady" and `ady@example.com` and create the user; Ady appears in the list. They click Ady, change the name to "Ada" and save; the list shows Ada. They click Ada and delete, and type "Ada" to confirm; the list no longer shows her.

## What goes wrong

- The name is missing, the email is not valid, or the email already belongs to another user: the popup shows the sentence of the rule that failed, and nothing is saved.
- The user was already deleted: the popup shows that no user was found.
- The database program cannot be reached or fails: the popup shows that the database failed.
- **The program of the extension is not running:** the popup shows a new sentence, "The extension server is not running." It is added to the list of errors of the app.

## Out of scope

Passwords and any kind of sign-in, counting users by gender, finding a user by email, new rules or changes to the existing ones, changes to any other part of the app, publishing the extension in the Chrome Web Store, other browsers, access from other computers, and tests.
