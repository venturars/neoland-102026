# Agent working instructions

Foundation approved by Miguel on 2026-10-20.

Read [the constitution](docs/CONSTITUTIONS.md) and any active feature's documents before changing code. The constitution defines application behavior, dependency rules, and the spec → plan → tasks review sequence; follow it rather than inventing parallel rules.

- Investigate existing code to identify similar operations. Write new code according to
  [STYLE.md](docs/STYLE.md), rather than copying an older style. A style difference in
  existing code does not block a new development; behavioral or instruction conflicts
  still require a decision.
- Keep each request bounded. Do not start later steps automatically.
- Follow the constitution's review gates before implementing new SDD features.
- Follow the constitution's dependency and package-management rules.
- Provide a copyable terminal `.txt` client for each new business operation.
- When a development adds or removes files, include updates to
  [TREE.md](docs/TREE.md) and the affected responsibilities in
  [ARCHITECTURE.md](docs/ARCHITECTURE.md) in that development's specification and work.
- Execute the terminal example before claiming the operation works.
- Verify executable changes in disposable project copies. Preserve working data, remove temporary files, and report the commands executed and actual results.
- If instructions, documents, and code conflict, explain the conflict and stop the affected work for a decision. Do not silently choose one version.
- Leave all Git and publishing actions to Miguel; do not run Git commands or publish.

Refer to the constitution for application rules and its links to architecture, tree,
database, errors, and style. Feature-specific requirements belong in that feature's documents.


## Socket package validation

Before approving a plan that adds or updates a Node package, including a development dependency:

1. Identify the package and its exact proposed version.
2. Review three layers in total: the proposed package, its direct dependencies, and their direct
   dependencies. Include packages already present in those layers, even when their versions do not
   change. Include resolved optional and peer dependencies; state platform exclusions. Review each
   name/version once and keep its relationships in the summary.
3. Read resolved versions from the lockfile when applicable. For a proposed version not in the
   lockfile, consult registry metadata without installing or executing the package. Record the exact
   expected resolution. Mark unresolved parts of the tree as incomplete; do not invent versions.
4. Request Socket's supply-chain, vulnerability, quality, maintenance and license scores for each
   version. The MCP `depscore` reports scores on a 0–100 scale. Flag every score below 50; 50 is not
   below the threshold. Missing scores remain unknown.
5. Check alerts separately from scores. MCP `organizations` identifies the organization; MCP
   `alerts` covers its monitored packages. An empty organization result does not establish that a
   particular version has no alerts. Follow pagination to the end or report partial coverage.
6. For exact-version alerts, use the verified Socket package API or a version report with adequate
   coverage. The API request is `POST
   https://api.socket.dev/v0/orgs/{org_slug}/purl?alerts=true&poll=true&timeoutSec=20`, with a
   `components` array of exact `purl` values. It requires `packages:list`. Do not filter out
   low-severity, ignored or non-fixable alerts. Match each response to its requested version;
   missing results, `pendingScan`, `notFound` or an identity mismatch are incomplete checks. Keep
   API credentials outside the repository and out of command arguments, logs and reports. Use
   existing HTTP tools; do not create a scanner or API client for this process.
7. Put a dated summary in the plan: the three-layer tree, sources and queries, scores, alerts and
   their meaning, campaign findings, missing information and the human decision. The current
   organization has limited campaign coverage: record “campaigns: coverage limited by the Socket
   plan” and the sources actually consulted in every review. The campaign API's 403 and the
   dashboard's limited list do not establish absence of campaigns. Do not equate malware alerts with
   a complete campaign check or scores with an absence of alerts.
8. Present findings and incomplete checks to Miguel before installing or incorporating a dependency,
   and wait for his decision. Acceptance applies only to that proposal. Approval of these working
   rules does not approve risks or missing information for future packages.
9. After an authorized installation, compare the resolved lockfile tree with the reviewed three
   layers. If any package or version appears or changes within those layers, check the differences
   with Socket, update the plan and wait for approval of the updated plan before continuing
   implementation or declaring completion. A matching resolution needs no additional approval for
   that comparison. Never edit the lockfile manually to make it match.

Only claim a completed check without findings for the version, criterion and coverage actually
checked. Report unavailable or partial information explicitly. Avoid unlimited retries or repeated
queries without a reason.

This procedure excludes non-Node packages, the fourth layer onward, and a separate audit of every
unchanged package in the project. That last exclusion never removes a dependency within the three
reviewed layers. Do not purchase a plan, add dependencies or build extra infrastructure to perform
these checks.
