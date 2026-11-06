Issue: #1087

# A Bruno collection for the users HTTP client

A person can try the HTTP client of the users with Bruno, a free desktop tool for sending HTTP requests, without writing each request by hand. The collection is a set of ready requests that cover the same behavior as the spec of the HTTP client (`docs/specs/express-api/spec.md`). It adds no behavior to the app: it only sends requests and shows whether the answers are the ones the spec promises.

Bruno is an outside tool. The person installs it on their computer. The app does not depend on it, and no package is added to the project.

## Who uses it and what they need

A student of the course, on their own computer. They need Bruno installed, the database program running and the HTTP client running. The collection talks only to the HTTP client, on its port `3001`, on this computer.

## What a person can do

- Open the collection in Bruno and pick its environment. The address of the HTTP client is written once there, not in every request.
- Read a short guide that says what to install, what to start and in which order, how to open the collection and how to run it.
- Send the requests that use the users: create, list, check one by its id, change and delete. Each request checks the status and the body that the spec of the HTTP client promises.
- Send the requests that fail: a missing name, an email that is not valid, nothing to update, a body that is not valid JSON, a user that does not exist and an email that is already used. Each one checks the status and the sentence of the failure.
- Send one request with the database program stopped, and see the server error.
- Run the whole collection in order and see every check pass.

## Example

The person starts the database program and the HTTP client, opens the collection in Bruno and runs it. It creates "Ady", lists the users, checks Ady, changes the name to "Ada" and then runs the failures: they all answer as the spec says. It deletes Ady, and checking her again says she is not found. At the end the guide tells the person to stop the database program and send the last request, which answers with the server error.

## What goes wrong

- The HTTP client is not running: Bruno cannot connect, and the guide says to start it.
- The database program is not running: the requests answer with the server error. This is the expected result of the last request, and a problem for all the others.
- The collection is run twice without the delete request in between, or after an earlier run was cut short: the email of the first user is already used, so the create request answers with a conflict. The guide says how to clean up.

## Out of scope

Any change to the HTTP client, to the Nest client or to the rules of the app. Requests for the Nest client. Automatic tests and any way to run the collection from `pnpm` or from a pipeline. Adding Bruno or its command line tool as a package. Passwords and sign-in.
