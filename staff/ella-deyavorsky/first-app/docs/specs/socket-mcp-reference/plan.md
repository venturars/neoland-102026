# Plan — Socket MCP reference

Issue: #644. Follows spec version 1.1.

This is not a new feature of the app. It does not touch `src/`: there is
no function in `logic/`, no new signature, no SQL, no error sentence
and no Node package, so there is no Socket check.

It adds a reference file and changes the "Packages" section of
`AGENTS.md` to use it. The previous plan, `adapt-git-workflow`, said
`MCPS/socket-mcp/` was not added. This feature adds it. That plan
stays as it is.

## Files

Created:

- `MCPS/socket-mcp/mcp.txt`

Changed:

- `AGENTS.md`: the "Packages" section.
- `docs/TREE.md`: `socket-mcp/mcp.txt` under `MCPS/`.
- `docs/ARCHITECTURE.md`: a line for it under `MCPS/` and in the
  `MCPS/` summary at the top.

## mcp.txt

Same shape as `MCPS/github-mcp-server/mcp.txt`, in Spanish: the URL of
the docs, the remote server, the config entry as JSON, then notes.

- Docs: `https://docs.socket.dev/docs/remote-socket-mcp`.
- Server: `https://mcp.socket.dev/`. `depscore` is used without signing
  in. `alerts`, `threat_feed` and `organizations` need a session in the
  organization `neoland1`; without it the server answers 401. The client
  opens the session by OAuth.
- Config entry: `socket-mcp`, as in `.cursor/mcp.json` and `MCP.md`, with
  only `url`. No token and no header, in any file.
- One line per tool, with the datum it answers: `depscore` for stats,
  `alerts` for alerts, `threat_feed` for campaigns. `organizations`,
  `package_files`, `package_file_contents` and `package_file_grep` are
  named as exposed but not needed for the three data.
- What each one cannot do, as in the spec: `depscore` lists no alerts
  or campaigns. `alerts` is always called filtering by the package
  name; without a filter the answer is too large to read. It lists only
  packages the organization already watches, so an empty list is not an
  error and does not say a new version is clean. `threat_feed` needs
  the session and the feature enabled; on the free plan it answers 403
  `threat_feed_not_entitled`.
- Dated "revisión del 30 de octubre de 2026, organización `neoland1`,
  plan free", with the answers of that day: the stats of `eslint`
  `10.13.0`, `@eslint/js` `10.0.1` and `prettier` `3.9.10`, the
  `deprecated` alert of `eslint` `9.39.2` in `crochet4ever` (another
  version and repository, so it does not apply), and the 403.
- The socket.dev page is not a fallback from here: Cloudflare answers
  403 to `curl`.

## AGENTS.md, "Packages"

Steps 1 to 4 stay. What changes:

- Step 1 names the tool for each datum and points to
  `MCPS/socket-mcp/mcp.txt`. It says that `alerts` and `threat_feed`
  need a session in the organization. It asks the agent to check
  whether there is a campaign, an alert or a stat below 50, and to
  report it. It does not reject: the decision is the person's, as step
  2 says.
- `alerts` is always called filtering by the package name. Only an
  alert of the same version as the plan counts; an alert of another
  version or repository does not apply.
- A stat below 50 is written; 50 does not count as below.
- A new rule: a datum is written as "not found" only after its tool was
  called. If the tool cannot answer, the summary says the reason, as the
  tool gave it.
- The empty `alerts` list is written as what it is, not as "no alerts".

## Stops

- Whoever writes the spec and the plan stops there.
- Whoever writes the tasks stops there and applies no change until a
  person asks.

## Edge cases

- The session is missing (401): the agent says so and does not go on.

- `threat_feed` answers 403 `threat_feed_not_entitled`: the campaign is
  "not readable with this account", with the reason. The person who accepts the plan decides.
- `alerts` is empty: written as "no alert on a watched package".
- A tool is not reachable at all: the reason is the error, and no datum
  is invented.

## What stays as it is

`src/`, `package.json`, the plan of Prettier and ESLint (#410), the
`adapt-git-workflow` plan, and `docs/CONSTITUTIONS.md`: it already says a
package is validated with Socket and sends the how to `AGENTS.md`.
