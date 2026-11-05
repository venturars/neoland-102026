# HTTP client

## What

An HTTP API to manage the users: create, list, get one, update and delete. It answers in JSON, on `http://127.0.0.1:3000`, only on this computer. One app command starts it and leaves it running until it is stopped.

It works on the app's own database file, the same one the terminal, Jupyter and web clients use. A change made through the API is seen at once by the terminal and Jupyter clients, and the other way round.

| Ask                  | Sends              | Answer                               |
| -------------------- | ------------------ | ------------------------------------ |
| `POST /users`        | the name and email | `201` and the new user               |
| `GET /users`         | nothing            | `200` and the list of users          |
| `GET /users/<id>`    | nothing            | `200` and that user                  |
| `PUT /users/<id>`    | the name and email | `200` and the user with the new data |
| `DELETE /users/<id>` | nothing            | `204` and nothing                    |

A user is answered with its number, name, email, and when it was created and last updated. The list is in the same order the other clients show it.

## Who

Whoever manages the user list (an admin) from a tool that speaks HTTP, such as `curl` or Postman, or from another client of the app that talks to it over HTTP.

## Input

The address and method of each ask, as in the table. The number of the user goes in the address. To create or update, the body is JSON with `name` and `email`; an update always sends both.

## Output

The status and JSON body from the table. A failure answers its status and `{ "message": "<message>" }`.

Example: `POST /users` with `{ "name": "Ada", "email": "Ada@X.com" }` → `201` and `{ "id": 1, "name": "Ada", "email": "ada@x.com", "createdAt": "2026-11-05 10:00:00", "updatedAt": "2026-11-05 10:00:00" }`. `GET /users` now shows Ada, and so does the terminal client that lists the users. `PUT /users/1` with `{ "name": "Ada Lovelace", "email": "ada@x.com" }` → `200` and Ada with the new name and a new `updatedAt`. `DELETE /users/1` → `204`; `GET /users/1` → `404` and `{ "message": "User not found" }`.

## Failures

- An empty or missing name → `400`, `Name is empty`.
- An email that is not valid, or missing → `400`, `Email is invalid`.
- An email another user has → `409`, `Email is already used`.
- No user with that number, or a number that is not a whole number → `404`, `User not found`.
- A body that is not valid JSON → `400`, `Request body is not valid JSON.`
- An address or method not in the table → `404` and no body.
- SQLite fails → `500` and the `Could not …` message of that step: `Could not create the user`, `Could not list the users`, `Could not find the user`, `Could not update the user` or `Could not delete the user`.
- Another program already uses port 3000 → the API does not start and prints `Port 3000 is already in use.`

## Out of scope

- Login, passwords or keys: anyone on this computer can call it.
- Being reached from another computer.
- Calls from a web page served from another address (CORS).
- Changing only the name or only the email in an update.
- Searching, finding by name or by email, and counting the users by gender.
- Several people changing the users at the same time, and using the web client at the same moment.
- A page or screen of its own: it only answers JSON.
