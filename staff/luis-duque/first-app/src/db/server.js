/* global console, URL */
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const ORIGIN = "http://127.0.0.1:3000";

const directory = dirname(fileURLToPath(import.meta.url));
const database = new DatabaseSync(join(directory, "users.sqlite"));
const originUrl = new URL(ORIGIN);

function send(response, status, body) {
  const headers = {
    "access-control-allow-origin": "*",
  };

  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }

  response.writeHead(status, headers);
  response.end(body === undefined ? undefined : JSON.stringify(body));
}

const server = createServer((request, response) => {
  const url = new URL(request.url, ORIGIN);

  if (url.pathname !== "/execute") {
    send(response, 404);
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST",
      "access-control-allow-headers": "content-type",
    });
    response.end();
    return;
  }

  if (request.method !== "POST") {
    send(response, 404);
    return;
  }

  let raw = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    raw += chunk;
  });
  request.on("end", () => {
    let body;

    try {
      body = JSON.parse(raw);
    } catch (error) {
      send(response, 500, { message: error.message });
      return;
    }

    const method = body.method;
    const sql = body.sql;
    const params = body.params;

    try {
      if (method === "exec") {
        database.exec(sql);
        send(response, 200, { ok: true });
        return;
      }

      if (method === "get") {
        const row = database.prepare(sql).get(...params);
        send(response, 200, { row: row === undefined ? null : row });
        return;
      }

      if (method === "all") {
        const rows = database.prepare(sql).all(...params);
        send(response, 200, { rows });
        return;
      }

      if (method === "run") {
        const info = database.prepare(sql).run(...params);
        send(response, 200, {
          changes: info.changes,
          lastInsertRowid: Number(info.lastInsertRowid),
        });
        return;
      }

      send(response, 404);
    } catch (error) {
      send(response, 500, { message: error.message });
    }
  });
});

server.listen(Number(originUrl.port), originUrl.hostname, () => {
  console.log(ORIGIN);
});
