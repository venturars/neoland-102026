# Tasks — format and lint

1. Open `package.json`.
   Add the `devDependencies` from "Packages".
   Add the scripts from "Scripts".
   Do not change the `dependencies` that are already there.

2. Install in `first-app`.
   If pnpm 12.14.0 is not found, run
   `corepack prepare pnpm@12.14.0 --activate` first.
   The command updates `pnpm-lock.yaml`.
   The versions stay at 3.9.10, 10.13.0 and 10.0.1.

3. Create `eslint.config.js`.
   The text is the one in "ESLint".
   It ignores `.venv` and `node_modules`.
   The rules are the recommended ones.

4. Open `docs/TREE.md`.
   Add `eslint.config.js` as "Tree" says.
   The rest of the tree stays the same.
   No other file is added.

5. Open `docs/ARCHITECTURE.md`.
   Add the subsection from "Architecture".
   The other points stay the same.
   The tree is not repeated.

6. Open `AGENTS.md` of first-app.
   Add the "Commands" line from "AGENTS.md".
   Add the step to "When a task is done".
   The other steps stay, renumbered.

7. Check.
   In `first-app`, `pnpm format` finishes well.
   `pnpm lint` finishes well.
   `.venv` and `db/users.sqlite` do not change.
