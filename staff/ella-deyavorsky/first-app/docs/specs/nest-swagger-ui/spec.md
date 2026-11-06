Issue: #1068

# A Swagger UI page for the Nest client

As someone who tests the app, I want a page that lists the routes of the Nest client and lets me try each one from the browser, to use the API without writing `curl` commands.

It is a page of documentation inside the Nest client. It describes the routes the client already has and sends the requests to those same routes. It adds no new action and it does not replace the Nest client, the HTTP client or any other client.

## Who uses it and who has access

A person who tests the app, from the same computer, with a browser. The page is served by the Nest client, so it listens only on this computer, on the same port as the client. There is no sign-in. The plan fixes the address of the page.

The database program and the Nest client must be running.

## What it offers

A page that shows every route of the Nest client, with the same actions, routes and statuses as the client already has:

| Action | Route | What goes in | Success |
|---|---|---|---|
| Create | `POST /users` | name and email | 201 and the user |
| List | `GET /users` | nothing | 200 and the list, empty if there are none |
| List Gmail users | `GET /users/gmail` | nothing | 200 and the list, empty if there are none |
| View one | `GET /users/:id` | id | 200 and the user |
| Update | `PATCH /users/:id` | id, and name, email or both | 200 and the user |
| Delete | `DELETE /users/:id` | id | 204 and an empty body |

For each route the page shows:

- What the route does, in one short line.
- What goes in: for create and update, the fields `name` and `email` (both text; create needs both, update needs at least one), and for the routes with an id, the id.
- The statuses it can answer and the body of each: the user (`id`, `name`, `email`, `createdAt`, `updatedAt`), the list of users, an empty body, or `{ "error": "<sentence>" }`.
- A way to fill in the values, send the request to the Nest client and see the real answer (status and body) on the same page.

The routes are grouped under one heading, "users". The page has a title and a short description of the app.

The page does not change what the routes do. A request sent from the page behaves exactly like the same request sent with `curl`, including the same errors.

## Example

The person starts the database program and the Nest client, and opens the page in the browser:

1. They see the six routes under "users".
2. They open "Create", fill in `Ada` and `ada@gmail.com` and send it. The page shows 201 and Ada with id 1, both dates included.
3. They open "List" and send it. The page shows Ada.
4. They open "List Gmail users" and send it. The page shows Ada.
5. They open "Update", write id 1 and the name `Ada Lovelace`, and send it. The page shows 200, and the email is still `ada@gmail.com`.
6. They open "Delete", write id 1 and send it. The page shows 204 with an empty body, and "List" now shows an empty list.

## What goes wrong

The page adds no error. A request sent from it gets the answer the route gives. Each error uses a sentence that already exists in the list of errors of the app, in the body `{ "error": "<sentence>" }`, with the same status as the Nest client.

| What happens | Status | Sentence |
|---|---|---|
| The name is empty or only spaces | 400 | The name is missing. |
| The email is not valid | 400 | The email is not valid. |
| An update sends neither a name nor an email | 400 | There is nothing to update. |
| There is no body, the body is broken, or a name or email is not text | 400 | The request is not valid. |
| No user has this id | 404 | No user was found. |
| Another user already has this email | 409 | This email is already used. |
| The database program fails or is not running | 500 | The database failed. |
| Anything unexpected | 500 | The database failed. The real error is written in the terminal. |

The page shows these statuses and sentences for the routes that can answer them. If the Nest client is not running, the page does not load, and that is not an error of the app.

## How the code is written

The code of the Nest client keeps the conventions of Nest that its spec already sets. The rules of the app stay in one place and the page does not repeat them. Nothing about a rule is copied into the page.

The page is built from what the routes declare, so it cannot describe a route that does not exist. When a route is added or changed, its description is changed with it.

## Out of scope

Sign-in and permissions on the page, a page for the other clients, a file of the API to download or share, generating code for other languages, a new action, a new rule, a new message, TypeScript, tests, and any change to the rules, the queries, the database program and the other clients.
