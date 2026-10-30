# Architecture

## Storage and business operations

- `db/connection.js` owns the single database connection. Its file location and
  initialization behavior are defined in [DATABASE.md](DATABASE.md).
- `queries/queries/` contains one SQL file per query. `queries/users.js` loads and
  executes those statements; it performs no business validation or printing.
  [DATABASE.md](DATABASE.md) defines each query's parameters and return value.
- `logic/` contains the public business operations. It validates input, checks
  business conditions, calls queries, and constructs ordinary returned data.
  It does not manage the connection or print results. The
  [constitution](CONSTITUTIONS.md#public-business-operations) defines the contracts;
  [ERRORS.md](ERRORS.md) defines their failures.

| Business file | Responsibility |
| --- | --- |
| `logic/create-user.js` | Creates a contact. |
| `logic/list-users.js` | Lists saved contacts. |
| `logic/update-user.js` | Updates an existing contact. |
| `logic/delete-user.js` | Deletes an existing contact. |
| `logic/find-user-by-name.js` | Finds all contacts with the supplied full name. |
| `logic/find-user-by-email.js` | Finds a contact by email. |
| `logic/find-user-by-id.js` | Finds a contact by ID. |
| `logic/users-gender-count.js` | Counts name-based classification guesses through the existing AI client. |

## Clients and startup

`clients/terminal/` contains copyable `node --input-type=module` heredocs. They call
the corresponding operations and print their results. Their usage is described
in the [constitution](CONSTITUTIONS.md#terminal-examples).

`clients/jupyter/` provides nine independent notebooks for those same operations
and explicit table initialization. Initialization calls a query; it is not a new
public business operation.

| Terminal file in `clients/terminal/` | Notebook in `clients/jupyter/` |
| --- | --- |
| `create-users-table.txt` | `01-create-users-table.ipynb` |
| `create-user.txt` | `02-create-user.ipynb` |
| `list-users.txt` | `03-list-users.ipynb` |
| `find-user-by-email.txt` | `04-find-user-by-email.ipynb` |
| `find-user-by-id.txt` | `05-find-user-by-id.ipynb` |
| `find-user-by-name.txt` | `06-find-user-by-name.ipynb` |
| `update-user.txt` | `07-update-user.ipynb` |
| `delete-user.txt` | `08-delete-user.ipynb` |
| `users-gender-count.txt` | `09-users-gender-count.ipynb` |

- `clients/jupyter/client.py` sends an operation and arguments as JSON to a Node
  subprocess in this project copy and displays its output.
- `clients/jupyter/run-operation.js` selects an explicitly supported operation,
  awaits the classifier when needed, and presents returned values as tables or
  displays client messages and errors. It does not replace business operations.
- `scripts/jupyter.js` prepares the existing project-local environment, registers
  its kernel, and starts Jupyter on the loopback interface with the notebook
  folder as its root.
- `requirements-jupyter.txt` lists the Python requirements for that client.
- `package.json` holds minimal application metadata, ES module mode, the Jupyter
  startup and development-check commands, and dependency declarations. `pnpm-lock.yaml` records the
  resolved packages. Version and package rules remain in the
  [constitution](CONSTITUTIONS.md#dependencies-and-package-management).
- `.gitignore` excludes generated local artifacts. `db/users.sqlite`, `.venv/`,
  dependency installations and caches are runtime files, not source inventory.
- `README.md` explains how to start and use the Jupyter client.

Results are presented by clients rather than printed by business operations.
Startup may report environment preparation; it does not introduce business logic.

## Development tools

`eslint.config.js` applies the official recommended JavaScript checks, recognizes
this app's Node globals, and excludes installed dependencies, Python environments
and generated caches. Its default export is the interface required by ESLint.

The `format` command in `package.json` runs standard Prettier on the app's own
JavaScript, including the Jupyter runner, startup script and lint configuration.
The `lint` command checks JavaScript with ESLint without rewriting it. Neither
command starts the app or accesses its database. Required use at task completion
is defined in [AGENTS.md](../AGENTS.md).

## Documentation

| File | Responsibility |
| --- | --- |
| [CONSTITUTIONS.md](CONSTITUTIONS.md) | Application principles, public contracts, package rules, and SDD approval process. |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Responsibilities and relationships of the existing layers and files. |
| [TREE.md](TREE.md) | Versioned project paths, including the documentation. |
| [DATABASE.md](DATABASE.md) | Connection, schema, initialization, and queries. |
| [ERRORS.md](ERRORS.md) | Exact business errors and their conditions. |
| [STYLE.md](STYLE.md) | Conventions for writing new code. |
| [AGENTS.md](../AGENTS.md) | Agent workflow, verification, documentation maintenance, and Socket procedure. |

`docs/specs/<feature-name>/` contains each development's `spec.md`, `plan.md`, and
`tasks.md`. The current folders cover the classifier, name lookup, Jupyter client,
Socket package validation, guide separation, formatting/lint checks, and alignment
with the architecture and style guides. Their individual documents
record the request, approved approach, tasks, decisions, and verification.
