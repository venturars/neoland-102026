/* global URL, console */
import http from "node:http";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./connection.js";

// The program listens only on this computer, so nobody else on the network can reach it.
const HOST = "127.0.0.1";
const PORT = 3000;

const currentFile = fileURLToPath(import.meta.url);
const dbFolder = path.dirname(currentFile);
const srcFolder = path.dirname(dbFolder);
const queriesFolder = path.join(dbFolder, "queries");

// The SQL stays in .sql files. This file only reads them and runs them.
// "get" returns one row (or null), "all" returns every row, "run" returns nothing.
const QUERIES = {
  "create-users-table": "exec",
  insert: "get",
  "find-by-id": "get",
  "find-by-email": "get",
  "find-all": "all",
  update: "get",
  remove: "run",
};

const sqlByName = {};
for (const name of Object.keys(QUERIES)) {
  const sqlPath = path.join(queriesFolder, name + ".sql");
  sqlByName[name] = readFileSync(sqlPath, "utf8");
}

// Only these folders and file types can be read from the browser.
const PUBLIC_FOLDERS = {
  "/logic/": path.join(srcFolder, "logic"),
  "/queries/": path.join(srcFolder, "queries"),
  "/electron/": path.join(srcFolder, "clients", "electron"),
  "/": path.join(srcFolder, "clients", "web"),
};
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

// Create the table when the program starts.
db.exec(sqlByName["create-users-table"]);

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");

  if (request.method === "POST") {
    if (!url.pathname.startsWith("/queries/")) {
      sendJson(response, 404, { error: "Not found." });
      return;
    }
    const name = url.pathname.slice("/queries/".length);
    if (!Object.hasOwn(QUERIES, name)) {
      sendJson(response, 404, { error: "Not found." });
      return;
    }

    let bodyText = "";
    for await (const chunk of request) {
      bodyText += chunk;
    }
    let params;
    try {
      params = bodyText === "" ? {} : JSON.parse(bodyText);
    } catch {
      sendJson(response, 400, { error: "The request is not valid." });
      return;
    }

    try {
      const kind = QUERIES[name];
      if (kind === "exec") {
        db.exec(sqlByName[name]);
        sendJson(response, 200, null);
        return;
      }
      const statement = db.prepare(sqlByName[name]);
      if (kind === "get") {
        const row = statement.get(params);
        // JSON has no undefined, so a missing row is null.
        sendJson(response, 200, row ?? null);
        return;
      }
      if (kind === "all") {
        sendJson(response, 200, statement.all(params));
        return;
      }
      statement.run(params);
      sendJson(response, 200, null);
    } catch {
      // The SQLite message stays hidden.
      sendJson(response, 500, { error: "The database failed." });
    }
    return;
  }

  if (request.method === "GET") {
    let pathname = url.pathname;
    if (pathname === "/") {
      pathname = "/index.html";
    }
    // The longest prefix wins, so /logic/ and /electron/ are checked before /.
    let filePath;
    for (const prefix of ["/logic/", "/queries/", "/electron/", "/"]) {
      if (pathname.startsWith(prefix)) {
        const relative = pathname.slice(prefix.length);
        filePath = path.join(PUBLIC_FOLDERS[prefix], relative);
        // Do not leave the folder with "..".
        if (!filePath.startsWith(PUBLIC_FOLDERS[prefix] + path.sep)) {
          filePath = undefined;
        }
        break;
      }
    }
    const contentType = CONTENT_TYPES[path.extname(pathname)];
    if (filePath === undefined || contentType === undefined) {
      sendJson(response, 404, { error: "Not found." });
      return;
    }
    try {
      const file = await readFile(filePath);
      response.writeHead(200, { "Content-Type": contentType });
      response.end(file);
    } catch {
      sendJson(response, 404, { error: "Not found." });
    }
    return;
  }

  sendJson(response, 404, { error: "Not found." });
});

server.listen(PORT, HOST, () => {
  console.log("Database program on http://" + HOST + ":" + PORT);
});
