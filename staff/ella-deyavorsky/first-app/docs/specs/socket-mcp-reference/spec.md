# Socket MCP reference

Issue: #644.

Whoever adds a Node package, or changes its version, validates it with
Socket before the plan is accepted. Today the app says to do it, but it
does not say how to reach Socket or what each Socket tool can answer.
So a plan can say "not found" for a campaign or an alert without having
asked anything.

It is used by the person who builds the app with AI, and by the AI that
analyses a package for them. Only that person has access. Socket is
used without signing in.

The input is a Node package with its exact version. The output is the
review of that package, written in the plan, with three data: campaign,
alert and stats. Each datum is read with the tool that gives it. The
reference says which tool that is and what it cannot do.

Checked on 29 October 2026, organization `ai-engineering`, free plan:

- Stats come from `depscore`. It gives the five stats, from 0 to 100. It
  lists no alerts and no campaigns. `eslint` `10.13.0` and `prettier`
  `3.9.10` are above 50.
- Alerts come from `alerts`. It answers. With open alerts the list is
  empty, also when filtered by `eslint`. That is not an error: it lists
  alerts of packages the organization already watches, not of a version
  that is not in the repository yet.
- Campaigns come from `threat_feed`. It answers 403
  `threat_feed_not_entitled`. The free plan has no threat feed, so a
  campaign cannot be read with this account.
- The public guide only documents `depscore`. The server also exposes
  `organizations`, `alerts`, `threat_feed`, `package_files`,
  `package_file_contents` and `package_file_grep`.
- The public Alerts page of a package on socket.dev answers 403 from
  Cloudflare when it is fetched with `curl`. It cannot be used to read
  an alert from here.

Example: `prettier` `3.9.10` is added. Its stats are read with
`depscore`. Its alerts are asked from `alerts`, and the empty list is
written as "no alert on a watched package", not as "no alerts exist".
Its campaign is asked from `threat_feed`, which answers 403, so the
summary says the plan does not include the threat feed.

What goes wrong: a tool cannot answer, because of the plan, the
organization or the network. Then the summary says the reason. It never
says "not found" for a datum whose tool was not called.

Out of scope: changing the packages already accepted, the plan of
Prettier and ESLint, buying a Socket plan, and signing in to Socket.
