# Tasks — Socket MCP reference

Issue: #644.

## Update the guides

1. In `docs/TREE.md`, add `socket-mcp/mcp.txt` under `MCPS/`, after `github-mcp-server/`.
2. In `docs/ARCHITECTURE.md`, change the `MCPS/` summary line to name the GitHub and the Socket MCP.
3. In `docs/ARCHITECTURE.md`, under `### MCPS/`, add a line for `socket-mcp/mcp.txt`.

## Write the reference

4. Create `MCPS/socket-mcp/mcp.txt` with the docs URL, the server `https://mcp.socket.dev/` and the date and plan of the review.
5. In `MCPS/socket-mcp/mcp.txt`, add the `socket` config entry as JSON, with only `url`.
6. In `MCPS/socket-mcp/mcp.txt`, add one line per tool with the datum it answers: `depscore`, `alerts`, `threat_feed`.
7. In `MCPS/socket-mcp/mcp.txt`, add what each of those three cannot do, with the `403 threat_feed_not_entitled` of the free plan.
8. In `MCPS/socket-mcp/mcp.txt`, name the other exposed tools, and say that the socket.dev page answers 403 from Cloudflare.

## Use it in AGENTS.md

9. In "Packages", change step 1 to name the tool for each datum and point to `MCPS/socket-mcp/mcp.txt`.
10. In "Packages", add the rule: a datum is "not found" only after its tool was called; if the tool cannot answer, the summary gives the reason.
11. In "Packages", add that an empty `alerts` list is written as "no alert on a watched package".

## Run it

12. Call `depscore` for `eslint` `10.13.0` and check that it answers the five stats.
13. Call `alerts` and `threat_feed` and check that they answer as `mcp.txt` says.
14. Read `mcp.txt` next to `MCPS/github-mcp-server/mcp.txt` and check that the shape is the same.
