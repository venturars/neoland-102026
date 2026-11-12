# Tasks — Split the docs by topic

1. [x] Count the rules: list every heading of `docs/CONSTITUTION.md` and `AGENTS.md`.
       Each one has a target guide in the plan.
2. [x] Create `docs/TREE.md` with the tree of the constitution, without comments, plus the five guides.
3. [x] Create `docs/ARCHITECTURE.md`: the layer bullets, one bullet per file, and **Clients** with **Terminal** and **Jupyter**.
       Each file of `TREE.md` has a bullet.
4. [x] Create `docs/DATABASE.md` with **Database** and **Queries**.
5. [x] Create `docs/ERRORS.md` with **Errors**, then **Error handling** of `AGENTS.md` as **In code**.
6. [x] Create `docs/STYLE.md` with **Naming**, **How code is written** and **Constants**.
7. [x] In `docs/CONSTITUTION.md`, remove the moved sections and add **Guides** with the five links.
       It keeps the intro, **Guides**, **Runtime**, **Specs**, **Logic is not replaced** and **A logic file**.
8. [x] In `AGENTS.md`, link the guides in the intro, add the `TREE.md` / `ARCHITECTURE.md` rule, and remove the three moved sections.
9. [x] Check every link in the seven files points to a file and heading that exist. Check no paragraph is in two guides.
10. [x] Run `pnpm format:check` and `pnpm lint`. In `docs/specs/README.md`, set `split-docs` to `done`.
        Both pass.
