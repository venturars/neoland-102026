/* global console, URL */
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ORIGIN = "http://127.0.0.1:3000";

const fileUrl = import.meta.url;
const filePath = fileURLToPath(fileUrl);
const directory = dirname(filePath);
const databasePath = join(directory, "users.sqlite");

const db = new DatabaseSync(databasePath);

const originUrl = new URL(ORIGIN);
const portText = originUrl.port;
const port = Number(portText);
const hostname = originUrl.hostname;

const server = createServer((request, response) => {
  const url = new URL(request.url, ORIGIN);
  const path = url.pathname;
  if (path !== "/execute") {
    response.writeHead(404, {
      "access-control-allow-origin": "*",
    });
    response.end();
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
    response.writeHead(404, {
      "access-control-allow-origin": "*",
    });
    response.end();
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
    } catch {
      response.writeHead(500, {
        "access-control-allow-origin": "*",
      });
      response.end();
      return;
    }

    const method = body.method;
    const sql = body.sql;
    const params = body.params;

    try {
      if (method === "exec") {
        db.exec(sql);
        response.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        });
        response.end(JSON.stringify({ ok: true }));
        return;
      }
      if (method === "get") {
        const statement = db.prepare(sql);
        const row = statement.get(params);
        let value = row;
        if (row === undefined) {
          value = null;
        }
        response.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        });
        response.end(JSON.stringify({ row: value }));
        return;
      }
      if (method === "all") {
        const statement = db.prepare(sql);
        const rows = statement.all(params);
        response.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        });
        response.end(JSON.stringify({ rows }));
        return;
      }
      if (method === "run") {
        const statement = db.prepare(sql);
        const info = statement.run(params);
        const changes = info.changes;
        response.writeHead(200, {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        });
        response.end(JSON.stringify({ changes }));
        return;
      }
      response.writeHead(404, {
        "access-control-allow-origin": "*",
      });
      response.end();
    } catch {
      response.writeHead(500, {
        "access-control-allow-origin": "*",
      });
      response.end();
    }
  });
});

server.listen(port, hostname, () => {
  console.log(ORIGIN);
});
