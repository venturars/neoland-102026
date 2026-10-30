# Architecture

Each layer has one job. The files of each layer are listed in [TREE.md](TREE.md).

## Layers

- `logic/` decides if an action is allowed. It does not contain SQL. It calls the functions exported by `queries/users.js`. It never reads a `.sql` file.
- `queries/` talks to the database. It does not decide if a name or an email is valid. The SQL text lives in `queries/queries/`.
- `db/` opens the database and stores it.
- `clients/` runs the logic by hand. A client imports a function from `logic/` and prints the result. It has no rules.
- `scripts/` holds the helper that starts the notebooks.
- `agents/` holds the git workflow: an orchestrator and one subagent per moment. It has no rules of the app.
- `skills/` holds one skill per git or GitHub step. The subagents call them.
- `tools/` holds the shell scripts that the skills run from the root of the repository.
- `templates/` holds the body of the issue and the body of the pull request.
- `MCPS/` holds the address of the GitHub MCP server that the skills use.
- `docs/` explains the app.

The rules in `logic/` stay even if the database changes, or if a notebook or a web page is added later. The queries and the clients can be replaced. The logic cannot.

## Files

### first-app/

- `eslint.config.js` applies ESLint's recommended rules to the JavaScript and ignores `.venv` and `node_modules`.

### logic/

One file per action. Each file exports one function. The order inside the function is in [CONSTITUTIONS.md](CONSTITUTIONS.md).

- `create-user.js` creates a user from a name and an email.
- `list-users.js` returns all users.
- `find-user-by-email.js` returns the user with an email.
- `find-user-by-id.js` returns the user with an id.
- `update-user.js` changes the name, the email, or both of a user.
- `delete-user.js` removes a user.
- `count-users-by-gender.js` returns how many users are male, female, or undefined, using the classifier.

### queries/

- `users.js` reads each `.sql` file and exports one function per file. It uses the one connection from `db/connection.js`. It contains no SQL string. Importing it does not create the table.
- `queries/*.sql` holds one statement per file. The file names and the functions are in [DATABASE.md](DATABASE.md).

A new query is a new `.sql` file in `queries/queries/` and a new function in `queries/users.js`.

### db/

- `connection.js` is the only file that opens the database. No other file creates a second connection.
- `users.sqlite` stores the users.

### clients/

- `terminal/` has one `.txt` file per feature, named like its logic file. You paste it into the terminal while `first-app` is the current folder. `create-users-table.txt` prepares the table.
- `jupyter/` has one notebook per feature, plus `prepare-database.ipynb`, `00-welcome-and-index.ipynb` and a `README.md`. They open in the browser with `scripts/jupyter.sh`.

### scripts/

- `jupyter.sh` starts the notebooks.

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
- `create-pr-base-staging/` opens the pull request with base `staging`.
- `create-draft/` leaves the pull request in draft.
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

### templates/

- `issues/basic_issue.md` is the body of the issue: what has to be done and how to test it.
- `pull-request/basic-pull-request.md` is the body of the pull request. Its "Issue" section ends with `Closes #`.

### MCPS/

- `github-mcp-server/mcp.txt` is the address of the GitHub MCP and the header that lets it write directly.

### docs/

- `ARCHITECTURE.md` is this file: the job of each layer and each file.
- `TREE.md` is the tree of the app.
- `CONSTITUTIONS.md` holds the shape of a `logic/` function and the SDD specs.
- `DATABASE.md` holds the table and the queries.
- `ERRORS.md` holds the list of errors.
- `STYLE.md` holds the conventions and the shape of each line.
- `specs/` holds one folder per feature, with `spec.md`, `plan.md` and `tasks.md`. Each `spec.md` opens with `Issue: #N`.
