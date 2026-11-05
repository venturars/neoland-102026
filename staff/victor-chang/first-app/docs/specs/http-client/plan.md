# Plan — HTTP client

## Files

- Create: `clients/http/server.js`, the API: it reads each ask, calls `logic/`, and answers the status and JSON of the spec. No business rules.
- Touch: `package.json`, the script `"http": "node --no-warnings clients/http/server.js"`. No new dependency: the server is `node:http`, a Node built-in, so there is no Socket check.
- Touch: `eslint.config.js`, a block for `clients/http/**/*.js` with the Node globals the server uses, listed by hand (`console`, `process`, `URL`). No `globals` package.
- Touch: `docs/ERRORS.md`, the two client messages of the spec, printed by `clients/http/`.
- Touch: `docs/CONSTITUTION.md`, **Runtime**: `node:http` in the Node built-ins.
- Touch: `docs/ARCHITECTURE.md`, the new file and an **HTTP** section under **Clients**. `docs/TREE.md`, the new file. `AGENTS.md`, **Commands**: `pnpm http`. `docs/specs/README.md`.
- Not touched: `logic/`, `queries/`, `db/`, the other clients.

## Looks like

- `server.js` is a client like `clients/terminal/`: it imports `logic/` and passes on what `logic/` returns or throws. It does not catch to change a message.
- It opens the database the same way the terminal and Jupyter clients do: `logic/` imports `queries/users.js`, which imports `db/connection.js`. One process, one connection, as long as the server runs.

## How an ask is answered

1. `pnpm http` starts `createServer` from `node:http` and listens on `127.0.0.1`, port `3000`. When it listens, it prints `http://127.0.0.1:3000`.
2. The path is read with `new URL(request.url, ORIGIN).pathname`, so a query string is ignored. Only `/users` and `/users/<id>` are known; `/users/` and any other path answer `404` with no body.
3. The method picks the `logic/` function:

   | Method and path      | Calls                         | Status |
   | -------------------- | ----------------------------- | ------ |
   | `POST /users`        | `createUser(name, email)`     | `201`  |
   | `GET /users`         | `listUsers()`                 | `200`  |
   | `GET /users/<id>`    | `getUser(id)`                 | `200`  |
   | `PUT /users/<id>`    | `updateUser(id, name, email)` | `200`  |
   | `DELETE /users/<id>` | `deleteUser(id)`              | `204`  |

   Any other method on a known path answers `404` with no body, as the spec says.

4. **The id.** If the text after `/users/` is only digits, it is turned into a number with `Number(text)`; otherwise it is passed as the text it is, and `logic/` answers `User not found`, because no `id` equals a text. The number matters: `node:sqlite` finds user `1` with `"1"` too, but `updateUser` compares `owner.id !== id`, so a text id would answer `Email is already used` when a user keeps their own email.
5. **The body**, only for `POST` and `PUT`. It is read as UTF-8 text and parsed with `JSON.parse`. If that fails, an empty body included, the answer is `400` and `Request body is not valid JSON.` `name` and `email` are taken from the parsed value; if it is not an object (`null`, a number, a list), both are `undefined`, and `logic/` answers `Name is empty`.
6. **The answer.** A body is `JSON.stringify(value)` with `Content-Type: application/json; charset=utf-8`. `204` and `404` without a body send no `Content-Type`.
7. **A failure.** The status comes from the `code` of the error `logic/` threw, and the body is `{ "message": error.message }`:

   | `code`       | Status |
   | ------------ | ------ |
   | `VALIDATION` | `400`  |
   | `DUPLICATE`  | `409`  |
   | `NOT_FOUND`  | `404`  |
   | `SYSTEM`     | `500`  |

   An error without one of these codes is a bug in the server, not a failure of the spec: it answers `500` with no body and is printed with `console.error`, so the server keeps running.

8. **Port taken.** On the server's `error` event with `code` `EADDRINUSE`, it prints `Port 3000 is already in use.` with `console.error` and sets `process.exitCode = 1`. Any other `error` is thrown.

## Signature

None. `server.js` exports nothing. Its constants are `HOST` (`127.0.0.1`), `PORT` (`3000`) and `ORIGIN` (`http://127.0.0.1:3000`).

## SQL

None.

## Errors

| Spec failure            | Message                                             | Status, shown by                     |
| ----------------------- | --------------------------------------------------- | ------------------------------------ |
| empty or missing name   | `Name is empty`                                     | `400`, from `logic/`                 |
| invalid or missing mail | `Email is invalid`                                  | `400`, from `logic/`                 |
| email used              | `Email is already used`                             | `409`, from `logic/`                 |
| no user with that id    | `User not found`                                    | `404`, from `logic/`                 |
| body is not JSON        | `Request body is not valid JSON.`                   | `400`, from `clients/http/`          |
| unknown path or method  | none                                                | `404`, no body                       |
| SQLite fails            | the `Could not …` of that feature, as `logic/` says | `500`, from `logic/`                 |
| port 3000 taken         | `Port 3000 is already in use.`                      | stderr of `pnpm http`, exit code `1` |

## Open questions

None.
