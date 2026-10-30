# Plan — Socket MCP reference

Issue: #644.

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
- Server: `https://mcp.socket.dev/`, used without signing in.
- Config entry: `socket` with only `url`. No token and no header.
- One line per tool, with the datum it answers: `depscore` for stats,
  `alerts` for alerts, `threat_feed` for campaigns. `organizations`,
  `package_files`, `package_file_contents` and `package_file_grep` are
  named as exposed but not needed for the three data.
- What each one cannot do, as in the spec: `depscore` lists no alerts
  or campaigns. `alerts` lists only packages the organization already
  watches, so an empty list is not an error and does not say a new
  version is clean. `threat_feed` answers 403 `threat_feed_not_entitled`
  on the free plan.
- Dated "revisión del 29 de octubre de 2026, organización
  `ai-engineering`, plan free", because the answers depend on the plan.
- The socket.dev page is not a fallback from here: Cloudflare answers
  403 to `curl`.

## AGENTS.md, "Packages"

Steps 1 to 4 stay. What changes:

- Step 1 names the tool for each datum and points to
  `MCPS/socket-mcp/mcp.txt`.
- A new rule: a datum is written as "not found" only after its tool was
  called. If the tool cannot answer, the summary says the reason, as the
  tool gave it.
- The empty `alerts` list is written as what it is, not as "no alerts".

## Edge cases

- `threat_feed` answers 403: the campaign is "not readable with this
  account", with the reason. The person who accepts the plan decides.
- `alerts` is empty: written as "no alert on a watched package".
- A tool is not reachable at all: the reason is the error, and no datum
  is invented.

## What stays as it is

`src/`, `package.json`, the plan of Prettier and ESLint (#410), the
`adapt-git-workflow` plan, and `docs/CONSTITUTIONS.md`: it already says a
package is validated with Socket and sends the how to `AGENTS.md`.
