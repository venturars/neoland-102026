/* global console, URL */
import { createServer } from "node:http";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const ORIGIN = "http://127.0.0.1:3004";
const NAME_IS_REQUIRED = "Name is required";
const NAME_IS_TOO_LONG = "Name must be at most 100 characters";
const EMAIL_IS_REQUIRED = "Email is required";
const EMAIL_IS_NOT_VALID = "Email is not valid";
const ID_IS_INVALID = "User id must be a positive integer";
const UPDATE_NEEDS_A_FIELD = "Provide a name or an email to update";
const WAS_NOT_FOUND = "was not found";
const UNIQUE_CONSTRAINT = "UNIQUE constraint";

const originUrl = new URL(ORIGIN);
const port = Number(originUrl.port);
const hostname = originUrl.hostname;

function send(response, status, body) {
  if (body === undefined) {
    response.writeHead(status);
    response.end();
    return;
  }

  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}

function sendError(response, error) {
  if (error instanceof SyntaxError) {
    send(response, 400, { message: error.message });
    return;
  }

  if (!(error instanceof Error)) {
    send(response, 500, { message: String(error) });
    return;
  }

  const message = error.message;

  if (
    message === NAME_IS_REQUIRED ||
    message === NAME_IS_TOO_LONG ||
    message === EMAIL_IS_REQUIRED ||
    message === EMAIL_IS_NOT_VALID ||
    message === ID_IS_INVALID ||
    message === UPDATE_NEEDS_A_FIELD
  ) {
    send(response, 400, { message });
    return;
  }

  if (message.endsWith(WAS_NOT_FOUND)) {
    send(response, 404, { message });
    return;
  }

  if (message.includes(UNIQUE_CONSTRAINT)) {
    send(response, 409, { message });
    return;
  }

  send(response, 500, { message });
}

function userIdFrom(pathname) {
  const match = pathname.match(/^\/users\/([^/]+)$/);

  if (match === null) {
    return undefined;
  }

  return match[1];
}

function bodyFrom(raw) {
  return JSON.parse(raw || "{}") ?? {};
}

async function handle(response, method, pathname, raw) {
  try {
    if (method === "POST" && pathname === "/users") {
      const body = bodyFrom(raw);
      const user = await createUser({ name: body.name, email: body.email });
      send(response, 201, user);
      return;
    }

    if (method === "GET" && pathname === "/users") {
      const users = await listUsers();
      send(response, 200, users);
      return;
    }

    const id = userIdFrom(pathname);

    if (method === "GET" && id !== undefined) {
      const user = await findUserById(id);
      send(response, 200, user);
      return;
    }

    if (method === "PATCH" && id !== undefined) {
      const body = bodyFrom(raw);
      const changes = {};

      if (body.name !== undefined) {
        changes.name = body.name;
      }

      if (body.email !== undefined) {
        changes.email = body.email;
      }

      const user = await updateUser(id, changes);
      send(response, 200, user);
      return;
    }

    if (method === "DELETE" && id !== undefined) {
      await deleteUser(id);
      send(response, 204);
      return;
    }

    send(response, 404);
  } catch (error) {
    sendError(response, error);
  }
}

const server = createServer((request, response) => {
  let pathname;

  try {
    pathname = new URL(request.url, ORIGIN).pathname;
  } catch (error) {
    send(response, 400, {
      message: error instanceof Error ? error.message : String(error),
    });
    return;
  }

  const method = request.method;
  const needsBody = method === "POST" || method === "PATCH";

  if (!needsBody) {
    void handle(response, method, pathname, undefined);
    return;
  }

  let raw = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => {
    raw += chunk;
  });
  request.on("end", () => {
    void handle(response, method, pathname, raw);
  });
});

server.listen(port, hostname, () => {
  console.log(ORIGIN);
});
