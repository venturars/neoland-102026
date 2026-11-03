import { createServer } from "node:http";
import { error, log } from "node:console";
import process from "node:process";
import { URL } from "node:url";

import { CREATE_USERS_TABLE } from "../queries/queries/create-users-table.js";
import { db } from "./connection.js";
import { executeSql } from "./execute-sql.js";
import { serveFile } from "./serve-file.js";

const HOST = "127.0.0.1";
const PORT = 3000;
const ORIGIN = `http://${HOST}:${PORT}`;

async function leerCuerpo(request) {
  let texto = "";
  for await (const trozo of request) {
    texto += trozo;
  }
  return texto;
}

function terminar(response, estado) {
  response.writeHead(estado);
  response.end();
}

async function atenderExecute(request, response) {
  if (request.method !== "POST") {
    terminar(response, 404);
    return;
  }

  // Otra web abierta en el navegador no puede llamar a /execute.
  const origen = request.headers.origin;
  if (origen !== undefined && origen !== ORIGIN) {
    terminar(response, 403);
    return;
  }

  // Solo JSON: obliga al navegador a pedir permiso (preflight) a otras webs,
  // y como no hay cabeceras CORS, ese permiso nunca se da.
  const tipo = request.headers["content-type"] ?? "";
  if (!tipo.startsWith("application/json")) {
    terminar(response, 415);
    return;
  }

  let resultado;
  try {
    const peticion = JSON.parse(await leerCuerpo(request));
    resultado = executeSql(peticion);
  } catch {
    resultado = null;
  }

  if (resultado === null) {
    terminar(response, 500);
    return;
  }

  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(resultado));
}

async function atender(request, response) {
  // Solo se responde a 127.0.0.1:3000. Protege del DNS rebinding.
  if (request.headers.host !== `${HOST}:${PORT}`) {
    terminar(response, 403);
    return;
  }

  const pathname = new URL(request.url, ORIGIN).pathname;

  if (pathname === "/execute") {
    await atenderExecute(request, response);
    return;
  }

  if (request.method !== "GET") {
    terminar(response, 404);
    return;
  }

  await serveFile(response, pathname);
}

db.exec(CREATE_USERS_TABLE);

const server = createServer((request, response) => {
  atender(request, response).catch(() => terminar(response, 500));
});

server.on("error", (motivo) => {
  if (motivo.code === "EADDRINUSE") {
    error(
      `El puerto ${PORT} ya está ocupado. Cierra la otra First App (Ctrl+C en su terminal) y vuelve a intentarlo.`,
    );
  } else {
    error(`No se ha podido iniciar First App en el puerto ${PORT}.`);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  log(`First App: ${ORIGIN}`);
});
