Issue: #1109

# An HTTP client for the users written with node:http

A person can use the users of the app over HTTP with a client written with `node:http`, Node's own module, and no web framework. It does the same as the Express client in `src/clients/api/`: the same routes, the same answers and the same sentences of failure. It lets a person check that the CRUD of the users works without Express in the middle. It adds no rule of its own: what is valid, what is repeated and what is missing are decided by the same rules as every other client.

It runs as its own program, started by hand, on its own port: `3004`. The database program keeps `3000`, the Express client keeps `3001`, and both can run at the same time. It listens only on this computer. It needs the database program to be running.

Next to the client there are notebooks that call it, one for each action, so a person who does not program can try it from the browser and read what each action does.

## What a person can do

All requests and answers are JSON. The routes and the answers are the ones in `docs/specs/express-api/spec.md`.

- Create a user with a name and an email: `POST /users`. The answer is the new user.
- List the users: `GET /users`. The answer is the list, empty if there are none.
- Check one user by its id: `GET /users/:id`. The answer is that user.
- Change the name, the email, or both, of one user by its id: `PATCH /users/:id`. A field that is not sent stays as it is. The answer is the updated user.
- Delete one user by its id: `DELETE /users/:id`. The answer has no body.
- Open one notebook for each of those five actions, in that order, and run it. Each notebook shows, in this order: its title, what the action does, what happens in the database, which route it uses, notes (the values to change and the errors that can appear), the code block, and the result.
- When the answer has data, the result shows it in a table. When the answer is a failure, the result shows the sentence of the failure and no table.
- See each notebook work with the database program running, and with the database program stopped (the server error).
- Start the client with `pnpm node-http`, and the notebooks of this client with `pnpm jupyter-node-http`. `pnpm jupyter` keeps opening the notebooks of `src/clients/jupyter/`.

A user has `id`, `name`, `email`, `createdAt` and `updatedAt`, as in every other client.

## Example

The person starts the database program (`pnpm start`) and the client (`pnpm node-http`), then runs `pnpm jupyter-node-http`. They open "Create a user", run it and see the new "Ady" in a table. "List users" shows Ady. "Update a user" changes the name to "Ada". "Delete a user" removes her, and "Find a user by id" with her id shows "No user was found." and no table. They stop the database program and run "List users" again: it shows "The database failed." and no table.

## What goes wrong

The answer to a failure is a JSON body with the sentence of the rule that failed, and the status that the Express client uses for it.

- The name is missing, the email is not valid, there is nothing to update, or the request lacks a field it needs or has a field that is not text: the request is wrong (400).
- The body is not valid JSON: the request is wrong (400), with the sentence "The request is not valid.".
- No user has that id: not found (404).
- The email already belongs to another user: conflict (409).
- The database program cannot be reached or fails: server error (500).
- A route that does not exist, or a method that a route does not have: not found (404) with `{ "error": "The request is not valid." }`. (Decision 3 in `plan.md`.)
- The client is not running: the notebooks cannot connect, and their notes say to run `pnpm node-http`.
- The notebooks work on the real database, like the other notebooks. Creating, changing and deleting change real users. The notebooks that change data start with a value that does not exist, so pressing Run without changing it changes no one.

## Out of scope

Any change to the Express client, the Nest client or the rules of the app. New packages: only `node:http` is used. `GET /users/gmail`. Passwords and any kind of sign-in. Access from other computers. Automatic tests. Notebooks for the other clients.
