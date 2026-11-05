Issue: #991

# A Nest HTTP API for the users

As someone who tests the app, I want to create, list, view, update and delete users over HTTP, to use the same actions without opening a page.

It is one more HTTP API, built with Nest, next to the HTTP client and the program of the Chrome extension, and independent from them. It has no page of its own and no password.

It is not a new feature. The rules stay where they are. This client calls them and returns their result. It does not repeat them. It does not replace the HTTP client, the program of the Chrome extension or the database program.

## Who uses it and who has access

A person who tests the app, from the same computer, with a tool such as `curl`. It listens only on this computer. There is no sign-in. The plan fixes the port.

The database program must be running.

## What it offers

The same five actions, with the same routes and the same statuses as the HTTP client:

| Action | Route | What goes in | Success |
|---|---|---|---|
| Create | `POST /users` | name and email | 201 and the user |
| List | `GET /users` | nothing | 200 and the list, empty if there are none |
| View one | `GET /users/:id` | id | 200 and the user |
| Update | `PATCH /users/:id` | id, and name, email or both | 200 and the user |
| Delete | `DELETE /users/:id` | id | 204 and an empty body |

In an update, what is not sent keeps its saved value.

Any other route answers 404 with an empty body.

The output is the user the app already returns: `id`, `name`, `email`, `createdAt` and `updatedAt`.

## Example

The person starts the database program and this client, and works with `curl`:

1. They create Ada with `ada@example.com`. They get 201 with id 1, the name, the email and both dates.
2. The list shows Ada.
3. They ask for user 1 and see the same data.
4. They change the name to Ada Lovelace. They get 200, and the email is still `ada@example.com`.
5. They delete user 1. They get 204 with an empty body, and Ada is no longer in the list.

## What goes wrong

Each error uses a sentence that already exists in the list of errors of the app, in the body `{ "error": "<sentence>" }`, with the same status as the HTTP client. There is no new sentence.

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

## How the code is written

The code of this client uses the conventions of Nest: classes, methods, `this`, decorators and error classes. There is no TypeScript.

The two guides of style and errors stay the same for the rest of the project. The documentation gets a notice: this client departs from those two guides. The style of the other clients is not rewritten.

## Out of scope

Passwords, sign-in, permissions, counting users by gender, finding by name, finding by email, a new rule, a new message, a page of its own, TypeScript, and any change to the rules, the queries, the database program and the other clients.
