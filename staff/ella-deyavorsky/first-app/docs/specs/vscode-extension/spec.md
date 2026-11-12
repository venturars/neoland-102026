Issue: #997

# A VS Code extension for the users

A person who tests the app can create, list, view, update and delete users from VS Code, without leaving the editor. It is one more way in, independent from the others. It adds no rule of its own: what is valid, what is repeated and what is missing are decided by the same rules as every other client.

## Who uses it

A person who tests the app on their own computer. There is no password and no sign-in. Anyone who can open the extension can see and change every user.

The extension trusts whatever answers on port `3000` of this computer, as the desktop client does. It does not check who is behind the port.

## How it is opened

- The database program stays where it is, on port `3000`, and must be running (`pnpm start`).
- With `first-app` as the current folder, `pnpm vscode` opens a VS Code Extension Development Host with the extension loaded. The command needs VS Code and its `code` command on the computer.
- The extension has no server and no new port. It does not start or stop the database program.

## What a person sees

One view in the sidebar of VS Code. It does not change screens. It has:

- **The list.** Every user with the id, the name and the email, or a text that says there are none. A button loads it again.
- **Create.** A name and an email.
- **View.** An id.
- **Update.** An id, a name and an email. A value not entered keeps the saved one. No user is loaded in this form, so an empty box means "not entered".
- **Delete.** An id. It first asks in a native dialog of VS Code, and only deletes if the person accepts. If they cancel, nothing happens.
- **The result.** The user that an action returned.
- **The error.** The sentence of the last failure.

The list loads when the view opens, and again after each create, update and delete that works.

If the person leaves the view and comes back, the list loads again and what they had typed is gone.

Labels and buttons are in Spanish. The error sentences are in English, as the app writes them. The code is in English.

## Input and output

| Action | Input | Output |
|---|---|---|
| Create | name and email | the user |
| List | nothing | the list of users, empty if there are none |
| View | the id | the user |
| Update | the id, and the name, the email or both | the user |
| Delete | the id | no user |

A user has `id`, `name`, `email`, `createdAt` and `updatedAt`, as everywhere else in the app.

## Example

The person runs `pnpm start` and `pnpm vscode`. In the new window they open the view from the sidebar and see the list. They create Ady with `ady@example.com`; the result shows Ady and she appears in the list. They write her id in Update, write "Ada" as the name and leave the email empty; the result shows Ada with the same email and a new update date. They write her id in View and see the same user. They write her id in Delete and accept the dialog; she is gone from the list.

## What goes wrong

The view shows the sentence of the list of errors of the app as it is written, and the action is not saved. If the action was saved and only the list after it fails, the view shows the result and the sentence.

- The name is only spaces, or empty when creating: "The name is missing." An empty name in Update is not an error: it keeps the saved name.
- The email is not valid: "The email is not valid."
- Another user has the email: "This email is already used."
- No user has the id, or the id box is empty or is not a number: "No user was found."
- Update with the name and the email empty: "There is nothing to update."
- The database program is not running or fails: "The database failed."
- Anything else that goes wrong, such as another program on the port answering something the app does not expect: "The database failed."

No new sentence is needed.

## Out of scope

The installer, publishing in the Marketplace, a new Node package, a new API, another port, passwords, sign-in, permissions, counting users by gender, finding by name, finding by email, a new rule, a new message, and any change to the logic, the queries, the database program and the terminal, Jupyter, browser, HTTP, desktop and Chrome clients.
