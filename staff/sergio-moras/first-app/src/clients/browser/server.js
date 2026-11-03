// Cliente de navegador: sirve las pantallas de public/ y los módulos de logic/ y queries/ que importan.
// No llama a logic/: lo hace el propio navegador desde app.js.
// Hace falta porque el navegador no carga módulos desde file://.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const HOST = "127.0.0.1";
const PORT = 3000;

const HTML = "text/html; charset=utf-8";
const CSS = "text/css; charset=utf-8";
const JAVASCRIPT = "text/javascript; charset=utf-8";

// Los únicos ficheros que se sirven. Las rutas son las de src/, para que los
// import relativos funcionen igual en el navegador y en el disco.
const SERVED_FILES = {
  "/": { filePath: "clients/browser/public/index.html", contentType: HTML },
  "/clients/browser/public/styles.css": {
    filePath: "clients/browser/public/styles.css",
    contentType: CSS,
  },
  "/clients/browser/public/app.js": {
    filePath: "clients/browser/public/app.js",
    contentType: JAVASCRIPT,
  },
  "/logic/list-users.js": {
    filePath: "logic/list-users.js",
    contentType: JAVASCRIPT,
  },
  "/logic/update-user.js": {
    filePath: "logic/update-user.js",
    contentType: JAVASCRIPT,
  },
  "/logic/delete-user.js": {
    filePath: "logic/delete-user.js",
    contentType: JAVASCRIPT,
  },
  "/queries/users.js": {
    filePath: "queries/users.js",
    contentType: JAVASCRIPT,
  },
};

function sendNotFound(response) {
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found.");
}

async function sendFile(response, servedFile) {
  // Este fichero está en src/clients/browser/, así que src/ queda dos carpetas más arriba.
  const fileUrl = new URL("../../" + servedFile.filePath, import.meta.url);
  const content = await readFile(fileUrl);
  response.writeHead(200, { "Content-Type": servedFile.contentType });
  response.end(content);
}

async function handleRequest(request, response) {
  const url = new URL(request.url, "http://" + HOST + ":" + PORT);
  const path = url.pathname;

  // Object.hasOwn evita que nombres heredados, como "/toString", cuenten como fichero.
  const isServedFile = Object.hasOwn(SERVED_FILES, path);
  if (request.method !== "GET" || !isServedFile) {
    sendNotFound(response);
    return;
  }

  try {
    await sendFile(response, SERVED_FILES[path]);
  } catch {
    sendNotFound(response);
  }
}

const server = createServer(handleRequest);
server.listen(PORT, HOST, function () {
  console.log("Browser client: http://" + HOST + ":" + PORT);
});
