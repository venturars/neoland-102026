import { Buffer } from "node:buffer";
import { error, log } from "node:console";
import { readdirSync, readFileSync } from "node:fs";
import process from "node:process";
import { once } from "node:events";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const queriesUrl = new URL("../queries/queries/", import.meta.url);
const queriesPath = fileURLToPath(queriesUrl);
const fileNames = readdirSync(queriesPath);
const sqlByFile = {};

for (const fileName of fileNames) {
  const isSqlFile = fileName.endsWith(".sql");

  if (isSqlFile) {
    const sqlPath = join(queriesPath, fileName);
    sqlByFile[fileName] = readFileSync(sqlPath, "utf8");
  }
}

const filePath = fileURLToPath(import.meta.url);
const directory = dirname(filePath);
const databasePath = join(directory, "users.sqlite");
const db = new DatabaseSync(databasePath);

const HOST = "127.0.0.1";
const PORT = 3000;

function sendJson(response, statusCode, payload) {
  const text = JSON.stringify(payload);

  response.writeHead(statusCode, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
  });
  response.end(text);
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  const text = buffer.toString("utf8");

  return JSON.parse(text);
}

function rowOrNull(row) {
  if (row === undefined) {
    return null;
  }

  return row;
}

function execute(method, sql, params) {
  if (method === "exec") {
    db.exec(sql);
    return null;
  }

  const statement = db.prepare(sql);

  if (method === "get") {
    const row = statement.get(params);
    return rowOrNull(row);
  }

  if (method === "all") {
    return statement.all(params);
  }

  if (method === "run") {
    const result = statement.run(params);

    return {
      changes: result.changes,
      lastInsertRowid: Number(result.lastInsertRowid),
    };
  }

  return undefined;
}

async function handleRequest(request, response) {
  const baseUrl = `http://${HOST}:${PORT}`;
  const url = new URL(request.url, baseUrl);
  const path = url.pathname;

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST",
      "access-control-allow-headers": "content-type",
    });
    response.end();
    return;
  }

  if (request.method !== "POST" || path !== "/execute") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  let body;

  try {
    body = await readJsonBody(request);
  } catch {
    sendJson(response, 400, { error: "Invalid JSON" });
    return;
  }

  const method = body.method;
  const file = body.file;
  let params = body.params;

  if (params === undefined) {
    params = {};
  }

  const sql = sqlByFile[file];

  if (typeof sql !== "string") {
    sendJson(response, 400, { error: "Unknown file" });
    return;
  }

  try {
    const result = execute(method, sql, params);

    if (result === undefined) {
      sendJson(response, 400, { error: "Unknown method" });
      return;
    }

    sendJson(response, 200, result);
  } catch {
    sendJson(response, 500, { error: "Database error" });
  }
}

async function startDatabaseServer() {
  const server = createServer(handleRequest);

  server.listen(PORT, HOST);
  await once(server, "listening");

  log(`Database server: http://${HOST}:${PORT}`);
}

try {
  await startDatabaseServer();
} catch {
  error(
    "No se ha podido iniciar el servidor de la base. Comprueba si el puerto 3000 está ocupado.",
  );
  process.exitCode = 1;
}
