import { createServer } from "node:http";
import { createUser } from "../../logic/create-user.js";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const HOST = "127.0.0.1";
const PORT = 3004;
const ORIGIN = `http://${HOST}:${PORT}`;
const JSON_HEADERS = { "content-type": "application/json" };

const server = createServer(async (request, response) => {
  const url = new URL(request.url, ORIGIN);
  const path = url.pathname;
  const method = request.method;
  const match = /^\/users\/([^/]+)$/.exec(path);
  let action;
  const usersPath = path === "/users";
  const post = method === "POST";
  const get = method === "GET";
  const patch = method === "PATCH";
  const remove = method === "DELETE";
  if (usersPath && post) {
    action = "create";
  }
  if (usersPath && get) {
    action = "list";
  }
  if (match && get) {
    action = "find";
  }
  if (match && patch) {
    action = "update";
  }
  if (match && remove) {
    action = "delete";
  }
  if (!action) {
    response.writeHead(404);
    response.end();
    return;
  }

  const failures = {
    create: "Could not create the user",
    list: "Could not list the users",
    find: "Could not find the user",
    update: "Could not update the user",
    delete: "Could not delete the user",
  };
  try {
    let body;
    if (action === "create" || action === "update") {
      let raw = "";
      request.setEncoding("utf8");
      for await (const chunk of request) {
        raw += chunk;
      }
      try {
        body = JSON.parse(raw);
      } catch {
        const message = failures[action];
        const payload = { message };
        response.writeHead(500, JSON_HEADERS);
        response.end(JSON.stringify(payload));
        return;
      }
    }
    const id = match ? Number(match[1]) : undefined;
    if (action === "create") {
      const name = body.name;
      const email = body.email;
      const user = await createUser({ name, email });
      response.writeHead(201, JSON_HEADERS);
      response.end(JSON.stringify(user));
      return;
    }
    if (action === "list") {
      const users = await listUsers();
      response.writeHead(200, JSON_HEADERS);
      response.end(JSON.stringify(users));
      return;
    }
    if (action === "find") {
      const user = await findUserById(id);
      response.writeHead(200, JSON_HEADERS);
      response.end(JSON.stringify(user));
      return;
    }
    if (action === "update") {
      const changes = {};
      if (body.name !== undefined) {
        changes.name = body.name;
      }
      if (body.email !== undefined) {
        changes.email = body.email;
      }
      const user = await updateUser(id, changes);
      response.writeHead(200, JSON_HEADERS);
      response.end(JSON.stringify(user));
      return;
    }
    await deleteUser(id);
    response.writeHead(204);
    response.end();
  } catch (error) {
    const statuses = {
      "Name is empty": 400,
      "Email is invalid": 400,
      "Email is already used": 409,
      "User not found": 404,
    };
    const errorMessage = error instanceof Error ? error.message : undefined;
    const status = statuses[errorMessage] || 500;
    const message = status === 500 ? failures[action] : errorMessage;
    const payload = { message };
    response.writeHead(status, JSON_HEADERS);
    response.end(JSON.stringify(payload));
  }
});
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(PORT, HOST, () => {
  console.log(ORIGIN);
});
