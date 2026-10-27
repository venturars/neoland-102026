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
2. Find layer 2: `npm view <name>@<version> dependencies`. For each range, the exact version is the highest that matches: `npm view <dep>@"<range>" version`, last line.
3. Find layer 3 the same way from each layer 2 package. Stop there.
4. For every package of the three layers, run the three checks: campaigns, alerts, scores (see **Sources**).
5. Write the **Socket check** table in the plan: package, layer, campaigns, alerts, scores below 50. Each cell is "found: …", "None found" or "Not checked: <why>".
6. Explain each alert in plain words. A missing tool, a missing sign-in or an empty answer is "Not checked".
7. End with the date, the sources used and a blank decision line. Stop and ask. Only the person who approves the plan fills the decision.

## Sources

Checked on 2026-10-27 with the `socket-mcp` server of this session:

| Check     | Tool          | Result of the test                                                                                                                                   |
| --------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scores    | `depscore`    | Works without an organization. `cli-table3@0.6.5`: license 100, maintenance 81, quality 100, supplyChain 100, vulnerability 100. It lists no alerts. |
| Alerts    | `alerts`      | Needs an organization slug and only lists packages that organization monitors. `organizations` answered "needs you to sign in again".                |
| Campaigns | `threat_feed` | Needs an organization slug. Same sign-in failure. It has malware and typosquat filters, not a "campaign" filter.                                     |

So today only the scores can be checked from the agent. Alerts and campaigns would be "Not checked".

## Signature

None.

## SQL

None.

## Errors

None. This change adds no message to **Errors**.

## Open questions

1. **Alerts of one package.** `depscore` gives scores but no alerts, and `alerts` only covers an organization's monitored packages. Which source counts for the alerts of a package that is not installed yet: the public page of the package on socket.dev (the `Report` link `depscore` returns), the Socket CLI (`npx socket package score npm <name>@<version>`, free account and API key), or "Not checked" until there is a better tool?
2. **Campaigns.** No Socket tool here says "attack campaign". Is `threat_feed` with the filters `mal` and `typ`, by name and version, enough to call it a campaign check, after signing in again with `/mcp`? Do you have a Socket organization, or should that be created (free)?
3. **Layer versions.** Is "the highest version that matches the range" (step 2) good enough for layers 2 and 3, knowing pnpm may reuse a lower version already in `pnpm-lock.yaml`?
