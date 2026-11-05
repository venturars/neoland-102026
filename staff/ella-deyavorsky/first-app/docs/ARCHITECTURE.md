# Architecture

Each layer has one job. The files of each layer are listed in [TREE.md](TREE.md). The layers `logic/`, `queries/`, `db/` and `clients/` are folders inside `src/`.

## Layers

- `logic/` decides if an action is allowed. Its functions are async. It does not contain SQL. It calls the functions exported by `src/queries/users.js`. It never reads a `.sql` file.
- `queries/` asks the database program for data with `fetch`. It does not decide if a name or an email is valid, and it imports nothing from Node, so it also runs in a browser. The SQL text lives in `src/db/queries/`.
- `db/` is the database program. It opens the database, stores it, reads the SQL files and answers the queries over HTTP. It also serves the files of the web client and of the Electron client (`/electron/`).
- `clients/` runs the logic by hand. A client imports a function from `logic/` and prints the result, or answers it over HTTP. It has no rules. The web client does it too, as a browser module. The Electron client does the same, also as a browser module. The popup of the Chrome extension is the exception: it only calls its own program over HTTP. In the VS Code extension, the extension host imports `logic/`, and its webview only talks to the extension host.
- `scripts/` holds the helper that starts the notebooks.
- `agents/` holds the git workflow: an orchestrator and one subagent per moment. It has no rules of the app.
- `skills/` holds one skill per git or GitHub step. The subagents call them.
- `tools/` holds the shell scripts that the skills run from the root of the repository.
- `templates/` holds the body of the issue and the body of the pull request.
- `MCPS/` holds the address of the GitHub MCP server that the skills use, and the address of the Socket MCP server that checks Node packages.
- `docs/` explains the app.

The rules in `logic/` stay even if the database changes, or if a notebook or a web page is added later. The queries and the clients can be replaced. The logic cannot.

## Files

### first-app/

- `eslint.config.js` applies ESLint's recommended rules to the JavaScript and ignores `.venv`, `node_modules` and `dist`. It reads `src/clients/nest/` with the Babel parser, so ESLint understands `@`.
- `babel.config.json` turns on the decorators plugin, in `legacy` mode. `pnpm nest` reads it when it builds `src/` into `dist/`.

### src/logic/

One file per action. Each file exports one function. The order inside the function is in [CONSTITUTIONS.md](CONSTITUTIONS.md).

- `create-user.js` creates a user from a name and an email.
- `list-users.js` returns all users.
- `list-gmail-users.js` returns the users whose email contains `@gmail`.
- `find-user-by-email.js` returns the user with an email.
- `find-user-by-id.js` returns the user with an id.
- `update-user.js` changes the name, the email, or both of a user.
- `delete-user.js` removes a user.
- `count-users-by-gender.js` returns how many users are male, female, or undefined, using the classifier.

### src/queries/

- `users.js` exports one function per query. Each one sends a `POST` to the database program with `fetch`. It has no connection, no `.sql` path and no SQL string. The database program creates the table when it starts.

The `.sql` files are in `src/db/queries/`. The file names and the functions are in [DATABASE.md](DATABASE.md).

A new query is a new `.sql` file in `src/db/queries/` and a new function in `src/queries/users.js`.

### src/db/

- `connection.js` is the only file that opens the database. No other file creates a second connection.
- `server.js` is the database program, started with `pnpm start`. It imports the connection, reads the files of `queries/`, answers `POST /queries/<name>` on `http://localhost:3000` and serves the `.html`, `.css` and `.js` files of `clients/web/`, `clients/electron/` (at `/electron/`), `logic/` and `src/queries/`. It never serves `db/`.
- `queries/` holds the `.sql` files, one statement per file, such as `find-all.sql` and `find-gmail.sql`.
- `users.sqlite` stores the users.

### src/clients/

