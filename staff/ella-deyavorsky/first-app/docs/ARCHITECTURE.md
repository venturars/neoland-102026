# Architecture

Each layer has one job. The files of each layer are listed in [TREE.md](TREE.md).

## Layers

- `logic/` decides if an action is allowed. It does not contain SQL. It calls the functions exported by `queries/users.js`. It never reads a `.sql` file.
- `queries/` talks to the database. It does not decide if a name or an email is valid. The SQL text lives in `queries/queries/`.
- `db/` opens the database and stores it.
- `clients/` runs the logic by hand. A client imports a function from `logic/` and prints the result. It has no rules.
- `scripts/` holds the helper that starts the notebooks.
- `docs/` explains the app.

The rules in `logic/` stay even if the database changes, or if a notebook or a web page is added later. The queries and the clients can be replaced. The logic cannot.

## Files

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

### docs/

- `ARCHITECTURE.md` is this file: the job of each layer and each file.
- `TREE.md` is the tree of the app.
- `CONSTITUTIONS.md` holds the shape of a `logic/` function and the SDD specs.
- `DATABASE.md` holds the table and the queries.
- `ERRORS.md` holds the list of errors.
- `STYLE.md` holds the conventions and the shape of each line.
- `specs/` holds one folder per feature, with `spec.md`, `plan.md` and `tasks.md`.
