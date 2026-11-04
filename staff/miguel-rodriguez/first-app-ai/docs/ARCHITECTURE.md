# Architecture

## Storage and business operations

- `src/db/server.js` owns the module-relative SQLite connection and executes
  requests on the loopback data service. Its storage contracts are in
  [DATABASE.md](DATABASE.md).
- `src/queries/queries/` exports one JavaScript SQL-text constant per query.
  `src/queries/users.js` sends those statements and bound parameters to the data
  service; its async functions return query results without business validation
  or presentation.
- `src/logic/` contains the public business operations. It validates input, checks
  business conditions, calls queries, and constructs ordinary returned data.
  It awaits query results without managing the connection or printing results. The
  [constitution](CONSTITUTIONS.md#public-business-operations) defines the contracts;
  [ERRORS.md](ERRORS.md) defines their failures.

| Business file | Responsibility |
| --- | --- |
| `src/logic/create-user.js` | Creates a contact. |
| `src/logic/list-users.js` | Lists saved contacts. |
| `src/logic/update-user.js` | Updates an existing contact. |
| `src/logic/delete-user.js` | Deletes an existing contact. |
| `src/logic/find-user-by-name.js` | Finds all contacts with the supplied full name. |
| `src/logic/find-user-by-email.js` | Finds a contact by email. |
| `src/logic/find-user-by-id.js` | Finds a contact by ID. |
| `src/logic/users-gender-count.js` | Counts name-based classification guesses through the existing AI client. |

## Clients and startup

`src/clients/terminal/` contains copyable `node --input-type=module` heredocs. They await
the corresponding operations and print their results. Their usage is described
in the [constitution](CONSTITUTIONS.md#terminal-examples).

`src/clients/web/` provides the selection, menu and edit/delete screens. The
browser imports the shared list, ID lookup, update and delete operations as ES
modules. It keeps presentation state in memory; saved contacts live in SQLite.
Field errors present shared validation failures. Typed-email confirmation is a
client precaution before calling delete, not authentication. Notes is disabled.

`scripts/web.js`, run by `pnpm web`, opens the HTML as a file in Chrome/Chromium
with local-file module access and a separate temporary profile. It uses an
explicit `CHROME_BIN` path or the platform's usual installation paths. Stopping
the launcher with Ctrl+C closes its browser and removes that profile.
`src/db/server.js` handles only database requests on POST /execute and its CORS
preflight; it does not serve the page or JavaScript files.

`src/clients/vscode/` provides an independent VS Code extension. Its manifest and
`extension.cjs` register a command and bridge panel messages to the existing user
operations. `panel.html`, `panel.js`, and `panel.css` present the contact flows;
the extension uses the same local data service and does not own business rules.
Its `.vscode/launch.json` starts the Extension Development Host for local testing.
`tests/vscode-client.test.js` checks the extension adapter.

`src/clients/jupyter/` provides nine independent notebooks for those same operations
and explicit table initialization. Initialization calls a query; it is not a new
public business operation.

| Terminal file in `src/clients/terminal/` | Notebook in `src/clients/jupyter/` |
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

- `src/clients/jupyter/client.py` sends an operation and arguments as JSON to a Node
  subprocess in this project copy and displays its output.
- `src/clients/jupyter/run-operation.js` selects an explicitly supported operation,
  awaits each requested operation, and presents returned values as tables or
  displays client messages and errors. It does not replace business operations.
- `scripts/jupyter.js` prepares the existing project-local environment, registers
  its kernel, and starts Jupyter on the loopback interface with the notebook
  folder as its root.
- `requirements-jupyter.txt` lists the Python requirements for that client.
- `package.json` holds minimal application metadata, ES module mode, the
  data-service and Jupyter startup commands and development-check commands, and dependency declarations. `pnpm-lock.yaml` records the
  resolved packages. Version and package rules remain in the
  [constitution](CONSTITUTIONS.md#dependencies-and-package-management).
- `.gitignore` excludes generated local artifacts. `src/db/users.sqlite`, `.venv/`,
  dependency installations and caches are runtime files, not source inventory.
- `README.md` explains how to start and use the Jupyter client.

Results are presented by clients rather than printed by business operations.
Startup may report environment preparation; it does not introduce business logic.

## Verification

`tests/serve-data-through-node.test.js` checks the local data service, query
results, business operations and failure handling in disposable project copies.
`tests/web-client.test.js` checks file-origin query access and confirms that
the database server does not serve web assets or other project files. Both use port 3000; run them sequentially:

```sh
node --test --test-concurrency=1 tests/serve-data-through-node.test.js tests/web-client.test.js
```

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

## Git workflow

`agents/git-workflow-agent.md` defines the workflow loaded by the principal agent.
It checks task readiness against project context, asks for missing decisions and
retains resolved answers. Starting a task completes branch and draft PR setup,
including issue links, before project edits; resuming reuses completed steps.
The six other agent documents define task clarification, issue creation, branch
creation, commits, pushes and pull requests. The principal runs status, staging
updates, issue linking and reviewer assignment through their respective skills.
Delegated responsibilities run as real subagents, sequentially, through Codex’s native delegation tools. Each receives the corresponding agent document and explicit task context.

`.cursor/agents/` contains small Cursor registration entries referencing those six
agent documents. It does not duplicate their procedures. These are optional compatibility entries, not required for Codex. Opening this app as a Cursor project loads them, but requires separate runtime verification. The enclosing NEOLAND repository remains the Git root.

`skills/` describes each action and its inputs/results. The six Bash scripts in
`tools/` implement local Git operations. `templates/` supplies the issue and PR
bodies: six issue templates and six PR templates for feat, fix, docs, refactor,
test and chore. The chosen supported type is shared by the issue, branch and PR;
new tasks without a specific template use the closest supported type. Draft
checklists remain unchecked until review is requested and their items verified.
The principal links the issue after PR creation; automatic closure follows the
actual default branch, while PRs keep staging as their base.
`MCPS/github-mcp-server/mcp.txt` is a public server documentation reference,
not an installed connection or credential store. Setup and verification are in
README.md; workflow permissions and SDD gates remain in AGENTS.md.

[MCPS/socket-mcp/mcp.txt](../MCPS/socket-mcp/mcp.txt) is the public Socket MCP
documentation reference, alongside the GitHub reference. It is not an installed
connection or credential store. The constitution explains access and source
coverage; AGENTS.md retains the detailed dependency-validation procedure.

## REST client

`src/clients/http/app.js` adapts five user operations to HTTP using Express.
It awaits the existing logic, converts route IDs to numbers, and maps business
errors to HTTP statuses and JSON messages. It listens on loopback port 3001 via
`pnpm http`; queries still reach the separate data service on port 3000.
The client does not serve web assets. README documents the Postman requests.
