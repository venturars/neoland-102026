# Tasks — HTTP client

1. [ ] In `docs/ERRORS.md`, add the two client messages of the spec, printed by `clients/http/`.
2. [ ] In `docs/CONSTITUTION.md`, **Runtime**, add `node:http` to the Node built-ins.
3. [ ] Create `clients/http/server.js` that listens on `127.0.0.1:3000` and answers `404` with no body to every ask. Add the `http` script to `package.json` and run `pnpm http`.
       It prints `http://127.0.0.1:3000`; `curl -i http://127.0.0.1:3000/users` answers `404`.
4. [ ] Run `pnpm http` in a second terminal while the first one runs.
       It prints `Port 3000 is already in use.` and `echo $?` prints `1`.
5. [ ] In `server.js`, answer `GET /users` and `GET /users/<id>`, with the id rule and the status from the error `code`.
       `curl` lists the users; an existing id answers `200`; `999` and `abc` answer `404` and `User not found`.
6. [ ] In `server.js`, read the JSON body and answer `POST /users`.
       A new user answers `201`; the same email `409`; no name `400` `Name is empty`; `{` and an empty body `400` `Request body is not valid JSON.`
7. [ ] In `server.js`, answer `PUT /users/<id>` and `DELETE /users/<id>`.
       Keeping the user's own email answers `200`; another user's email `409`; delete answers `204`, then `GET` that id `404`.
8. [ ] Check the unknown asks: `GET /users/`, `GET /other` and `PATCH /users/1`.
       Each answers `404` with no body.
9. [ ] With the server running, paste `clients/terminal/list-users.txt` in Git Bash.
       It shows the user created with `curl`. Delete the practice users with `curl`.
10. [ ] In `eslint.config.js`, add the block for `clients/http/**/*.js` with its Node globals. Run `pnpm format:check` and `pnpm lint`.
        Both pass.
11. [ ] Add `clients/http/server.js` to `docs/TREE.md` and `docs/ARCHITECTURE.md`, with an **HTTP** section under **Clients**, and `pnpm http` to `AGENTS.md`.
12. [ ] In `docs/specs/README.md`, set `http-client` to `done`.
