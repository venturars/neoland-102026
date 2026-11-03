import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

const ORIGIN = "http://127.0.0.1:3000";
const databasePath = fileURLToPath(new URL("./users.sqlite", import.meta.url));
const db = new DatabaseSync(databasePath);

const WEB_FILES = new Map([
  [
    "/clients/web/index.html",
    new URL("../clients/web/index.html", import.meta.url),
  ],
  [
    "/clients/web/styles.css",
    new URL("../clients/web/styles.css", import.meta.url),
  ],
  ["/clients/web/main.js", new URL("../clients/web/main.js", import.meta.url)],
  ["/logic/list-users.js", new URL("../logic/list-users.js", import.meta.url)],
  [
    "/logic/find-user-by-id.js",
    new URL("../logic/find-user-by-id.js", import.meta.url),
  ],
  [
    "/logic/update-user.js",
    new URL("../logic/update-user.js", import.meta.url),
  ],
  [
    "/logic/delete-user.js",
    new URL("../logic/delete-user.js", import.meta.url),
  ],
  ["/queries/users.js", new URL("../queries/users.js", import.meta.url)],
  [
    "/queries/queries/create-users-table.js",
    new URL("../queries/queries/create-users-table.js", import.meta.url),
  ],
  [
    "/queries/queries/find-all.js",
    new URL("../queries/queries/find-all.js", import.meta.url),
  ],
  [
    "/queries/queries/find-by-email.js",
    new URL("../queries/queries/find-by-email.js", import.meta.url),
  ],
  [
    "/queries/queries/find-by-id.js",
    new URL("../queries/queries/find-by-id.js", import.meta.url),
  ],
  [
    "/queries/queries/find-by-name.js",
    new URL("../queries/queries/find-by-name.js", import.meta.url),
  ],
  [
    "/queries/queries/insert.js",
    new URL("../queries/queries/insert.js", import.meta.url),
  ],
  [
    "/queries/queries/update.js",
    new URL("../queries/queries/update.js", import.meta.url),
  ],
  [
    "/queries/queries/remove.js",
    new URL("../queries/queries/remove.js", import.meta.url),
  ],
  [
    "/queries/queries/list-tables.js",
    new URL("../queries/queries/list-tables.js", import.meta.url),
  ],
]);

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
  const isGet = request.method === "GET";
  const isHome = requestUrl.pathname === "/";
  if (isGet && isHome) {
    response.writeHead(302, { location: "/clients/web/index.html" });
    response.end();
    return;
  }
  const file = WEB_FILES.get(requestUrl.pathname);
  if (isGet && file) {
    let contents;
    try {
      contents = await readFile(file);
    } catch {
      respond(response, 500, { error: "Could not load the file" });
      return;
    }
    const extension = requestUrl.pathname.split(".").pop();
    const types = { html: "text/html", css: "text/css", js: "text/javascript" };
    response.writeHead(200, {
      "content-type": `${types[extension]}; charset=utf-8`,
    });
    response.end(contents);
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
