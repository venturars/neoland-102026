import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const ORIGIN = "http://127.0.0.1:3000";
const databasePath = fileURLToPath(new URL("./users.sqlite", import.meta.url));
const db = new DatabaseSync(databasePath);

function respond(response, status, result) {
  response.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  });
  response.end(JSON.stringify(result));
}

const server = createServer(async (request, response) => {
  let requestUrl;
  try {
    requestUrl = new URL(request.url, ORIGIN);
  } catch {
    respond(response, 400, { error: "Invalid request" });
    return;
  }
  if (requestUrl.pathname !== "/execute") {
    respond(response, 404, { error: "Not found" });
    return;
  }
  if (request.method === "OPTIONS") {
    respond(response, 204);
    return;
  }
  if (request.method !== "POST") {
    respond(response, 405, { error: "Method not allowed" });
    return;
  }

  let input;
  try {
    request.setEncoding("utf8");
    let text = "";
    for await (const chunk of request) {
      text += chunk;
    }
    input = JSON.parse(text);
  } catch {
    respond(response, 400, { error: "Invalid request" });
    return;
  }
  const method = input?.method;
  const sql = input?.sql;
  const params = input?.params;
  const validMethod = ["exec", "get", "all", "run"].includes(method);
  const validParams =
    params && typeof params === "object" && !Array.isArray(params);
  if (!validMethod || typeof sql !== "string" || !validParams) {
    respond(response, 400, { error: "Invalid request" });
    return;
  }

  let result;
  try {
    if (method === "exec") {
      db.exec(sql);
      result = { ok: true };
    } else {
      const statement = db.prepare(sql);
      if (method === "get") {
        const row = statement.get(params);
        result = { row: row ?? null };
      } else if (method === "all") {
        const rows = statement.all(params);
        result = { rows };
      } else {
        const info = statement.run(params);
        result = {
          changes: info.changes,
          lastInsertRowid: info.lastInsertRowid,
        };
      }
    }
  } catch {
    respond(response, 500, { error: "Query failed" });
    return;
  }
  respond(response, 200, result);
});

server.on("error", (error) => {
  console.error(`Could not start data server: ${error.message}`);
  db.close();
  process.exitCode = 1;
});
server.listen(3000, "127.0.0.1", () => console.log(ORIGIN));
