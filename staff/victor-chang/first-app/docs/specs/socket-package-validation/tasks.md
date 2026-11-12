# Tasks — Socket package validation

1. [x] In `docs/CONSTITUTION.md`, **Runtime**, after "A new dependency is added here before any plan uses it.", add the rule: a plan that adds a Node package or changes its version has a **Socket check** section, and it is not approved without it. The steps are in `AGENTS.md`.
       The paragraph names Socket, new packages and version changes.
2. [x] In `docs/CONSTITUTION.md`, **Specs**, in the `plan.md` template, add `## Socket check` after `## Errors`, and a line saying it is only for a plan that adds or changes a Node package.
       The template still ends with `## Open questions`.
3. [x] In `AGENTS.md`, after **Error handling**, add the section **Node packages** with the seven steps of the plan.
       It names the three layers, `pnpm-lock.yaml` first, the two checks with their source, the threshold 50, "Not checked: <why>" and the blank decision line.
4. [x] In the same section, add the example table of the spec and the socket.dev link pattern `https://socket.dev/npm/package/<name>/alerts/<version>`.
       The columns are package, layer, alerts, scores below 50.
5. [x] Read the section against the spec's **Failures**: no plan approved without the table, no layer or check skipped, no "Not checked" turned into "None found", the agent never fills the decision.
       Each of the four has a sentence in `AGENTS.md` that forbids it.
6. [x] Run `git diff --stat $(git merge-base origin/staging HEAD) -- .`: only `docs/CONSTITUTION.md`, `AGENTS.md` and `docs/specs/` changed.
       `package.json`, `pnpm-lock.yaml`, `logic/`, `queries/`, `db/` and `clients/` are not in the list.
7. [x] Run `npx prettier --check .`. In `docs/specs/README.md`, add the row `socket-package-validation` with status `done`.
       Every file passes.
