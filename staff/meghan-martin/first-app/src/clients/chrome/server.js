// Calls the people rules and answers JSON for the Chrome extension.
// It does not decide if a name or an email is valid.

import Fastify from "fastify";
import { listUsers } from "../../logic/list-users.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { createUser } from "../../logic/create-user.js";
import { updateUser } from "../../logic/update-user.js";
import { deleteUser } from "../../logic/delete-user.js";

const HOST = "127.0.0.1";
const PORT = 3002;

const BAD_REQUEST = new Set([
  "Name is empty",
  "Email is invalid",
  "Invalid id",
]);
const DATABASE_STOPPED = "Database is not running. Start it with npm run db.";

function readId(value) {
  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error("Invalid id");
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    throw new Error("Invalid id");
  }
  return id;
}

function readBody(request) {
  if (request.body) {
    return request.body;
  }
  return {};
}

function statusFor(message) {
  if (BAD_REQUEST.has(message)) {
    return 400;
  }
  if (message === "User not found") {
    return 404;
  }
  if (message === "Email is already used") {
    return 409;
  }
  if (message === DATABASE_STOPPED) {
    return 503;
  }
  return 500;
}

function sendError(reply, error) {
  reply.code(statusFor(error.message));
  reply.send({ error: error.message });
}

const app = Fastify();

app.setErrorHandler(function (error, request, reply) {
  if (String(error.code).startsWith("FST_ERR_CTP_INVALID_JSON")) {
    reply.code(400);
    reply.send({ error: "Invalid request." });
    return;
  }
  reply.send(error);
});

app.get("/users", async function (request, reply) {
  try {
    reply.send(await listUsers());
  } catch (error) {
    sendError(reply, error);
  }
});

app.get("/users/:id", async function (request, reply) {
  try {
    reply.send(await findUserById(readId(request.params.id)));
  } catch (error) {
    sendError(reply, error);
  }
});

app.post("/users", async function (request, reply) {
  try {
    const body = readBody(request);
    const user = await createUser({ name: body.name, email: body.email });
    reply.code(201);
    reply.send(user);
  } catch (error) {
    sendError(reply, error);
  }
});

app.patch("/users/:id", async function (request, reply) {
  try {
    const body = readBody(request);
    const changes = {};
    if (body.name !== undefined) {
      changes.name = body.name;
    }
    if (body.email !== undefined) {
      changes.email = body.email;
    }
    const user = await updateUser(readId(request.params.id), changes);
    reply.send(user);
  } catch (error) {
    sendError(reply, error);
  }
});

app.delete("/users/:id", async function (request, reply) {
  try {
    const id = readId(request.params.id);
    await deleteUser(id);
    reply.send({ id });
  } catch (error) {
    sendError(reply, error);
  }
});

app.setNotFoundHandler(function (request, reply) {
  reply.code(404);
  reply.send({ error: "Not found." });
});

await app.listen({ port: PORT, host: HOST });
console.log("Chrome API: http://" + HOST + ":" + PORT);
