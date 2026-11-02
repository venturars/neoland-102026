import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const ASSETS = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/styles.css": ["styles.css", "text/css; charset=utf-8"],
  "/app.js": ["app.js", "text/javascript; charset=utf-8"],
};
const FAILURES = {
  GET: "Could not find the user",
  PATCH: "Could not update the user",
  DELETE: "Could not delete the user",
};
const ERROR_STATUS = {
  "Name is empty": 400,
  "Email is invalid": 400,
  "Email is already used": 409,
  "User not found": 404,
};

export function createUserClientServer() {
  return createServer(async (request, response) => {
    let url;
    try {
      url = new URL(request.url, "http://localhost");
    } catch {
      response.writeHead(404);
      response.end();
      return;
    }
    const path = url.pathname;
    const asset = Object.hasOwn(ASSETS, path) ? ASSETS[path] : undefined;
    if (request.method === "GET" && asset) {
      try {
        const content = await readFile(
          new URL(`../web/${asset[0]}`, import.meta.url),
        );
        response.writeHead(200, { "Content-Type": asset[1] });
        response.end(content);
      } catch {
        response.writeHead(500);
        response.end();
      }
      return;
    }

    const isList = path === "/api/users" && request.method === "GET";
    const match = path.match(/^\/api\/users\/([^/]+)$/);
    const failure = isList
      ? "Could not list the users"
      : FAILURES[request.method];
    if (!isList && (!match || !failure)) {
      response.writeHead(404);
      response.end();
      return;
    }

    try {
      let result;
      if (isList) {
        result = listUsers();
      } else {
        const id = Number(match[1]);
        if (!/^\d+$/.test(match[1]) || !Number.isSafeInteger(id) || id < 1) {
          throw new Error("User not found");
        }
        if (request.method === "GET") {
          result = findUserById(id);
        }
        if (request.method === "PATCH") {
          let changes;
          try {
            request.setEncoding("utf8");
            let body = "";
            for await (const chunk of request) {
              body += chunk;
            }
            changes = JSON.parse(body);
            if (
              changes === null ||
              Array.isArray(changes) ||
              typeof changes !== "object" ||
              Object.keys(changes).some(
                (key) => !["name", "email"].includes(key),
              ) ||
              Object.values(changes).some((value) => typeof value !== "string")
            ) {
              throw new Error(failure);
            }
          } catch {
            response.writeHead(400, {
              "Content-Type": "text/plain; charset=utf-8",
            });
            response.end(failure);
            return;
          }
          result = updateUser(id, changes);
        }
        if (request.method === "DELETE") {
          deleteUser(id);
          response.writeHead(204);
          response.end();
          return;
        }
      }
      response.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify(result));
    } catch (error) {
      const status = ERROR_STATUS[error.message] ?? 500;
      response.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end(status === 500 ? failure : error.message);
    }
  });
}
