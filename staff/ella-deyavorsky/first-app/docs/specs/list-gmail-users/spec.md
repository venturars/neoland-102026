Issue: #1032

# A list of users with Gmail emails

As someone who uses the app, I want to see every user whose email contains `@gmail`, to find quickly the people who use a Gmail account.

It is one more way to list users, next to the list of all users. It does not replace the list of all users and does not change it.

## Who uses it and who has access

Anyone who uses the app on this computer, from these clients: the terminal, the notebooks, the HTTP client, the program of the Chrome extension, the Nest client, the web page, the desktop window and the VS Code extension. There is no sign-in.

The database program must be running.

## What it offers

One action: list the users whose email contains `@gmail`. Nothing goes in.

- The email matches when it contains the text `@gmail` anywhere. `ada@gmail.com`, `ada@gmail.co.uk` and `eve@gmailer.com` all match. `bob@example.com` and `gmail@example.com` do not, because the `@` comes before `gmail`.
- Capital letters do not matter.
- The users come in the same order as the list of all users, oldest id first.
- If no user matches, the list is empty. That is not an error.
- Each user has what the app already returns: `id`, `name`, `email`, `createdAt` and `updatedAt`.

In the clients that use HTTP, it is a new route that answers like the list of all users:

| Action | Route | What goes in | Success |
|---|---|---|---|
| List Gmail users | `GET /users/gmail` | nothing | 200 and the list, empty if there are none |

The route is the same in the HTTP client, the program of the Chrome extension and the Nest client.

In the web page and the desktop window, the list screen gets a way to show only the Gmail users, and a way to go back to all of them. In the VS Code extension, the view gets a button that shows only the Gmail users in its list; the button that reloads the list brings back all of them. In the notebooks, there is one more notebook that shows the Gmail users in a table.

## Example

The database has Ada (`ada@gmail.com`), Bob (`bob@example.com`) and Eve (`eve@gmailer.com`).

1. The person asks for the Gmail users. They get Ada and Eve, in that order, and not Bob.
2. They ask for the list of all users. They still get the three.
3. They delete Ada and Eve and ask for the Gmail users again. They get an empty list.

## What goes wrong

| What happens | Status | Sentence |
|---|---|---|
| The database program fails or is not running | 500 | The database failed. |
| Anything unexpected | 500 | The database failed. The real error is written in the terminal. |

The status is for the HTTP clients, and the body is `{ "error": "<sentence>" }`. Where there is no HTTP, the action throws the sentence. There is no new sentence.

## How the code is written

The rules of the app stay in one place, as for every other action. Each client calls that place and does not repeat the rule. Nothing about the rule is copied into a client.

## What does not change

- The list of all users, and every other action.
- The users table.
- The errors of the app.
