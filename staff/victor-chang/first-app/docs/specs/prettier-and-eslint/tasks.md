# Tasks — Prettier and ESLint

1. [ ] Check that the **Socket check** of the plan has its `Decision:` filled by the person who approves it.
       Without it, stop here.
2. [ ] Run `pnpm add -D --save-exact prettier@3.9.10 eslint@10.13.0 @eslint/js@10.0.1`.
       `package.json` lists the three under `devDependencies` with exact versions; `pnpm-lock.yaml` has them.
3. [ ] In `package.json`, add the scripts `format`, `format:check` and `lint` from the plan.
4. [ ] Run `pnpm format:check`.
       Every file passes, the same as `npx prettier --check .` before.
5. [ ] Create `eslint.config.js` from the plan. Run `pnpm lint`.
       It shows `'URL' is not defined` in `db/connection.js` and `queries/users.js`, and nothing from `.venv/` or `node_modules/`.
6. [ ] In `db/connection.js`, add `URL` to the `node:url` import. In `queries/users.js`, add `import { URL } from "node:url";`.
       `pnpm lint` prints nothing.
7. [ ] Paste `clients/terminal/list-users.txt` and `clients/terminal/create-user.txt` into Git Bash.
       The output matches their comments, as before.
8. [ ] In `docs/CONSTITUTION.md`, **Tree**, add `eslint.config.js`; in **Runtime**, replace the Tooling line with the one in the plan.
9. [ ] In `AGENTS.md`, **Commands**, replace the two `npx prettier` lines with `pnpm format`, `pnpm format:check` and `pnpm lint`; in **How code is written**, run `pnpm format` and `pnpm lint` before committing.
10. [ ] Run `pnpm format`, `pnpm format:check` and `pnpm lint`. In `docs/specs/README.md`, set `prettier-and-eslint` to `done`.
        All three pass.
