import { createServer } from "node:http";
import { error, log } from "node:console";
import { dirname, join } from "node:path";
import process from "node:process";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath, URL } from "node:url";

import { CREATE_USERS_TABLE } from "../queries/queries/create-users-table.js";

const HOST = "127.0.0.1";
const PORT = 3000;
const ORIGIN = `http://${HOST}:${PORT}`;

// La página se abre como fichero. Chrome la presenta como "file://" si se abre
// con --allow-file-access-from-files, y como "null" si no.
// La terminal y Jupyter no envían Origin.
const ORIGENES_PAGINA = ["file://", "null"];

const carpeta = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(join(carpeta, "users.sqlite"));

function ejecutarSql(peticion) {
  const method = peticion?.method;
  const sql = peticion?.sql;
  const params = peticion?.params ?? {};

  if (typeof sql !== "string") {
    return null;
  }

  if (method === "exec") {
    db.exec(sql);
    return { ok: true };
  }

  if (method === "get") {
    const fila = db.prepare(sql).get(params);
    return { row: fila ?? null };
  }

  if (method === "all") {
    const filas = db.prepare(sql).all(params);
    return { rows: filas };
  }

  if (method === "run") {
    const info = db.prepare(sql).run(params);
    return { changes: Number(info.changes) };
  }

  return null;
}

async function leerCuerpo(request) {
  let texto = "";
  for await (const trozo of request) {
    texto += trozo;
  }
  return texto;
}

function terminar(response, estado, cabeceras = {}) {
  response.writeHead(estado, cabeceras);
  response.end();
}

// Permiso CORS solo para la página local. Otra web no lo recibe nunca.
function cabecerasPagina(origen) {
  if (!ORIGENES_PAGINA.includes(origen)) {
    return {};
  }
  return { "Access-Control-Allow-Origin": origen, Vary: "Origin" };
}

function atenderPermiso(request, response) {
  const origen = request.headers.origin;
  if (!ORIGENES_PAGINA.includes(origen)) {
    terminar(response, 403);
    return;
  }

  const cabeceras = {
    ...cabecerasPagina(origen),
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "content-type",
  };
  // Chrome lo pide antes de dejar que un fichero llame a 127.0.0.1.
  if (request.headers["access-control-request-private-network"] === "true") {
    cabeceras["Access-Control-Allow-Private-Network"] = "true";
  }
  terminar(response, 204, cabeceras);
}

async function atenderExecute(request, response) {
  const origen = request.headers.origin;
  if (origen !== undefined && !ORIGENES_PAGINA.includes(origen)) {
    terminar(response, 403);
    return;
  }

  const cabeceras = cabecerasPagina(origen);

  // Solo JSON: así otra web no puede mandar una petición "simple" sin permiso.
  const tipo = request.headers["content-type"] ?? "";
  if (!tipo.startsWith("application/json")) {
    terminar(response, 415, cabeceras);
    return;
  }

  let resultado;
  try {
    const peticion = JSON.parse(await leerCuerpo(request));
    resultado = ejecutarSql(peticion);
  } catch {
    resultado = null;
  }

  if (resultado === null) {
    terminar(response, 500, cabeceras);
    return;
  }

  response.writeHead(200, {
    ...cabeceras,
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(resultado));
}

async function atender(request, response) {
  // Solo se responde a 127.0.0.1:3000. Protege del DNS rebinding.
  if (request.headers.host !== `${HOST}:${PORT}`) {
    terminar(response, 403);
    return;
  }

  const pathname = new URL(request.url, ORIGIN).pathname;
  if (pathname !== "/execute") {
    terminar(response, 404);
    return;
  }

  if (request.method === "OPTIONS") {
    atenderPermiso(request, response);
    return;
  }

  if (request.method === "POST") {
    await atenderExecute(request, response);
    return;
  }

  terminar(response, 404);
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
