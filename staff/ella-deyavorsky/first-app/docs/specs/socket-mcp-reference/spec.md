# Socket MCP reference

Issue: #644. Version 1.1.

Whoever adds a Node package, or changes its version, validates it with
Socket before the plan is accepted. Today the app says to do it, but it
does not say how to reach Socket or what each Socket tool can answer.
So a plan can say "not found" for a campaign or an alert without having
asked anything.

It is used by the person who builds the app with AI, and by the AI that
analyses a package for them. Only that person has access. `depscore` is
used without signing in. `alerts` and `threat_feed` need a session in
the organization `neoland1`.

The input is a Node package with its exact version. The output is the
review of that package, written in the plan, with three data: campaign,
alert and stats. Each datum is read with the tool that gives it. The
reference says which tool that is and what it cannot do.

Checked on 30 October 2026, organization `neoland1`, free plan:

- The session works. `organizations` returns `neoland1` (slug
  `neoland1`).
- Stats come from `depscore`. It gives the five stats, from 0 to 100. It
  lists no alerts and no campaigns. `eslint` `10.13.0`, `@eslint/js`
  `10.0.1` and `prettier` `3.9.10` are all above 50.
- Alerts come from `alerts`. It needs the session. Without a filter it
  lists every open alert of the organization, more than 100, and the
  answer is too large to read. So `alerts` is always called filtering by
  the package name. Filtered by `eslint`, it returns one open alert,
  `deprecated` (medium), for `eslint` `9.39.2` in the repository
  `crochet4ever`. It is not the version of the plan (`10.13.0`) and not
  this repository, so it does not apply.
- Campaigns come from `threat_feed`. It needs the session and the
  feature enabled. With the free plan it answers 403
  `threat_feed_not_entitled`, so a campaign cannot be read with this
  account.
- The public guide only documents `depscore`. The server also exposes
  `organizations`, `alerts`, `threat_feed`, `package_files`,
  `package_file_contents` and `package_file_grep`.
- The public Alerts page of a package on socket.dev answers 403 from
  Cloudflare when it is fetched with `curl`. It cannot be used to read
  an alert from here.

Rules for the review:

- `alerts` is always called filtering by the package name. Only an alert
  of the same version as the plan counts. An alert of another version
  or of another repository does not apply.
- An empty list is written as "no alert on a watched package", not as
  "no alerts exist". `alerts` only lists packages the organization
  already watches.
- A stat below 50 is written in the summary. A stat of 50 does not
  count as below.
- `threat_feed` answering 403 `threat_feed_not_entitled` is written as
  the reason: the campaign cannot be read.

Stops:

- Whoever writes the spec and the plan stops there. The tasks are
  written only when a person asks.
- Whoever writes the tasks stops there and applies no change until a
  person asks.

Example: `prettier` `3.9.10` is added. Its stats are read with
`depscore`; none is below 50. Its alerts are asked from `alerts`
filtering by `prettier`, and the empty list is written as "no alert on
a watched package", not as "no alerts exist". Its campaign is asked
from `threat_feed`, which answers 403 `threat_feed_not_entitled`, so the
summary says the campaign cannot be read because the free plan does not
include the threat feed.

What goes wrong: a tool cannot answer, because of the session, the
plan, the organization or the network. Then the summary says the
reason. It never says "not found" for a datum whose tool was not called.

Out of scope: changing the packages already accepted, the plan of
Prettier and ESLint, and buying a Socket plan.

## Version history

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 29 October 2026 | First version. |
| 1.1 | 30 October 2026 | Own review in `neoland1`. `alerts` and `threat_feed` need a session. `alerts` filtered by package name and version. Stops. Stats rule below 50. |