- `terminal/` has one `.txt` file per feature, named like its logic file. You paste it into the terminal while `first-app` is the current folder. `create-users-table.txt` calls `createUsersTable()` and lists the users.
- `jupyter/` has one notebook per feature, plus `prepare-database.ipynb`, `00-welcome-and-index.ipynb` and a `README.md`. They open in the browser with `scripts/jupyter.sh`.
- `api/` has `server.js`: an Express app started with `pnpm api` that listens on `http://127.0.0.1:3001`. Each route imports one function of `logic/` and turns its result or its error sentence into an HTTP answer. It has five routes for the users, plus `GET /users/gmail`. It has no rules; it only checks that the body has the right shape. The database program must be running. `bruno/` holds a Bruno collection to try the routes by hand: a guide, an environment with the address and the requests for the users, the errors and the stopped database. Bruno is an outside tool, and `pnpm` does not run the collection.
- `node-http/` is the `node:http` client: `app.js` started with `pnpm node-http`, which listens on `http://127.0.0.1:3004`. It uses `createServer` from `node:http`, with no framework. Each route imports one function of `logic/` and turns its result or its error sentence into an HTTP answer, with the same five routes as `api/` (no `GET /users/gmail`). It has no rules; it only checks that the body has the right shape. The folder also holds five notebooks, one for each route, that call `http://127.0.0.1:3004` and draw the answer with `cli-table3`. They open in the browser with `pnpm jupyter-node-http`. The database program must be running.
- `chrome/` has the Chrome extension, in one folder that Chrome loads: `server.js`, a Fastify app started with `pnpm chrome` that listens on `http://127.0.0.1:3002`, and the popup (`manifest.json`, `popup.html`, `popup.css`, `popup.js`). Each route of `server.js` imports one function of `logic/` and turns its result or its error sentence into an HTTP answer, with the same five routes as `api/`, plus `GET /users/gmail`. The popup talks only to this program, never to `logic/` or to the database program. The database program must be running.
- `nest/` is the Nest client: an app started with `pnpm nest` that listens on `http://127.0.0.1:3003`, with the same five routes as `api/`, plus `GET /users/gmail`. `pnpm nest` first builds all of `src/` with Babel into `dist/`, which is not in git, and then runs `dist/clients/nest/main.js`. `babel.config.json` turns on the `@` decorators for that build. `main.js` creates the app, reads the body as JSON only, sets the filter and listens. `app.module.js` is the module, with the controller. `users.controller.js` has the routes: each one checks the shape of the body and calls one function of `logic/`. `errors.filter.js` turns an error into an HTTP answer. It has no rules. The client also serves the page `/docs`, a Swagger UI that describes the routes and lets a person send requests to them. `main.js` mounts it with `@nestjs/swagger`, and the decorators of that package in `users.controller.js` describe each route; they do not check or change a request. The database program must be running. `src/clients/nest/` departs from `docs/STYLE.md` and `docs/ERRORS.md`: it uses the conventions of Nest (file names, a build step, classes, methods, `this`, decorators and error classes). It uses the same sentences of `docs/ERRORS.md` and adds none. The rest of the project follows both guides.
- `web/` has `index.html`, `style.css` and `app.js`: three screens (choose a user, menu, edit) over the real users. `app.js` is a browser module that imports `logic/`. It opens at `http://localhost:3000` while the database program runs. The `.txt` per feature of `terminal/` does not apply here; it is tested by opening the page.
- `electron/` is the desktop client: `main.js`, `index.html`, `app.js` and `styles.css`. It has its own page and does not use `web/`. `main.js` only opens a window on `http://127.0.0.1:3000/electron/index.html`; the database program serves that page. `app.js` is a browser module that imports `logic/`, as `web/` does, and shows the message of any error as it is. It does not start the database program: `pnpm start` must be running. It opens with `pnpm electron`. The `.txt` per feature of `terminal/` does not apply here; it is tested by opening the window.
- `vscode/` is the VS Code extension, opened with `pnpm vscode` in an Extension Development Host. It has no server and no port. `package.json` is the manifest of the extension, separate from the one of `first-app`. `extension.js` is the extension host: it imports `logic/`, asks before deleting and answers each message of the screen. `webview.js` is the screen: it draws what it receives and sends what the person types. The list has a "Solo Gmail" button next to "Recargar". It has no rules. `webview.css` is the style and `icon.svg` the icon of the sidebar. The database program must be running. The `.txt` per feature of `terminal/` does not apply here; it is tested by opening the view.

