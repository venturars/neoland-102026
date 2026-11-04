# AGENTS.md — first-app

How to work in this app. [CONSTITUTION.md](docs/CONSTITUTION.md) is what every change follows. Each topic has its guide: [ARCHITECTURE.md](docs/ARCHITECTURE.md), [TREE.md](docs/TREE.md), [DATABASE.md](docs/DATABASE.md), [ERRORS.md](docs/ERRORS.md) and [STYLE.md](docs/STYLE.md). They win on their topic. This file does not repeat them.

## Rules

- Read [CONSTITUTION.md](docs/CONSTITUTION.md), the guides the change touches and this file before any code change.
- A change that adds or removes a file also updates [TREE.md](docs/TREE.md) and [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Commands

Run from `staff/victor-chang/first-app`:

```
pnpm install             # install the npm dependencies
pnpm jupyter             # open the Jupyter client (the first run creates .venv)
pnpm web                 # serve the web client on http://127.0.0.1:8000/clients/web/
pnpm format              # format every file
pnpm format:check        # check formatting without changing files
pnpm lint                # run ESLint
```

To try a feature, open its `clients/terminal/<name>.txt`, copy the whole block and paste it into Git Bash from `first-app`, or run its notebook in `clients/jupyter/`.

## Node packages

A plan that adds a Node package, or changes its version, development packages included, is not approved without a **Socket check** section. Write it while writing the plan:

1. List each package the plan adds or changes, with its exact version.
2. Find layer 2: `npm view <name>@<version> dependencies`. For each range, the exact version is the one in `pnpm-lock.yaml` if it is there; otherwise the highest that matches: `npm view <dep>@"<range>" version`, last line.
3. Find layer 3 the same way from each layer 2 package. Stop there. A package inside the three layers is checked even if the app already has it.
4. For every package of the three layers, run the two checks. No layer and no check is skipped:
   - **Alerts**: `https://socket.dev/npm/package/<name>/alerts/<version>`. If the agent cannot read the page, the cell is "Not checked by the agent" with that link.
   - **Scores**: the `socket-mcp` tool `depscore`, with the exact version. A score below 50 is a warning: 49 is below, 50 is not.
5. Write one row per package and version:

   | Package               | Layer | Alerts                                         | Scores below 50 |
   | --------------------- | ----- | ---------------------------------------------- | --------------- |
   | `example-table@2.0.0` | 1     | None found                                     | None            |
   | `example-width@1.4.0` | 2     | `envVars`, low: it reads environment variables | Quality 49      |

   Each cell is "found: …", "None found" or "Not checked: <why>". A missing tool, a missing sign-in, a blocked page or an empty answer is "Not checked", never "None found". A good score does not replace the alerts check.

6. Explain each alert in plain words, under the table.
7. End with the date, the sources used and a blank `Decision:` line. Stop and ask. The agent never fills the decision and never accepts a warning or a "Not checked" on its own. The person who approves the plan opens the socket.dev links marked "Not checked by the agent", decides, and that decision is written in the plan.

## Workflow

Every change follows these steps, not only a new feature.

1. Write `docs/specs/<name>/spec.md`.
2. Write `plan.md`. If it has an open question, stop and ask.
3. Write `tasks.md`, then follow it step by step, ticking each step.
4. Write the code.
5. For a new feature, write its `clients/terminal/<name>.txt` and paste it in Git Bash: the output matches its comments.
6. Only touch files inside `staff/victor-chang/first-app/`.
7. Commit on the personal branch. Push only when asked.
