Issue: #891

# An HTTP client for the users

A person can use the users of the app over HTTP, with a tool such as `curl` or Postman, without opening the terminal files or the web page. It is one more way in, next to the terminal, the notebooks and the web page. It adds no rule of its own: what is valid, what is repeated and what is missing are decided by the same rules as every other client.

It runs as its own program, started by hand, on its own port: `3001`. The database program keeps `3000` and keeps working as before. It listens only on this computer. It needs the database program to be running.

## What a person can do

All requests and answers are JSON.

- Create a user with a name and an email. The answer is the new user.
- List the users. The answer is the list, empty if there are none.
- Check one user by its id. The answer is that user.
- Change the name, the email, or both, of one user by its id. A field that is not sent stays as it is. The answer is the updated user.
- Delete one user by its id. The answer has no body.

A user has `id`, `name`, `email`, `createdAt` and `updatedAt`, as in every other client.

## Example

The person starts the database program and the HTTP client. They create "Ady" with `ady@example.com` and get the user with its id. They list and see Ady. They change the name to "Ada" and get the updated user. They delete the user, and checking it again says it is not found.

## What goes wrong

The answer to a failure is a JSON body with the sentence of the rule that failed, and a status that says what kind of failure it is.

- The name is missing, the email is not valid, there is nothing to update, or the request lacks a field it needs: the request is wrong (400).
- No user has that id: not found (404).
- The email already belongs to another user: conflict (409).
- The database program cannot be reached or fails: server error (500).
- The body is not valid JSON: the request is wrong (400).

## Out of scope

Passwords and any kind of sign-in, counting users by gender, new rules or changes to the existing ones, finding a user by email, replacing or changing the SQL database program, access from other computers, and tests.
