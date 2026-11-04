// Servidor local de la base de datos: el único proceso que abre users.sqlite.
// Recibe el nombre de una consulta de queries/users-sql.js y sus valores,
// la ejecuta y devuelve las filas. No ejecuta SQL que le llegue de fuera.

import { createServer } from "node:http";
import connection from "./connection.js";
import { USER_QUERIES } from "../queries/users-sql.js";

const HOST = "127.0.0.1";
const PORT = 4000;

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

// Junta los trozos del cuerpo de la petición y devuelve el texto completo.
function readBody(request) {
  return new Promise(function (resolve, reject) {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", function (chunk) {
      body = body + chunk;
    });
    request.on("end", function () {
      resolve(body);
    });
    request.on("error", reject);
  });
}

async function handleRequest(request, response) {
  const url = new URL(request.url, "http://" + HOST + ":" + PORT);
  if (url.pathname !== "/query") {
    sendJson(response, 404, { error: "Not found." });
    return;
  }
  if (request.method !== "POST") {
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  let data;
  try {
    const body = await readBody(request);
    data = JSON.parse(body);
  } catch {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }
  if (data === null || typeof data !== "object") {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }
  if (typeof data.query !== "string") {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }
  const hasParamsList = Array.isArray(data.params);
  if (!hasParamsList) {
    sendJson(response, 400, { error: "Invalid request." });
    return;
  }

  // Object.hasOwn evita que nombres heredados, como "toString", cuenten como consulta.
  const isKnownQuery = Object.hasOwn(USER_QUERIES, data.query);
  if (!isKnownQuery) {
    sendJson(response, 404, { error: "Unknown query: " + data.query });
    return;
  }

  const sql = USER_QUERIES[data.query];
  try {
    const statement = connection.prepare(sql);
    const rows = statement.all(...data.params);
    sendJson(response, 200, { rows: rows });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

const server = createServer(handleRequest);
server.listen(PORT, HOST, function () {
  console.log("Database: http://" + HOST + ":" + PORT);
});
