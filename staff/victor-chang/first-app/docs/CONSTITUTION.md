# Constitution — first-app

first-app is a small app to manage users (create, read, update, delete). It is built with AI following SDD. No change starts in the code: a feature, a client, a dependency, the configuration or the docs go through `spec.md`, `plan.md` and `tasks.md`, and a human reads each one before going on.

How to work in the app (rules, commands, workflow) is in [AGENTS.md](../AGENTS.md).

## Guides

Each topic has its own guide. A guide wins on its topic.

- [ARCHITECTURE.md](ARCHITECTURE.md): the responsibility of each layer and each file, and the rules of each client.
- [TREE.md](TREE.md): the folders and files.
- [DATABASE.md](DATABASE.md): the database, the `users` table and the queries.
- [ERRORS.md](ERRORS.md): the error list and how code throws and catches.
- [STYLE.md](STYLE.md): naming, how code is written, constants and formatting.

## Runtime

- Node.js 24+, ES modules (`"type": "module"` in `package.json`).
- Node built-ins: `node:sqlite`, `node:fs`, `node:url`.
- npm dependencies: `openai`, to call the local AI (Ollama); `cli-table3` and `@colors/colors`, to draw the tables of the Jupyter client. Exact versions. Packages are installed with pnpm (`pnpm install`); `node_modules/` is git-ignored, `pnpm-lock.yaml` is committed.
- Python 3, only for the Jupyter client: an app-local `.venv` with `notebook` at an exact version, created by `scripts/jupyter.sh`, run with `pnpm jupyter`, on macOS, Linux and Windows (Git Bash). The Jupyter installed on the computer is not used.
- Tooling: Prettier and ESLint, development packages at an exact version, run with `pnpm format`, `pnpm format:check` and `pnpm lint`. Prettier keeps its default config, with no config file; `.prettierignore` only lists `.venv/` (installed Python packages) and `pnpm-lock.yaml` (written by pnpm in its own format). ESLint uses its recommended rules only, set in `eslint.config.js`, which ignores `.venv/` and `node_modules/`.

A new dependency is added here before any plan uses it.

A plan that adds a Node package, or changes the version of one, has a **Socket check** section, and it is not approved without it. The steps are in [AGENTS.md](../AGENTS.md#node-packages).

## Specs

**spec.md is the business.** Read by whoever decides if the feature is what they want, without opening the code. It says what is asked, who uses it, what goes in, what comes out with an example, and which failure is seen. A failure names a message from [ERRORS.md](ERRORS.md). It also says what is out of scope. It never names files, functions or SQL.

```
# <Feature name>
## What
## Who
## Input
## Output        with one example
## Failures      each one names a message from Errors
## Out of scope
```

**plan.md is the technique.** Read by whoever checks that the work fits this constitution. It says:

- which files are created and which are touched
- which `logic/` file it resembles, without pasting its code
- the signature: name, parameters and output
- the new SQL, with named parameters (`:id`, `:name`, `:email`)
- which message from [ERRORS.md](ERRORS.md) matches each failure in the spec

```
# Plan — <feature name>
## Files
## Looks like
## Signature
## SQL
## Errors
## Socket check  only when it adds or changes a Node package
## Open questions
```

A new feature is a new file. A heading with nothing to say for the change (for example **Signature** or **SQL** for a new client) says `None.` If this constitution, the current code and the spec do not say the same thing, the question is written under **Open questions** and work stops there. No tasks and no code until it is answered.

**tasks.md is the steps**, in the order a person would do them. Each step opens one place, does one thing and leaves a result you can look at. A step is at most four lines. Tick `[x]` when it is done.

If the work changes an existing feature, its tasks keep the same grain: look at what exists, change one place, check.

The three files are short, concrete and deterministic. They add no complexity to reading them.

## Logic is not replaced

`logic/` is not an adapter or a swappable layer. It is not replaced by another implementation, it is not turned into plugins, and its rules do not move to `queries/` or `clients/`.

Each feature is one file. A `logic/` file that already exists is not replaced to fit another task. A new feature is a new file.

## A logic file

One file, one exported function. The signature defines the name, the input and the output. There is no contract comment above the function.

The name is the action (`createUser`, `updateUser`, `deleteUser`, `listUsers`). Parameters go in the signature with their own name (`id`, `name`, `email`). The input is not grouped into one object when the values are already known.

The body follows this order and the steps are not mixed:

1. Validate the input parameters.
2. Check the other business rules.
3. Apply the business logic.
4. Shape the output and return a plain object.

A step with nothing to do is skipped. Each step starts with a short comment naming it.

`logic/` imports `queries/users.js` directly. It may call the local AI with the `openai` client.
