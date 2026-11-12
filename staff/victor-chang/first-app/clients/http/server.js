import { createServer } from "node:http";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import { getUser } from "../../logic/get-user.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const HOST = "127.0.0.1";
const PORT = 3000;
const ORIGIN = `http://${HOST}:${PORT}`;
const USERS_PATH = "/users";
const USER_PATH = /^\/users\/([^/]+)$/;
const INVALID_BODY = "Request body is not valid JSON.";
const STATUS_BY_CODE = {
  VALIDATION: 400,
  DUPLICATE: 409,
  NOT_FOUND: 404,
  SYSTEM: 500,
};

function send(response, status, value) {
  if (value === undefined) {
    response.writeHead(status);
    response.end();
    return;
  }
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(value));
}

// A text id is not turned into a number: no user has it, so logic/ answers "User not found"
function readId(text) {
  if (/^\d+$/.test(text)) {
    return Number(text);
  }
  return text;
}

// null when the body is not JSON
async function readUser(request) {
  request.setEncoding("utf8");
  let text = "";
  for await (const chunk of request) {
    text += chunk;
  }
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { name: undefined, email: undefined };
  }
  return { name: body.name, email: body.email };
}

async function answer(request, response) {
  const path = new URL(request.url, ORIGIN).pathname;
  const method = request.method;

  if (path === USERS_PATH) {
    if (method === "GET") {
      send(response, 200, listUsers());
      return;
    }
    if (method === "POST") {
      const user = await readUser(request);
      if (!user) {
        send(response, 400, { message: INVALID_BODY });
        return;
      }
      send(response, 201, createUser(user.name, user.email));
      return;
    }
  }

  const match = USER_PATH.exec(path);
  if (match) {
    const id = readId(match[1]);
    if (method === "GET") {
      send(response, 200, getUser(id));
      return;
    }
    if (method === "PUT") {
      const user = await readUser(request);
      if (!user) {
        send(response, 400, { message: INVALID_BODY });
        return;
      }
      send(response, 200, updateUser(id, user.name, user.email));
      return;
    }
    if (method === "DELETE") {
      deleteUser(id);
      send(response, 204);
      return;
    }
  }

  send(response, 404);
}

async function handle(request, response) {
  try {
    await answer(request, response);
  } catch (error) {
    const status = STATUS_BY_CODE[error.code];
    if (status) {
      send(response, status, { message: error.message });
      return;
    }
    console.error(error);
    send(response, 500);
  }
}

const server = createServer(handle);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(PORT, HOST, () => {
  console.log(ORIGIN);
});
