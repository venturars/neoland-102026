// This program is the only one that opens the people database.
// The rest of the app asks for a query by name. It does not accept SQL.

import { createServer } from "node:http";
import { db } from "./connection.js";
import { USER_QUERIES } from "../queries/users-sql.js";

const host = "127.0.0.1";
const port = 3000;

// How each known query is run. A name that is not here is refused.
const modes = {
  createUsersTable: "exec",
  findById: "get",
  findByEmail: "get",
  insert: "get",
  update: "get",
  remove: "run",
  findAll: "all",
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(data));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => {
      chunks.push(chunk);
    });
    request.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    request.on("error", reject);
  });
}

async function handleRequest(request, response) {
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  if (request.method !== "POST" || request.url !== "/query") {
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  let body;
  try {
    const text = await readBody(request);
    body = JSON.parse(text);
  } catch {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }

  const queryName = body.query;
  const params = body.params;
  const nameIsText = typeof queryName === "string";
  const paramsIsObject =
    typeof params === "object" && params !== null && !Array.isArray(params);
  if (!nameIsText || !paramsIsObject) {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }
  if (!Object.hasOwn(modes, queryName)) {
    sendJson(response, 404, { error: `Unknown query: ${queryName}` });
    return;
  }

  try {
    if (modes[queryName] === "exec") {
      db.exec(USER_QUERIES[queryName]);
      const tables = db.prepare(USER_QUERIES.listTableNames).all();
      sendJson(response, 200, { rows: tables });
      return;
    }

    const statement = db.prepare(USER_QUERIES[queryName]);
    if (modes[queryName] === "all") {
      sendJson(response, 200, { rows: statement.all(params) });
      return;
    }
    if (modes[queryName] === "get") {
      const row = statement.get(params);
      sendJson(response, 200, { row: row ?? null });
      return;
    }
    const runResult = statement.run(params);
    sendJson(response, 200, { changes: runResult.changes });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

const server = createServer((request, response) => {
  handleRequest(request, response);
});

server.listen(port, host, () => {
  console.log(`Database: http://${host}:${port}`);
});
