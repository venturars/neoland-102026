import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const MAX_BODY_BYTES = 8192;
const ASSETS = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/main.js", ["main.js", "text/javascript; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
]);
const BUSINESS_ERRORS = new Map([
  ["User not found", 404],
  ["Name is empty", 400],
  ["Email is empty", 400],
  ["Email is invalid", 400],
  ["Email is already used", 409],
]);

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(data));
}

async function readChanges(request, response) {
  const contentType = request.headers["content-type"]?.split(";")[0];
  if (contentType !== "application/json") {
    sendJson(response, 415, { error: "Use application/json" });
    return;
  }
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      sendJson(response, 413, { error: "Request body is too large" });
      request.resume();
      return;
    }
    chunks.push(chunk);
  }
  let changes;
  try {
    const body = Buffer.concat(chunks).toString("utf8");
    changes = JSON.parse(body);
  } catch {
    sendJson(response, 400, { error: "Invalid JSON" });
    return;
  }
  const isObject =
    changes !== null && typeof changes === "object" && !Array.isArray(changes);
  if (!isObject) {
    sendJson(response, 400, { error: "Expected an object with name or email" });
    return;
  }
  const validFields = Object.keys(changes).every(
    (key) =>
      (key === "name" || key === "email") && typeof changes[key] === "string",
  );
  if (!validFields) {
    sendJson(response, 400, {
      error: "Only string name and email fields are accepted",
    });
    return;
  }
  return changes;
}

export function createWebServer() {
  return createServer(async (request, response) => {
    try {
      const port = request.socket.localPort;
      const validHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
      if (!validHosts.includes(request.headers.host)) {
        sendJson(response, 403, { error: "Host is not allowed" });
        return;
      }
      const url = new URL(request.url, "http://localhost");
      const path = url.pathname;
      const method = request.method;
      const isMutation = method === "PATCH" || method === "DELETE";
      if (isMutation && request.headers.origin) {
        const expectedOrigin = `http://${request.headers.host}`;
        if (request.headers.origin !== expectedOrigin) {
          sendJson(response, 403, { error: "Origin is not allowed" });
          return;
        }
      }
      if (path === "/api/users") {
        if (method !== "GET") {
          response.setHeader("Allow", "GET");
          sendJson(response, 405, { error: "Method not allowed" });
          return;
        }
        sendJson(response, 200, listUsers());
        return;
      }
      const userRoute = path.match(/^\/api\/users\/(\d+)$/);
      if (userRoute) {
        const id = Number(userRoute[1]);
        const validId = Number.isSafeInteger(id) && id > 0;
        if (!validId) {
          sendJson(response, 400, {
            error: "ID must be a positive safe integer",
          });
          return;
        }
        if (method === "GET") {
          sendJson(response, 200, findUserById(id));
        } else if (method === "PATCH") {
          const changes = await readChanges(request, response);
          if (changes !== undefined)
            sendJson(response, 200, updateUser(id, changes));
        } else if (method === "DELETE") {
          deleteUser(id);
          response.writeHead(204, { "Cache-Control": "no-store" });
          response.end();
        } else {
          response.setHeader("Allow", "GET, PATCH, DELETE");
          sendJson(response, 405, { error: "Method not allowed" });
        }
        return;
      }
      const asset = ASSETS.get(path);
      if (!asset) {
        sendJson(response, 404, { error: "Not found" });
        return;
      }
      if (method !== "GET") {
        response.setHeader("Allow", "GET");
        sendJson(response, 405, { error: "Method not allowed" });
        return;
      }
      const [filename, contentType] = asset;
      const file = new URL(`../web/${filename}`, import.meta.url);
      const content = await readFile(file);
      response.writeHead(200, {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
        "Content-Security-Policy":
          "default-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      });
      response.end(content);
    } catch (error) {
      if (response.writableEnded) return;
      const status = BUSINESS_ERRORS.get(error.message);
      if (status) sendJson(response, status, { error: error.message });
      else sendJson(response, 500, { error: "Could not complete the request" });
    }
  });
}
