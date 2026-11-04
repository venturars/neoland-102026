/* global console, URL */
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "http://127.0.0.1:3000";
const filePath = fileURLToPath(import.meta.url);
const directory = dirname(filePath);
const databasePath = join(directory, "users.sqlite");
const db = new DatabaseSync(databasePath);
const address = new URL(ORIGIN);
const port = Number(address.port);
const hostname = address.hostname;

const server = createServer((request, response) => {
  response.setHeader("access-control-allow-origin", "*");
  const url = new URL(request.url, ORIGIN);
  if (url.pathname !== "/execute") {
    response.writeHead(404);
    response.end();
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "access-control-allow-methods": "POST",
      "access-control-allow-headers": "content-type",
    });
    response.end();
    return;
  }
  if (request.method !== "POST") {
    response.writeHead(404);
    response.end();
    return;
  }

  request.setEncoding("utf8");
  let raw = "";
  request.on("data", (chunk) => {
    raw += chunk;
  });
  request.on("end", () => {
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      response.writeHead(500);
      response.end();
      return;
    }

    const method = payload.method;
    const sql = payload.sql;
    const params = payload.params;
    let result;
    try {
      if (method === "exec") {
        db.exec(sql);
        result = { ok: true };
      } else if (method === "get") {
        const statement = db.prepare(sql);
        const row = statement.get(params);
        let value = row;
        if (row === undefined) {
          value = null;
        }
        result = { row: value };
      } else if (method === "all") {
        const statement = db.prepare(sql);
        const rows = statement.all(params);
        result = { rows };
      } else if (method === "run") {
        const statement = db.prepare(sql);
        const info = statement.run(params);
        const changes = info.changes;
        result = { changes };
      } else {
        response.writeHead(404);
        response.end();
        return;
      }
      const body = JSON.stringify(result);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(body);
    } catch {
      response.writeHead(500);
      response.end();
    }
  });
});

server.listen(port, hostname, () => {
  console.log(ORIGIN);
});