### scripts/

- `jupyter.sh` starts the notebooks of `src/clients/jupyter/`.
- `jupyter-node-http.sh` starts the notebooks of `src/clients/node-http/`, with the same `.venv`.

### agents/

- `git-workflow-agent.md` recognizes the moment and calls the subagent or the skill for it.
- `help-me-to-think.md` asks one question at a time until the task can be written down.
- `create-issue.md` creates the issue, with the title in English and the body in Spanish, assigned to the signed-in user.
- `create-branch.md` creates the branch `number-type-description`.
- `create-commit.md` makes a small commit with named files.
- `create-pr.md` opens the pull request against `staging` and leaves it in draft, without linking the issue.
- `launch-push.md` publishes `HEAD` to `origin` and sets the upstream.

### skills/

One folder per skill, each with a `SKILL.md`. A skill that runs a script names it from the root of the repository: `staff/ella-deyavorsky/first-app/tools/<script>.sh`.

- `grill-with-docs/` interviews when the change lives in this project.
- `grill-me/` interviews when the repository has no answer.
- `create-issue/` writes the task down on GitHub.
- `assign-author/` assigns the issue or the pull request to the signed-in user.
- `check-status/` says the branch, the uncommitted changes and the remote.
- `pull-changes/` moves `staging` forward with a fast-forward.
- `create-branch-from-staging/` opens the branch from `staging`.
- `create-branch/` opens the branch from a base that is not `staging`.
- `create-empty-commit/` makes the empty commit `chore: open #N`.
- `commit-changes/` saves a piece with named files.
- `launch-push/` pushes the current branch and sets the upstream.
- `create-pr-base-staging/` opens the pull request with base `staging`, in draft and assigned to the signed-in user, in one call.
- `create-draft/` turns a pull request that already exists into a draft.
- `link-pr-to-issue/` leaves `Closes #N` in the body and links the issue in Development. The issue closes when the pull request reaches the default branch, not when it is merged into `staging`.
- `assign-reviewers/` assigns the people who review the pull request and takes it out of draft.

### tools/

- `check-status.sh` prints the branch, the remote and the changes.
- `pull-changes.sh` moves `staging` forward with a fast-forward.
- `create-branch-from-staging.sh` creates the branch from `staging`.
- `create-branch.sh` creates the branch from another base.
- `create-empty-commit.sh` creates the empty opening commit.
- `commit-changes.sh` saves the named files.
- `launch-push.sh` pushes the branch and sets the upstream.
- `create-pr-base-staging.sh` opens the pull request with base `staging`, in draft and assigned to the signed-in user, with `gh pr create`.

### templates/

- `issues/<type>_issue.md` is the body of the issue, one per type: `feat`, `fix`, `refactor`, `docs`, `chore` and `test`. If the type has no template, the closest one is used.
- `pull-request/<type>-pull-request.md` is the body of the pull request, one per type with the same six types. Its "Issue" section ends with `Closes #` and is left empty when the draft is opened.

### MCPS/

- `github-mcp-server/mcp.txt` is the address of the GitHub MCP and the header that lets it write directly.
- `socket-mcp/mcp.txt` is the address of the Socket MCP, what each of its tools answers, and what each one cannot answer.

### docs/

- `ARCHITECTURE.md` is this file: the job of each layer and each file.
- `TREE.md` is the tree of the app.
- `CONSTITUTIONS.md` holds the shape of a `logic/` function and the SDD specs.
- `DATABASE.md` holds the table and the queries.
- `ERRORS.md` holds the list of errors.
- `STYLE.md` holds the conventions and the shape of each line.
- `specs/` holds one folder per feature, with `spec.md`, `plan.md` and `tasks.md`. A new `spec.md` opens with `Issue: #N`.
