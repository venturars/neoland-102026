# Plan — Split the docs by topic

Docs only. It changes no code.

## Files

Create, in `docs/`, with text moved, not rewritten:

- `ARCHITECTURE.md`: the layer bullets under **Tree** of the constitution, one bullet per file (from the comments of the tree), and the **Clients** section with **Terminal** and **Jupyter**.
- `TREE.md`: the tree of the constitution, without comments, plus the five new guides.
- `DATABASE.md`: the **Database** and **Queries** sections.
- `ERRORS.md`: the **Errors** section, then **Error handling** of `AGENTS.md`, under a heading **In code**.
- `STYLE.md`: **Naming** and **How code is written** of `AGENTS.md`, and **Constants** of the constitution. **Naming** adds the new guides to the uppercase docs.

Touch:

- `docs/CONSTITUTION.md`: keeps the intro, **Runtime**, **Specs**, **Logic is not replaced** and **A logic file**. A new **Guides** section, after the intro, links to the five guides. The removed sections leave no text behind. "names a message from **Errors**" links to `ERRORS.md`.
- `AGENTS.md`: the intro links to the constitution and the five guides. **Rules** adds: "A change that adds or removes a file also updates `TREE.md` and `ARCHITECTURE.md`." **Naming**, **How code is written** and **Error handling** are removed. **Commands**, **Node packages** and **Workflow** stay.
- `docs/specs/README.md`: the row `split-docs`.

Not touched: `docs/specs/*/` already done, code, clients.

## Looks like

`docs/specs/socket-package-validation/plan.md`: a docs-only change to the constitution and `AGENTS.md`. The split follows the guides of the reference app (`staff/ventura-rodriguez/first-app/docs/`), with this app's rules and in English.

## Signature

None.

## SQL

None.

## Errors

None. This change adds no message to **Errors**.

## Open questions

None. Answered on 2026-11-03: **Naming**, **How code is written** and **Error handling** move out of `AGENTS.md` into `STYLE.md` and `ERRORS.md`.
