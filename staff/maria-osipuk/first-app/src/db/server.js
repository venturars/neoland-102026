import { error, log } from "node:console";
import { once } from "node:events";
import { createServer } from "node:http";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

import { CREATE_USERS_TABLE } from "../queries/queries/create-users-table.js";

// This is the only process that opens SQLite. Every client (web, HTTP,
// terminal and Jupyter) sends its SQL here with fetch, so all of them
// read and write the same file without copying or syncing anything.
const HOSTNAME = "127.0.0.1";
const PORT = 3000;

// A request body larger than this is not read.
const MAX_BODY_LENGTH = 64 * 1024;

// The browser page is opened from file://, so its origin is "null".
// Without this header Chrome blocks the answer before the page reads it.
const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST",
  "access-control-allow-headers": "content-type",
};

export function openDatabase() {
  const fileUrl = import.meta.url;
  const filePath = fileURLToPath(fileUrl);
  const directory = path.dirname(filePath);

  // Start with the default file and replace it only when the variable
  // has text. Tests use it to point the server at a temporary file.
  let databaseFile = path.join(directory, "users.sqlite");
  const configuredFile = process.env.FIRST_APP_DATABASE_FILE;

  if (typeof configuredFile === "string") {
    const trimmedFile = configuredFile.trim();

    if (trimmedFile !== "") {
      databaseFile = path.resolve(trimmedFile);
    }
  }

  const database = new DatabaseSync(databaseFile);

  // The table exists before the first request arrives.
  database.exec(CREATE_USERS_TABLE);

  return database;
}

export function createDatabaseServer(database) {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, "http://" + HOSTNAME);

    if (url.pathname !== "/execute") {
      sendEmpty(response, 404);
      return;
    }

    // Chrome asks with OPTIONS before a POST with a JSON body.
    if (request.method === "OPTIONS") {
      sendEmpty(response, 204);
      return;
    }

    if (request.method !== "POST") {
      sendEmpty(response, 404);
      return;
    }

    // A broken body or a SQLite failure answers 500 with no body,
    // so no client ever sees the internal SQLite message.
    let result;

    try {
      const body = await readBody(request);
      result = runStatement(database, body);
    } catch {
      sendEmpty(response, 500);
      return;
    }

    if (result === undefined) {
      sendEmpty(response, 404);
      return;
    }

    const text = JSON.stringify(result);
    response.writeHead(200, {
      ...CORS_HEADERS,
      "content-type": "application/json; charset=utf-8",
    });
    response.end(text);
  });

  return server;
}

function runStatement(database, body) {
  const method = body.method;
  const sql = body.sql;
  let params = body.params;

  if (typeof sql !== "string") {
    throw new Error("SQL is required");
  }

  if (params === undefined) {
    params = {};
  }

  if (method === "exec") {
    database.exec(sql);
    return { ok: true };
  }

  const statement = database.prepare(sql);

  if (method === "get") {
    let row = statement.get(params);

    // JSON has no undefined, so a missing row travels as null.
    if (row === undefined) {
      row = null;
    }

    return { row };
  }

  if (method === "all") {
    const rows = statement.all(params);
    return { rows };
  }

  if (method === "run") {
    const info = statement.run(params);

    // lastInsertRowid can be a BigInt, which JSON cannot write.
    const lastInsertRowid = Number(info.lastInsertRowid);
    return { changes: info.changes, lastInsertRowid };
  }

  // An unknown method is not an error of SQLite: the caller gets 404.
  return undefined;
}

async function readBody(request) {
  request.setEncoding("utf8");
  let raw = "";

  for await (const chunk of request) {
    raw += chunk;

    if (raw.length > MAX_BODY_LENGTH) {
      throw new Error("Request body is too large");
    }
  }

  return JSON.parse(raw);
}

function sendEmpty(response, statusCode) {
  response.writeHead(statusCode, CORS_HEADERS);
  response.end();
}

export async function startDatabaseServer() {
  const database = openDatabase();
  const server = createDatabaseServer(database);

  // Listen only on this computer. The server runs any SQL it receives,
  // so it must never be reachable from another machine.
  server.listen(PORT, HOSTNAME);
  await once(server, "listening");

  log("First App data server: http://" + HOSTNAME + ":" + PORT);
}

// Tests import createDatabaseServer without starting the real one.
if (import.meta.main) {
  try {
    await startDatabaseServer();
  } catch {
    error(
      "No se ha podido iniciar el servidor de datos. Comprueba si el puerto 3000 está ocupado.",
    );
    process.exitCode = 1;
  }
}
