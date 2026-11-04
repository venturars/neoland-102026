import Fastify from "fastify";
import { createUser } from "../../logic/create-user.js";
import { deleteUser } from "../../logic/delete-user.js";
import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../../logic/errors.js";
import { findUserById } from "../../logic/find-user-by-id.js";
import { listUsers } from "../../logic/list-users.js";
import { updateUser } from "../../logic/update-user.js";

const HOST = "127.0.0.1";
const ORIGIN = "http://127.0.0.1";
const PORT = 3002;

const app = Fastify();

function parseUserId(rawId) {
  const hasOnlyDigits = /^[1-9][0-9]*$/.test(rawId);

  if (!hasOnlyDigits) {
    throw new ValidationError("Id is invalid");
  }

  const id = Number(rawId);

  if (!Number.isSafeInteger(id)) {
    throw new ValidationError("Id is invalid");
  }

  return id;
}

function checkBody(body) {
  if (body === undefined) {
    throw new ValidationError("Body is invalid");
  }

  if (body === null) {
    throw new ValidationError("Body is invalid");
  }

  if (typeof body !== "object") {
    throw new ValidationError("Body is invalid");
  }
}

app.get("/users", async () => {
  const users = await listUsers();

  return users;
});

app.get("/users/:id", async (request) => {
  const id = parseUserId(request.params.id);
  const user = await findUserById(id);

  return user;
});

app.post("/users", async (request, reply) => {
  checkBody(request.body);

  const name = request.body.name;
  const email = request.body.email;
  const user = await createUser({ name, email });

  reply.status(201);

  return user;
});

app.patch("/users/:id", async (request) => {
  const id = parseUserId(request.params.id);

  checkBody(request.body);

  const name = request.body.name;
  const email = request.body.email;
  const user = await updateUser({ id, name, email });

  return user;
});

app.delete("/users/:id", async (request) => {
  const id = parseUserId(request.params.id);
  const user = await deleteUser(id);

  return user;
});

app.setErrorHandler((error, request, reply) => {
  if (error.code === "FST_ERR_CTP_INVALID_JSON_BODY") {
    reply.status(400).send({ error: "Body is invalid" });

    return;
  }

  if (error instanceof ValidationError) {
    reply.status(400).send({ error: error.message });

    return;
  }

  if (error instanceof NotFoundError) {
    reply.status(404).send({ error: error.message });

    return;
  }

  if (error instanceof ConflictError) {
    reply.status(409).send({ error: error.message });

    return;
  }

  if (error instanceof DatabaseError) {
    reply.status(500).send({ error: error.message });

    return;
  }

  reply.status(500).send({ error: "Internal error" });
});

await app.listen({ port: PORT, host: HOST });

console.log(`HTTP server listening on ${ORIGIN}:${PORT}`);
