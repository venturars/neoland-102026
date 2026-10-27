# Plan — Socket package validation

Docs only. It adds no package, changes no feature and touches no code.

## Files

- Touch: `docs/CONSTITUTION.md`
  - **Runtime**: after "A new dependency is added here before any plan uses it.", the rule: a plan that adds a Node package or changes its version has a **Socket check** section, and it is not approved without it. The steps are in `AGENTS.md`.
  - **Specs**, the `plan.md` template: an optional `## Socket check` heading after `## Errors`, only for a plan that adds or changes a Node package.
- Touch: `AGENTS.md`, a new section **Node packages**, after **Error handling**, with the steps below.
- Touch: `docs/specs/README.md`, a row `socket-package-validation`, status `done` at the end.
- Not touched: `package.json`, `pnpm-lock.yaml`, `logic/`, `queries/`, `db/`, `clients/`.

## Looks like

`docs/specs/jupyter-client/plan.md`: a change that touches the constitution and the docs, with no new `logic/` function.

## Steps written in `AGENTS.md`

1. List each Node package the plan adds or changes, with its exact version, development packages included.
2. Find layer 2: `npm view <name>@<version> dependencies`. For each range, the exact version is the one already in `pnpm-lock.yaml`, if it is there; otherwise the highest that matches: `npm view <dep>@"<range>" version`, last line.
3. Find layer 3 the same way from each layer 2 package. Stop there.
4. For every package of the three layers, run the two checks (see **Sources**):
   - **Alerts**: the package page on socket.dev, `https://socket.dev/npm/package/<name>/alerts/<version>`.
   - **Scores**: `depscore` with the exact version.
5. Write the **Socket check** table in the plan: package, layer, alerts, scores below 50. Each cell is "found: …", "None found" or "Not checked: <why>". An alerts cell the agent could not read carries the socket.dev link.
6. Explain each alert in plain words. A missing tool, a missing sign-in, a blocked page or an empty answer is "Not checked".
7. End with the date, the sources used and a blank decision line. Stop and ask. Only the person who approves the plan fills the decision, after opening the socket.dev links of every alert marked "Not checked".

## Sources

Checked on 2026-10-27 with the `socket-mcp` server of this session:

| Check    | Tool            | Result of the test                                                                                                                                   |
| -------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scores   | `depscore`      | Works without an organization. `cli-table3@0.6.5`: license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. It lists no alerts. |
| Alerts   | socket.dev page | The page answers HTTP 403 to the agent (WebFetch and curl). A person can open it in a browser.                                                       |
| Not used | `alerts` (MCP)  | With `neoland-oxog9` it answers an empty list: it only covers packages the organization monitors, not a package that is not installed yet.           |

So today the agent can only check the scores. Alerts are "Not checked" with the socket.dev link.

## Decisions

Answers to the open questions, 2026-10-27:

1. **Alerts**: the socket.dev page of the package. The agent cannot read it, so it writes the link and the person who approves the plan reads it.
2. **Layer versions**: the version in `pnpm-lock.yaml` when it is there, otherwise the highest that matches the range.

## Signature

None.

## SQL

None.

## Errors

None. This change adds no message to **Errors**.
