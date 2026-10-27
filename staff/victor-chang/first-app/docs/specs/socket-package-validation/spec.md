# Socket package validation

## What

Before a plan that adds a Node package, or changes the version of one, is approved, that package is checked with Socket. The constitution holds the rule. The agent instructions hold the steps. The plan carries a short summary of what Socket said, and the person who approves the plan decides on it.

This change writes the rule and the steps. It does not add or update any package.

## Who

- Whoever writes the plan (usually the agent): runs the check and writes the summary in the plan.
- Whoever approves the plan: reads the summary, decides whether to go on with the package, and that decision is written in the plan. The agent never accepts a warning or a missing check on its own.

## Input

The name and exact version of each Node package the plan adds or changes, development packages included.

The check covers three layers in total, with exact versions, not ranges:

1. The package itself.
2. Its direct dependencies.
3. The dependencies of those.

A dependency inside those three layers is checked even if the app already has it.

## Output

A **Socket check** section in the plan, before it is approved. For each package and version of the three layers it says:

- **Campaigns**: whether that version is part of a known attack campaign.
- **Alerts**: each alert found and what it means, in plain words.
- **Scores**: the scores Socket gives, and which ones are below 50 out of 100. 49 is below; 50 is not.
- **Not checked**: what could not be checked, and why.

Each check has one of three results: a warning was found; it was checked and nothing was found; or it was not checked. A missing tool, a missing permission or an empty answer is "not checked", never "nothing found". A good score does not replace the alerts or campaigns check.

The section ends with the date, the sources used and the decision of whoever approves the plan.

Example, for a made-up package `example-table@2.0.0` (layer 1) and one dependency `example-width@1.4.0` (layer 2):

| Package               | Layer | Campaigns              | Alerts                                         | Scores below 50 |
| --------------------- | ----- | ---------------------- | ---------------------------------------------- | --------------- |
| `example-table@2.0.0` | 1     | Not checked: no access | None found                                     | None            |
| `example-width@1.4.0` | 2     | Not checked: no access | `envVars`, low: it reads environment variables | Quality 49      |

Decision: _accepted by the person who approves the plan, on 2026-10-27, knowing campaigns were not checked._

## Failures

This change adds no message to **Errors** and changes no feature.

The work is not done if the instructions let a plan be approved without the summary, skip a layer or one of the three checks, turn a check that could not run into "nothing found", or let the agent decide in place of the person.

## Out of scope

- Adding, removing or updating any package as part of this change.
- Checking packages whose version does not change, unless they are inside the three layers of a new or changed package.
- The fourth layer and beyond.
- Packages that are not Node, like the Python packages of the Jupyter client.
- Changing the features, the data, the clients or the database.
- Building a scanner, a GitHub automation, or buying a Socket plan.
