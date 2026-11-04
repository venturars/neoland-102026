# Tasks — Socket MCP reference

Issue: #644. Follows spec version 1.1.

Whoever writes these tasks stops here and applies no change until a person
asks.

## Update the guides

1. In `docs/TREE.md`, add `socket-mcp/mcp.txt` under `MCPS/`, after `github-mcp-server/`.
2. In `docs/ARCHITECTURE.md`, change the `MCPS/` summary line to name the GitHub and the Socket MCP.
3. In `docs/ARCHITECTURE.md`, under `### MCPS/`, add a line for `socket-mcp/mcp.txt`.

## Write the reference

4. Create `MCPS/socket-mcp/mcp.txt` with the docs URL, the server `https://mcp.socket.dev/`, and that `depscore` needs no session while `alerts`, `threat_feed` and `organizations` need one in `neoland1`.
5. In `MCPS/socket-mcp/mcp.txt`, add the `socket-mcp` config entry as JSON, with only `url`. No token in any file.
6. In `MCPS/socket-mcp/mcp.txt`, add one line per tool with the datum it answers: `depscore`, `alerts`, `threat_feed`.
7. In `MCPS/socket-mcp/mcp.txt`, add what each of those three cannot do, with the review of 30 October 2026 in `neoland1` (stats, the `eslint` `9.39.2` alert that does not apply, `alerts` always filtered by package name) and the `403 threat_feed_not_entitled` of the free plan.
8. In `MCPS/socket-mcp/mcp.txt`, name the other exposed tools, and say that the socket.dev page answers 403 from Cloudflare.

## Use it in AGENTS.md

9. In "Packages", change step 1 to name the tool for each datum, point to `MCPS/socket-mcp/mcp.txt`, say that `alerts` and `threat_feed` need a session in the organization, and ask the agent to check whether there is a campaign, an alert or a stat below 50 and report it, without rejecting: the person decides, as step 2 says.
10. In "Packages", add the rule: a datum is "not found" only after its tool was called; if the tool cannot answer, the summary gives the reason.
11. In "Packages", add that an empty `alerts` list is written as "no alert on a watched package", that `alerts` is filtered by package name and only an alert of the same version counts, and that a stat below 50 is written while 50 does not count as below.

## Run it

12. Call `organizations` and check that the session returns `neoland1`. Call `depscore` for `eslint` `10.13.0` and check that it answers the five stats.
13. Call `alerts` filtered by `eslint` and `threat_feed`, and check that they answer as `mcp.txt` says.
14. Read `mcp.txt` next to `MCPS/github-mcp-server/mcp.txt` and check that the shape is the same.
