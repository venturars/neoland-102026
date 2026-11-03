// Cliente de navegador: sirve las pantallas de public/ y llama a las funciones de logic/.
// No valida nada: el resultado o el mensaje del error salen tal cual de logic/.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const HOST = "127.0.0.1";
const PORT = 3000;

// Los únicos ficheros que se sirven, con su tipo de contenido.
const PUBLIC_FILES = {
  "/": { fileName: "index.html", contentType: "text/html; charset=utf-8" },
  "/styles.css": {
    fileName: "styles.css",
    contentType: "text/css; charset=utf-8",
  },
  "/app.js": {
    fileName: "app.js",
    contentType: "text/javascript; charset=utf-8",
  },
};

// Las rutas de un usuario tienen la forma /users/<id>.
const USER_PATH_PREFIX = "/users/";

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(data));
}

function sendNotFound(response) {
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found.");
}

async function sendFile(response, fileName, contentType) {
  const fileUrl = new URL("./public/" + fileName, import.meta.url);
  const content = await readFile(fileUrl);
  response.writeHead(200, { "Content-Type": contentType });
  response.end(content);
}

// Junta los trozos del cuerpo de la petición y devuelve el JSON.
async function readBody(request) {
  let text = "";
  for await (const chunk of request) {
    text = text + chunk;
  }
  if (text === "") {
    return {};
  }
  return JSON.parse(text);
}

async function handleRequest(request, response) {
  const url = new URL(request.url, "http://" + HOST + ":" + PORT);
  const path = url.pathname;
  const method = request.method;

  try {
    if (method === "GET") {
      const publicFile = PUBLIC_FILES[path];
      if (publicFile) {
        await sendFile(response, publicFile.fileName, publicFile.contentType);
        return;
      }
    }

    if (method === "GET" && path === "/users") {
      const users = listUsers();
      sendJson(response, 200, users);
      return;
    }

    if (path.startsWith(USER_PATH_PREFIX)) {
      // El id llega como texto; lo valida logic/, igual que desde la terminal.
      const id = path.slice(USER_PATH_PREFIX.length);

      if (method === "PUT") {
        const body = await readBody(request);
        const user = updateUser(id, body.name, body.email);
        sendJson(response, 200, user);
        return;
      }

      if (method === "DELETE") {
        const deletedId = deleteUser(id);
        sendJson(response, 200, { id: deletedId });
        return;
      }
    }

    sendNotFound(response);
  } catch (error) {
    sendJson(response, 400, { error: error.message });
  }
}

const server = createServer(handleRequest);
server.listen(PORT, HOST, function () {
  console.log("Browser client: http://" + HOST + ":" + PORT);
});
